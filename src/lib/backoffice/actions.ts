"use server";

import { redirect } from "next/navigation";

import {
  createBackofficeClient,
  HOME_PATH,
  LOGIN_PATH,
} from "@/lib/backoffice/auth";
import { isSupabaseConfigured } from "@/lib/supabase-env";

/** Hasil percobaan login — `null` berarti belum ada percobaan sama sekali. */
export type LoginState = { error: string | null };

/**
 * Pesannya sengaja tidak membedakan "email tidak terdaftar" dari "kata sandi
 * salah". Perbedaan itu memberi tahu orang luar email siapa saja yang punya
 * akun di sini, dan tidak menolong siapa pun yang memang berhak masuk.
 */
const WRONG_CREDENTIALS = "Email atau kata sandi tidak cocok.";

export async function signIn(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!isSupabaseConfigured()) {
    return {
      error:
        "Backoffice belum tersambung ke Supabase. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY, lalu build ulang.",
    };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (email === "" || password === "") {
    return { error: "Isi email dan kata sandi dulu." };
  }

  const supabase = await createBackofficeClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) return { error: WRONG_CREDENTIALS };

  // Kata sandinya benar, tapi akunnya belum tentu anggota tim — cek daftarnya
  // sebelum sesi sempat dipakai membuka halaman mana pun.
  const { data: member } = await supabase
    .from("backoffice_users")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (!member) {
    await supabase.auth.signOut();
    return {
      error:
        "Akun ini belum diberi akses backoffice. Minta admin menambahkannya di tabel backoffice_users.",
    };
  }

  redirect(HOME_PATH);
}

export async function signOut() {
  const supabase = await createBackofficeClient();
  await supabase.auth.signOut();
  redirect(LOGIN_PATH);
}
