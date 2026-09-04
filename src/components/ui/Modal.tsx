"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * Dialog modal generik: overlay penuh layar + panel yang bisa discroll
 * sendiri kalau isinya panjang. Body dikunci saat terbuka — pola yang sama
 * dipakai menu mobile di `SiteHeader` — supaya jari yang menggeser panel
 * tidak ikut menggeser halaman di belakangnya.
 */
export function Modal({
  open,
  onClose,
  labelledBy,
  children,
}: {
  open: boolean;
  onClose: () => void;
  /** id elemen judul di dalam `children`, dipasang sebagai `aria-labelledby`. */
  labelledBy: string;
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  /**
   * Diportal ke `document.body`, bukan dirender di posisi aslinya di tree:
   * elemen ber-`transform` (termasuk animasi seperti `animate-fade-up` di
   * layar pembuka survei) jadi containing block bagi anak `position: fixed`,
   * jadi `inset-0` di sini bisa kehitung relatif ke leluhur itu, bukan ke
   * viewport, tergantung dari mana Modal dipanggil. Portal membebaskannya
   * dari containing block manapun di sekitar titik panggilnya.
   */
  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={onClose}
        className="animate-fade-in absolute inset-0 bg-forest-950/60"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className="animate-fade-up relative max-h-[85dvh] w-full overflow-y-auto rounded-t-2xl border border-border bg-surface-raised p-6 shadow-xl outline-none sm:max-w-lg sm:rounded-2xl md:p-8"
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
