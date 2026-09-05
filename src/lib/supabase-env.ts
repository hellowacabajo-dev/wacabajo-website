/**
 * Kredensial Supabase, dipisah dari kliennya.
 *
 * `src/proxy.ts` jalan di Edge runtime dan cuma butuh dua nilai ini; kalau ia
 * mengimpor `src/lib/supabase.ts`, seluruh klien Supabase ikut terbawa ke
 * bundel proxy padahal tidak dipakai di sana.
 *
 * Keduanya `NEXT_PUBLIC_*` dan memang aman berada di browser — yang menjaga
 * data adalah Row Level Security, bukan kerahasiaan kunci. Lihat
 * `docs/SUPABASE.md` §6.
 */

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Selama env-nya belum diisi, survei dan backoffice tetap tayang tapi kosong. */
export function isSupabaseConfigured(): boolean {
  return supabaseUrl !== "" && supabaseAnonKey !== "";
}
