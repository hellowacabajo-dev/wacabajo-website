import { NextResponse } from "next/server";

import { requireBackofficeSession } from "@/lib/backoffice/auth";
import { today } from "@/lib/backoffice/dates";
import { describeAnswer, fetchResponses } from "@/lib/backoffice/survey";
import {
  applyFilters,
  hasFilters,
  resolveFilters,
} from "@/lib/backoffice/survey-filters";
import { allQuestions } from "@/lib/survey/questions";

/**
 * Ekspor seluruh jawaban survei sebagai CSV.
 *
 * Isinya jawaban yang sudah diterjemahkan ke kalimat ("Perpustakaan sekolah",
 * bukan `public_library`), karena yang membukanya orang, bukan program. Kalau
 * suatu saat perlu data mentahnya, Table Editor Supabase sudah punya tombol
 * Export sendiri.
 *
 * Saringan di halaman survei ikut terbawa lewat query string yang sama.
 * Layar yang sedang menampilkan jawaban guru saja lalu mengunduh seluruh
 * jawaban adalah cara paling mudah menaruh angka yang salah di laporan; nama
 * berkasnya diberi akhiran "tersaring" supaya tidak tertukar di folder unduhan.
 *
 * Alamatnya `/api/backoffice/ekspor`, bukan `/backoffice/ekspor`: unduhan
 * harus dibuka lewat `<a>` biasa (Link milik Next akan menavigasinya sebagai
 * halaman dan file-nya tidak pernah tersimpan), dan menaruhnya di bawah
 * `/api` membuat itu jelas bagi pembaca maupun linter. Penjagaannya sama:
 * `src/proxy.ts` memulangkan yang belum login, dan
 * `requireBackofficeSession` di bawah jadi lapis keduanya.
 */
export async function GET(request: Request) {
  const { supabase } = await requireBackofficeSession();

  const params = Object.fromEntries(new URL(request.url).searchParams);
  const filters = resolveFilters(params);
  const { rows: allRows } = await fetchResponses(supabase);
  const rows = applyFilters(allRows, filters);

  const header = [
    "id",
    "waktu",
    "bahasa",
    ...allQuestions.map((question) => question.label.id),
  ];

  const lines = [toCsvRow(header)];

  for (const row of rows) {
    lines.push(
      toCsvRow([
        row.id,
        row.created_at,
        row.locale,
        ...allQuestions.map((question) => describeAnswer(question, row)),
      ]),
    );
  }

  // BOM di depan supaya Excel di Windows membaca CSV ini sebagai UTF-8 —
  // tanpa itu, "é" dan tanda kutip keriting jadi karakter rusak.
  const csv = `﻿${lines.join("\r\n")}\r\n`;

  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="survei-wacabajo-${today()}${
        hasFilters(filters) ? "-tersaring" : ""
      }.csv"`,
      // Isinya jawaban orang — jangan sampai tersimpan di cache mana pun.
      "cache-control": "no-store",
    },
  });
}

/**
 * Nilai yang diawali `=`, `+`, `-`, atau `@` diberi tanda kutip tunggal di
 * depan. Tanpa itu, jawaban seperti "=1+1" dieksekusi Excel sebagai rumus —
 * dan itu jalan masuk yang sudah lama dipakai untuk menyerang orang yang
 * membuka CSV dari luar.
 */
function toCsvRow(values: string[]): string {
  return values.map(escapeCell).join(",");
}

function escapeCell(value: string): string {
  const text = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${text.replace(/"/g, '""')}"`;
}
