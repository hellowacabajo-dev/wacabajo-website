"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n/config";
import { getUi } from "@/lib/i18n/ui";
import { getMainNav } from "@/lib/site";

export function SiteHeader({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const mainNav = getMainNav(locale);
  const ui = getUi(locale);

  /**
   * Saat menu mobile terbuka: Escape menutupnya (jalur keluar wajib untuk
   * panel yang menutupi konten), dan halaman di belakangnya dikunci supaya
   * jari yang menggeser menu tidak ikut men-scroll konten di bawahnya.
   */
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-sm">
      <Container className="flex h-18 items-center justify-between gap-6">
        <Logo locale={locale} />

        <nav aria-label={ui.nav.ariaLabel} className="hidden md:block">
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

        <div className="hidden items-center gap-2 md:flex">
          <LocaleSwitcher locale={locale} />
          <ThemeToggle locale={locale} />
          <ButtonLink href="#gabung" size="sm">
            {ui.nav.volunteerCta}
          </ButtonLink>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle locale={locale} />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            className="-mr-2 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-md text-foreground transition-colors duration-200 hover:bg-surface"
          >
            <span className="sr-only">
              {open ? ui.nav.closeMenu : ui.nav.openMenu}
            </span>
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
        </div>
      </Container>

      {open ? (
        <div
          id="menu-mobile"
          className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-border bg-background md:hidden"
        >
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
            <LocaleSwitcher locale={locale} className="mt-3 w-full" />
            <ButtonLink
              href="#gabung"
              className="mt-3"
              onClick={() => setOpen(false)}
            >
              {ui.nav.volunteerCta}
            </ButtonLink>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
