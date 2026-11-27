import type { TrState } from "@/lib/entities";
import { localeInfo, type Locale } from "@/lib/i18n";

const styles: Record<TrState, string> = {
  complete: "bg-leaf-500 text-white",
  draft: "bg-amber-400 text-amber-950",
  missing: "bg-white text-terracotta-600 ring-1 ring-inset ring-terracotta-500/50",
};

export function StateChip({ locale, state, title }: { locale: Locale; state: TrState; title: string }) {
  return (
    <span title={title} className={`inline-flex h-6 min-w-9 items-center justify-center rounded-md px-1.5 text-[11px] font-bold ${styles[state]}`}>
      {localeInfo[locale].code}
    </span>
  );
}

export function Legend({ labels }: { labels: Record<TrState, string> }) {
  return (
    <div className="flex flex-wrap gap-4 text-xs text-ink-600">
      {(Object.keys(styles) as TrState[]).map((s) => (
        <span key={s} className="flex items-center gap-1.5">
          <span className={`inline-block h-3 w-3 rounded ${styles[s]}`} /> {labels[s]}
        </span>
      ))}
    </div>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-sand-200">
      <div className="h-full rounded-full bg-leaf-500" style={{ width: `${Math.round(value * 100)}%` }} />
    </div>
  );
}
