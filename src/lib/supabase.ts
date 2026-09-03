import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Klien Supabase untuk sisi server.
 *
 * Yang dipakai adalah **anon key**, bukan service role: kunci itu memang
 * dirancang untuk publik, dan yang menjaga data tetap yang di database —
 * Row Level Security hanya mengizinkan INSERT ke `survey_responses` dan tidak
 * mengizinkan siapa pun membacanya kembali (lihat `supabase/schema.sql`).
 * Jadi kalau kuncinya bocor sekalipun, yang bisa dilakukan cuma menambah baris,
 * bukan membaca jawaban orang. Service role key tidak pernah dipakai di sini
 * dan tidak boleh ditaruh di environment aplikasi.
 *
 * Panduan setupnya ada di `docs/SUPABASE.md`.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Selama env-nya belum diisi, form survei tetap tayang tapi menolak kirim. */
export function isSupabaseConfigured(): boolean {
  return url !== "" && anonKey !== "";
}

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY — lihat docs/SUPABASE.md.",
    );
  }

  // Tidak ada sesi yang perlu disimpan: pengisi survei tidak login, dan setiap
  // request server berdiri sendiri.
  client ??= createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return client;
}
