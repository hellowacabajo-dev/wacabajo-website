-- Migrasi: book_source dari single-select (text) jadi checkbox (text[]).
-- Jalankan sekali di SQL Editor Supabase, SEBELUM men-deploy kode yang
-- mengirim book_source sebagai array. Aman dijalankan ulang karena hanya
-- mengubah kolom yang sudah bertipe text menjadi text[] sekali saja —
-- menjalankannya dua kali akan gagal di baris "alter column ... type"
-- (kolom sudah text[]), jadi tidak akan menimpa data dua kali.

alter table public.survey_responses
  alter column book_source drop default;

alter table public.survey_responses
  alter column book_source type text[]
  using case
    when book_source is null or btrim(book_source) = '' then '{}'::text[]
    else array[book_source]
  end;

alter table public.survey_responses
  alter column book_source set default '{}';

alter table public.survey_responses
  alter column book_source set not null;
