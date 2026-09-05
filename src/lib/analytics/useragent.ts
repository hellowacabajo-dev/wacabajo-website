/**
 * Pembacaan user agent seadanya: cukup untuk membedakan ponsel dari desktop
 * dan menyaring bot. Sengaja tidak memakai pustaka — daftar aturan sepanjang
 * ini sudah menjawab 99% lalu lintas situs sekecil ini, dan setiap
 * ketidaktepatannya tidak mengubah keputusan apa pun yang diambil tim.
 */

export type Device = "mobile" | "tablet" | "desktop";

/**
 * Crawler, uptime monitor, dan pengambil pratinjau tautan (WhatsApp, Slack)
 * tidak boleh ikut terhitung: satu unggahan Instagram bisa memicu puluhan
 * kunjungan pratinjau yang tidak pernah dilihat manusia.
 */
const botPattern =
  /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegram|discord|slack|preview|monitor|headless|lighthouse|pingdom|curl|wget|python-requests|axios|node-fetch|semrush|ahrefs|dataprovider|phantom/i;

export function isBot(userAgent: string): boolean {
  return userAgent === "" || botPattern.test(userAgent);
}

export function getDevice(userAgent: string): Device {
  if (/iPad|Tablet|PlayBook|Silk/i.test(userAgent)) return "tablet";
  // Android tanpa "Mobile" di UA-nya adalah tablet — itu aturan resmi Google.
  if (/Android/i.test(userAgent) && !/Mobile/i.test(userAgent)) return "tablet";
  if (/Mobi|iPhone|iPod|Windows Phone|Opera Mini/i.test(userAgent)) {
    return "mobile";
  }
  return "desktop";
}

export function getOs(userAgent: string): string {
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "ios";
  if (/Android/i.test(userAgent)) return "android";
  if (/Windows/i.test(userAgent)) return "windows";
  if (/Mac OS X|Macintosh/i.test(userAgent)) return "macos";
  if (/CrOS/i.test(userAgent)) return "chromeos";
  if (/Linux/i.test(userAgent)) return "linux";
  return "unknown";
}

/** Urutannya penting: Chrome ada di UA Edge, Safari ada di UA hampir semua. */
export function getBrowser(userAgent: string): string {
  if (/Edg\//i.test(userAgent)) return "edge";
  if (/OPR\/|Opera/i.test(userAgent)) return "opera";
  if (/SamsungBrowser/i.test(userAgent)) return "samsung";
  if (/FBAV|FBAN|Instagram/i.test(userAgent)) return "in-app";
  if (/Firefox\//i.test(userAgent)) return "firefox";
  if (/Chrome\/|CriOS/i.test(userAgent)) return "chrome";
  if (/Safari\//i.test(userAgent)) return "safari";
  return "unknown";
}
