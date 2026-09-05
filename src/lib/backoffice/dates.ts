/**
 * Tanggal di backoffice selalu dihitung dalam waktu Labuan Bajo (WITA),
 * sama seperti view dan fungsi di `supabase/backoffice.sql`. Kalau salah satu
 * memakai UTC, kunjungan pagi hari akan muncul di tanggal yang berbeda antara
 * grafik dan tabel.
 */

export const TIMEZONE = "Asia/Makassar";

/** `en-CA` dipilih karena formatnya persis YYYY-MM-DD, sama dengan `date` di Postgres. */
const isoDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function today(): string {
  return isoDate.format(new Date());
}

export function addDays(day: string, amount: number): string {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

/** Rentang tertutup: dua-duanya ikut terhitung. */
export type DayRange = { from: string; to: string };

export function lastDays(days: number): DayRange {
  const to = today();
  return { from: addDays(to, -(days - 1)), to };
}

/** Periode sebelumnya dengan panjang yang sama — untuk membandingkan naik/turun. */
export function precedingRange(range: DayRange, days: number): DayRange {
  return { from: addDays(range.from, -days), to: addDays(range.from, -1) };
}

/** Semua tanggal dalam rentang, supaya grafik tidak melompati hari sepi. */
export function eachDay(range: DayRange): string[] {
  const days: string[] = [];
  for (let day = range.from; day <= range.to; day = addDays(day, 1)) {
    days.push(day);
    if (days.length > 400) break;
  }
  return days;
}

const shortDate = new Intl.DateTimeFormat("id-ID", {
  timeZone: "UTC",
  day: "numeric",
  month: "short",
});

export function formatDay(day: string): string {
  return shortDate.format(new Date(`${day}T00:00:00Z`));
}

const stamp = new Intl.DateTimeFormat("id-ID", {
  timeZone: TIMEZONE,
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatTimestamp(value: string): string {
  return `${stamp.format(new Date(value))} WITA`;
}
