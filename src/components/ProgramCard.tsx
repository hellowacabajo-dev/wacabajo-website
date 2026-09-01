import { doodleByName } from "@/components/Doodles";
import { ChipOnDark } from "@/components/ui/Chip";
import { cn } from "@/lib/utils";

import type { BrandTone, DoodleName } from "@/lib/content";

/**
 * Kartu program: kepala berwarna pekat berisi doodle besar dan tag, lalu badan
 * putih berisi judul dan penjelasan.
 *
 * Kepala kartu hanya memakai tone yang teks cream-nya lolos AA (lihat tabel
 * pasangan warna di `docs/DESIGN-SYSTEM.md` §1), jadi `ChipOnDark` selalu
 * terbaca di atasnya.
 */
const headerTone: Record<Extract<BrandTone, "forest" | "persephone" | "maritime">, string> = {
  forest: "bg-forest-800", // cream 8.4:1
  persephone: "bg-persephone-800", // cream 7.9:1
  maritime: "bg-maritime-700", // cream 8.4:1
};

export type ProgramCardProps = {
  tone: BrandTone;
  doodle: DoodleName;
  title: string;
  body: string;
  tags: readonly string[];
  className?: string;
};

export function ProgramCard({
  tone,
  doodle,
  title,
  body,
  tags,
  className,
}: ProgramCardProps) {
  const Doodle = doodleByName[doodle];
  const header =
    tone === "forest" || tone === "persephone" || tone === "maritime"
      ? headerTone[tone]
      : headerTone.forest;

  return (
    <article
      className={cn(
        "reveal group flex flex-col overflow-hidden rounded-xl border border-border",
        "bg-surface-raised shadow-soft transition-[box-shadow,transform] duration-200 ease-out",
        "hover:-translate-y-1 hover:shadow-card",
        className,
      )}
    >
      <div
        className={cn(
          "relative flex h-44 items-end overflow-hidden p-5",
          header,
        )}
      >
        {/* Doodle besar sebagai latar — dekoratif, digeser keluar tepi. */}
        <Doodle
          className={cn(
            "pointer-events-none absolute -top-6 -right-6 w-44 text-cream-50/25",
            "transition-transform duration-300 ease-out group-hover:scale-105",
          )}
        />
        <div className="relative flex flex-wrap gap-2">
          {tags.map((tag) => (
            <ChipOnDark key={tag}>{tag}</ChipOnDark>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-7">
        <h3 className="text-xl leading-snug md:text-2xl">{title}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground-muted md:text-base">
          {body}
        </p>
      </div>
    </article>
  );
}
