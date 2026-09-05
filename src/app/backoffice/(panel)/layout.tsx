import { BackofficeShell } from "@/components/backoffice/BackofficeShell";
import { requireBackofficeSession } from "@/lib/backoffice/auth";

/**
 * Semua halaman di dalam grup `(panel)` terjaga di sini, jadi tidak ada
 * halaman baru yang bisa lupa memeriksa sesinya sendiri. `src/proxy.ts` sudah
 * memulangkan tamu tak dikenal lebih dulu; pemeriksaan ini yang menjadi
 * pegangan kalau proxy-nya suatu saat tidak jalan.
 *
 * Nama grupnya berkurung supaya tidak ikut jadi segmen URL — halaman di
 * dalamnya tetap `/backoffice`, bukan `/backoffice/panel`.
 */
export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { email } = await requireBackofficeSession();

  return <BackofficeShell email={email}>{children}</BackofficeShell>;
}
