# Menyambungkan survei ke Supabase

Halaman survei (`/id/survei`, `/en/survey`) menyimpan jawaban ke satu tabel di
Supabase. Dokumen ini panduan urutannya dari nol sampai jawaban pertama masuk.

Sebelum tersambung, halaman survei tetap tayang dan tetap bisa diisi — hanya di
langkah terakhir muncul pesan bahwa jawabannya belum bisa dikirim. Jadi tidak
ada yang rusak kalau langkah di bawah belum dikerjakan.

---

## 1. Buat project Supabase

1. Masuk ke [supabase.com](https://supabase.com), **New project**.
2. Isi:
   - **Name**: `wacabajo` (bebas).
   - **Database password**: dibuat otomatis saja, lalu **simpan di password
     manager**. Password ini tidak dipakai website, tapi perlu kalau nanti mau
     konek langsung ke Postgres.
   - **Region**: **Southeast Asia (Singapore)** — paling dekat dari Indonesia,
     jadi pengisian survei terasa paling cepat.
3. Tunggu sekitar dua menit sampai project-nya siap.

Paket gratis Supabase sudah lebih dari cukup: 500 MB database, sementara 150
jawaban survei ukurannya di bawah 1 MB.

---

## 2. Buat tabelnya

1. Di dashboard project, buka **SQL Editor** → **New query**.
2. Salin seluruh isi [`supabase/schema.sql`](../supabase/schema.sql), tempel,
   lalu **Run**.
3. Harusnya muncul "Success. No rows returned". Cek di **Table Editor** —
   tabel `survey_responses` sudah ada dengan kolom-kolomnya.

Isi file itu bukan cuma tabel: ada juga aturan Row Level Security yang
menentukan siapa boleh apa. Bagian ini yang menjaga datanya, jadi jangan
dilewati. Penjelasannya di [bagian keamanan](#6-kenapa-anon-key-aman-di-sini).

---

## 3. Ambil kunci API dan taruh di `.env.local`

1. Dashboard → ikon gerigi **Project Settings** → **API keys**.
2. Salin dua nilai:
   - **Project URL** — bentuknya `https://xxxxxxxxxxxx.supabase.co`
   - **anon public** — kunci panjang yang diawali `eyJ...`
3. Di root project, salin `.env.example` jadi `.env.local` kalau belum ada,
   lalu isi:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

**Jangan** menyalin `service_role` key ke sini. Kunci itu melewati semua aturan
keamanan; kalau sampai ikut ter-build ke website, siapa pun bisa membaca dan
menghapus seluruh jawaban survei. Aplikasi ini tidak pernah memerlukannya.

`.env.local` sudah masuk `.gitignore`, jadi ia tidak akan ikut ter-commit.

---

## 4. Coba di lokal

```bash
npm run dev
```

Buka `http://localhost:3000/id/survei`, isi sampai selesai, kirim. Lalu di
dashboard Supabase → **Table Editor** → `survey_responses`, barisnya harus
sudah muncul.

Kalau gagal, pesan errornya muncul di terminal tempat `npm run dev` jalan
(bukan di layar pengisi — pengisi cuma melihat ajakan mencoba lagi). Lihat
[Kalau ada yang tidak beres](#8-kalau-ada-yang-tidak-beres).

---

## 5. Pasang di produksi

Di Vercel (atau host mana pun): **Settings → Environment Variables**, tambahkan
dua variabel yang sama, lalu **redeploy**.

Redeploy-nya wajib. Variabel `NEXT_PUBLIC_*` ikut ditanam saat build, jadi
mengubah nilainya tanpa build ulang tidak berpengaruh apa-apa.

---

## 6. Kenapa anon key aman di sini

Anon key memang dirancang untuk publik — ia ikut terkirim ke browser di
aplikasi Supabase mana pun. Yang menjaga datanya bukan kerahasiaan kunci,
melainkan Row Level Security di database:

| Operasi          | Lewat anon key    | Lewat dashboard tim |
| ---------------- | ----------------- | ------------------- |
| Menambah jawaban | boleh             | boleh               |
| Membaca jawaban  | **ditolak**       | boleh               |
| Mengubah jawaban | **ditolak**       | boleh               |
| Menghapus        | **ditolak**       | boleh               |

Di Postgres, tabel yang RLS-nya aktif menolak semua operasi yang tidak punya
policy. `schema.sql` cuma memberi satu policy — INSERT — jadi tidak adanya
policy SELECT itulah yang mengunci jawaban orang. Tim tetap bisa membaca
semuanya lewat dashboard, karena koneksi itu memakai service role.

Yang masih terbuka: siapa pun yang tahu alamat halamannya bisa mengirim
jawaban. Itu memang niatnya survei publik. Pertahanan yang ada sekarang cuma
kolom jebakan (honeypot) untuk bot sederhana. Kalau nanti ada yang iseng
mengirim ratusan jawaban, yang perlu ditambah adalah rate limit — bukan
mengubah kunci.

---

## 7. Membaca hasilnya

**Table Editor** cukup untuk melihat-lihat dan mengekspor CSV
(tombol **Export** di kanan atas).

Untuk rekap cepat, pakai **SQL Editor**. Beberapa query yang sering dipakai
sudah ditulis di bagian bawah [`supabase/schema.sql`](../supabase/schema.sql),
misalnya:

```sql
-- kegiatan yang paling banyak diminati
select unnest(activities) as kegiatan, count(*)
from survey_responses group by 1 order by 2 desc;
```

Jawaban pilihan ganda disimpan sebagai kunci netral bahasa (`public_library`,
`storytelling`), bukan kalimat lengkapnya — supaya rekapnya tidak pecah dua
gara-gara ada yang mengisi versi Inggris. Daftar pasangan kunci ↔ kalimat ada
di [`src/lib/survey/questions.ts`](../src/lib/survey/questions.ts).

---

## 8. Kalau ada yang tidak beres

| Gejala | Sebabnya biasanya |
| --- | --- |
| "Survei belum tersambung ke penyimpanan datanya" | `.env.local` belum diisi, atau server belum di-restart setelah mengisinya |
| Terminal: `relation "public.survey_responses" does not exist` | `schema.sql` belum dijalankan, atau dijalankan di project yang berbeda |
| Terminal: `new row violates row-level security policy` | Policy INSERT belum ada — jalankan ulang bagian RLS di `schema.sql` |
| Terminal: `column "..." of relation ... does not exist` | Ada pertanyaan baru di `questions.ts` yang kolomnya belum ditambahkan ke tabel |
| Terkirim di lokal, gagal di produksi | Variabel environment belum dipasang di host, atau belum redeploy setelah dipasang |

---

## 9. Menambah atau mengubah pertanyaan

Urutannya penting, karena database yang menolak duluan kalau kolomnya belum ada:

1. Tambahkan kolomnya di Supabase, misalnya:
   ```sql
   alter table public.survey_responses add column if not exists dialect text;
   ```
2. Baru tambahkan pertanyaannya di
   [`src/lib/survey/questions.ts`](../src/lib/survey/questions.ts) — `id`-nya
   harus sama persis dengan nama kolom, dan kedua bahasanya diisi sekaligus.
3. Kalau pertanyaannya punya opsi "Lainnya" (`other: true`), tambahkan juga
   kolom `<id>_other text`.

Jangan mengubah `value` opsi yang sudah tayang. Kunci itu sudah tersimpan di
baris-baris lama; menggantinya membuat rekap lama dan baru tidak bisa
dijumlahkan.
