/**
 * Validasi jawaban survei — dipakai dua kali: di browser saat pengisi menekan
 * "Lanjut", dan lagi di server sebelum menyentuh database. Aturannya sengaja
 * satu file supaya keduanya tidak bisa berbeda; validasi browser hanya soal
 * kenyamanan, yang menentukan tetap yang di server.
 */

import type { Locale } from "@/lib/i18n/config";
import {
  allQuestions,
  OTHER_VALUE,
  type Bilingual,
  type SurveyQuestion,
  type SurveyStep,
} from "@/lib/survey/questions";

/** Nilai satu pertanyaan: pilihan ganda jadi array, sisanya string. */
export type AnswerValue = string | string[];

/**
 * Isian form apa adanya. Kunci "lainnya" disimpan sebagai `${id}_other`,
 * sama dengan nama kolomnya di database.
 */
export type SurveyDraft = Record<string, AnswerValue>;

export type ErrorCode =
  | "required"
  | "not_a_number"
  | "out_of_range"
  | "too_long"
  | "other_required"
  | "consent";

export const errorMessages: Record<ErrorCode, Bilingual> = {
  required: {
    id: "Pertanyaan ini perlu diisi dulu.",
    en: "This one needs an answer.",
  },
  not_a_number: {
    id: "Isi dengan angka saja, misalnya 17.",
    en: "Numbers only, for example 17.",
  },
  out_of_range: {
    id: "Sepertinya angkanya keliru — coba cek lagi.",
    en: "That number looks off — mind checking it?",
  },
  too_long: {
    id: "Jawabannya kepanjangan, coba dipersingkat.",
    en: "That is a bit too long — could you trim it?",
  },
  other_required: {
    id: "Tuliskan dulu “lainnya” yang kamu maksud.",
    en: "Tell us what “something else” means here.",
  },
  consent: {
    id: "Centang persetujuan dulu supaya kami boleh memakai jawabanmu.",
    en: "Please tick the consent box so we may use your answers.",
  },
};

export function getErrorMessage(locale: Locale, code: ErrorCode): string {
  return errorMessages[code][locale];
}

function asArray(value: AnswerValue | undefined): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value !== "") return [value];
  return [];
}

function asText(value: AnswerValue | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

/** Error satu pertanyaan, atau `null` kalau isiannya sudah benar. */
export function validateQuestion(
  question: SurveyQuestion,
  draft: SurveyDraft,
): ErrorCode | null {
  const value = draft[question.id];

  if (question.type === "checkbox") {
    const picked = asArray(value);
    if (question.required && picked.length === 0) return "required";
    if (
      picked.includes(OTHER_VALUE) &&
      asText(draft[`${question.id}_other`]) === ""
    ) {
      return "other_required";
    }
    return null;
  }

  const text = asText(value);

  if (text === "") return question.required ? "required" : null;

  if (question.type === "radio") {
    if (text === OTHER_VALUE && asText(draft[`${question.id}_other`]) === "") {
      return "other_required";
    }
    return null;
  }

  if (question.type === "number") {
    if (!/^\d{1,3}$/.test(text)) return "not_a_number";
    const parsed = Number(text);
    if (question.min !== undefined && parsed < question.min)
      return "out_of_range";
    if (question.max !== undefined && parsed > question.max)
      return "out_of_range";
    return null;
  }

  if (question.type === "scale") {
    const parsed = Number(text);
    const { min = 1, max = 5 } = question.scale ?? {};
    if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
      return "out_of_range";
    }
    return null;
  }

  if (question.maxLength !== undefined && text.length > question.maxLength) {
    return "too_long";
  }

  return null;
}

/** Error per pertanyaan untuk satu langkah — dipanggil saat menekan "Lanjut". */
export function validateStep(
  step: SurveyStep,
  draft: SurveyDraft,
): Record<string, ErrorCode> {
  const errors: Record<string, ErrorCode> = {};
  for (const question of step.questions) {
    const error = validateQuestion(question, draft);
    if (error) errors[question.id] = error;
  }
  return errors;
}

/** Validasi seluruh survei — jaring terakhir sebelum insert ke database. */
export function validateAll(
  draft: SurveyDraft,
  consent: boolean,
): Record<string, ErrorCode> {
  const errors: Record<string, ErrorCode> = {};
  if (!consent) errors.consent = "consent";
  for (const question of allQuestions) {
    const error = validateQuestion(question, draft);
    if (error) errors[question.id] = error;
  }
  return errors;
}

/**
 * Bentuk akhir yang masuk ke tabel `survey_responses`: angka jadi number,
 * pilihan ganda jadi array, isian kosong jadi null (bukan string kosong,
 * supaya `count(kolom)` di SQL langsung benar), dan nama jadi huruf besar
 * semua sesuai permintaan stakeholder.
 */
export function toDatabaseRow(
  draft: SurveyDraft,
  locale: Locale,
): Record<string, unknown> {
  const row: Record<string, unknown> = { locale, consent: true };

  for (const question of allQuestions) {
    const value = draft[question.id];

    if (question.type === "checkbox") {
      row[question.id] = asArray(value);
    } else if (question.type === "number" || question.type === "scale") {
      const text = asText(value);
      row[question.id] = text === "" ? null : Number(text);
    } else {
      const text = asText(value);
      row[question.id] =
        text === "" ? null : question.uppercase ? text.toUpperCase() : text;
    }

    if (question.other) {
      const other = asText(draft[`${question.id}_other`]);
      const picked = asArray(value);
      // Isian "lainnya" hanya ikut tersimpan kalau opsinya memang dipilih —
      // kalau tidak, ia sisa ketikan yang sudah dibatalkan pengisinya.
      row[`${question.id}_other`] =
        picked.includes(OTHER_VALUE) && other !== "" ? other : null;
    }
  }

  return row;
}
