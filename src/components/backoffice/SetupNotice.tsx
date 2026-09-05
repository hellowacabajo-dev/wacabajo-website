import { Panel } from "@/components/backoffice/Panel";

/**
 * Yang paling sering bikin halaman ini kosong bukan bug, melainkan
 * `supabase/backoffice.sql` yang belum dijalankan. Daripada menampilkan layar
 * error Next.js, pesannya dijelaskan di tempat — lengkap dengan bunyi asli
 * error dari Postgres, karena itu yang menentukan langkah berikutnya.
 */
export function SetupNotice({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : String(error);

  return (
    <Panel title="Data belum bisa dibaca">
      <p className="text-sm leading-relaxed text-foreground-muted">
        Biasanya ini berarti <code>supabase/backoffice.sql</code> belum
        dijalankan di SQL Editor Supabase, atau akun ini belum terdaftar di
        tabel <code>backoffice_users</code>. Langkahnya ada di{" "}
        <code>docs/BACKOFFICE.md</code>.
      </p>
      <pre className="mt-4 overflow-x-auto rounded-md bg-surface p-4 font-mono text-xs text-foreground-muted">
        {message}
      </pre>
    </Panel>
  );
}
