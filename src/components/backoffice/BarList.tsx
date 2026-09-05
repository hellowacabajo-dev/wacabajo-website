import { formatNumber, formatPercent } from "@/lib/backoffice/labels";

export type BarItem = { label: string; count: number; note?: string };

/**
 * Daftar batang mendatar — bentuk paling terbaca untuk "mana yang paling
 * banyak", dan yang paling tahan di layar 375px karena labelnya tidak perlu
 * dimiringkan seperti pada diagram batang tegak.
 *
 * Panjang batang dihitung terhadap nilai tertinggi, bukan terhadap total:
 * kalau memakai total, sebaran yang rata membuat semua batang kerdil.
 * Persentasenya tetap dihitung dari total supaya angkanya jujur.
 *
 * `showPercent` ada untuk data yang jumlahnya masih sedikit: "50%" dari empat
 * jawaban terbaca seperti kecenderungan, padahal itu dua orang.
 */
export function BarList({
  items,
  total,
  limit = 12,
  unit = "jawaban",
  showPercent = true,
}: {
  items: BarItem[];
  total: number;
  limit?: number;
  unit?: string;
  showPercent?: boolean;
}) {
  const shown = items.slice(0, limit);
  const peak = Math.max(1, ...shown.map((item) => item.count));
  const hidden = items.length - shown.length;

  return (
    <div>
      <ul className="space-y-3">
        {shown.map((item) => (
          <li key={item.label}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="min-w-0 font-sans text-sm break-words">
                {item.label}
              </span>
              <span className="shrink-0 font-sans text-sm tabular-nums text-foreground-subtle">
                {formatNumber(item.count)}
                {showPercent && (
                  <span className="ml-2">
                    {formatPercent(item.count, total)}
                  </span>
                )}
              </span>
            </div>
            <div
              className="mt-1.5 h-2 overflow-hidden rounded-pill bg-surface"
              aria-hidden="true"
            >
              <div
                className="h-full rounded-pill bg-primary"
                style={{ width: `${Math.round((item.count / peak) * 100)}%` }}
              />
            </div>
            {item.note && (
              <p className="mt-1 font-sans text-xs text-foreground-subtle">
                {item.note}
              </p>
            )}
          </li>
        ))}
      </ul>
      {hidden > 0 && (
        <p className="mt-4 font-sans text-xs text-foreground-subtle">
          {formatNumber(hidden)} {unit} lain tidak ditampilkan.
        </p>
      )}
    </div>
  );
}
