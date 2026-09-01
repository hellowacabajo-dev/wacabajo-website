/**
 * Seluruh copy beranda sebagai data, per locale.
 *
 * Dipisahkan dari komponen supaya teks bisa disunting tanpa menyentuh markup.
 * Aturan menulisnya ada di `docs/DESIGN.md` §3 — ringkasnya: Sentence case
 * untuk headline, sebut yang konkret, dan jangan menaruh angka dampak yang
 * datanya belum ada. Berlaku untuk kedua bahasa.
 */

import type { Locale } from "@/lib/i18n/config";

/** Keluarga warna brand yang boleh dipakai sebagai tone komponen. */
export type BrandTone =
  | "forest"
  | "persephone"
  | "maritime"
  | "gold"
  | "brandy";

/** Nama doodle di `src/components/Doodles.tsx`. */
export type DoodleName =
  | "book"
  | "pinisi"
  | "sprout"
  | "sun"
  | "glasses"
  | "speech"
  | "pencil";

interface HeroContent {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
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

interface ProgramItem {
  tone: BrandTone;
  doodle: DoodleName;
  title: string;
  body: string;
  tags: string[];
}

interface ProgramsContent {
  eyebrow: string;
  title: string;
  description: string;
  items: ProgramItem[];
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

interface JoinStep {
  title: string;
  body: string;
}

interface JoinStepsContent {
  eyebrow: string;
  title: string;
  description: string;
  items: JoinStep[];
}

interface FinalCtaContent {
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
}

export interface HomeContent {
  hero: HeroContent;
  heroFacts: HeroFact[];
  foundation: FoundationContent;
  programs: ProgramsContent;
  belief: BeliefContent;
  values: ValuesContent;
  joinSteps: JoinStepsContent;
  finalCta: FinalCtaContent;
}

/* ── Indonesia ────────────────────────────────────────────────────────── */

const id: HomeContent = {
  hero: {
    eyebrow: "Gerakan literasi dari Labuan Bajo",
    title: "Membaca kata, lalu membaca dunia.",
    description:
      "Kami membuka ruang baca bersama warga, memandu kelas cerita untuk anak dan remaja, dan menjangkau kampung yang belum punya akses bacaan.",
    primaryCta: { label: "Jadi relawan", href: "#gabung" },
    secondaryCta: { label: "Lihat program", href: "#program" },
  },

  // Fakta yang bisa diverifikasi dari halaman ini sendiri — bukan angka
  // dampak. Kalau nanti ada data resmi, ganti `value` dan `label`-nya.
  heroFacts: [
    { value: "Labuan Bajo", label: "Tempat kami bekerja" },
    { value: "Tiga program", label: "Berjalan bersama warga" },
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

  programs: {
    eyebrow: "Program",
    title: "Tiga jalur, satu tujuan yang sama",
    description:
      "Setiap program berjalan bersama warga setempat. Semuanya terbuka untuk relawan baru.",
    items: [
      {
        tone: "forest",
        doodle: "book",
        title: "Ruang baca",
        body: "Titik baca yang dibuka bersama warga — tempat buku berpindah tangan dan cerita berpindah kepala. Boleh datang untuk membaca, boleh juga sekadar duduk mendengarkan.",
        tags: ["Rutin mingguan", "Semua usia"],
      },
      {
        tone: "persephone",
        doodle: "pencil",
        title: "Kelas cerita",
        body: "Sesi menulis dan bercerita untuk anak dan remaja, dipandu relawan dari komunitas sekitar. Tidak ada yang dinilai, dan tidak ada cerita yang dianggap salah.",
        tags: ["Anak & remaja", "Dipandu relawan"],
      },
      {
        tone: "maritime",
        doodle: "pinisi",
        title: "Jalan literasi",
        body: "Kunjungan keliling ke kampung dan sekolah yang belum terjangkau akses bacaan. Kami yang berangkat, bukan menunggu didatangi.",
        tags: ["Keliling kampung", "Bersama sekolah"],
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
        practice: "Program disusun bersama warga, bukan dibawa jadi dari luar.",
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

  joinSteps: {
    eyebrow: "Cara bergabung",
    title: "Mulai dari satu langkah kecil",
    description:
      "Tidak perlu pengalaman mengajar. Yang dibutuhkan hanya waktu dan kesediaan mendengar.",
    items: [
      {
        title: "Kirim kabar",
        body: "Ceritakan siapa kamu dan waktu luangmu lewat email atau pesan Instagram. Satu paragraf sudah cukup.",
      },
      {
        title: "Ikut satu sesi",
        body: "Datang ke satu kegiatan sebagai pengamat dulu. Tidak ada komitmen apa pun setelahnya.",
      },
      {
        title: "Pilih peranmu",
        body: "Memandu kelas, merapikan koleksi, mengantar buku, atau mendokumentasikan — semuanya dibutuhkan.",
      },
    ],
  },

  // Tautannya diambil dari `siteConfig.social`, jadi tidak diduplikasi di sini.
  finalCta: {
    title: "Cerita berikutnya butuh satu orang lagi",
    description:
      "Terbuka untuk relawan, penulis, guru, dan siapa pun yang ingin menumbuhkan budaya membaca di Labuan Bajo.",
    primaryLabel: "Kirim email",
    secondaryLabel: "Sapa kami di Instagram",
  },
};

/* ── English ──────────────────────────────────────────────────────────── */

const en: HomeContent = {
  hero: {
    eyebrow: "A literacy movement from Labuan Bajo",
    title: "Read the words, then read the world.",
    description:
      "We open reading spaces with residents, run storytelling classes for children and teens, and reach villages that don't yet have access to books.",
    primaryCta: { label: "Become a volunteer", href: "#gabung" },
    secondaryCta: { label: "See our programs", href: "#program" },
  },

  heroFacts: [
    { value: "Labuan Bajo", label: "Where we work" },
    { value: "Three programs", label: "Run together with residents" },
    { value: "All ages", label: "Open, no requirements" },
  ],

  foundation: {
    eyebrow: "Where we start from",
    title: "A reading culture grows where people, books, and stories meet",
    description:
      "Three things that explain why this movement exists, and where it's headed.",
    items: [
      {
        tone: "persephone",
        doodle: "book",
        title: "Why we exist",
        body: "Books that only sit on a shelf don't make people read. What makes people read is usually another person inviting them to.",
      },
      {
        tone: "maritime",
        doodle: "pinisi",
        title: "Where the name comes from",
        body: "“Waca” means “to read.” The name was born from the language and the land where this movement grew — Labuan Bajo.",
      },
      {
        tone: "forest",
        doodle: "sprout",
        title: "How we make sense of it",
        body: "Reading is a way to know, understand, listen, and share stories. That's where people grow together.",
      },
    ],
  },

  programs: {
    eyebrow: "Programs",
    title: "Three paths, one shared goal",
    description:
      "Every program runs together with local residents. All of them are open to new volunteers.",
    items: [
      {
        tone: "forest",
        doodle: "book",
        title: "Reading spaces",
        body: "Reading points opened together with residents — where books change hands and stories change minds. Come to read, or just sit and listen.",
        tags: ["Weekly", "All ages"],
      },
      {
        tone: "persephone",
        doodle: "pencil",
        title: "Storytelling classes",
        body: "Writing and storytelling sessions for children and teens, guided by volunteers from the local community. Nothing is graded, and no story is considered wrong.",
        tags: ["Kids & teens", "Volunteer-led"],
      },
      {
        tone: "maritime",
        doodle: "pinisi",
        title: "Literacy on the road",
        body: "Rounds of visits to villages and schools that don't yet have access to books. We go to them, instead of waiting to be visited.",
        tags: ["Village rounds", "With schools"],
      },
    ],
  },

  belief: {
    eyebrow: "What we believe",
    tagline: "Growing Through Stories",
    statement:
      "Through books, stories, and togetherness, we build spaces where people learn, understand each other, and grow together.",
  },

  values: {
    eyebrow: "Values",
    title: "Four values that guide how we work",
    description:
      "Not a slogan — this is what we use to decide the small things, every day.",
    items: [
      {
        tone: "forest",
        name: "Together",
        meaning: "Everyone has an equal place.",
        practice:
          "Programs are shaped together with residents, not brought in ready-made from outside.",
      },
      {
        tone: "maritime",
        name: "Open",
        meaning: "Everyone has an equal chance.",
        practice: "No requirements on age, background, or reading ability.",
      },
      {
        tone: "persephone",
        name: "Willing to try",
        meaning:
          "We test new ways of doing things instead of arguing about them.",
        practice: "When a format doesn't work, we say so and change it.",
      },
      {
        tone: "gold",
        name: "Willing to understand",
        meaning: "Listen first, then move forward.",
        practice: "Every activity ends by asking what changed.",
      },
    ],
  },

  joinSteps: {
    eyebrow: "How to join",
    title: "Start with one small step",
    description:
      "No teaching experience needed. All it takes is time and a willingness to listen.",
    items: [
      {
        title: "Send us a message",
        body: "Tell us who you are and when you're free, by email or an Instagram message. One paragraph is enough.",
      },
      {
        title: "Join one session",
        body: "Come to one activity as an observer first. No commitment required afterward.",
      },
      {
        title: "Pick your role",
        body: "Leading a class, organizing the collection, delivering books, or documenting — all of it is needed.",
      },
    ],
  },

  finalCta: {
    title: "The next story needs one more person",
    description:
      "Open to volunteers, writers, teachers, and anyone who wants to grow a reading culture in Labuan Bajo.",
    primaryLabel: "Send an email",
    secondaryLabel: "Say hi on Instagram",
  },
};

const content: Record<Locale, HomeContent> = { id, en };

export function getContent(locale: Locale): HomeContent {
  return content[locale];
}
