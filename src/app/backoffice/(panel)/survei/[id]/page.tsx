import Link from "next/link";
import { notFound } from "next/navigation";

import { Eyebrow, Panel } from "@/components/backoffice/Panel";
import { SetupNotice } from "@/components/backoffice/SetupNotice";
import { requireBackofficeSession } from "@/lib/backoffice/auth";
import { formatTimestamp } from "@/lib/backoffice/dates";
import {
  fetchResponse,
  readAnswers,
  type SurveyRow,
} from "@/lib/backoffice/survey";
import { surveySteps } from "@/lib/survey/questions";

export const dynamic = "force-dynamic";

const localeNames: Record<string, string> = {
  id: "Indonesia",
  en: "Inggris",
};

/**
 * Satu jawaban utuh, urut seperti yang dilihat pengisinya. Pertanyaan yang
 * dilewati tetap ditampilkan sebagai "tidak dijawab" — itu informasi juga,
 * dan menghilangkannya membuat nomor urut pertanyaan tidak lagi cocok dengan
 * form aslinya.
 */
export default async function JawabanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { supabase } = await requireBackofficeSession();
  const { id } = await params;

  let row: SurveyRow | null;
  try {
    row = await fetchResponse(supabase, id);
  } catch (error) {
    return <SetupNotice error={error} />;
  }

  if (!row) notFound();

  const answers = readAnswers(row);
  const byId = new Map(answers.map((answer) => [answer.question.id, answer]));

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/backoffice/survei?tab=jawaban"
          className="inline-flex min-h-11 items-center font-sans text-sm text-foreground-muted underline underline-offset-4 hover:text-foreground"
        >
          ← Kembali ke daftar
        </Link>
        <div className="mt-4">
          <Eyebrow>Jawaban survei</Eyebrow>
        </div>
        <h1 className="mt-2 text-2xl md:text-3xl">
          {String(row.name ?? "Tanpa nama")}
        </h1>
        <p className="mt-1 font-sans text-xs text-foreground-subtle">
          {formatTimestamp(row.created_at)} · diisi dalam bahasa{" "}
          {localeNames[row.locale] ?? row.locale}
        </p>
      </div>

      {surveySteps.map((step) => (
        <Panel key={step.id} title={step.title.id}>
          <dl className="space-y-5">
            {step.questions.map((question) => {
              const answer = byId.get(question.id);
              const value = answer?.value ?? "";
              return (
                <div key={question.id}>
                  <dt className="font-sans text-sm font-medium">
                    {question.label.id}
                  </dt>
                  <dd
                    className={
                      value === ""
                        ? "mt-1 font-sans text-sm text-foreground-subtle italic"
                        : "mt-1 text-sm leading-relaxed whitespace-pre-line text-foreground-muted"
                    }
                  >
                    {value === "" ? "Tidak dijawab" : value}
                  </dd>
                </div>
              );
            })}
          </dl>
        </Panel>
      ))}
    </div>
  );
}
