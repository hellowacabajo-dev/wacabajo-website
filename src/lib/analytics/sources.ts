/**
 * Menerjemahkan referrer dan parameter UTM jadi dua kolom yang bisa direkap:
 * `channel` (jalur besar) dan `source` (asal spesifik).
 *
 * Dijalankan di server, bukan di browser, supaya aturannya satu dan bisa
 * diperbaiki tanpa menunggu cache browser pengunjung kedaluwarsa. Nilainya
 * disimpan sebagai kunci netral (`instagram`, `organic_search`), sama seperti
 * `value` opsi survei — labelnya baru dipasang saat ditampilkan.
 */

export type Channel =
  | "direct"
  | "organic_search"
  | "social"
  | "referral"
  | "campaign";

/** Urutannya berarti: yang pertama cocok yang dipakai. */
const knownHosts: Array<{ test: RegExp; source: string; channel: Channel }> = [
  // Media sosial. `l.instagram.com` dan `lm.facebook.com` ikut tertangkap
  // lewat `(^|\.)`— keduanya subdomain pengalih milik platform yang sama.
  { test: /(^|\.)instagram\.com$/, source: "instagram", channel: "social" },
  { test: /(^|\.)facebook\.com$/, source: "facebook", channel: "social" },
  { test: /(^|\.)fb\.(com|me)$/, source: "facebook", channel: "social" },
  { test: /(^|\.)tiktok\.com$/, source: "tiktok", channel: "social" },
  { test: /(^|\.)(x\.com|twitter\.com|t\.co)$/, source: "x", channel: "social" },
  {
    test: /(^|\.)(whatsapp\.com|wa\.me)$/,
    source: "whatsapp",
    channel: "social",
  },
  {
    test: /(^|\.)(youtube\.com|youtu\.be)$/,
    source: "youtube",
    channel: "social",
  },
  {
    test: /(^|\.)(linkedin\.com|lnkd\.in)$/,
    source: "linkedin",
    channel: "social",
  },
  {
    test: /(^|\.)(t\.me|telegram\.(org|me))$/,
    source: "telegram",
    channel: "social",
  },

  // Mesin pencari.
  { test: /(^|\.)google\./, source: "google", channel: "organic_search" },
  { test: /(^|\.)bing\.com$/, source: "bing", channel: "organic_search" },
  {
    test: /(^|\.)duckduckgo\.com$/,
    source: "duckduckgo",
    channel: "organic_search",
  },
  { test: /(^|\.)yahoo\./, source: "yahoo", channel: "organic_search" },
  { test: /(^|\.)yandex\./, source: "yandex", channel: "organic_search" },
];

export type Origin = {
  channel: Channel;
  source: string;
  referrerHost: string | null;
};

/**
 * `selfHosts` diisi host situs sendiri: pengunjung yang berpindah halaman
 * membawa referrer wacabajo.org, dan kalau itu ikut dihitung, "asal
 * pengunjung" jadi didominasi diri sendiri.
 */
export function classifyOrigin(
  referrer: string | null,
  utm: { source?: string | null; medium?: string | null },
  selfHosts: string[],
): Origin {
  const referrerHost = hostOf(referrer);
  const isSelf = referrerHost !== null && selfHosts.includes(referrerHost);
  const host = isSelf ? null : referrerHost;

  // Kampanye menang atas referrer: tautan berlabel `utm_source` memang sengaja
  // ditandai supaya terhitung sebagai kampanye, dari platform mana pun ia
  // akhirnya diklik.
  const utmSource = slug(utm.source);
  if (utmSource) {
    return {
      channel: mediumToChannel(utm.medium) ?? "campaign",
      source: utmSource,
      referrerHost: host,
    };
  }

  if (host === null) return { channel: "direct", source: "direct", referrerHost: null };

  const known = knownHosts.find((entry) => entry.test.test(host));
  if (known) {
    return {
      channel: known.channel,
      source: known.source,
      referrerHost: host,
    };
  }

  return { channel: "referral", source: host, referrerHost: host };
}

function mediumToChannel(medium: string | null | undefined): Channel | null {
  const value = slug(medium);
  if (!value) return null;
  if (value === "social" || value === "sosial") return "social";
  if (value === "organic" || value === "search") return "organic_search";
  if (value === "referral") return "referral";
  return null;
}

function hostOf(referrer: string | null): string | null {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    // `www.` dibuang supaya satu situs tidak terpecah jadi dua baris rekap.
    return host.replace(/^www\./, "") || null;
  } catch {
    return null;
  }
}

/** Kunci yang aman disimpan: huruf kecil, tanpa spasi, dipotong pendek. */
export function slug(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return cleaned === "" ? null : cleaned;
}
