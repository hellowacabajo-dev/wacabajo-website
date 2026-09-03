/** Konfigurasi situs — dipakai metadata, header, footer, sitemap, robots. */

import type { Locale } from "@/lib/i18n/config";
import { getRoute } from "@/lib/i18n/routes";

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
  /**
   * Tautan formulir eksternal (Google Form). Diisi lewat environment supaya
   * tautannya bisa diganti tanpa menyunting kode, dan supaya CTA-nya tidak
   * pernah tayang sebagai tautan mati selama formulirnya belum dibuat —
   * komponen menyembunyikan tombolnya kalau nilainya kosong.
   *
   * Survei tidak ada di sini: sejak jadi halaman sendiri (`/id/survei`),
   * tautannya internal dan selalu ada.
   */
  forms: {
    join: process.env.NEXT_PUBLIC_JOIN_FORM_URL ?? "",
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

const navLabels: Record<Locale, [string, string, string]> = {
  id: ["Tentang", "Nilai", "Survei"],
  en: ["About", "Values", "Survey"],
};

/**
 * Urutannya mengikuti urutan section di beranda. Dua yang pertama fragment
 * (`#tentang`) tanpa prefix locale supaya tetap di path yang sama saat diklik;
 * survei halaman tersendiri, jadi pakai path penuh.
 */
export function getMainNav(locale: Locale): NavItem[] {
  const [about, values, survey] = navLabels[locale];
  return [
    { label: about, href: `/${locale}#tentang` },
    { label: values, href: `/${locale}#nilai` },
    { label: survey, href: getRoute(locale, "survey") },
  ];
}
