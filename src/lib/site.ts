/** Konfigurasi situs — dipakai metadata, header, footer, sitemap, robots. */

export const siteConfig = {
  name: "Waca Bajo",
  tagline: "Growing Through Stories",
  description:
    "Gerakan literasi dari Labuan Bajo. Melalui buku, cerita, dan kebersamaan, membangun ruang tempat manusia belajar, saling memahami, dan berkembang bersama.",
  locale: "id-ID",
  /**
   * Dipakai untuk metadataBase, canonical, dan sitemap. Set
   * NEXT_PUBLIC_SITE_URL di environment produksi (lihat .env.example).
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  social: {
    instagram: "https://instagram.com/wacabajo",
    email: "halo@wacabajo.org",
  },
} as const;

export type NavItem = {
  label: string;
  href: string;
};

/** Urutannya mengikuti urutan section di beranda. */
export const mainNav: NavItem[] = [
  { label: "Tentang", href: "/#tentang" },
  { label: "Program", href: "/#program" },
  { label: "Nilai", href: "/#nilai" },
  { label: "Brand", href: "/brand" },
];
