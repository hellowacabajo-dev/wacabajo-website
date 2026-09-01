# Design System — Waca Bajo

Turunan dari **Waca Bajo Brand Guidelines 2026**. Dokumen ini menjelaskan
keputusan yang diambil saat memindahkan deck ke web; untuk melihat hasilnya,
buka `/brand`.

## 1. Warna

Deck mencantumkan lima warna brand plus satu skala neutral:

| Nama                | Peran                        | Nilai dari deck              |
| ------------------- | ---------------------------- | ---------------------------- |
| Vintage Cream       | Base color / kanvas          | 50 `#FAF6EC`                 |
| Darkest Forest      | Deep green, resilience       | 500 `#909949`, 800 `#464C28`, 950 `#292E16` |
| Miles of Persephone | Burgundy Kain Songke         | 600 `#C53D45`, 800 `#892B31`, 950 `#471417` |
| Maritime Outpost    | Deep blue, kepercayaan       | 300 `#95BBE4`, 500 `#377AC0`, 700 `#1F497D` |
| Sunset Gold         | Kehangatan golden hour       | 200 `#F9D68E`, 300 `#F7C46B`, 400 `#F3A22C` |
| Brandy              | Neutral hangat (base color)  | skala 50–950 lengkap di deck |

Deck hanya mencetak sebagian step. Sisa step pada tiap ramp diinterpolasi di
ruang **OKLab** agar jarak terang antar-step terasa rata — ini implementasi
dari bagian "Tint & Shade Range". Step yang berasal dari deck ditandai titik
merah di halaman `/brand`, jadi selalu jelas mana nilai resmi dan mana
turunan.

Catatan pembacaan: nilai Maritime Outpost 500 tercetak terpotong di PDF
(`#37AC0`). Sampling piksel swatch-nya menghasilkan ~`#367BBF`, sehingga
dibaca sebagai **`#377AC0`**. Kalau file sumber Figma/Illustrator tersedia,
nilai ini layak dikonfirmasi ulang.

### Pasangan warna

Hanya kombinasi berikut yang dipakai untuk teks (semua lolos WCAG AA):

| Latar                  | Teks              | Rasio    |
| ---------------------- | ----------------- | -------- |
| Vintage Cream 50       | Persephone 950    | 14.1:1   |
| Darkest Forest 950     | Vintage Cream 50  | 13.0:1   |
| Darkest Forest 950     | Sunset Gold 300   | 8.7:1    |
| Persephone 800         | Vintage Cream 50  | 8.6:1    |
| Maritime Outpost 700   | Vintage Cream 50  | 9.1:1    |
| Sunset Gold 400        | Persephone 950    | 7.3:1    |

**Sunset Gold tidak pernah dipakai sebagai warna teks di atas Vintage Cream**
(hanya 1.9:1), dan teks putih tidak pernah dipakai di atas Sunset Gold
(1.9:1). Gold berperan sebagai bidang warna dan aksen, bukan warna teks di
latar terang.

Komponen `Section` membatasi pilihan latar ke `tone` yang sudah aman, jadi
kombinasi di luar tabel ini tidak akan muncul tanpa sengaja.

### Pasangan chip

Chip, tag, dan badge ikon memakai pola berbeda: tint terang (step 50/100) dari
satu keluarga warna dipasangkan dengan step 900 keluarga yang sama. Karena
semuanya lolos **AAA**, pola ini aman untuk teks sekecil chip:

| Latar             | Teks              | Rasio    | Dipakai untuk                          |
| ----------------- | ----------------- | -------- | -------------------------------------- |
| Forest 50         | Forest 900        | 8.9:1    | Tag program lapangan, nilai            |
| Persephone 50     | Persephone 900    | 8.6:1    | Tag kelas cerita, nilai                |
| Maritime 50       | Maritime 900      | 12.7:1   | Tag jalan literasi, nilai              |
| Gold 50           | Gold 900          | 12.0:1   | Nomor langkah, nilai                   |
| Brandy 100        | Brandy 900        | 8.0:1    | Chip netral (eyebrow hero)             |

Chip Sunset Gold adalah **satu-satunya** cara Gold boleh menampung teks kecil —
karena yang dipakai adalah tint 50, bukan Gold 300/400.

Untuk chip di atas bidang warna pekat (kepala kartu program) dipakai
`ChipOnDark`: latar Vintage Cream 50 solid dengan teks Persephone 950, yang
lolos AAA di atas warna apa pun dari palet.

## 2. Tipografi

Deck menyebut **Bricolage Grotesque** sebagai primary typeface dan **Sorts
Mill Goudy** sebagai secondary — keduanya dinyatakan bisa dipakai untuk
heading, sub-heading, maupun body.

Deck menyatakan **keduanya** boleh dipakai untuk heading. Pembagian peran di
web memilih Bricolage sebagai suara utama, karena pada bobot tebal dan ukuran
besar ia memberi ketegasan yang dibutuhkan headline — sementara Goudy tetap
memegang momen-momen yang perlu terasa personal:

- `--font-sans` → Bricolage Grotesque — `h1`–`h3` (bobot 700, tracking
  `-0.03em`), body, tombol, navigasi, label.
- `--font-display` → Sorts Mill Goudy — wordmark, kutipan, dan pernyataan
  esensi brand. Selalu dipanggil eksplisit lewat utility `font-display`.

Nama token `--font-display` dipertahankan supaya `/brand` dan komponen lama
tidak perlu diubah; perannya kini "serif aksen", bukan "display face".

Aturan lain dari deck yang ikut diterapkan:

- **Sentence case** untuk semua headline. Uppercase hanya untuk eyebrow/label
  kecil dengan tracking longgar.
- Wordmark selalu lowercase italic (`waca bajo`).
- Headline memakai `text-wrap: balance` dan paragraf memakai `text-wrap:
  pretty`, jadi tidak ada baris terakhir yang menggantung sendirian.

Kedua font dimuat lewat `next/font/google`, jadi tidak ada request ke domain
Google saat runtime dan tidak ada layout shift.

## 3. Suara & copy

Deck memuat Tone of Voice (hlm. 10) dan Brand Values (hlm. 9), tapi berhenti
pada nama pilarnya. Bagian ini adalah penerjemahannya jadi keputusan menulis.
Datanya hidup di `src/lib/brand.ts` (`brandFoundation`, `toneOfVoice`,
`copyRules`) dan dirender di `/brand#suara`, jadi aturannya tidak tersimpan
hanya di dokumen ini.

### Tiga rujukan terakhir

Kalimat yang tidak bisa ditarik kembali ke salah satu kutipan Foundation
berikut kemungkinan besar bukan suara Waca Bajo:

| Halaman | Inti |
| ------- | ---- |
| 5 — Brand Origins | Literasi tumbuh ketika manusia, buku, dan cerita bertemu |
| 6 — Naming Story | Nama lahir dari bahasa dan tanah tempat gerakan bertumbuh |
| 7 — Brand Interpretation | Membaca bukan sepenuhnya tentang buku |

### Pilar tone of voice

| Pilar | Lakukan | Hindari |
| ----- | ------- | ------- |
| Grounded & Thoughtful | Sebut yang konkret: tempat, siapa, apa yang dikerjakan | Klaim tanpa sumber, superlatif, kata sifat menumpuk |
| Empathic & Impactful | Satu kalimat yang menjawab keraguan pembaca | Bahasa program yang dingin, angka dampak karangan |
| Collaborative & Inclusive | Bahasa Indonesia sehari-hari, ajakan dengan pintu untuk tiap orang | Campur bahasa, istilah internal, nada memilah orang |

### Aturan penulisan

1. **Sentence case** untuk headline dan sub-headline (deck hlm. 19 & 21).
   Uppercase hanya untuk eyebrow dan label kecil.
2. **Satu bahasa: Indonesia**, termasuk `title` dan `description` di metadata.
3. **Bukti berbentuk cerita orang, bukan angka yang belum ada datanya.**
   Turunan langsung dari brand essence *Growing Through Stories*. Selama data
   resmi belum ada, `heroFacts` hanya memuat fakta struktural — lihat catatan
   di `src/lib/content.ts`.
4. **Istilah internal dijelaskan fungsinya lebih dulu**, atau tidak dipakai.
5. **Boleh menyebut yang belum berhasil** — nilai Critical dan Reflective baru
   terbaca kalau ada kalimat yang berani mengakui.
6. **Headline panjang dipecah jadi dua bagian yang seimbang.** Pola ini milik
   brand sendiri: sampul deck menulis "Growth begins with a story", esensinya
   "Growing Through Stories". Contoh penerapannya ada di `hero.title`.
7. **Pengecualian tagline.** Kutipan verbatim sampul deck atau brand essence
   dipertahankan casing dan bahasa aslinya — diperlakukan sebagai nama diri
   brand, bukan kalimat bebas. `hero.title` sengaja berbunyi "Growth Begins
   With a Story" (English, Title Case) karena mengutip sampul deck apa
   adanya, sama seperti `brandEssence` ("Growing Through Stories") yang juga
   tidak diterjemahkan. Ini satu-satunya pengecualian terhadap aturan 1 dan 2.

Catatan: pola dua bagian sempat diusulkan dengan merujuk situs lain sebagai
referensi. Tidak perlu — polanya sudah ada di halaman pertama deck, dan
mengambilnya dari sana sekalian menghindari kebiasaan situs referensi tersebut
yang justru melanggar aturan 1 (Title Case) dan 2 (campur bahasa).

Struktur `body` kartu program mengikuti pola dua kalimat: kalimat pertama
menjelaskan kegiatan (Grounded), kalimat kedua menjawab keraguan pembaca yang
belum pernah datang (Empathic). Pertahankan pola ini saat isinya diganti.

## 4. Bentuk & elevasi

| Token             | Nilai   | Dipakai untuk                       |
| ----------------- | ------- | ----------------------------------- |
| `--radius-sm`     | 6px     | code, tag kecil                     |
| `--radius-md`     | 12px    | swatch, input                       |
| `--radius-lg`     | 20px    | badge ikon, panel kecil             |
| `--radius-xl`     | 28px    | kartu, blok CTA                     |
| `--radius-pill`   | 9999px  | tombol, chip                        |
| `--shadow-soft`   | halus   | kartu dalam keadaan diam            |
| `--shadow-card`   | sedang  | kartu saat hover                    |
| `--shadow-lifted` | kuat    | elemen mengambang (dropdown, modal) |

Shadow memakai rona burgundy (bukan hitam netral) supaya tidak terasa abu-abu
di atas kanvas cream.

## 5. Gradients

Bagian "Gradients" di deck tidak ikut ter-export pada PDF versi compressed.
Tiga gradasi berikut disusun dari palet inti sebagai titik awal, dan perlu
dikonfirmasi ke tim brand kalau nanti halaman aslinya tersedia:

- `gradient-golden-hour` — Sunset Gold 300 → Persephone 700.
- `gradient-forest-sea` — Darkest Forest 800 → Maritime Outpost 700.
- `gradient-cream-veil` — Vintage Cream 50 → 200 (latar hero).

Gradasi hanya untuk bidang dekoratif, tidak untuk latar teks panjang.

## 6. Ilustrasi

`src/components/Doodles.tsx` berisi sembilan ilustrasi garis (buku, perahu
pinisi, tunas, matahari, kacamata, gelombang, balon percakapan, pensil,
kilau). Semuanya digambar dengan stroke `currentColor`, jadi warnanya diatur
lewat utility teks dan tidak ada hex yang dihardcode.

Doodle bersifat dekoratif dan selalu `aria-hidden`. Soal penempatan di hero:
kolom teks lebarnya `max-w-3xl` (768px) di tengah, sehingga doodle baru punya
margin yang cukup mulai **lg (1024px)**. Di bawah itu hanya dua doodle kecil
yang tampil, di pita kosong 96px paling atas hero. Jangan menaruh doodle di
rentang horizontal ~20%–80% pada viewport sempit — pasti menabrak judul.

## 7. Motion

- `animate-fade-up` — animasi masuk sekali jalan, dipakai di hero.
- `.reveal` — muncul saat elemen masuk viewport, memakai **scroll-driven
  animation** (`animation-timeline: view()`). Tanpa JavaScript sama sekali:
  tidak ada observer, tidak ada hydration, tidak ada layout shift. Browser
  yang belum mendukungnya menampilkan konten langsung, jadi tidak pernah ada
  teks yang tak terlihat.
- Hover kartu dan tekan tombol memakai `transform` saja (bukan width/height),
  durasi 200ms — di dalam rentang 150–300ms untuk mikro-interaksi.
- Tidak ada animasi berulang tanpa henti pada elemen dekoratif.

## 8. Aksesibilitas

- Semua pasangan teks/latar minimal AA (lihat tabel di §1); pasangan chip
  bahkan AAA.
- `:focus-visible` memakai outline burgundy 2px dengan offset — terlihat di
  latar terang maupun gelap.
- Skip link "Lompat ke konten" di awal `<body>`, tampil hanya saat menerima
  fokus keyboard.
- `prefers-reduced-motion` mematikan animasi, smooth scroll, dan `.reveal`.
- Target sentuh minimal 44px pada kontrol mobile (tombol menu 44×44, seluruh
  tautan menu mobile 44px).
- Menu mobile bisa ditutup dengan Escape.
- Hierarki heading berurutan: satu `h1`, `h2` per section, `h3` untuk kartu.

## 9. Menambah warna atau komponen

1. Tambahkan variabel mentah di blok `:root` pada `src/app/globals.css`.
2. Petakan ke utility Tailwind di blok `@theme inline` pada file yang sama.
3. Kalau warnanya akan menampung teks, hitung rasio kontrasnya dan catat di
   komentar — konsisten dengan token yang sudah ada.
4. Kalau perlu tampil di style guide, tambahkan datanya di `src/lib/brand.ts`.
