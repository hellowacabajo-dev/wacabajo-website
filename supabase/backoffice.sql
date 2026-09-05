-- Backoffice Waca Bajo — tabel pengunjung, akses tim, dan rekap.
--
-- Jalankan sekali lewat SQL Editor di dashboard Supabase, SETELAH
-- `supabase/schema.sql`. Aman diulang: semuanya memakai "if not exists" /
-- "or replace" / "drop policy if exists".
--
-- Panduan langkah demi langkah (termasuk membuat akun tim) ada di
-- `docs/BACKOFFICE.md`.

-- ═══════════════════════════════════════════════════════════════════════════
-- 1. Siapa yang boleh masuk backoffice
-- ═══════════════════════════════════════════════════════════════════════════
--
-- Punya akun Supabase saja tidak cukup. Barisnya harus ada di tabel ini juga,
-- supaya akun yang terlanjur dibuat (atau bocor) tidak otomatis bisa membaca
-- jawaban survei. Menambah dan mencabut akses cukup lewat tabel ini.

create table if not exists public.backoffice_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  -- Disalin dari auth.users hanya supaya tabel ini terbaca tanpa join.
  email text,
  note text,
  created_at timestamptz not null default now()
);

comment on table public.backoffice_users is
  'Daftar akun yang boleh membuka /backoffice. Hapus barisnya untuk mencabut akses.';

alter table public.backoffice_users enable row level security;

drop policy if exists "anggota melihat barisnya sendiri" on public.backoffice_users;
create policy "anggota melihat barisnya sendiri"
  on public.backoffice_users
  for select
  to authenticated
  using (user_id = (select auth.uid()));

-- Dipakai semua policy di bawah. `security definer` karena fungsinya harus
-- bisa membaca `backoffice_users` tanpa terhalang RLS tabel itu sendiri —
-- kalau tidak, policy yang memanggilnya akan selalu palsu.
create or replace function public.is_backoffice_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.backoffice_users where user_id = auth.uid()
  );
$$;

revoke execute on function public.is_backoffice_user() from public;
grant execute on function public.is_backoffice_user() to authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
-- 2. Jawaban survei jadi bisa dibaca tim
-- ═══════════════════════════════════════════════════════════════════════════
--
-- Sampai sekarang `survey_responses` tidak punya policy SELECT sama sekali,
-- jadi jawabannya cuma bisa dilihat lewat dashboard. Policy ini membuka satu
-- pintu saja: akun yang terdaftar di `backoffice_users`. Anon key yang ikut
-- ter-build ke browser tetap tidak bisa membaca apa pun.

drop policy if exists "tim backoffice boleh membaca jawaban" on public.survey_responses;
create policy "tim backoffice boleh membaca jawaban"
  on public.survey_responses
  for select
  to authenticated
  using (public.is_backoffice_user());

-- ═══════════════════════════════════════════════════════════════════════════
-- 3. Kunjungan halaman
-- ═══════════════════════════════════════════════════════════════════════════
--
-- Satu baris per halaman yang dibuka. Tidak ada alamat IP, nama, atau apa pun
-- yang menunjuk orang tertentu: `visitor_id` cuma angka acak yang disimpan di
-- browser pengunjung sendiri (localStorage), dan bisa ia hapus kapan saja.
--
-- Kolom asal kunjungan (referrer, channel, utm) hanya diisi pada halaman
-- PERTAMA sebuah sesi — `is_entry`. Halaman kedua dan seterusnya referrer-nya
-- selalu situs kita sendiri, jadi kalau ikut dihitung, "asal pengunjung"
-- malah didominasi wacabajo.org.

create table if not exists public.page_views (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),

  -- Anonim, dibuat di browser. Sama = kemungkinan besar orang yang sama.
  visitor_id uuid not null,
  -- Satu sesi = rangkaian kunjungan dengan jeda di bawah 30 menit.
  session_id uuid not null,

  path text not null check (length(path) between 1 and 300),
  locale text check (locale in ('id', 'en')),

  is_entry boolean not null default false,
  is_new_visitor boolean not null default false,

  -- Hanya host-nya, bukan URL penuh: query string di tautan orang lain
  -- kadang membawa data pribadi mereka, dan kita tidak butuh itu.
  referrer_host text,
  -- direct | organic_search | social | referral | campaign
  channel text,
  -- instagram | google | whatsapp | ... — kunci netral, labelnya di kode.
  source text,
  utm_source text,
  utm_medium text,
  utm_campaign text,

  device text check (device in ('mobile', 'tablet', 'desktop')),
  browser text,
  os text,
  -- Kode negara dua huruf dari header CDN. Kota tidak disimpan.
  country text check (country is null or length(country) = 2),
  viewport_width smallint
);

comment on table public.page_views is
  'Kunjungan halaman situs publik. Anonim: tanpa IP, tanpa identitas.';

create index if not exists page_views_created_at_idx
  on public.page_views (created_at desc);
create index if not exists page_views_session_idx
  on public.page_views (session_id);
create index if not exists page_views_visitor_idx
  on public.page_views (visitor_id);

alter table public.page_views enable row level security;

-- Situs publik memakai anon key untuk mencatat kunjungan, sama seperti saat
-- mengirim jawaban survei: boleh menambah, tidak boleh membaca.
drop policy if exists "situs boleh mencatat kunjungan" on public.page_views;
create policy "situs boleh mencatat kunjungan"
  on public.page_views
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "tim backoffice boleh membaca kunjungan" on public.page_views;
create policy "tim backoffice boleh membaca kunjungan"
  on public.page_views
  for select
  to authenticated
  using (public.is_backoffice_user());

-- ═══════════════════════════════════════════════════════════════════════════
-- 4. Rekap kunjungan
-- ═══════════════════════════════════════════════════════════════════════════
--
-- PostgREST memotong hasil select di 1.000 baris. Kalau backoffice menarik
-- baris mentah lalu menjumlahkannya sendiri di JavaScript, angkanya akan
-- diam-diam salah begitu kunjungan lewat seribu. Jadi penjumlahannya di sini,
-- dan aplikasi cuma membaca hasilnya.
--
-- `security_invoker` membuat view tunduk pada RLS pemanggilnya — tanpa itu,
-- view ini jadi pintu belakang yang melewati policy di atas.
--
-- Harinya dihitung dalam waktu Labuan Bajo (WITA), bukan UTC. Kalau memakai
-- UTC, kunjungan jam 7 pagi WITA masuk ke tanggal kemarin.

drop view if exists public.backoffice_visitor_daily;
create view public.backoffice_visitor_daily
with (security_invoker = true) as
  select
    (created_at at time zone 'Asia/Makassar')::date as day,
    count(*)::bigint as views,
    count(distinct visitor_id)::bigint as visitors,
    count(distinct session_id)::bigint as sessions
  from public.page_views
  group by 1;

-- Halaman terpopuler dan pecahan "dari mana pengunjungnya" dibuat sebagai
-- fungsi, bukan view: kalau dibiarkan jadi view harian, jumlah barisnya
-- tumbuh sebesar (jumlah hari x jumlah nilai) dan cepat menabrak batas 1.000
-- baris PostgREST tadi. Sebagai fungsi, rentang tanggalnya ikut masuk ke
-- penjumlahan, jadi yang keluar selalu segelintir baris.

create or replace function public.backoffice_top_pages(
  from_day date,
  to_day date,
  limit_n int default 25
)
-- Kolom keluarannya dinamai `page_path`, bukan `path`: di fungsi SQL, nama
-- kolom pada `returns table` ikut jadi nama yang bisa dirujuk di dalam query,
-- dan `path` akan bentrok dengan kolom tabelnya sendiri.
returns table (page_path text, views bigint, visitors bigint)
language sql
stable
as $$
  select
    pv.path,
    count(*)::bigint,
    count(distinct pv.visitor_id)::bigint
  from public.page_views as pv
  where (pv.created_at at time zone 'Asia/Makassar')::date between from_day and to_day
  group by pv.path
  order by 2 desc
  limit limit_n;
$$;

-- Semua pecahan dalam sekali panggil. Dimensinya ditumpuk jadi baris supaya
-- backoffice tidak perlu delapan permintaan terpisah untuk satu halaman.
--
-- Hanya `is_entry` yang dihitung: halaman kedua dan seterusnya dalam satu
-- sesi tidak punya asal kunjungan sendiri, dan perangkatnya sama saja.
create or replace function public.backoffice_entry_facets(
  from_day date,
  to_day date
)
returns table (dimension text, value text, sessions bigint)
language sql
stable
as $$
  with entries as (
    select *
    from public.page_views
    where is_entry
      and (created_at at time zone 'Asia/Makassar')::date between from_day and to_day
  )
  select 'channel'::text, coalesce(channel, 'unknown'), count(*)::bigint
    from entries group by coalesce(channel, 'unknown')
  union all
  select 'source'::text, coalesce(source, 'unknown'), count(*)::bigint
    from entries group by coalesce(source, 'unknown')
  union all
  select 'referrer'::text, coalesce(referrer_host, '(langsung)'), count(*)::bigint
    from entries group by coalesce(referrer_host, '(langsung)')
  union all
  select 'device'::text, coalesce(device, 'unknown'), count(*)::bigint
    from entries group by coalesce(device, 'unknown')
  union all
  select 'os'::text, coalesce(os, 'unknown'), count(*)::bigint
    from entries group by coalesce(os, 'unknown')
  union all
  select 'browser'::text, coalesce(browser, 'unknown'), count(*)::bigint
    from entries group by coalesce(browser, 'unknown')
  union all
  select 'country'::text, coalesce(country, 'unknown'), count(*)::bigint
    from entries group by coalesce(country, 'unknown')
  union all
  select 'locale'::text, coalesce(locale, 'unknown'), count(*)::bigint
    from entries group by coalesce(locale, 'unknown')
  union all
  select 'campaign'::text, utm_campaign, count(*)::bigint
    from entries where utm_campaign is not null group by utm_campaign;
$$;

grant select on public.backoffice_visitor_daily to authenticated;

revoke execute on function public.backoffice_top_pages(date, date, int) from public;
grant execute on function public.backoffice_top_pages(date, date, int) to authenticated;

revoke execute on function public.backoffice_entry_facets(date, date) from public;
grant execute on function public.backoffice_entry_facets(date, date) to authenticated;

-- Pengunjung unik satu periode tidak bisa didapat dengan menjumlahkan angka
-- harian: orang yang datang Senin dan Rabu akan terhitung dua kali. Jadi
-- totalnya dihitung sekali jalan di sini.
--
-- `security invoker` (bawaan fungsi SQL): RLS tetap berlaku, pemanggil yang
-- tidak terdaftar di `backoffice_users` mendapat nol.
create or replace function public.backoffice_visitor_totals(
  from_day date,
  to_day date
)
returns table (
  views bigint,
  visitors bigint,
  sessions bigint,
  new_visitors bigint
)
language sql
stable
as $$
  select
    count(*)::bigint,
    count(distinct visitor_id)::bigint,
    count(distinct session_id)::bigint,
    (count(distinct visitor_id) filter (where is_new_visitor))::bigint
  from public.page_views
  where (created_at at time zone 'Asia/Makassar')::date between from_day and to_day;
$$;

revoke execute on function public.backoffice_visitor_totals(date, date) from public;
grant execute on function public.backoffice_visitor_totals(date, date) to authenticated;
