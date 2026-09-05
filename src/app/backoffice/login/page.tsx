import { LoginForm } from "@/components/backoffice/LoginForm";
import { Eyebrow } from "@/components/backoffice/Panel";
import { Logo } from "@/components/Logo";
import { isSupabaseConfigured } from "@/lib/supabase-env";

/**
 * Halaman masuk. Di luar `(panel)` supaya tidak ikut penjagaan sesi — kalau
 * ia berada di dalamnya, orang yang belum login akan dipulangkan ke halaman
 * ini terus-menerus.
 */

const notices: Record<string, string> = {
  "tanpa-akses":
    "Akun itu belum diberi akses backoffice. Minta admin menambahkannya di tabel backoffice_users.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ alasan?: string }>;
}) {
  const { alasan } = await searchParams;
  const notice = alasan ? notices[alasan] : undefined;

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <Logo as="plain" />
          <div className="mt-6">
            <Eyebrow>Backoffice</Eyebrow>
          </div>
          <h1 className="mt-3 text-2xl md:text-3xl">Masuk ke ruang tim</h1>
          <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
            Halaman ini berisi jawaban survei dan data kunjungan. Hanya untuk
            akun yang sudah didaftarkan.
          </p>
        </div>

        <div className="mt-10">
          {isSupabaseConfigured() ? (
            <LoginForm notice={notice} />
          ) : (
            <p className="rounded-md border border-border-strong bg-surface px-4 py-3 font-sans text-sm text-foreground-muted">
              Backoffice belum tersambung ke Supabase. Isi{" "}
              <code>NEXT_PUBLIC_SUPABASE_URL</code> dan{" "}
              <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, lalu build ulang —
              lihat <code>docs/BACKOFFICE.md</code>.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
