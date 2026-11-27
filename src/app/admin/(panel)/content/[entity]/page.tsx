import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { displayName, getAdminT, listRows, states } from "@/lib/admin";
import { entities, isEntityKey } from "@/lib/entities";
import { locales } from "@/lib/i18n";
import { Legend, StateChip } from "@/components/admin/StateChip";
import { Img } from "@/components/site/ui";

export default async function EntityList({ params }: { params: Promise<{ entity: string }> }) {
  const { entity } = await params;
  if (!isEntityKey(entity)) notFound();
  if (entity === "settings") redirect("/admin/content/settings/1");
  const cfg = entities[entity];
  const { locale, t } = await getAdminT();
  const a = t.admin;
  const rows = await listRows(entity);
  const labels = { complete: a.complete, draft: a.draft, missing: a.missing };
  const imageKey = cfg.baseFields.find((f) => f.type === "image")?.key;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-forest-900">
          {a.entities[entity]} <span className="text-base font-normal text-ink-400">({rows.length})</span>
        </h1>
        {cfg.creatable && (
          <Link href={`/admin/content/${entity}/new`} className="btn btn-primary !py-2">+ {a.new}</Link>
        )}
      </div>
      <div className="mb-4"><Legend labels={labels} /></div>
      <div className="overflow-hidden rounded-2xl bg-white shadow-soft">
        <ul className="divide-y divide-sand-200">
          {rows.map((row) => {
            const st = states(cfg, row);
            return (
              <li key={String(row.id)}>
                <Link href={`/admin/content/${entity}/${row.id}`} className="flex flex-wrap items-center gap-4 p-4 hover:bg-cream-50">
                  {imageKey && (
                    <span className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-leaf-100">
                      <Img src={(row[imageKey] as string) || null} alt="" />
                    </span>
                  )}
                  <span className="min-w-40 flex-1">
                    <span className="block font-semibold text-forest-900">{displayName(cfg, row, locale)}</span>
                    {row.published === false && <span className="text-xs text-terracotta-600">{a.unpublished}</span>}
                  </span>
                  <span className="flex gap-1.5">
                    {locales.map((l) => (
                      <StateChip key={l} locale={l} state={st[l]} title={labels[st[l]]} />
                    ))}
                  </span>
                </Link>
              </li>
            );
          })}
          {rows.length === 0 && <li className="p-8 text-center text-ink-400">{t.common.noResults}</li>}
        </ul>
      </div>
    </div>
  );
}
