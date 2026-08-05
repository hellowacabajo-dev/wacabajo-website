# Catatan untuk agent

Website Waca Bajo. Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4.

## Aturan yang tidak boleh dilanggar

- **Jangan hardcode warna hex di komponen.** Semua warna hidup sebagai token
  di `src/app/globals.css` dan dipakai lewat utility Tailwind (`bg-forest-950`,
  `text-foreground-muted`, dst.).
- **Pasangan teks/latar harus lolos WCAG AA.** Daftar pasangan yang sudah
  divalidasi ada di `docs/DESIGN-SYSTEM.md` §1 dan di `colorPairings`
  (`src/lib/brand.ts`). Sunset Gold bukan warna teks di latar terang.
- **Headline memakai Sentence case**, sesuai brand guidelines. Uppercase hanya
  untuk eyebrow/label kecil.
- **Copy mengikuti tone of voice deck.** Aturannya ada sebagai data di
  `toneOfVoice` dan `copyRules` (`src/lib/brand.ts`), terbaca di `/brand#suara`,
  dan dijelaskan di `docs/DESIGN-SYSTEM.md` §3. Jangan menaruh angka dampak
  yang datanya belum ada — bukti yang on-brand berbentuk cerita orang.
- Komentar dan copy ditulis dalam bahasa Indonesia, mengikuti proyek lain di
  folder "LETS GO GIG".

## Verifikasi sebelum selesai

```bash
npm run build && npm run lint
```

`npm run typecheck` baru akurat setelah `npm run build` sekali dijalankan,
karena tipe route (`LayoutProps`, `PageProps`) digenerate saat build.

## Peta file

- Token desain → `src/app/globals.css`
- Isi brand guidelines sebagai data → `src/lib/brand.ts`
- Konfigurasi situs & navigasi → `src/lib/site.ts`
- Style guide hidup → `src/app/brand/page.tsx` (route `/brand`)
- Latar belakang keputusan desain → `docs/DESIGN-SYSTEM.md`
