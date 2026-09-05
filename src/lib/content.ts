/**
 * Seluruh copy beranda sebagai data, per locale.
 *
 * Dipisahkan dari komponen supaya teks bisa disunting tanpa menyentuh markup.
 * Aturan menulisnya ada di `docs/DESIGN.md` §3 — ringkasnya: Sentence case
 * untuk headline, sebut yang konkret, dan jangan menaruh angka dampak yang
 * datanya belum ada. Berlaku untuk kedua bahasa.
 *
 * Versi Inggris ditulis ulang sebagai teks Inggris yang berdiri sendiri, bukan
 * terjemahan kalimat per kalimat dari versi Indonesia — permintaan stakeholder
 * supaya nadanya terdengar manusiawi, bukan hasil translate.
 */

import type { Locale } from "@/lib/i18n/config";

/** Keluarga warna brand yang boleh dipakai sebagai tone komponen. */
export type BrandTone =
  "forest" | "persephone" | "maritime" | "gold" | "brandy";

/** Nama doodle di `src/components/Doodles.tsx`. */
export type DoodleName =
  | "book"
  | "pinisi"
  | "sprout"
  | "sun"
  | "glasses"
  | "speech"
  | "pencil"
  | "wave"
  | "sparkle";

interface HeroContent {
  eyebrow: string;
  title: string;
  description: string;
  /** Kutipan pembuka, tampil italic di bawah deskripsi. */
  quote: string;
  joinCta: { label: string; href: string };
  /** Tautannya ke halaman survei internal (`src/lib/i18n/routes.ts`). */
  surveyCta: { label: string };
  aboutCta: { label: string; href: string };
}

interface HeroFact {
  value: string;
  label: string;
}

interface FoundationItem {
  tone: BrandTone;
  doodle: DoodleName;
  title: string;
  body: string;
}

interface FoundationContent {
  eyebrow: string;
  title: string;
  description: string;
  items: FoundationItem[];
}

interface BeliefContent {
  eyebrow: string;
  /** Tagline brand — nama diri, sengaja sama di kedua locale. */
  tagline: string;
  statement: string;
}

interface ValueItem {
  tone: BrandTone;
  name: string;
  meaning: string;
  practice: string;
}

interface ValuesContent {
  eyebrow: string;
  title: string;
  description: string;
  items: ValueItem[];
}

interface JoinContent {
  eyebrow: string;
  title: string;
  description: string;
  /**
   * Gambaran kegiatan yang baru disiapkan. Sengaja tanpa daftar nama
   * kegiatan — menyebut format spesifik (book sharing, mendongeng, dst.)
   * terbaca seperti jadwal yang sudah diputuskan, padahal belum ada apa-apa.
   */
  plans: { title: string; description: string };
}

interface FinalCtaContent {
  title: string;
  description: string;
  /** Tautannya dari `siteConfig.forms.join` — tidak tampil kalau kosong. */
  formLabel: string;
  primaryLabel: string;
  secondaryLabel: string;
}

export interface HomeContent {
  hero: HeroContent;
  heroFacts: HeroFact[];
  foundation: FoundationContent;
  belief: BeliefContent;
  values: ValuesContent;
  join: JoinContent;
  finalCta: FinalCtaContent;
}

/* ── Indonesia ────────────────────────────────────────────────────────── */

const id: HomeContent = {
  hero: {
    eyebrow: "Gerakan literasi dari Labuan Bajo",
    title: "Membaca kata, membaca dunia.",
    // Menyebut posisi sebenarnya: gerakan ini baru menyusun kegiatannya. Klaim
    // "sudah membuka ruang baca" akan mengulang masalah yang bikin section
    // program dihapus.
    description:
      "Waca Bajo tumbuh di Labuan Bajo, dari orang-orang yang ingin membaca bersama. Kegiatannya sedang kami susun bersama warga, dan siapa pun boleh ikut sejak awal.",
    quote:
      "Kami percaya membaca adalah awal dari rasa ingin tahu, pemahaman, dan keberanian untuk melihat dunia secara lebih luas.",
    joinCta: { label: "Jadi bagian dari Waca Bajo", href: "#gabung" },
    surveyCta: { label: "Isi survei" },
    aboutCta: { label: "Kenali Waca Bajo", href: "#tentang" },
  },

  // Fakta yang bisa diverifikasi dari halaman ini sendiri — bukan angka
  // dampak. Kalau nanti ada data resmi, ganti `value` dan `label`-nya.
  heroFacts: [
    { value: "Labuan Bajo", label: "Tempat kami bekerja" },
    { value: "Semua usia", label: "Terbuka tanpa syarat" },
  ],

  foundation: {
    eyebrow: "Dari mana kami berangkat",
    title: "Budaya membaca tumbuh saat orang, buku, dan cerita bertemu",
    description:
      "Tiga hal yang menjelaskan kenapa gerakan ini ada dan ke mana arahnya.",
    items: [
      {
        tone: "persephone",
        doodle: "book",
        title: "Kenapa kami ada",
        body: "Buku yang hanya tersedia di rak tidak membuat orang membaca. Yang membuat orang membaca biasanya orang lain yang mengajak.",
      },
      {
        tone: "maritime",
        doodle: "pinisi",
        title: "Asal nama",
        body: "“Waca” berarti “membaca”. Namanya lahir dari bahasa dan tanah tempat gerakan ini bertumbuh, di Labuan Bajo.",
      },
      {
        tone: "forest",
        doodle: "sprout",
        title: "Cara kami memaknainya",
        body: "Membaca adalah cara mengenal, memahami, mendengar, dan berbagi cerita. Dari situ orang tumbuh bersama.",
      },
    ],
  },

  belief: {
    eyebrow: "Yang kami percayai",
    tagline: "Growing Through Stories",
    statement:
      "Melalui buku, cerita, dan kebersamaan, kami membangun ruang tempat orang belajar, saling memahami, dan berkembang bersama.",
  },

  values: {
    eyebrow: "Nilai",
    title: "Empat nilai yang menjaga cara kami bekerja",
    description:
      "Bukan slogan — ini yang kami pakai untuk memutuskan hal-hal kecil sehari-hari.",
    items: [
      {
        tone: "forest",
        name: "Bersama",
        meaning: "Semua orang punya tempat yang sama.",
        practice:
          "Kegiatan disusun bersama warga, bukan dibawa jadi dari luar.",
      },
      {
        tone: "maritime",
        name: "Terbuka",
        meaning: "Semua orang punya kesempatan yang sama.",
        practice:
          "Tidak ada syarat usia, latar belakang, atau kemampuan membaca.",
      },
      {
        tone: "persephone",
        name: "Berani mencoba",
        meaning: "Cara baru kami uji, bukan diperdebatkan.",
        practice:
          "Kalau sebuah format tidak berhasil, kami menyebutnya dan menggantinya.",
      },
      {
        tone: "gold",
        name: "Berani memahami",
        meaning: "Mendengar dulu, baru melanjutkan.",
        practice: "Setiap kegiatan ditutup dengan menanyakan apa yang berubah.",
      },
    ],
  },

  // Tiga langkah ini sengaja tidak meminta apa pun selain cerita — stakeholder
  // khawatir orang mundur kalau merasa harus punya "peran" dulu.
  join: {
    eyebrow: "Ikut terlibat",
    title: "Terbuka untuk siapa saja, apa pun latar belakangmu",
    description:
      "Ruang untuk ikut terlibat — jadi relawan atau bentuk lain — sedang kami siapkan. Tidak ada syarat dan tidak perlu pengalaman: nanti kamu cukup ceritakan siapa kamu dan apa yang ingin kamu lakukan, dan kami hubungi balik begitu ruang ini resmi dibuka.",
    plans: {
      title: "Kegiatan yang sedang kami siapkan",
      description:
        "Bentuk dan jadwalnya belum kami tentukan. Semuanya akan disusun bersama orang-orang yang lebih dulu ikut, sesuai minat dan waktu yang ada.",
    },
  },

  // Tautannya diambil dari `siteConfig`, jadi tidak diduplikasi di sini.
  finalCta: {
    title: "Cerita berikutnya butuh satu orang lagi",
    description:
      "Terbuka untuk pelajar, guru, perantau, dan siapa pun yang senang membaca — juga yang belum merasa punya peran apa-apa.",
    formLabel: "Isi formulir",
    primaryLabel: "Kirim email",
    secondaryLabel: "Sapa kami di Instagram",
  },
};

/* ── English ──────────────────────────────────────────────────────────── */

const en: HomeContent = {
  hero: {
    eyebrow: "A literacy movement from Labuan Bajo",
    title: "Read the words, read the world.",
    description:
      "Waca Bajo grew in Labuan Bajo, out of people who wanted to read together. We are still shaping what we do, alongside the people who live here — and anyone can join from the start.",
    quote:
      "We believe reading is where curiosity begins, and with it the understanding and the nerve to look at the world more widely.",
    joinCta: { label: "Be part of Waca Bajo", href: "#gabung" },
    surveyCta: { label: "Take the survey" },
    aboutCta: { label: "Get to know us", href: "#tentang" },
  },

  heroFacts: [
    { value: "Labuan Bajo", label: "Where we work" },
    { value: "All ages", label: "Open, no requirements" },
  ],

  foundation: {
    eyebrow: "Where we come from",
    title: "A reading culture grows where people, books, and stories meet",
    description:
      "Three things that explain why this movement exists, and where it is heading.",
    items: [
      {
        tone: "persephone",
        doodle: "book",
        title: "Why we exist",
        body: "Books sitting on a shelf do not make anyone read. What usually does is another person asking you to read with them.",
      },
      {
        tone: "maritime",
        doodle: "pinisi",
        title: "Where the name comes from",
        body: "“Waca” means “to read.” The name comes from the language and the ground this movement grew in: Labuan Bajo.",
      },
      {
        tone: "forest",
        doodle: "sprout",
        title: "What reading means to us",
        body: "Reading is how we get to know, understand, listen, and pass a story on. That is where growing together starts.",
      },
    ],
  },

  belief: {
    eyebrow: "What we believe",
    tagline: "Growing Through Stories",
    statement:
      "Through books, stories, and time spent together, we are building a place where people learn, understand one another, and grow.",
  },

  values: {
    eyebrow: "Values",
    title: "Four values that shape how we work",
    description:
      "Not a slogan — these are what we fall back on for the small decisions, every day.",
    items: [
      {
        tone: "forest",
        name: "Together",
        meaning: "Everyone has an equal place here.",
        practice:
          "Activities are shaped with the people who live here, not handed over ready-made.",
      },
      {
        tone: "maritime",
        name: "Open",
        meaning: "Everyone gets the same chance.",
        practice: "No conditions on age, background, or how well you read.",
      },
      {
        tone: "persephone",
        name: "Willing to try",
        meaning: "We try new ways instead of arguing about them.",
        practice: "When something does not work, we say so and change it.",
      },
      {
        tone: "gold",
        name: "Willing to understand",
        meaning: "Listen first, then carry on.",
        practice: "Every activity ends by asking what changed.",
      },
    ],
  },

  join: {
    eyebrow: "Get involved",
    title: "Open to anyone, whatever you bring with you",
    description:
      "The space to get involved — as a volunteer or otherwise — is something we are still putting together. No requirements, no experience needed: once it is ready, just tell us who you are and what you would like to do, and we will get back to you as soon as this officially opens.",
    plans: {
      title: "What we are getting ready",
      description:
        "The shape and schedule are not decided yet. All of it will be worked out together with whoever joins first, based on the time and interests they bring.",
    },
  },

  finalCta: {
    title: "The next story needs one more person",
    description:
      "Open to students, teachers, newcomers, and anyone who enjoys reading — including anyone who does not yet feel they have a role.",
    formLabel: "Fill in the form",
    primaryLabel: "Send an email",
    secondaryLabel: "Say hi on Instagram",
  },
};

const content: Record<Locale, HomeContent> = { id, en };

export function getContent(locale: Locale): HomeContent {
  return content[locale];
}
