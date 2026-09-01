# PRD v1 — Website Waca Bajo

**Status:** Terkirim (fase 1 selesai, live di Vercel)
**Tanggal dokumen:** 5 Agustus 2026
**Sifat dokumen:** Reverse-engineered. Ditulis setelah fase 1 dibangun, untuk
mencatat apa yang sebenarnya jadi — bukan spesifikasi yang disusun di depan.
**Rujukan teknis:** [`docs/DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md),
[`CLAUDE.md`](../CLAUDE.md), [`README.md`](../README.md)

---

## 1. Ringkasan

Waca Bajo adalah gerakan literasi dari Labuan Bajo. Fase 1 menghasilkan
situs publik satu halaman (plus satu halaman style guide) yang memperkenalkan
gerakan ini dan membuka satu pintu masuk untuk calon relawan.

Yang dibangun bukan sekadar landing page. Fondasinya adalah **design system
yang diturunkan langsung dari Waca Bajo Brand Guidelines 2026**, hidup sebagai
token CSS dan data TypeScript, dan dirender balik sebagai style guide di
`/brand`. Konsekuensinya: siapa pun yang meneruskan proyek ini tidak perlu
membuka PDF deck untuk tahu warna, tipografi, atau aturan menulis yang benar.

**Satu kalimat:** situs perkenalan Waca Bajo yang memperlakukan brand
guidelines sebagai kode, bukan sebagai lampiran.

---

## 2. Masalah & konteks

Sebelum fase ini, Waca Bajo tidak punya alamat sendiri di web. Semua rujukan
publik bertumpu pada Instagram, dan brand guidelines 2026 baru ada sebagai PDF
yang hanya dibuka saat dibutuhkan.

Tiga masalah yang ditangani:

1. **Tidak ada tempat untuk menjelaskan diri secara utuh.** Feed Instagram
   bagus untuk momen, buruk untuk menjawab "ini gerakan apa, kerjanya apa,
   saya bisa masuk lewat mana".
2. **Calon relawan tidak punya jalur yang jelas.** Niat baik berhenti di DM
   yang tidak tahu harus bertanya apa.
3. **Brand guidelines berisiko luntur.** Deck PDF cepat jadi tidak relevan
   begitu ada beberapa orang membuat materi tanpa membukanya.

---

## 3. Tujuan fase 1

| # | Tujuan | Wujudnya di produk |
| - | ------ | ------------------ |
| 1 | Pengunjung baru paham gerakan ini dalam satu kali gulir | Beranda dengan alur kenapa → apa → siapa → bagaimana |
| 2 | Calon relawan tahu langkah konkret pertamanya | Section "Cara bergabung" + CTA email/Instagram |
| 3 | Brand guidelines jadi rujukan yang hidup | `/brand`, token di `globals.css`, data di `src/lib/brand.ts` |
| 4 | Situs bisa diteruskan orang lain tanpa brief lisan | Copy terpisah sebagai data, komentar bahasa Indonesia, `DESIGN-SYSTEM.md` |
| 5 | Bisa deploy hari ini, tanpa infrastruktur | Semua route statis, tanpa CMS/DB |

### Bukan tujuan fase ini

- CMS, database, atau autentikasi
- Form pendaftaran relawan di situs (fase 1 sengaja lewat email & Instagram)
- Blog, arsip kegiatan, atau galeri foto
- Donasi / pembayaran
- Multi-bahasa (satu bahasa adalah keputusan brand, lihat §7)
- Analytics dan tracking

---

## 4. Pengguna

**Primer — calon relawan.** Warga Labuan Bajo dan sekitarnya, sebagian besar
usia muda, mayoritas datang dari tautan bio Instagram di ponsel. Pertanyaannya:
"kegiatannya seperti apa, saya cocok tidak, harus punya pengalaman mengajar
tidak, mulainya bagaimana." Situs menjawab keempatnya secara eksplisit.

**Sekunder — mitra & pendukung.** Sekolah, komunitas, penerbit, calon donatur
yang perlu menilai apakah gerakan ini serius dan jelas arahnya.

**Internal — tim Waca Bajo dan siapa pun yang menggarap materi brand.**
Pengguna sesungguhnya dari `/brand`.

---

## 5. Yang dibangun

### 5.1 Beranda (`/`)

Delapan section, berurutan sebagai satu argumen:

| Section | Peran | Sumber isi |
| ------- | ----- | ---------- |
| Hero | Kalimat pembuka + dua CTA + strip fakta | `hero`, `heroFacts` |
| Fondasi (`#tentang`) | Kenapa ada, asal nama, cara memaknai | `foundation` |
| Tempat | Ilustrasi peta Labuan Bajo, menjawab "asal nama" | `place` |
| Program (`#program`) | Tiga program dengan tag | `programs` |
| Esensi brand | "Growing Through Stories" + kutipan pembuka deck | `brandEssence` |
| Nilai (`#nilai`) | Empat nilai + terjemahannya jadi perilaku, lalu pilar tone | `brandValues`, `valuePractice`, `toneOfVoice` |
| Cara bergabung | Tiga langkah bernomor | `joinSteps` |
| Ajakan penutup (`#gabung`) | Blok CTA email + Instagram | `finalCta`, `siteConfig.social` |

Seluruh copy hidup di [`src/lib/content.ts`](../src/lib/content.ts);
[`src/app/page.tsx`](../src/app/page.tsx) hanya menyusun tata letak. Copy bisa
disunting tanpa menyentuh markup.

### 5.2 Halaman brand (`/brand`)

Style guide hidup, dirender dari [`src/lib/brand.ts`](../src/lib/brand.ts) —
bukan disalin dari deck. Empat section: `#warna` (enam keluarga warna dengan
ramp 50–950, pasangan teks yang lolos AA, pasangan chip, tiga gradasi),
`#tipografi`, `#komponen`, `#suara` (pilar tone of voice, aturan penulisan,
kata-kata kepribadian brand).

Karena token yang ditampilkan adalah token yang dipakai produksi, halaman ini
tidak bisa melenceng dari situsnya sendiri.

### 5.3 Chrome & pelengkap

- Header sticky dengan menu mobile (Escape untuk menutup), CTA "Jadi relawan"
- Footer gelap: deskripsi, navigasi, kontak, tagline
- Halaman 404 ber-copy sendiri, bukan default Next
- `robots.txt` dan `sitemap.xml` digenerate dari `siteConfig`
- Favicon SVG

### 5.4 Komponen & aset

- **Primitif UI:** `Button`/`ButtonLink` (3 varian × 3 ukuran), `Card`
  (+ `CardBadge`, `CardTitle`, `CardBody`), `Chip` (5 tone), `Container`,
  `Section` (+ `Eyebrow`, `SectionHeading`), `ProgramCard`, `Logo`
- **Doodle:** sembilan ilustrasi SVG inline (buku, pinisi, tunas, matahari,
  kacamata, ombak, balon bicara, pensil, kilau) — dipetakan lewat `doodleByName`
- **Ilustrasi peta:** `src/assets/ilustrasi_peta_bajo.jpeg`, dioptimasi oleh
  `next/image` dengan blur placeholder

`Section` dan `Chip` sengaja membatasi pilihan tone ke pasangan yang sudah
lolos kontras. Warna yang tidak aman tidak bisa dipilih tanpa keluar dari API
komponen.

---

## 6. Design system

Diturunkan dari Brand Guidelines 2026 dan didokumentasikan penuh di
[`docs/DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md).

**Warna.** Enam keluarga: Darkest Forest, Miles of Persephone, Maritime
Outpost, Sunset Gold, Vintage Cream, Brandy. Step yang tercetak di deck dipakai
apa adanya sebagai anchor; step lain diinterpolasi di ruang OKLab supaya jarak
terang antar-step terasa rata. Semua hidup sebagai CSS custom property di
[`src/app/globals.css`](../src/app/globals.css), diekspos ke Tailwind v4 lewat
`@theme inline`.

**Aturan yang mengikat:** tidak ada hex di komponen; setiap pasangan
teks/latar yang dipakai harus ada di `colorPairings` atau `chipPairings` dan
lolos WCAG AA; Sunset Gold bukan warna teks di latar terang — satu-satunya
jalannya adalah lewat chip gold (12.0:1).

**Tipografi.** Bricolage Grotesque (primer — headline, body, UI, bobot 700 +
tracking −0.03em untuk judul) dan Sorts Mill Goudy (sekunder — wordmark,
kutipan, aksen italik). Keduanya lewat `next/font/google`, `display: swap`.
Headline memakai Sentence case; uppercase hanya untuk eyebrow.

**Bentuk & motion.** Lima radius (6/12/20/28px + pill), tiga bayangan lembut
beraura burgundy. Animasi masuk memakai scroll-driven animation CSS
(`animation-timeline: view()`) — tanpa JavaScript, tanpa observer, dan browser
yang belum mendukung langsung menampilkan isinya. `prefers-reduced-motion`
dihormati di seluruh situs.

---

## 7. Aturan copy

Diturunkan dari deck, hidup sebagai data di `copyRules` dan `toneOfVoice`,
terbaca publik di `/brand#suara`.

1. Headline dan sub-headline memakai Sentence case
2. Satu bahasa: Indonesia, termasuk judul halaman dan meta description
3. Bukti berbentuk cerita orang, bukan angka yang belum ada datanya
4. Istilah internal dijelaskan fungsinya lebih dulu, atau tidak dipakai
5. Boleh menyebut yang belum berhasil
6. Headline panjang dipecah jadi dua bagian yang seimbang
7. Pengecualian tagline: kutipan verbatim sampul deck dan brand essence
   dipertahankan casing dan bahasa aslinya (`hero.title`, `brandEssence`)

Aturan #3 adalah alasan strip fakta di bawah hero berbunyi "Tiga program
berjalan / Semua usia / Warga yang menggerakkan" dan bukan angka penerima
manfaat: datanya belum ada, dan angka karangan di situs gerakan literasi jelas
bukan pilihan.

---

## 8. Keputusan teknis & alasannya

| Keputusan | Alasan |
| --------- | ------ |
| Next.js 16 App Router, semua route statis | Deploy ke Vercel tanpa server; cepat di koneksi Labuan Bajo |
| Tanpa CMS & tanpa database | Isinya belum banyak dan belum stabil; menambahkannya sekarang berarti memelihara sesuatu yang belum dipakai |
| Copy sebagai data (`content.ts`), bukan di JSX | Menyunting teks tidak perlu menyentuh markup — dan jadi jalur migrasi termudah ke CMS nanti |
| Brand guidelines sebagai data (`brand.ts`) | `/brand` dirender dari sumber yang sama dengan produksi, jadi tidak bisa basi |
| Token warna di `globals.css`, bukan `tailwind.config` | Tailwind v4; token tetap terbaca sebagai CSS var di luar Tailwind |
| Doodle SVG inline, bukan file gambar | Ikut `currentColor`, tidak ada request tambahan, tidak ada layout shift |
| Reveal pakai scroll-driven animation CSS | Nol JavaScript, degradasi aman — konten tidak pernah tersembunyi |
| `NEXT_PUBLIC_SITE_URL` lewat env | Metadata, canonical, robots, dan sitemap ikut domain produksi tanpa hardcode |

**Stack:** Next.js 16.3 (Turbopack) · React 19.2 · TypeScript strict ·
Tailwind CSS v4 · ESLint 9 flat config. Nol dependensi runtime di luar
Next/React.

---

## 9. Aksesibilitas

Bukan checklist tambahan — dipasang di lapisan token dan API komponen.

- Semua pasangan teks/latar lolos WCAG AA; pasangan chip lolos AAA
- `Section` dan `Chip` hanya menerima tone yang sudah divalidasi
- Tautan "Lompat ke konten" untuk pengguna keyboard
- `:focus-visible` terlihat jelas di seluruh situs (outline burgundy 2px)
- Target sentuh minimal 44px pada menu mobile
- Menu mobile bisa ditutup dengan Escape, dengan `aria-expanded`/`aria-controls`
- Semua doodle dan elemen dekoratif diberi `aria-hidden`
- Ilustrasi peta punya `alt` deskriptif
- `prefers-reduced-motion` mematikan seluruh animasi dan smooth scroll

---

## 10. Yang sengaja ditinggalkan sebagai utang

Ditandai TODO di kode, bukan disembunyikan:

1. **Isi program masih kerangka** (`programs` di `content.ts`). Struktur, tone
   warna, dan tag sudah final; teksnya menunggu data dari tim. Pola dua kalimat
   (kalimat 1 menjelaskan kegiatan, kalimat 2 menjawab keraguan pembaca) perlu
   dipertahankan saat diganti.
2. **Belum ada bukti berbentuk cerita orang.** Strip fakta di bawah hero adalah
   penambal. Begitu ada satu kutipan asli dari warga atau relawan (dengan
   izinnya), taruh sebagai section tersendiri dan strip fakta boleh pensiun.
3. **Ilustrasi peta bukan peta faktual.** Garis pantainya tidak akurat, jadi
   framing-nya sengaja tidak pernah mengklaim ketepatan geografis — tidak ada
   penanda kampung, tidak ada label lokasi.
4. **Belum ada gambar Open Graph.** Metadata `openGraph`/`twitter` sudah siap,
   gambarnya belum dibuat — preview tautan masih polos.
5. **Domain produksi belum pasti.** `.env.example` masih memakai
   `https://wacabajo.org` sebagai contoh, sementara kontak resmi memakai
   alamat Gmail. `NEXT_PUBLIC_SITE_URL` perlu disetel ke domain yang benar-benar
   dipakai, karena metadata, canonical, `robots.txt`, dan `sitemap.xml`
   mengikutinya.

---

## 11. Verifikasi

```bash
npm run build && npm run lint
```

`npm run typecheck` baru akurat setelah `npm run build` sekali dijalankan,
karena tipe route (`LayoutProps`, `PageProps`) digenerate saat build.

Tidak ada automated test di fase ini. Verifikasinya bertumpu pada TypeScript
strict, ESLint, dan kontras warna yang sudah dihitung dan dicatat sebagai
komentar di sebelah tiap token.

---

## 12. Arah fase berikutnya

Diurutkan berdasarkan yang paling terasa bagi pengguna, bukan yang paling
menarik dikerjakan:

1. **Isi program yang sungguhan** — utang paling mahal; sisa situs tidak akan
   sepenuhnya kredibel sampai ini beres
2. **Satu cerita orang** — memenuhi aturan copy #3 dan brand essence sekaligus
3. **Gambar Open Graph** — situs ini akan hidup dari tautan yang dibagikan di
   Instagram dan WhatsApp
4. **Form relawan** — menggantikan email sebagai pintu masuk, kalau volumenya
   sudah cukup untuk membenarkan biayanya
5. **Halaman kegiatan / arsip** — saat sudah ada dokumentasi yang layak
   ditampilkan; ini pemicu wajar untuk memasang CMS
6. **Analytics** — sekadar untuk tahu tautan mana yang benar-benar dipakai
