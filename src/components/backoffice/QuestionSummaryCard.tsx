import Link from "next/link";

import { BarList } from "@/components/backoffice/BarList";
import { EmptyState, Panel } from "@/components/backoffice/Panel";
import { SummaryTable } from "@/components/backoffice/SummaryTable";
import { formatNumber } from "@/lib/backoffice/labels";
import type { QuestionSummary } from "@/lib/backoffice/survey";

/** Batang untuk melihat sekilas, tabel untuk menyalin angkanya. */
export type SummaryView = "bar" | "tabel";

/**
 * Rekap satu pertanyaan.
 *
 * Bentuknya mengikuti jenis pertanyaannya, bukan satu tampilan untuk semua:
 * pilihan ganda paling terbaca sebagai batang, skala butuh rata-rata, dan
 * jawaban terbuka tidak bisa dijadikan angka sama sekali — di sana yang
 * berguna justru kalimat aslinya.
 */
export function QuestionSummaryCard({
  summary,
  total,
  view = "bar",
  showPercent = true,
}: {
  summary: QuestionSummary;
  total: number;
  view?: SummaryView;
  /** Dimatikan saat jawabannya masih terlalu sedikit untuk dipersenkan. */
  showPercent?: boolean;
}) {
  const skipped = total - summary.answered;
  const meta = [
    `${formatNumber(summary.answered)} dari ${formatNumber(total)} menjawab`,
    skipped > 0 ? `${formatNumber(skipped)} melewati` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Panel title={summary.question.label.id} meta={meta}>
      {summary.answered === 0 ? (
        <EmptyState>Belum ada yang menjawab pertanyaan ini.</EmptyState>
      ) : (
        <Body summary={summary} view={view} showPercent={showPercent} />
      )}
    </Panel>
  );
}

function Body({
  summary,
  view,
  showPercent,
}: {
  summary: QuestionSummary;
  view: SummaryView;
  showPercent: boolean;
}) {
  if (summary.kind === "choice") {
    const items = summary.options.map((option) => ({
      label: option.label,
      count: option.count,
    }));

    return (
      <>
        {view === "tabel" ? (
          <SummaryTable
            items={items}
            total={summary.answered}
            showPercent={showPercent}
          />
        ) : (
          <BarList
            items={items}
            total={summary.answered}
            limit={30}
            unit="opsi"
            showPercent={showPercent}
          />
        )}
        {summary.otherTexts.length > 0 && (
          <details className="mt-5">
            <summary className="inline-flex min-h-11 cursor-pointer items-center font-sans text-sm text-foreground-muted">
              Isian “lainnya” ({formatNumber(summary.otherTexts.length)})
            </summary>
            <ul className="mt-2 space-y-1">
              {summary.otherTexts.map((text, index) => (
                <li
                  key={`${text}-${index}`}
                  className="rounded-md bg-surface px-3 py-2 font-sans text-sm"
                >
                  {text}
                </li>
              ))}
            </ul>
          </details>
        )}
      </>
    );
  }

  if (summary.kind === "scale") {
    const items = summary.counts.map((point) => ({
      label: point.label,
      count: point.count,
    }));

    return (
      <>
        <p className="mb-4 font-sans text-sm text-foreground-muted">
          Rata-rata{" "}
          <strong className="font-sans font-semibold text-foreground">
            {summary.average.toFixed(1)}
          </strong>{" "}
          dari {summary.question.scale?.max ?? 5}
        </p>
        {view === "tabel" ? (
          <SummaryTable
            items={items}
            total={summary.answered}
            head="Nilai"
            showPercent={showPercent}
          />
        ) : (
          <BarList
            items={items}
            total={summary.answered}
            limit={10}
            unit="nilai"
            showPercent={showPercent}
          />
        )}
      </>
    );
  }

  if (summary.kind === "number") {
    const items = summary.buckets.map((bucket) => ({
      label: bucket.label,
      count: bucket.count,
    }));

    return (
      <>
        <p className="mb-4 font-sans text-sm text-foreground-muted">
          Rata-rata{" "}
          <strong className="font-sans font-semibold text-foreground">
            {summary.average.toFixed(1)}
          </strong>{" "}
          · terendah {summary.lowest} · tertinggi {summary.highest}
        </p>
        {view === "tabel" ? (
          <SummaryTable
            items={items}
            total={summary.answered}
            head="Kelompok"
            showPercent={showPercent}
          />
        ) : (
          <BarList
            items={items}
            total={summary.answered}
            limit={15}
            unit="kelompok"
            showPercent={showPercent}
          />
        )}
      </>
    );
  }

  // Jawaban terbuka. Dibatasi tingginya supaya satu pertanyaan yang dijawab
  // panjang oleh 200 orang tidak mendorong pertanyaan berikutnya jauh ke bawah.
  // Tidak ada versi tabelnya: yang berguna di sini kalimatnya, bukan angkanya.
  return (
    <ul className="max-h-96 space-y-2 overflow-y-auto pr-1">
      {summary.answers.map((answer, index) => (
        <li
          key={`${answer.id}-${index}`}
          className="rounded-md bg-surface px-4 py-3"
        >
          <p className="text-sm leading-relaxed whitespace-pre-line">
            {answer.text}
          </p>
          <Link
            href={`/backoffice/survei/${answer.id}`}
            className="mt-2 inline-flex min-h-11 items-center font-sans text-xs text-foreground-subtle underline underline-offset-4 hover:text-foreground"
          >
            {answer.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
