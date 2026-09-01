import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

type Tone = "cream" | "surface" | "forest" | "persephone" | "maritime";

/**
 * Pembungkus section beserta ritme vertikalnya.
 *
 * `tone` membatasi pilihan latar ke pasangan warna yang sudah lolos WCAG AA
 * (tabelnya di `docs/DESIGN.md` §1) — jadi tidak perlu mengingat kombinasi
 * mana yang aman setiap kali menambah section baru.
 */
const toneClass: Record<Tone, string> = {
  cream: "bg-background text-foreground",
  surface: "bg-surface text-foreground",
  forest: "bg-forest-950 text-cream-50",
  persephone: "bg-persephone-950 text-cream-50",
  maritime: "bg-maritime-700 text-cream-50",
};

export function Section({
  id,
  tone = "cream",
  className,
  containerClassName,
  children,
}: {
  id?: string;
  tone?: Tone;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-20 md:py-28 lg:py-32",
        toneClass[tone],
        className,
      )}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

/** Label kecil di atas judul section (eyebrow). */
export function Eyebrow({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "mb-4 font-sans text-xs font-medium tracking-[0.22em] uppercase",
        className,
      )}
    >
      {children}
    </p>
  );
}

/**
 * Judul section beserta eyebrow dan deskripsinya.
 *
 * Default-nya rata tengah dengan lebar baca terbatas — pola yang dipakai di
 * seluruh beranda supaya ritme antar-section konsisten. Kelas `reveal`
 * membuatnya muncul saat masuk viewport (lihat `globals.css`).
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  eyebrowClassName,
  descriptionClassName,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  eyebrowClassName?: string;
  descriptionClassName?: string;
}) {
  return (
    <div
      className={cn(
        "reveal max-w-2xl",
        align === "center" && "mx-auto text-center",
      )}
    >
      {eyebrow ? (
        <Eyebrow className={cn("text-foreground-subtle", eyebrowClassName)}>
          {eyebrow}
        </Eyebrow>
      ) : null}
      <h2 className="text-[1.75rem] leading-[1.15] sm:text-[2rem] sm:leading-[1.12] md:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-5 text-base leading-relaxed text-foreground-muted md:text-lg",
            descriptionClassName,
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
