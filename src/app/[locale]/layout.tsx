import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Cairo, Inter, Playfair_Display } from "next/font/google";
import "../globals.css";
import { dirOf, isLocale, type Locale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { getSettings } from "@/lib/content";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AlternatesProvider } from "@/components/site/LocaleNav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo", display: "swap" });

export const dynamic = "force-dynamic";

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const [t, settings] = await Promise.all([getMessages(locale), getSettings(locale)]);
  const s = settings.base;
  const tr = settings.tr;
  const siteName = tr?.siteName || t.meta.siteName;

  return (
    <html lang={locale} dir={dirOf(locale)} className={`${inter.variable} ${playfair.variable} ${cairo.variable}`}>
      <body className="min-h-screen">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">
          {t.a11y.skip}
        </a>
        <AlternatesProvider>
          <Header locale={locale} t={t} siteName={siteName} logoUrl={s?.logoUrl} phones={s?.phones ?? []} email={s?.email} hours={tr?.openingHours} />
          <main id="main">{children}</main>
          <Footer
            locale={locale}
            t={t}
            siteName={siteName}
            logoUrl={s?.logoUrl}
            footerText={tr?.footerText}
            address={tr?.address}
            hours={tr?.openingHours}
            phones={s?.phones ?? []}
            email={s?.email}
            facebookUrl={s?.facebookUrl}
            instagramUrl={s?.instagramUrl}
          />
        </AlternatesProvider>
      </body>
    </html>
  );
}
