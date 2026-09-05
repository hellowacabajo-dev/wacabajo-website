import { BarList } from "@/components/backoffice/BarList";
import { EmptyState, Eyebrow, Panel } from "@/components/backoffice/Panel";
import { RangeTabs } from "@/components/backoffice/RangeTabs";
import { SetupNotice } from "@/components/backoffice/SetupNotice";
import { StatCard } from "@/components/backoffice/StatCard";
import { TrendChart } from "@/components/backoffice/TrendChart";
import { requireBackofficeSession } from "@/lib/backoffice/auth";
import { formatDay } from "@/lib/backoffice/dates";
import { formatNumber, labelFor, type Dimension } from "@/lib/backoffice/labels";
import {
  changeVersus,
  getVisitorStats,
  resolveRange,
  type VisitorStats,
} from "@/lib/backoffice/visitors";

export const dynamic = "force-dynamic";

/** Panel pecahan yang isinya seragam — cukup dideklarasikan sekali. */
const breakdowns: Array<{
  dimension: Dimension;
  title: string;
  meta?: string;
}> = [
  { dimension: "channel", title: "Jalur masuk" },
  { dimension: "source", title: "Asal spesifik" },
  {
    dimension: "referrer",
    title: "Situs perujuk",
    meta: "Alamat situs yang menautkan ke sini",
  },
  { dimension: "device", title: "Perangkat" },
  { dimension: "os", title: "Sistem operasi" },
  { dimension: "browser", title: "Peramban" },
  { dimension: "country", title: "Negara" },
  { dimension: "locale", title: "Bahasa halaman" },
  {
    dimension: "campaign",
    title: "Kampanye bertanda",
    meta: "Dari tautan yang memakai utm_campaign",
  },
];

export default async function PengunjungPage({
  searchParams,
}: {
  searchParams: Promise<{ rentang?: string }>;
}) {
  const { supabase } = await requireBackofficeSession();
  const { rentang } = await searchParams;
  const rangeKey = resolveRange(rentang);

  let stats: VisitorStats;
  try {
    stats = await getVisitorStats(supabase, rangeKey);
  } catch (error) {
    return <SetupNotice error={error} />;
  }

  const returning = stats.totals.visitors - stats.totals.newVisitors;
  const perSession =
    stats.totals.sessions === 0
      ? 0
      : stats.totals.views / stats.totals.sessions;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>Pengunjung</Eyebrow>
          <h1 className="mt-2 text-2xl md:text-3xl">
            {formatDay(stats.range.from)} – {formatDay(stats.range.to)}
          </h1>
        </div>
        <RangeTabs active={rangeKey} basePath="/backoffice/pengunjung" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Pengunjung unik"
          value={stats.totals.visitors}
          change={changeVersus(stats.totals.visitors, stats.previous.visitors)}
          hint="vs periode sebelumnya"
        />
        <StatCard
          label="Sesi"
          value={stats.totals.sessions}
          change={changeVersus(stats.totals.sessions, stats.previous.sessions)}
          hint="jeda 30 menit = sesi baru"
        />
        <StatCard
          label="Halaman dibuka"
          value={stats.totals.views}
          change={changeVersus(stats.totals.views, stats.previous.views)}
          hint={`${perSession.toFixed(1)} halaman per sesi`}
        />
        <StatCard
          label="Pengunjung baru"
          value={stats.totals.newVisitors}
          hint={`${formatNumber(Math.max(0, returning))} datang lagi`}
        />
      </div>

      <Panel title="Kunjungan harian">
        <TrendChart points={stats.daily} />
      </Panel>

      <Panel title="Halaman" meta="Dihitung per halaman dibuka">
        {stats.pages.length === 0 ? (
          <EmptyState>Belum ada kunjungan yang tercatat.</EmptyState>
        ) : (
          <BarList
            items={stats.pages.map((page) => ({
              label: page.path,
              count: page.views,
              note: `${formatNumber(page.visitors)} pengunjung unik`,
            }))}
            total={stats.totals.views}
            limit={15}
            unit="halaman"
          />
        )}
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        {breakdowns.map(({ dimension, title, meta }) => {
          const items = stats.facets[dimension];
          return (
            <Panel key={dimension} title={title} meta={meta}>
              {items.length === 0 ? (
                <EmptyState>Belum ada datanya.</EmptyState>
              ) : (
                <BarList
                  items={items.map((facet) => ({
                    label: labelFor(dimension, facet.value),
                    count: facet.count,
                  }))}
                  total={stats.totals.sessions}
                  unit="baris"
                />
              )}
            </Panel>
          );
        })}
      </div>

      <p className="text-sm leading-relaxed text-foreground-muted">
        Angka di halaman ini dihitung dari pencatatan situs sendiri, tanpa
        layanan pihak ketiga. Yang disimpan cuma dua angka acak per browser —
        tidak ada nama, alamat IP, atau apa pun yang menunjuk orang tertentu.
        Kunjungan dari bot dan pratinjau tautan sudah disaring.
      </p>
    </div>
  );
}
