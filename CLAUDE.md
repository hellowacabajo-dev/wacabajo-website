# Catatan untuk agent

Website Waca Bajo. Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4.

Rujukan desain lengkapnya ada di **`docs/DESIGN.md`**. Halaman `/brand` sudah
dihapus — style guide tidak tayang untuk publik.

## Aturan yang tidak boleh dilanggar

### Warna & tipografi

- **Jangan hardcode warna hex di komponen.** Semua warna hidup sebagai token
  di `src/app/globals.css` dan dipakai lewat utility Tailwind (`bg-forest-950`,
  `text-foreground-muted`, dst.).
- **Pasangan teks/latar harus lolos WCAG AA.** Daftar pasangan yang sudah
  divalidasi ada di `docs/DESIGN.md` §1. Sunset Gold bukan warna teks di latar
  terang.
- **Bricolage untuk heading & UI, Sorts Mill Goudy untuk paragraf.** Goudy
  dipilih karena italic-nya asli, tapi ia **tidak punya bold** — jangan pasang
  `font-bold`/`font-semibold` pada teks serif; tambahkan `font-sans` di elemen
  itu kalau memang perlu tebal. Detailnya di `docs/DESIGN.md` §2.

### Copy

- **Headline memakai Sentence case.** Uppercase hanya untuk eyebrow/label kecil.
- **Dwibahasa: `/id` (Indonesia) dan `/en` (Inggris), masing-masing penuh
  satu bahasa** — termasuk metadata, tanpa campur bahasa dalam satu locale.
  Pengecualiannya hanya tagline *Growing Through Stories* — itu nama diri,
  sama di kedua locale. Root `/` selalu redirect ke `/id` (lihat
  `src/proxy.ts`), bukan dideteksi dari browser.
- **Istilah internal tidak pernah tampil di halaman publik.** Nama pilar tone
  of voice, nomor halaman brand deck, kode warna, dan catatan proses adalah
  bahan kerja tim — tempatnya di `docs/DESIGN.md`, bukan di layar pengunjung.
- **Jangan menaruh angka dampak yang datanya belum ada.** Bukti yang on-brand
  berbentuk cerita orang. Aturan copy lengkap + pola per elemen (tombol,
  eyebrow, judul section, body kartu) ada di `docs/DESIGN.md` §3.
- Seluruh copy beranda hidup sebagai data per locale di `src/lib/content.ts`
  (`getContent("id" | "en")`), dan copy antarmuka umum (nav, footer, 404) di
  `src/lib/i18n/ui.ts` (`getUi(locale)`). Menyunting teks tidak boleh
  menyentuh markup.
- **Pengecualian bentuk data:** isi survei di `src/lib/survey/questions.ts`
  menyimpan kedua bahasa dalam satu objek (`{ id: "...", en: "..." }`), bukan
  dua objek terpisah. Alasannya label harus selalu terikat pada `value` opsi
  yang tersimpan di database — kalau dipisah per locale, satu opsi yang lupa
  diterjemahkan langsung merusak rekap dan tidak ketahuan TypeScript. Aturan
  "satu locale, satu bahasa" tetap berlaku untuk yang tampil di layar.

### UI/UX — berlaku untuk desktop dan mobile

Standarnya ada di `docs/DESIGN.md` §9. Yang paling sering terlanggar:

- **Mobile-first.** Uji di 375 / 768 / 1024 / 1440. Tidak boleh ada scroll
  horizontal di lebar mana pun.
- **Target sentuh minimal 44×44px** untuk semua kontrol, termasuk tautan di
  footer dan menu mobile.
- **Setiap heading punya minimal dua anak tangga ukuran** (ponsel + desktop).
  Ukuran desktop yang dipakai apa adanya di 375px selalu pecah jadi lima baris.
- **Ritme section `py-20 md:py-28 lg:py-32`**, jarak heading ke isi
  `mt-12 md:mt-16`. Spasi kelipatan 4px.
- **CTA melebar penuh di ponsel** (`w-full sm:w-auto`).
- **Jangan menambah offset scroll manual** untuk header sticky — `html` sudah
  memakai `scroll-padding-top: 6rem`.
- **Animasi hanya `transform` dan `opacity`**, durasi 150–300ms, dan wajib
  hormat pada `prefers-reduced-motion`.
- Jangan pakai `100vh` di ponsel (pakai `dvh`), jangan kunci zoom, jangan
  hapus focus ring, jangan pakai emoji sebagai ikon.

### Komentar

- Komentar dan copy ditulis dalam bahasa Indonesia, mengikuti proyek lain di
  folder "LETS GO GIG".
- Komentar menjelaskan **kenapa**, bukan mengutip dokumen. Jangan menulis
  komentar yang berbunyi seperti catatan draf atau rujukan halaman deck.

## Verifikasi sebelum selesai

```bash
npm run build && npm run lint
```

`npm run typecheck` baru akurat setelah `npm run build` sekali dijalankan,
karena tipe route (`LayoutProps`, `PageProps`) digenerate saat build.

Lalu jalankan checklist merge di `docs/DESIGN.md` §9.

## Peta file

- Token desain → `src/app/globals.css`
- Copy beranda sebagai data per locale → `src/lib/content.ts`
- Copy antarmuka umum per locale (nav, footer, 404, sakelar tema) →
  `src/lib/i18n/ui.ts`
- Daftar locale & locale default → `src/lib/i18n/config.ts`
- Slug halaman per locale (`/id/survei`, `/en/survey`) → `src/lib/i18n/routes.ts`
- Isi survei need assessment (pertanyaan, opsi, teks pembuka/penutup, dwibahasa
  dalam satu objek) → `src/lib/survey/questions.ts`
- Validasi survei (dipakai browser & server) → `src/lib/survey/validate.ts`
- Pengiriman jawaban ke Supabase → `src/lib/survey/actions.ts`, `src/lib/supabase.ts`
- Skema tabel + Row Level Security → `supabase/schema.sql`
- Panduan menyambungkan Supabase → `docs/SUPABASE.md`
- Peta deployment, environment produksi, dan yang masih menggantung →
  `docs/DEPLOY.md`. **Baca ini sebelum `git push`:** push ke `main` langsung
  tayang di www.wacabajo.org, tanpa tahap review.
- Redirect `/` → `/id` → `src/proxy.ts`
- Konfigurasi situs & navigasi → `src/lib/site.ts`
- Rujukan desain, brand, copy, dan standar UI/UX → `docs/DESIGN.md`
