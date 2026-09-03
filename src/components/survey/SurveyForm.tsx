"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react";

import { doodleByName } from "@/components/Doodles";
import { Button, ButtonLink } from "@/components/ui/Button";
import { SurveyField } from "@/components/survey/SurveyField";
import type { Locale } from "@/lib/i18n/config";
import { getUi } from "@/lib/i18n/ui";
import { submitSurvey } from "@/lib/survey/actions";
import {
  surveyIntro,
  surveyOutro,
  surveySteps,
  t,
} from "@/lib/survey/questions";
import {
  validateStep,
  type AnswerValue,
  type ErrorCode,
  type SurveyDraft,
} from "@/lib/survey/validate";
import { cn } from "@/lib/utils";

/**
 * Form survei need assessment.
 *
 * Satu langkah per layar, bukan satu halaman panjang: stakeholder menyebut
 * prioritasnya "senyaman mungkin diisi", dan di ponsel daftar 16 pertanyaan
 * sekaligus terbaca seperti pekerjaan. Konsekuensinya jawaban harus disimpan
 * sementara di browser — kalau tidak, satu kali refresh menghapus semuanya.
 *
 * Semua state hidup di sini dan baru dikirim sekali di akhir. Tidak ada
 * penyimpanan per langkah ke server: jawaban setengah jadi bukan data yang
 * berguna, dan mengirimnya berarti menyimpan orang yang belum menyetujui
 * apa pun.
 */

const STORAGE_KEY = "wacabajo:survei:v1";

type StoredDraft = {
  draft: SurveyDraft;
  consent: boolean;
  stepIndex: number;
};

/**
 * Isian tersimpan dibaca lewat `useSyncExternalStore`, bukan di dalam
 * `useEffect`: hook itu punya snapshot server tersendiri, jadi HTML hasil
 * render server (selalu kosong) tidak pernah berbeda dari render pertama di
 * browser — hidrasinya aman. Nilainya di-cache di level module supaya
 * snapshot-nya stabil; kalau setiap render membaca localStorage lagi, React
 * membacanya sebagai nilai baru terus dan ikut me-render ulang terus.
 */
let cachedRaw: string | null | undefined;

function readStoredDraft(): string | null {
  if (cachedRaw === undefined) {
    try {
      cachedRaw = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      cachedRaw = null;
    }
  }
  return cachedRaw;
}

/** Tidak ada yang perlu dilanggani: isian ini cuma dibaca sekali di awal. */
function neverChanges() {
  return () => {};
}

export function SurveyForm({ locale }: { locale: Locale }) {
  const ui = getUi(locale).survey;

  const [phase, setPhase] = useState<"intro" | "steps" | "done">("intro");
  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft] = useState<SurveyDraft>({});
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [errors, setErrors] = useState<Record<string, ErrorCode>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [resumeHandled, setResumeHandled] = useState(false);
  const [pending, startTransition] = useTransition();

  /** Umpan untuk bot: kolom tersembunyi yang manusia tidak akan pernah isi. */
  const honeypot = useRef("");
  const stepHeadingRef = useRef<HTMLParagraphElement>(null);
  /** Menahan fokus di awal — baru dipindahkan setelah pengisi menekan tombol. */
  const hasNavigated = useRef(false);

  const step = surveySteps[stepIndex];
  const isLastStep = stepIndex === surveySteps.length - 1;

  const storedRaw = useSyncExternalStore(
    neverChanges,
    readStoredDraft,
    () => null,
  );

  /* Isian lama yang tidak terbaca (formatnya berubah, datanya rusak)
     diperlakukan seperti tidak ada — survei harus tetap bisa diisi. */
  const stored = useMemo<StoredDraft | null>(() => {
    if (!storedRaw) return null;
    try {
      const parsed = JSON.parse(storedRaw) as StoredDraft;
      if (!parsed?.draft || Object.keys(parsed.draft).length === 0) return null;
      return parsed;
    } catch {
      return null;
    }
  }, [storedRaw]);

  useEffect(() => {
    if (phase !== "steps") return;
    try {
      const payload: StoredDraft = { draft, consent, stepIndex };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Penyimpanan penuh atau diblokir — form tetap jalan, cuma tidak pulih.
    }
  }, [draft, consent, stepIndex, phase]);

  /* Setiap ganti langkah, fokus dipindah ke judul langkah supaya pengguna
     screen reader dan keyboard tidak tertinggal di tombol langkah sebelumnya. */
  useEffect(() => {
    if (phase !== "steps" || !hasNavigated.current) return;
    stepHeadingRef.current?.focus();
  }, [stepIndex, phase]);

  function clearStorage() {
    cachedRaw = null;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Tidak apa-apa; isian tersimpan akan tertimpa pengisian berikutnya.
    }
  }

  /** Meneruskan isian yang belum selesai — dipilih sendiri oleh pengisi. */
  function handleResume() {
    if (!stored) return;
    setDraft(stored.draft);
    setConsent(stored.consent);
    setStepIndex(Math.min(stored.stepIndex ?? 0, surveySteps.length - 1));
    setResumeHandled(true);
    hasNavigated.current = true;
    setPhase("steps");
  }

  function handleDiscardStored() {
    clearStorage();
    setResumeHandled(true);
  }

  function setAnswer(id: string, value: AnswerValue) {
    setDraft((current) => ({ ...current, [id]: value }));
    setErrors((current) => {
      if (!(id in current)) return current;
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  function focusFirstError(found: Record<string, ErrorCode>) {
    const firstId = Object.keys(found)[0];
    if (!firstId) return;
    const element = document.getElementById(`q-${firstId}`);
    element?.scrollIntoView({ block: "center" });
    element?.focus({ preventScroll: true });
  }

  function goToStep(next: number) {
    hasNavigated.current = true;
    setStepIndex(next);
    setMessage(null);
  }

  function handleStart() {
    if (!consent) {
      setConsentError(true);
      return;
    }
    hasNavigated.current = true;
    setConsentError(false);
    setPhase("steps");
  }

  function handleNext() {
    const found = validateStep(step, draft);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      focusFirstError(found);
      return;
    }
    setErrors({});
    if (!isLastStep) {
      goToStep(stepIndex + 1);
      return;
    }
    handleSubmit();
  }

  function handleSubmit() {
    // Bot yang mengisi semua kolom termasuk yang tersembunyi tetap melihat
    // layar terima kasih — tidak ada sinyal bahwa jebakannya ketahuan.
    if (honeypot.current !== "") {
      clearStorage();
      setPhase("done");
      return;
    }

    startTransition(async () => {
      const result = await submitSurvey(locale, draft, consent);

      if (result.ok) {
        clearStorage();
        setPhase("done");
        window.scrollTo({ top: 0 });
        return;
      }

      if ("fieldErrors" in result) {
        setErrors(result.fieldErrors);
        // Server menemukan yang lolos dari pemeriksaan di browser: lompat ke
        // langkah pertama yang bermasalah supaya jelas apa yang perlu dibenahi.
        const firstBrokenStep = surveySteps.findIndex((entry) =>
          entry.questions.some((question) => question.id in result.fieldErrors),
        );
        if (firstBrokenStep >= 0) goToStep(firstBrokenStep);
        focusFirstError(result.fieldErrors);
        return;
      }

      setMessage(t(locale, result.message));
    });
  }

  /* ── Layar pembuka ─────────────────────────────────────────────────── */
  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-2xl animate-fade-up">
        {stored && !resumeHandled ? (
          <div className="mb-10 rounded-xl border border-border bg-surface-raised p-6">
            <p className="text-sm leading-relaxed text-foreground-muted">
              {ui.resumeNote}
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                onClick={handleResume}
                className="w-full sm:w-auto"
              >
                {ui.resumeContinue}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleDiscardStored}
                className="w-full sm:w-auto"
              >
                {ui.resumeRestart}
              </Button>
            </div>
          </div>
        ) : null}

        <p className="font-sans text-xs font-medium tracking-[0.22em] text-foreground-subtle uppercase">
          {t(locale, surveyIntro.eyebrow)}
        </p>
        <h1 className="mt-4 text-[2rem] leading-[1.1] sm:text-4xl md:text-5xl">
          {t(locale, surveyIntro.title)}
        </h1>
        <p className="mt-6 font-serif text-xl leading-relaxed italic md:text-2xl">
          {t(locale, surveyIntro.lead)}
        </p>

        <div className="mt-6 space-y-4 text-base leading-relaxed text-foreground-muted">
          {surveyIntro.body.map((paragraph) => (
            <p key={paragraph.en}>{t(locale, paragraph)}</p>
          ))}
        </div>

        <ul className="mt-8 flex flex-wrap gap-2">
          {[
            surveyIntro.duration,
            surveyIntro.questionCount,
            surveyIntro.optionalNote,
          ].map((fact) => (
            <li
              key={fact.en}
              className="rounded-pill bg-chip-brandy-bg px-3 py-1 font-sans text-xs font-medium text-chip-brandy-fg"
            >
              {t(locale, fact)}
            </li>
          ))}
        </ul>

        <div className="mt-10 rounded-xl border border-border bg-surface-raised p-6 md:p-7">
          <label className="group flex cursor-pointer items-start gap-4">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => {
                setConsent(event.target.checked);
                if (event.target.checked) setConsentError(false);
              }}
              className="peer sr-only"
              aria-describedby={consentError ? "consent-error" : undefined}
            />
            <span
              aria-hidden="true"
              className={cn(
                "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border border-border-strong",
                "transition-colors duration-200",
                "group-has-[:checked]:border-primary group-has-[:checked]:bg-primary",
                "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary",
              )}
            >
              <svg
                viewBox="0 0 12 12"
                className="h-3.5 w-3.5 text-primary-foreground opacity-0 transition-opacity duration-200 group-has-[:checked]:opacity-100"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 6.5 4.8 9.2 10 3.4" />
              </svg>
            </span>
            <span className="text-sm leading-relaxed text-foreground-muted">
              {t(locale, surveyIntro.consent)}
            </span>
          </label>

          {consentError ? (
            <p
              id="consent-error"
              role="alert"
              className="mt-4 text-sm font-medium text-primary"
            >
              {t(locale, surveyIntro.consentError)}
            </p>
          ) : null}

          <Button
            type="button"
            size="lg"
            onClick={handleStart}
            className="mt-6 w-full sm:w-auto"
          >
            {t(locale, surveyIntro.start)}
          </Button>
        </div>
      </div>
    );
  }

  /* ── Layar penutup ─────────────────────────────────────────────────── */
  if (phase === "done") {
    const Sun = doodleByName.sun;
    return (
      <div className="mx-auto max-w-2xl animate-fade-up text-center">
        <Sun className="mx-auto w-20 text-gold-400" />
        <p className="mt-8 font-sans text-xs font-medium tracking-[0.22em] text-foreground-subtle uppercase">
          {t(locale, surveyOutro.eyebrow)}
        </p>
        <h1 className="mt-4 text-[2rem] leading-[1.1] sm:text-4xl md:text-5xl">
          {t(locale, surveyOutro.title)}
        </h1>
        <div className="mt-6 space-y-4 text-base leading-relaxed text-foreground-muted">
          {surveyOutro.body.map((paragraph) => (
            <p key={paragraph.en}>{t(locale, paragraph)}</p>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <ButtonLink
            href={`/${locale}#tentang`}
            size="lg"
            className="w-full sm:w-auto"
          >
            {t(locale, surveyOutro.aboutCta)}
          </ButtonLink>
          <ButtonLink
            href={`/${locale}#gabung`}
            size="lg"
            variant="outline"
            className="w-full sm:w-auto"
          >
            {t(locale, surveyOutro.joinCta)}
          </ButtonLink>
        </div>
      </div>
    );
  }

  /* ── Pertanyaan ────────────────────────────────────────────────────── */
  const Doodle = doodleByName[step.doodle];
  const progress = ((stepIndex + 1) / surveySteps.length) * 100;

  return (
    <div className="mx-auto max-w-2xl">
      {/* Bilah kemajuan menempel di bawah header situs (tinggi 4.5rem). */}
      <div className="sticky top-18 z-30 -mx-6 bg-background/90 px-6 py-4 backdrop-blur-sm md:-mx-10 md:px-10">
        <div className="flex items-center justify-between text-xs text-foreground-subtle">
          <span>
            {ui.progress
              .replace("{current}", String(stepIndex + 1))
              .replace("{total}", String(surveySteps.length))}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div
          className="mt-2 h-1.5 w-full overflow-hidden rounded-pill bg-border"
          role="progressbar"
          aria-valuenow={stepIndex + 1}
          aria-valuemin={1}
          aria-valuemax={surveySteps.length}
          aria-label={ui.progressLabel}
        >
          <div
            className="gradient-golden-hour h-full rounded-pill transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* `key` memaksa React membuat ulang blok ini tiap langkah, jadi animasi
          masuknya berjalan lagi tanpa state animasi apa pun.

          Animasinya sengaja tidak dipasang di pembungkus terluar: `fade-up`
          meninggalkan `transform` pada elemen (animation-fill-mode: both), dan
          elemen ber-transform jadi containing block bagi anak `position:
          sticky` di dalamnya — bilah aksi di bawah jadi meleset dari dasar
          layar. Jadi yang dianimasikan hanya isinya. */}
      <div key={step.id} className="pt-6 md:pt-12">
        <div className="animate-fade-up">
          {/* Doodle sebaris dengan eyebrow, bukan bertumpuk di atasnya: di ponsel
            susunan bertumpuk mendorong pertanyaan pertama ~70px lebih jauh ke
            bawah, padahal ruang di atas layar yang paling mahal. */}
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-chip-gold-bg text-chip-gold-fg md:h-14 md:w-14">
              <Doodle className="w-7 md:w-8" />
            </span>
            <p
              ref={stepHeadingRef}
              tabIndex={-1}
              className="font-sans text-xs font-medium tracking-[0.22em] text-foreground-subtle uppercase focus:outline-none"
            >
              {t(locale, step.eyebrow)}
            </p>
          </div>

          <h1 className="mt-4 text-[1.75rem] leading-[1.15] sm:text-[2rem] md:mt-5 md:text-4xl">
            {t(locale, step.title)}
          </h1>
          {step.intro ? (
            <p className="mt-5 text-base leading-relaxed text-foreground-muted md:text-lg">
              {t(locale, step.intro)}
            </p>
          ) : null}

          <div className="mt-8 space-y-10 md:mt-12">
            {step.questions.map((question) => (
              <SurveyField
                key={question.id}
                locale={locale}
                question={question}
                value={draft[question.id]}
                otherValue={
                  typeof draft[`${question.id}_other`] === "string"
                    ? (draft[`${question.id}_other`] as string)
                    : ""
                }
                error={errors[question.id]}
                onChange={(value) => setAnswer(question.id, value)}
                onOtherChange={(value) =>
                  setAnswer(`${question.id}_other`, value)
                }
              />
            ))}
          </div>

          {/* Jebakan bot. `aria-hidden` + tabIndex -1 supaya manusia — termasuk
            pengguna screen reader — tidak pernah menemuinya. */}
          <div
            aria-hidden="true"
            className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
          >
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              onChange={(event) => {
                honeypot.current = event.target.value;
              }}
            />
          </div>

          {message ? (
            <p
              role="alert"
              className="mt-10 rounded-lg border border-border bg-surface px-5 py-4 text-sm leading-relaxed text-foreground-muted"
            >
              {message}
            </p>
          ) : null}
        </div>

        {/* Di ponsel bilah ini menempel di dasar layar. Alasannya terukur:
            langkah terpanjang butuh scroll ~1500px sebelum tombol "Lanjut"
            terlihat, jadi aksi utamanya praktis hilang. `pb` memakai
            env(safe-area-inset-bottom) supaya tidak tertimpa gesture bar
            iPhone. Mulai sm ia kembali mengalir biasa. */}
        <div
          className={cn(
            "sticky bottom-0 z-20 -mx-6 mt-10 border-t border-border bg-background/95 px-6 pt-4 backdrop-blur-sm",
            "pb-[max(1rem,env(safe-area-inset-bottom))]",
            "sm:static sm:mx-0 sm:mt-12 sm:bg-transparent sm:px-0 sm:pt-8 sm:pb-0 sm:backdrop-blur-none",
          )}
        >
          {/* `flex-row-reverse` di kedua ukuran: tombol utama tetap di kanan,
              tempat ibu jari kanan paling gampang menjangkaunya. */}
          <div className="flex flex-row-reverse items-center gap-3 sm:justify-end sm:gap-4">
            <Button
              type="button"
              size="lg"
              onClick={handleNext}
              disabled={pending}
              className="flex-1 sm:flex-none"
            >
              {pending ? ui.submitting : isLastStep ? ui.submit : ui.next}
            </Button>

            {stepIndex > 0 ? (
              <Button
                type="button"
                size="lg"
                variant="ghost"
                onClick={() => goToStep(stepIndex - 1)}
                disabled={pending}
              >
                {ui.back}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
