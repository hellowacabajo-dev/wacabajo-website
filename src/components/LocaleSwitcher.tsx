"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { locales, type Locale } from "@/lib/i18n/config";
import { getUi } from "@/lib/i18n/ui";
import { cn } from "@/lib/utils";

const label: Record<Locale, string> = { id: "ID", en: "EN" };

/**
 * Sakelar dua-opsi (bukan satu tombol ke locale lain) supaya locale yang
 * sedang aktif selalu kelihatan, bukan cuma tujuan pindahnya.
 */
export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const ui = getUi(locale);

  function hrefFor(target: Locale) {
    const rest = pathname.replace(/^\/(id|en)/, "");
    return `/${target}${rest}`;
  }

  return (
    <div
      role="group"
      aria-label={ui.localeSwitcher.ariaLabel}
      className="inline-flex items-center gap-0.5 rounded-pill border border-border-strong p-0.5"
    >
      {locales.map((item) => {
        const active = item === locale;

        if (active) {
          return (
            <span
              key={item}
              aria-current="true"
              className="flex h-11 min-w-11 items-center justify-center rounded-pill bg-primary px-3 text-xs font-semibold text-primary-foreground"
            >
              {label[item]}
            </span>
          );
        }

        return (
          <Link
            key={item}
            href={hrefFor(item)}
            className={cn(
              "flex h-11 min-w-11 items-center justify-center rounded-pill px-3 text-xs font-medium",
              "text-foreground-muted transition-colors duration-200 hover:text-foreground",
            )}
          >
            {label[item]}
          </Link>
        );
      })}
    </div>
  );
}
