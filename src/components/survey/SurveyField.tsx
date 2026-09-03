"use client";

import type { Locale } from "@/lib/i18n/config";
import { getUi } from "@/lib/i18n/ui";
import { OTHER_VALUE, t, type SurveyQuestion } from "@/lib/survey/questions";
import {
  getErrorMessage,
  type AnswerValue,
  type ErrorCode,
} from "@/lib/survey/validate";
import { cn } from "@/lib/utils";

/**
 * Satu pertanyaan survei beserta kontrolnya.
 *
 * Pilihan memakai `<input type="radio">`/`<input type="checkbox">` asli yang
 * di-`sr-only`, bukan div yang dibuat mirip: dengan begitu keyboard, screen
 * reader, dan pengisian otomatis tetap bekerja seperti form biasa, sementara
 * tampilannya bebas. Kotak yang terlihat adalah `<span>` tetangganya, yang
 * bereaksi lewat `peer-checked:`; bagian di dalamnya (kotak centang kecil)
 * memakai `group-has-[:checked]:` karena ia bukan tetangga input, melainkan
 * cucunya.
 */

const inputClass =
  "w-full rounded-lg border border-border bg-surface-raised px-4 py-3 text-base " +
  "text-foreground placeholder:text-foreground-subtle " +
  "transition-colors duration-200 hover:border-border-strong " +
  "focus:border-primary";

function OptionCard({
  type,
  name,
  value,
  label,
  checked,
  onChange,
}: {
  type: "radio" | "checkbox";
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (value: string, checked: boolean) => void;
}) {
  return (
    <label className="group block cursor-pointer">
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={(event) => onChange(value, event.target.checked)}
        className="peer sr-only"
      />
      <span
        className={cn(
          "flex min-h-14 items-center gap-3 rounded-lg border border-border bg-surface-raised px-4 py-3",
          "text-sm leading-snug transition-[border-color,background-color,transform] duration-200 md:text-base",
          // Ponsel tidak punya hover: tanpa state :active, menekan kartu tidak
          // memberi tanda apa pun sampai React selesai me-render.
          "group-hover:border-border-strong group-active:scale-[0.99] group-active:border-border-strong group-active:bg-surface",
          "peer-checked:border-primary peer-checked:bg-surface",
          "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center border border-border-strong",
            "transition-colors duration-200",
            type === "radio" ? "rounded-pill" : "rounded-sm",
            "group-has-[:checked]:border-primary group-has-[:checked]:bg-primary",
          )}
        >
          <svg
            viewBox="0 0 12 12"
            className="h-3 w-3 text-primary-foreground opacity-0 transition-opacity duration-200 group-has-[:checked]:opacity-100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 6.5 4.8 9.2 10 3.4" />
          </svg>
        </span>
        {label}
      </span>
    </label>
  );
}

export function SurveyField({
  locale,
  question,
  value,
  otherValue,
  error,
  onChange,
  onOtherChange,
}: {
  locale: Locale;
  question: SurveyQuestion;
  value: AnswerValue | undefined;
  otherValue: string;
  error?: ErrorCode;
  onChange: (value: AnswerValue) => void;
  onOtherChange: (value: string) => void;
}) {
  const ui = getUi(locale).survey;
  const selected = Array.isArray(value) ? value : value ? [value] : [];
  const errorId = `${question.id}-error`;
  const describedBy = error ? errorId : undefined;
  const showOther = question.other === true && selected.includes(OTHER_VALUE);

  const options = (question.options ?? []).map((option) => ({
    value: option.value,
    label: t(locale, option.label),
  }));
  const allOptions = question.other
    ? [...options, { value: OTHER_VALUE, label: ui.otherOption }]
    : options;

  function toggle(optionValue: string, checked: boolean) {
    if (question.type !== "checkbox") {
      onChange(optionValue);
      return;
    }
    onChange(
      checked
        ? [...selected, optionValue]
        : selected.filter((entry) => entry !== optionValue),
    );
  }

  const heading = (
    <>
      {t(locale, question.label)}
      {!question.required ? (
        <span className="ml-2 align-middle text-xs tracking-[0.14em] text-foreground-subtle uppercase">
          {ui.optional}
        </span>
      ) : null}
    </>
  );

  const help = question.help ? (
    <p className="mt-2 text-sm text-foreground-subtle">
      {t(locale, question.help)}
    </p>
  ) : null;

  const otherInput = showOther ? (
    <div className="mt-3">
      <label htmlFor={`${question.id}_other`} className="sr-only">
        {ui.otherOption}
      </label>
      <input
        id={`${question.id}_other`}
        name={`${question.id}_other`}
        type="text"
        maxLength={120}
        value={otherValue}
        onChange={(event) => onOtherChange(event.target.value)}
        placeholder={ui.otherPlaceholder}
        aria-describedby={describedBy}
        className={inputClass}
      />
    </div>
  ) : null;

  const errorNote = error ? (
    <p
      id={errorId}
      role="alert"
      className="mt-3 text-sm font-medium text-primary"
    >
      {getErrorMessage(locale, error)}
    </p>
  ) : null;

  /* Pilihan ganda & skala → fieldset/legend, supaya screen reader membacakan
     pertanyaannya sekali untuk seluruh kelompok pilihan. */
  if (
    question.type === "radio" ||
    question.type === "checkbox" ||
    question.type === "scale"
  ) {
    const scale = question.scale;

    return (
      <fieldset
        id={`q-${question.id}`}
        tabIndex={-1}
        className="reveal focus:outline-none"
      >
        <legend className="text-lg leading-snug font-medium md:text-xl">
          {heading}
        </legend>
        {help}

        {scale ? (
          <div className="mt-5">
            <div className="flex gap-2 sm:gap-3">
              {Array.from({ length: scale.max - scale.min + 1 }, (_, index) =>
                String(scale.min + index),
              ).map((step) => (
                <label key={step} className="group flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name={question.id}
                    value={step}
                    checked={selected.includes(step)}
                    onChange={() => onChange(step)}
                    className="peer sr-only"
                    aria-describedby={describedBy}
                  />
                  <span
                    className={cn(
                      "flex h-14 items-center justify-center rounded-lg border border-border bg-surface-raised",
                      "text-lg transition-[border-color,background-color,color,transform] duration-200 md:text-xl",
                      "group-hover:border-border-strong group-active:scale-[0.97] group-active:border-border-strong",
                      "peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground",
                      "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary",
                    )}
                  >
                    {step}
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-3 flex justify-between text-xs text-foreground-subtle">
              <span>{t(locale, scale.minLabel)}</span>
              <span>{t(locale, scale.maxLabel)}</span>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "mt-5 grid gap-3",
              allOptions.length > 4 ? "sm:grid-cols-2" : "",
            )}
          >
            {allOptions.map((option) => (
              <OptionCard
                key={option.value}
                type={question.type === "radio" ? "radio" : "checkbox"}
                name={question.id}
                value={option.value}
                label={option.label}
                checked={selected.includes(option.value)}
                onChange={toggle}
              />
            ))}
          </div>
        )}

        {otherInput}
        {errorNote}
      </fieldset>
    );
  }

  return (
    <div
      id={`q-${question.id}`}
      tabIndex={-1}
      className="reveal focus:outline-none"
    >
      <label
        htmlFor={question.id}
        className="block text-lg leading-snug font-medium md:text-xl"
      >
        {heading}
      </label>
      {help}

      <div className="mt-5">
        {question.type === "paragraph" ? (
          <textarea
            id={question.id}
            name={question.id}
            rows={5}
            maxLength={question.maxLength}
            value={typeof value === "string" ? value : ""}
            onChange={(event) => onChange(event.target.value)}
            placeholder={
              question.placeholder ? t(locale, question.placeholder) : undefined
            }
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(inputClass, "resize-y leading-relaxed")}
          />
        ) : (
          <input
            id={question.id}
            name={question.id}
            type="text"
            inputMode={question.type === "number" ? "numeric" : "text"}
            pattern={question.type === "number" ? "[0-9]*" : undefined}
            autoComplete={question.id === "name" ? "name" : "off"}
            maxLength={question.maxLength}
            value={typeof value === "string" ? value : ""}
            onChange={(event) => onChange(event.target.value)}
            placeholder={
              question.placeholder ? t(locale, question.placeholder) : undefined
            }
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={inputClass}
          />
        )}
      </div>

      {errorNote}
    </div>
  );
}
