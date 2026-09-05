import Link from "next/link";

import { rangeOptions, type RangeKey } from "@/lib/backoffice/visitors";
import { cn } from "@/lib/utils";

/**
 * Pemilih rentang waktu. Berupa tautan, bukan tombol JavaScript, supaya
 * rentang yang sedang dilihat ikut ada di URL — bisa di-bookmark, bisa
 * dikirim ke anggota tim lain, dan tombol "kembali" browser tetap masuk akal.
 */
export function RangeTabs({
  active,
  basePath,
}: {
  active: RangeKey;
  basePath: string;
}) {
  return (
    <nav
      aria-label="Rentang waktu"
      className="flex flex-wrap gap-1 rounded-pill border border-border p-1"
    >
      {rangeOptions.map((option) => {
        const isActive = option.key === active;
        return (
          <Link
            key={option.key}
            href={`${basePath}?rentang=${option.key}`}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "inline-flex h-11 items-center rounded-pill px-4 font-sans text-sm transition-colors duration-200",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-foreground-muted hover:bg-surface",
            )}
          >
            {option.label}
          </Link>
        );
      })}
    </nav>
  );
}
