import "server-only";
import { prisma } from "./db";
import { getAdminLocale } from "./admin-locale";
import { getMessages } from "./messages";
import { entities, entityOrder, translationState, type EntityConfig, type EntityKey, type TrState } from "./entities";
import { href, locales, type Locale, type RouteName } from "./i18n";

export { tp } from "./tp";

export async function getAdminT() {
  const locale = await getAdminLocale();
  const t = await getMessages(locale);
  return { locale, t };
}

// Prisma delegates are looked up by name so every content type can share
// the same admin code paths.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function delegate(name: string): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (prisma as any)[name];
}

type Row = { id: string | number; translations: Record<string, unknown>[]; [k: string]: unknown };

export function displayName(cfg: EntityConfig, row: Row, prefer: Locale): string {
  const pick = (l: string) => row.translations.find((t) => t.locale === l)?.[cfg.titleField];
  const order = [prefer, ...locales.filter((l) => l !== prefer)];
  for (const l of order) {
    const v = pick(l);
    if (typeof v === "string" && v.trim()) return v;
  }
  if (typeof row.key === "string") return row.key;
  return `#${String(row.id).slice(-6)}`;
}

export function states(cfg: EntityConfig, row: Row): Record<Locale, TrState> {
  return Object.fromEntries(locales.map((l) => [l, translationState(cfg, row.translations.find((t) => t.locale === l))])) as Record<Locale, TrState>;
}

export async function listRows(key: EntityKey): Promise<Row[]> {
  const cfg = entities[key];
  return delegate(cfg.model).findMany({ include: { translations: true }, orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }] });
}

export async function getRow(key: EntityKey, id: string): Promise<Row | null> {
  const cfg = entities[key];
  const where = { id: cfg.idType === "int" ? Number(id) : id };
  return delegate(cfg.model).findUnique({ where, include: { translations: true } });
}

/** Options for relation selects, labelled in the admin language. */
export async function relationOptions(key: EntityKey, prefer: Locale) {
  const cfg = entities[key];
  const rows = await listRows(key);
  return rows.map((r) => ({ value: String(r.id), label: displayName(cfg, r, prefer) }));
}

const pageRoutes: Record<string, RouteName> = {
  home: "home",
  about: "about",
  plants: "plants",
  landscaping: "landscaping",
  projects: "projects",
  gallery: "gallery",
  contact: "contact",
};

/** Public URL to preview one language of an item (null when no slug yet). */
export function previewUrl(cfg: EntityConfig, row: Row, locale: Locale): string | null {
  const tr = row.translations.find((t) => t.locale === locale);
  let url: string | null = null;
  if (cfg.route) {
    const slug = tr?.slug;
    url = typeof slug === "string" && slug ? href(locale, cfg.route, slug) : null;
  } else if (cfg.key === "pages") {
    url = href(locale, pageRoutes[String(row.key)] ?? "home");
  } else if (cfg.key === "gallery") {
    url = href(locale, "gallery");
  } else if (cfg.key === "projectCategories") {
    url = href(locale, "projects");
  } else {
    url = href(locale, "home");
  }
  return url ? `${url}?preview=1` : null;
}

export type Summary = {
  perLocale: Record<Locale, { complete: number; draft: number; missing: number; total: number }>;
  perEntity: { key: EntityKey; count: number; perLocale: Record<Locale, number> }[];
  missing: { key: EntityKey; id: string; name: string; locale: Locale; state: TrState }[];
};

export async function completionSummary(prefer: Locale): Promise<Summary> {
  const perLocale = Object.fromEntries(locales.map((l) => [l, { complete: 0, draft: 0, missing: 0, total: 0 }])) as Summary["perLocale"];
  const perEntity: Summary["perEntity"] = [];
  const missing: Summary["missing"] = [];
  for (const key of entityOrder) {
    const cfg = entities[key];
    const rows = await listRows(key);
    const done = Object.fromEntries(locales.map((l) => [l, 0])) as Record<Locale, number>;
    for (const row of rows) {
      const st = states(cfg, row);
      for (const l of locales) {
        perLocale[l].total++;
        perLocale[l][st[l]]++;
        if (st[l] === "complete") done[l]++;
        else missing.push({ key, id: String(row.id), name: displayName(cfg, row, prefer), locale: l, state: st[l] });
      }
    }
    perEntity.push({ key, count: rows.length, perLocale: done });
  }
  return { perLocale, perEntity, missing };
}
