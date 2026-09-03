import type { Metadata } from "next";

import { locales, type Locale } from "@/lib/i18n/config";
import { getRoute } from "@/lib/i18n/routes";
import { surveyMeta } from "@/lib/survey/questions";
import { getOgLocale, siteConfig } from "@/lib/site";

/**
 * Metadata halaman survei — dipakai dua route (`/id/survei`, `/en/survey`)
 * yang isinya sama, jadi dikumpulkan di sini supaya tidak ada dua versi yang
 * bisa berbeda diam-diam.
 */
export function buildSurveyMetadata(locale: Locale): Metadata {
  const title = surveyMeta.title[locale];
  const description = surveyMeta.description[locale];
  const canonical = `${siteConfig.url}${getRoute(locale, "survey")}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: Object.fromEntries(
        locales.map((entry) => [
          entry,
          `${siteConfig.url}${getRoute(entry, "survey")}`,
        ]),
      ),
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: getOgLocale(locale),
    },
    // Survei tidak perlu muncul di hasil pencarian: tautannya disebar lewat
    // kanal Waca Bajo sendiri, dan halaman ini akan ditutup begitu datanya
    // cukup. Hapus baris ini kalau nanti mau diindeks.
    robots: { index: false, follow: true },
  };
}
