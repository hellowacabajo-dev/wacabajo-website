import { notFound } from "next/navigation";

/**
 * Menangkap semua path di luar beranda supaya request-nya tetap masuk ke
 * dalam layout tree `[locale]` — tanpa ini, Next.js melompat ke 404 generik
 * bawaan alih-alih `not-found.tsx` yang sudah dibrand dan dwibahasa.
 */
export default function CatchAll() {
  notFound();
}
