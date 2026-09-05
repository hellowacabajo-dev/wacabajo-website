import { BackofficeNav } from "@/components/backoffice/BackofficeNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { Container } from "@/components/ui/Container";
import { signOut } from "@/lib/backoffice/actions";

/**
 * Bingkai halaman backoffice: identitas, navigasi, dan tombol keluar.
 *
 * Tombol keluar berupa `<form action={serverAction}>`, bukan tombol yang
 * memanggil API dari klien: sesi Supabase tersimpan di cookie, dan cookie
 * hanya boleh dihapus dari server.
 */

export function BackofficeShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="border-b border-border bg-surface-raised">
        <Container className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-3">
          <div className="flex min-w-0 items-baseline gap-3">
            <Logo as="plain" className="text-xl md:text-2xl" />
            <span className="font-sans text-xs text-foreground-subtle">
              backoffice
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span
              className="hidden max-w-[16rem] truncate font-sans text-xs text-foreground-subtle sm:block"
              title={email}
            >
              {email}
            </span>
            <ThemeToggle locale="id" />
            <form action={signOut}>
              <button
                type="submit"
                className="inline-flex h-11 cursor-pointer items-center rounded-pill px-4 font-sans text-sm text-foreground-muted transition-colors duration-200 hover:bg-surface"
              >
                Keluar
              </button>
            </form>
          </div>
        </Container>

        {/* Di 375px tiga tab ini pas tanpa perlu scroll; `overflow-x-auto`
            di dalam `BackofficeNav` jaga-jaga kalau nanti bertambah. */}
        <Container>
          <BackofficeNav />
        </Container>
      </header>

      <main className="flex-1 py-8 md:py-12">
        <Container>{children}</Container>
      </main>
    </>
  );
}
