"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Logo } from "@/components/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { mainNav } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  /**
   * Escape menutup menu mobile — jalur keluar wajib untuk panel yang menutupi
   * konten, dan gratis bagi pengguna keyboard.
   */
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-sm">
      <Container className="flex h-18 items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Navigasi utama" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-foreground-muted transition-colors duration-200 hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:block">
          <ButtonLink href="/#gabung" size="sm">
            Jadi relawan
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-mobile"
          className="-mr-2 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-md text-foreground transition-colors duration-200 hover:bg-surface md:hidden"
        >
          <span className="sr-only">{open ? "Tutup menu" : "Buka menu"}</span>
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? (
              <>
                <path d="M5 5l12 12" />
                <path d="M17 5L5 17" />
              </>
            ) : (
              <>
                <path d="M3 6h16" />
                <path d="M3 11h16" />
                <path d="M3 16h16" />
              </>
            )}
          </svg>
        </button>
      </Container>

      {open ? (
        <div id="menu-mobile" className="border-t border-border md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center rounded-md px-2 text-sm text-foreground-muted transition-colors duration-200 hover:bg-surface hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <ButtonLink
              href="/#gabung"
              className="mt-3 self-start"
              onClick={() => setOpen(false)}
            >
              Jadi relawan
            </ButtonLink>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
