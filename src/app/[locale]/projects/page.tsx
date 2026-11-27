import type { Metadata } from "next";
import { href, staticAlternates, type Locale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { getPage, imageFor, isPreview, listProjectCategories, listProjects } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageAlternates } from "@/components/site/LocaleNav";
import { Card, Empty, PageHero, Pill } from "@/components/site/ui";

type Props = { params: Promise<{ locale: Locale }>; searchParams: Promise<Record<string, string | undefined>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const [t, data] = await Promise.all([getMessages(locale), getPage("projects", locale)]);
  return buildMetadata({
    locale,
    alternates: staticAlternates("projects"),
    title: data?.tr?.seoTitle || data?.tr?.title || t.projects.title,
    description: data?.tr?.seoDescription || t.projects.intro,
  });
}

export default async function Projects({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;
  const preview = await isPreview(searchParams);
  const [t, data, cats, all] = await Promise.all([
    getMessages(locale),
    getPage("projects", locale, preview),
    listProjectCategories(locale, preview),
    listProjects(locale, {}, preview),
  ]);
  const active = sp.type;
  const projects = active ? all.filter(({ item }) => item.categoryId === active) : all;
  const base = href(locale, "projects");
  return (
    <>
      <PageAlternates value={staticAlternates("projects")} />
      <PageHero title={data?.tr?.title || t.projects.title} subtitle={data?.tr?.subtitle || t.projects.intro} image={imageFor(data?.page ?? {}, data?.tr)} />
      <section className="container-page py-14">
        {cats.length > 0 && (
          <div className="mb-10 flex flex-wrap gap-2">
            <Pill href={base} active={!active}>
              {t.common.all}
            </Pill>
            {cats.map(({ item, tr }) => (
              <Pill key={item.id} href={`${base}?type=${item.id}`} active={active === item.id}>
                {tr.name}
              </Pill>
            ))}
          </div>
        )}
        {projects.length === 0 ? (
          <Empty text={t.common.noResults} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map(({ item, tr }) => (
              <Card
                key={item.id}
                href={href(locale, "project", tr.slug)}
                image={imageFor(item, tr)}
                title={tr.title ?? ""}
                text={tr.summary}
                meta={[item.category?.translations.find((c) => c.locale === locale)?.name, item.year].filter(Boolean).join(" · ")}
                cta={t.common.viewDetails}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
