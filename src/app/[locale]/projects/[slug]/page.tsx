import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { href, type Locale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { alternatesFor, getProjectBySlug, imageFor, isPreview, listProjects, pickTr } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageAlternates } from "@/components/site/LocaleNav";
import { Card, Img, PageHero, RichText } from "@/components/site/ui";
import { GalleryGrid } from "@/components/site/Gallery";
import { ArrowBack } from "@/components/Icons";

type Props = { params: Promise<{ locale: Locale; slug: string }>; searchParams: Promise<Record<string, string | undefined>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const tr = await getProjectBySlug(locale, decodeURIComponent(slug));
  if (!tr) return {};
  return buildMetadata({
    locale,
    alternates: alternatesFor(tr.entity.translations, "project"),
    title: tr.seoTitle || tr.title,
    description: tr.seoDescription || tr.summary,
    image: imageFor(tr.entity, tr),
  });
}

export default async function ProjectPage({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  const preview = await isPreview(searchParams);
  const tr = await getProjectBySlug(locale, decodeURIComponent(slug), preview);
  if (!tr) notFound();
  const p = tr.entity;
  const [t, others] = await Promise.all([getMessages(locale), listProjects(locale, { excludeId: p.id, limit: 3 }, preview)]);
  const catTr = p.category ? pickTr(p.category.translations, locale, preview) : undefined;
  const clientTr = p.client ? pickTr(p.client.translations, locale, preview) : undefined;
  const photos = p.gallery
    .map((g) => ({ g, gt: pickTr(g.translations, locale, preview) }))
    .filter((x) => x.gt)
    .map(({ g, gt }) => ({ id: g.id, src: imageFor(g, gt) || "", title: gt!.title || "", caption: gt!.caption, alt: gt!.alt }));
  const image = imageFor(p, tr);
  const facts = [
    tr.location && { label: t.projects.location, value: tr.location },
    p.year && { label: t.projects.year, value: String(p.year) },
    catTr?.name && { label: t.projects.category, value: catTr.name },
    clientTr?.name && { label: t.projects.client, value: clientTr.name },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <>
      <PageAlternates value={alternatesFor(p.translations, "project", preview)} />
      <PageHero title={tr.title ?? ""} subtitle={tr.summary} image={image}>
        <Link href={href(locale, "projects")} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white">
          <ArrowBack width={16} height={16} /> {t.projects.title}
        </Link>
      </PageHero>
      <section className="container-page grid gap-12 py-16 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-10 overflow-hidden rounded-3xl shadow-soft">
            <div className="aspect-[16/9]">
              <Img src={image} alt={tr.title ?? ""} />
            </div>
          </div>
          <RichText text={tr.description} className="text-lg leading-relaxed" />
        </div>
        <aside>
          <dl className="space-y-4 rounded-3xl bg-white p-7 shadow-soft">
            {facts.map((f) => (
              <div key={f.label} className="border-b border-sand-200 pb-4 last:border-0 last:pb-0">
                <dt className="text-xs font-semibold uppercase tracking-wider text-ink-400 rtl:tracking-normal">{f.label}</dt>
                <dd className="mt-1 font-semibold text-forest-900">{f.value}</dd>
              </div>
            ))}
          </dl>
          <Link href={href(locale, "contact")} className="btn btn-accent mt-6 w-full">
            {t.nav.quote}
          </Link>
        </aside>
      </section>
      {photos.length > 0 && (
        <section className="container-page py-6">
          <h2 className="mb-8 font-display text-3xl font-bold text-forest-900">{t.projects.photos}</h2>
          <GalleryGrid items={photos} labels={{ close: t.common.close, previous: t.common.previous, next: t.common.next }} />
        </section>
      )}
      {others.length > 0 && (
        <section className="container-page py-12">
          <h2 className="mb-8 font-display text-3xl font-bold text-forest-900">{t.projects.other}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {others.map(({ item, tr: o }) => (
              <Card key={item.id} href={href(locale, "project", o.slug)} image={imageFor(item, o)} title={o.title ?? ""} text={o.summary} meta={o.location} cta={t.common.viewDetails} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
