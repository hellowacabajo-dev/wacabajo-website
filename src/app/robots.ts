import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // `/backoffice` dan endpoint pencatat kunjungan tidak punya urusan
    // dengan mesin pencari. `noindex` di metadata backoffice tetap perlu:
    // robots.txt hanya mencegah perayapan, bukan pengindeksan URL yang
    // ditemukan lewat tautan dari luar.
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/backoffice", "/backoffice/", "/api/"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
