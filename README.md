# Waca Bajo — Website

Boilerplate website Waca Bajo. Design system-nya diturunkan langsung dari
**Waca Bajo Brand Guidelines 2026** (`../Waca Bajo Brand Guidelines_compressed.pdf`).

## Tech stack

| Bagian    | Pilihan                                        |
| --------- | ---------------------------------------------- |
| Framework | Next.js 16 (App Router, Turbopack)             |
| UI        | React 19, TypeScript strict                    |
| Styling   | Tailwind CSS v4 (token via `@theme inline`)    |
| Font      | `next/font/google` — Bricolage Grotesque + Sorts Mill Goudy |
| Lint      | ESLint 9 flat config (`eslint-config-next`)    |
| Deploy    | Vercel-ready (semua route statis)              |

Belum ada CMS maupun database — sengaja, supaya bisa dipasang belakangan
sesuai kebutuhan (Payload seperti di `website-gernas`, atau Supabase seperti
di `website-laksabogor-smojo`).

## Menjalankan

```bash
npm install
npm run dev
```

Buka http://localhost:3000. Perintah lain:

```bash
npm run build      # production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit (jalankan setelah `npm run build` sekali,
                   # karena tipe route Next digenerate saat build)
```

## Struktur

```
src/
  app/
    layout.tsx        chrome situs + pemuatan font + metadata
    page.tsx          beranda
    globals.css       SELURUH design token ada di sini
    not-found.tsx     halaman 404
    robots.ts         /robots.txt
    sitemap.ts        /sitemap.xml
    icon.svg          favicon
  components/
    SiteHeader.tsx    header sticky + menu mobile
    SiteFooter.tsx    footer
    Logo.tsx          wordmark "waca bajo"
    ui/               Button, Card, Container, Section
  lib/
    content.ts        seluruh copy beranda sebagai data
    site.ts           nama situs, nav, URL, kontak
    utils.ts          helper cn()
```

## Design system

Rujukan lengkapnya ada di [`docs/DESIGN.md`](docs/DESIGN.md) — palet,
tipografi, aturan copy, dan standar UI/UX desktop + mobile yang wajib dipenuhi
setiap halaman baru.

Dua tempat yang perlu diingat:

- `src/app/globals.css` — semua warna, radius, shadow, dan font token.
- `docs/DESIGN.md` §9 — checklist yang harus lolos sebelum merge.

## Environment

Salin `.env.example` ke `.env.local`. Untuk pengembangan lokal tidak ada
variabel wajib.

- `NEXT_PUBLIC_SITE_URL` — baru perlu diisi saat deploy agar canonical URL,
  Open Graph, `robots.txt`, dan `sitemap.xml` menunjuk ke domain yang benar.
- `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` — penyimpanan
  jawaban survei. Selama kosong, halaman survei tetap bisa dibuka dan diisi,
  tapi menolak mengirim di langkah terakhir. Panduan lengkapnya di
  [`docs/SUPABASE.md`](docs/SUPABASE.md).
- `NEXT_PUBLIC_JOIN_FORM_URL` — tautan Google Form rekrutmen. Selama kosong,
  ajakan penutup hanya menampilkan email dan Instagram.

Semuanya `NEXT_PUBLIC_*`, jadi nilainya ikut ter-inline saat build — ganti
nilai berarti build ulang.

Untuk nilai produksi, siapa yang memegang project Vercel-nya, dan cara deploy:
[`docs/DEPLOY.md`](docs/DEPLOY.md).

## Yang masih menunggu aset

- **Logomark.** Yang ada di web baru wordmark berbasis teks. Begitu file
  logomark tersedia, taruh di `public/logomark.svg` lalu render di
  `src/components/Logo.tsx`.
- **Foto kegiatan.** Belum ada aset, jadi hero dan kartu program memakai
  bidang warna. `next/image` sudah dikonfigurasi untuk WebP begitu foto masuk.
- **OG image.** Metadata sudah siap, tinggal menambahkan `opengraph-image`.
- **Cerita relawan/warga.** Bentuk bukti yang paling on-brand. Begitu ada satu
  kutipan asli (dengan izinnya), tambahkan sebagai section tersendiri dan
  `heroFacts` boleh dipensiunkan.
