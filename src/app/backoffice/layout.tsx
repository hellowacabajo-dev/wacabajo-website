import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Sorts_Mill_Goudy } from "next/font/google";
import Script from "next/script";

import "../globals.css";

/**
 * Kerangka HTML backoffice.
 *
 * Situs ini tidak punya root layout di `src/app/layout.tsx`: `[locale]/layout`
 * memegang `<html>` untuk halaman publik, dan file ini memegangnya untuk
 * `/backoffice`. Konsekuensinya font dan skrip tema perlu diulang di sini —
 * imbalannya backoffice tidak ikut membawa header, footer, dan pencatat
 * kunjungan milik situs publik.
 *
 * Backoffice berbahasa Indonesia saja. Ia bukan halaman publik, jadi aturan
 * "satu locale, satu bahasa" di `docs/DESIGN.md` §3 tidak berlaku di sini.
 */

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const goudy = Sorts_Mill_Goudy({
  variable: "--font-goudy",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Backoffice — Waca Bajo",
  // Halaman internal. `noindex` di sini, dan `disallow` di robots.txt —
  // keduanya perlu: robots.txt mencegah perayapan, meta ini mencegah URL-nya
  // tetap muncul di hasil pencarian kalau ada yang menautkannya dari luar.
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF6EC" },
    { media: "(prefers-color-scheme: dark)", color: "#292E16" },
  ],
  colorScheme: "light dark",
};

/** Sama dengan yang di layout publik: menghindari kedip tema sebelum hydrate. */
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

export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${bricolage.variable} ${goudy.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
