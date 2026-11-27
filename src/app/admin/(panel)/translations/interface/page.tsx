import { getAdminT } from "@/lib/admin";
import { dictionaries, flatten } from "@/lib/messages";
import { prisma } from "@/lib/db";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { UiTextsForm } from "@/components/admin/UiTextsForm";

export default async function InterfaceTexts({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const { lang } = await searchParams;
  const { t } = await getAdminT();
  const target: Locale = isLocale(lang) ? lang : "fr";
  const defaults = flatten(dictionaries[target]);
  const reference = flatten(dictionaries.fr);
  const overrides = await prisma.uiTranslation.findMany({ where: { locale: target } });
  const values = Object.fromEntries(overrides.map((o) => [o.key, o.value]));
  const counts = Object.fromEntries(await Promise.all(locales.map(async (l) => [l, await prisma.uiTranslation.count({ where: { locale: l } })])));
  // Interface texts are built in for all four languages; overrides are optional.
  const keys = Object.keys(reference).filter((k) => !k.startsWith("admin."));
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-forest-900">{t.admin.interfaceTexts}</h1>
      <p className="max-w-3xl text-sm text-ink-600">{t.admin.uiTexts.intro}</p>
      <UiTextsForm
        target={target}
        keys={keys}
        defaults={defaults}
        reference={reference}
        values={values}
        counts={counts}
        labels={{
          key: t.admin.uiTexts.key,
          def: t.admin.uiTexts.default,
          search: t.admin.uiTexts.search,
          overridden: t.admin.uiTexts.overridden,
          save: t.admin.saveLanguage,
          saved: t.admin.saved,
        }}
      />
    </div>
  );
}
