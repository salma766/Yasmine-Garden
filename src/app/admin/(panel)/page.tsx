import Link from "next/link";
import { completionSummary, getAdminT } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { locales, localeInfo } from "@/lib/i18n";
import { Legend, ProgressBar, StateChip } from "@/components/admin/StateChip";

export default async function Dashboard() {
  const { locale, t } = await getAdminT();
  const a = t.admin;
  const [summary, unread] = await Promise.all([completionSummary(locale), prisma.contactMessage.count({ where: { read: false } })]);
  const labels = { complete: a.complete, draft: a.draft, missing: a.missing };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-forest-900">{a.dashboard}</h1>

      <section>
        <h2 className="mb-3 font-semibold text-ink-600">{a.completion}</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {locales.map((l) => {
            const s = summary.perLocale[l];
            const pct = s.total ? s.complete / s.total : 0;
            return (
              <Link key={l} href={`/admin/translations?lang=${l}&missing=1`} className="rounded-2xl bg-white p-5 shadow-soft hover:ring-2 hover:ring-leaf-500">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-forest-900">
                    {localeInfo[l].code} · <span className={l === "ar" ? "font-arabic" : ""}>{localeInfo[l].native}</span>
                  </span>
                  <span className="text-2xl font-bold text-leaf-600">{Math.round(pct * 100)}%</span>
                </div>
                <div className="mt-3"><ProgressBar value={pct} /></div>
                <p className="mt-3 text-xs text-ink-600">
                  {s.complete} {a.complete.toLowerCase()} · {s.draft} {a.draft.toLowerCase()} · {s.missing} {a.missing.toLowerCase()}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-2xl bg-white p-5 shadow-soft xl:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-semibold text-forest-900">{a.missingList}</h2>
            <Legend labels={labels} />
          </div>
          {summary.missing.length === 0 ? (
            <p className="rounded-xl bg-leaf-100 p-4 text-forest-800">{a.noneMissing}</p>
          ) : (
            <ul className="divide-y divide-sand-200">
              {summary.missing.slice(0, 12).map((m) => (
                <li key={`${m.key}-${m.id}-${m.locale}`}>
                  <Link href={`/admin/content/${m.key}/${m.id}?lang=${m.locale}`} className="flex items-center gap-3 py-2.5 hover:bg-cream-50">
                    <StateChip locale={m.locale} state={m.state} title={labels[m.state]} />
                    <span className="flex-1 truncate font-medium">{m.name}</span>
                    <span className="text-xs text-ink-400">{a.entities[m.key]}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {summary.missing.length > 12 && (
            <Link href="/admin/translations?missing=1" className="mt-3 inline-block text-sm font-semibold text-leaf-600">
              {a.translations} ({summary.missing.length}) →
            </Link>
          )}
        </section>

        <section className="space-y-4">
          <Link href="/admin/messages" className="block rounded-2xl bg-forest-800 p-5 text-white shadow-soft">
            <p className="text-sm text-white/70">{a.unreadMessages}</p>
            <p className="text-3xl font-bold">{unread}</p>
          </Link>
          <div className="rounded-2xl bg-white p-5 shadow-soft">
            <ul className="space-y-2 text-sm">
              {summary.perEntity.map((e) => (
                <li key={e.key}>
                  <Link href={`/admin/content/${e.key}${e.key === "settings" ? "/1" : ""}`} className="flex justify-between hover:text-leaf-600">
                    <span>{a.entities[e.key]}</span>
                    <span className="font-semibold">{e.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
