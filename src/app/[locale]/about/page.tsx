import type { Metadata } from "next";
import { staticAlternates, type Locale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { getPage, imageFor, isPreview } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageAlternates } from "@/components/site/LocaleNav";
import { Img, PageHero, RichText } from "@/components/site/ui";
import { LeafIcon, StarIcon, UsersIcon } from "@/components/Icons";

type Props = { params: Promise<{ locale: Locale }>; searchParams: Promise<Record<string, string | undefined>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const [t, data] = await Promise.all([getMessages(locale), getPage("about", locale)]);
  return buildMetadata({
    locale,
    alternates: staticAlternates("about"),
    title: data?.tr?.seoTitle || data?.tr?.title || t.about.title,
    description: data?.tr?.seoDescription || data?.tr?.subtitle,
    image: data?.page.image,
  });
}

export default async function About({ params, searchParams }: Props) {
  const { locale } = await params;
  const preview = await isPreview(searchParams);
  const [t, data] = await Promise.all([getMessages(locale), getPage("about", locale, preview)]);
  const image = imageFor(data?.page ?? {}, data?.tr);
  const values = [
    { icon: StarIcon, label: t.about.value1 },
    { icon: LeafIcon, label: t.about.value2 },
    { icon: UsersIcon, label: t.about.value3 },
  ];
  return (
    <>
      <PageAlternates value={staticAlternates("about")} />
      <PageHero title={data?.tr?.title || t.about.title} subtitle={data?.tr?.subtitle} image={image} />
      <section className="container-page grid gap-12 py-20 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RichText text={data?.tr?.content} className="text-lg leading-relaxed" />
        </div>
        <aside className="lg:col-span-2">
          <div className="overflow-hidden rounded-3xl shadow-soft">
            <div className="aspect-[4/3]">
              <Img src={image} alt={data?.tr?.title || ""} />
            </div>
          </div>
          <div className="mt-8 rounded-3xl bg-white p-8 shadow-soft">
            <h2 className="mb-5 font-display text-2xl font-bold text-forest-900">{t.about.valuesTitle}</h2>
            <ul className="space-y-4">
              {values.map(({ icon: I, label }) => (
                <li key={label} className="flex items-center gap-3">
                  <span className="rounded-xl bg-leaf-100 p-2.5 text-leaf-600">
                    <I width={20} height={20} />
                  </span>
                  <span className="font-medium">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
}
