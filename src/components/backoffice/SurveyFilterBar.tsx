import Link from "next/link";

import {
  filterFields,
  filterQuery,
  hasFilters,
  type SurveyFilters,
} from "@/lib/backoffice/survey-filters";

/**
 * Saringan seluruh halaman survei.
 *
 * Berupa form GET biasa, bukan komponen klien: saringan yang sedang dipakai
 * jadi ikut ada di URL — bisa dikirim ke anggota tim lain apa adanya, dan
 * tombol "kembali" browser tetap masuk akal. Alasannya sama dengan
 * `RangeTabs` di halaman pengunjung.
 */
export function SurveyFilterBar({
  basePath,
  filters,
  hidden,
}: {
  basePath: string;
  filters: SurveyFilters;
  /** Keadaan halaman yang harus ikut terbawa saat saringan diterapkan. */
  hidden?: Record<string, string | undefined>;
}) {
  const active = hasFilters(filters);
  const resetQuery = filterQuery({}, hidden);

  return (
    <form
      action={basePath}
      className="rounded-lg border border-border bg-surface-raised p-4 md:p-5"
    >
      {Object.entries(hidden ?? {}).map(([name, value]) =>
        value ? (
          <input key={name} type="hidden" name={name} value={value} />
        ) : null,
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filterFields.map((field) => (
          <div key={field.param}>
            <label
              htmlFor={`saring-${field.param}`}
              className="block font-sans text-xs font-medium text-foreground-muted"
            >
              {field.label}
            </label>
            <select
              id={`saring-${field.param}`}
              name={field.param}
              defaultValue={filters[field.param] ?? ""}
              className="mt-1.5 h-11 w-full rounded-md border border-border-strong bg-surface px-3 font-sans text-sm"
            >
              <option value="">Semua</option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="submit"
          className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-pill bg-primary px-5 font-sans text-sm text-primary-foreground transition-opacity duration-200 hover:opacity-90 sm:w-auto"
        >
          Terapkan
        </button>
        {active && (
          <Link
            href={resetQuery ? `${basePath}?${resetQuery}` : basePath}
            className="inline-flex h-11 w-full items-center justify-center rounded-pill border border-border-strong px-5 font-sans text-sm transition-colors duration-200 hover:bg-surface sm:w-auto"
          >
            Hapus saringan
          </Link>
        )}
      </div>
    </form>
  );
}
