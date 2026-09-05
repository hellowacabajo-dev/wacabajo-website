# Design System — Waca Bajo

Satu-satunya rujukan desain proyek ini: palet, tipografi, aturan copy, dan
standar UI/UX yang wajib dipenuhi setiap halaman baru. Implementasinya hidup
sebagai token di `src/app/globals.css`.

Dokumen ini menggantikan halaman `/brand` yang sebelumnya ada di situs. Style
guide tidak lagi tayang untuk publik — situsnya untuk pengunjung, dokumen ini
untuk yang mengerjakannya.

---

## 1. Warna

Lima warna brand plus satu skala neutral. Nilai yang tercantum di bawah adalah
sumber resmi; sisanya diinterpolasi.

| Nama                | Peran                       | Anchor resmi                                |
| ------------------- | --------------------------- | ------------------------------------------- |
| Vintage Cream       | Base color / kanvas         | 50 `#FAF6EC`                                |
| Darkest Forest      | Deep green, resilience      | 500 `#909949`, 800 `#464C28`, 950 `#292E16` |
| Miles of Persephone | Burgundy Kain Songke        | 600 `#C53D45`, 800 `#892B31`, 950 `#471417` |
| Maritime Outpost    | Deep blue, kepercayaan      | 300 `#95BBE4`, 500 `#377AC0`, 700 `#1F497D` |
| Sunset Gold         | Kehangatan golden hour      | 200 `#F9D68E`, 300 `#F7C46B`, 400 `#F3A22C` |
| Brandy              | Neutral hangat pendamping   | skala 50–950 lengkap                        |

Makna tiap keluarga:

- **Vintage Cream** — off-white lembut dengan undertone kuning/beige. Timeless,
  hangat, terasa lived-in.
- **Darkest Forest** — deep green dengan nuansa alami yang tenang. Mewakili
  perkembangan yang nyata, harmonis, stabil.
- **Miles of Persephone** — burgundy yang diambil dari Kain Songke, pakaian
  adat Manggarai. Simbol daya juang dan semangat eksplorasi.
- **Maritime Outpost** — deep blue, melambangkan kepercayaan dan ketenangan
  dalam setiap perjalanan.
- **Sunset Gold** — kehangatan, rasa takjub, dan momen berkesan yang layak
  dikenang, seperti golden hour khas Bajo.
- **Brandy** — neutral hangat untuk garis, teks sekunder, dan permukaan yang
  perlu terasa tenang.

### Skala lengkap

Step yang **ditebalkan** adalah nilai resmi; sisanya hasil interpolasi di ruang
**OKLab** supaya jarak terang antar-step terasa rata.

| Step | Forest      | Persephone  | Maritime    | Gold        | Cream     | Brandy      |
| ---- | ----------- | ----------- | ----------- | ----------- | --------- | ----------- |
| 50   | `#E1E6CB`   | `#FFD2D0`   | `#D6E7F9`   | `#FEECC8`   | **`#FAF6EC`** | **`#FAF7F2`** |
| 100  | `#D0D6B2`   | `#F9BAB8`   | `#C0D8F2`   | `#FBE1AC`   | `#F4EEE0` | **`#F4EDE0`** |
| 200  | `#C0C798`   | `#F0A3A0`   | `#ABC9EB`   | **`#F9D68E`** | `#EFE7D4` | **`#E8D9C0`** |
| 300  | `#AFB77E`   | `#E68B89`   | **`#95BBE4`** | **`#F7C46B`** | `#E2D9C1` | **`#DAC29D`** |
| 400  | `#A0A864`   | `#DC7272`   | `#679BD2`   | **`#F3A22C`** | `#D6CAAE` | **`#C8A06F`** |
| 500  | **`#909949`** | `#D1595B`   | **`#377AC0`** | `#D08607`   | `#C9BC9C` | **`#BC8853`** |
| 600  | `#767E3E`   | **`#C53D45`** | `#2B619E`   | `#AD6A00`   | —         | **`#AF7547`** |
| 700  | `#5E6533`   | `#A7343B`   | **`#1F497D`** | `#8C5000`   | —         | **`#915D3D`** |
| 800  | **`#464C28`** | **`#892B31`** | `#0F3461`   | `#6C3700`   | —         | **`#764C36`** |
| 900  | `#373D1F`   | `#671F24`   | `#022147`   | `#4D1E00`   | —         | **`#60402E`** |
| 950  | **`#292E16`** | **`#471417`** | `#000F2E`   | `#300700`   | —         | **`#332017`** |

Catatan pembacaan: Maritime Outpost 500 tercetak terpotong di sumber aslinya
(`#37AC0`). Sampling piksel swatch-nya menghasilkan ~`#367BBF`, sehingga dibaca
sebagai **`#377AC0`**. Kalau file sumber Figma/Illustrator tersedia, nilai ini
layak dikonfirmasi ulang.

### Pasangan warna

Hanya kombinasi berikut yang dipakai untuk teks (semua lolos WCAG AA):

| Latar                | Teks             | Rasio  | Dipakai untuk                       |
| -------------------- | ---------------- | ------ | ----------------------------------- |
| Vintage Cream 50     | Persephone 950   | 14.1:1 | Pasangan default seluruh halaman    |
| Darkest Forest 950   | Vintage Cream 50 | 13.0:1 | Section gelap, footer               |
| Darkest Forest 950   | Sunset Gold 300  | 8.7:1  | Eyebrow dan aksen di section gelap  |
| Persephone 800       | Vintage Cream 50 | 8.6:1  | Tombol primer dan badge             |
| Maritime Outpost 700 | Vintage Cream 50 | 9.1:1  | Section informatif, tag program     |
| Sunset Gold 400      | Persephone 950   | 7.3:1  | Tombol aksen; tombol primer di tema gelap |

Di **tema gelap** tombol primer berpindah dari Persephone 800 ke Sunset Gold
400. Burgundy 600 — nilai yang dipakai sebelumnya — cuma terpisah 2,8:1 dari
latar Darkest Forest 950, jadi tombolnya sulit ditemukan, dan kombinasi
hijau-merahnya juga yang dikeluhkan stakeholder. Gold 400 terpisah 6,7:1 dari
latar. Hover-nya naik ke Gold 300 (bukan turun ke 500) karena di latar gelap
arah "lebih terang" yang terbaca sebagai terangkat.

**Sunset Gold tidak pernah dipakai sebagai warna teks di atas Vintage Cream**
(hanya 1.9:1), dan teks putih tidak pernah dipakai di atas Sunset Gold (1.9:1).
Gold berperan sebagai bidang warna dan aksen, bukan warna teks di latar terang.

Komponen `Section` membatasi pilihan latar ke `tone` yang sudah aman, jadi
kombinasi di luar tabel ini tidak akan muncul tanpa sengaja.

#### Angka naik/turun di backoffice

Backoffice punya satu pasangan yang tidak ada di situs publik: angka
perbandingan periode yang perlu terbaca sebagai "naik" atau "turun". Warnanya
berdiri langsung di atas permukaan kartu, bukan di dalam chip, jadi tiap tema
butuh step yang berbeda:

| Latar (kartu)      | Teks           | Rasio  | Dipakai untuk |
| ------------------ | -------------- | ------ | ------------- |
| Putih (tema terang) | Forest 800     | 9.1:1  | Angka naik    |
| Putih (tema terang) | Persephone 800 | 8.6:1  | Angka turun   |
| Darkest Forest 800 (tema gelap) | Forest 200     | 5.1:1  | Angka naik    |
| Darkest Forest 800 (tema gelap) | Persephone 100 | 5.5:1  | Angka turun   |

Token `--chip-*` tidak dipakai di sini. Token itu memang dirancang berpasangan
dengan latarnya sendiri dan tidak didefinisikan ulang di tema gelap, jadi
memakai warna teksnya saja di atas permukaan gelap menghasilkan hijau tua di
atas hijau tua.

### Pasangan chip

Chip, tag, dan badge ikon memakai pola berbeda: tint terang (step 50/100) dari
satu keluarga warna dipasangkan dengan step 900 keluarga yang sama. Karena
semuanya lolos **AAA**, pola ini aman untuk teks sekecil chip:

| Latar         | Teks           | Rasio  | Dipakai untuk                      |
| ------------- | -------------- | ------ | ---------------------------------- |
| Forest 50     | Forest 900     | 8.9:1  | Tag program lapangan, nilai        |
| Persephone 50 | Persephone 900 | 8.6:1  | Tag kelas cerita, nilai            |
| Maritime 50   | Maritime 900   | 12.7:1 | Tag jalan literasi, nilai          |
| Gold 50       | Gold 900       | 12.0:1 | Nomor langkah, nilai               |
| Brandy 100    | Brandy 900     | 8.0:1  | Chip netral (eyebrow hero)         |

Chip Sunset Gold adalah **satu-satunya** cara Gold boleh menampung teks kecil —
karena yang dipakai adalah tint 50, bukan Gold 300/400.

Kalau nanti perlu chip di atas bidang warna pekat, polanya: latar Vintage
Cream 50 solid dengan teks Persephone 950 — lolos AAA di atas warna apa pun
dari palet. (Komponen `ChipOnDark` yang dulu memakai pola ini ikut terhapus
bersama section program.)

---

## 2. Tipografi

Dua typeface, keduanya dari Google Fonts dan bebas dipakai komersial.

| Peran     | Font                | Klasifikasi | Di web dipakai untuk                            |
| --------- | ------------------- | ----------- | ----------------------------------------------- |
| Primary   | Bricolage Grotesque | Sans Serif  | Heading, sub-heading, seluruh elemen UI         |
| Secondary | Sorts Mill Goudy    | Serif       | Paragraf, kutipan, wordmark                     |

Pembagian tokennya:

- `--font-sans` → Bricolage Grotesque — `h1`–`h4` (bobot 700, tracking
  `-0.03em`), sub-heading, eyebrow, tombol, navigasi, chip, label, dan
  penekanan (`<strong>`) di dalam paragraf.
- `--font-serif` → Sorts Mill Goudy — paragraf (`p`, `blockquote`, `dd`,
  `figcaption`), kutipan, dan wordmark.

Alasan teks panjang jatuh ke Goudy: **italic-nya asli**. Bricolage Grotesque
tidak punya italic, jadi setiap penekanan miring di prosa akan di-oblique-kan
palsu oleh browser. Konsekuensi yang harus diterima: keluarga Goudy tidak punya
**bold**. Karena itu:

- Jangan menempelkan `font-bold`/`font-semibold` pada teks yang memakai Goudy.
  Kalau sebuah `<p>` memang perlu tebal, tambahkan `font-sans` pada elemennya.
- `<strong>` dan `<b>` di dalam paragraf sudah otomatis pindah ke Bricolage 600
  lewat `@layer base` — pergantian bentuk huruf itu justru menegaskan.
- `<li>` sengaja **tidak** ikut Goudy: di proyek ini `<li>` lebih sering jadi
  wadah kartu (berisi `h3`, chip, tombol) daripada teks. Prosa di dalam list
  ditulis dalam `<p>`.

Tinggi-x Goudy jauh lebih kecil dari Bricolage, jadi paragraf memakai
`font-size-adjust: ex-height 0.45`. Ini yang membuat `text-base` terasa sama
besar di kedua font, sehingga tidak perlu kompensasi ukuran manual per
komponen. Utility `.font-sans` / `.font-serif` membawa nilai adjust-nya
masing-masing — kalau menambah utility font baru, jangan lupa ikut mengatur
`font-size-adjust`, kalau tidak ukurannya akan salah.

Aturan tipografi lain:

- **Sentence case** untuk semua headline. Uppercase hanya untuk eyebrow/label
  kecil dengan tracking longgar.
- Wordmark selalu lowercase italic (`waca bajo`).
- Headline memakai `text-wrap: balance`, paragraf memakai `text-wrap: pretty`.

Kedua font dimuat lewat `next/font/google`, jadi tidak ada request ke domain
Google saat runtime dan tidak ada layout shift.

### Skala ukuran

Setiap heading punya minimal dua anak tangga: satu untuk ponsel, satu untuk
desktop. Angka di kolom "Ponsel" adalah yang tampil di 375px.

| Elemen          | Ponsel   | sm      | md/lg          |
| --------------- | -------- | ------- | -------------- |
| `h1` hero       | 2.25rem  | 3rem    | 3.75–4.5rem    |
| `h2` section    | 1.75rem  | 2rem    | 2.25–3rem      |
| `h3` kartu      | 1.25rem  | —       | 1.5rem         |
| Paragraf hero   | 1rem     | 1.125rem| 1.25rem        |
| Body kartu      | 0.875rem | —       | 1rem           |

Body text tidak pernah di bawah **16px** di ponsel pada teks utama — di bawah
itu iOS ikut memperbesar halaman sendiri saat form difokuskan.

---

## 3. Suara & copy

### Pilar tone of voice

| Pilar                     | Lakukan                                                      | Hindari                                                |
| ------------------------- | ------------------------------------------------------------ | ------------------------------------------------------ |
| Grounded & Thoughtful     | Sebut yang konkret: tempat, siapa, apa yang dikerjakan        | Klaim tanpa sumber, superlatif, kata sifat menumpuk     |
| Empathic & Impactful      | Satu kalimat yang menjawab keraguan pembaca                   | Bahasa program yang dingin, angka dampak karangan       |
| Collaborative & Inclusive | Bahasa sehari-hari di locale masing-masing, ajakan dengan pintu untuk semua | Campur bahasa dalam satu locale, istilah internal, nada yang memilah orang |

### Aturan penulisan

1. **Sentence case** untuk headline dan sub-headline. Uppercase hanya untuk
   eyebrow dan label kecil.
2. **Dwibahasa: `/id` penuh Indonesia, `/en` penuh Inggris.** Jangan campur
   bahasa dalam satu locale, termasuk `title` dan `description` di metadata.
   Satu-satunya teks yang sama di kedua locale adalah nama diri brand —
   tagline *Growing Through Stories* dipertahankan apa adanya karena ia nama,
   bukan kalimat. Copy hidup sebagai data per locale di `src/lib/content.ts`
   (isi beranda) dan `src/lib/i18n/ui.ts` (navigasi, footer, 404, dst.) — saat
   menambah teks baru, isi kedua bahasanya sekaligus.
3. **Bukti berbentuk cerita orang, bukan angka yang belum ada datanya.**
   Selama data resmi belum ada, `heroFacts` hanya memuat fakta struktural yang
   bisa diverifikasi dari halaman itu sendiri.
4. **Istilah internal dijelaskan fungsinya lebih dulu**, atau tidak dipakai.
   Istilah kerja tim (nama pilar tone of voice, nomor halaman brand deck,
   kode warna) tidak pernah tampil di halaman publik — tempatnya di sini.
5. **Boleh menyebut yang belum berhasil.** Nilai "berani mencoba" dan "berani
   memahami" baru terbaca kalau ada kalimat yang berani mengakui.
6. **Headline panjang dipecah jadi dua bagian yang seimbang.** Pola ini milik
   brand sendiri: "Membaca kata, membaca dunia."

### Pola per elemen

Turunan dari prinsip UX writing — dipakai untuk setiap teks antarmuka baru:

| Elemen             | Pola                                                    | Contoh di situs                                        |
| ------------------ | ------------------------------------------------------- | ------------------------------------------------------ |
| Tombol / CTA       | Kata kerja + objek. Label = apa yang terjadi setelah diklik | "Jadi relawan", "Isi survei", "Kirim email"          |
| Eyebrow            | Frasa pendek, uppercase, ≤4 kata                        | "Nilai", "Ikut terlibat"                               |
| Judul section      | Satu kalimat penuh, Sentence case, tanpa titik          | "Terbuka untuk siapa saja, apa pun latar belakangmu"    |
| Deskripsi section  | 1–2 kalimat, ≤25 kata                                   | "Tidak ada syarat dan tidak perlu pengalaman."          |
| Body kartu         | Kalimat 1 menjelaskan, kalimat 2 menjawab keraguan      | Lihat `foundation.items[].body`                        |
| Halaman kosong/404 | Apa yang terjadi + jalan keluarnya                      | Lihat `src/app/not-found.tsx`                          |

Panjang maksimum yang aman di 375px: label tombol **≤18 karakter**, tag/chip
**≤16 karakter**. Lebih dari itu akan pecah dua baris atau memaksa scroll
horizontal.

Seluruh copy beranda hidup sebagai data di `src/lib/content.ts`. Menyunting
teks tidak boleh menyentuh markup.

---

## 4. Bentuk & elevasi

| Token             | Nilai  | Dipakai untuk                       |
| ----------------- | ------ | ----------------------------------- |
| `--radius-sm`     | 6px    | code, tag kecil                     |
| `--radius-md`     | 12px   | swatch, input                       |
| `--radius-lg`     | 20px   | badge ikon, panel kecil             |
| `--radius-xl`     | 28px   | kartu, blok CTA                     |
| `--radius-pill`   | 9999px | tombol, chip                        |
| `--shadow-soft`   | halus  | kartu dalam keadaan diam            |
| `--shadow-card`   | sedang | kartu saat hover                    |
| `--shadow-lifted` | kuat   | elemen mengambang (dropdown, modal) |

Shadow memakai rona burgundy (bukan hitam netral) supaya tidak terasa abu-abu
di atas kanvas cream.

### Tekstur kertas

Seluruh halaman punya lapisan tekstur kertas: dua noise SVG (`--paper-grain`
untuk serat halus, `--paper-mottle` untuk ketidakrataan warna kertas cetak)
yang dipasang sebagai overlay `position: fixed` di `body::before` dan
`body::after`.

Keputusan yang penting diketahui sebelum menyentuhnya:

- Overlay ada **di atas** konten (`z-index: 200`, `pointer-events: none`),
  bukan di belakangnya. Kalau ditaruh di belakang, hanya latar halaman yang
  bertekstur sementara kartu dan section gelap tetap mulus — hasilnya terasa
  seperti tempelan. Di atas konten, seluruh halaman terasa satu bidang kertas.
- Blend mode berganti per tema (`--paper-blend`): `multiply` di terang,
  `soft-light` di gelap. `multiply` tidak terlihat di atas Forest 950, dan
  `screen` akan mengangkat black point sehingga kontras teks yang sudah
  dihitung berubah.
- Opacity sengaja rendah (0.09/0.06 di terang, 0.14/0.10 di gelap). Menaikkan
  angkanya menurunkan rasio kontras teks — kalau diubah, hitung ulang §1.
- Overlay tidak ikut di-print (`@media print`).

---

## 5. Gradients

Tiga gradasi disusun dari palet inti:

- `gradient-golden-hour` — Sunset Gold 300 → Persephone 700.
- `gradient-forest-sea` — Darkest Forest 800 → Maritime Outpost 700.
- `gradient-cream-veil` — Vintage Cream 50 → 200 (latar hero).

Gradasi hanya untuk bidang dekoratif, tidak untuk latar teks panjang.

---

## 6. Ilustrasi

`src/components/Doodles.tsx` berisi sembilan ilustrasi garis (buku, perahu
pinisi, tunas, matahari, kacamata, gelombang, balon percakapan, pensil,
kilau). Semuanya digambar dengan stroke `currentColor`, jadi warnanya diatur
lewat utility teks dan tidak ada hex yang dihardcode.

Doodle bersifat dekoratif dan selalu `aria-hidden`. Soal penempatan di hero:
kolom teks lebarnya `max-w-3xl` (768px) di tengah, sehingga doodle baru punya
margin yang cukup mulai **lg (1024px)**. Di bawah itu hanya dua doodle kecil
yang tampil, di pita kosong paling atas hero. Jangan menaruh doodle di rentang
horizontal ~20%–80% pada viewport sempit — pasti menabrak judul.

Ilustrasi raster (foto, gambar bitmap) tidak dipakai di beranda. Kalau nanti
ada, wajib lewat `next/image` dengan `sizes` yang benar dan `width`/`height`
terdeklarasi — lihat §7 soal CLS.

---

## 7. Motion & performa

- `animate-fade-up` — animasi masuk sekali jalan, dipakai di hero.
- `.reveal` — muncul saat elemen masuk viewport, memakai **scroll-driven
  animation** (`animation-timeline: view()`). Tanpa JavaScript: tidak ada
  observer, tidak ada hydration, tidak ada layout shift. Browser yang belum
  mendukungnya menampilkan konten langsung, jadi tidak pernah ada teks yang
  tak terlihat.
- Durasi mikro-interaksi **150–300ms**. Transisi kompleks maksimal 400ms.
- Animasi hanya memakai `transform` dan `opacity` — tidak pernah `width`,
  `height`, `top`, atau `left`, yang memicu reflow.
- Umpan balik tekan (`active:scale-[0.97]`) tidak menggeser elemen di
  sekitarnya.
- Tidak ada animasi berulang tanpa henti pada elemen dekoratif.
- `prefers-reduced-motion` mematikan animasi, smooth scroll, dan `.reveal`.

---

## 8. Aksesibilitas

Wajib, bukan opsional. Setiap PR dicek terhadap daftar ini:

- Semua pasangan teks/latar minimal **AA** (§1); pasangan chip AAA.
- `:focus-visible` memakai outline 2px dengan offset — burgundy di tema terang,
  Sunset Gold di tema gelap supaya tetap terlihat.
- Skip link "Lompat ke konten" di awal `<body>`, tampil saat menerima fokus.
- Target sentuh minimal **44×44px** untuk semua kontrol, termasuk tautan di
  menu mobile dan footer.
- Jarak antar target sentuh minimal 8px.
- Hierarki heading berurutan: satu `h1`, `h2` per section, `h3` untuk kartu.
  Tidak pernah melompati level.
- Doodle dan elemen dekoratif selalu `aria-hidden="true"`.
- Tombol tanpa teks (menu, sakelar tema) wajib punya `aria-label` yang
  menyebutkan aksinya, bukan keadaannya.
- Menu mobile bisa ditutup dengan Escape; `aria-expanded` dan `aria-controls`
  terpasang di pemicunya.
- Zoom tidak pernah dikunci (`maximum-scale` tidak diset).
- Warna tidak pernah jadi satu-satunya pembawa makna.

---

## 9. Standar UI/UX — desktop & mobile

**Ini standar pengembangan proyek, bukan saran.** Setiap halaman, section, dan
komponen baru harus memenuhinya sebelum di-merge.

### Breakpoint

Mobile-first. Empat titik uji wajib: **375px**, **768px**, **1024px**,
**1440px**. Tailwind: `sm` 640, `md` 768, `lg` 1024, `xl` 1280.

### Layout

- Tidak pernah ada scroll horizontal di lebar berapa pun. `img`, `svg`, dan
  `video` dibatasi `max-width: 100%` di `@layer base`.
- Lebar konten maksimum `--container-content` (72rem). Padding horizontal
  `px-6` di ponsel, `px-10` mulai `md`.
- Header sticky setinggi 72px, jadi `html` memakai `scroll-padding-top: 6rem`.
  **Setiap section yang punya `id`** otomatis ikut aturan ini — jangan
  menambahkan offset manual per section.
- Ritme vertikal section: `py-20 md:py-28 lg:py-32`. Tiga anak tangga, bukan
  dua — 96px di ponsel membuang layar terlalu banyak.
- Jarak heading ke isi: `mt-12 md:mt-16`.
- Spasi mengikuti kelipatan 4px. Tidak ada nilai `px` acak.

### Tipografi responsif

- Panjang baris: 35–60 karakter di ponsel, 60–75 di desktop. Untuk itu,
  paragraf pengantar dibatasi `max-w-2xl` dan body kartu tidak melebihi
  lebar kartunya.
- Setiap heading punya minimal dua anak tangga ukuran (§2).
- `text-size-adjust: 100%` mencegah iOS membesarkan teks sendiri saat
  perangkat diputar.

### Interaksi

- Semua kontrol minimal 44×44px. `Button` ukuran `md` dan `lg` sudah memenuhi;
  ukuran `sm` hanya untuk desktop, dan pembungkusnya yang menyediakan area
  sentuh.
- `touch-action: manipulation` pada `a`, `button`, `summary`, dan
  `[role="button"]` — menghapus jeda 300ms saat tap di ponsel.
- Tombol utama melebar penuh (`w-full`) di ponsel dan kembali `w-auto` mulai
  `sm`. Dua CTA berdampingan tidak pernah dipaksakan di 375px.
- Panel yang menutupi konten (menu mobile) mengunci scroll halaman di
  belakangnya dan bisa di-scroll sendiri kalau layarnya pendek.
- Interaksi tidak pernah hanya bergantung pada hover. Di ponsel tidak ada
  hover sama sekali, jadi elemen yang bisa ditekan wajib punya state `active:`
  (kartu pilihan survei memakai `group-active:` + skala 0,99).
- **Aksi utama di layar panjang menempel di dasar layar pada ponsel.** Kalau
  satu layar lebih tinggi dari sekitar dua kali viewport, tombol lanjut/kirim
  di ujung bawah praktis hilang — di survei, langkah terpanjang dulu menuntut
  scroll ~1500px sebelum tombolnya terlihat. Polanya: `sticky bottom-0` dengan
  `pb-[max(1rem,env(safe-area-inset-bottom))]`, lalu kembali `static` mulai
  `sm`. Tombol utama ditaruh di kanan (`flex-row-reverse`), sisi yang paling
  gampang dijangkau ibu jari.
- **Jangan memasang `animate-fade-up` pada elemen yang membungkus anak
  `position: sticky`.** Animasi itu memakai `animation-fill-mode: both`,
  sehingga `transform` tetap menempel pada elemen setelah animasinya selesai —
  dan elemen ber-transform menjadi containing block bagi anak sticky di
  dalamnya, membuat posisi menempelnya meleset. Animasikan isinya, bukan
  pembungkusnya.

### Yang tidak boleh

- Hex mentah di komponen. Semua warna lewat token.
- Emoji sebagai ikon. Pakai SVG dari `Doodles.tsx` atau ikon garis inline.
- `100vh` di ponsel — pakai `dvh`.
- Menonaktifkan zoom atau menghapus focus ring.
- `font-bold` pada teks serif (§2).
- Angka dampak yang datanya belum ada (§3).

### Checklist sebelum merge

```
[ ] npm run build && npm run lint lolos
[ ] Diperiksa di 375 / 768 / 1024 / 1440
[ ] Tidak ada scroll horizontal di 375px
[ ] Tema terang dan gelap dicek terpisah
[ ] Semua target sentuh ≥44px
[ ] Aksi utama halaman panjang terjangkau tanpa scroll di 375px
[ ] Navigasi keyboard: Tab berurutan, focus ring terlihat, Escape berfungsi
[ ] prefers-reduced-motion diuji
[ ] Copy mengikuti §3 — dwibahasa lengkap (id & en), Sentence case, tanpa istilah internal
```

---

## 10. Menambah warna atau komponen

1. Tambahkan variabel mentah di blok `:root` pada `src/app/globals.css`.
2. Petakan ke utility Tailwind di blok `@theme inline` pada file yang sama.
3. Kalau warnanya akan menampung teks, hitung rasio kontrasnya, catat di
   komentar, dan tambahkan barisnya ke tabel §1.
4. Jalankan checklist §9 sebelum merge.
