/**
 * Slug halaman per locale.
 *
 * Slug-nya ikut diterjemahkan (`/id/survei`, `/en/survey`) mengikuti aturan
 * "satu locale, satu bahasa" di `docs/DESIGN.md` §3 — pasangan yang salah
 * (`/id/survey`) tidak ada dan jatuh ke 404.
 */

import { locales, type Locale } from "@/lib/i18n/config";

const routeSlugs = {
  survey: { id: "survei", en: "survey" },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof routeSlugs;

export function getRoute(locale: Locale, key: RouteKey): string {
  return `/${locale}/${routeSlugs[key][locale]}`;
}

/** Semua URL satu halaman di tiap locale — untuk `alternates.languages`. */
export function getRouteAlternates(key: RouteKey): Record<Locale, string> {
  return Object.fromEntries(
    locales.map((locale) => [locale, getRoute(locale, key)]),
  ) as Record<Locale, string>;
}
