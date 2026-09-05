import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import {
  isSupabaseConfigured,
  supabaseAnonKey,
  supabaseUrl,
} from "@/lib/supabase-env";

/**
 * Klien Supabase untuk pengunjung yang tidak login — pengiriman jawaban survei
 * dan pencatatan kunjungan halaman.
 *
 * Yang dipakai adalah **anon key**, bukan service role: kunci itu memang
 * dirancang untuk publik, dan yang menjaga data tetap yang di database. Lewat
 * kunci ini Row Level Security cuma mengizinkan INSERT; membaca kembali isinya
 * ditolak. Jadi kalau kuncinya bocor sekalipun, yang bisa dilakukan hanya
 * menambah baris, bukan membaca jawaban orang.
 *
 * Yang boleh membaca adalah akun tim yang terdaftar di `backoffice_users`, dan
 * itu memakai klien lain yang membawa sesi login — lihat
 * `src/lib/backoffice/auth.ts`. Service role key tidak dipakai di mana pun dan
 * tidak boleh ditaruh di environment aplikasi.
 *
 * Panduan setupnya ada di `docs/SUPABASE.md`.
 */

export { isSupabaseConfigured };

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY — lihat docs/SUPABASE.md.",
    );
  }

  // Tidak ada sesi yang perlu disimpan: pengisi survei tidak login, dan setiap
  // request server berdiri sendiri.
  client ??= createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return client;
}
