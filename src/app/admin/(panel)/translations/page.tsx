import Link from "next/link";
import { displayName, getAdminT, listRows, states, tp } from "@/lib/admin";
import { entities, entityOrder, isEntityKey, type EntityKey } from "@/lib/entities";
import { isLocale, locales, localeInfo } from "@/lib/i18n";
import { Legend, ProgressBar, StateChip } from "@/components/admin/StateChip";

type Props = { searchParams: Promise<{ type?: string; lang?: string; missing?: string }> };

export default async function Translations({ searchParams }: Props) {
  const sp = await searchParams;
  const { locale, t } = await getAdminT();
  const a = t.admin;
  const type = sp.type && isEntityKey(sp.type) ? sp.type : null;
  const lang = isLocale(sp.lang) ? sp.lang : null;
  const missingOnly = sp.missing === "1";
  const labels = { complete: a.complete, draft: a.draft, missing: a.missing };

  const keys: EntityKey[] = type ? [type] : entityOrder;
  const groups = await Promise.all(
    keys.map(async (key) => {
      const cfg = entities[key];
      const rows = (await listRows(key)).map((row) => ({ row, st: states(cfg, row), name: displayName(cfg, row, locale) }));
      const done = Object.fromEntries(locales.map((l) => [l, rows.filter((r) => r.st[l] === "complete").length])) as Record<string, number>;
      const visible = rows.filter(({ st }) => !missingOnly || (lang ? st[lang] !== "complete" : locales.some((l) => st[l] !== "complete")));
      return { key, cfg, rows, visible, done };
    }),
  );

  const qs = (patch: Record<string, string | null>) => {
    const p = new URLSearchParams();
    const cur = { type: type, lang: lang, missing: missingOnly ? "1" : null, ...patch };
    for (const [k, v] of Object.entries(cur)) if (v) p.set(k, v);
    const s = p.toString();
    return `/admin/translations${s ? `?${s}` : ""}`;
  };
  const pill = (active: boolean) => `rounded-full px-3 py-1.5 text-sm font-medium ${active ? "bg-forest-800 text-white" : "bg-white text-ink-600 hover:bg-leaf-100"}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-forest-900">{a.translations}</h1>
        <p className="mt-1 text-sm text-ink-600">{a.completion}</p>
      </div>

      <div className="space-y-3 rounded-2xl bg-white p-4 shadow-soft">
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-28 text-xs font-semibold uppercase text-ink-400">{a.filters.type}</span>
          <Link href={qs({ type: null })} className={pill(!type)}>{a.filters.all}</Link>
          {entityOrder.map((k) => (
            <Link key={k} href={qs({ type: k })} className={pill(type === k)}>{a.entities[k]}</Link>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-28 text-xs font-semibold uppercase text-ink-400">{a.filters.language}</span>
          <Link href={qs({ lang: null })} className={pill(!lang)}>{a.filters.all}</Link>
          {locales.map((l) => (
            <Link key={l} href={qs({ lang: l })} className={pill(lang === l)}>{localeInfo[l].code}</Link>
          ))}
          <span className="mx-2 h-5 w-px bg-sand-200" />
          <Link href={qs({ missing: missingOnly ? null : "1" })} className={pill(missingOnly)}>{a.filters.missingOnly}</Link>
        </div>
        <Legend labels={labels} />
      </div>

      {groups.map(({ key, cfg, rows, visible, done }) => (
        <section key={key} className="overflow-hidden rounded-2xl bg-white shadow-soft">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-sand-200 p-4">
            <h2 className="font-semibold text-forest-900">
              {a.entities[key]} <span className="font-normal text-ink-400">({rows.length})</span>
            </h2>
            <div className="flex flex-wrap gap-4">
              {(lang ? [lang] : locales).map((l) => (
                <div key={l} className="w-24">
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="font-bold">{localeInfo[l].code}</span>
                    <span className="text-ink-400">{done[l]}/{rows.length}</span>
                  </div>
                  <ProgressBar value={rows.length ? done[l] / rows.length : 1} />
                </div>
              ))}
            </div>
          </header>
          {visible.length === 0 ? (
            <p className="p-4 text-sm text-leaf-600">✓ {a.noneMissing}</p>
          ) : (
            <table className="w-full text-sm">
              <tbody className="divide-y divide-sand-200">
                {visible.map(({ row, st, name }) => (
                  <tr key={String(row.id)} className="hover:bg-cream-50">
                    <td className="p-3 ps-4">
                      <Link href={`/admin/content/${key}/${row.id}`} className="font-medium text-forest-900 hover:text-leaf-600">{name}</Link>
                    </td>
                    <td className="p-3 pe-4">
                      <div className="flex justify-end gap-1.5">
                        {(lang ? [lang] : locales).map((l) => (
                          <Link key={l} href={`/admin/content/${key}/${row.id}?lang=${l}`}>
                            <StateChip locale={l} state={st[l]} title={labels[st[l]]} />
                          </Link>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {cfg.required.length > 0 && (
            <p className="border-t border-sand-200 bg-cream-50 px-4 py-2 text-xs text-ink-400">
              {a.requiredHint} : {cfg.required.map((f) => tp(t, cfg.trFields.find((x) => x.key === f)?.label ?? f)).join(", ")}
            </p>
          )}
        </section>
      ))}
    </div>
  );
}
