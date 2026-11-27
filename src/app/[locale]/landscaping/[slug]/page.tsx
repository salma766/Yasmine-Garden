import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { href, type Locale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { alternatesFor, getServiceBySlug, imageFor, isPreview, listServices } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageAlternates } from "@/components/site/LocaleNav";
import { Img, PageHero, RichText } from "@/components/site/ui";
import { ArrowBack, ArrowForward, ServiceIcon } from "@/components/Icons";

type Props = { params: Promise<{ locale: Locale; slug: string }>; searchParams: Promise<Record<string, string | undefined>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const tr = await getServiceBySlug(locale, decodeURIComponent(slug));
  if (!tr) return {};
  return buildMetadata({
    locale,
    alternates: alternatesFor(tr.entity.translations, "service"),
    title: tr.seoTitle || tr.name,
    description: tr.seoDescription || tr.shortDescription,
    image: imageFor(tr.entity, tr),
  });
}

export default async function ServicePage({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  const preview = await isPreview(searchParams);
  const tr = await getServiceBySlug(locale, decodeURIComponent(slug), preview);
  if (!tr) notFound();
  const [t, others] = await Promise.all([getMessages(locale), listServices(locale, preview, { excludeId: tr.entityId })]);
  const image = imageFor(tr.entity, tr);
  return (
    <>
      <PageAlternates value={alternatesFor(tr.entity.translations, "service", preview)} />
      <PageHero title={tr.name ?? ""} subtitle={tr.shortDescription} image={image}>
        <Link href={href(locale, "landscaping")} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white">
          <ArrowBack width={16} height={16} /> {t.landscaping.title}
        </Link>
      </PageHero>
      <section className="container-page grid gap-12 py-16 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-10 overflow-hidden rounded-3xl shadow-soft">
            <div className="aspect-[16/9]">
              <Img src={image} alt={tr.name ?? ""} />
            </div>
          </div>
          <RichText text={tr.description} className="text-lg leading-relaxed" />
          <Link href={href(locale, "contact")} className="btn btn-accent mt-10">
            {t.nav.quote}
          </Link>
        </div>
        <aside>
          <h2 className="mb-4 font-display text-xl font-bold text-forest-900">{t.landscaping.otherServices}</h2>
          <ul className="space-y-3">
            {others.map(({ item, tr: o }) => (
              <li key={item.id}>
                <Link href={href(locale, "service", o.slug)} className="group flex items-center gap-3 rounded-2xl bg-white p-4 shadow-soft hover:bg-leaf-100">
                  <span className="rounded-xl bg-leaf-100 p-2 text-leaf-600 group-hover:bg-white">
                    <ServiceIcon icon={item.icon} width={20} height={20} />
                  </span>
                  <span className="flex-1 font-semibold text-forest-900">{o.name}</span>
                  <ArrowForward width={16} height={16} className="text-ink-400" />
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </>
  );
}
