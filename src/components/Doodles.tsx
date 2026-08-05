/**
 * Doodle — ilustrasi garis yang dipakai sebagai elemen dekoratif.
 *
 * Semuanya digambar sebagai stroke `currentColor`, jadi warnanya diatur lewat
 * utility teks Tailwind (`text-forest-600`, `text-maritime-700`, dst.) dan
 * tidak ada satu pun hex yang dihardcode di sini. Ukuran ikut `width`/`height`
 * dari className pemanggil.
 *
 * Motifnya diambil dari hal-hal yang dekat dengan Labuan Bajo dan dari
 * kegiatan membaca itu sendiri: buku, perahu pinisi, tunas, matahari sore,
 * kacamata baca, gelombang, percakapan, dan pensil.
 *
 * Semua bersifat dekoratif — pemanggil wajib menandai `aria-hidden` pada
 * pembungkusnya (komponen ini sudah menyetel `aria-hidden` sendiri).
 */

type DoodleProps = {
  className?: string;
};

/** Properti stroke yang dipakai bersama supaya semua doodle terasa satu tangan. */
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function Svg({
  className,
  viewBox = "0 0 64 64",
  children,
}: DoodleProps & { viewBox?: string; children: React.ReactNode }) {
  return (
    <svg
      viewBox={viewBox}
      className={className}
      aria-hidden="true"
      focusable="false"
      {...stroke}
    >
      {children}
    </svg>
  );
}

/** Buku terbuka — inti dari gerakan ini. */
export function DoodleBook({ className }: DoodleProps) {
  return (
    <Svg className={className}>
      <path d="M32 20C26 15 16 13.5 9 15.5v30C16 43.5 26 45 32 50" />
      <path d="M32 20c6-5 16-6.5 23-4.5v30c-7-2-17-.5-23 4.5" />
      <path d="M32 20v30" />
      <path d="M15 24h10M15 31h9M39 24h10M39 31h9" />
    </Svg>
  );
}

/** Perahu pinisi — kapal layar khas perairan Bajo. */
export function DoodlePinisi({ className }: DoodleProps) {
  return (
    <Svg className={className}>
      <path d="M8 42h48l-7 11H15z" />
      <path d="M32 42V6" />
      <path d="M34 12l14 30H34zM30 18L16 42h14z" />
      <path d="M4 58c5 3.5 11 3.5 16 0s11-3.5 16 0 11 3.5 16 0" />
    </Svg>
  );
}

/** Tunas — "Growing Through Stories" dalam satu bentuk. */
export function DoodleSprout({ className }: DoodleProps) {
  return (
    <Svg className={className}>
      <path d="M32 58V26" />
      <path d="M32 40c-9 0-16-7-16-16 9 0 16 7 16 16z" />
      <path d="M32 33c8 0 14-6 14-14-8 0-14 6-14 14z" />
      <path d="M22 58h20" />
    </Svg>
  );
}

/** Matahari sore — golden hour, warna paling khas Bajo. */
export function DoodleSun({ className }: DoodleProps) {
  return (
    <Svg className={className}>
      <circle cx="32" cy="32" r="13" />
      <path d="M32 4v8M32 52v8M4 32h8M52 32h8M12.2 12.2l5.7 5.7M46.1 46.1l5.7 5.7M51.8 12.2l-5.7 5.7M17.9 46.1l-5.7 5.7" />
    </Svg>
  );
}

/** Kacamata baca. */
export function DoodleGlasses({ className }: DoodleProps) {
  return (
    <Svg className={className}>
      <circle cx="17" cy="36" r="11" />
      <circle cx="47" cy="36" r="11" />
      <path d="M28 34c2.5-3 5.5-3 8 0" />
      <path d="M6 26l3 6M58 26l-3 6" />
    </Svg>
  );
}

/** Gelombang laut. */
export function DoodleWave({ className }: DoodleProps) {
  return (
    <Svg className={className} viewBox="0 0 68 44">
      <path d="M4 11c6-8 14-8 20 0s14 8 20 0 14-8 20 0" />
      <path d="M4 23c6-8 14-8 20 0s14 8 20 0 14-8 20 0" />
      <path d="M4 35c6-8 14-8 20 0s14 8 20 0 14-8 20 0" />
    </Svg>
  );
}

/** Balon percakapan — cerita yang berpindah dari mulut ke mulut. */
export function DoodleSpeech({ className }: DoodleProps) {
  return (
    <Svg className={className}>
      <path d="M14 12h36a7 7 0 017 7v18a7 7 0 01-7 7H30L18 56V44h-4a7 7 0 01-7-7V19a7 7 0 017-7z" />
      <path d="M21 27h1M31 27h1M41 27h1" />
    </Svg>
  );
}

/** Pensil — menulis dan mencatat cerita. */
export function DoodlePencil({ className }: DoodleProps) {
  return (
    <Svg className={className}>
      <path d="M13 51l3.5-11L43 13l8 8-26.5 27z" />
      <path d="M16.5 40l8 8M40 16l8 8" />
      <path d="M13 51l7-2.5" />
    </Svg>
  );
}

/** Kilau kecil — aksen, dipakai berpasangan dengan doodle lain. */
export function DoodleSparkle({ className }: DoodleProps) {
  return (
    <Svg className={className}>
      <path d="M32 7c2 14 11 23 25 25-14 2-23 11-25 25-2-14-11-23-25-25 14-2 23-11 25-25z" />
    </Svg>
  );
}

/**
 * Peta nama → komponen, supaya data di `src/lib/content.ts` cukup menyebut
 * doodle-nya sebagai string dan tidak perlu mengimpor komponen React.
 */
export const doodleByName = {
  book: DoodleBook,
  pinisi: DoodlePinisi,
  sprout: DoodleSprout,
  sun: DoodleSun,
  glasses: DoodleGlasses,
  speech: DoodleSpeech,
  pencil: DoodlePencil,
} as const;

/**
 * Susunan doodle yang berserak di sekitar hero.
 *
 * Ditempatkan absolut terhadap hero dan memakai `inset-0` +
 * `pointer-events-none` supaya tidak pernah menghalangi klik.
 *
 * Soal lebar: kolom teks hero adalah `max-w-3xl` (768px) di tengah, jadi
 * doodle baru punya margin yang cukup mulai dari lg (1024px) — di bawah itu
 * teks memenuhi hampir seluruh lebar layar dan doodle apa pun pasti
 * menabraknya. Karena itu ada dua susunan:
 *
 * - di bawah lg: dua doodle kecil di pita kosong atas hero (padding `py-24`
 *   menyisakan 96px yang benar-benar kosong sebelum eyebrow mulai);
 * - lg ke atas: sebaran penuh di margin kiri-kanan kolom teks.
 */
export function HeroDoodles() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* Layar kecil & tablet — hanya di pita kosong paling atas. */}
      <DoodleBook className="absolute top-6 left-5 w-11 -rotate-12 text-persephone-600/70 lg:hidden" />
      <DoodleSun className="absolute top-5 right-5 w-12 text-gold-500/80 lg:hidden" />

      {/* lg ke atas — sebaran penuh, semuanya di luar rentang kolom teks. */}
      <DoodleBook className="absolute top-[12%] left-[4%] hidden w-20 -rotate-12 text-persephone-600/70 lg:block" />
      <DoodleSun className="absolute top-[8%] right-[7%] hidden w-24 text-gold-500/80 lg:block" />
      <DoodlePinisi className="absolute bottom-[16%] left-[7%] hidden w-20 rotate-6 text-maritime-600/70 lg:block" />
      <DoodleSprout className="absolute right-[5%] bottom-[20%] hidden w-20 text-forest-600/75 lg:block" />
      <DoodleGlasses className="absolute top-[46%] left-[2%] hidden w-16 -rotate-6 text-brandy-500/70 xl:block" />
      <DoodleSpeech className="absolute top-[30%] right-[3%] hidden w-14 rotate-6 text-persephone-500/60 xl:block" />
      <DoodleWave className="absolute bottom-[8%] left-[46%] hidden w-16 text-maritime-500/60 lg:block" />
      <DoodleSparkle className="absolute top-[27%] right-[14%] hidden w-6 text-gold-500/70 lg:block" />
      <DoodlePencil className="absolute bottom-[30%] left-[24%] hidden w-12 -rotate-12 text-brandy-500/60 xl:block" />
    </div>
  );
}
