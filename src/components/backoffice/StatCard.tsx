import { formatNumber } from "@/lib/backoffice/labels";
import { cn } from "@/lib/utils";

/**
 * Satu angka besar dengan pembanding periode sebelumnya.
 *
 * `change` sengaja boleh `null`: kalau periode sebelumnya benar-benar kosong,
 * "naik 100%" itu menyesatkan — lebih jujur tidak menampilkan apa-apa.
 */
export function StatCard({
  label,
  value,
  hint,
  change,
}: {
  label: string;
  value: number;
  hint?: string;
  change?: number | null;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface-raised p-5">
      <p className="font-sans text-xs font-medium text-foreground-subtle">
        {label}
      </p>
      <p className="mt-2 font-sans text-3xl font-bold tracking-tight tabular-nums md:text-4xl">
        {formatNumber(value)}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
        {typeof change === "number" && (
          <span
            className={cn(
              "font-sans text-xs font-medium",
              // Token chip tidak didefinisikan ulang di tema gelap — ia
              // memang dirancang berpasangan dengan latarnya sendiri. Di sini
              // warnanya berdiri di atas permukaan kartu, jadi tiap tema
              // butuh step yang berbeda. Rasio tercatat di docs/DESIGN.md §1.
              change > 0 && "text-forest-800 dark:text-forest-200",
              change < 0 && "text-persephone-800 dark:text-persephone-100",
              change === 0 && "text-foreground-subtle",
            )}
          >
            {change > 0 ? "▲" : change < 0 ? "▼" : "•"} {Math.abs(change)}%
          </span>
        )}
        {(change === null || hint) && (
          <span className="font-sans text-xs text-foreground-subtle">
            {change === null ? "belum ada pembanding" : hint}
          </span>
        )}
      </div>
    </div>
  );
}
