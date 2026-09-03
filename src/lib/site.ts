/** Konfigurasi situs — dipakai metadata, header, footer, sitemap, robots. */

import type { Locale } from "@/lib/i18n/config";

export const siteConfig = {
  name: "Waca Bajo",
  tagline: "Growing Through Stories",
  /**
   * Dipakai untuk metadataBase, canonical, dan sitemap. Set
   * NEXT_PUBLIC_SITE_URL di environment produksi (lihat .env.example).
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  social: {
    instagram: "https://www.instagram.com/wacabajo",
    email: "hello.wacabajo@gmail.com",
  },
} as const;

const description: Record<Locale, string> = {
  id: "Gerakan literasi dari Labuan Bajo. Melalui buku, cerita, dan kebersamaan, membangun ruang tempat manusia belajar, saling memahami, dan berkembang bersama.",
  en: "A literacy movement from Labuan Bajo. Through books, stories, and togetherness, building spaces where people learn, understand each other, and grow together.",
};

export function getSiteDescription(locale: Locale): string {
  return description[locale];
}

/** Dipakai untuk `openGraph.locale` dan atribut `lang` HTML. */
const ogLocale: Record<Locale, string> = { id: "id_ID", en: "en_US" };

export function getOgLocale(locale: Locale): string {
  return ogLocale[locale];
}

export type NavItem = {
  label: string;
  href: string;
};

const navLabels: Record<Locale, [string, string]> = {
  id: ["Tentang", "Nilai"],
  en: ["About", "Values"],
};

/**
 * Urutannya mengikuti urutan section di beranda. Hanya fragment (`#tentang`)
 * tanpa prefix locale supaya tetap di path yang sama saat diklik.
 */
export function getMainNav(locale: Locale): NavItem[] {
  const [about, values] = navLabels[locale];
  return [
    { label: about, href: "#tentang" },
    { label: values, href: "#nilai" },
  ];
}
