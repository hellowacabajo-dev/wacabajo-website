import { NextResponse, type NextRequest } from "next/server";

import { defaultLocale } from "@/lib/i18n/config";

/** Root `/` selalu diarahkan ke locale default (Indonesia), bukan dideteksi
 * dari `Accept-Language` — brand ini lahir dari Labuan Bajo. */
export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
}

export const config = {
  matcher: "/",
};
