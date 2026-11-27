import "server-only";
import { cache } from "react";
import { prisma } from "./db";
import { getSession } from "./auth";
import { href, locales, type Alternates, type Locale, type RouteName } from "./i18n";

type Tr = { locale: string; status: string; [k: string]: unknown };
type WithTr<T> = T & { translations: Tr[] };

/** Drafts are visible only to a signed-in administrator using ?preview=1. */
export async function isPreview(searchParams?: Promise<Record<string, string | string[] | undefined>>) {
  const sp = searchParams ? await searchParams : {};
  if (sp.preview !== "1") return false;
  return !!(await getSession());
}

function visible(tr: Tr | undefined, preview: boolean) {
  if (!tr) return false;
  return preview || tr.status === "PUBLISHED";
}

export function pickTr<T extends Tr>(translations: T[], locale: Locale, preview = false): T | undefined {
  const tr = translations.find((t) => t.locale === locale);
  return visible(tr, preview) ? tr : undefined;
}

/** Image to use for a language: the translation's own image, else the shared one. */
export function imageFor(base: { image?: string | null }, tr?: object | null) {
  const own = tr && "image" in tr ? (tr as { image?: unknown }).image : undefined;
  return (typeof own === "string" && own) || base.image || null;
}

function localize<T>(items: WithTr<T>[], locale: Locale, preview: boolean) {
  const out: { item: WithTr<T>; tr: Tr & Record<string, string | null> }[] = [];
  for (const item of items) {
    const tr = pickTr(item.translations, locale, preview);
    if (tr) out.push({ item, tr: tr as Tr & Record<string, string | null> });
  }
  return out;
}

export function alternatesFor(translations: Tr[], route: RouteName, preview = false): Alternates {
  return Object.fromEntries(
    locales.map((l) => {
      const tr = pickTr(translations, l, preview);
      return [l, tr && typeof tr.slug === "string" && tr.slug ? href(l, route, tr.slug) : null];
    }),
  ) as Alternates;
}

const order = [{ sortOrder: "asc" as const }, { updatedAt: "desc" as const }];
const pub = (preview: boolean) => (preview ? {} : { published: true });

// ---------- Settings ----------
export const getSettings = cache(async (locale: Locale) => {
  const s = await prisma.siteSettings.findUnique({ where: { id: 1 }, include: { translations: true } });
  const tr = s?.translations.find((t) => t.locale === locale && t.status === "PUBLISHED");
  return { base: s, tr };
});

// ---------- Pages ----------
export async function getPage(key: string, locale: Locale, preview = false) {
  const page = await prisma.page.findUnique({ where: { key }, include: { translations: true } });
  if (!page || (!page.published && !preview)) return null;
  const tr = pickTr(page.translations, locale, preview);
  return { page, tr };
}

// ---------- Plant catalogue ----------
export async function listCategories(locale: Locale, preview = false) {
  const rows = await prisma.productCategory.findMany({
    where: pub(preview),
    orderBy: order,
    include: { translations: true, _count: { select: { products: true } } },
  });
  return localize(rows, locale, preview);
}

export async function getCategoryBySlug(locale: Locale, slug: string, preview = false) {
  const tr = await prisma.productCategoryTranslation.findFirst({
    where: { locale, slug, ...(preview ? {} : { status: "PUBLISHED", entity: { published: true } }) },
    include: { entity: { include: { translations: true } } },
  });
  return tr;
}

export async function listProducts(
  locale: Locale,
  opts: { categoryId?: string; featured?: boolean; limit?: number; excludeId?: string } = {},
  preview = false,
) {
  const rows = await prisma.product.findMany({
    where: {
      ...pub(preview),
      ...(opts.categoryId ? { categoryId: opts.categoryId } : {}),
      ...(opts.featured ? { featured: true } : {}),
      ...(opts.excludeId ? { id: { not: opts.excludeId } } : {}),
    },
    orderBy: order,
    include: { translations: true, category: { include: { translations: true } } },
  });
  const list = localize(rows, locale, preview);
  return opts.limit ? list.slice(0, opts.limit) : list;
}

export async function getProductBySlug(locale: Locale, slug: string, preview = false) {
  return prisma.productTranslation.findFirst({
    where: { locale, slug, ...(preview ? {} : { status: "PUBLISHED", entity: { published: true } }) },
    include: { entity: { include: { translations: true, category: { include: { translations: true } } } } },
  });
}

// ---------- Services ----------
export async function listServices(locale: Locale, preview = false, opts: { featured?: boolean; excludeId?: string } = {}) {
  const rows = await prisma.service.findMany({
    where: {
      ...pub(preview),
      ...(opts.featured ? { featured: true } : {}),
      ...(opts.excludeId ? { id: { not: opts.excludeId } } : {}),
    },
    orderBy: order,
    include: { translations: true },
  });
  return localize(rows, locale, preview);
}

export async function getServiceBySlug(locale: Locale, slug: string, preview = false) {
  return prisma.serviceTranslation.findFirst({
    where: { locale, slug, ...(preview ? {} : { status: "PUBLISHED", entity: { published: true } }) },
    include: { entity: { include: { translations: true } } },
  });
}

// ---------- Projects ----------
export async function listProjectCategories(locale: Locale, preview = false) {
  const rows = await prisma.projectCategory.findMany({ where: pub(preview), orderBy: order, include: { translations: true } });
  return localize(rows, locale, preview);
}

export async function listProjects(
  locale: Locale,
  opts: { featured?: boolean; limit?: number; excludeId?: string } = {},
  preview = false,
) {
  const rows = await prisma.project.findMany({
    where: {
      ...pub(preview),
      ...(opts.featured ? { featured: true } : {}),
      ...(opts.excludeId ? { id: { not: opts.excludeId } } : {}),
    },
    orderBy: [{ sortOrder: "asc" }, { year: "desc" }],
    include: { translations: true, category: { include: { translations: true } } },
  });
  const list = localize(rows, locale, preview);
  return opts.limit ? list.slice(0, opts.limit) : list;
}

export async function getProjectBySlug(locale: Locale, slug: string, preview = false) {
  return prisma.projectTranslation.findFirst({
    where: { locale, slug, ...(preview ? {} : { status: "PUBLISHED", entity: { published: true } }) },
    include: {
      entity: {
        include: {
          translations: true,
          category: { include: { translations: true } },
          client: { include: { translations: true } },
          gallery: { where: pub(preview), orderBy: order, include: { translations: true } },
        },
      },
    },
  });
}

// ---------- Clients & gallery ----------
export async function listClients(locale: Locale, preview = false) {
  const rows = await prisma.client.findMany({ where: pub(preview), orderBy: order, include: { translations: true } });
  return localize(rows, locale, preview);
}

export async function listGallery(locale: Locale, preview = false, limit?: number) {
  const rows = await prisma.galleryItem.findMany({ where: pub(preview), orderBy: order, include: { translations: true } });
  const list = localize(rows, locale, preview);
  return limit ? list.slice(0, limit) : list;
}
