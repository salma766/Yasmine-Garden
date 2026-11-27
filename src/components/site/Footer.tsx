import Link from "next/link";
import type { Messages } from "@/messages/fr";
import { href, type Locale } from "@/lib/i18n";
import { navItems } from "./Header";
import { Logo } from "./Logo";
import { ClockIcon, FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/Icons";

export function Footer({
  locale,
  t,
  siteName,
  logoUrl,
  footerText,
  address,
  hours,
  phones,
  email,
  facebookUrl,
  instagramUrl,
}: {
  locale: Locale;
  t: Messages;
  siteName: string;
  logoUrl?: string | null;
  footerText?: string | null;
  address?: string | null;
  hours?: string | null;
  phones: string[];
  email?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
}) {
  return (
    <footer className="mt-24 bg-forest-950 text-white/80">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Logo href={href(locale, "home")} logoUrl={logoUrl} name={siteName} alt={t.a11y.logoAlt} light />
          {footerText && <p className="mt-4 text-sm leading-relaxed text-white/70">{footerText}</p>}
          {(facebookUrl || instagramUrl) && (
            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/50">{t.footer.follow}</p>
              <div className="flex gap-2">
                {facebookUrl && (
                  <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="rounded-full bg-white/10 p-2.5 hover:bg-white/20">
                    <FacebookIcon width={18} height={18} />
                  </a>
                )}
                {instagramUrl && (
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="rounded-full bg-white/10 p-2.5 hover:bg-white/20">
                    <InstagramIcon width={18} height={18} />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">{t.footer.quickLinks}</h2>
          <ul className="space-y-2 text-sm">
            {navItems(locale, t).map((it) => (
              <li key={it.href}>
                <Link href={it.href} className="hover:text-white">
                  {it.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">{t.footer.contact}</h2>
          <ul className="grid gap-4 text-sm sm:grid-cols-2">
            {address && (
              <li className="flex gap-3">
                <PinIcon className="mt-0.5 shrink-0 text-sage-300" />
                <span className="whitespace-pre-line">{address}</span>
              </li>
            )}
            {hours && (
              <li className="flex gap-3">
                <ClockIcon className="mt-0.5 shrink-0 text-sage-300" />
                <span>{hours}</span>
              </li>
            )}
            {phones.length > 0 && (
              <li className="flex gap-3">
                <PhoneIcon className="mt-0.5 shrink-0 text-sage-300" />
                <span className="flex flex-col gap-1">
                  {phones.map((p) => (
                    <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="hover:text-white" dir="ltr">
                      {p}
                    </a>
                  ))}
                </span>
              </li>
            )}
            {email && (
              <li className="flex gap-3">
                <MailIcon className="mt-0.5 shrink-0 text-sage-300" />
                <a href={`mailto:${email}`} className="hover:text-white" dir="ltr">
                  {email}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteName}. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
