/**
 * Nilai yang tersimpan di database berupa kunci netral (`organic_search`,
 * `mobile`) supaya rekapnya tidak tergantung bahasa. Terjemahannya ke bahasa
 * manusia terjadi di sini, satu tempat.
 *
 * Backoffice berbahasa Indonesia saja — ia bukan halaman publik, dan yang
 * memakainya tim Waca Bajo sendiri.
 */

const channels: Record<string, string> = {
  direct: "Langsung",
  organic_search: "Pencarian",
  social: "Media sosial",
  referral: "Tautan situs lain",
  campaign: "Kampanye bertanda",
  unknown: "Tidak diketahui",
};

const sources: Record<string, string> = {
  direct: "Langsung / disimpan",
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  x: "X (Twitter)",
  whatsapp: "WhatsApp",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  telegram: "Telegram",
  google: "Google",
  bing: "Bing",
  duckduckgo: "DuckDuckGo",
  yahoo: "Yahoo",
  yandex: "Yandex",
  unknown: "Tidak diketahui",
};

const devices: Record<string, string> = {
  mobile: "Ponsel",
  tablet: "Tablet",
  desktop: "Komputer",
  unknown: "Tidak diketahui",
};

const operatingSystems: Record<string, string> = {
  ios: "iOS",
  android: "Android",
  windows: "Windows",
  macos: "macOS",
  chromeos: "ChromeOS",
  linux: "Linux",
  unknown: "Tidak diketahui",
};

const browsers: Record<string, string> = {
  chrome: "Chrome",
  safari: "Safari",
  firefox: "Firefox",
  edge: "Edge",
  opera: "Opera",
  samsung: "Samsung Internet",
  "in-app": "Peramban dalam aplikasi",
  unknown: "Tidak diketahui",
};

const localeNames: Record<string, string> = {
  id: "Indonesia",
  en: "Inggris",
  unknown: "Tidak diketahui",
};

const countryNames = new Intl.DisplayNames(["id"], { type: "region" });

export type Dimension =
  | "channel"
  | "source"
  | "referrer"
  | "device"
  | "os"
  | "browser"
  | "country"
  | "locale"
  | "campaign";

/** Nilai yang tidak dikenal ditampilkan apa adanya — mis. host situs perujuk. */
export function labelFor(dimension: Dimension, value: string): string {
  switch (dimension) {
    case "channel":
      return channels[value] ?? value;
    case "source":
      return sources[value] ?? value;
    case "device":
      return devices[value] ?? value;
    case "os":
      return operatingSystems[value] ?? value;
    case "browser":
      return browsers[value] ?? value;
    case "locale":
      return localeNames[value] ?? value;
    case "country":
      return countryLabel(value);
    default:
      return value;
  }
}

function countryLabel(code: string): string {
  if (code === "unknown") return "Tidak diketahui";
  try {
    return countryNames.of(code) ?? code;
  } catch {
    return code;
  }
}

const numbers = new Intl.NumberFormat("id-ID");

export function formatNumber(value: number): string {
  return numbers.format(value);
}

export function formatPercent(part: number, whole: number): string {
  if (whole === 0) return "0%";
  return `${Math.round((part / whole) * 100)}%`;
}
