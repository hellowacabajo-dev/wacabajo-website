import Link from "next/link";

import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

const homeAriaLabel: Record<Locale, string> = {
  id: "Waca Bajo — kembali ke beranda",
  en: "Waca Bajo — back to homepage",
};

/**
 * Wordmark "waca bajo".
 *
 * Wordmark brand adalah lowercase italic Sorts Mill Goudy, jadi di sini
 * dibuat berbasis teks — tidak perlu aset gambar dan tetap tajam di semua
 * ukuran. Kalau nanti ada file logomark, taruh SVG-nya di
 * `public/logomark.svg` dan render di sebelah wordmark ini.
 */
export function Logo({
  className,
  as = "link",
  locale = "id",
}: {
  className?: string;
  as?: "link" | "plain";
  locale?: Locale;
}) {
  const mark = (
    <span
      className={cn(
        "font-serif text-2xl italic tracking-tight lowercase md:text-[1.75rem]",
        className,
      )}
    >
      waca bajo
    </span>
  );

  if (as === "plain") return mark;

  return (
    <Link href={`/${locale}`} aria-label={homeAriaLabel[locale]}>
      {mark}
    </Link>
  );
}
