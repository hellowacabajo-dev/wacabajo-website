-- Tabel jawaban survei need assessment "Suara Labuan Bajo untuk Literasi".
--
-- Jalankan sekali lewat SQL Editor di dashboard Supabase. Aman diulang:
-- semuanya memakai "if not exists" / "drop policy if exists".
--
-- Nama kolom sengaja sama persis dengan `id` pertanyaan di
-- src/lib/survey/questions.ts. Kalau menambah pertanyaan di sana, tambahkan
-- kolomnya di sini juga — kalau tidak, insert-nya akan ditolak Postgres.

create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Bahasa yang dipakai pengisi. Berguna saat rekap: pertanyaannya sama,
  -- tapi jawaban teks bebasnya beda bahasa.
  locale text not null check (locale in ('id', 'en')),
  consent boolean not null check (consent),

  -- Perkenalan
  name text not null check (length(btrim(name)) between 1 and 80),
  age smallint not null check (age between 5 and 100),
  resident_type text not null,
  daily_role text not null,
  daily_role_other text,

  -- Kebiasaan membaca
  reading_frequency text not null,
  reading_kinds text[] not null default '{}',
  reading_kinds_other text,

  -- Akses bacaan
  access_ease smallint not null check (access_ease between 1 and 5),
  book_source text[] not null default '{}',
  book_source_other text,

  -- Perubahan setelah gempa
  quake_change text not null,
  quake_factors text[] not null default '{}',
  quake_factors_other text,

  -- Hambatan
  challenges text[] not null default '{}',
  challenges_other text,

  -- Kegiatan & topik yang diinginkan
  activities text[] not null default '{}',
  activities_other text,
  topics text[] not null default '{}',
  topics_other text,

  -- Peran & waktu
  involvement text not null,
  availability text not null,

  -- Opsional
  hopes text check (hopes is null or length(hopes) <= 1500),
  contact text check (contact is null or length(contact) <= 120)
);

comment on table public.survey_responses is
  'Jawaban survei need assessment Waca Bajo. Isian per pertanyaan mengikuti src/lib/survey/questions.ts.';

create index if not exists survey_responses_created_at_idx
  on public.survey_responses (created_at desc);

-- ── Row Level Security ─────────────────────────────────────────────────────
--
-- Situs memakai anon key, yang memang kunci publik. Yang menjaga datanya
-- adalah dua kebijakan di bawah: siapa pun boleh menambah baris, tidak ada
-- satu pun yang boleh membaca, mengubah, atau menghapusnya lewat kunci itu.
-- Tim tetap bisa membaca semuanya lewat dashboard/SQL Editor, karena koneksi
-- itu memakai service role yang melewati RLS.

alter table public.survey_responses enable row level security;

drop policy if exists "siapa pun boleh mengisi survei" on public.survey_responses;
create policy "siapa pun boleh mengisi survei"
  on public.survey_responses
  for insert
  to anon, authenticated
  with check (consent);

-- Tidak ada policy SELECT/UPDATE/DELETE sama sekali. Di Postgres, tabel dengan
-- RLS aktif menolak semua operasi yang tidak punya policy — jadi ketiadaan
-- policy di sini memang yang mengunci datanya, bukan kelalaian.

-- ── Rekap cepat ────────────────────────────────────────────────────────────
-- Contoh query untuk SQL Editor (bukan bagian dari aplikasi):
--
--   -- berapa yang sudah mengisi
--   select count(*) from survey_responses;
--
--   -- sebaran frekuensi membaca
--   select reading_frequency, count(*)
--   from survey_responses group by 1 order by 2 desc;
--
--   -- kegiatan yang paling banyak diminati (memecah array jadi baris)
--   select unnest(activities) as kegiatan, count(*)
--   from survey_responses group by 1 order by 2 desc;
--
--   -- siapa saja yang mau dihubungi lagi
--   select name, age, involvement, contact
--   from survey_responses
--   where contact is not null
--   order by created_at desc;
