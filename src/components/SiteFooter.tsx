import Link from "next/link";

import { DoodleSprout } from "@/components/Doodles";
import { Logo } from "@/components/Logo";
import { Container } from "@/components/ui/Container";
import { mainNav, siteConfig } from "@/lib/site";

export function SiteFooter() {
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
              {siteConfig.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 text-sm">
            <div>
              <p className="mb-4 text-xs tracking-[0.22em] text-gold-300 uppercase">
                Jelajahi
              </p>
              <ul className="space-y-3">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-cream-200 transition-colors hover:text-gold-300"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-4 text-xs tracking-[0.22em] text-gold-300 uppercase">
                Terhubung
              </p>
              <ul className="space-y-3">
                <li>
                  <a
                    href={siteConfig.social.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cream-200 transition-colors hover:text-gold-300"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${siteConfig.social.email}`}
                    className="text-cream-200 transition-colors hover:text-gold-300"
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
            © {new Date().getFullYear()} {siteConfig.name}. Labuan Bajo, Nusa
            Tenggara Timur.
          </p>
          <p className="font-display text-sm italic">{siteConfig.tagline}</p>
        </div>
      </Container>
    </footer>
  );
}
