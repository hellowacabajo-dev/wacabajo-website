import type { Metadata } from "next";

import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, CardBody, CardTitle } from "@/components/ui/Card";
import { Eyebrow, Section, SectionHeading } from "@/components/ui/Section";
import {
  DoodleBook,
  DoodleGlasses,
  DoodlePencil,
  DoodlePinisi,
  DoodleSparkle,
  DoodleSpeech,
  DoodleSprout,
  DoodleSun,
  DoodleWave,
} from "@/components/Doodles";
import { Chip } from "@/components/ui/Chip";
import {
  brandFoundation,
  brandPersonality,
  chipPairings,
  colorFamilies,
  colorPairings,
  copyRules,
  toneOfVoice,
  typography,
} from "@/lib/brand";

export const metadata: Metadata = {
  title: "Brand system",
  description:
    "Token warna, tipografi, dan komponen dasar Waca Bajo — diturunkan langsung dari Brand Guidelines 2026.",
};

/**
 * Style guide hidup.
 *
 * Halaman ini merender token yang sama dengan yang dipakai produksi, jadi
 * kalau ada warna atau komponen yang berubah, perubahannya langsung kelihatan
 * di sini. Datanya berasal dari src/lib/brand.ts.
 */
export default function BrandPage() {
  return (
    <>
      <section className="gradient-cream-veil border-b border-border">
        <div className="mx-auto w-full max-w-content px-6 py-20 md:px-10 md:py-24">
          <Eyebrow className="text-foreground-subtle">
            Waca Bajo Brand Guidelines 2026
          </Eyebrow>
          <h1 className="max-w-3xl text-4xl leading-tight md:text-6xl">
            Brand system, dalam bentuk yang bisa dipakai langsung
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground-muted">
            Semua token di halaman ini adalah token yang sama yang dipakai
            komponen produksi. Ubah di{" "}
            <code className="rounded-sm bg-surface px-1.5 py-0.5 text-sm">
              src/app/globals.css
            </code>{" "}
            dan{" "}
            <code className="rounded-sm bg-surface px-1.5 py-0.5 text-sm">
              src/lib/brand.ts
            </code>
            , lalu halaman ini ikut berubah.
          </p>
        </div>
      </section>

      {/* ── Palet warna ───────────────────────────────────────────────── */}
      <Section id="warna">
        <SectionHeading
          align="left"
          eyebrow="Color study"
          title="Palet & tint/shade range"
          description="Step yang ditandai titik adalah nilai yang tercetak di deck. Sisanya diinterpolasi di ruang OKLab agar jarak terang antar-step terasa rata."
        />

        <div className="mt-14 space-y-14">
          {colorFamilies.map((family) => (
            <div key={family.key}>
              <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                <h3 className="text-2xl">{family.name}</h3>
                <p className="max-w-xl text-sm leading-relaxed text-foreground-muted">
                  {family.meaning}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-11">
                {family.steps.map((step) => (
                  <div key={step.step}>
                    <div
                      className="h-16 rounded-md border border-black/5"
                      style={{ backgroundColor: step.hex }}
                    />
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-foreground-subtle">
                      {step.step}
                      {step.fromDeck ? (
                        <span
                          title="Nilai tercetak di brand guidelines"
                          aria-label="Nilai tercetak di brand guidelines"
                          className="inline-block h-1.5 w-1.5 rounded-pill bg-persephone-600"
                        />
                      ) : null}
                    </p>
                    <p className="font-mono text-[0.7rem] text-foreground-subtle">
                      {step.hex}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Pasangan warna ────────────────────────────────────────────── */}
      <Section tone="surface">
        <SectionHeading
          align="left"
          eyebrow="Color pairings"
          title="Kombinasi yang aman untuk teks"
          description="Hanya pasangan di bawah ini yang lolos WCAG AA. Sunset Gold tidak pernah dipakai sebagai warna teks di atas Vintage Cream (rasionya hanya 1.9:1)."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {colorPairings.map((pair) => (
            <div
              key={pair.label}
              className={`rounded-lg border border-border p-7 ${pair.bgClass} ${pair.fgClass}`}
            >
              <p className="font-display text-xl leading-snug">{pair.label}</p>
              <p className="mt-3 text-sm opacity-90">{pair.usage}</p>
              <p className="mt-6 text-xs tracking-[0.18em] uppercase opacity-80">
                Kontras {pair.ratio}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-border pt-10">
          <h3 className="text-2xl">Pasangan chip</h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground-muted">
            Tint terang dari satu keluarga warna dipasangkan dengan step 900
            keluarga yang sama. Semuanya lolos AAA, jadi aman untuk teks sekecil
            chip dan tag.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {chipPairings.map((pair) => (
              <span
                key={pair.label}
                className={`inline-flex items-center gap-2 rounded-pill px-4 py-2 text-sm ${pair.bgClass} ${pair.fgClass}`}
              >
                {pair.label}
                <span className="text-xs opacity-70">{pair.ratio}</span>
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Gradients ─────────────────────────────────────────────────── */}
      <Section>
        <SectionHeading
          align="left"
          eyebrow="Gradients"
          title="Tiga gradasi turunan"
          description="Diturunkan dari palet inti untuk kebutuhan banner, pita, dan latar dekoratif. Jangan dipakai sebagai latar teks panjang."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            { name: "Golden hour", className: "gradient-golden-hour" },
            { name: "Forest & sea", className: "gradient-forest-sea" },
            { name: "Cream veil", className: "gradient-cream-veil" },
          ].map((gradient) => (
            <div key={gradient.name}>
              <div
                className={`h-40 rounded-lg border border-border ${gradient.className}`}
              />
              <p className="mt-3 text-sm text-foreground-muted">
                {gradient.name}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Tipografi ─────────────────────────────────────────────────── */}
      <Section tone="surface">
        <SectionHeading
          align="left"
          eyebrow="Typography"
          title="Dua typeface, dua peran"
          description="Deck menempatkan Bricolage Grotesque sebagai primary dan Sorts Mill Goudy sebagai secondary, dan menyatakan keduanya boleh dipakai untuk heading. Di web, Bricolage memegang headline, body, dan seluruh elemen UI; Goudy dipakai sebagai aksen — wordmark, kutipan, dan angka besar."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {[typography.primary, typography.secondary].map((face, index) => (
            <Card key={face.name} className="bg-background">
              <p
                className={`text-6xl ${index === 0 ? "font-sans font-bold tracking-tight" : "font-display"}`}
              >
                Aa
              </p>
              <CardTitle className="mt-6">{face.name}</CardTitle>
              <CardBody>{face.note}</CardBody>
              <dl className="mt-6 grid grid-cols-[7rem_1fr] gap-y-2 border-t border-border pt-5 text-sm">
                <dt className="text-foreground-subtle">Klasifikasi</dt>
                <dd>{face.classification}</dd>
                <dt className="text-foreground-subtle">Usability</dt>
                <dd>{face.usability}</dd>
                <dt className="text-foreground-subtle">Source</dt>
                <dd>{face.source}</dd>
              </dl>
            </Card>
          ))}
        </div>

        <div className="mt-12 rounded-lg border border-border bg-background p-8 md:p-12">
          <h3 className="text-4xl leading-[1.12] md:text-5xl">
            Empathic, collaborative &amp; inclusive branding of Waca Bajo
          </h3>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-foreground-muted">
            Perjalanan yang dilalui bersama membuat cerita semakin bermakna!
          </p>
          <p className="mt-8 max-w-2xl font-display text-lg leading-relaxed italic">
            “Melalui buku, cerita, dan kebersamaan, membangun ruang tempat
            manusia belajar, saling memahami, dan berkembang bersama.”
          </p>
          <p className="mt-8 text-sm text-foreground-subtle">
            Semua headline memakai Sentence case, mengikuti aturan di deck.
          </p>
        </div>
      </Section>

      {/* ── Komponen ──────────────────────────────────────────────────── */}
      <Section>
        <SectionHeading
          align="left"
          eyebrow="Components"
          title="Komponen dasar"
          description="Titik awal untuk halaman baru. Semua varian sudah memakai pasangan warna yang lolos AA."
        />

        <div className="mt-12 space-y-10">
          <div>
            <p className="mb-4 text-sm text-foreground-subtle">Button</p>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="accent">Accent</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <ButtonLink href="/" variant="primary" size="sm">
                Link kecil
              </ButtonLink>
              <Button variant="primary" size="lg">
                Ukuran besar
              </Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </div>
          </div>

          <div className="rounded-lg bg-forest-950 p-8">
            <p className="mb-4 text-sm text-cream-300">
              Button di atas section gelap
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="inverse">Inverse</Button>
              <Button variant="accent">Accent</Button>
            </div>
          </div>

          <div>
            <p className="mb-4 text-sm text-foreground-subtle">Card</p>
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardTitle>Judul kartu</CardTitle>
                <CardBody>
                  Body memakai Bricolage Grotesque dengan warna Brandy 800 agar
                  tetap terbaca di atas kanvas cream.
                </CardBody>
              </Card>
              <Card className="bg-surface">
                <CardTitle>Varian surface</CardTitle>
                <CardBody>
                  Untuk kartu yang berdiri di atas latar putih atau cream muda.
                </CardBody>
              </Card>
              <div className="rounded-lg bg-maritime-700 p-7 text-cream-50">
                <h3 className="text-xl md:text-2xl">Varian tone</h3>
                <p className="mt-3 text-sm leading-relaxed text-cream-100">
                  Latar Maritime Outpost 700 dengan teks Vintage Cream — 9.1:1.
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-4 text-sm text-foreground-subtle">Chip</p>
            <div className="flex flex-wrap items-center gap-3">
              <Chip tone="forest">Rutin mingguan</Chip>
              <Chip tone="persephone">Anak &amp; remaja</Chip>
              <Chip tone="maritime">Keliling kampung</Chip>
              <Chip tone="gold">Reflective</Chip>
              <Chip tone="brandy">Netral</Chip>
            </div>
          </div>

          <div>
            <p className="mb-4 text-sm text-foreground-subtle">
              Doodle — ilustrasi garis, diwarnai lewat `currentColor`
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <DoodleBook className="w-12 text-persephone-600" />
              <DoodlePinisi className="w-12 text-maritime-600" />
              <DoodleSprout className="w-12 text-forest-600" />
              <DoodleSun className="w-12 text-gold-500" />
              <DoodleGlasses className="w-12 text-brandy-500" />
              <DoodleSpeech className="w-12 text-persephone-500" />
              <DoodlePencil className="w-12 text-brandy-600" />
              <DoodleWave className="w-12 text-maritime-500" />
              <DoodleSparkle className="w-8 text-gold-500" />
            </div>
          </div>
        </div>
      </Section>

      {/* ── Suara & copy ──────────────────────────────────────────────── */}
      <Section id="suara" tone="surface">
        <SectionHeading
          align="left"
          eyebrow="Voice & copy"
          title="Cara menulis kalimat Waca Bajo"
          description="Bagian Foundation di deck bukan sekadar latar belakang. Tiga kutipan di bawah ini yang menentukan sebuah kalimat boleh tayang atau tidak — kalimat yang tidak bisa ditarik kembali ke salah satunya kemungkinan besar bukan suara kami."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {brandFoundation.map((entry) => (
            <Card key={entry.label} className="bg-background">
              <p className="text-xs tracking-[0.18em] text-foreground-subtle uppercase">
                {entry.label} · hlm. {entry.page}
              </p>
              <p className="mt-5 font-display text-lg leading-relaxed italic">
                “{entry.quote}”
              </p>
            </Card>
          ))}
        </div>

        <div className="mt-14 border-t border-border pt-10">
          <h3 className="text-2xl">Tiga pilar tone of voice</h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground-muted">
            Deck hanya mencantumkan namanya. Kolom “lakukan” dan “hindari”
            adalah penerjemahannya jadi keputusan menulis, supaya pilar ini
            tidak berhenti sebagai kata sifat.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {toneOfVoice.map((tone) => (
              <Card key={tone.name} className="bg-background">
                <CardTitle className="text-lg md:text-xl">
                  {tone.name}
                </CardTitle>
                <CardBody className="text-sm">{tone.meaning}</CardBody>
                <dl className="mt-6 space-y-4 border-t border-border pt-5 text-sm">
                  <div>
                    <dt className="text-xs tracking-[0.18em] text-foreground-subtle uppercase">
                      Lakukan
                    </dt>
                    <dd className="mt-1.5 leading-relaxed">{tone.apply}</dd>
                  </div>
                  <div>
                    <dt className="text-xs tracking-[0.18em] text-foreground-subtle uppercase">
                      Hindari
                    </dt>
                    <dd className="mt-1.5 leading-relaxed text-foreground-muted">
                      {tone.avoid}
                    </dd>
                  </div>
                </dl>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-14 border-t border-border pt-10">
          <h3 className="text-2xl">Aturan penulisan</h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground-muted">
            Tiap aturan menyebut pasal deck yang jadi dasarnya, jadi bisa
            dibantah dengan membuka halamannya — bukan dengan beradu selera.
          </p>
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {copyRules.map((item) => (
              <li
                key={item.rule}
                className="rounded-lg border border-border bg-background p-6"
              >
                <p className="leading-snug font-bold">{item.rule}</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                  {item.basis}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ── Brand personality ─────────────────────────────────────────── */}
      <Section tone="forest">
        <SectionHeading
          align="left"
          eyebrow="Brand personality"
          title="Kata-kata yang menjaga nada"
          description="Dipakai sebagai rambu saat menulis copy: kalau sebuah kalimat tidak terasa seperti salah satu kata di bawah, kemungkinan besar nadanya meleset."
          eyebrowClassName="text-gold-300"
          descriptionClassName="text-cream-200"
        />
        <ul className="mt-10 flex flex-wrap gap-3">
          {brandPersonality.map((word) => (
            <li
              key={word}
              className="rounded-pill border border-cream-50/25 px-5 py-2 text-sm text-cream-100"
            >
              {word}
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
