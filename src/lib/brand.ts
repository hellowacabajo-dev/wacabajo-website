/**
 * Isi Brand Guidelines Waca Bajo 2026 dalam bentuk data.
 *
 * Halaman `/brand` merender langsung dari sini, jadi style guide di web
 * tidak pernah "melenceng" dari deck: satu kali ubah di file ini, tampil di
 * semua tempat. Nilai hex-nya sengaja diketik ulang (bukan membaca CSS var)
 * supaya swatch bisa menampilkan kode warnanya sebagai teks.
 */

export type ColorStep = {
  step: number;
  hex: string;
  /** true untuk step yang hex-nya tercetak eksplisit di deck. */
  fromDeck?: boolean;
};

export type ColorFamily = {
  key: string;
  name: string;
  meaning: string;
  steps: ColorStep[];
};

export const colorFamilies: ColorFamily[] = [
  {
    key: "forest",
    name: "Darkest Forest",
    meaning:
      "Deep green tone dengan nuansa alami yang tenang. Mewakili perkembangan yang nyata, harmonis, stabil, dan resilience.",
    steps: [
      { step: 50, hex: "#E1E6CB" },
      { step: 100, hex: "#D0D6B2" },
      { step: 200, hex: "#C0C798" },
      { step: 300, hex: "#AFB77E" },
      { step: 400, hex: "#A0A864" },
      { step: 500, hex: "#909949", fromDeck: true },
      { step: 600, hex: "#767E3E" },
      { step: 700, hex: "#5E6533" },
      { step: 800, hex: "#464C28", fromDeck: true },
      { step: 900, hex: "#373D1F" },
      { step: 950, hex: "#292E16", fromDeck: true },
    ],
  },
  {
    key: "persephone",
    name: "Miles of Persephone",
    meaning:
      "Burgundy yang diambil dari Kain Songke, pakaian adat Manggarai. Simbol daya juang yang tinggi dan semangat eksplorasi.",
    steps: [
      { step: 50, hex: "#FFD2D0" },
      { step: 100, hex: "#F9BAB8" },
      { step: 200, hex: "#F0A3A0" },
      { step: 300, hex: "#E68B89" },
      { step: 400, hex: "#DC7272" },
      { step: 500, hex: "#D1595B" },
      { step: 600, hex: "#C53D45", fromDeck: true },
      { step: 700, hex: "#A7343B" },
      { step: 800, hex: "#892B31", fromDeck: true },
      { step: 900, hex: "#671F24" },
      { step: 950, hex: "#471417", fromDeck: true },
    ],
  },
  {
    key: "maritime",
    name: "Maritime Outpost",
    meaning:
      "Deep blue tone yang melambangkan kepercayaan dan ketenangan dalam setiap perjalanan.",
    steps: [
      { step: 50, hex: "#D6E7F9" },
      { step: 100, hex: "#C0D8F2" },
      { step: 200, hex: "#ABC9EB" },
      { step: 300, hex: "#95BBE4", fromDeck: true },
      { step: 400, hex: "#679BD2" },
      { step: 500, hex: "#377AC0", fromDeck: true },
      { step: 600, hex: "#2B619E" },
      { step: 700, hex: "#1F497D", fromDeck: true },
      { step: 800, hex: "#0F3461" },
      { step: 900, hex: "#022147" },
      { step: 950, hex: "#000F2E" },
    ],
  },
  {
    key: "gold",
    name: "Sunset Gold",
    meaning:
      "Kehangatan, rasa takjub, dan momen berkesan yang layak dikenang — seperti golden hour khas Bajo.",
    steps: [
      { step: 50, hex: "#FEECC8" },
      { step: 100, hex: "#FBE1AC" },
      { step: 200, hex: "#F9D68E", fromDeck: true },
      { step: 300, hex: "#F7C46B", fromDeck: true },
      { step: 400, hex: "#F3A22C", fromDeck: true },
      { step: 500, hex: "#D08607" },
      { step: 600, hex: "#AD6A00" },
      { step: 700, hex: "#8C5000" },
      { step: 800, hex: "#6C3700" },
      { step: 900, hex: "#4D1E00" },
      { step: 950, hex: "#300700" },
    ],
  },
  {
    key: "cream",
    name: "Vintage Cream",
    meaning:
      "Base color. Off-white lembut dengan undertone kuning/beige — timeless, hangat, dan terasa lived-in.",
    steps: [
      { step: 50, hex: "#FAF6EC", fromDeck: true },
      { step: 100, hex: "#F4EEE0" },
      { step: 200, hex: "#EFE7D4" },
      { step: 300, hex: "#E2D9C1" },
      { step: 400, hex: "#D6CAAE" },
      { step: 500, hex: "#C9BC9C" },
    ],
  },
  {
    key: "brandy",
    name: "Brandy",
    meaning:
      "Neutral hangat pendamping base color. Dipakai untuk garis, teks sekunder, dan permukaan yang perlu terasa tenang.",
    steps: [
      { step: 50, hex: "#FAF7F2", fromDeck: true },
      { step: 100, hex: "#F4EDE0", fromDeck: true },
      { step: 200, hex: "#E8D9C0", fromDeck: true },
      { step: 300, hex: "#DAC29D", fromDeck: true },
      { step: 400, hex: "#C8A06F", fromDeck: true },
      { step: 500, hex: "#BC8853", fromDeck: true },
      { step: 600, hex: "#AF7547", fromDeck: true },
      { step: 700, hex: "#915D3D", fromDeck: true },
      { step: 800, hex: "#764C36", fromDeck: true },
      { step: 900, hex: "#60402E", fromDeck: true },
      { step: 950, hex: "#332017", fromDeck: true },
    ],
  },
];

export type ColorPairing = {
  label: string;
  bgClass: string;
  fgClass: string;
  /** Rasio kontras teks terhadap background, dihitung dari hex di atas. */
  ratio: string;
  usage: string;
};

/** Pasangan warna yang lolos WCAG AA dan boleh dipakai untuk teks. */
export const colorPairings: ColorPairing[] = [
  {
    label: "Ink di atas Vintage Cream",
    bgClass: "bg-cream-50",
    fgClass: "text-persephone-950",
    ratio: "14.1:1",
    usage: "Pasangan default seluruh halaman.",
  },
  {
    label: "Cream di atas Darkest Forest",
    bgClass: "bg-forest-950",
    fgClass: "text-cream-50",
    ratio: "13.0:1",
    usage: "Section gelap, footer, panel kutipan.",
  },
  {
    label: "Sunset Gold di atas Darkest Forest",
    bgClass: "bg-forest-950",
    fgClass: "text-gold-300",
    ratio: "8.7:1",
    usage: "Eyebrow dan aksen di atas section gelap.",
  },
  {
    label: "Cream di atas Miles of Persephone 800",
    bgClass: "bg-persephone-800",
    fgClass: "text-cream-50",
    ratio: "8.6:1",
    usage: "Tombol primer dan badge.",
  },
  {
    label: "Ink di atas Sunset Gold 400",
    bgClass: "bg-gold-400",
    fgClass: "text-persephone-950",
    ratio: "7.3:1",
    usage: "Tombol aksen. Teks putih di atas gold tidak lolos AA.",
  },
  {
    label: "Cream di atas Maritime Outpost 700",
    bgClass: "bg-maritime-700",
    fgClass: "text-cream-50",
    ratio: "9.1:1",
    usage: "Section informatif, tag program.",
  },
];

/**
 * Pasangan chip — tint 50/100 dari satu keluarga warna dengan teks step 900
 * dari keluarga yang sama. Semuanya lolos AAA, jadi aman dipakai pada ukuran
 * teks kecil (chip, tag, badge ikon).
 */
export const chipPairings: ColorPairing[] = [
  {
    label: "Chip Darkest Forest",
    bgClass: "bg-chip-forest-bg",
    fgClass: "text-chip-forest-fg",
    ratio: "8.9:1",
    usage: "Tag program lapangan dan nilai Collaborative.",
  },
  {
    label: "Chip Miles of Persephone",
    bgClass: "bg-chip-persephone-bg",
    fgClass: "text-chip-persephone-fg",
    ratio: "8.6:1",
    usage: "Tag kelas cerita dan nilai Critical.",
  },
  {
    label: "Chip Maritime Outpost",
    bgClass: "bg-chip-maritime-bg",
    fgClass: "text-chip-maritime-fg",
    ratio: "12.7:1",
    usage: "Tag jalan literasi dan nilai Inclusive.",
  },
  {
    label: "Chip Sunset Gold",
    bgClass: "bg-chip-gold-bg",
    fgClass: "text-chip-gold-fg",
    ratio: "12.0:1",
    usage: "Nomor langkah dan nilai Reflective. Ini satu-satunya cara Sunset Gold boleh menampung teks kecil.",
  },
  {
    label: "Chip Brandy",
    bgClass: "bg-chip-brandy-bg",
    fgClass: "text-chip-brandy-fg",
    ratio: "8.0:1",
    usage: "Chip netral — eyebrow hero dan label tanpa tone khusus.",
  },
];

export const typography = {
  primary: {
    name: "Bricolage Grotesque",
    classification: "Sans Serif",
    usability: "Heading, Sub-Heading, Body Text",
    source: "Google Fonts — free for commercial use",
    note: "Ekspresif dan berani pada ukuran judul besar, tetap netral dan rapi pada teks kecil. Di web memegang headline (bobot 700, tracking rapat), body, dan seluruh elemen UI.",
  },
  secondary: {
    name: "Sorts Mill Goudy",
    classification: "Serif",
    usability: "Heading, Sub-Heading, Body Text",
    source: "Google Fonts — free for commercial use",
    note: "Hangat, humanis, berakar pada tradisi. Di web dipakai sebagai aksen: wordmark, kutipan, dan teks besar yang perlu terasa personal.",
  },
} as const;

export const brandValues = [
  {
    name: "Collaborative",
    description: "Semua orang punya tempat yang sama.",
  },
  {
    name: "Inclusive",
    description: "Semua orang punya kesempatan yang sama.",
  },
  {
    name: "Critical",
    description: "Berani mencoba.",
  },
  {
    name: "Reflective",
    description: "Berani memahami.",
  },
] as const;

/**
 * Bagian Foundation deck, dikutip apa adanya.
 *
 * Tiga kalimat ini adalah rujukan terakhir kalau ada perdebatan soal copy:
 * kalimat yang tidak bisa ditarik kembali ke salah satunya kemungkinan besar
 * bukan suara Waca Bajo. Nomor halaman disimpan supaya mudah dicek ke PDF.
 */
export type FoundationQuote = {
  label: string;
  page: number;
  quote: string;
};

export const brandFoundation: FoundationQuote[] = [
  {
    label: "Brand Origins",
    page: 5,
    quote:
      "Waca Bajo percaya bahwa budaya literasi tumbuh ketika manusia, buku, dan cerita saling bertemu.",
  },
  {
    label: "Naming Story",
    page: 6,
    quote:
      // Tanda kutip di dalam kutipan dibuat tunggal supaya tidak bertabrakan
      // dengan tanda kutip pembungkusnya saat dirender.
      "Nama Waca Bajo lahir dari bahasa dan tanah tempat gerakan ini bertumbuh. ‘Waca’ berarti ‘membaca’, yang menjadi fondasi gerakan kami untuk menumbuhkan budaya membaca di Labuan Bajo.",
  },
  {
    label: "Brand Interpretation",
    page: 7,
    quote:
      "Bagi Waca Bajo, membaca bukan sepenuhnya tentang buku. Namun, membaca adalah cara untuk mengenal, memahami, mendengar, dan berbagi cerita serta tumbuh bersama.",
  },
];

/**
 * Tiga pilar Tone of Voice (deck hlm. 10).
 *
 * Deck hanya mencantumkan namanya. `meaning`, `apply`, dan `avoid` adalah
 * penerjemahan pilar itu jadi keputusan menulis yang bisa dipakai — supaya
 * "Grounded" tidak berhenti sebagai kata sifat di dinding.
 */
export type TonePillar = {
  name: string;
  meaning: string;
  apply: string;
  avoid: string;
};

export const toneOfVoice: TonePillar[] = [
  {
    name: "Grounded & Thoughtful",
    meaning:
      "Berpijak pada hal yang benar-benar terjadi, dan sudah dipikirkan sebelum diucapkan.",
    apply:
      "Sebut yang konkret: tempatnya, siapa yang datang, apa yang dikerjakan.",
    avoid:
      "Klaim besar tanpa sumber, superlatif, dan kata sifat yang menumpuk dalam satu kalimat.",
  },
  {
    name: "Empathic & Impactful",
    meaning:
      "Menyebut apa yang dirasakan pembaca, bukan hanya apa yang kami kerjakan.",
    apply:
      "Tambahkan satu kalimat yang menjawab keraguan pembaca — misalnya bahwa tidak ada yang dinilai.",
    avoid:
      "Bahasa program yang dingin, dan angka dampak yang belum bisa dipertanggungjawabkan.",
  },
  {
    name: "Collaborative & Inclusive",
    meaning:
      "Menulis untuk semua orang yang mungkin membaca, tanpa memilah lebih dulu.",
    apply:
      "Bahasa Indonesia sehari-hari, dan ajakan yang menyediakan pintu untuk tiap orang.",
    avoid:
      "Campur bahasa, istilah internal, dan nada yang memilah orang berdasarkan latar belakang.",
  },
];

/**
 * Aturan penulisan copy.
 *
 * Semuanya turunan langsung dari deck — kolom `basis` menyebut pasal mana yang
 * jadi dasarnya, jadi setiap aturan bisa dibantah dengan membuka halamannya,
 * bukan dengan beradu selera.
 */
export type CopyRule = {
  rule: string;
  basis: string;
};

export const copyRules: CopyRule[] = [
  {
    rule: "Headline dan sub-headline memakai Sentence case.",
    basis:
      "Typography Pairings (hlm. 19 & 21) menuliskannya eksplisit. Uppercase hanya untuk eyebrow dan label kecil.",
  },
  {
    rule: "Satu bahasa: Indonesia, termasuk judul halaman dan meta description.",
    basis:
      "Inclusive — semua orang punya kesempatan yang sama. Situs yang berganti bahasa memagari sebagian pembacanya.",
  },
  {
    rule: "Bukti berbentuk cerita orang, bukan angka yang belum ada datanya.",
    basis:
      "Brand Essence “Growing Through Stories”, sekaligus menjaga pilar Grounded.",
  },
  {
    rule: "Istilah internal dijelaskan fungsinya lebih dulu, atau tidak dipakai.",
    basis: "Thoughtful — pembaca baru tidak boleh disuruh menebak.",
  },
  {
    rule: "Boleh menyebut yang belum berhasil.",
    basis:
      "Critical (berani mencoba) dan Reflective (berani memahami). Nilai ini hanya terbaca kalau ada kalimat yang berani mengakui.",
  },
  {
    rule: "Headline panjang dipecah jadi dua bagian yang seimbang.",
    basis:
      "Pola milik brand sendiri — sampul deck: “Growth begins with a story”; esensinya “Growing Through Stories”.",
  },
  {
    rule: "Pengecualian tagline: kutipan verbatim sampul deck atau brand essence dipertahankan casing dan bahasa aslinya — tidak diterjemahkan, tidak diubah ke Sentence case.",
    basis:
      "Nama diri brand (seperti “Growing Through Stories”) diperlakukan berbeda dari kalimat yang ditulis bebas. Ini satu-satunya pengecualian terhadap aturan #1 dan #2 di atas; dipakai di `hero.title` (src/lib/content.ts).",
  },
];

export const brandPersonality = [
  "Grounded",
  "Connect",
  "Rooted",
  "Organic",
  "Thoughtful",
  "Empathy",
  "Understanding",
  "Social",
  "Inclusive",
  "Impactful",
  "Collaborative",
  "Resilience",
  "Critical",
  "Reflective",
] as const;

export const brandEssence = "Growing Through Stories";
