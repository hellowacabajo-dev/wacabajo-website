"use client";

import { usePathname } from "next/navigation";

import { ButtonLink } from "@/components/ui/Button";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { getUi } from "@/lib/i18n/ui";

/**
 * `not-found.tsx` di dalam segment dinamis tidak menerima `params`, jadi
 * locale-nya dibaca dari pathname saat ini alih-alih dari props.
 */
export default function NotFound() {
  const pathname = usePathname();
  const segment = pathname.split("/")[1] ?? "";
  const locale = isLocale(segment) ? segment : defaultLocale;
  const ui = getUi(locale);

  return (
    <div className="mx-auto flex w-full max-w-content flex-col items-start px-6 py-28 md:px-10 md:py-40">
      <p className="font-serif text-6xl italic text-brandy-400">404</p>
      <h1 className="mt-6 max-w-xl text-3xl leading-tight md:text-5xl">
        {ui.notFound.heading}
      </h1>
      <p className="mt-5 max-w-lg text-base leading-relaxed text-foreground-muted">
        {ui.notFound.description}
      </p>
      <ButtonLink href={`/${locale}`} size="lg" className="mt-9">
        {ui.notFound.backHome}
      </ButtonLink>
    </div>
  );
}
