import type { MetadataRoute } from "next";

import { locales } from "@/lib/i18n/config";
import { siteConfig } from "@/lib/site";

/** Tambahkan route baru di sini setiap kali ada halaman statis baru. */
const routes = [""];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const languages = Object.fromEntries(
    locales.map((locale) => [locale, `${siteConfig.url}/${locale}`]),
  );

  return routes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${siteConfig.url}/${locale}${route}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.7,
      alternates: { languages },
    })),
  );
}
