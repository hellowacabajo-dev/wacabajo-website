import Link from "next/link";

import { cn } from "@/lib/utils";

type Variant = "primary" | "accent" | "outline" | "ghost" | "inverse";
type Size = "sm" | "md" | "lg";

/**
 * `active:scale-[0.97]` memberi umpan balik tekan tanpa menggeser elemen di
 * sekitarnya (transform saja, tidak memicu reflow). Durasi 200ms mengikuti
 * rentang 150–300ms untuk mikro-interaksi.
 */
const base =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-pill " +
  "font-medium whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] " +
  "duration-200 ease-out active:scale-[0.97] " +
  "disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100";

/** Semua varian memakai pasangan warna yang lolos WCAG AA. */
const variantClass: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-soft hover:bg-primary-hover hover:shadow-card",
  accent: "bg-accent text-accent-foreground hover:bg-accent-hover",
  outline:
    "border border-border-strong text-foreground hover:bg-surface hover:border-foreground-subtle",
  ghost: "text-foreground hover:bg-surface",
  // Untuk dipakai di atas section gelap (forest/persephone/maritime).
  inverse: "bg-cream-50 text-persephone-950 hover:bg-cream-200",
};

/**
 * Tinggi minimum 44px pada `md` dan `lg` supaya memenuhi target sentuh.
 * `sm` (h-9 = 36px) hanya untuk kontrol desktop di dalam header, dan di sana
 * pembungkusnya yang menyediakan area sentuh.
 */
const sizeClass: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
};

type StyleProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
};

/** Ada `href` → render <Link>; tanpa `href` → render <button>. */
export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: StyleProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={cn(base, variantClass[variant], sizeClass[size], className)}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: StyleProps & React.ComponentProps<typeof Link>) {
  return (
    <Link
      {...rest}
      className={cn(base, variantClass[variant], sizeClass[size], className)}
    >
      {children}
    </Link>
  );
}
