# Deployment & environment

Catatan operasional: di mana situs ini hidup, siapa yang memegang apa, dan
apa yang masih menggantung. Panduan Supabase-nya terpisah di
[`docs/SUPABASE.md`](SUPABASE.md).

Terakhir diperbarui: **3 September 2026**.

---

## 1. Peta deployment

```
GitHub  hellowacabajo-dev/wacabajo-website  (publik, branch main)
   │
   ├── auto-deploy ──▶  Vercel project di akun LAIN  ──▶  https://www.wacabajo.org
   │                    (produksi sebenarnya)              wacabajo.org → 308 → www
   │
   └── deploy manual ─▶ Vercel "wacabajo-website"    ──▶  https://wacabajo-website-six.vercel.app
                        (akun abiyyuhanief3101,           duplikat, lihat §4
                         tim "Abi's projects")
```

Yang penting dipahami:

- **Setiap `git push` ke `main` langsung tayang di www.wacabajo.org.** Repo ini
  tersambung ke project Vercel di akun lain (kemungkinan besar milik klien).
  Tidak ada tahap review — push berarti rilis.
- Akun Vercel `abiyyuhanief3101` **tidak punya akses** ke project pemilik
  wacabajo.org. `vercel domains inspect wacabajo.org` menolak, dan
  `vercel git connect` gagal karena repo-nya sudah dipegang project lain.
  Artinya semua urusan environment dan redeploy di domain asli harus lewat
  akun yang memegangnya.

## 2. Environment variables

Ketiganya `NEXT_PUBLIC_*`, jadi nilainya **ditanam ke dalam bundel saat build**,
bukan dibaca saat halaman jalan. Mengubah nilainya tidak berpengaruh apa pun
sampai ada build ulang.

| Variabel | Nilai produksi | Kalau kosong |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://www.wacabajo.org` (pakai `www` — domain polosnya redirect ke sana) | canonical, Open Graph, `robots.txt`, dan `sitemap.xml` menunjuk `http://localhost:3000` |
| `NEXT_PUBLIC_SUPABASE_URL` | dari dashboard Supabase → Project Settings → API | survei tayang tapi menolak mengirim di langkah terakhir |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon **public** key, bukan `service_role` | sama seperti di atas |

`NEXT_PUBLIC_JOIN_FORM_URL` opsional — selama kosong, tombol "Isi formulir" di
ajakan penutup tidak dirender.

Anon key aman berada di bundel publik: yang menjaga data adalah Row Level
Security di [`supabase/schema.sql`](../supabase/schema.sql) — boleh INSERT,
tidak ada policy SELECT sama sekali. Sudah diverifikasi dengan menembak API-nya
langsung: baca mengembalikan `[]`, hapus tidak mengubah apa pun, dan kirim
tanpa consent ditolak.

## 3. Cara deploy

**Ke produksi (www.wacabajo.org)** — cukup `git push origin main`. Deploy-nya
otomatis. Kalau yang berubah cuma environment variable dan bukan kode, pakai
**Deployments → deployment teratas → ⋯ → Redeploy** di dashboard akun tersebut.

**Ke project duplikat** (selama masih ada): `vercel --prod` dari root project.

Sebelum push, wajib lolos:

```bash
npm run build && npm run lint && npm run typecheck
```

Lalu checklist merge di [`docs/DESIGN.md`](DESIGN.md) §9.

## 4. Yang masih menggantung

- [ ] **Tiga environment variable di project wacabajo.org belum diisi.** Ini
      yang paling mendesak: canonical situs produksi masih `localhost:3000`,
      dan survei di sana belum bisa menerima jawaban. Butuh akses ke akun
      Vercel pemilik domain.
- [ ] **Project duplikat `wacabajo-website` belum diputuskan nasibnya.** Dibuat
      3 September 2026 saat mengira belum ada deployment lain. Ia menayangkan
      situs yang sama dengan konfigurasi yang benar, jadi sekarang ada dua
      salinan publik — Google bisa salah memilih mana yang asli. Pilihannya:
      hapus (`vercel project rm wacabajo-website`), atau pertahankan sebagai
      staging tapi diberi `noindex` lebih dulu.
- [ ] **Auto-deploy dari akun sendiri belum bisa.** Kalau nanti pengelolaan
      pindah sepenuhnya ke akun `abiyyuhanief3101`, Vercel GitHub App perlu
      dipasang di akun `hellowacabajo-dev` dan koneksi repo di project lama
      diputus lebih dulu.
- [ ] **Pengiriman survei di produksi belum pernah diuji.** Sudah terbukti
      jalan di lokal (jawaban masuk ke Supabase, layar penutup muncul), tapi
      di domain asli belum — menunggu environment-nya terisi.

## 5. Riwayat singkat

Ringkasan supaya tidak perlu membaca ulang seluruh git log.

**3 September 2026**

- Sisa feedback stakeholder dieksekusi: kutipan + tiga CTA di hero, body copy
  hero ditulis ulang supaya tidak mengklaim kegiatan yang belum berjalan,
  section "Cara bergabung" jadi "Ikut terlibat" dengan panel kegiatan yang
  sedang disiapkan, dan seluruh copy Inggris ditulis ulang agar tidak terbaca
  seperti hasil terjemahan mesin.
- Tombol primer tema gelap pindah dari burgundy ke Sunset Gold. Burgundy 600
  cuma terpisah 2,8:1 dari latar Darkest Forest; gold 400 terpisah 6,7:1.
- Survei need assessment dibuat **sebagai halaman di dalam situs**, bukan
  Google Form: `/id/survei` dan `/en/survey`, 17 pertanyaan dalam 9 langkah,
  jawaban masuk ke Supabase lewat server action.
- Pengalaman ponsel dioptimalkan setelah diaudit di 375px: bilah aksi menempel
  di dasar layar (sebelumnya tombol "Lanjut" baru terlihat setelah scroll
  ~1500px), langkah terberat dipecah dua, dan sejumlah target sentuh serta
  luberan tata letak diperbaiki.
- Situs di-deploy; peta deployment di atas ditemukan dan didokumentasikan.
