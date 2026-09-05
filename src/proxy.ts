import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { defaultLocale } from "@/lib/i18n/config";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase-env";

const LOGIN_PATH = "/backoffice/login";
const HOME_PATH = "/backoffice";

export function proxy(request: NextRequest) {
  /** Root `/` selalu diarahkan ke locale default (Indonesia), bukan dideteksi
   * dari `Accept-Language` — brand ini lahir dari Labuan Bajo. */
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  return guardBackoffice(request);
}

/**
 * Dua tugas sekaligus untuk `/backoffice`:
 *
 * 1. Menyegarkan token sesi. Access token Supabase berumur satu jam dan
 *    diperbarui dengan refresh token yang berganti setiap kali dipakai. Server
 *    Component tidak boleh menulis cookie, jadi kalau penyegaran itu tidak
 *    dikerjakan di sini, tokennya tidak pernah tersimpan dan tim ikut
 *    ter-logout tiap jam.
 * 2. Memulangkan tamu tak dikenal ke halaman masuk sebelum halaman sempat
 *    dirender. Ini kenyamanan, bukan pengamanan — yang benar-benar menjaga
 *    datanya tetap Row Level Security di Supabase.
 */
async function guardBackoffice(request: NextRequest) {
  // Selama Supabase belum dikonfigurasi, halaman backoffice tetap boleh
  // dibuka dan menjelaskan sendiri apa yang kurang.
  if (supabaseUrl === "" || supabaseAnonKey === "") return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        for (const { name, value } of list) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of list) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginPage = request.nextUrl.pathname === LOGIN_PATH;

  if (!user && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    // Query lama dibuang supaya tidak ada nilai asing yang ikut terbawa;
    // `lanjut` menyimpan halaman yang tadi dituju.
    url.search = "";
    url.searchParams.set("lanjut", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (user && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = HOME_PATH;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/",
    "/backoffice",
    "/backoffice/:path*",
    // Unduhan CSV tinggal di bawah /api, tapi isinya jawaban survei — ia harus
    // ikut dijaga seperti halaman backoffice lainnya.
    "/api/backoffice/:path*",
  ],
};
