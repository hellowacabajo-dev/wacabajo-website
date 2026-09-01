/**
 * Isi halaman beranda sebagai data.
 *
 * Dipisahkan dari komponen supaya copy bisa disunting tanpa menyentuh markup,
 * dan supaya jelas mana yang sudah final dan mana yang masih menunggu konten
 * resmi dari tim.
 *
 * Sumber copy:
 * - Bagian Foundation, Brand Essence, Values, dan Tone of Voice mengikuti
 *   "Waca Bajo Brand Guidelines 2026" (lihat juga `src/lib/brand.ts`).
 * - Deskripsi program dan langkah bergabung ditulis sebagai kerangka kerja —
 *   lihat TODO di bawah.
 */

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

/* ── Hero ─────────────────────────────────────────────────────────────── */

export const hero = {
  eyebrow: "Gerakan literasi dari Labuan Bajo",
  /**
   * Kutipan verbatim sampul deck (hlm. 2), termasuk casing aslinya. Ini
   * pengecualian yang disengaja terhadap aturan #1 (Sentence case) dan #2
   * (satu bahasa) di `copyRules` (src/lib/brand.ts) — lihat catatan
   * "Pengecualian tagline" di sana. Diperlakukan sama seperti `brandEssence`
   * ("Growing Through Stories"): nama diri brand, bukan kalimat yang ditulis
   * bebas, jadi tidak diterjemahkan atau diubah casing-nya.
   */
  title: "Growth Begins With a Story",
  description:
    "Kami membuka ruang baca bersama warga, memandu kelas cerita untuk anak dan remaja, dan menjangkau kampung yang belum punya akses bacaan. Bagi kami membaca adalah cara mengenal, mendengar, dan tumbuh bersama.",
  primaryCta: { label: "Jadi relawan", href: "/#gabung" },
  secondaryCta: { label: "Lihat program kami", href: "/#program" },
} as const;

/**
 * Strip fakta di bawah hero.
 *
 * Sengaja tidak memakai angka dampak (jumlah buku, penerima manfaat, dsb.)
 * karena datanya belum ada — menaruh angka karangan di situs gerakan literasi
 * jelas bukan pilihan. Isinya fakta struktural yang bisa diverifikasi dari
 * halaman ini sendiri. Begitu tim punya data resmi, ganti `value` dengan
 * angkanya dan `label` dengan satuannya; komponennya sudah siap.
 *
 * TODO: bentuk bukti yang paling on-brand bukan angka, melainkan cerita orang
 * — lihat `copyRules` di `src/lib/brand.ts` ("Bukti berbentuk cerita orang")
 * dan §3 di `docs/DESIGN-SYSTEM.md`. Begitu ada satu kutipan asli dari warga
 * atau relawan (dengan izinnya), taruh sebagai section tersendiri; strip fakta
 * ini boleh dipensiunkan saat itu.
 */
export const heroFacts = [
  { value: "Tiga", label: "program berjalan" },
  { value: "Semua usia", label: "terbuka untuk siapa pun" },
  { value: "Warga", label: "yang menggerakkan" },
] as const;

/* ── Foundation ───────────────────────────────────────────────────────── */

export const foundation = {
  eyebrow: "Dari mana kami berangkat",
  title: "Budaya membaca tumbuh saat orang, buku, dan cerita bertemu",
  description:
    "Tiga hal yang menjelaskan kenapa gerakan ini ada dan ke mana arahnya.",
  items: [
    {
      tone: "persephone" as BrandTone,
      doodle: "book" as DoodleName,
      title: "Kenapa kami ada",
      body: "Waca Bajo percaya budaya literasi tumbuh ketika manusia, buku, dan cerita saling bertemu — bukan ketika buku sekadar tersedia di rak.",
    },
    {
      tone: "maritime" as BrandTone,
      doodle: "pinisi" as DoodleName,
      title: "Asal nama",
      body: "“Waca” berarti “membaca”. Nama ini lahir dari bahasa dan tanah tempat gerakan kami bertumbuh, di Labuan Bajo.",
    },
    {
      tone: "forest" as BrandTone,
      doodle: "sprout" as DoodleName,
      title: "Cara kami memaknainya",
      body: "Membaca adalah cara untuk mengenal, memahami, mendengar, dan berbagi cerita. Dari situ orang tumbuh bersama.",
    },
  ],
} as const;

/* ── Tempat ───────────────────────────────────────────────────────────── */

/**
 * Section peta — jembatan antara "Fondasi" dan "Program".
 *
 * Menjawab baris "Asal nama" di `foundation`: setelah pembaca tahu nama ini
 * lahir dari tanahnya, di sini tanahnya ditunjukkan. Juga memberi jeda visual
 * di antara dua grid kartu yang berurutan.
 *
 * Gambarnya ILUSTRASI, bukan peta faktual — garis pantainya tidak akurat.
 * Karena itu framing-nya sengaja tidak pernah mengklaim ketepatan geografis
 * (tidak ada penanda kampung, tidak ada label lokasi). Kalau nanti tim punya
 * peta wilayah kerja yang benar, barulah `caption` boleh berubah.
 */
export const place = {
  eyebrow: "Tempat kami berpijak",
  title: "Gerakan ini berakar di satu tempat, bukan di mana-mana",
  description:
    "Labuan Bajo dan kampung-kampung di sekitarnya. Di sinilah program kami berjalan, dan dari sini pula cerita-cerita yang kami kumpulkan berasal.",
  caption:
    "Ilustrasi bentang Labuan Bajo dan gugus pulau di sekitarnya, digambar ulang dengan warna brand.",
  imageAlt:
    "Ilustrasi tiga dimensi daratan Labuan Bajo dan gugus pulau di sekitarnya, dengan bukit hijau zaitun di atas laut biru.",
} as const;

/* ── Program ──────────────────────────────────────────────────────────── */

/**
 * TODO: ganti isi program dengan data sungguhan dari tim (atau tarik dari CMS).
 * Struktur, tone warna, dan tag sudah final — yang perlu diisi hanya teksnya.
 *
 * Pola tiap `body`: kalimat pertama menjelaskan kegiatannya (Grounded),
 * kalimat kedua menjawab keraguan pembaca yang belum pernah datang
 * (Empathic — lihat `toneOfVoice` di `src/lib/brand.ts`). Pertahankan pola
 * dua kalimat ini saat menggantinya.
 */
export const programs = {
  eyebrow: "Program",
  title: "Tiga jalur, satu tujuan yang sama",
  description:
    "Setiap program berjalan bersama warga setempat. Semuanya terbuka untuk relawan baru.",
  items: [
    {
      tone: "forest" as BrandTone,
      doodle: "book" as DoodleName,
      title: "Ruang baca",
      body: "Titik baca yang dibuka bersama warga — tempat buku berpindah tangan dan cerita berpindah kepala. Boleh datang untuk membaca, boleh juga sekadar duduk mendengarkan.",
      tags: ["Rutin mingguan", "Semua usia"],
    },
    {
      tone: "persephone" as BrandTone,
      doodle: "pencil" as DoodleName,
      title: "Kelas cerita",
      body: "Sesi menulis dan bercerita untuk anak dan remaja, dipandu relawan dari komunitas sekitar. Tidak ada yang dinilai, dan tidak ada cerita yang dianggap salah.",
      tags: ["Anak & remaja", "Dipandu relawan"],
    },
    {
      tone: "maritime" as BrandTone,
      doodle: "pinisi" as DoodleName,
      title: "Jalan literasi",
      body: "Kunjungan keliling ke kampung dan sekolah yang belum terjangkau akses bacaan. Kami yang berangkat, bukan menunggu didatangi.",
      tags: ["Keliling kampung", "Butuh armada"],
    },
  ],
} as const;

/* ── Nilai ────────────────────────────────────────────────────────────── */

/**
 * Terjemahan tiap nilai ke perilaku sehari-hari.
 *
 * Nama dan kalimat pendek nilainya berasal dari deck (`brandValues` di
 * `src/lib/brand.ts`); baris di bawah ini adalah interpretasi untuk web supaya
 * pembaca tahu wujud nyatanya, bukan kutipan dari deck.
 */
export const valuePractice: Record<string, { tone: BrandTone; body: string }> = {
  Collaborative: {
    tone: "forest",
    body: "Program disusun bersama warga, bukan dibawa jadi dari luar.",
  },
  Inclusive: {
    tone: "maritime",
    body: "Tidak ada syarat usia, latar belakang, atau kemampuan membaca.",
  },
  Critical: {
    tone: "persephone",
    body: "Kami mencoba format baru, dan mengakui kalau ada yang tidak berhasil.",
  },
  Reflective: {
    tone: "gold",
    body: "Setiap kegiatan ditutup dengan mendengar apa yang berubah.",
  },
};

/* ── Cara bergabung ───────────────────────────────────────────────────── */

export const joinSteps = {
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
} as const;

/* ── Ajakan penutup ───────────────────────────────────────────────────── */

/** Tautannya diambil dari `siteConfig.social`, jadi tidak diduplikasi di sini. */
export const finalCta = {
  title: "Perjalanan yang dilalui bersama membuat cerita semakin bermakna",
  description:
    "Terbuka untuk relawan, penulis, guru, dan siapa pun yang ingin menumbuhkan budaya membaca di Labuan Bajo.",
} as const;
