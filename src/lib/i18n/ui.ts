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
  /** Kerangka form survei; isi pertanyaannya ada di `src/lib/survey`. */
  survey: {
    navLabel: string;
    optional: string;
    otherOption: string;
    otherPlaceholder: string;
    /** `{current}` dan `{total}` diganti saat render. */
    progress: string;
    progressLabel: string;
    back: string;
    next: string;
    submit: string;
    submitting: string;
    resumeNote: string;
    resumeContinue: string;
    resumeRestart: string;
  };
};

const id: UiCopy = {
  skipToContent: "Lompat ke konten",
  nav: {
    ariaLabel: "Navigasi utama",
    volunteerCta: "Ikut terlibat",
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
  survey: {
    navLabel: "Survei",
    optional: "Opsional",
    otherOption: "Lainnya",
    otherPlaceholder: "Tulis sendiri di sini",
    progress: "Langkah {current} dari {total}",
    progressLabel: "Kemajuan pengisian survei",
    back: "Kembali",
    next: "Lanjut",
    submit: "Kirim jawaban",
    submitting: "Mengirim...",
    resumeNote:
      "Di perangkat ini ada isian survei yang belum selesai. Mau dilanjutkan?",
    resumeContinue: "Lanjutkan isian",
    resumeRestart: "Mulai dari awal",
  },
};

const en: UiCopy = {
  skipToContent: "Skip to content",
  nav: {
    ariaLabel: "Main navigation",
    volunteerCta: "Get involved",
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
  survey: {
    navLabel: "Survey",
    optional: "Optional",
    otherOption: "Something else",
    otherPlaceholder: "Tell us in your own words",
    progress: "Step {current} of {total}",
    progressLabel: "Survey progress",
    back: "Back",
    next: "Continue",
    submit: "Send my answers",
    submitting: "Sending...",
    resumeNote:
      "There is an unfinished survey saved on this device. Pick up where you left off?",
    resumeContinue: "Continue where I stopped",
    resumeRestart: "Start over",
  },
};

const ui: Record<Locale, UiCopy> = { id, en };

export function getUi(locale: Locale): UiCopy {
  return ui[locale];
}
