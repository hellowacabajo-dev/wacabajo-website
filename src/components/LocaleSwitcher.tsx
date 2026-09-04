"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { locales, type Locale } from "@/lib/i18n/config";
import { localizePath } from "@/lib/i18n/routes";
import { getUi } from "@/lib/i18n/ui";
import { cn } from "@/lib/utils";

// Nama bahasa ditulis penuh (bukan kode "ID"/"EN") supaya jelas untuk
// pengunjung yang belum tentu familiar dengan kode locale.
const label: Record<Locale, string> = {
  id: "Bahasa Indonesia",
  en: "English",
};

/**
 * Sakelar dua-opsi (bukan satu tombol ke locale lain) supaya locale yang
 * sedang aktif selalu kelihatan, bukan cuma tujuan pindahnya.
 *
 * Label penuh butuh ruang lebih lebar dari kode dua huruf, jadi di header
 * mobile sakelar ini dipindah ke dalam menu (lihat `SiteHeader`) lewat
 * `className` supaya bisa melebar penuh di sana.
 */
export function LocaleSwitcher({
  locale,
  className,
}: {
  locale: Locale;
  className?: string;
}) {
  const pathname = usePathname();
  const ui = getUi(locale);

  function hrefFor(target: Locale) {
    return localizePath(pathname, locale, target);
  }

  return (
    <div
      role="group"
      aria-label={ui.localeSwitcher.ariaLabel}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-pill border border-border-strong p-0.5",
        className,
      )}
    >
      {locales.map((item) => {
        const active = item === locale;

        if (active) {
          return (
            <span
              key={item}
              aria-current="true"
              className="flex h-11 flex-1 items-center justify-center rounded-pill bg-primary px-3 text-xs font-semibold whitespace-nowrap text-primary-foreground"
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
              "flex h-11 flex-1 items-center justify-center rounded-pill px-3 text-xs font-medium whitespace-nowrap",
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
