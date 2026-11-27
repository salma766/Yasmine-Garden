// Core i18n configuration shared by middleware, server and client code.
// Keep this file free of server-only imports: it runs on the Edge too.

export const locales = ["fr", "en", "it", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const localeInfo: Record<Locale, { code: string; label: string; native: string; dir: "ltr" | "rtl"; og: string }> = {
  fr: { code: "FR", label: "French", native: "Français", dir: "ltr", og: "fr_FR" },
  en: { code: "EN", label: "English", native: "English", dir: "ltr", og: "en_US" },
  it: { code: "IT", label: "Italian", native: "Italiano", dir: "ltr", og: "it_IT" },
  ar: { code: "AR", label: "Arabic", native: "العربية", dir: "rtl", og: "ar_TN" },
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function dirOf(locale: Locale) {
  return localeInfo[locale].dir;
}

// Internal route segments (folder names under app/[locale]) and their
// localized public form. URLs are always served in the localized form.
export const segments = {
  about: { fr: "a-propos", en: "about", it: "chi-siamo", ar: "من-نحن" },
  plants: { fr: "plantes", en: "plants", it: "piante", ar: "النباتات" },
  category: { fr: "categorie", en: "category", it: "categoria", ar: "فئة" },
  landscaping: { fr: "amenagement-paysager", en: "landscaping", it: "progettazione-giardini", ar: "تنسيق-الحدائق" },
  projects: { fr: "projets", en: "projects", it: "progetti", ar: "المشاريع" },
  gallery: { fr: "galerie", en: "gallery", it: "galleria", ar: "المعرض" },
  contact: { fr: "contact", en: "contact", it: "contatti", ar: "اتصل-بنا" },
} as const satisfies Record<string, Record<Locale, string>>;

export type Segment = keyof typeof segments;

/** Map a localized segment back to its internal name (or null). */
export function internalSegment(locale: Locale, localized: string): Segment | null {
  for (const key of Object.keys(segments) as Segment[]) {
    if (segments[key][locale] === localized) return key;
  }
  return null;
}

/** Find an internal segment name from any locale's localized form. */
export function anySegment(localized: string): Segment | null {
  for (const key of Object.keys(segments) as Segment[]) {
    if (key === localized) return key;
    for (const l of locales) if (segments[key][l] === localized) return key;
  }
  return null;
}

export type RouteName =
  | "home"
  | "about"
  | "plants"
  | "plantCategory"
  | "product"
  | "landscaping"
  | "service"
  | "projects"
  | "project"
  | "gallery"
  | "contact";

/** Build a localized public path, e.g. href("ar", "product", "zaytoun"). */
export function href(locale: Locale, route: RouteName, slug?: string | null): string {
  const s = (seg: Segment) => segments[seg][locale];
  const enc = (v: string) => encodeURIComponent(v);
  switch (route) {
    case "home":
      return `/${locale}`;
    case "about":
      return `/${locale}/${enc(s("about"))}`;
    case "plants":
      return `/${locale}/${enc(s("plants"))}`;
    case "plantCategory":
      return `/${locale}/${enc(s("plants"))}/${enc(s("category"))}/${enc(slug ?? "")}`;
    case "product":
      return `/${locale}/${enc(s("plants"))}/${enc(slug ?? "")}`;
    case "landscaping":
      return `/${locale}/${enc(s("landscaping"))}`;
    case "service":
      return `/${locale}/${enc(s("landscaping"))}/${enc(slug ?? "")}`;
    case "projects":
      return `/${locale}/${enc(s("projects"))}`;
    case "project":
      return `/${locale}/${enc(s("projects"))}/${enc(slug ?? "")}`;
    case "gallery":
      return `/${locale}/${enc(s("gallery"))}`;
    case "contact":
      return `/${locale}/${enc(s("contact"))}`;
  }
}

/** Alternate URL for each language; null when no translation exists. */
export type Alternates = Record<Locale, string | null>;

export function staticAlternates(route: RouteName): Alternates {
  return Object.fromEntries(locales.map((l) => [l, href(l, route)])) as Alternates;
}

export function slugify(input: string, locale: Locale): string {
  const base = input.trim().toLowerCase();
  if (locale === "ar") {
    return base
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }
  return base
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
