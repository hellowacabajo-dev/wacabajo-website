import Link from "next/link";

import { DoodleSprout } from "@/components/Doodles";
import { Logo } from "@/components/Logo";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n/config";
import { getUi } from "@/lib/i18n/ui";
import { getMainNav, getSiteDescription, siteConfig } from "@/lib/site";

export function SiteFooter({ locale }: { locale: Locale }) {
  const mainNav = getMainNav(locale);
  const ui = getUi(locale);

  return (
    <footer className="relative overflow-hidden bg-forest-950 text-cream-50">
      {/* Tunas besar sebagai aksen sudut — dekoratif. */}
      <DoodleSprout
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -bottom-12 w-56 text-cream-50/[0.07]"
      />

      <Container className="relative py-16">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <Logo as="plain" className="text-cream-50" />
            <p className="mt-4 text-sm leading-relaxed text-cream-300">
              {getSiteDescription(locale)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm sm:gap-10">
            <div>
              <p className="mb-4 text-xs tracking-[0.22em] text-gold-300 uppercase">
                {ui.footer.explore}
              </p>
              <ul className="space-y-1">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-flex min-h-11 items-center text-cream-200 transition-colors hover:text-gold-300"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-4 text-xs tracking-[0.22em] text-gold-300 uppercase">
                {ui.footer.connect}
              </p>
              <ul className="space-y-1">
                <li>
                  <a
                    href={siteConfig.social.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center text-cream-200 transition-colors hover:text-gold-300"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  {/* `break-words` tidak cukup: alamat email tidak punya
                      spasi, jadi ia tetap meluber ~5px di 375px. `anywhere`
                      mengizinkan patah di tengah kata. */}
                  <a
                    href={`mailto:${siteConfig.social.email}`}
                    className="inline-flex min-h-11 items-center [overflow-wrap:anywhere] text-cream-200 transition-colors hover:text-gold-300"
                  >
                    {siteConfig.social.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-cream-50/15 pt-8 text-xs text-cream-300 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. {ui.footer.location}
          </p>
          <p className="font-serif text-sm italic">{siteConfig.tagline}</p>
        </div>
      </Container>
    </footer>
  );
}
