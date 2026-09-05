"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [
  { href: "/backoffice", label: "Ringkasan" },
  { href: "/backoffice/pengunjung", label: "Pengunjung" },
  { href: "/backoffice/survei", label: "Survei" },
] as const;

/**
 * Navigasi backoffice. Satu-satunya alasan komponen ini berjalan di klien:
 * layout server tidak tahu path yang sedang dibuka, sementara tab yang aktif
 * perlu ditandai.
 *
 * "Ringkasan" cocok persis, sisanya cocok berawalan — supaya
 * `/backoffice/survei/<id>` tetap menyorot tab Survei.
 */
export function BackofficeNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Bagian backoffice"
      className="-mb-px flex gap-1 overflow-x-auto"
    >
      {links.map((link) => {
        const isActive =
          link.href === "/backoffice"
            ? pathname === link.href
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "inline-flex h-11 shrink-0 items-center border-b-2 px-4 font-sans text-sm transition-colors duration-200",
              isActive
                ? "border-primary text-foreground"
                : "border-transparent text-foreground-muted hover:text-foreground",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
