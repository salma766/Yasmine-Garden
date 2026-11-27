import Link from "next/link";
import type { Metadata } from "next";
import { href, staticAlternates, type Locale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { getPage, imageFor, isPreview, listServices } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageAlternates } from "@/components/site/LocaleNav";
import { Empty, Img, PageHero, RichText } from "@/components/site/ui";
import { ArrowForward, ServiceIcon } from "@/components/Icons";

type Props = { params: Promise<{ locale: Locale }>; searchParams: Promise<Record<string, string | undefined>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const [t, data] = await Promise.all([getMessages(locale), getPage("landscaping", locale)]);
  return buildMetadata({
    locale,
    alternates: staticAlternates("landscaping"),
    title: data?.tr?.seoTitle || data?.tr?.title || t.landscaping.title,
    description: data?.tr?.seoDescription || t.landscaping.intro,
  });
}

export default async function Landscaping({ params, searchParams }: Props) {
  const { locale } = await params;
  const preview = await isPreview(searchParams);
  const [t, data, services] = await Promise.all([getMessages(locale), getPage("landscaping", locale, preview), listServices(locale, preview)]);
  const steps = [t.landscaping.step1, t.landscaping.step2, t.landscaping.step3, t.landscaping.step4];
  return (
    <>
      <PageAlternates value={staticAlternates("landscaping")} />
      <PageHero title={data?.tr?.title || t.landscaping.title} subtitle={data?.tr?.subtitle || t.landscaping.intro} image={imageFor(data?.page ?? {}, data?.tr)} />
      {data?.tr?.content && (
        <section className="container-page pt-16">
          <RichText text={data.tr.content} className="max-w-3xl text-lg" />
        </section>
      )}
      <section className="container-page py-16">
        {services.length === 0 ? (
          <Empty text={t.common.noResults} />
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {services.map(({ item, tr }) => (
              <Link key={item.id} href={href(locale, "service", tr.slug)} className="card group grid sm:grid-cols-5">
                <div className="aspect-[4/3] overflow-hidden bg-leaf-100 sm:col-span-2 sm:aspect-auto">
                  <Img src={imageFor(item, tr)} alt={tr.name ?? ""} className="transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="flex flex-col p-6 sm:col-span-3">
                  <span className="mb-3 inline-flex w-fit rounded-xl bg-leaf-100 p-2.5 text-leaf-600">
                    <ServiceIcon icon={item.icon} width={22} height={22} />
                  </span>
                  <h2 className="font-display text-2xl font-bold text-forest-900">{tr.name}</h2>
                  <p className="mt-2 text-ink-600">{tr.shortDescription}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-4 font-semibold text-forest-800 group-hover:text-leaf-600">
                    {t.common.learnMore} <ArrowForward width={16} height={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
      <section className="bg-cream-100 py-16">
        <div className="container-page">
          <h2 className="mb-10 font-display text-3xl font-bold text-forest-900">{t.landscaping.process}</h2>
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s} className="rounded-2xl bg-white p-6 shadow-soft">
                <span className="font-display text-4xl font-bold text-leaf-500">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-3 font-semibold text-forest-900">{s}</p>
              </li>
            ))}
          </ol>
          <Link href={href(locale, "contact")} className="btn btn-accent mt-10">
            {t.nav.quote}
          </Link>
        </div>
      </section>
    </>
  );
}
