# Backoffice

Ruang internal tim di **`/backoffice`** (produksi: `https://www.wacabajo.org/backoffice`).
Isinya dua hal: data pengunjung situs, dan hasil survei need assessment —
lengkap dengan rekap per pertanyaan maupun jawaban per orang.

Halaman ini tertutup: `noindex`, `Disallow` di `robots.txt`, dan hanya bisa
dibuka akun yang sudah didaftarkan. Panduan Supabase dasarnya (tabel survei,
kunci API) ada di [`docs/SUPABASE.md`](SUPABASE.md) dan diasumsikan sudah
selesai sebelum yang di bawah ini dikerjakan.

Terakhir diperbarui: **5 September 2026**.

---

## 1. Yang perlu dikerjakan di Supabase

Tiga langkah, sekali saja. Semuanya lewat dashboard Supabase.

### 1.1 Jalankan `supabase/backoffice.sql`

**SQL Editor → New query**, tempel seluruh isi
[`supabase/backoffice.sql`](../supabase/backoffice.sql), **Run**.

File itu membuat:

- tabel `backoffice_users` — daftar akun yang boleh masuk;
- tabel `page_views` — catatan kunjungan halaman;
- policy SELECT baru di `survey_responses`, supaya tim bisa membaca jawaban
  lewat situs, bukan cuma lewat dashboard;
- view dan fungsi rekap (`backoffice_visitor_daily`,
  `backoffice_visitor_totals`, `backoffice_top_pages`,
  `backoffice_entry_facets`).

Aman dijalankan berulang. Kalau muncul `NOTICE: ... does not exist, skipping`,
itu normal — artinya ia sedang dijalankan pertama kali.

### 1.2 Matikan pendaftaran mandiri

**Authentication → Sign In / Providers → Email**:

- **Enable Email provider**: nyala (ini yang dipakai halaman masuk).
- **Allow new users to sign up**: **matikan**. Akun dibuat manual oleh admin;
  tidak ada halaman daftar di situs, dan tidak boleh ada.
- **Confirm email**: boleh tetap nyala. Akun yang dibuat lewat dashboard bisa
  langsung dianggap terkonfirmasi (lihat langkah berikutnya).

Sekalian di **Authentication → URL Configuration**, isi **Site URL** dengan
`https://www.wacabajo.org`. Belum dipakai untuk login kata sandi, tapi ia yang
menentukan tautan di email kalau nanti ada fitur reset kata sandi.

### 1.3 Buat akun tim, lalu beri akses

Dua bagian, dan **keduanya perlu**. Punya akun Supabase saja belum berarti bisa
masuk — itu disengaja, supaya akun yang terlanjur dibuat tidak otomatis bisa
membaca jawaban orang.

**a. Buat akunnya.** **Authentication → Users → Add user → Create new user**:

- **Email**: email anggota tim.
- **Password**: buat lewat password manager, minimal 12 karakter. Kirimkan
  lewat password manager juga, jangan lewat chat.
- **Auto Confirm User**: **centang**. Tanpa ini akunnya menunggu email
  konfirmasi yang tidak pernah datang di paket gratis.

**b. Beri aksesnya.** **SQL Editor**, ganti emailnya lalu Run:

```sql
insert into public.backoffice_users (user_id, email, note)
select id, email, 'Koordinator program'
from auth.users
where email = 'nama@wacabajo.org'
on conflict (user_id) do nothing;
```

Cek hasilnya:

```sql
select email, note, created_at from public.backoffice_users order by created_at;
```

**Mencabut akses** cukup menghapus barisnya — akunnya tidak perlu dihapus:

```sql
delete from public.backoffice_users where email = 'nama@wacabajo.org';
```

Kalau orangnya sudah benar-benar keluar, hapus juga akunnya di
**Authentication → Users**, supaya kata sandinya tidak lagi berlaku di mana pun.

---

## 2. Mencoba di lokal

`.env.local` yang sudah ada untuk survei sudah cukup — backoffice memakai
kunci yang sama.

```bash
npm run dev
```

Buka `http://localhost:3000/backoffice`. Seharusnya langsung dialihkan ke
halaman masuk. Login dengan akun dari langkah 1.3.

Halaman pengunjung akan kosong di lokal, dan itu benar: kunjungan dari
`localhost` sengaja **tidak** dicatat supaya angka produksi tidak tercampur
pekerjaan tim. Untuk menguji pencatatannya, isi `NEXT_PUBLIC_TRACK_LOCAL=1` di
`.env.local` lalu jalankan ulang `npm run dev`. Jangan lupa mengosongkannya
kembali — dan jangan pernah memasangnya di produksi.

---

## 3. Memasang di produksi

Tidak ada environment variable baru. Yang sudah ada
(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`NEXT_PUBLIC_SITE_URL`) sudah dipakai backoffice apa adanya.

Yang perlu dipastikan cuma satu: **langkah 1 sudah dijalankan di project
Supabase yang sama dengan yang dipakai produksi.** Kalau `backoffice.sql`
dijalankan di project lain, halamannya akan terbuka tapi semua angkanya nol.

Peta deployment dan siapa memegang akun apa ada di
[`docs/DEPLOY.md`](DEPLOY.md). Ingat: push ke `main` langsung tayang.

---

## 4. Isi backoffice

### Ringkasan (`/backoffice`)

Satu layar: pengunjung unik, sesi, halaman dibuka, jawaban survei masuk,
grafik harian, dan dua rekap teratas. Rentang waktunya bisa diganti (7 / 30 /
90 hari / 1 tahun) dan ikut tersimpan di URL, jadi bisa dikirim ke anggota tim
lain apa adanya.

### Pengunjung (`/backoffice/pengunjung`)

Rincian dari angka yang sama:

| Yang dibaca | Artinya |
| --- | --- |
| **Pengunjung unik** | Berapa browser berbeda yang datang. Satu orang yang membuka dari ponsel dan laptop terhitung dua. |
| **Sesi** | Satu rangkaian kunjungan. Jeda lebih dari 30 menit dihitung sebagai sesi baru. |
| **Halaman dibuka** | Total halaman yang dilihat, termasuk pindah halaman di dalam situs. |
| **Pengunjung baru** | Browser yang baru pertama kali datang selama periode itu. |
| **Jalur masuk** | Langsung / pencarian / media sosial / tautan situs lain / kampanye bertanda. |
| **Asal spesifik** | Instagram, Google, WhatsApp, dan seterusnya. |
| **Situs perujuk** | Alamat situs yang menautkan ke sini. |

Asal kunjungan dihitung **per sesi**, bukan per halaman: halaman kedua dan
seterusnya selalu "dirujuk" oleh wacabajo.org sendiri, dan kalau ikut dihitung,
rekapnya jadi didominasi diri sendiri.

**Menandai tautan kampanye.** Kalau ingin tahu berapa yang datang dari satu
unggahan tertentu, tambahkan penanda di tautannya:

```
https://www.wacabajo.org/id/survei?utm_source=instagram&utm_medium=social&utm_campaign=survei-oktober
```

Yang bertanda seperti itu muncul terpisah di panel "Kampanye bertanda".

### Survei (`/backoffice/survei`)

Dua cara membaca data yang sama:

- **Ringkasan** — per pertanyaan, seperti tab "Ringkasan" di Google Form.
  Pilihan ganda jadi batang, skala menampilkan rata-rata, jawaban terbuka
  ditampilkan utuh satu per satu.
- **Per orang** — daftar responden, bisa dicari berdasarkan nama, dan tiap
  baris membuka jawaban lengkap orang itu.

**Batang atau tabel.** Di tab Ringkasan ada sakelar bentuk. Batang untuk
melihat sekilas mana yang paling banyak; **tabel** untuk membaca dan menyalin
angka persisnya ke laporan. Keduanya membaca data yang sama, jadi tidak ada
angka yang bisa berbeda antara dua tampilan.

**Saringan.** Empat pilihan — umur, status tinggal, keseharian, frekuensi
membaca — dan saringan yang dipasang berlaku untuk **seluruh halaman**: rekap,
daftar per orang, dan unduhan CSV sekaligus. Ini yang menjawab pertanyaan
seperti "kegiatan apa yang diinginkan pelajar" tanpa perlu mengekspor dulu.

Saringan yang dipakai ikut tersimpan di URL, jadi satu tampilan bisa dikirim
ke anggota tim lain apa adanya — sama seperti rentang waktu di halaman
pengunjung.

⚠️ **Persentase menghilang kalau jawabannya tinggal sedikit** (di bawah 10).
Itu disengaja: "50%" dari empat jawaban terbaca seperti kecenderungan padahal
itu dua orang, dan angka seperti itulah yang paling mudah terlanjur masuk
laporan. Angka aslinya tetap tampil. Ambangnya `MIN_FOR_PERCENT` di
[`src/lib/backoffice/survey.ts`](../src/lib/backoffice/survey.ts).

**Unduh CSV** mengekspor jawaban yang sudah diterjemahkan ke kalimat
("Perpustakaan sekolah", bukan `public_library`), siap dibuka di Excel atau
Google Sheets. Kalau ada saringan aktif, yang terunduh hanya yang cocok dan
nama berkasnya berakhiran `-tersaring` supaya tidak tertukar di folder unduhan.

---

## 5. Soal privasi

Ini yang disimpan setiap kali halaman dibuka:

| Disimpan | Tidak disimpan |
| --- | --- |
| Dua angka acak (browser & sesi) yang dibuat di perangkat pengunjung sendiri | Alamat IP |
| Path halaman, tanpa query string | Nama, email, atau identitas apa pun |
| Host situs perujuk (tanpa URL penuhnya) | Kota atau titik lokasi |
| Jenis perangkat, sistem operasi, peramban | Cookie pihak ketiga — tidak ada satu pun |
| Kode negara dua huruf dari header CDN | Riwayat lintas situs |

Tidak ada layanan analitik pihak ketiga: tidak ada Google Analytics, tidak ada
skrip pelacak siapa pun. Datanya tinggal di Supabase milik Waca Bajo.

Angka acak itu tersimpan di `localStorage` browser pengunjung dan bisa ia hapus
kapan saja lewat "clear site data". Kunjungan dari bot, crawler, dan pengambil
pratinjau tautan (WhatsApp, Instagram) sudah disaring.

**Yang perlu dipertimbangkan tim**: karena tidak ada cookie pelacak dan tidak
ada data pribadi, situs ini tidak memerlukan banner persetujuan cookie. Kalau
suatu saat ada layanan pihak ketiga yang dipasang, pertimbangan itu berubah.

Jawaban survei beda urusan: di sana ada nama dan kontak yang diberikan sukarela
dengan persetujuan tertulis. Isinya hanya bisa dibaca akun di
`backoffice_users`, dan hasil unduhan CSV-nya mengandung data pribadi —
perlakukan seperti dokumen rahasia.

---

## 6. Cara kerjanya, singkat

Berguna kalau nanti ada yang perlu diperbaiki.

```
Pengunjung membuka halaman
   └─ PageViewTracker (klien) ──POST /api/track──▶ klasifikasi di server
                                                   └─ insert ke page_views (anon key)

Tim membuka /backoffice
   └─ src/proxy.ts  ──▶ segarkan token sesi, pulangkan yang belum login
        └─ (panel)/layout.tsx ──▶ requireBackofficeSession()
             └─ query dibawa token sesi ──▶ RLS Supabase yang memutuskan
```

Yang menjaga data bukan halaman login, melainkan **Row Level Security di
Postgres**. Halaman login cuma membuat pengalaman yang wajar; seandainya ada
celah di sisi Next.js, database tetap menolak membaca apa pun tanpa
`auth.uid()` yang terdaftar di `backoffice_users`.

**Service role key tidak dipakai di mana pun** dan tidak boleh dipasang di
environment aplikasi. Backoffice memakai anon key yang sama dengan situs
publik, bedanya ia membawa token sesi anggota tim.

| Peran | Menambah jawaban/kunjungan | Membaca |
| --- | --- | --- |
| Pengunjung situs (anon key) | boleh | **ditolak** |
| Akun login tapi tidak terdaftar | boleh | **ditolak** |
| Akun di `backoffice_users` | boleh | boleh |

---

## 7. Kalau ada yang tidak beres

| Gejala | Sebabnya biasanya |
| --- | --- |
| "Data belum bisa dibaca" + `Could not find the table 'public.page_views'` | `supabase/backoffice.sql` belum dijalankan, atau dijalankan di project yang berbeda |
| Semua angka nol padahal situs ramai | Akun berhasil masuk tapi belum ada barisnya di `backoffice_users` — jalankan langkah 1.3b |
| "Email atau kata sandi tidak cocok" padahal yakin benar | Akunnya belum terkonfirmasi. Buat ulang lewat dashboard dengan **Auto Confirm User** dicentang |
| "Akun ini belum diberi akses backoffice" | Persis seperti bunyinya — tinggal langkah 1.3b |
| Halaman pengunjung kosong terus di lokal | Memang begitu; lihat §2 |
| Angka survei jalan, angka pengunjung mentok di nol | `page_views` gagal terisi. Cek log server: pesannya "Gagal mencatat kunjungan: …" |
| Ter-logout terus tiap beberapa menit | `src/proxy.ts` tidak jalan — pastikan `matcher`-nya masih memuat `/backoffice/:path*` |

---

## 8. Yang belum ada

Jujur soal batasnya, supaya tidak ada yang mengira sudah tertangani:

- **Belum ada rate limit di `/api/track`.** Siapa pun yang tahu alamatnya bisa
  mengirim kunjungan palsu. Sama seperti pengiriman survei — kalau suatu saat
  ada yang iseng, yang perlu ditambah rate limit, bukan mengganti kunci.
- **Belum ada MFA.** Kata sandi satu-satunya penjaga akun. Pakai password
  manager, jangan kata sandi yang dipakai di tempat lain.
- **Belum ada halaman kelola anggota.** Menambah dan mencabut akses lewat SQL
  Editor (§1.3). Untuk tim sebesar ini itu lebih aman daripada membuat halaman
  yang bisa salah pakai.
- **Rekap survei masih dihitung di aplikasi.** Aman sampai sekitar 20.000
  jawaban; di atas itu halaman survei akan memberi peringatan sendiri dan
  rekapnya perlu dipindah ke SQL seperti rekap kunjungan.
- **Belum ada penghapusan data lama.** `page_views` tumbuh terus. Paket gratis
  Supabase 500 MB masih sangat longgar, tapi kalau suatu saat perlu:
  `delete from page_views where created_at < now() - interval '2 years';`

---

## 9. Pengembangan selanjutnya

Empat hal yang **sudah dipikirkan dan sengaja ditunda**, bukan lupa. Catatan
ini ditulis supaya siapa pun yang melanjutkan — termasuk yang menulisnya —
tidak perlu memikirkan ulang keputusannya dari nol.

Semuanya bertumpu pada satu hal yang sudah jadi: rekap survei dihitung di
aplikasi dari array `SurveyRow`, bukan di SQL. Selama itu masih benar, semua
di bawah ini cuma soal mengolah array yang sama.

### 9.1 Tabel silang (crosstab)

**Apa.** Rekap satu pertanyaan dipecah menurut pertanyaan lain — misalnya
kemudahan akses buku per keseharian, atau hambatan per kelompok umur.
Bedanya dengan saringan yang sudah ada: saringan menampilkan **satu** kelompok
dalam satu waktu, tabel silang menampilkan **semua kelompok bersebelahan**
sehingga selisihnya langsung kelihatan.

**Kenapa ini yang paling bernilai.** Need assessment tidak berhenti di "apa
yang dibutuhkan", tapi "siapa butuh apa" — dan itu yang menentukan bentuk
kegiatan. Rekap tunggal tidak pernah bisa menjawabnya.

**Kalau dikerjakan.**

- Fungsi baru di [`src/lib/backoffice/survey.ts`](../src/lib/backoffice/survey.ts):
  `crosstab(question, segmentField, rows)` yang mengembalikan matriks
  `opsi × segmen` berisi jumlah, plus jumlah per kolom.
- Segmennya pakai `filterFields` yang sudah ada di
  [`survey-filters.ts`](../src/lib/backoffice/survey-filters.ts) — daftar
  kelompoknya sudah lengkap dengan labelnya, tinggal dipakai sebagai sumbu.
- Komponen tabel bisa berdiri di atas `SummaryTable` yang sudah ada, dengan
  kolom tambahan. Bungkus `overflow-x-auto`-nya sudah benar; empat segmen ×
  tiga kolom masih muat digeser di 375px.

**Yang harus dijaga.** Aturan `MIN_FOR_PERCENT` berlaku **per sel**, bukan per
halaman. Satu kolom "guru" yang isinya tiga orang tidak boleh menampilkan
persen, meski total responden ratusan. Ini bukan kerewelan statistik: CLAUDE.md
melarang menaruh angka dampak yang datanya belum ada, dan sel crosstab
bernilai kecil adalah cara paling gampang melanggarnya tanpa sadar.

**Jangan** membuat matriks "semua pertanyaan × semua segmen". Pilih tiga sampai
empat pasangan yang memang jadi keputusan program; sisanya kebisingan yang
membuat halaman ini berhenti dibaca. Kandidat yang paling masuk akal:

| Pertanyaan | Dipecah menurut | Yang dijawab |
| --- | --- | --- |
| `access_ease` (skala) | keseharian | Siapa yang paling sulit dapat buku |
| `challenges` (centang) | kelompok umur | Hambatan berbeda per usia |
| `activities` (centang) | keseharian | Bentuk kegiatan per kelompok |
| `availability` (radio) | keseharian | Kapan kegiatan sebaiknya digelar |

### 9.2 Tabel jawaban penuh

**Apa.** Tab "Per orang" dalam bentuk tabel — baris responden, kolom
pertanyaan, seperti Google Sheets.

**Kenapa ditunda.** Datanya nol effort (`describeAnswer` sudah menghasilkan
kalimat siap baca — CSV memakainya), tapi nilainya tipis: untuk "lihat semua,
sortir, filter sendiri", CSV → Excel selalu lebih kuat daripada tabel buatan
sendiri. Tabel di web baru menang kalau perlu dilihat cepat tanpa mengunduh.

**Kalau dikerjakan.** Yang menghabiskan waktu bukan datanya, melainkan: 17
kolom dengan isi kalimat panjang butuh **pemilih kolom** (default lima sampai
enam kolom saja) dan kolom nama yang `sticky`. Tanpa keduanya ia jadi tembok
teks yang tidak terbaca di lebar mana pun.

**Yang harus dijaga.** Kolom `contact` berisi nomor WhatsApp dan email —
sembunyikan secara default dan biarkan perlu satu klik untuk membukanya.
Halaman ini memang sudah di balik login, tapi tidak ada gunanya memampangkan
kontak orang di layar yang sering dibuka sambil dipresentasikan.

### 9.3 Analisis jawaban terbuka

**Apa.** `hopes` dan semua isian "Lainnya" sekarang cuma ditumpuk sebagai
daftar. Yang berguna: mengelompokkannya jadi tema.

**Cara yang aman dan murah.** Hitung frekuensi kata/frasa di aplikasi (tanpa
kirim data ke mana pun), lalu tim memberi tag manual. Tagnya perlu kolom baru
di `survey_responses` atau tabel `survey_tags` terpisah — pilih yang kedua
supaya jawabannya tetap utuh apa adanya.

**Cara yang mahal, dan kenapa perlu hati-hati.** Pengelompokan otomatis pakai
LLM butuh API key, biaya per jalan, dan **mengirim jawaban warga ke pihak
ketiga**. Teks persetujuan survei di
[`src/lib/survey/questions.ts`](../src/lib/survey/questions.ts) harus dibaca
ulang dulu: kalau ia tidak menyebutkan itu, jangan dikerjakan sebelum teksnya
diperbarui dan responden lama diperlakukan sesuai persetujuan yang mereka
tanda tangani.

### 9.4 Narasi temuan otomatis

**Apa.** Kotak "tiga temuan utama" di atas rekap.

**Bentuk yang layak.** Berbasis aturan, bukan model bahasa: opsi teratas per
pertanyaan, segmen yang selisihnya di atas ambang tertentu, pertanyaan dengan
tingkat lewat tertinggi — semuanya template yang diisi angka yang sudah
dihitung. Deterministik, dan tidak bisa mengarang angka.

**Kalau tetap ingin memakai LLM**, batasi perannya pada merangkai kalimat dari
angka yang sudah jadi. Jangan pernah memberinya baris mentah lalu meminta
"temukan polanya" — itu menggabungkan dua risiko sekaligus: angka yang
dihalusinasikan, dan data pribadi yang keluar dari Supabase.

### Urutan yang disarankan

1. **9.1 tabel silang** — dampak terbesar per jam kerja, dan pondasinya
   (`filterFields`, `SummaryTable`, `MIN_FOR_PERCENT`) sudah berdiri.
2. **9.3 tag manual** — murah, dan jawaban terbuka biasanya isi laporan yang
   paling dikutip.
3. **9.4 narasi berbasis aturan** — baru masuk akal setelah 9.1 ada, karena
   selisih antar segmen itulah bahan kalimatnya.
4. **9.2 tabel jawaban penuh** — terakhir, dan hanya kalau setelah tiga di
   atas ia masih terasa kurang.
