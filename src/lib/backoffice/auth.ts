import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase-env";

/**
 * Sesi login tim backoffice.
 *
 * Klien ini beda dari `getSupabase()` di `src/lib/supabase.ts`: kuncinya sama
 * (anon key), tapi setiap permintaan membawa token sesi dari cookie. Dari
 * sisi database, yang bertanya bukan lagi `anon` melainkan `authenticated`
 * dengan `auth.uid()` tertentu — dan itulah yang membuat policy SELECT di
 * `supabase/backoffice.sql` terbuka.
 *
 * Artinya backoffice tidak memerlukan service role key sama sekali. Kalau
 * seseorang mencuri anon key dari bundel situs, ia tetap tidak bisa membaca
 * apa pun tanpa kata sandi salah satu anggota tim.
 */

export const LOGIN_PATH = "/backoffice/login";
export const HOME_PATH = "/backoffice";

export async function createBackofficeClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Component tidak boleh menulis cookie. Penyegaran token
          // sudah ditangani `src/proxy.ts` sebelum render sampai ke sini,
          // jadi kegagalan di jalur ini memang tidak perlu ditindaklanjuti.
        }
      },
    },
  });
}

export type BackofficeSession = {
  supabase: SupabaseClient;
  user: User;
  email: string;
};

/**
 * Gerbang halaman backoffice. Dipanggil di layout, jadi setiap halaman di
 * dalamnya ikut terjaga tanpa perlu mengingat memanggilnya sendiri.
 *
 * Dibungkus `cache()` karena layout dan halaman di dalamnya sama-sama
 * memanggilnya: tanpa itu, satu kali membuka halaman berarti dua kali
 * perjalanan ke Supabase untuk memverifikasi orang yang sama.
 *
 * `getUser()` dipakai, bukan `getSession()`: yang kedua cuma membaca cookie
 * apa adanya dan bisa dipalsukan, yang pertama memverifikasi tokennya ke
 * server Supabase.
 */
export const requireBackofficeSession = cache(
  async function requireBackofficeSession(): Promise<BackofficeSession> {
    const supabase = await createBackofficeClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect(LOGIN_PATH);

    // Punya akun Supabase belum berarti boleh masuk. Tanpa pemeriksaan ini,
    // orangnya akan melihat halaman backoffice yang semua angkanya nol —
    // ditolak RLS, tapi terbaca seperti "belum ada data".
    const { data: member } = await supabase
      .from("backoffice_users")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!member) {
      await supabase.auth.signOut();
      redirect(`${LOGIN_PATH}?alasan=tanpa-akses`);
    }

    return { supabase, user, email: user.email ?? "" };
  },
);
