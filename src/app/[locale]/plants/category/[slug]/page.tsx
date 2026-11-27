import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { alternatesFor, getCategoryBySlug, imageFor, isPreview, listCategories, listProducts } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageAlternates } from "@/components/site/LocaleNav";
import { PageHero } from "@/components/site/ui";
import { CatalogView } from "../../CatalogView";

type Props = { params: Promise<{ locale: Locale; slug: string }>; searchParams: Promise<Record<string, string | undefined>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const tr = await getCategoryBySlug(locale, decodeURIComponent(slug));
  if (!tr) return {};
  return buildMetadata({
    locale,
    alternates: alternatesFor(tr.entity.translations, "plantCategory"),
    title: tr.seoTitle || tr.name,
    description: tr.seoDescription || tr.description,
    image: imageFor(tr.entity, tr),
  });
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  const preview = await isPreview(searchParams);
  const tr = await getCategoryBySlug(locale, decodeURIComponent(slug), preview);
  if (!tr) notFound();
  const [t, categories, products] = await Promise.all([
    getMessages(locale),
    listCategories(locale, preview),
    listProducts(locale, { categoryId: tr.entityId }, preview),
  ]);
  return (
    <>
      <PageAlternates value={alternatesFor(tr.entity.translations, "plantCategory", preview)} />
      <PageHero title={tr.name ?? ""} subtitle={tr.description} image={imageFor(tr.entity, tr)} />
      <CatalogView locale={locale} t={t} categories={categories} products={products} activeCategoryId={tr.entityId} />
    </>
  );
}
