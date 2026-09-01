/**
 * Copy antarmuka yang tidak spesifik ke satu section beranda — navigasi,
 * footer, sakelar tema, halaman 404, dan skip link. Dipisah dari
 * `src/lib/content.ts` karena dipakai di luar halaman beranda juga.
 */

import type { Locale } from "@/lib/i18n/config";

type UiCopy = {
  skipToContent: string;
  nav: {
    ariaLabel: string;
    volunteerCta: string;
    openMenu: string;
    closeMenu: string;
  };
  theme: {
    enableLight: string;
    enableDark: string;
  };
  footer: {
    explore: string;
    connect: string;
    location: string;
  };
  notFound: {
    heading: string;
    description: string;
    backHome: string;
  };
  localeSwitcher: {
    ariaLabel: string;
  };
};

const id: UiCopy = {
  skipToContent: "Lompat ke konten",
  nav: {
    ariaLabel: "Navigasi utama",
    volunteerCta: "Jadi relawan",
    openMenu: "Buka menu",
    closeMenu: "Tutup menu",
  },
  theme: {
    enableLight: "Aktifkan mode terang",
    enableDark: "Aktifkan mode gelap",
  },
  footer: {
    explore: "Jelajahi",
    connect: "Terhubung",
    location: "Labuan Bajo, Nusa Tenggara Timur.",
  },
  notFound: {
    heading: "Ceritanya belum ada di halaman ini",
    description:
      "Tautan yang kamu buka mungkin sudah berpindah atau belum sempat kami tulis.",
    backHome: "Kembali ke beranda",
  },
  localeSwitcher: {
    ariaLabel: "Ganti bahasa",
  },
};

const en: UiCopy = {
  skipToContent: "Skip to content",
  nav: {
    ariaLabel: "Main navigation",
    volunteerCta: "Become a volunteer",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  theme: {
    enableLight: "Turn on light mode",
    enableDark: "Turn on dark mode",
  },
  footer: {
    explore: "Explore",
    connect: "Connect",
    location: "Labuan Bajo, East Nusa Tenggara.",
  },
  notFound: {
    heading: "This story hasn't been written yet",
    description:
      "The link you followed may have moved, or we haven't gotten around to writing it.",
    backHome: "Back to homepage",
  },
  localeSwitcher: {
    ariaLabel: "Switch language",
  },
};

const ui: Record<Locale, UiCopy> = { id, en };

export function getUi(locale: Locale): UiCopy {
  return ui[locale];
}
