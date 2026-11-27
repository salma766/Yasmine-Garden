import { absolute } from "@/lib/site";
import type { Locale } from "@/lib/i18n";

type Settings = {
  base: {
    logoUrl: string | null;
    phones: string[];
    email: string | null;
    mapLink: string | null;
    facebookUrl: string | null;
    instagramUrl: string | null;
  } | null;
  tr?: { siteName: string | null } | null;
};

const abs = (u: string) => (u.startsWith("http") ? u : absolute(u));

/**
 * Structured data for Google: the nursery as a local business (name variants,
 * address, opening hours, phones) plus the WebSite entity used for the site
 * name shown in search results.
 */
export function BusinessJsonLd({ locale, settings }: { locale: Locale; settings: Settings }) {
  const s = settings.base;
  const home = absolute(`/${locale}`);
  const name = settings.tr?.siteName || "Pépinière Yasmine Gardens";
  const alternateName = [
    "Yasmine Gardens",
    "Yasmine Garden",
    "Pépinière Yasmine",
    "Pépinière Yasmine Garden",
    "Pépinière Yasmine Gardens Tunisie",
    "Yasmine Gardens Nursery",
    "مشتل ياسمين",
    "مشتل ياسمين غاردنز",
  ].filter((n) => n !== name);
  const sameAs = [s?.facebookUrl, s?.instagramUrl].filter(Boolean);

  const business = {
    "@context": "https://schema.org",
    "@type": ["GardenStore", "LocalBusiness"],
    "@id": absolute("/#business"),
    name,
    alternateName,
    url: home,
    image: abs(s?.logoUrl || "/images/placeholders/hero.svg"),
    ...(s?.logoUrl ? { logo: abs(s.logoUrl) } : {}),
    telephone: s?.phones?.[0],
    ...(s?.email ? { email: s.email } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: "Route de Tunis Km 18",
      addressLocality: "Bouargoub",
      postalCode: "8040",
      addressRegion: "Nabeul",
      addressCountry: "TN",
    },
    ...(s?.mapLink ? { hasMap: s.mapLink } : {}),
    areaServed: { "@type": "Country", name: "Tunisie" },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "09:00",
        closes: "17:00",
      },
    ],
    contactPoint: (s?.phones ?? []).map((telephone) => ({ "@type": "ContactPoint", telephone, contactType: "customer service" })),
    ...(sameAs.length ? { sameAs } : {}),
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absolute("/#website"),
    name,
    alternateName: ["Yasmine Gardens", "Pépinière Yasmine Gardens"].filter((n) => n !== name),
    url: absolute("/"),
    inLanguage: locale,
    publisher: { "@id": absolute("/#business") },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify([business, website]).replace(/</g, "\\u003c") }}
    />
  );
}
