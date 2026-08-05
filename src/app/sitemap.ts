import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

/** Tambahkan route baru di sini setiap kali ada halaman statis baru. */
const routes = ["", "/brand"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.7,
  }));
}
