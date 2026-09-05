import type { SurveyRow } from "@/lib/backoffice/survey";
import { getQuestion, OTHER_VALUE } from "@/lib/survey/questions";

/**
 * Saringan yang berlaku untuk seluruh halaman survei.
 *
 * Rekapnya sudah dihitung di aplikasi dari baris yang sama (lihat
 * `survey.ts`), jadi menyaring cukup dilakukan pada arraynya sebelum
 * dirangkum — tidak ada query tambahan ke Supabase.
 *
 * Pilihannya dibaca dari `src/lib/survey/questions.ts`, bukan diketik ulang.
 * Kalau suatu saat ada opsi yang ditambah atau labelnya diperbaiki, saringan
 * ini ikut berubah sendiri dan tidak pernah menawarkan opsi yang tidak ada.
 */

/** Backoffice berbahasa Indonesia; label opsi diambil dari sisi `id`. */
const LABEL_LOCALE = "id" as const;

export type FilterOption = { value: string; label: string };

export type FilterField = {
  /** Nama parameter di URL, sebahasa dengan `tab` dan `cari`. */
  param: string;
  label: string;
  options: FilterOption[];
  matches: (row: SurveyRow, value: string) => boolean;
};

/**
 * Kelompok umur, bukan umur satuan: menyaring "semua yang berumur 17" hampir
 * tidak pernah berguna, dan kelompok sepuluhan ini sama dengan yang dipakai
 * rekap umur supaya angkanya bisa dibandingkan.
 */
const ageBuckets = [
  { value: "0-14", label: "Di bawah 15", min: 0, max: 14 },
  { value: "15-24", label: "15–24", min: 15, max: 24 },
  { value: "25-34", label: "25–34", min: 25, max: 34 },
  { value: "35-44", label: "35–44", min: 35, max: 44 },
  { value: "45-plus", label: "45 ke atas", min: 45, max: 200 },
];

const ageField: FilterField = {
  param: "umur",
  label: "Umur",
  options: ageBuckets.map(({ value, label }) => ({ value, label })),
  matches(row, value) {
    const bucket = ageBuckets.find((item) => item.value === value);
    if (!bucket) return true;
    const age = Number(row.age);
    if (!Number.isFinite(age)) return false;
    return age >= bucket.min && age <= bucket.max;
  },
};

/**
 * Saringan dari satu pertanyaan pilihan tunggal. Sengaja hanya radio:
 * pertanyaan centang berisi banyak nilai sekaligus, dan "disaring pada salah
 * satu centangnya" menghasilkan angka yang gampang salah dibaca.
 */
function choiceField(
  questionId: string,
  param: string,
  label: string,
): FilterField {
  const question = getQuestion(questionId);
  const options: FilterOption[] = (question?.options ?? []).map((option) => ({
    value: option.value,
    label: option.label[LABEL_LOCALE],
  }));

  if (question?.other) {
    options.push({ value: OTHER_VALUE, label: "Lainnya" });
  }

  return {
    param,
    label,
    options,
    matches: (row, value) => row[questionId] === value,
  };
}

export const filterFields: FilterField[] = [
  ageField,
  choiceField("resident_type", "tinggal", "Status tinggal"),
  choiceField("daily_role", "peran", "Kesehariannya"),
  choiceField("reading_frequency", "baca", "Frekuensi membaca"),
];

/** Hanya berisi saringan yang benar-benar dipakai: `param` → `value`. */
export type SurveyFilters = Record<string, string>;

type RawParams = Record<string, string | string[] | undefined>;

/**
 * Nilai yang tidak dikenal diabaikan, bukan dianggap kosong-lalu-error:
 * URL bisa saja disunting tangan atau dikirim dari versi halaman yang lebih
 * lama, dan yang wajar terjadi di situ adalah rekap apa adanya.
 */
export function resolveFilters(params: RawParams): SurveyFilters {
  const filters: SurveyFilters = {};

  for (const field of filterFields) {
    const raw = params[field.param];
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (!value) continue;
    if (!field.options.some((option) => option.value === value)) continue;
    filters[field.param] = value;
  }

  return filters;
}

export function applyFilters(
  rows: SurveyRow[],
  filters: SurveyFilters,
): SurveyRow[] {
  const active = filterFields.filter((field) => filters[field.param]);
  if (active.length === 0) return rows;

  return rows.filter((row) =>
    active.every((field) => field.matches(row, filters[field.param])),
  );
}

export function hasFilters(filters: SurveyFilters): boolean {
  return Object.keys(filters).length > 0;
}

/** Kalimat pendek per saringan aktif — untuk menerangkan angka di layar. */
export function describeFilters(filters: SurveyFilters): string[] {
  const lines: string[] = [];

  for (const field of filterFields) {
    const value = filters[field.param];
    if (!value) continue;
    const option = field.options.find((item) => item.value === value);
    if (option) lines.push(`${field.label}: ${option.label}`);
  }

  return lines;
}

/**
 * Query string yang membawa saringan ke tautan lain — tab, sakelar tampilan,
 * dan unduhan CSV. Tanpa ini, mengeklik "Per orang" diam-diam mengembalikan
 * tampilan ke seluruh jawaban.
 */
export function filterQuery(
  filters: SurveyFilters,
  extra: Record<string, string | undefined> = {},
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(extra)) {
    if (value) params.set(key, value);
  }
  for (const field of filterFields) {
    const value = filters[field.param];
    if (value) params.set(field.param, value);
  }

  return params.toString();
}
