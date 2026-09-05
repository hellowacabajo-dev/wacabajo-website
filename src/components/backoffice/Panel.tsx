import { cn } from "@/lib/utils";

/**
 * Kotak dasar backoffice. Sudutnya lebih kecil daripada `Card` di situs
 * publik (12px, bukan 28px): di halaman yang penuh angka, sudut besar memakan
 * ruang baca dan membuat tabel terlihat mengambang.
 */
export function Panel({
  title,
  meta,
  action,
  className,
  children,
}: {
  title?: string;
  meta?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-lg border border-border bg-surface-raised p-5 md:p-6",
        className,
      )}
    >
      {(title || action) && (
        <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            {title && (
              <h2 className="text-base leading-snug md:text-lg">{title}</h2>
            )}
            {meta && (
              <p className="mt-1 font-sans text-xs text-foreground-subtle">
                {meta}
              </p>
            )}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

/** Label kecil huruf besar — satu-satunya tempat uppercase dipakai di sini. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-xs font-medium tracking-[0.14em] uppercase text-foreground-subtle">
      {children}
    </p>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-md border border-dashed border-border px-4 py-6 text-center font-sans text-sm text-foreground-subtle">
      {children}
    </p>
  );
}
