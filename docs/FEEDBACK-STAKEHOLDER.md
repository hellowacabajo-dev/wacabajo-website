# Catatan feedback stakeholder — survei & website

Ringkasan dari dua sumber, disimpan di luar repo:

- Transkrip voice note stakeholder (`context_website_wacabajo.pdf`) — arahan
  & alasan di balik perubahan.
- Draft form "[WB] Waca Bajo's Community Master Plan - Needs Assessment.pdf"
  — isi pertanyaan survei yang sudah jadi, siap dipakai sebagai konten Google
  Form/halaman survei di website.

Dokumen ini catatan kerja internal supaya kalau mau eksekusi, isi form/survei
tinggal dicontek dari sini tanpa perlu buka ulang PDF-nya. Bukan rujukan
desain final — untuk keputusan desain yang sudah baku lihat `docs/DESIGN.md`.

## 1. Survei / need assessment (Google Form)

Sumber isi: Google Sheets "Wajah Bajo — Community Master Plan", tab
**"need assessment"** (bukan tab "copy of need assessment").

### Alur pengisian yang diminta

1. Opening — ambil dari copywriting yang sudah ditulis di sheet tersebut.
2. Checkbox consent, baru tombol lanjut isi survei.
3. Section perkenalan ("Yuk kenalan") — kalimat pembuka section ini
   ditaruh sebagai teks di atas pertanyaan, bukan dijadikan pertanyaan
   tersendiri. Field: nama, umur, tinggal di Labuan Bajo sebagai apa,
   keseharian saat ini sebagai apa.
   - Field yang dibintangi = wajib diisi, tidak bisa lanjut kalau kosong.
4. Section berikutnya mengikuti urutan di sheet: kedekatan dengan buku →
   ke mana biasanya cari buku → perubahan setelah gempa → dst.
5. Boleh dipecah per-section (multi-step) atau satu halaman panjang —
   stakeholder tidak memaksakan, prioritasnya senyaman mungkin diisi.
6. Pertanyaan "giliran kamu cerita" (di bagian akhir) bersifat **opsional**.
   Kalau dilewati, langsung ke penutup ("terima kasih sudah bersuara...").

### Aturan format data masuk

- **Nama** — minta semua huruf otomatis jadi uppercase (bukan cuma kapital di
  awal kata), supaya lebih gampang diolah saat rekap.
- **Umur** — input angka bebas (number only), jangan dibuat pilihan rentang
  usia, supaya data umur yang didapat presisi.

### Metadata survei

- Judul: **"Suara Labuan Bajo untuk Literasi"**
- Tujuan: menangkap kebiasaan membaca, akses bahan bacaan & ruang belajar,
  persepsi soal pentingnya literasi, hambatan yang dihadapi, dan kesediaan
  terlibat dalam ekosistem literasi.
- Target responden: umum, 100–150 responden.

### Isi lengkap draft form (siap pakai)

Ini konten final dari draft form — tinggal dipindahkan ke Google Form atau
halaman survei di website tanpa perlu ditulis ulang. `*` = wajib diisi.

**Opening & Consent** — judul "Satu Suara, Satu Cerita"

> Yuk, bantu kami mendengar kondisi literasi di Labuan Bajo!
>
> Belakangan ini, keadaan di sekitar kita banyak berubah. Lewat survei
> singkat ini, kami ingin mendengar langsung dari kamu bagaimana kondisi
> membaca, belajar, mencari informasi, dan mendapatkan buku di lingkungan
> kita sekarang.
>
> Jawaban kamu akan membantu Waca Bajo membuat kegiatan yang sesuai dengan
> kebutuhan masyarakat di lapangan, bukan sekadar berdasarkan dugaan kami.
>
> Tidak ada jawaban benar atau salah. Setiap pengalaman dan pandanganmu
> sangat berarti bagi kami.

- ☐ *Saya bersedia mengisi survei ini secara sukarela. Saya memahami bahwa
  jawaban saya akan digunakan untuk membantu Waca Bajo mengetahui kebutuhan
  masyarakat dan membuat kegiatan yang sesuai.*

**Yuk, kenalan!**

> Sebelum mulai, yuk kenalan sedikit! Supaya kami bisa memahami siapa saja
> yang ikut menyuarakan kebutuhan literasi di Labuan Bajo.

- Nama\* — short answer (ingat: format data masuk di-uppercase semua)
- Umur\* — number only
- Kamu tinggal di sini sebagai...\* — multiple choice: Masyarakat Lokal /
  Wisatawan / Perantau
- Saat ini kamu sehari-hari sebagai...\* — multiple choice: Pelajar/anak
  sekolah / Mahasiswa / Guru/tenaga pendidik / Masyarakat umum / Lainnya: ___

**Kamu & Buku: Seberapa Dekat?**

- Dalam satu bulan terakhir, seberapa sering kamu membaca di luar kebutuhan
  sekolah atau pekerjaan?\* — multiple choice: Tidak pernah / 1–2 kali
  sebulan / 3–5 kali sebulan / Lebih dari 5 kali sebulan / Hampir setiap hari
- Kalau membaca, kamu paling suka baca apa?\* — checkbox: Cerita/novel /
  Buku anak/dongeng / Komik / Buku pengetahuan/sains / Berita & artikel /
  Buku tentang lingkungan / Buku agama / E-book/bacaan digital / Lainnya: ___

**Kalau Mau Baca, Nyari Bukunya ke Mana?**

- Menurutmu, seberapa mudah mencari buku atau tempat yang nyaman untuk
  membaca di sekitar tempat tinggalmu?\* — skala 1 (Sangat sulit) sampai 5
  (Sangat mudah)
- Kalau kamu ingin membaca, biasanya kamu mendapatkan buku atau bacaan dari
  mana?\* — multiple choice: Perpustakaan sekolah / Perpustakaan umum/taman
  baca / Membeli sendiri / Meminjam dari teman/keluarga / Internet/e-book /
  Media sosial/artikel online / Saya hampir tidak memiliki akses terhadap
  bahan bacaan / Lainnya: ___

**Setelah Gempa, Apa yang Berubah?**

> Belakangan ini kita sama-sama merasakan adanya perubahan di sekitar kita
> setelah gempa. Kami ingin tahu, apakah perubahan itu ikut memengaruhi
> kesempatan kamu untuk membaca, belajar, mencari informasi, atau mengikuti
> kegiatan bersama. Kamu nggak perlu menceritakan pengalaman pribadi atau
> hal-hal yang tidak ingin kamu bagikan. Cukup ceritakan perubahan yang kamu
> rasakan dalam keseharian.

- Setelah gempa yang terjadi baru-baru ini, apakah kamu merasa kesempatan
  untuk membaca, belajar, atau mengikuti kegiatan seperti itu berubah?\* —
  multiple choice: Jadi lebih sulit / Justru jadi lebih mudah/meningkat /
  Kurang lebih masih sama / Saya belum merasakan perubahan
- Kalau ada perubahan, kira-kira apa yang paling memengaruhinya?\* —
  checkbox: Kondisi rumah atau lingkungan sekitar / Sekarang lebih sulit
  mencari tempat untuk belajar atau membaca / Kegiatan sekolah atau pekerjaan
  berubah / Lebih sulit mendapatkan buku atau bacaan / Lebih sulit
  mendapatkan internet atau informasi / Kondisi keluarga / Hal lainnya: ___ /
  Tidak ada perubahan

**Kalau Menurutmu, Apa yang Masih Kurang?**

- Menurutmu, apa yang paling menjadi tantangan untuk membaca dan belajar di
  lingkunganmu?\* — checkbox: Susah mendapatkan buku atau bacaan / Tidak
  banyak tempat yang nyaman untuk membaca atau belajar / Orang-orang di
  sekitar belum terbiasa membaca / Anak-anak masih kurang mendapat teman
  atau pendamping untuk belajar / Tidak mahir membaca / Harga buku masih
  terlalu mahal / Lainnya: ___

**Kalau Boleh Pilih, Mau Baca Bareng Ngapain?**

- Kalau ada kegiatan membaca atau belajar di dekat tempat tinggalmu, kamu
  paling ingin ikut kegiatan yang mana?\* — checkbox: Baca buku bareng di
  tempat terbuka / Dongeng atau cerita untuk anak-anak / Ngobrol bareng
  tentang buku / Tukar buku / Perpustakaan atau lapak baca keliling / Belajar
  menulis & membaca / Menggambar atau kegiatan kreatif lainnya / Ngobrol
  tentang masalah sosial dan lingkungan di sekitar kita / Kegiatan belajar
  untuk anak-anak / Lainnya: ___
- Kalau ada kegiatan membaca atau ngobrol bareng, kamu ingin membahas hal
  apa?\* — checkbox: Pendidikan / Lingkungan & sampah / Pariwisata / Budaya
  lokal / Kesehatan / Ekonomi keluarga / Politik / Kehidupan sosial di
  sekitar kita / Pengembangan diri / Cerita & budaya daerah / Lainnya: ___

**Baca Nggak Harus Sendirian**

> Menurut kami, literasi bukan cuma soal buku. Literasi juga soal ruang
> untuk bertemu, bertukar cerita, dan melihat dunia dari sudut pandang yang
> berbeda. Kalau ada kegiatan seperti ini di dekatmu, kamu mau jadi bagian
> yang mana?

- Kalau ada kegiatan membaca atau belajar di lingkunganmu, kamu paling
  tertarik untuk...\* — multiple choice: Ikut sebagai peserta / Ikut
  membantu sebagai relawan / Mengajak sekolah atau komunitas untuk ikut /
  Membantu sebagai partner kegiatan / Aku tertarik, tapi belum tahu mau ikut
  sebagai apa / Untuk sekarang, aku belum tertarik ikut
- Kapan kamu biasanya punya waktu untuk ikut kegiatan?\* — multiple choice:
  Pagi hari di hari kerja / Siang hari di hari kerja / Sore/malam hari di
  hari kerja / Akhir pekan / Fleksibel

**Sekarang, Giliran Kamu yang Cerita** — opsional, ini titik terakhir
sebelum pertanyaan pilihan ganda berakhir ("Sampai di sini, kami sudah
banyak bertanya. Sekarang nggak ada pilihan ganda. Giliran kamu yang
bicara.")

- Kalau Waca Bajo hadir di lingkunganmu, apa yang paling kamu harapkan dari
  gerakan ini? — paragraf, placeholder: *"Ceritakan apa pun yang menurutmu
  penting. Tidak harus panjang."*
- Mau tetap terhubung dengan Waca Bajo? — short answer, placeholder:
  *"Tinggalkan WhatsApp atau email jika kamu ingin mendapatkan informasi
  tentang kegiatan Waca Bajo berikutnya."*

**Terima Kasih Sudah Bersuara** (penutup)

> Terima kasih sudah berbagi cerita dan pandanganmu.
>
> Setiap jawaban membantu Waca Bajo memahami apa yang dibutuhkan masyarakat,
> terutama di tengah kondisi yang terus berubah.
>
> Semoga dari suara-suara kecil ini, kita bisa bersama-sama membangun ruang
> untuk membaca, belajar, berbagi, dan bertumbuh di Labuan Bajo.
>
> Yuk, jadi bagian dari perjalanan Waca Bajo.

- Tombol penutup: **[ Kenali Waca Bajo → ]** dan **[ Lihat Kegiatan Kami → ]**
  (catatan: label tombol kedua beda dengan CTA hero "Isi survei"/"Jadi
  bagian dari Waca Bajo" yang disebut di voice note — kemungkinan ini memang
  konteksnya beda: yang di sini untuk halaman *setelah* survei selesai diisi,
  bukan CTA di homepage).

## 2. Website

### Language switcher

- Label "ID" / "EN" dianggap ambigu untuk pengunjung awam (akar rumput) yang
  belum tentu familiar dengan kode locale.
- Diminta diganti jadi label eksplisit: **"Bahasa Indonesia"** / **"Bahasa
  Inggris"**.
- Terjemahan Inggris yang ada saat ini hasil AI — diminta ditinjau ulang dan
  ditulis ulang dengan gaya yang lebih natural/humanist, bukan hasil translate
  mentah.

### Palet warna — dark mode

- Light mode: warna dasar hijau tua + krem sudah oke, dipertahankan.
- Dark mode dirasa kontrasnya berlebihan — kombinasi hijau dengan aksen merah
  yang ada saat itu dianggap tidak nyambung ("hijau lumut ketemu merah").
- Alternatif yang disebutkan (tidak ada preferensi kuat): merah yang lebih
  gelap/tua, kuning, atau biru tua. Yang penting kombinasinya enak dilihat.

### Konten homepage

- **Hero** — ganti judul jadi "Membaca kata, membaca dunia" dua baris, kata
  "lalu" dihapus (awalnya "Membaca kata, lalu membaca dunia").
  - Tambahkan body copy pengantar Waca Bajo dari dokumen copywriting.
  - Tambahkan kutipan bergaya italic: *"Kami percaya membaca adalah awal dari
    rasa ingin tahu, pemahaman, dan keberanian untuk melihat dunia secara
    lebih luas."*
  - CTA hero ada tiga: (1) Kenali Waca Bajo → ke section tentang kami,
    (2) Isi survei, (3) Jadi bagian dari Waca Bajo → ke section rekrutmen.
- **Section "Mengapa kami hadir"** — isi dari copywriting + visi misi.
  Sub-bagian yang tetap ditampilkan: dari mana kami berangkat, kenapa kami
  ada, asal nama, cara kami memaknainya, core value.
- **Section program dihilangkan dulu.** Alasan: program belum ada yang
  berjalan, khawatir pengunjung mengira sudah aktif kalau ditampilkan.
- **Section rekrutmen** — dibuka untuk siapa saja, apa pun latar belakang dan
  kemampuannya (termasuk yang merasa tidak punya "peran" khusus). Tujuannya
  pemetaan resource ke depan (mis. kalau butuh fotografer atau editor, tinggal
  lihat dari hasil isian).
  - Sertakan bagian cerita bebas: siapa mereka, dan apa yang bisa/mau mereka
    lakukan bersama Waca Bajo — bukan "kenapa mau gabung".
  - Sertakan gambaran kegiatan yang akan berjalan: book sharing, mendongeng
    dari desa ke desa, baca buku bareng, dll.
  - Kekhawatiran stakeholder: risiko orang enggan mengisi karena terasa
    effortful (harus mikir dulu). Perlu dibuat serendah mungkin frictionnya.

## Cross-check ke kode saat ini (dicek 2026-09-03)

Beberapa poin di atas dibandingkan dengan state kode sekarang — dicatat di
sini supaya tidak perlu ditelusuri ulang, bukan berarti sudah diputuskan untuk
dikerjakan:

| Poin feedback | State kode saat ini | Catatan |
| --- | --- | --- |
| Label locale switcher eksplisit | Sudah jadi "Bahasa Indonesia" / "Bahasa Inggris" di [LocaleSwitcher.tsx](../src/components/LocaleSwitcher.tsx). Di desktop tampil langsung di header; di mobile dipindah ke dalam menu (hamburger) karena teks penuh tidak muat di top bar yang sempit — lihat [SiteHeader.tsx](../src/components/SiteHeader.tsx) | **selesai** (2026-09-03) — perubahan perilaku: di mobile, switcher bahasa sekarang cuma muncul setelah menu dibuka, tidak lagi langsung kelihatan di top bar |
| Hero tanpa kata "lalu" | Sudah jadi `"Membaca kata, membaca dunia."` di [content.ts](../src/lib/content.ts) | **selesai** (2026-09-03) |
| Section program dihilangkan | Dikonfirmasi stakeholder: **dihilangkan dulu**. Section, nav item, `programs` content (id/en), komponen `ProgramCard`, dan `ChipOnDark` yang cuma dipakainya sudah dihapus. Hero secondary CTA yang tadinya "Lihat program" dialihkan jadi "Kenali Waca Bajo" → `#tentang`, dan hero fact "Tiga program" dihapus (heroFacts tinggal 2 item, grid disesuaikan ke `sm:grid-cols-2`) | **selesai** (2026-09-03) — `npm run build`, `lint`, `typecheck` semua lolos |
| Aksen dark mode bukan merah | Token `--accent` sudah pakai Sunset Gold (`--gold-400`/`--gold-500`), bukan merah — lihat [globals.css:118](../src/app/globals.css:118) | kemungkinan sudah diperbaiki di iterasi desain setelah rekaman ini dibuat, tinggal konfirmasi visual ke stakeholder |
| Hero: kutipan italic + tiga CTA | Kutipan *"Kami percaya membaca adalah awal dari rasa ingin tahu..."* ditambahkan sebagai `hero.quote`; CTA jadi tiga: "Jadi bagian dari Waca Bajo" → `#gabung`, "Isi survei" → tautan Google Form, "Kenali Waca Bajo" → `#tentang` | **selesai** (2026-09-03) — tombol survei baru tayang setelah URL formulirnya diisi (lihat baris di bawah) |
| Hero: body copy pengantar | `hero.description` ditulis ulang jadi pengantar Waca Bajo yang menyebut posisi sebenarnya: kegiatannya masih disusun bersama warga, siapa pun boleh ikut sejak awal | **selesai** (2026-09-03) — versi lama ("kami membuka ruang baca, memandu kelas cerita...") dihapus karena mengklaim kegiatan yang belum berjalan, masalah yang sama dengan section program |
| Section rekrutmen terbuka & rendah friction | Section "Cara bergabung" jadi "Ikut terlibat" (`join` di content.ts, anchor `#gabung` pindah ke sini). Tiga langkah tidak meminta apa pun selain cerita: ceritakan siapa kamu → sebut yang ingin kamu lakukan → kami hubungi kalau ada yang cocok. Kalimat "belum tahu juga tidak apa-apa" sengaja ada untuk yang merasa tidak punya peran | **selesai** (2026-09-03) |
| Gambaran kegiatan di section rekrutmen | Panel "Kegiatan yang sedang kami siapkan" di dalam section yang sama: book sharing, mendongeng dari desa ke desa, baca buku bareng — dengan catatan tetap "belum ada yang berjalan" | **selesai** (2026-09-03) — ditaruh satu section, bukan section sendiri; kalau stakeholder maunya terpisah tinggal dipindah |
| Terjemahan Inggris terasa hasil AI | Seluruh `en` di content.ts ditulis ulang sebagai teks Inggris yang berdiri sendiri (bukan terjemahan kalimat per kalimat), termasuk judul hero yang ikut kehilangan "then": `"Read the words, read the world."` | **selesai** (2026-09-03) — perlu satu kali baca ulang oleh yang lebih nyaman berbahasa Inggris sebelum tayang |
| Tautan Google Form survei & rekrutmen | Belum ada URL-nya. Disiapkan lewat environment: `NEXT_PUBLIC_SURVEY_URL` dan `NEXT_PUBLIC_JOIN_FORM_URL` (lihat `.env.example` dan `siteConfig.forms`) | **menunggu stakeholder** — selama kosong, tombol "Isi survei" dan "Isi formulir" tidak dirender sama sekali supaya tidak ada tautan mati |

## Belum jelas / perlu klarifikasi ke stakeholder

- Isi survei sudah lengkap di §1, tapi belum ada Google Form-nya. Begitu
  tautannya jadi, isi `NEXT_PUBLIC_SURVEY_URL` — tombol "Isi survei" di hero
  langsung tayang tanpa perlu ganti kode. Sama untuk formulir rekrutmen
  (`NEXT_PUBLIC_JOIN_FORM_URL`).
- Gambaran "kegiatan ke depan" (book sharing, dongeng, dll) untuk sekarang
  ditaruh di section rekrutmen yang sama. Perlu konfirmasi apakah stakeholder
  maunya begitu atau jadi section terpisah.
- Visi & misi belum dimasukkan ke section "Mengapa kami hadir" — teksnya belum
  ada di catatan ini; yang paling dekat baru pernyataan di section "Yang kami
  percayai". Perlu naskah visi-misi finalnya dari dokumen copywriting.
- Struktur survei final: per-section (multi-step) atau satu halaman panjang —
  belum diputuskan, stakeholder menyerahkan ke tim.
- Warna pengganti aksen merah di dark mode belum ditentukan pasti — perlu
  dicek apakah Sunset Gold yang sudah dipakai sekarang sudah menjawab keluhan
  ini atau stakeholder perlu melihat ulang.
