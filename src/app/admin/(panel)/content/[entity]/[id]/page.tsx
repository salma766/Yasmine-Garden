import Link from "next/link";
import { notFound } from "next/navigation";
import { displayName, getAdminT, getRow, previewUrl, relationOptions } from "@/lib/admin";
import { entities, isEntityKey } from "@/lib/entities";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { deleteEntity } from "@/app/admin/actions";
import { EntityEditor } from "@/components/admin/EntityEditor";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

type Props = { params: Promise<{ entity: string; id: string }>; searchParams: Promise<{ lang?: string }> };

function plain(obj: Record<string, unknown>) {
  return JSON.parse(JSON.stringify(obj)) as Record<string, unknown>;
}

export default async function EditPage({ params, searchParams }: Props) {
  const { entity, id } = await params;
  const { lang } = await searchParams;
  if (!isEntityKey(entity)) notFound();
  const cfg = entities[entity];
  const { locale, t } = await getAdminT();
  const isNew = id === "new";
  if (isNew && !cfg.creatable) notFound();
  const row = isNew ? null : await getRow(entity, id);
  if (!isNew && !row) notFound();

  const relOpts: Record<string, { value: string; label: string }[]> = {};
  for (const f of cfg.baseFields) if (f.relation) relOpts[f.key] = await relationOptions(f.relation, locale);

  const base: Record<string, unknown> = row ? plain(row) : { published: true, sortOrder: 0 };
  delete base.translations;
  const translations: Partial<Record<Locale, Record<string, unknown>>> = {};
  const previews: Partial<Record<Locale, string | null>> = {};
  if (row) {
    for (const l of locales) {
      const tr = row.translations.find((x) => x.locale === l);
      if (tr) translations[l] = plain(tr);
      previews[l] = previewUrl(cfg, row, l);
    }
  }
  const title = row ? displayName(cfg, row, locale) : t.admin.new;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          {!cfg.singleton && (
            <Link href={`/admin/content/${entity}`} className="text-sm text-ink-600 hover:text-forest-800">← {t.admin.entities[entity]}</Link>
          )}
          <h1 className="text-2xl font-bold text-forest-900">{cfg.singleton ? t.admin.entities[entity] : title}</h1>
        </div>
        {row && cfg.creatable && (
          <form action={deleteEntity}>
            <input type="hidden" name="_entity" value={entity} />
            <input type="hidden" name="_id" value={String(row.id)} />
            <ConfirmButton message={t.admin.confirmDelete} className="rounded-full px-4 py-2 text-sm font-semibold text-terracotta-600 hover:bg-terracotta-500/10">
              {t.admin.delete}
            </ConfirmButton>
          </form>
        )}
      </div>
      <EntityEditor
        entity={entity}
        id={row ? String(row.id) : "new"}
        isNew={isNew}
        base={base}
        translations={translations}
        previewUrls={previews}
        relationOptions={relOpts}
        t={t}
        adminLocale={locale}
        initialLang={isLocale(lang) ? lang : "fr"}
        aiEnabled={!!process.env.ANTHROPIC_API_KEY}
      />
    </div>
  );
}
