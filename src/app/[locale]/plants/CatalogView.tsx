import type { Locale } from "@/lib/i18n";
import { href } from "@/lib/i18n";
import type { Messages } from "@/messages/fr";
import { imageFor, type listCategories, type listProducts } from "@/lib/content";
import { Card, Empty, Pill } from "@/components/site/ui";

export function CatalogView({
  locale,
  t,
  categories,
  products,
  activeCategoryId,
}: {
  locale: Locale;
  t: Messages;
  categories: Awaited<ReturnType<typeof listCategories>>;
  products: Awaited<ReturnType<typeof listProducts>>;
  activeCategoryId?: string;
}) {
  return (
    <section className="container-page py-14">
      <div className="mb-10 flex flex-wrap gap-2">
        <Pill href={href(locale, "plants")} active={!activeCategoryId}>
          {t.common.allCategories}
        </Pill>
        {categories.map(({ item, tr }) => (
          <Pill key={item.id} href={href(locale, "plantCategory", tr.slug)} active={item.id === activeCategoryId}>
            {tr.name}
          </Pill>
        ))}
      </div>
      {products.length === 0 ? (
        <Empty text={t.common.noResults} />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map(({ item, tr }) => (
            <Card
              key={item.id}
              href={href(locale, "product", tr.slug)}
              image={imageFor(item, tr)}
              title={tr.name ?? ""}
              text={tr.shortDescription}
              meta={item.category?.translations.find((c) => c.locale === locale)?.name ?? null}
              cta={t.common.viewDetails}
            />
          ))}
        </div>
      )}
    </section>
  );
}
