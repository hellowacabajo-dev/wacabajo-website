import { doodleByName, HeroDoodles } from "@/components/Doodles";
import { ProgramCard } from "@/components/ProgramCard";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardBadge, CardBody, CardTitle } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Container } from "@/components/ui/Container";
import { Eyebrow, Section, SectionHeading } from "@/components/ui/Section";
import { brandEssence, brandValues, toneOfVoice } from "@/lib/brand";
import {
  finalCta,
  foundation,
  hero,
  heroFacts,
  joinSteps,
  programs,
  valuePractice,
} from "@/lib/content";
import { siteConfig } from "@/lib/site";

/**
 * Beranda.
 *
 * Urutan section mengikuti alur "kenapa → apa → siapa → bagaimana":
 * hero, fondasi, program, esensi brand, nilai, cara bergabung, ajakan penutup.
 * Pengunjung baru dapat gambaran utuh tanpa perlu tahu istilah brand apa pun.
 *
 * Seluruh copy hidup di `src/lib/content.ts`; halaman ini hanya menyusun
 * tata letaknya.
 */

export default function HomePage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="gradient-cream-veil relative overflow-hidden">
        <HeroDoodles />

        <Container className="relative py-24 md:py-32">
          <div className="mx-auto max-w-3xl animate-fade-up text-center">
            <Chip tone="brandy" className="gap-2 px-4 py-1.5">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-pill bg-chip-brandy-fg"
              />
              {hero.eyebrow}
            </Chip>

            <h1 className="mt-6 text-[2.75rem] leading-[1.03] sm:text-6xl md:text-7xl">
              {hero.title}
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-foreground-muted md:text-xl">
              {hero.description}
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <ButtonLink href={hero.primaryCta.href} size="lg">
                {hero.primaryCta.label}
              </ButtonLink>
              <ButtonLink
                href={hero.secondaryCta.href}
                size="lg"
                variant="outline"
              >
                {hero.secondaryCta.label}
              </ButtonLink>
            </div>
          </div>

          {/* Strip fakta — bukan angka dampak, lihat catatan di content.ts. */}
          <dl className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
            {heroFacts.map((fact) => (
              <div
                key={fact.label}
                className="bg-background px-6 py-6 text-center"
              >
                <dt className="sr-only">{fact.label}</dt>
                <dd>
                  <span className="block text-2xl leading-tight font-bold tracking-tight md:text-3xl">
                    {fact.value}
                  </span>
                  <span className="mt-1 block text-sm text-foreground-subtle">
                    {fact.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Container>

        {/* Pita golden hour di tepi bawah hero — dekoratif. */}
        <div aria-hidden="true" className="gradient-golden-hour h-1.5 w-full" />
      </section>

      {/* ── Fondasi ───────────────────────────────────────────────────── */}
      <Section id="tentang">
        <SectionHeading
          eyebrow={foundation.eyebrow}
          title={foundation.title}
          description={foundation.description}
        />
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {foundation.items.map((item) => {
            const Doodle = doodleByName[item.doodle];
            return (
              <Card key={item.title} className="reveal">
                <CardBadge tone={item.tone}>
                  <Doodle className="w-8" />
                </CardBadge>
                <CardTitle>{item.title}</CardTitle>
                <CardBody>{item.body}</CardBody>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* ── Program ───────────────────────────────────────────────────── */}
      <Section id="program" tone="surface">
        <SectionHeading
          eyebrow={programs.eyebrow}
          title={programs.title}
          description={programs.description}
        />
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {programs.items.map((program) => (
            <ProgramCard
              key={program.title}
              tone={program.tone}
              doodle={program.doodle}
              title={program.title}
              body={program.body}
              tags={program.tags}
            />
          ))}
        </div>
      </Section>

      {/* ── Esensi brand ──────────────────────────────────────────────── */}
      <Section tone="forest">
        <div className="grid gap-14 md:grid-cols-[1.1fr_1fr] md:items-center">
          <div className="reveal">
            <Eyebrow className="text-gold-300">Esensi brand</Eyebrow>
            {/* Satu-satunya tempat Sorts Mill Goudy tampil sebesar ini. */}
            <p className="font-display text-5xl leading-[1.05] font-normal tracking-normal md:text-6xl">
              {brandEssence.split(" ").map((word) => (
                <span key={word} className="block">
                  {word}
                </span>
              ))}
            </p>
          </div>
          <figure className="reveal border-l border-cream-50/20 pl-8">
            <blockquote className="font-display text-xl leading-relaxed text-cream-100 italic md:text-2xl">
              “Kamu calon konglomerat ya, kamu harus rajin belajar dan membaca,
              jangan ditelan sendiri. Berbagilah dengan teman-teman yang tak
              mendapat pendidikan.”
            </blockquote>
            <figcaption className="mt-6 text-sm text-cream-300">
              Kutipan pembuka pada Brand Guidelines Waca Bajo
            </figcaption>
          </figure>
        </div>
      </Section>

      {/* ── Nilai & tone of voice ─────────────────────────────────────── */}
      <Section id="nilai">
        <SectionHeading
          eyebrow="Nilai"
          title="Empat nilai yang menjaga cara kami bekerja"
          description="Bukan slogan — ini yang kami pakai untuk memutuskan hal-hal kecil sehari-hari."
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {brandValues.map((value) => {
            const practice = valuePractice[value.name];
            return (
              <Card key={value.name} className="reveal flex flex-col">
                <Chip tone={practice.tone} className="self-start">
                  {value.name}
                </Chip>
                <CardTitle className="mt-4 text-lg md:text-xl">
                  {value.description}
                </CardTitle>
                <CardBody className="flex-1 text-sm">{practice.body}</CardBody>
              </Card>
            );
          })}
        </div>

        <div className="reveal mt-16 border-t border-border pt-10">
          <Eyebrow className="text-foreground-subtle">Cara kami bicara</Eyebrow>
          <ul className="flex flex-wrap gap-3">
            {toneOfVoice.map((tone) => (
              <li
                key={tone.name}
                className="rounded-pill border border-border-strong px-5 py-2 text-sm text-foreground-muted"
              >
                {tone.name}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ── Cara bergabung ────────────────────────────────────────────── */}
      <Section tone="surface">
        <SectionHeading
          eyebrow={joinSteps.eyebrow}
          title={joinSteps.title}
          description={joinSteps.description}
        />
        <ol className="mt-16 grid gap-6 md:grid-cols-3">
          {joinSteps.items.map((step, index) => (
            <li
              key={step.title}
              className="reveal rounded-xl border border-border bg-surface-raised p-7 shadow-soft"
            >
              <span
                aria-hidden="true"
                className="inline-flex h-10 w-10 items-center justify-center rounded-pill bg-chip-gold-bg text-sm font-bold text-chip-gold-fg"
              >
                {index + 1}
              </span>
              <h3 className="mt-5 text-xl leading-snug">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground-muted md:text-base">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ── Ajakan penutup ────────────────────────────────────────────── */}
      <section id="gabung" className="bg-background pb-24 md:pb-32">
        <Container>
          <div className="reveal relative overflow-hidden rounded-xl bg-gold-300 px-8 py-16 text-center md:px-16 md:py-20">
            {/* Doodle matahari sebagai aksen sudut — dekoratif. */}
            {(() => {
              const Sun = doodleByName.sun;
              return (
                <Sun className="pointer-events-none absolute -top-8 -right-8 w-40 text-gold-700/20" />
              );
            })()}

            <h2 className="relative mx-auto max-w-2xl text-3xl leading-[1.1] text-persephone-950 md:text-5xl">
              {finalCta.title}
            </h2>
            <p className="relative mx-auto mt-6 max-w-xl text-base leading-relaxed text-persephone-900">
              {finalCta.description}
            </p>
            <div className="relative mt-10 flex flex-wrap justify-center gap-4">
              <ButtonLink href={`mailto:${siteConfig.social.email}`} size="lg">
                Kirim email ke kami
              </ButtonLink>
              <ButtonLink
                href={siteConfig.social.instagram}
                size="lg"
                variant="outline"
                target="_blank"
                rel="noreferrer"
                className="border-persephone-950/25 text-persephone-950 hover:border-persephone-950/40 hover:bg-gold-200"
              >
                Ikuti di Instagram
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
