/**
 * Isi survei need assessment "Suara Labuan Bajo untuk Literasi".
 *
 * Naskah aslinya ada di `docs/FEEDBACK-STAKEHOLDER.md` §1 — file ini
 * memindahkannya jadi data, dan sekaligus jadi satu-satunya sumber untuk:
 * tampilan form, validasi (klien & server), dan nama kolom di database.
 *
 * Kenapa dwibahasa dalam satu objek, bukan dua objek terpisah seperti
 * `src/lib/content.ts`: di sini label dan `value` opsi harus selalu berpasangan
 * persis. Kalau dipisah per locale, satu opsi yang lupa diterjemahkan langsung
 * jadi data rekap yang bocor ke bahasa lain, dan itu tidak akan ketahuan oleh
 * TypeScript. `value` yang tersimpan selalu kunci netral bahasa (mis.
 * `public_library`), jadi rekapnya tidak tergantung locale pengisi.
 */

import type { DoodleName } from "@/lib/content";
import type { Locale } from "@/lib/i18n/config";

/** Teks yang wajib punya kedua bahasa. */
export type Bilingual = Record<Locale, string>;

export function t(locale: Locale, text: Bilingual): string {
  return text[locale];
}

export interface SurveyOption {
  /** Kunci yang disimpan ke database — jangan diubah setelah survei tayang. */
  value: string;
  label: Bilingual;
}

export type QuestionType =
  "text" | "number" | "radio" | "checkbox" | "scale" | "paragraph";

export interface SurveyQuestion {
  /** Sekaligus nama kolom di tabel `survey_responses`. */
  id: string;
  type: QuestionType;
  required: boolean;
  label: Bilingual;
  help?: Bilingual;
  placeholder?: Bilingual;
  options?: SurveyOption[];
  /**
   * Menambah opsi "Lainnya" berikut kolom isian bebasnya. Isian itu disimpan
   * di kolom `${id}_other`, dan wajib diisi kalau opsinya dipilih — jawaban
   * "lainnya" tanpa keterangan tidak bisa dipakai saat rekap.
   */
  other?: boolean;
  scale?: {
    min: number;
    max: number;
    minLabel: Bilingual;
    maxLabel: Bilingual;
  };
  /** Batas untuk `type: "number"`. */
  min?: number;
  max?: number;
  /** Nama disimpan huruf besar semua supaya rekapnya seragam. */
  uppercase?: boolean;
  maxLength?: number;
}

export interface SurveyStep {
  id: string;
  doodle: DoodleName;
  eyebrow: Bilingual;
  title: Bilingual;
  /** Kalimat pengantar section — teks, bukan pertanyaan. */
  intro?: Bilingual;
  questions: SurveyQuestion[];
}

/** Nilai khusus untuk opsi "Lainnya". */
export const OTHER_VALUE = "other";

export const surveyMeta = {
  /** Judul resmi survei — dipakai di metadata halaman. */
  title: {
    id: "Suara Labuan Bajo untuk Literasi",
    en: "Voices of Labuan Bajo on reading",
  } satisfies Bilingual,
  description: {
    id: "Survei singkat tentang kebiasaan membaca, akses bahan bacaan, dan ruang belajar di Labuan Bajo. Jawabanmu menentukan kegiatan yang Waca Bajo susun berikutnya.",
    en: "A short survey about reading habits, access to books, and places to learn in Labuan Bajo. Your answers shape what Waca Bajo does next.",
  } satisfies Bilingual,
};

/** Layar pembuka + persetujuan, sebelum pertanyaan pertama. */
export const surveyIntro = {
  eyebrow: { id: "Survei warga", en: "Community survey" },
  title: { id: "Satu suara, satu cerita", en: "One voice, one story" },
  lead: {
    id: "Yuk, bantu kami mendengar kondisi literasi di Labuan Bajo!",
    en: "Help us hear how reading is going in Labuan Bajo.",
  },
  body: [
    {
      id: "Belakangan ini, keadaan di sekitar kita banyak berubah. Lewat survei singkat ini, kami ingin mendengar langsung dari kamu bagaimana kondisi membaca, belajar, mencari informasi, dan mendapatkan buku di lingkungan kita sekarang.",
      en: "A lot has changed around us lately. Through this short survey we want to hear from you directly: what reading, studying, finding information, and getting hold of books look like where you live right now.",
    },
    {
      id: "Jawaban kamu akan membantu Waca Bajo membuat kegiatan yang sesuai dengan kebutuhan masyarakat di lapangan, bukan sekadar berdasarkan dugaan kami.",
      en: "Your answers help Waca Bajo build activities around what people actually need, instead of what we assume they need.",
    },
    {
      id: "Tidak ada jawaban benar atau salah. Setiap pengalaman dan pandanganmu sangat berarti bagi kami.",
      en: "There are no right or wrong answers. Every experience and every opinion counts.",
    },
  ],
  consent: {
    id: "Saya bersedia mengisi survei ini secara sukarela. Saya memahami bahwa jawaban saya akan digunakan untuk membantu Waca Bajo mengetahui kebutuhan masyarakat dan membuat kegiatan yang sesuai.",
    en: "I am filling in this survey voluntarily. I understand my answers will be used to help Waca Bajo understand what people need and shape its activities accordingly.",
  },
  consentError: {
    id: "Centang persetujuan dulu supaya kami boleh memakai jawabanmu.",
    en: "Please tick the consent box so we may use your answers.",
  },
  start: { id: "Mulai isi survei", en: "Start the survey" },
  duration: { id: "Sekitar 5 menit", en: "About 5 minutes" },
  questionCount: { id: "17 pertanyaan", en: "17 questions" },
  optionalNote: {
    id: "Dua pertanyaan terakhir boleh dilewati",
    en: "The last two are optional",
  },
};

/** Layar penutup setelah jawaban terkirim. */
export const surveyOutro = {
  eyebrow: { id: "Terkirim", en: "Sent" },
  title: {
    id: "Terima kasih sudah bersuara",
    en: "Thank you for speaking up",
  },
  body: [
    {
      id: "Terima kasih sudah berbagi cerita dan pandanganmu.",
      en: "Thank you for sharing your story and your view.",
    },
    {
      id: "Setiap jawaban membantu Waca Bajo memahami apa yang dibutuhkan masyarakat, terutama di tengah kondisi yang terus berubah.",
      en: "Every answer helps Waca Bajo understand what people need, especially while so much around us keeps shifting.",
    },
    {
      id: "Semoga dari suara-suara kecil ini, kita bisa bersama-sama membangun ruang untuk membaca, belajar, berbagi, dan bertumbuh di Labuan Bajo.",
      en: "We hope these small voices add up to a place to read, learn, share, and grow together in Labuan Bajo.",
    },
  ],
  aboutCta: { id: "Kenali Waca Bajo", en: "Get to know Waca Bajo" },
  joinCta: { id: "Ikut terlibat", en: "Get involved" },
};

export const surveySteps: SurveyStep[] = [
  {
    id: "perkenalan",
    doodle: "speech",
    eyebrow: { id: "Perkenalan", en: "Introductions" },
    title: { id: "Yuk, kenalan!", en: "Let’s get acquainted" },
    intro: {
      id: "Sebelum mulai, yuk kenalan sedikit! Supaya kami bisa memahami siapa saja yang ikut menyuarakan kebutuhan literasi di Labuan Bajo.",
      en: "Before we start, tell us a little about yourself — so we know who is speaking up about reading in Labuan Bajo.",
    },
    questions: [
      {
        id: "name",
        type: "text",
        required: true,
        uppercase: true,
        maxLength: 80,
        label: { id: "Nama", en: "Name" },
        placeholder: {
          id: "Nama panggilan juga boleh",
          en: "A nickname is fine",
        },
      },
      {
        id: "age",
        type: "number",
        required: true,
        min: 5,
        max: 100,
        label: { id: "Umur", en: "Age" },
        placeholder: { id: "Contoh: 17", en: "For example: 17" },
      },
      {
        id: "resident_type",
        type: "radio",
        required: true,
        label: {
          id: "Kamu tinggal di sini sebagai...",
          en: "You live here as...",
        },
        options: [
          {
            value: "local",
            label: { id: "Masyarakat lokal", en: "A local resident" },
          },
          { value: "tourist", label: { id: "Wisatawan", en: "A visitor" } },
          {
            value: "migrant",
            label: { id: "Perantau", en: "Someone who moved here" },
          },
        ],
      },
      {
        id: "daily_role",
        type: "radio",
        required: true,
        other: true,
        label: {
          id: "Saat ini kamu sehari-hari sebagai...",
          en: "These days you spend your time as...",
        },
        options: [
          {
            value: "school_student",
            label: { id: "Pelajar/anak sekolah", en: "A school student" },
          },
          {
            value: "university_student",
            label: { id: "Mahasiswa", en: "A university student" },
          },
          {
            value: "teacher",
            label: { id: "Guru/tenaga pendidik", en: "A teacher or educator" },
          },
          {
            value: "general_public",
            label: { id: "Masyarakat umum", en: "A member of the public" },
          },
        ],
      },
    ],
  },

  {
    id: "kamu-dan-buku",
    doodle: "book",
    eyebrow: { id: "Kebiasaan membaca", en: "Reading habits" },
    title: {
      id: "Kamu & buku: seberapa dekat?",
      en: "You and books: how close?",
    },
    questions: [
      {
        id: "reading_frequency",
        type: "radio",
        required: true,
        label: {
          id: "Dalam satu bulan terakhir, seberapa sering kamu membaca di luar kebutuhan sekolah atau pekerjaan?",
          en: "In the past month, how often did you read something that was not for school or work?",
        },
        options: [
          { value: "never", label: { id: "Tidak pernah", en: "Never" } },
          {
            value: "1_2_month",
            label: { id: "1–2 kali sebulan", en: "Once or twice a month" },
          },
          {
            value: "3_5_month",
            label: {
              id: "3–5 kali sebulan",
              en: "Three to five times a month",
            },
          },
          {
            value: "more_5_month",
            label: {
              id: "Lebih dari 5 kali sebulan",
              en: "More than five times a month",
            },
          },
          {
            value: "almost_daily",
            label: { id: "Hampir setiap hari", en: "Almost every day" },
          },
        ],
      },
      {
        id: "reading_kinds",
        type: "checkbox",
        required: true,
        other: true,
        help: {
          id: "Boleh pilih lebih dari satu",
          en: "Pick as many as you like",
        },
        label: {
          id: "Kalau membaca, kamu paling suka baca apa?",
          en: "When you do read, what do you enjoy most?",
        },
        options: [
          {
            value: "fiction",
            label: { id: "Cerita/novel", en: "Stories and novels" },
          },
          {
            value: "children",
            label: {
              id: "Buku anak/dongeng",
              en: "Children’s books and folk tales",
            },
          },
          { value: "comic", label: { id: "Komik", en: "Comics" } },
          {
            value: "science",
            label: {
              id: "Buku pengetahuan/sains",
              en: "Non-fiction and science",
            },
          },
          {
            value: "news",
            label: { id: "Berita & artikel", en: "News and articles" },
          },
          {
            value: "environment",
            label: { id: "Buku tentang lingkungan", en: "Books about nature" },
          },
          {
            value: "religion",
            label: { id: "Buku agama", en: "Religious books" },
          },
          {
            value: "ebook",
            label: {
              id: "E-book/bacaan digital",
              en: "E-books and digital reading",
            },
          },
        ],
      },
    ],
  },

  {
    id: "akses-buku",
    doodle: "glasses",
    eyebrow: { id: "Akses bacaan", en: "Getting hold of books" },
    title: {
      id: "Kalau mau baca, nyari bukunya ke mana?",
      en: "When you want to read, where do the books come from?",
    },
    questions: [
      {
        id: "access_ease",
        type: "scale",
        required: true,
        label: {
          id: "Menurutmu, seberapa mudah mencari buku atau tempat yang nyaman untuk membaca di sekitar tempat tinggalmu?",
          en: "How easy is it to find books, or a comfortable place to read, near where you live?",
        },
        scale: {
          min: 1,
          max: 5,
          minLabel: { id: "Sangat sulit", en: "Very hard" },
          maxLabel: { id: "Sangat mudah", en: "Very easy" },
        },
      },
      {
        id: "book_source",
        type: "radio",
        required: true,
        other: true,
        label: {
          id: "Kalau kamu ingin membaca, biasanya kamu mendapatkan buku atau bacaan dari mana?",
          en: "When you want to read, where do you usually get something to read?",
        },
        options: [
          {
            value: "school_library",
            label: { id: "Perpustakaan sekolah", en: "The school library" },
          },
          {
            value: "public_library",
            label: {
              id: "Perpustakaan umum/taman baca",
              en: "A public library or reading garden",
            },
          },
          {
            value: "buy",
            label: { id: "Membeli sendiri", en: "I buy them myself" },
          },
          {
            value: "borrow",
            label: {
              id: "Meminjam dari teman/keluarga",
              en: "Borrowing from friends or family",
            },
          },
          {
            value: "internet",
            label: { id: "Internet/e-book", en: "The internet or e-books" },
          },
          {
            value: "social_media",
            label: {
              id: "Media sosial/artikel online",
              en: "Social media or online articles",
            },
          },
          {
            value: "no_access",
            label: {
              id: "Saya hampir tidak memiliki akses terhadap bahan bacaan",
              en: "I have almost no access to reading material",
            },
          },
        ],
      },
    ],
  },

  {
    id: "setelah-gempa",
    doodle: "wave",
    eyebrow: { id: "Perubahan", en: "What changed" },
    title: {
      id: "Setelah gempa, apa yang berubah?",
      en: "After the earthquake, what changed?",
    },
    intro: {
      id: "Belakangan ini kita sama-sama merasakan adanya perubahan di sekitar kita setelah gempa. Kami ingin tahu, apakah perubahan itu ikut memengaruhi kesempatan kamu untuk membaca, belajar, mencari informasi, atau mengikuti kegiatan bersama. Kamu nggak perlu menceritakan pengalaman pribadi atau hal-hal yang tidak ingin kamu bagikan. Cukup ceritakan perubahan yang kamu rasakan dalam keseharian.",
      en: "We have all felt things shift around us since the earthquake. We would like to know whether that also changed your chances to read, study, find information, or join activities. You do not need to share anything personal you would rather keep to yourself — just the changes you notice day to day.",
    },
    questions: [
      {
        id: "quake_change",
        type: "radio",
        required: true,
        label: {
          id: "Setelah gempa yang terjadi baru-baru ini, apakah kamu merasa kesempatan untuk membaca, belajar, atau mengikuti kegiatan seperti itu berubah?",
          en: "Since the recent earthquake, do you feel your chances to read, study, or join activities like that have changed?",
        },
        options: [
          {
            value: "harder",
            label: { id: "Jadi lebih sulit", en: "They got harder" },
          },
          {
            value: "easier",
            label: {
              id: "Justru jadi lebih mudah/meningkat",
              en: "They actually got easier",
            },
          },
          {
            value: "same",
            label: {
              id: "Kurang lebih masih sama",
              en: "More or less the same",
            },
          },
          {
            value: "not_yet",
            label: {
              id: "Saya belum merasakan perubahan",
              en: "I have not noticed a change",
            },
          },
        ],
      },
      {
        id: "quake_factors",
        type: "checkbox",
        required: true,
        other: true,
        help: {
          id: "Boleh pilih lebih dari satu",
          en: "Pick as many as you like",
        },
        label: {
          id: "Kalau ada perubahan, kira-kira apa yang paling memengaruhinya?",
          en: "If something did change, what had the biggest hand in it?",
        },
        options: [
          {
            value: "home",
            label: {
              id: "Kondisi rumah atau lingkungan sekitar",
              en: "The state of my home or neighbourhood",
            },
          },
          {
            value: "study_space",
            label: {
              id: "Sekarang lebih sulit mencari tempat untuk belajar atau membaca",
              en: "It is harder to find a place to study or read",
            },
          },
          {
            value: "school_work",
            label: {
              id: "Kegiatan sekolah atau pekerjaan berubah",
              en: "School or work changed",
            },
          },
          {
            value: "books",
            label: {
              id: "Lebih sulit mendapatkan buku atau bacaan",
              en: "Books are harder to get hold of",
            },
          },
          {
            value: "internet",
            label: {
              id: "Lebih sulit mendapatkan internet atau informasi",
              en: "Internet or information is harder to get",
            },
          },
          {
            value: "family",
            label: { id: "Kondisi keluarga", en: "Family circumstances" },
          },
          {
            value: "no_change",
            label: { id: "Tidak ada perubahan", en: "Nothing changed" },
          },
        ],
      },
    ],
  },

  {
    id: "tantangan",
    doodle: "pencil",
    eyebrow: { id: "Hambatan", en: "What gets in the way" },
    title: {
      id: "Kalau menurutmu, apa yang masih kurang?",
      en: "What do you think is still missing?",
    },
    questions: [
      {
        id: "challenges",
        type: "checkbox",
        required: true,
        other: true,
        help: {
          id: "Boleh pilih lebih dari satu",
          en: "Pick as many as you like",
        },
        label: {
          id: "Menurutmu, apa yang paling menjadi tantangan untuk membaca dan belajar di lingkunganmu?",
          en: "What makes reading and studying hardest where you live?",
        },
        options: [
          {
            value: "books_hard",
            label: {
              id: "Susah mendapatkan buku atau bacaan",
              en: "Books are hard to come by",
            },
          },
          {
            value: "no_space",
            label: {
              id: "Tidak banyak tempat yang nyaman untuk membaca atau belajar",
              en: "There are few comfortable places to read or study",
            },
          },
          {
            value: "not_a_habit",
            label: {
              id: "Orang-orang di sekitar belum terbiasa membaca",
              en: "People around me are not used to reading",
            },
          },
          {
            value: "no_companion",
            label: {
              id: "Anak-anak masih kurang mendapat teman atau pendamping untuk belajar",
              en: "Children have no one to learn alongside",
            },
          },
          {
            value: "cannot_read",
            label: {
              id: "Tidak mahir membaca",
              en: "Reading itself is difficult",
            },
          },
          {
            value: "price",
            label: {
              id: "Harga buku masih terlalu mahal",
              en: "Books cost too much",
            },
          },
        ],
      },
    ],
  },

  {
    id: "kegiatan",
    doodle: "sprout",
    eyebrow: { id: "Kegiatan", en: "Activities" },
    title: {
      id: "Kalau boleh pilih, mau baca bareng ngapain?",
      en: "If you could choose, what would reading together look like?",
    },
    questions: [
      {
        id: "activities",
        type: "checkbox",
        required: true,
        other: true,
        help: {
          id: "Boleh pilih lebih dari satu",
          en: "Pick as many as you like",
        },
        label: {
          id: "Kalau ada kegiatan membaca atau belajar di dekat tempat tinggalmu, kamu paling ingin ikut kegiatan yang mana?",
          en: "If there were reading or learning activities near you, which would you want to join?",
        },
        options: [
          {
            value: "outdoor_reading",
            label: {
              id: "Baca buku bareng di tempat terbuka",
              en: "Reading together out in the open",
            },
          },
          {
            value: "storytelling",
            label: {
              id: "Dongeng atau cerita untuk anak-anak",
              en: "Storytelling for children",
            },
          },
          {
            value: "book_talk",
            label: {
              id: "Ngobrol bareng tentang buku",
              en: "Talking about books",
            },
          },
          {
            value: "book_swap",
            label: { id: "Tukar buku", en: "Swapping books" },
          },
          {
            value: "mobile_library",
            label: {
              id: "Perpustakaan atau lapak baca keliling",
              en: "A travelling library or reading stall",
            },
          },
          {
            value: "literacy_class",
            label: {
              id: "Belajar menulis & membaca",
              en: "Learning to read and write",
            },
          },
          {
            value: "creative",
            label: {
              id: "Menggambar atau kegiatan kreatif lainnya",
              en: "Drawing and other creative activities",
            },
          },
          {
            value: "social_talk",
            label: {
              id: "Ngobrol tentang masalah sosial dan lingkungan di sekitar kita",
              en: "Talking about social and environmental issues around us",
            },
          },
          {
            value: "kids_learning",
            label: {
              id: "Kegiatan belajar untuk anak-anak",
              en: "Learning activities for children",
            },
          },
        ],
      },
    ],
  },

  // Dipisah dari langkah "kegiatan": digabung, satu layar memuat 21 kartu
  // pilihan — sekitar 3000px scroll di ponsel.
  {
    id: "obrolan",
    doodle: "pinisi",
    eyebrow: { id: "Obrolan", en: "Conversations" },
    title: {
      id: "Kalau ngobrol bareng, mau bahas apa?",
      en: "And when we talk, what should it be about?",
    },
    questions: [
      {
        id: "topics",
        type: "checkbox",
        required: true,
        other: true,
        help: {
          id: "Boleh pilih lebih dari satu",
          en: "Pick as many as you like",
        },
        label: {
          id: "Kalau ada kegiatan membaca atau ngobrol bareng, kamu ingin membahas hal apa?",
          en: "And what would you want those conversations to be about?",
        },
        options: [
          { value: "education", label: { id: "Pendidikan", en: "Education" } },
          {
            value: "environment",
            label: { id: "Lingkungan & sampah", en: "Nature and waste" },
          },
          { value: "tourism", label: { id: "Pariwisata", en: "Tourism" } },
          {
            value: "local_culture",
            label: { id: "Budaya lokal", en: "Local culture" },
          },
          { value: "health", label: { id: "Kesehatan", en: "Health" } },
          {
            value: "family_economy",
            label: { id: "Ekonomi keluarga", en: "Household economy" },
          },
          { value: "politics", label: { id: "Politik", en: "Politics" } },
          {
            value: "social_life",
            label: {
              id: "Kehidupan sosial di sekitar kita",
              en: "Social life around us",
            },
          },
          {
            value: "self_development",
            label: { id: "Pengembangan diri", en: "Personal growth" },
          },
          {
            value: "local_stories",
            label: {
              id: "Cerita & budaya daerah",
              en: "Local stories and traditions",
            },
          },
        ],
      },
    ],
  },

  {
    id: "peran",
    doodle: "sun",
    eyebrow: { id: "Peran", en: "Your part" },
    title: {
      id: "Baca nggak harus sendirian",
      en: "Reading does not have to be a solo act",
    },
    intro: {
      id: "Menurut kami, literasi bukan cuma soal buku. Literasi juga soal ruang untuk bertemu, bertukar cerita, dan melihat dunia dari sudut pandang yang berbeda. Kalau ada kegiatan seperti ini di dekatmu, kamu mau jadi bagian yang mana?",
      en: "To us, literacy is not only about books. It is also about having somewhere to meet, trade stories, and see the world from someone else’s angle. If that happened near you, which part would you want to play?",
    },
    questions: [
      {
        id: "involvement",
        type: "radio",
        required: true,
        label: {
          id: "Kalau ada kegiatan membaca atau belajar di lingkunganmu, kamu paling tertarik untuk...",
          en: "If reading or learning activities came to your area, you would most like to...",
        },
        options: [
          {
            value: "participant",
            label: { id: "Ikut sebagai peserta", en: "Join as a participant" },
          },
          {
            value: "volunteer",
            label: {
              id: "Ikut membantu sebagai relawan",
              en: "Help out as a volunteer",
            },
          },
          {
            value: "bring_community",
            label: {
              id: "Mengajak sekolah atau komunitas untuk ikut",
              en: "Bring my school or community along",
            },
          },
          {
            value: "partner",
            label: {
              id: "Membantu sebagai partner kegiatan",
              en: "Support it as a partner",
            },
          },
          {
            value: "interested_unsure",
            label: {
              id: "Aku tertarik, tapi belum tahu mau ikut sebagai apa",
              en: "I am interested, but not sure in what capacity yet",
            },
          },
          {
            value: "not_yet",
            label: {
              id: "Untuk sekarang, aku belum tertarik ikut",
              en: "Not interested for now",
            },
          },
        ],
      },
      {
        id: "availability",
        type: "radio",
        required: true,
        label: {
          id: "Kapan kamu biasanya punya waktu untuk ikut kegiatan?",
          en: "When do you usually have time to join something?",
        },
        options: [
          {
            value: "weekday_morning",
            label: { id: "Pagi hari di hari kerja", en: "Weekday mornings" },
          },
          {
            value: "weekday_noon",
            label: { id: "Siang hari di hari kerja", en: "Weekday afternoons" },
          },
          {
            value: "weekday_evening",
            label: {
              id: "Sore/malam hari di hari kerja",
              en: "Weekday evenings",
            },
          },
          { value: "weekend", label: { id: "Akhir pekan", en: "Weekends" } },
          { value: "flexible", label: { id: "Fleksibel", en: "Whenever" } },
        ],
      },
    ],
  },

  {
    id: "cerita",
    doodle: "sparkle",
    eyebrow: { id: "Opsional", en: "Optional" },
    title: {
      id: "Sekarang, giliran kamu yang cerita",
      en: "Now it is your turn to talk",
    },
    intro: {
      id: "Sampai di sini, kami sudah banyak bertanya. Sekarang nggak ada pilihan ganda. Giliran kamu yang bicara. Dua pertanyaan ini boleh dilewati.",
      en: "We have asked plenty by now. No more multiple choice — your turn. Both of these can be skipped.",
    },
    questions: [
      {
        id: "hopes",
        type: "paragraph",
        required: false,
        maxLength: 1500,
        label: {
          id: "Kalau Waca Bajo hadir di lingkunganmu, apa yang paling kamu harapkan dari gerakan ini?",
          en: "If Waca Bajo turned up in your area, what would you hope for most?",
        },
        placeholder: {
          id: "Ceritakan apa pun yang menurutmu penting. Tidak harus panjang.",
          en: "Anything that matters to you. It does not have to be long.",
        },
      },
      {
        id: "contact",
        type: "text",
        required: false,
        maxLength: 120,
        label: {
          id: "Mau tetap terhubung dengan Waca Bajo?",
          en: "Want to stay in touch with Waca Bajo?",
        },
        placeholder: {
          id: "Tinggalkan WhatsApp atau email kalau kamu ingin dapat kabar kegiatan berikutnya.",
          en: "Leave a WhatsApp number or email if you would like news of what comes next.",
        },
      },
    ],
  },
];

/** Semua pertanyaan, tanpa peduli step-nya — dipakai validasi & submit. */
export const allQuestions: SurveyQuestion[] = surveySteps.flatMap(
  (step) => step.questions,
);

export function getQuestion(id: string): SurveyQuestion | undefined {
  return allQuestions.find((question) => question.id === id);
}
