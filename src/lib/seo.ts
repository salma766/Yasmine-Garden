import "server-only";
import type { Metadata } from "next";
import { defaultLocale, localeInfo, locales, type Alternates, type Locale } from "./i18n";
import { absolute } from "./site";
import { getMessages } from "./messages";
import { getSettings } from "./content";

/**
 * Language-aware metadata: localized title/description, canonical URL of the
 * current language, hreflang alternates (only for languages where a
 * translation exists) and x-default pointing to French.
 */
export async function buildMetadata(opts: {
  locale: Locale;
  alternates: Alternates;
  title?: string | null;
  description?: string | null;
  image?: string | null;
  noindex?: boolean;
}): Promise<Metadata> {
  const { locale, alternates } = opts;
  const [t, settings] = await Promise.all([getMessages(locale), getSettings(locale)]);
  const siteName = settings.tr?.siteName || t.meta.siteName;
  const title = opts.title ? `${opts.title} | ${siteName}` : settings.tr?.seoTitle || t.meta.defaultTitle;
  const description = opts.description || settings.tr?.seoDescription || t.meta.defaultDescription;

  const languages: Record<string, string> = {};
  for (const l of locales) if (alternates[l]) languages[l] = absolute(alternates[l]!);
  const xDefault = alternates[defaultLocale] ?? locales.map((l) => alternates[l]).find(Boolean);
  if (xDefault) languages["x-default"] = absolute(xDefault);

  const canonical = alternates[locale] ? absolute(alternates[locale]!) : undefined;
  const image = opts.image ? (opts.image.startsWith("http") ? opts.image : absolute(opts.image)) : undefined;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      locale: localeInfo[locale].og,
      alternateLocale: locales.filter((l) => l !== locale && alternates[l]).map((l) => localeInfo[l].og),
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: { card: image ? "summary_large_image" : "summary", title, description },
    robots: opts.noindex ? { index: false, follow: false } : undefined,
    // Google Search Console ownership tag (public value). Can be overridden with GOOGLE_SITE_VERIFICATION.
    verification: { google: process.env.GOOGLE_SITE_VERIFICATION || "N1ID25OGzb13rLVrun3IpKjEYQl4KGSF3GAEt_0ziM8" },
    icons: settings.base?.faviconUrl ? { icon: settings.base.faviconUrl } : undefined,
  };
}
