import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Bricolage_Grotesque, Sorts_Mill_Goudy } from "next/font/google";

import "../globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  isLocale,
  locales,
  defaultLocale,
  type Locale,
} from "@/lib/i18n/config";
import { getUi } from "@/lib/i18n/ui";
import { getOgLocale, getSiteDescription, siteConfig } from "@/lib/site";

/**
 * Primary typeface: Bricolage Grotesque (sans serif).
 * Dipakai untuk heading, sub-heading, dan seluruh elemen UI.
 */
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Secondary typeface: Sorts Mill Goudy (serif). Di web ia memegang teks
 * panjang — paragraf, kutipan, wordmark — karena punya italic asli, yang
 * tidak dimiliki Bricolage. Konsekuensinya: tidak ada bold di keluarga ini,
 * jadi penekanan dalam paragraf dipindahkan ke Bricolage (lihat globals.css).
 */
const goudy = Sorts_Mill_Goudy({
  variable: "--font-goudy",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

/** Rute statis untuk tiap locale — `dynamicParams = false` membuat locale
 * di luar daftar ini otomatis 404 lewat penanganan Next.js sendiri. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

type LocaleParams = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return {};

  const locale = localeParam;
  const description = getSiteDescription(locale);
  const canonical = `${siteConfig.url}/${locale}`;
  const languages = Object.fromEntries(
    locales.map((entry) => [entry, `${siteConfig.url}/${entry}`]),
  );

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteConfig.name} — ${siteConfig.tagline}`,
      template: `%s — ${siteConfig.name}`,
    },
    description,
    alternates: {
      canonical,
      languages: {
        ...languages,
        "x-default": `${siteConfig.url}/${defaultLocale}`,
      },
    },
    openGraph: {
      type: "website",
      locale: getOgLocale(locale),
      url: canonical,
      siteName: siteConfig.name,
      title: `${siteConfig.name} — ${siteConfig.tagline}`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteConfig.name} — ${siteConfig.tagline}`,
      description,
    },
  };
}

/**
 * Bilah alamat browser ikut warna kanvas di tiap tema, jadi ujung atas layar
 * ponsel menyambung dengan halaman alih-alih memotongnya dengan garis putih.
 * `maximumScale` sengaja tidak diset — mengunci zoom melanggar WCAG 1.4.4.
 */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF6EC" },
    { media: "(prefers-color-scheme: dark)", color: "#292E16" },
  ],
  colorScheme: "light dark",
};

/**
 * Set `data-theme` sebelum React hydrate supaya tidak ada flash tema salah
 * (light lalu berkedip ke dark, atau sebaliknya). Baca localStorage dulu
 * (pilihan eksplisit pengguna dari `ThemeToggle`), baru fallback ke
 * `prefers-color-scheme` sistem. Tidak ada input pengguna yang masuk ke
 * script ini, jadi aman dari injection.
 */
const themeInitScript = `(function () {
  try {
    var stored = localStorage.getItem("wacabajo-theme");
    var theme = stored === "dark" || stored === "light"
      ? stored
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    document.documentElement.dataset.theme = theme;
  } catch (e) {}
})();`;

export default async function LocaleLayout({
  children,
  params,
}: LocaleParams & { children: React.ReactNode }) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale: Locale = localeParam;
  const ui = getUi(locale);

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${bricolage.variable} ${goudy.variable} h-full antialiased`}
      // `themeInitScript` mengubah `data-theme` sebelum React hydrate —
      // mismatch ini disengaja, bukan bug.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        {/* Lompat ke konten — hanya tampil saat menerima fokus keyboard. */}
        <a
          href="#konten"
          className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-3 focus-visible:left-3 focus-visible:z-100 focus-visible:rounded-pill focus-visible:bg-primary focus-visible:px-5 focus-visible:py-2.5 focus-visible:text-sm focus-visible:text-primary-foreground"
        >
          {ui.skipToContent}
        </a>
        <SiteHeader locale={locale} />
        <main id="konten" className="flex-1">
          {children}
        </main>
        <SiteFooter locale={locale} />
      </body>
    </html>
  );
}
