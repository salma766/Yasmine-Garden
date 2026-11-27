import type { Metadata } from "next";
import { staticAlternates, type Locale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { getPage, imageFor, isPreview, listGallery } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageAlternates } from "@/components/site/LocaleNav";
import { Empty, PageHero } from "@/components/site/ui";
import { GalleryGrid } from "@/components/site/Gallery";

type Props = { params: Promise<{ locale: Locale }>; searchParams: Promise<Record<string, string | undefined>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const [t, data] = await Promise.all([getMessages(locale), getPage("gallery", locale)]);
  return buildMetadata({
    locale,
    alternates: staticAlternates("gallery"),
    title: data?.tr?.seoTitle || data?.tr?.title || t.gallery.title,
    description: data?.tr?.seoDescription || t.gallery.intro,
  });
}

export default async function Gallery({ params, searchParams }: Props) {
  const { locale } = await params;
  const preview = await isPreview(searchParams);
  const [t, data, items] = await Promise.all([getMessages(locale), getPage("gallery", locale, preview), listGallery(locale, preview)]);
  const photos = items.map(({ item, tr }) => ({ id: item.id, src: imageFor(item, tr) || "", title: tr.title || "", caption: tr.caption, alt: tr.alt }));
  return (
    <>
      <PageAlternates value={staticAlternates("gallery")} />
      <PageHero title={data?.tr?.title || t.gallery.title} subtitle={data?.tr?.subtitle || t.gallery.intro} image={imageFor(data?.page ?? {}, data?.tr)} />
      <section className="container-page py-14">
        {photos.length === 0 ? <Empty text={t.common.noResults} /> : <GalleryGrid items={photos} labels={{ close: t.common.close, previous: t.common.previous, next: t.common.next }} />}
      </section>
    </>
  );
}
