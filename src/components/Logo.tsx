import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Wordmark "waca bajo".
 *
 * Deck menampilkan wordmark sebagai lowercase italic Sorts Mill Goudy, jadi
 * di sini dibuat berbasis teks — tidak perlu aset gambar dan tetap tajam di
 * semua ukuran. Bagian "Logomark" pada deck tidak ikut ter-export di PDF
 * yang diberikan; begitu file logomark tersedia, taruh SVG-nya di
 * `public/logomark.svg` dan render di sebelah wordmark ini.
 */
export function Logo({
  className,
  as = "link",
}: {
  className?: string;
  as?: "link" | "plain";
}) {
  const mark = (
    <span
      className={cn(
        "font-display text-2xl italic tracking-tight lowercase md:text-[1.75rem]",
        className,
      )}
    >
      waca bajo
    </span>
  );

  if (as === "plain") return mark;

  return (
    <Link href="/" aria-label="Waca Bajo — kembali ke beranda">
      {mark}
    </Link>
  );
}
