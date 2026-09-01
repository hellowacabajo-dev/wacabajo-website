import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-content flex-col items-start px-6 py-28 md:px-10 md:py-40">
      <p className="font-display text-6xl italic text-brandy-400">404</p>
      <h1 className="mt-6 max-w-xl text-3xl leading-tight md:text-5xl">
        Ceritanya belum ada di halaman ini
      </h1>
      <p className="mt-5 max-w-lg text-base leading-relaxed text-foreground-muted">
        Tautan yang kamu buka mungkin sudah berpindah atau belum sempat kami
        tulis.
      </p>
      <ButtonLink href="/" size="lg" className="mt-9">
        Kembali ke beranda
      </ButtonLink>
    </div>
  );
}
