"use server";

import { isLocale, type Locale } from "@/lib/i18n/config";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Bilingual } from "@/lib/survey/questions";
import {
  toDatabaseRow,
  validateAll,
  type ErrorCode,
  type SurveyDraft,
} from "@/lib/survey/validate";

/**
 * Penerimaan jawaban survei.
 *
 * Server action, bukan route handler, supaya tidak ada endpoint publik yang
 * perlu dijaga sendiri. Validasinya diulang di sini — yang dikirim browser
 * tidak pernah dianggap sudah benar.
 */

export type SubmitResult =
  | { ok: true }
  | { ok: false; fieldErrors: Record<string, ErrorCode> }
  | { ok: false; message: Bilingual };

const messages = {
  notConfigured: {
    id: "Survei belum tersambung ke penyimpanan datanya. Coba lagi nanti, atau kabari kami lewat Instagram.",
    en: "The survey is not connected to its storage yet. Please try again later, or let us know on Instagram.",
  },
  failed: {
    id: "Jawabanmu belum berhasil terkirim. Coba sekali lagi — kalau masih gagal, kabari kami lewat Instagram.",
    en: "Your answers did not go through. Please try once more — if it keeps failing, let us know on Instagram.",
  },
} satisfies Record<string, Bilingual>;

export async function submitSurvey(
  localeParam: string,
  draft: SurveyDraft,
  consent: boolean,
): Promise<SubmitResult> {
  const locale: Locale = isLocale(localeParam) ? localeParam : "id";

  const fieldErrors = validateAll(draft, consent);
  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors };

  if (!isSupabaseConfigured()) {
    return { ok: false, message: messages.notConfigured };
  }

  const { error } = await getSupabase()
    .from("survey_responses")
    .insert(toDatabaseRow(draft, locale));

  if (error) {
    // Detailnya masuk log server saja: pesan Postgres bisa menyebut nama kolom
    // dan constraint, yang tidak perlu — dan tidak aman — sampai ke pengisi.
    console.error("Gagal menyimpan jawaban survei:", error.message);
    return { ok: false, message: messages.failed };
  }

  return { ok: true };
}
