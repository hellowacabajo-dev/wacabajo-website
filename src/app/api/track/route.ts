import { NextResponse, type NextRequest } from "next/server";

import { classifyOrigin, slug } from "@/lib/analytics/sources";
import {
  getBrowser,
  getDevice,
  getOs,
  isBot,
} from "@/lib/analytics/useragent";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

/**
 * Pencatat kunjungan halaman.
 *
 * Dipisah jadi endpoint sendiri (bukan server action) karena yang memanggilnya
 * `fetch` dengan `keepalive` dari browser — pengunjung yang langsung menutup
 * tab tetap tercatat, dan halamannya tidak perlu menunggu balasan.
 *
 * Yang ditentukan server, bukan browser: klasifikasi asal kunjungan, jenis
 * perangkat, dan negara. Browser cuma menyetor bahan mentahnya. Dengan begitu
 * aturan rekap bisa diperbaiki kapan saja tanpa menunggu cache browser
 * pengunjung berganti, dan angka yang masuk tidak bisa dikarang dari sisi
 * klien.
 */

/** Jawaban selalu 204, bahkan saat payload-nya ditolak. Pengunjung tidak perlu
 *  tahu apa pun soal ini, dan bot tidak perlu diberi umpan balik. */
const noContent = new NextResponse(null, { status: 204 });

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Payload = {
  visitorId?: unknown;
  sessionId?: unknown;
  path?: unknown;
  locale?: unknown;
  referrer?: unknown;
  isEntry?: unknown;
  isNewVisitor?: unknown;
  utmSource?: unknown;
  utmMedium?: unknown;
  utmCampaign?: unknown;
  viewportWidth?: unknown;
};

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) return noContent;

  const userAgent = request.headers.get("user-agent") ?? "";
  if (isBot(userAgent)) return noContent;

  let payload: Payload;
  try {
    payload = (await request.json()) as Payload;
  } catch {
    return noContent;
  }

  const visitorId = asUuid(payload.visitorId);
  const sessionId = asUuid(payload.sessionId);
  const path = asPath(payload.path);
  if (!visitorId || !sessionId || !path) return noContent;

  const isEntry = payload.isEntry === true;
  const origin = isEntry
    ? classifyOrigin(
        asText(payload.referrer, 500),
        { source: asText(payload.utmSource, 100), medium: asText(payload.utmMedium, 100) },
        selfHosts(request),
      )
    : null;

  const { error } = await getSupabase().from("page_views").insert({
    visitor_id: visitorId,
    session_id: sessionId,
    path,
    locale: payload.locale === "id" || payload.locale === "en" ? payload.locale : null,
    is_entry: isEntry,
    is_new_visitor: payload.isNewVisitor === true,
    referrer_host: origin?.referrerHost ?? null,
    channel: origin?.channel ?? null,
    source: origin?.source ?? null,
    utm_source: isEntry ? slug(asText(payload.utmSource, 100)) : null,
    utm_medium: isEntry ? slug(asText(payload.utmMedium, 100)) : null,
    utm_campaign: isEntry ? slug(asText(payload.utmCampaign, 100)) : null,
    device: getDevice(userAgent),
    browser: getBrowser(userAgent),
    os: getOs(userAgent),
    country: country(request),
    viewport_width: asWidth(payload.viewportWidth),
  });

  // Kunjungan yang gagal tercatat tidak boleh terasa oleh pengunjung, tapi
  // harus terlihat di log server supaya tidak diam-diam kosong berminggu.
  if (error) console.error("Gagal mencatat kunjungan:", error.message);

  return noContent;
}

/** Host situs sendiri — referrer dari sini berarti pindah halaman, bukan asal. */
function selfHosts(request: NextRequest): string[] {
  const hosts = [request.nextUrl.hostname];
  const forwarded = request.headers.get("host");
  if (forwarded) hosts.push(forwarded.split(":")[0]);
  return hosts.map((host) => host.toLowerCase().replace(/^www\./, ""));
}

/** Vercel menyisipkan kode negara di header; di lokal header ini tidak ada. */
function country(request: NextRequest): string | null {
  const value =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry");
  return value && /^[A-Za-z]{2}$/.test(value) ? value.toUpperCase() : null;
}

function asUuid(value: unknown): string | null {
  return typeof value === "string" && uuidPattern.test(value) ? value : null;
}

/** Path saja, tanpa query string: di sana kadang menempel token atau nama. */
function asPath(value: unknown): string | null {
  if (typeof value !== "string" || !value.startsWith("/")) return null;
  const clean = value.split("?")[0].split("#")[0];
  return clean.length <= 300 ? clean : null;
}

function asText(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().slice(0, max);
  return trimmed === "" ? null : trimmed;
}

function asWidth(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value > 0 && value < 10000
    ? Math.round(value)
    : null;
}
