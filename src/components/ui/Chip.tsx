import { cn } from "@/lib/utils";

import type { BrandTone } from "@/lib/content";

/**
 * Chip / tag kecil.
 *
 * Setiap tone memakai tint terang dari satu keluarga warna dengan teks dari
 * step gelap keluarga yang sama — semuanya lolos WCAG AAA (rasio tercatat di
 * `globals.css` dan di `docs/DESIGN.md` §1). Karena itu chip aman
 * dipakai pada ukuran teks kecil sekalipun.
 */
const toneClass: Record<BrandTone, string> = {
  forest: "bg-chip-forest-bg text-chip-forest-fg",
  persephone: "bg-chip-persephone-bg text-chip-persephone-fg",
  maritime: "bg-chip-maritime-bg text-chip-maritime-fg",
  gold: "bg-chip-gold-bg text-chip-gold-fg",
  brandy: "bg-chip-brandy-bg text-chip-brandy-fg",
};

export function Chip({
  tone = "brandy",
  className,
  children,
}: {
  tone?: BrandTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-3 py-1 font-sans text-xs font-medium",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
