"use client";

import { useEffect, useState } from "react";

import type { Locale } from "@/lib/i18n/config";
import { getUi } from "@/lib/i18n/ui";

const STORAGE_KEY = "wacabajo-theme";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem(STORAGE_KEY, theme);
}

/**
 * Sakelar tema. Nilai awal diset lewat inline script di `layout.tsx` (lihat
 * `themeInitScript`) supaya tidak ada flash tema salah saat halaman pertama
 * kali dimuat — komponen ini hanya membaca ulang nilai itu dari DOM setelah
 * hydration, lalu menangani klik berikutnya.
 */
export function ThemeToggle({ locale }: { locale: Locale }) {
  const [theme, setTheme] = useState<Theme | null>(null);
  const ui = getUi(locale);

  useEffect(() => {
    // Baca nilai yang sudah diset `themeInitScript` sebelum hydration — tidak
    // bisa dibaca saat render pertama karena server tidak tahu preferensi
    // pengguna, jadi harus lewat effect meski memicu satu render tambahan.
    const current = document.documentElement.dataset.theme;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(current === "dark" ? "dark" : "light");
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? ui.theme.enableLight : ui.theme.enableDark}
      className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-pill text-foreground transition-colors duration-200 hover:bg-surface"
    >
      {/* Render setelah mount saja supaya ikon tidak salah sebelum tema
          terbaca dari DOM (mencegah kedipan ikon yang keliru). */}
      {theme ? (
        theme === "dark" ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="10" cy="10" r="4" />
            <path d="M10 1.5v2M10 16.5v2M18.5 10h-2M3.5 10h-2M15.6 4.4l-1.4 1.4M5.8 14.2l-1.4 1.4M15.6 15.6l-1.4-1.4M5.8 5.8L4.4 4.4" />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M17 11.2A7.2 7.2 0 018.8 3a7.2 7.2 0 108.2 8.2z" />
          </svg>
        )
      ) : (
        <span className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}
