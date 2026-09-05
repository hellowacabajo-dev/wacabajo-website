"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import type { Locale } from "@/lib/i18n/config";

/**
 * Pencatat kunjungan halaman.
 *
 * Sengaja tidak memakai layanan analitik pihak ketiga: datanya tinggal di
 * Supabase milik Waca Bajo sendiri, dan tidak ada satu pun skrip pelacak orang
 * lain yang ikut dimuat di halaman pengunjung.
 *
 * Yang disimpan hanya dua angka acak yang dibuat di browser ini sendiri —
 * tidak ada nama, tidak ada alamat IP, tidak ada apa pun yang bisa
 * menghubungkannya ke satu orang tertentu, dan pengunjung bisa
 * menghapusnya kapan saja lewat "clear site data" browsernya.
 */

const VISITOR_KEY = "wacabajo-vid";
const SESSION_KEY = "wacabajo-sid";

/** Sesi dianggap berakhir setelah 30 menit tanpa membuka halaman. */
const SESSION_IDLE_MS = 30 * 60 * 1000;

/**
 * Penjaga kiriman ganda. Ditaruh di level modul, bukan di `useRef`, karena
 * React Strict Mode di mode dev memasang effect dua kali dengan komponen yang
 * dibuat ulang — ref-nya ikut baru, variabel modul ini tidak.
 */
let lastSentPath: string | null = null;

type Ids = {
  visitorId: string;
  sessionId: string;
  isNewVisitor: boolean;
  isEntry: boolean;
};

export function PageViewTracker({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!shouldTrack()) return;
    if (lastSentPath === pathname) return;
    lastSentPath = pathname;

    const ids = readIds();
    const body = JSON.stringify({
      ...ids,
      path: pathname,
      locale,
      // Hanya berguna di halaman pertama sebuah sesi; di halaman berikutnya
      // referrer-nya selalu situs ini sendiri.
      referrer: ids.isEntry ? document.referrer || null : null,
      ...(ids.isEntry ? readCampaign() : {}),
      viewportWidth: window.innerWidth,
    });

    // `keepalive` supaya kiriman tetap jalan kalau pengunjung langsung menutup
    // tab. Gagalnya diabaikan diam-diam: statistik tidak sepadan dengan error
    // di layar orang yang cuma mau membaca.
    void fetch("/api/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  }, [pathname, locale]);

  return null;
}

/**
 * Kunjungan dari mesin sendiri saat `npm run dev` masuk ke database yang sama
 * dengan produksi. Kalau ikut tercatat, angka di backoffice jadi campuran
 * pengunjung asli dan pekerjaan tim. Untuk menguji pencatatannya, set
 * `NEXT_PUBLIC_TRACK_LOCAL=1` di `.env.local`.
 */
function shouldTrack(): boolean {
  if (typeof window === "undefined") return false;
  if (navigator.webdriver) return false;
  if (process.env.NEXT_PUBLIC_TRACK_LOCAL === "1") return true;
  return !/^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);
}

function readIds(): Ids {
  const now = Date.now();

  const storedVisitor = read(VISITOR_KEY);
  const visitorId = isUuid(storedVisitor) ? storedVisitor : uuid();
  const isNewVisitor = visitorId !== storedVisitor;
  if (isNewVisitor) write(VISITOR_KEY, visitorId);

  let sessionId: string | null = null;
  const storedSession = read(SESSION_KEY);
  if (storedSession) {
    const [id, expiresAt] = storedSession.split("|");
    if (isUuid(id) && Number(expiresAt) > now) sessionId = id;
  }
  const isEntry = sessionId === null;
  sessionId ??= uuid();
  write(SESSION_KEY, `${sessionId}|${now + SESSION_IDLE_MS}`);

  return { visitorId, sessionId, isNewVisitor, isEntry };
}

/** Parameter kampanye dari tautan yang dibagikan (mis. di bio Instagram). */
function readCampaign() {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    utmCampaign: params.get("utm_campaign"),
  };
}

/**
 * localStorage bisa melempar, bukan cuma kosong: mode privat sebagian browser
 * dan setelan "block site data" membuat aksesnya error. Kalau itu terjadi
 * kunjungannya tetap dicatat, hanya saja orangnya terhitung sebagai pengunjung
 * baru setiap kali.
 */
function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Tidak ada yang perlu dilakukan — lihat catatan di `read`.
  }
}

function isUuid(value: string | null): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
}

/** `randomUUID` belum ada di Safari lawas dan di konteks non-HTTPS. */
function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      Number(c) ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))
    ).toString(16),
  );
}
