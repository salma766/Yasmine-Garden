import { setAdminLocale } from "@/app/admin/actions";
import { locales, localeInfo, type Locale } from "@/lib/i18n";

/** Language of the admin interface itself (independent of content languages). */
export function AdminLanguagePicker({ current, dark = false }: { current: Locale; dark?: boolean }) {
  return (
    <form action={setAdminLocale} className="flex gap-1">
      {locales.map((l) => (
        <button
          key={l}
          name="locale"
          value={l}
          title={localeInfo[l].native}
          className={`rounded-md px-2 py-1 text-xs font-bold ${l === current ? (dark ? "bg-white text-forest-900" : "bg-forest-800 text-white") : dark ? "text-white/70 hover:bg-white/10" : "text-ink-600 hover:bg-leaf-100"}`}
        >
          {localeInfo[l].code}
        </button>
      ))}
    </form>
  );
}
