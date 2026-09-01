import { cn } from "@/lib/utils";

import type { BrandTone } from "@/lib/content";

/**
 * Kartu dasar. Sudut 28px (--radius-xl) dan garis Brandy 200 mengikuti kesan
 * "lived-in" Vintage Cream — hindari shadow keras di atas kanvas cream.
 *
 * Hover mengangkat kartu 2px lewat transform saja, jadi tidak ada reflow dan
 * tidak ada layout shift.
 */
export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface-raised p-7 shadow-soft",
        "transition-[box-shadow,transform] duration-200 ease-out",
        "hover:-translate-y-0.5 hover:shadow-card",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Badge ikon di kepala kartu — kotak tint dengan doodle di dalamnya.
 * Pasangan tint/teks sama dengan `Chip`, jadi kontrasnya sudah tervalidasi.
 */
const badgeTone: Record<BrandTone, string> = {
  forest: "bg-chip-forest-bg text-chip-forest-fg",
  persephone: "bg-chip-persephone-bg text-chip-persephone-fg",
  maritime: "bg-chip-maritime-bg text-chip-maritime-fg",
  gold: "bg-chip-gold-bg text-chip-gold-fg",
  brandy: "bg-chip-brandy-bg text-chip-brandy-fg",
};

export function CardBadge({
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
        "mb-6 inline-flex h-14 w-14 items-center justify-center rounded-lg",
        badgeTone[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function CardTitle({
  as: Tag = "h3",
  className,
  children,
}: {
  as?: "h2" | "h3" | "h4";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag className={cn("text-xl leading-snug md:text-2xl", className)}>
      {children}
    </Tag>
  );
}

export function CardBody({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "mt-3 text-sm leading-relaxed text-foreground-muted md:text-base",
        className,
      )}
    >
      {children}
    </p>
  );
}
