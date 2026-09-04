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

/**
 * Ganti locale sebuah path, ikut menerjemahkan slug halaman kalau segmen
 * pertamanya cocok salah satu di `routeSlugs` (mis. `/survei` → `/survey`).
 * Dipakai `LocaleSwitcher` — tanpa ini, tukar locale dari `/id/survei`
 * berakhir di `/en/survei` yang tidak ada rutenya (404).
 */
export function localizePath(
  pathname: string,
  fromLocale: Locale,
  toLocale: Locale,
): string {
  const rest = pathname.replace(new RegExp(`^/${fromLocale}(?=/|$)`), "");
  const [, firstSegment, ...restSegments] = rest.split("/");

  for (const key of Object.keys(routeSlugs) as RouteKey[]) {
    if (routeSlugs[key][fromLocale] === firstSegment) {
      const remainder = restSegments.length
        ? `/${restSegments.join("/")}`
        : "";
      return `/${toLocale}/${routeSlugs[key][toLocale]}${remainder}`;
    }
  }

  return `/${toLocale}${rest}`;
}

/** Semua URL satu halaman di tiap locale — untuk `alternates.languages`. */
export function getRouteAlternates(key: RouteKey): Record<Locale, string> {
  return Object.fromEntries(
    locales.map((locale) => [locale, getRoute(locale, key)]),
  ) as Record<Locale, string>;
}
