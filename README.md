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
    brand/page.tsx    style guide hidup (/brand)
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
    brand.ts          isi brand guidelines sebagai data
    site.ts           nama situs, nav, URL, kontak
    utils.ts          helper cn()
```

## Design system

Ringkasannya ada di [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md), dan
versi visualnya bisa dibuka di **`/brand`** — halaman itu merender token yang
sama dengan yang dipakai komponen produksi, jadi tidak pernah basi.

Dua tempat yang perlu diingat:

- `src/app/globals.css` — semua warna, radius, shadow, dan font token.
- `src/lib/brand.ts` — teks brand (values, tone of voice, personality) dan
  data palet yang dirender di `/brand`.

## Environment

Salin `.env.example` ke `.env.local`. Untuk pengembangan lokal tidak ada
variabel wajib; `NEXT_PUBLIC_SITE_URL` baru perlu diisi saat deploy agar
canonical URL, Open Graph, `robots.txt`, dan `sitemap.xml` menunjuk ke domain
yang benar.

## Yang masih kosong

- **Logomark.** Bagian "Identity System" tidak ikut ter-export di PDF versi
  compressed, jadi yang ada di web baru wordmark berbasis teks. Begitu file
  logomark tersedia, taruh di `public/logomark.svg` lalu render di
  `src/components/Logo.tsx`.
- **Daftar program** di beranda masih placeholder (`src/app/page.tsx`).
- **Gambar/foto.** Belum ada aset, jadi hero dan kartu program memakai bidang
  warna. `next/image` sudah dikonfigurasi untuk WebP begitu foto masuk.
- **OG image.** Metadata sudah siap, tinggal menambahkan `opengraph-image`.
