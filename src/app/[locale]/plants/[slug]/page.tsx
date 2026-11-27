import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { href, type Locale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { alternatesFor, getProductBySlug, imageFor, isPreview, listProducts } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { absolute } from "@/lib/site";
import { PageAlternates } from "@/components/site/LocaleNav";
import { Card, Img, RichText } from "@/components/site/ui";
import { ArrowBack, DropIcon, HomeIcon, PotIcon, RulerIcon, SunIcon, TagIcon } from "@/components/Icons";

type Props = { params: Promise<{ locale: Locale; slug: string }>; searchParams: Promise<Record<string, string | undefined>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const tr = await getProductBySlug(locale, decodeURIComponent(slug));
  if (!tr) return {};
  return buildMetadata({
    locale,
    alternates: alternatesFor(tr.entity.translations, "product"),
    title: tr.seoTitle || tr.name,
    description: tr.seoDescription || tr.shortDescription,
    image: imageFor(tr.entity, tr),
  });
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  const preview = await isPreview(searchParams);
  const tr = await getProductBySlug(locale, decodeURIComponent(slug), preview);
  if (!tr) notFound();
  const p = tr.entity;
  const [t, related] = await Promise.all([
    getMessages(locale),
    p.categoryId ? listProducts(locale, { categoryId: p.categoryId, excludeId: p.id, limit: 4 }, preview) : Promise.resolve([]),
  ]);
  const catTr = p.category?.translations.find((c) => c.locale === locale && (preview || c.status === "PUBLISHED"));
  const image = imageFor(p, tr);

  const specs = [
    p.lightLevel && { icon: SunIcon, label: t.plants.light, value: t.plants.lightLevel[p.lightLevel] },
    p.watering && { icon: DropIcon, label: t.plants.watering, value: t.plants.wateringLevel[p.watering] },
    p.placement && { icon: HomeIcon, label: t.plants.placement, value: t.plants.placementValue[p.placement] },
    p.height && { icon: RulerIcon, label: t.plants.height, value: p.height },
    p.potSize && { icon: PotIcon, label: t.plants.potSize, value: p.potSize },
    { icon: TagIcon, label: t.plants.price, value: p.price || t.plants.priceOnRequest },
  ].filter(Boolean) as { icon: typeof SunIcon; label: string; value: string }[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: tr.name,
    description: tr.shortDescription,
    image: image ? (image.startsWith("http") ? image : absolute(image)) : undefined,
    category: catTr?.name,
    inLanguage: locale,
  };

  return (
    <>
      <PageAlternates value={alternatesFor(p.translations, "product", preview)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="container-page py-10">
        <Link href={catTr?.slug ? href(locale, "plantCategory", catTr.slug) : href(locale, "plants")} className="inline-flex items-center gap-2 text-sm font-semibold text-ink-600 hover:text-forest-800">
          <ArrowBack width={16} height={16} /> {catTr?.name || t.plants.title}
        </Link>
        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl bg-leaf-100 shadow-soft">
            <div className="aspect-square">
              <Img src={image} alt={tr.name ?? ""} />
            </div>
          </div>
          <div>
            {catTr && <p className="text-sm font-semibold uppercase tracking-wider text-leaf-600 rtl:tracking-normal">{catTr.name}</p>}
            <h1 className="mt-2 font-display text-4xl font-bold text-forest-900 md:text-5xl">{tr.name}</h1>
            {tr.origin && (
              <p className="mt-2 text-ink-400">
                {t.plants.origin} : {tr.origin}
              </p>
            )}
            <p className="mt-5 text-lg text-ink-600">{tr.shortDescription}</p>

            <h2 className="mb-4 mt-8 text-sm font-bold uppercase tracking-wider text-forest-800 rtl:tracking-normal">{t.plants.technical}</h2>
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {specs.map(({ icon: I, label, value }) => (
                <div key={label} className="rounded-2xl bg-white p-4 shadow-soft">
                  <dt className="flex items-center gap-2 text-xs font-semibold text-ink-400">
                    <I width={16} height={16} className="text-leaf-600" /> {label}
                  </dt>
                  <dd className="mt-1.5 font-semibold text-forest-900">{value}</dd>
                </div>
              ))}
            </dl>
            <Link href={href(locale, "contact")} className="btn btn-accent mt-8">
              {t.plants.enquire}
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          <RichText text={tr.description} className="text-lg leading-relaxed" />
          {tr.careTips && (
            <div className="rounded-3xl bg-leaf-100 p-8">
              <h2 className="mb-4 font-display text-2xl font-bold text-forest-900">{t.plants.careTips}</h2>
              <RichText text={tr.careTips} />
            </div>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-page py-10">
          <h2 className="mb-8 font-display text-3xl font-bold text-forest-900">{t.plants.related}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map(({ item, tr: r }) => (
              <Card key={item.id} href={href(locale, "product", r.slug)} image={imageFor(item, r)} title={r.name ?? ""} text={r.shortDescription} cta={t.common.viewDetails} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
