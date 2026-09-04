"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { locales, type Locale } from "@/lib/i18n/config";
import { localizePath } from "@/lib/i18n/routes";
import { getUi } from "@/lib/i18n/ui";
import { cn } from "@/lib/utils";

// Sama seperti `LocaleSwitcher` — nama bahasa ditulis penuh, bukan kode.
const label: Record<Locale, string> = {
  id: "Bahasa Indonesia",
  en: "English",
};

/**
 * Versi ringkas `LocaleSwitcher` untuk top bar mobile.
 *
 * Pill dua-segmen nama penuh (~200px) tidak muat di 375px berdampingan
 * dengan logo, sakelar tema, dan tombol menu. Ini cuma menampilkan bahasa
 * yang sedang aktif; tombolnya membuka menu kecil berisi pilihan lain — nama
 * tetap penuh, cuma interaksinya jadi dropdown alih-alih pill sejajar.
 */
export function LocaleMenuButton({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const ui = getUi(locale);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={ui.localeSwitcher.ariaLabel}
        className="inline-flex h-11 items-center gap-1 rounded-pill border border-border-strong px-2.5 text-xs font-semibold whitespace-nowrap text-foreground transition-colors duration-200 hover:bg-surface"
      >
        {label[locale]}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={cn("transition-transform duration-200", open && "rotate-180")}
        >
          <path d="M2 3.5 5 6.5 8 3.5" />
        </svg>
      </button>

      {open ? (
        <ul
          role="menu"
          className="absolute top-[calc(100%+0.5rem)] right-0 z-50 min-w-40 overflow-hidden rounded-xl border border-border bg-surface-raised py-1 shadow-card"
        >
          {locales.map((item) => {
            const active = item === locale;
            return (
              <li key={item} role="none">
                {active ? (
                  <span
                    role="menuitem"
                    aria-current="true"
                    className="flex min-h-11 items-center px-4 text-sm font-semibold text-foreground"
                  >
                    {label[item]}
                  </span>
                ) : (
                  <Link
                    role="menuitem"
                    href={localizePath(pathname, locale, item)}
                    onClick={() => setOpen(false)}
                    className="flex min-h-11 items-center px-4 text-sm text-foreground-muted transition-colors duration-200 hover:bg-surface hover:text-foreground"
                  >
                    {label[item]}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
