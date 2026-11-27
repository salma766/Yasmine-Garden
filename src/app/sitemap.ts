import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { href, locales, type Locale, type RouteName } from "@/lib/i18n";
import { absolute } from "@/lib/site";

export const dynamic = "force-dynamic";

type Tr = { locale: string; slug: string | null; status: string; updatedAt: Date };

function entry(urls: Partial<Record<Locale, string>>, lastModified: Date, priority: number): MetadataRoute.Sitemap {
  const languages: Record<string, string> = {};
  for (const l of locales) if (urls[l]) languages[l] = absolute(urls[l]!);
  if (urls.fr) languages["x-default"] = absolute(urls.fr);
  // One <url> per language, each listing all its alternates (hreflang).
  return locales
    .filter((l) => urls[l])
    .map((l) => ({ url: absolute(urls[l]!), lastModified, priority, alternates: { languages } }));
}

function fromTranslations(translations: Tr[], route: RouteName, priority: number) {
  const urls: Partial<Record<Locale, string>> = {};
  let last = new Date(0);
  for (const tr of translations) {
    if (tr.status !== "PUBLISHED" || !tr.slug) continue;
    urls[tr.locale as Locale] = href(tr.locale as Locale, route, tr.slug);
    if (tr.updatedAt > last) last = tr.updatedAt;
  }
  return entry(urls, last, priority);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: [RouteName, number][] = [
    ["home", 1],
    ["about", 0.7],
    ["plants", 0.9],
    ["landscaping", 0.9],
    ["projects", 0.8],
    ["gallery", 0.6],
    ["contact", 0.7],
  ];
  const out: MetadataRoute.Sitemap = [];
  for (const [route, priority] of staticRoutes) {
    out.push(...entry(Object.fromEntries(locales.map((l) => [l, href(l, route)])), now, priority));
  }
  const select = { translations: { select: { locale: true, slug: true, status: true, updatedAt: true } } };
  const [cats, products, services, projects] = await Promise.all([
    prisma.productCategory.findMany({ where: { published: true }, select }),
    prisma.product.findMany({ where: { published: true }, select }),
    prisma.service.findMany({ where: { published: true }, select }),
    prisma.project.findMany({ where: { published: true }, select }),
  ]);
  for (const c of cats) out.push(...fromTranslations(c.translations, "plantCategory", 0.7));
  for (const p of products) out.push(...fromTranslations(p.translations, "product", 0.6));
  for (const s of services) out.push(...fromTranslations(s.translations, "service", 0.7));
  for (const p of projects) out.push(...fromTranslations(p.translations, "project", 0.6));
  return out;
}
