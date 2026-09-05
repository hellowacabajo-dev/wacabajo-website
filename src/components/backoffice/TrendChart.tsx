import { formatDay } from "@/lib/backoffice/dates";
import { formatNumber } from "@/lib/backoffice/labels";
import type { DailyPoint } from "@/lib/backoffice/visitors";

/**
 * Grafik harian sebagai batang, bukan garis.
 *
 * Batang dibuat dari elemen biasa, bukan SVG: tinggi tiap hari cukup diatur
 * persentase, jadi grafiknya ikut lebar layar tanpa perhitungan viewBox, dan
 * di 375px pun 365 batang tetap muat tanpa scroll mendatar.
 *
 * Angka tiap hari tetap terbaca lewat `title` (hover di desktop) dan lewat
 * tabel ringkas di bawahnya untuk yang memakai pembaca layar.
 */
export function TrendChart({ points }: { points: DailyPoint[] }) {
  if (points.length === 0) return null;

  const peak = Math.max(1, ...points.map((point) => point.views));
  const edges = [points[0], points[Math.floor(points.length / 2)], points.at(-1)];

  return (
    <figure className="m-0">
      <div
        className="flex h-40 items-end gap-px md:h-48"
        role="img"
        aria-label={`Kunjungan harian dari ${formatDay(points[0].day)} sampai ${formatDay(points.at(-1)!.day)}, tertinggi ${formatNumber(peak)} kunjungan sehari.`}
      >
        {points.map((point) => (
          <div
            key={point.day}
            className="min-w-0 flex-1 rounded-t-[2px] bg-primary transition-opacity duration-200 hover:opacity-70"
            style={{
              // Hari kosong tetap diberi 2px supaya barisnya terlihat sebagai
              // hari yang sudah lewat, bukan hari yang belum ada datanya.
              height: point.views === 0 ? "2px" : `${Math.max(4, (point.views / peak) * 100)}%`,
              opacity: point.views === 0 ? 0.25 : 1,
            }}
            title={`${formatDay(point.day)} — ${formatNumber(point.views)} kunjungan, ${formatNumber(point.visitors)} pengunjung`}
          />
        ))}
      </div>
      <figcaption className="mt-2 flex justify-between font-sans text-xs text-foreground-subtle">
        {edges.map((point, index) => (
          <span key={point ? `${point.day}-${index}` : index}>
            {point ? formatDay(point.day) : ""}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
