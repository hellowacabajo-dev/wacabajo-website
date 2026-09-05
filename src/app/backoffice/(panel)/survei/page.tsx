import Link from "next/link";

import { EmptyState, Eyebrow } from "@/components/backoffice/Panel";
import {
  QuestionSummaryCard,
  type SummaryView,
} from "@/components/backoffice/QuestionSummaryCard";
import { SetupNotice } from "@/components/backoffice/SetupNotice";
import { SurveyFilterBar } from "@/components/backoffice/SurveyFilterBar";
import { requireBackofficeSession } from "@/lib/backoffice/auth";
import { formatTimestamp } from "@/lib/backoffice/dates";
import { formatNumber } from "@/lib/backoffice/labels";
import {
  describeAnswer,
  fetchResponses,
  MIN_FOR_PERCENT,
  summarizeBySteps,
  type ResponsesResult,
  type SurveyRow,
} from "@/lib/backoffice/survey";
import {
  applyFilters,
  describeFilters,
  filterQuery,
  hasFilters,
  resolveFilters,
  type SurveyFilters,
} from "@/lib/backoffice/survey-filters";
import { getQuestion } from "@/lib/survey/questions";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const BASE_PATH = "/backoffice/survei";

/**
 * Dua cara membaca survei yang sama, seperti di Google Form: "Ringkasan"
 * menjawab apa yang dipikirkan banyak orang, "Jawaban" menjawab apa yang
 * dikatakan satu orang. Keduanya dari satu kali tarik data yang sama.
 *
 * Saringannya berlaku untuk dua-duanya sekaligus, termasuk unduhan CSV-nya:
 * layar yang sedang menampilkan jawaban guru saja lalu mengunduh seluruh
 * jawaban adalah cara paling mudah menaruh angka yang salah di laporan.
 */
type Tab = "ringkasan" | "jawaban";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function SurveiPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { supabase } = await requireBackofficeSession();
  const params = await searchParams;

  const tab: Tab = params.tab === "jawaban" ? "jawaban" : "ringkasan";
  const view: SummaryView = params.tampilan === "tabel" ? "tabel" : "bar";
  const keyword = String(params.cari ?? "").trim();
  const filters = resolveFilters(params);

  let result: ResponsesResult;
  try {
    result = await fetchResponses(supabase);
  } catch (error) {
    return <SetupNotice error={error} />;
  }

  const { rows: allRows, truncated } = result;
  const rows = applyFilters(allRows, filters);
  const filtered = hasFilters(filters);
  const showPercent = rows.length >= MIN_FOR_PERCENT;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>Survei need assessment</Eyebrow>
          <h1 className="mt-2 text-2xl md:text-3xl">
            {filtered
              ? `${formatNumber(rows.length)} dari ${formatNumber(allRows.length)} jawaban`
              : `${formatNumber(allRows.length)} jawaban masuk`}
          </h1>
          {filtered ? (
            <p className="mt-1 font-sans text-xs text-foreground-subtle">
              Disaring: {describeFilters(filters).join(" · ")}
            </p>
          ) : (
            allRows.length > 0 && (
              <p className="mt-1 font-sans text-xs text-foreground-subtle">
                Terakhir {formatTimestamp(allRows[0].created_at)}
              </p>
            )
          )}
        </div>
        {/* Sengaja <a>, bukan <Link>: tujuannya route handler yang membalas
            file, dan navigasi klien milik Next akan memperlakukannya sebagai
            halaman — unduhannya tidak pernah jadi. */}
        <a
          href={`/api/backoffice/ekspor${filtered ? `?${filterQuery(filters)}` : ""}`}
          className="inline-flex h-11 items-center rounded-pill border border-border-strong px-5 font-sans text-sm transition-colors duration-200 hover:bg-surface"
        >
          {filtered ? "Unduh CSV tersaring" : "Unduh CSV"}
        </a>
      </div>

      {truncated && (
        <p className="rounded-md border border-border-strong bg-surface px-4 py-3 font-sans text-sm text-foreground-muted">
          Jawabannya sudah lebih dari 20.000 dan halaman ini hanya membaca
          sebagian. Rekapnya perlu dipindah ke SQL — lihat catatan di{" "}
          <code>src/lib/backoffice/survey.ts</code>.
        </p>
      )}

      <Tabs active={tab} filters={filters} view={view} />

      <SurveyFilterBar
        basePath={BASE_PATH}
        filters={filters}
        hidden={{
          tab: tab === "jawaban" ? tab : undefined,
          tampilan: view === "tabel" ? view : undefined,
          // Pencarian nama ikut terbawa: mengganti saringan tidak seharusnya
          // diam-diam mengosongkan kotak cari yang sedang dipakai.
          cari: keyword || undefined,
        }}
      />

      {allRows.length > 0 && rows.length > 0 && !showPercent && (
        <p className="rounded-md border border-border-strong bg-surface px-4 py-3 font-sans text-sm text-foreground-muted">
          Baru {formatNumber(rows.length)} jawaban{filtered ? " yang cocok" : ""}
          . Persentase disembunyikan dulu — di jumlah sekecil ini ia lebih
          sering menyesatkan daripada menerangkan. Angka aslinya tetap tampil.
        </p>
      )}

      {allRows.length === 0 ? (
        <EmptyState>
          Belum ada yang mengisi survei. Begitu ada, rekapnya muncul di sini.
        </EmptyState>
      ) : rows.length === 0 ? (
        <EmptyState>
          Tidak ada jawaban yang cocok dengan saringan ini.
        </EmptyState>
      ) : tab === "ringkasan" ? (
        <Ringkasan rows={rows} view={view} showPercent={showPercent} filters={filters} />
      ) : (
        <Jawaban rows={rows} keyword={keyword} filters={filters} />
      )}
    </div>
  );
}

function Tabs({
  active,
  filters,
  view,
}: {
  active: Tab;
  filters: SurveyFilters;
  view: SummaryView;
}) {
  const tabs: Array<{ key: Tab; label: string }> = [
    { key: "ringkasan", label: "Ringkasan" },
    { key: "jawaban", label: "Per orang" },
  ];

  return (
    <nav
      aria-label="Cara membaca"
      className="flex gap-1 rounded-pill border border-border p-1"
    >
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={`${BASE_PATH}?${filterQuery(filters, {
            tab: tab.key,
            tampilan: view === "tabel" ? view : undefined,
          })}`}
          aria-current={tab.key === active ? "page" : undefined}
          className={cn(
            "inline-flex h-11 items-center rounded-pill px-5 font-sans text-sm transition-colors duration-200",
            tab.key === active
              ? "bg-primary text-primary-foreground"
              : "text-foreground-muted hover:bg-surface",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}

/** Sakelar bentuk rekap. Tautan, bukan tombol, dengan alasan yang sama
 *  seperti tab di atasnya: keadaan layar ikut terbawa di URL. */
function ViewSwitch({
  active,
  filters,
}: {
  active: SummaryView;
  filters: SurveyFilters;
}) {
  const views: Array<{ key: SummaryView; label: string }> = [
    { key: "bar", label: "Batang" },
    { key: "tabel", label: "Tabel" },
  ];

  return (
    <nav
      aria-label="Bentuk rekap"
      className="flex gap-1 rounded-pill border border-border p-1"
    >
      {views.map((item) => (
        <Link
          key={item.key}
          href={`${BASE_PATH}?${filterQuery(filters, {
            tampilan: item.key === "tabel" ? item.key : undefined,
          })}`}
          aria-current={item.key === active ? "page" : undefined}
          className={cn(
            "inline-flex h-11 items-center rounded-pill px-4 font-sans text-sm transition-colors duration-200",
            item.key === active
              ? "bg-primary text-primary-foreground"
              : "text-foreground-muted hover:bg-surface",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function Ringkasan({
  rows,
  view,
  showPercent,
  filters,
}: {
  rows: SurveyRow[];
  view: SummaryView;
  showPercent: boolean;
  filters: SurveyFilters;
}) {
  const steps = summarizeBySteps(rows);

  return (
    <div className="space-y-10">
      <div className="flex justify-end">
        <ViewSwitch active={view} filters={filters} />
      </div>

      {steps.map((step) => (
        <section key={step.id}>
          <h2 className="text-lg md:text-xl">{step.title}</h2>
          <div className="mt-4 space-y-4">
            {step.questions.map((summary) => (
              <QuestionSummaryCard
                key={summary.question.id}
                summary={summary}
                total={rows.length}
                view={view}
                showPercent={showPercent}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/**
 * Daftar per orang. Sengaja kartu, bukan tabel: di 375px tabel delapan kolom
 * selalu berakhir dengan scroll mendatar, dan yang dicari orang di daftar ini
 * cuma "siapa dan kapan" sebelum membuka jawabannya.
 */
function Jawaban({
  rows,
  keyword,
  filters,
}: {
  rows: SurveyRow[];
  keyword: string;
  filters: SurveyFilters;
}) {
  const needle = keyword.toLowerCase();
  const filtered = needle
    ? rows.filter((row) =>
        String(row.name ?? "")
          .toLowerCase()
          .includes(needle),
      )
    : rows;

  return (
    <div className="space-y-5">
      <form action={BASE_PATH} className="flex flex-wrap gap-3">
        <input type="hidden" name="tab" value="jawaban" />
        {Object.entries(filters).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
        <label htmlFor="cari" className="sr-only">
          Cari nama
        </label>
        <input
          id="cari"
          name="cari"
          type="search"
          defaultValue={keyword}
          placeholder="Cari nama…"
          className="h-11 min-w-0 flex-1 rounded-pill border border-border-strong bg-surface-raised px-5 font-sans text-sm"
        />
        <button
          type="submit"
          className="inline-flex h-11 cursor-pointer items-center rounded-pill border border-border-strong px-5 font-sans text-sm transition-colors duration-200 hover:bg-surface"
        >
          Cari
        </button>
      </form>

      {filtered.length === 0 ? (
        <EmptyState>Tidak ada nama yang cocok dengan “{keyword}”.</EmptyState>
      ) : (
        <ul className="space-y-3">
          {filtered.map((row) => (
            <li key={row.id}>
              <Link
                href={`/backoffice/survei/${row.id}`}
                className="block rounded-lg border border-border bg-surface-raised p-4 transition-colors duration-200 hover:border-border-strong hover:bg-surface"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <span className="font-sans text-base font-medium">
                    {String(row.name ?? "Tanpa nama")}
                  </span>
                  <span className="font-sans text-xs text-foreground-subtle">
                    {formatTimestamp(row.created_at)}
                  </span>
                </div>
                <p className="mt-1 font-sans text-sm text-foreground-muted">
                  {summaryLine(row)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <p className="font-sans text-xs text-foreground-subtle">
        Menampilkan {formatNumber(filtered.length)} dari{" "}
        {formatNumber(rows.length)} jawaban.
      </p>
    </div>
  );
}

/** Baris pengenal singkat: umur, peran sehari-hari, dan status tinggal. */
function summaryLine(row: SurveyRow): string {
  const parts = [
    row.age ? `${row.age} tahun` : null,
    answerText("daily_role", row),
    answerText("resident_type", row),
  ];
  return parts.filter(Boolean).join(" · ") || "—";
}

function answerText(id: string, row: SurveyRow): string | null {
  const question = getQuestion(id);
  if (!question) return null;
  const value = describeAnswer(question, row);
  return value === "" ? null : value;
}
