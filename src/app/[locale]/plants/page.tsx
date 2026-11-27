import type { Metadata } from "next";
import { staticAlternates, type Locale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { getPage, imageFor, isPreview, listCategories, listProducts } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageAlternates } from "@/components/site/LocaleNav";
import { PageHero } from "@/components/site/ui";
import { CatalogView } from "./CatalogView";

type Props = { params: Promise<{ locale: Locale }>; searchParams: Promise<Record<string, string | undefined>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const [t, data] = await Promise.all([getMessages(locale), getPage("plants", locale)]);
  return buildMetadata({
    locale,
    alternates: staticAlternates("plants"),
    title: data?.tr?.seoTitle || data?.tr?.title || t.plants.title,
    description: data?.tr?.seoDescription || t.plants.intro,
  });
}

export default async function Plants({ params, searchParams }: Props) {
  const { locale } = await params;
  const preview = await isPreview(searchParams);
  const [t, data, categories, products] = await Promise.all([
    getMessages(locale),
    getPage("plants", locale, preview),
    listCategories(locale, preview),
    listProducts(locale, {}, preview),
  ]);
  return (
    <>
      <PageAlternates value={staticAlternates("plants")} />
      <PageHero title={data?.tr?.title || t.plants.title} subtitle={data?.tr?.subtitle || t.plants.intro} image={imageFor(data?.page ?? {}, data?.tr)} />
      <CatalogView locale={locale} t={t} categories={categories} products={products} />
    </>
  );
}
