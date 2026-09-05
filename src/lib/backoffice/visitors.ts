import type { SupabaseClient } from "@supabase/supabase-js";

import {
  eachDay,
  lastDays,
  precedingRange,
  type DayRange,
} from "@/lib/backoffice/dates";
import type { Dimension } from "@/lib/backoffice/labels";

/**
 * Rekap kunjungan.
 *
 * Semua penjumlahan dikerjakan Postgres, bukan di sini — bukan soal kecepatan,
 * tapi soal benar: PostgREST memotong hasil select di 1.000 baris tanpa
 * memberi tahu, jadi menarik baris mentah lalu menghitungnya di JavaScript
 * akan diam-diam salah begitu kunjungan lewat seribu. Fungsi dan view yang
 * dipanggil di bawah ada di `supabase/backoffice.sql`.
 */

export const rangeOptions = [
  { key: "7", label: "7 hari", days: 7 },
  { key: "30", label: "30 hari", days: 30 },
  { key: "90", label: "90 hari", days: 90 },
  { key: "365", label: "1 tahun", days: 365 },
] as const;

export type RangeKey = (typeof rangeOptions)[number]["key"];

export const defaultRange: RangeKey = "30";

export function resolveRange(value: string | undefined): RangeKey {
  const found = rangeOptions.find((option) => option.key === value);
  return found ? found.key : defaultRange;
}

export function rangeDays(key: RangeKey): number {
  return rangeOptions.find((option) => option.key === key)!.days;
}

export type Totals = {
  views: number;
  visitors: number;
  sessions: number;
  newVisitors: number;
};

export type DailyPoint = {
  day: string;
  views: number;
  visitors: number;
  sessions: number;
};

export type Facet = { value: string; count: number };

export type PageRow = { path: string; views: number; visitors: number };

export type VisitorStats = {
  range: DayRange;
  totals: Totals;
  /** Periode sepanjang ini tepat sebelumnya — pembanding naik/turun. */
  previous: Totals;
  daily: DailyPoint[];
  pages: PageRow[];
  facets: Record<Dimension, Facet[]>;
};

const emptyTotals: Totals = {
  views: 0,
  visitors: 0,
  sessions: 0,
  newVisitors: 0,
};

export async function getVisitorStats(
  supabase: SupabaseClient,
  rangeKey: RangeKey,
): Promise<VisitorStats> {
  const days = rangeDays(rangeKey);
  const range = lastDays(days);
  const earlier = precedingRange(range, days);

  const [totals, previous, daily, pages, facets] = await Promise.all([
    fetchTotals(supabase, range),
    fetchTotals(supabase, earlier),
    fetchDaily(supabase, range),
    fetchPages(supabase, range),
    fetchFacets(supabase, range),
  ]);

  return { range, totals, previous, daily, pages, facets };
}

async function fetchTotals(
  supabase: SupabaseClient,
  range: DayRange,
): Promise<Totals> {
  const { data, error } = await supabase.rpc("backoffice_visitor_totals", {
    from_day: range.from,
    to_day: range.to,
  });

  if (error) throw new Error(`backoffice_visitor_totals: ${error.message}`);

  const row = (data as RawTotals[] | null)?.[0];
  if (!row) return emptyTotals;

  return {
    views: Number(row.views ?? 0),
    visitors: Number(row.visitors ?? 0),
    sessions: Number(row.sessions ?? 0),
    newVisitors: Number(row.new_visitors ?? 0),
  };
}

async function fetchDaily(
  supabase: SupabaseClient,
  range: DayRange,
): Promise<DailyPoint[]> {
  const { data, error } = await supabase
    .from("backoffice_visitor_daily")
    .select("day, views, visitors, sessions")
    .gte("day", range.from)
    .lte("day", range.to)
    .order("day");

  if (error) throw new Error(`backoffice_visitor_daily: ${error.message}`);

  const byDay = new Map<string, RawDaily>();
  for (const row of (data ?? []) as RawDaily[]) byDay.set(row.day, row);

  // Hari tanpa kunjungan tetap harus muncul sebagai nol, kalau tidak garis
  // grafiknya melompat dan terbaca seakan tidak pernah sepi.
  return eachDay(range).map((day) => {
    const row = byDay.get(day);
    return {
      day,
      views: Number(row?.views ?? 0),
      visitors: Number(row?.visitors ?? 0),
      sessions: Number(row?.sessions ?? 0),
    };
  });
}

async function fetchPages(
  supabase: SupabaseClient,
  range: DayRange,
): Promise<PageRow[]> {
  const { data, error } = await supabase.rpc("backoffice_top_pages", {
    from_day: range.from,
    to_day: range.to,
    limit_n: 25,
  });

  if (error) throw new Error(`backoffice_top_pages: ${error.message}`);

  return ((data ?? []) as RawPage[]).map((row) => ({
    path: row.page_path,
    views: Number(row.views ?? 0),
    visitors: Number(row.visitors ?? 0),
  }));
}

const dimensions: Dimension[] = [
  "channel",
  "source",
  "referrer",
  "device",
  "os",
  "browser",
  "country",
  "locale",
  "campaign",
];

async function fetchFacets(
  supabase: SupabaseClient,
  range: DayRange,
): Promise<Record<Dimension, Facet[]>> {
  const { data, error } = await supabase.rpc("backoffice_entry_facets", {
    from_day: range.from,
    to_day: range.to,
  });

  if (error) throw new Error(`backoffice_entry_facets: ${error.message}`);

  const grouped = Object.fromEntries(
    dimensions.map((dimension) => [dimension, [] as Facet[]]),
  ) as Record<Dimension, Facet[]>;

  for (const row of (data ?? []) as RawFacet[]) {
    const bucket = grouped[row.dimension as Dimension];
    if (!bucket) continue;
    bucket.push({ value: row.value, count: Number(row.sessions ?? 0) });
  }

  for (const dimension of dimensions) {
    grouped[dimension].sort((a, b) => b.count - a.count);
  }

  return grouped;
}

/** Selisih dalam persen; `null` kalau periode sebelumnya kosong sama sekali. */
export function changeVersus(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}

type RawTotals = {
  views: number | string | null;
  visitors: number | string | null;
  sessions: number | string | null;
  new_visitors: number | string | null;
};

type RawDaily = {
  day: string;
  views: number | string | null;
  visitors: number | string | null;
  sessions: number | string | null;
};

type RawPage = {
  page_path: string;
  views: number | string | null;
  visitors: number | string | null;
};

type RawFacet = {
  dimension: string;
  value: string;
  sessions: number | string | null;
};
