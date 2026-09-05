import { notFound } from "next/navigation";

import { doodleByName, HeroDoodles } from "@/components/Doodles";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardBadge, CardBody, CardTitle } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Container } from "@/components/ui/Container";
import { Eyebrow, Section, SectionHeading } from "@/components/ui/Section";
import { getContent } from "@/lib/content";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getRoute } from "@/lib/i18n/routes";
import { siteConfig } from "@/lib/site";

/**
 * Beranda.
 *
 * Urutan section mengikuti alur "kenapa → apa → siapa → bagaimana":
 * hero, fondasi, keyakinan, nilai, ikut terlibat, ajakan penutup.
 * Pengunjung baru dapat gambaran utuh tanpa perlu tahu istilah apa pun.
 *
 * Seluruh copy hidup di `src/lib/content.ts`, per locale; halaman ini hanya
 * menyusun tata letaknya.
 */

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type PageParams = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: PageParams) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale: Locale = localeParam;

  const { hero, heroFacts, foundation, belief, values, join, finalCta } =
    getContent(locale);

  // Formulir rekrutmen belum tentu sudah ada. Selama URL-nya kosong, tombolnya
  // tidak dirender sama sekali — lebih baik daripada tautan mati.
  const joinFormUrl = siteConfig.forms.join;

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="gradient-cream-veil relative overflow-hidden">
        <HeroDoodles />

        <Container className="relative py-16 sm:py-24 md:py-32">
          <div className="mx-auto max-w-3xl animate-fade-up text-center">
            <Chip tone="brandy" className="gap-2 px-4 py-1.5">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-pill bg-chip-brandy-fg"
              />
              {hero.eyebrow}
            </Chip>

            <h1 className="mt-6 text-[2.25rem] leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl">
              {hero.title}
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-foreground-muted sm:text-lg md:mt-7 md:text-xl">
              {hero.description}
            </p>

            {/* Kutipan pembuka — satu-satunya kalimat bersuara "kami percaya"
                di hero, jadi dibedakan lewat serif italic, bukan ukuran. */}
            <p className="mx-auto mt-6 max-w-xl border-t border-border pt-6 font-serif text-lg leading-relaxed text-foreground italic md:text-xl">
              {hero.quote}
            </p>

            {/* Tombol melebar penuh di ponsel supaya target sentuhnya besar
                dan tidak pernah pecah jadi dua baris. */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4 md:mt-10">
              <ButtonLink
                href={hero.joinCta.href}
                size="lg"
                className="w-full sm:w-auto"
              >
                {hero.joinCta.label}
              </ButtonLink>
              <ButtonLink
                href={getRoute(locale, "survey")}
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
              >
                {hero.surveyCta.label}
              </ButtonLink>
              <ButtonLink
                href={hero.aboutCta.href}
                size="lg"
                variant="ghost"
                className="w-full sm:w-auto"
              >
                {hero.aboutCta.label}
              </ButtonLink>
            </div>
          </div>

          {/* Strip fakta — fakta struktural, bukan angka dampak. */}
          <dl className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 md:mt-16">
            {heroFacts.map((fact) => (
              <div
                key={fact.label}
                className="bg-background px-6 py-5 text-center sm:py-6"
              >
                <dt className="sr-only">{fact.label}</dt>
                <dd>
                  <span className="block text-xl leading-tight font-bold tracking-tight sm:text-2xl md:text-[1.75rem]">
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
        <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-3">
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

      {/* ── Yang kami percayai ────────────────────────────────────────── */}
      <Section tone="forest">
        <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-14">
          <div className="reveal">
            <Eyebrow className="text-gold-300">{belief.eyebrow}</Eyebrow>
            {/* Satu-satunya tempat Sorts Mill Goudy tampil sebesar ini. */}
            <p className="font-serif text-[2.75rem] leading-[1.05] font-normal tracking-normal sm:text-5xl md:text-6xl">
              {belief.tagline.split(" ").map((word) => (
                <span key={word} className="block">
                  {word}
                </span>
              ))}
            </p>
          </div>
          {/* Garis pemisah pindah ke atas di ponsel — di lebar sempit dua
              kolom menumpuk, jadi garis kiri kehilangan maknanya. */}
          <p className="reveal border-t border-cream-50/20 pt-8 font-serif text-lg leading-relaxed text-cream-100 italic sm:text-xl md:border-t-0 md:border-l md:pt-0 md:pl-8 md:text-2xl">
            {belief.statement}
          </p>
        </div>
      </Section>

      {/* ── Nilai ─────────────────────────────────────────────────────── */}
      <Section id="nilai">
        <SectionHeading
          eyebrow={values.eyebrow}
          title={values.title}
          description={values.description}
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
          {values.items.map((value) => (
            <Card key={value.name} className="reveal flex flex-col">
              <Chip tone={value.tone} className="self-start">
                {value.name}
              </Chip>
              <CardTitle className="mt-4 text-lg md:text-xl">
                {value.meaning}
              </CardTitle>
              <CardBody className="flex-1 text-sm md:text-sm">
                {value.practice}
              </CardBody>
            </Card>
          ))}
        </div>
      </Section>

      {/* ── Ikut terlibat ─────────────────────────────────────────────── */}
      <Section id="gabung" tone="surface">
        <SectionHeading
          eyebrow={join.eyebrow}
          title={join.title}
          description={join.description}
        />
        {/* Gambaran kegiatan yang baru disiapkan. Ditaruh di section ini,
            bukan jadi section sendiri, supaya terbaca sebagai jawaban atas
            "nanti aku ngapain?" — bukan sebagai jadwal yang sudah jalan. */}
        <div className="reveal mt-12 rounded-xl border border-border bg-background p-7 md:mt-16 md:p-10">
          <h3 className="text-xl leading-snug md:text-2xl">
            {join.plans.title}
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-foreground-muted md:text-base">
            {join.plans.description}
          </p>
        </div>
      </Section>

      {/* ── Ajakan penutup ────────────────────────────────────────────── */}
      <section className="bg-background pb-20 md:pb-28 lg:pb-32">
        <Container>
          <div className="reveal relative overflow-hidden rounded-xl bg-gold-300 px-6 py-14 text-center sm:px-8 md:px-16 md:py-20">
            {/* Doodle matahari sebagai aksen sudut — dekoratif. */}
            {(() => {
              const Sun = doodleByName.sun;
              return (
                <Sun className="pointer-events-none absolute -top-8 -right-8 w-32 text-gold-700/20 md:w-40" />
              );
            })()}

            <h2 className="relative mx-auto max-w-2xl text-[1.75rem] leading-[1.1] text-persephone-950 sm:text-3xl md:text-5xl">
              {finalCta.title}
            </h2>
            <p className="relative mx-auto mt-5 max-w-xl text-base leading-relaxed text-persephone-900 md:mt-6">
              {finalCta.description}
            </p>
            <div className="relative mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4 md:mt-10">
              {joinFormUrl ? (
                <ButtonLink
                  href={joinFormUrl}
                  size="lg"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto"
                >
                  {finalCta.formLabel}
                </ButtonLink>
              ) : null}
              <ButtonLink
                href={`mailto:${siteConfig.social.email}`}
                size="lg"
                variant={joinFormUrl ? "outline" : "primary"}
                className={
                  joinFormUrl
                    ? "w-full border-persephone-950/25 text-persephone-950 hover:border-persephone-950/40 hover:bg-gold-200 sm:w-auto"
                    : "w-full sm:w-auto"
                }
              >
                {finalCta.primaryLabel}
              </ButtonLink>
              <ButtonLink
                href={siteConfig.social.instagram}
                size="lg"
                variant="outline"
                target="_blank"
                rel="noreferrer"
                className="w-full border-persephone-950/25 text-persephone-950 hover:border-persephone-950/40 hover:bg-gold-200 sm:w-auto"
              >
                {finalCta.secondaryLabel}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
