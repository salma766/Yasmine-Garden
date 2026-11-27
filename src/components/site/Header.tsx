import Link from "next/link";
import type { Messages } from "@/messages/fr";
import { href, type Locale } from "@/lib/i18n";
import { DesktopNav, LanguageSwitcher, MobileNav } from "./LocaleNav";
import { Logo } from "./Logo";
import { ClockIcon, MailIcon, PhoneIcon } from "@/components/Icons";

export function navItems(locale: Locale, t: Messages) {
  return [
    { href: href(locale, "home"), label: t.nav.home },
    { href: href(locale, "about"), label: t.nav.about },
    { href: href(locale, "plants"), label: t.nav.plants },
    { href: href(locale, "landscaping"), label: t.nav.landscaping },
    { href: href(locale, "projects"), label: t.nav.projects },
    { href: href(locale, "gallery"), label: t.nav.gallery },
    { href: href(locale, "contact"), label: t.nav.contact },
  ];
}

export function Header({
  locale,
  t,
  siteName,
  logoUrl,
  phones,
  email,
  hours,
}: {
  locale: Locale;
  t: Messages;
  siteName: string;
  logoUrl?: string | null;
  phones: string[];
  email?: string | null;
  hours?: string | null;
}) {
  const items = navItems(locale, t);
  const quote = { href: href(locale, "contact"), label: t.nav.quote };
  return (
    <header className="sticky top-0 z-40">
      <div className="hidden bg-forest-900 text-[0.8rem] text-white/85 md:block">
        <div className="container-page flex h-9 items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            {phones[0] && (
              <a href={`tel:${phones[0].replace(/\s/g, "")}`} className="flex items-center gap-1.5 hover:text-white">
                <PhoneIcon width={14} height={14} />
                <span dir="ltr">{phones[0]}</span>
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} className="flex items-center gap-1.5 hover:text-white">
                <MailIcon width={14} height={14} />
                <span dir="ltr">{email}</span>
              </a>
            )}
          </div>
          {hours && (
            <span className="flex items-center gap-1.5">
              <ClockIcon width={14} height={14} />
              {hours}
            </span>
          )}
        </div>
      </div>
      <div className="border-b border-sand-200/80 bg-cream-50/90 backdrop-blur">
        <div className="container-page flex h-[72px] items-center justify-between gap-3">
          <Logo href={href(locale, "home")} logoUrl={logoUrl} name={siteName} alt={t.a11y.logoAlt} />
          <DesktopNav items={items} />
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <LanguageSwitcher locale={locale} label={t.a11y.language} unavailable={t.a11y.unavailable} />
            <Link href={quote.href} className="btn btn-accent hidden whitespace-nowrap !py-2.5 2xl:inline-flex">
              {quote.label}
            </Link>
            <MobileNav items={items} openLabel={t.a11y.openMenu} closeLabel={t.a11y.closeMenu} quote={quote} phone={phones[0]} />
          </div>
        </div>
      </div>
    </header>
  );
}
