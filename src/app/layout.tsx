import type { Metadata } from "next";
import { Bricolage_Grotesque, Sorts_Mill_Goudy } from "next/font/google";

import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { siteConfig } from "@/lib/site";

/**
 * Primary typeface menurut deck: Bricolage Grotesque (sans serif).
 * Dipakai untuk body dan seluruh elemen UI.
 */
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Secondary typeface: Sorts Mill Goudy (serif). Deck memakainya untuk semua
 * headline dan kutipan, termasuk wordmark — jadi di web ia jadi display face.
 */
const goudy = Sorts_Mill_Goudy({
  variable: "--font-goudy",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${bricolage.variable} ${goudy.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* Lompat ke konten — hanya tampil saat menerima fokus keyboard. */}
        <a
          href="#konten"
          className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-3 focus-visible:left-3 focus-visible:z-100 focus-visible:rounded-pill focus-visible:bg-primary focus-visible:px-5 focus-visible:py-2.5 focus-visible:text-sm focus-visible:text-primary-foreground"
        >
          Lompat ke konten
        </a>
        <SiteHeader />
        <main id="konten" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
