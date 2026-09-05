import type { SupabaseClient } from "@supabase/supabase-js";

import { addDays, type DayRange } from "@/lib/backoffice/dates";
import type { Locale } from "@/lib/i18n/config";
import {
  allQuestions,
  OTHER_VALUE,
  surveySteps,
  type SurveyQuestion,
} from "@/lib/survey/questions";

/**
 * Pembacaan dan rekap jawaban survei.
 *
 * Rekapnya dihitung di sini, bukan di SQL seperti rekap kunjungan: jumlah
 * jawaban survei terhitung ratusan, sekali tarik langsung habis, dan halaman
 * "per orang" toh membutuhkan baris utuhnya. Yang perlu dijaga cuma satu:
 * PostgREST memotong hasil di 1.000 baris, jadi pengambilannya dihalaman
 * (lihat `fetchResponses`).
 */

export type SurveyRow = {
  id: string;
  created_at: string;
  locale: Locale;
} & Record<string, unknown>;

/** Backoffice berbahasa Indonesia; label opsi diambil dari sisi `id`. */
const LABEL_LOCALE: Locale = "id";

const PAGE_SIZE = 1000;
const MAX_PAGES = 20;

/**
 * Di bawah jumlah ini persentase disembunyikan, dan yang tampil cuma angka
 * aslinya. "50%" dari empat jawaban terbaca seperti kecenderungan, padahal
 * itu dua orang — dan angka seperti itulah yang paling gampang terlanjur
 * masuk laporan. Sepuluh bukan ambang statistik yang sakral, cuma titik
 * paling awal di mana persen mulai lebih menerangkan daripada menyesatkan.
 */
export const MIN_FOR_PERCENT = 10;

export type ResponsesResult = {
  rows: SurveyRow[];
  /** Benar kalau jawabannya lebih banyak dari yang berani ditarik sekaligus. */
  truncated: boolean;
};

export async function fetchResponses(
  supabase: SupabaseClient,
): Promise<ResponsesResult> {
  const rows: SurveyRow[] = [];

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const from = page * PAGE_SIZE;
    const { data, error } = await supabase
      .from("survey_responses")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, from + PAGE_SIZE - 1);

    if (error) throw new Error(`survey_responses: ${error.message}`);

    const batch = (data ?? []) as SurveyRow[];
    rows.push(...batch);
    if (batch.length < PAGE_SIZE) return { rows, truncated: false };
  }

  return { rows, truncated: true };
}

/**
 * Jumlah jawaban tanpa menarik isinya. `head: true` membuat PostgREST cuma
 * mengembalikan angka di header — jadi menghitung 5.000 jawaban semurah
 * menghitung lima.
 *
 * Batas tanggalnya ditulis dengan offset +08:00, bukan UTC, supaya potongan
 * harinya sama persis dengan rekap kunjungan yang memakai waktu WITA.
 */
export async function countResponses(
  supabase: SupabaseClient,
  range?: DayRange,
): Promise<number> {
  let query = supabase
    .from("survey_responses")
    .select("id", { count: "exact", head: true });

  if (range) {
    query = query
      .gte("created_at", `${range.from}T00:00:00+08:00`)
      .lt("created_at", `${addDays(range.to, 1)}T00:00:00+08:00`);
  }

  const { count, error } = await query;
  if (error) throw new Error(`survey_responses: ${error.message}`);
  return count ?? 0;
}

export async function fetchResponse(
  supabase: SupabaseClient,
  id: string,
): Promise<SurveyRow | null> {
  const { data, error } = await supabase
    .from("survey_responses")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`survey_responses: ${error.message}`);
  return (data as SurveyRow | null) ?? null;
}

// ── Rekap per pertanyaan ────────────────────────────────────────────────────

export type OptionCount = { value: string; label: string; count: number };

export type ChoiceSummary = {
  kind: "choice";
  question: SurveyQuestion;
  answered: number;
  options: OptionCount[];
  /** Isian bebas di balik opsi "Lainnya", supaya tidak hilang jadi satu angka. */
  otherTexts: string[];
};

export type ScaleSummary = {
  kind: "scale";
  question: SurveyQuestion;
  answered: number;
  average: number;
  counts: OptionCount[];
};

export type NumberSummary = {
  kind: "number";
  question: SurveyQuestion;
  answered: number;
  average: number;
  lowest: number;
  highest: number;
  buckets: OptionCount[];
};

export type TextSummary = {
  kind: "text";
  question: SurveyQuestion;
  answered: number;
  answers: { id: string; name: string; text: string }[];
};

export type QuestionSummary =
  | ChoiceSummary
  | ScaleSummary
  | NumberSummary
  | TextSummary;

export type StepSummary = {
  id: string;
  title: string;
  questions: QuestionSummary[];
};

/** Rekap dikelompokkan mengikuti langkah survei, supaya urutannya sama dengan
 *  yang dilihat pengisi. */
export function summarizeBySteps(rows: SurveyRow[]): StepSummary[] {
  return surveySteps.map((step) => ({
    id: step.id,
    title: step.title[LABEL_LOCALE],
    questions: step.questions.map((question) => summarize(question, rows)),
  }));
}

export function summarize(
  question: SurveyQuestion,
  rows: SurveyRow[],
): QuestionSummary {
  switch (question.type) {
    case "radio":
    case "checkbox":
      return summarizeChoice(question, rows);
    case "scale":
      return summarizeScale(question, rows);
    case "number":
      return summarizeNumber(question, rows);
    default:
      return summarizeText(question, rows);
  }
}

function summarizeChoice(
  question: SurveyQuestion,
  rows: SurveyRow[],
): ChoiceSummary {
  const counts = new Map<string, number>();
  const otherTexts: string[] = [];
  let answered = 0;

  for (const row of rows) {
    const picked = toValues(row[question.id]);
    if (picked.length > 0) answered += 1;
    for (const value of picked) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    const other = asText(row[`${question.id}_other`]);
    if (other) otherTexts.push(other);
  }

  // Urutannya mengikuti urutan opsi di survei, bukan besar-kecil angkanya:
  // skala "tidak pernah → hampir tiap hari" jadi tidak terbaca acak.
  const options: OptionCount[] = (question.options ?? []).map((option) => ({
    value: option.value,
    label: option.label[LABEL_LOCALE],
    count: counts.get(option.value) ?? 0,
  }));

  if (question.other) {
    options.push({
      value: OTHER_VALUE,
      label: "Lainnya",
      count: counts.get(OTHER_VALUE) ?? 0,
    });
  }

  // Jawaban lama yang opsinya sudah dihapus tetap ditampilkan — kalau tidak,
  // jumlah baris tidak akan pernah cocok dengan jumlah jawaban.
  for (const [value, count] of counts) {
    if (!options.some((option) => option.value === value)) {
      options.push({ value, label: value, count });
    }
  }

  return { kind: "choice", question, answered, options, otherTexts };
}

function summarizeScale(
  question: SurveyQuestion,
  rows: SurveyRow[],
): ScaleSummary {
  const { min = 1, max = 5 } = question.scale ?? {};
  const counts = new Map<number, number>();
  let total = 0;
  let answered = 0;

  for (const row of rows) {
    const value = asNumber(row[question.id]);
    if (value === null) continue;
    answered += 1;
    total += value;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  const scalePoints: OptionCount[] = [];
  for (let value = min; value <= max; value += 1) {
    scalePoints.push({
      value: String(value),
      label: scaleLabel(question, value, min, max),
      count: counts.get(value) ?? 0,
    });
  }

  return {
    kind: "scale",
    question,
    answered,
    average: answered === 0 ? 0 : total / answered,
    counts: scalePoints,
  };
}

function scaleLabel(
  question: SurveyQuestion,
  value: number,
  min: number,
  max: number,
): string {
  const scale = question.scale;
  if (!scale) return String(value);
  if (value === min) return `${value} — ${scale.minLabel[LABEL_LOCALE]}`;
  if (value === max) return `${value} — ${scale.maxLabel[LABEL_LOCALE]}`;
  return String(value);
}

function summarizeNumber(
  question: SurveyQuestion,
  rows: SurveyRow[],
): NumberSummary {
  const values: number[] = [];
  for (const row of rows) {
    const value = asNumber(row[question.id]);
    if (value !== null) values.push(value);
  }

  if (values.length === 0) {
    return {
      kind: "number",
      question,
      answered: 0,
      average: 0,
      lowest: 0,
      highest: 0,
      buckets: [],
    };
  }

  const lowest = Math.min(...values);
  const highest = Math.max(...values);
  const total = values.reduce((sum, value) => sum + value, 0);

  // Dikelompokkan per sepuluh. Untuk umur ini jatuh persis di kelompok yang
  // biasa dipakai (15–24, 25–34), dan untuk angka lain tetap masuk akal.
  const step = 10;
  const start = Math.floor(lowest / step) * step;
  const buckets: OptionCount[] = [];
  for (let edge = start; edge <= highest; edge += step) {
    const count = values.filter(
      (value) => value >= edge && value < edge + step,
    ).length;
    buckets.push({
      value: String(edge),
      label: `${edge}–${edge + step - 1}`,
      count,
    });
  }

  return {
    kind: "number",
    question,
    answered: values.length,
    average: total / values.length,
    lowest,
    highest,
    buckets,
  };
}

function summarizeText(
  question: SurveyQuestion,
  rows: SurveyRow[],
): TextSummary {
  const answers: TextSummary["answers"] = [];

  for (const row of rows) {
    const text = asText(row[question.id]);
    if (!text) continue;
    answers.push({
      id: row.id,
      name: asText(row.name) ?? "Tanpa nama",
      text,
    });
  }

  return { kind: "text", question, answered: answers.length, answers };
}

// ── Membaca satu jawaban ────────────────────────────────────────────────────

export type AnswerLine = {
  question: SurveyQuestion;
  label: string;
  /** Sudah jadi kalimat siap baca; kosong berarti pertanyaannya dilewati. */
  value: string;
};

export function readAnswers(row: SurveyRow): AnswerLine[] {
  return allQuestions.map((question) => ({
    question,
    label: question.label[LABEL_LOCALE],
    value: describeAnswer(question, row),
  }));
}

export function describeAnswer(
  question: SurveyQuestion,
  row: SurveyRow,
): string {
  const raw = row[question.id];
  const other = asText(row[`${question.id}_other`]);

  if (question.type === "radio" || question.type === "checkbox") {
    const labels = toValues(raw).map((value) =>
      value === OTHER_VALUE
        ? `Lainnya: ${other ?? "—"}`
        : (question.options?.find((option) => option.value === value)?.label[
            LABEL_LOCALE
          ] ?? value),
    );
    return labels.join(", ");
  }

  if (question.type === "scale" || question.type === "number") {
    const value = asNumber(raw);
    return value === null ? "" : String(value);
  }

  return asText(raw) ?? "";
}

// ── Bantuan kecil ───────────────────────────────────────────────────────────

function toValues(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((v): v is string => typeof v === "string");
  if (typeof raw === "string" && raw !== "") return [raw];
  return [];
}

function asText(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  return trimmed === "" ? null : trimmed;
}

function asNumber(raw: unknown): number | null {
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw === "string" && raw.trim() !== "") {
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}
