"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { saveUiTexts } from "@/app/admin/actions";
import { locales, localeInfo, type Locale } from "@/lib/i18n";

export function UiTextsForm({
  target,
  keys,
  defaults,
  reference,
  values,
  counts,
  labels,
}: {
  target: Locale;
  keys: string[];
  defaults: Record<string, string>;
  reference: Record<string, string>;
  values: Record<string, string>;
  counts: Record<string, number>;
  labels: { key: string; def: string; search: string; overridden: string; save: string; saved: string };
}) {
  const [q, setQ] = useState("");
  const [state, action, pending] = useActionState(saveUiTexts, {});
  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return new Set(keys);
    return new Set(keys.filter((k) => k.toLowerCase().includes(s) || defaults[k]?.toLowerCase().includes(s) || reference[k]?.toLowerCase().includes(s) || values[k]?.toLowerCase().includes(s)));
  }, [q, keys, defaults, reference, values]);
  const rtl = target === "ar";

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="_locale" value={target} />
      <div className="flex flex-wrap items-center gap-2">
        {locales.map((l) => (
          <Link
            key={l}
            href={`/admin/translations/interface?lang=${l}`}
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${l === target ? "bg-forest-800 text-white" : "bg-white text-ink-600 hover:bg-leaf-100"}`}
          >
            {localeInfo[l].code} · {localeInfo[l].native}
            {counts[l] > 0 && <span className="ms-2 text-xs opacity-70">({counts[l]})</span>}
          </Link>
        ))}
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={labels.search} className="input ms-auto !w-64" />
      </div>
      <div className="overflow-hidden rounded-2xl bg-white shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-cream-50 text-start text-xs uppercase text-ink-400">
            <tr>
              <th className="p-3 text-start">{labels.key}</th>
              <th className="p-3 text-start">FR</th>
              <th className="p-3 text-start">{localeInfo[target].code}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-200">
            {keys.map((k) => (
              <tr key={k} hidden={!shown.has(k)} className="align-top">
                <td className="w-48 p-3 font-mono text-[11px] text-ink-400" dir="ltr">
                  {k}
                  {values[k] && <span className="ms-1 rounded bg-amber-100 px-1 text-amber-800">{labels.overridden}</span>}
                </td>
                <td className="w-1/3 p-3 text-ink-600">{reference[k]}</td>
                <td className="p-3">
                  <textarea
                    name={`k:${k}`}
                    defaultValue={values[k] ?? ""}
                    placeholder={defaults[k]}
                    rows={defaults[k].length > 60 ? 2 : 1}
                    dir={rtl ? "rtl" : "ltr"}
                    className={`input ${rtl ? "field-rtl" : "field-ltr"}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="sticky bottom-4 flex items-center gap-3">
        <button disabled={pending} className="btn btn-primary shadow-soft disabled:opacity-60">{labels.save}</button>
        {state.ok && <span className="rounded-full bg-white px-3 py-1 text-sm text-leaf-600 shadow-soft">✓ {labels.saved}</span>}
      </div>
    </form>
  );
}
