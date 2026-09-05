import Link from "next/link";

import { BarList } from "@/components/backoffice/BarList";
import { EmptyState, Eyebrow, Panel } from "@/components/backoffice/Panel";
import { RangeTabs } from "@/components/backoffice/RangeTabs";
import { SetupNotice } from "@/components/backoffice/SetupNotice";
import { StatCard } from "@/components/backoffice/StatCard";
import { TrendChart } from "@/components/backoffice/TrendChart";
import { requireBackofficeSession } from "@/lib/backoffice/auth";
import { formatDay } from "@/lib/backoffice/dates";
import { formatNumber, labelFor } from "@/lib/backoffice/labels";
import { countResponses } from "@/lib/backoffice/survey";
import {
  changeVersus,
  getVisitorStats,
  resolveRange,
  type VisitorStats,
} from "@/lib/backoffice/visitors";

export const dynamic = "force-dynamic";

/**
 * Ringkasan: satu layar untuk menjawab "bagaimana minggu ini?" tanpa perlu
 * membuka halaman lain. Rinciannya baru di `/backoffice/pengunjung` dan
 * `/backoffice/survei`.
 */
export default async function RingkasanPage({
  searchParams,
}: {
  searchParams: Promise<{ rentang?: string }>;
}) {
  const { supabase } = await requireBackofficeSession();
  const { rentang } = await searchParams;
  const rangeKey = resolveRange(rentang);

  let stats: VisitorStats;
  let inRange = 0;
  let responsesTotal = 0;
  try {
    stats = await getVisitorStats(supabase, rangeKey);
    // Rentangnya diambil dari `stats` supaya potongan harinya persis sama
    // dengan angka kunjungan di sebelahnya.
    [inRange, responsesTotal] = await Promise.all([
      countResponses(supabase, stats.range),
      countResponses(supabase),
    ]);
  } catch (error) {
    return <SetupNotice error={error} />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>Ringkasan</Eyebrow>
          <h1 className="mt-2 text-2xl md:text-3xl">
            {formatDay(stats.range.from)} – {formatDay(stats.range.to)}
          </h1>
        </div>
        <RangeTabs active={rangeKey} basePath="/backoffice" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Pengunjung unik"
          value={stats.totals.visitors}
          change={changeVersus(
            stats.totals.visitors,
            stats.previous.visitors,
          )}
          hint="vs periode sebelumnya"
        />
        <StatCard
          label="Sesi"
          value={stats.totals.sessions}
          change={changeVersus(stats.totals.sessions, stats.previous.sessions)}
          hint="kunjungan berbeda"
        />
        <StatCard
          label="Halaman dibuka"
          value={stats.totals.views}
          change={changeVersus(stats.totals.views, stats.previous.views)}
        />
        <StatCard
          label="Jawaban survei"
          value={inRange}
          hint={`${formatNumber(responsesTotal)} sejak awal`}
        />
      </div>

      <Panel
        title="Kunjungan harian"
        meta={`Tertinggi ${formatNumber(Math.max(...stats.daily.map((point) => point.views)))} dalam sehari`}
      >
        <TrendChart points={stats.daily} />
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Dari mana pengunjung datang"
          meta="Dihitung per sesi"
          action={
            <Link
              href="/backoffice/pengunjung"
              className="inline-flex h-11 items-center font-sans text-sm text-foreground-muted underline underline-offset-4 hover:text-foreground"
            >
              Lihat rinci
            </Link>
          }
        >
          {stats.facets.channel.length === 0 ? (
            <EmptyState>Belum ada kunjungan yang tercatat.</EmptyState>
          ) : (
            <BarList
              items={stats.facets.channel.map((facet) => ({
                label: labelFor("channel", facet.value),
                count: facet.count,
              }))}
              total={stats.totals.sessions}
              unit="jalur"
            />
          )}
        </Panel>

        <Panel title="Halaman paling sering dibuka">
          {stats.pages.length === 0 ? (
            <EmptyState>Belum ada kunjungan yang tercatat.</EmptyState>
          ) : (
            <BarList
              items={stats.pages.slice(0, 8).map((page) => ({
                label: page.path,
                count: page.views,
              }))}
              total={stats.totals.views}
              limit={8}
              unit="halaman"
            />
          )}
        </Panel>
      </div>
    </div>
  );
}
