import Link from "next/link";
import type { Metadata } from "next";
import { href, staticAlternates, type Locale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { getPage, getSettings, imageFor, isPreview, listCategories, listClients, listGallery, listProducts, listProjects, listServices } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageAlternates } from "@/components/site/LocaleNav";
import { Card, Img, RichText, SectionHeading } from "@/components/site/ui";
import { ArrowForward, ClockIcon, KeyIcon, LeafIcon, PhoneIcon, PinIcon, ServiceIcon, StarIcon, UsersIcon } from "@/components/Icons";

type Props = { params: Promise<{ locale: Locale }>; searchParams: Promise<Record<string, string | undefined>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const data = await getPage("home", locale);
  return buildMetadata({
    locale,
    alternates: staticAlternates("home"),
    title: null,
    description: data?.tr?.seoDescription,
    image: data?.page.image,
  });
}

export default async function Home({ params, searchParams }: Props) {
  const { locale } = await params;
  const preview = await isPreview(searchParams);
  const [t, home, about, settings, categories, featured, services, projects, clients, gallery] = await Promise.all([
    getMessages(locale),
    getPage("home", locale, preview),
    getPage("about", locale, preview),
    getSettings(locale),
    listCategories(locale, preview),
    listProducts(locale, { featured: true, limit: 4 }, preview),
    listServices(locale, preview, { featured: true }),
    listProjects(locale, { featured: true, limit: 3 }, preview),
    listClients(locale, preview),
    listGallery(locale, preview, 5),
  ]);
  const heroImage = imageFor(home?.page ?? {}, home?.tr) || "/images/placeholders/hero.svg";
  const s = settings.base;

  const why = [
    { icon: LeafIcon, title: t.home.why1Title, text: t.home.why1Text },
    { icon: StarIcon, title: t.home.why2Title, text: t.home.why2Text },
    { icon: UsersIcon, title: t.home.why3Title, text: t.home.why3Text },
    { icon: KeyIcon, title: t.home.why4Title, text: t.home.why4Text },
  ];

  return (
    <>
      <PageAlternates value={staticAlternates("home")} />
      {preview && <div className="bg-terracotta-500 py-2 text-center text-sm text-white">{t.common.previewBanner}</div>}

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-forest-950 text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={heroImage} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 -z-10 from-forest-950/90 via-forest-950/60 to-transparent ltr:bg-gradient-to-r rtl:bg-gradient-to-l" />
        <div className="container-page flex min-h-[78vh] flex-col justify-center py-20">
          <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur">
            <LeafIcon width={16} height={16} /> {t.home.heroEyebrow}
          </p>
          <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{home?.tr?.title || t.meta.siteName}</h1>
          {home?.tr?.subtitle && <p className="mt-6 max-w-2xl text-lg text-white/85 md:text-xl">{home.tr.subtitle}</p>}
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={href(locale, "plants")} className="btn btn-accent">
              {t.home.ctaPlants}
              <ArrowForward width={18} height={18} />
            </Link>
            <Link href={href(locale, "contact")} className="btn btn-ghost">
              {t.home.ctaQuote}
            </Link>
          </div>
          <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/80">
            {settings.tr?.openingHours && (
              <span className="flex items-center gap-2">
                <ClockIcon width={16} height={16} /> {settings.tr.openingHours}
              </span>
            )}
            {s?.phones?.[0] && (
              <a href={`tel:${s.phones[0].replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-white">
                <PhoneIcon width={16} height={16} /> <span dir="ltr">{s.phones[0]}</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Company presentation */}
      <section className="container-page grid items-center gap-12 py-20 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-leaf-600 rtl:tracking-normal">{t.nav.about}</p>
          <h2 className="font-display text-3xl font-bold text-forest-900 md:text-4xl">{about?.tr?.title}</h2>
          <RichText text={home?.tr?.content || about?.tr?.subtitle} className="mt-5 text-lg" />
          <Link href={href(locale, "about")} className="btn btn-outline mt-8">
            {t.common.learnMore}
            <ArrowForward width={18} height={18} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {why.map(({ icon: I, title, text }) => (
            <div key={title} className="rounded-2xl bg-white p-6 shadow-soft">
              <span className="mb-4 inline-flex rounded-xl bg-leaf-100 p-3 text-leaf-600">
                <I width={22} height={22} />
              </span>
              <h3 className="font-bold text-forest-900">{title}</h3>
              <p className="mt-1.5 text-sm text-ink-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="bg-cream-100 py-20">
          <div className="container-page">
            <SectionHeading title={t.home.categoriesTitle} action={{ href: href(locale, "plants"), label: t.common.viewAll }} />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {categories.map(({ item, tr }) => (
                <Link key={item.id} href={href(locale, "plantCategory", tr.slug)} className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-forest-800 shadow-soft">
                  <Img src={imageFor(item, tr)} alt={tr.name ?? ""} className="opacity-85 transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/10 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-4 font-semibold text-white">{tr.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured plants */}
      {featured.length > 0 && (
        <section className="container-page py-20">
          <SectionHeading title={t.home.featuredTitle} action={{ href: href(locale, "plants"), label: t.common.viewAll }} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map(({ item, tr }) => (
              <Card
                key={item.id}
                href={href(locale, "product", tr.slug)}
                image={imageFor(item, tr)}
                title={tr.name ?? ""}
                text={tr.shortDescription}
                meta={item.category ? (item.category.translations.find((c) => c.locale === locale)?.name ?? null) : null}
                cta={t.common.viewDetails}
              />
            ))}
          </div>
        </section>
      )}

      {/* Services */}
      {services.length > 0 && (
        <section className="bg-forest-900 py-20 text-white">
          <div className="container-page">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <h2 className="font-display text-3xl font-bold md:text-4xl">{t.home.servicesTitle}</h2>
              <Link href={href(locale, "landscaping")} className="inline-flex items-center gap-2 font-semibold text-sage-300 hover:text-white">
                {t.common.viewAll} <ArrowForward width={18} height={18} />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map(({ item, tr }) => (
                <Link key={item.id} href={href(locale, "service", tr.slug)} className="group rounded-2xl border border-white/10 bg-white/5 p-7 transition-colors hover:bg-white/10">
                  <span className="mb-5 inline-flex rounded-xl bg-leaf-500/20 p-3 text-sage-300">
                    <ServiceIcon icon={item.icon} width={26} height={26} />
                  </span>
                  <h3 className="text-xl font-bold">{tr.name}</h3>
                  <p className="mt-2 text-sm text-white/70">{tr.shortDescription}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-sage-300 group-hover:text-white">
                    {t.common.learnMore} <ArrowForward width={16} height={16} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="container-page py-20">
          <SectionHeading title={t.home.projectsTitle} action={{ href: href(locale, "projects"), label: t.common.viewAll }} />
          <div className="grid gap-6 md:grid-cols-3">
            {projects.map(({ item, tr }) => (
              <Card key={item.id} href={href(locale, "project", tr.slug)} image={imageFor(item, tr)} title={tr.title ?? ""} text={tr.summary} meta={tr.location} cta={t.common.viewDetails} />
            ))}
          </div>
        </section>
      )}

      {/* Clients */}
      {clients.length > 0 && (
        <section className="bg-cream-100 py-16">
          <div className="container-page">
            <h2 className="mb-8 text-center font-display text-2xl font-bold text-forest-900">{t.home.clientsTitle}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {clients.map(({ item, tr }) => (
                <div key={item.id} className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-soft">
                  {item.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.logo} alt={tr.name ?? ""} className="h-12 w-12 shrink-0 rounded-lg object-contain" />
                  ) : (
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-leaf-100 font-bold text-leaf-600">{(tr.name ?? "?").slice(0, 1)}</span>
                  )}
                  <div>
                    <p className="font-semibold text-forest-900">{tr.name}</p>
                    <p className="mt-1 text-sm text-ink-600">{tr.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery teaser */}
      {gallery.length > 0 && (
        <section className="container-page py-20">
          <SectionHeading title={t.home.galleryTitle} action={{ href: href(locale, "gallery"), label: t.common.viewAll }} />
          <div className="grid auto-rows-[180px] grid-cols-2 gap-4 md:auto-rows-[240px] md:grid-cols-3">
            {gallery.map(({ item, tr }, i) => (
              <Link key={item.id} href={href(locale, "gallery")} className={`group relative overflow-hidden rounded-2xl bg-leaf-100 ${i === 0 ? "row-span-2" : ""}`}>
                <Img src={imageFor(item, tr)} alt={tr.alt || tr.title || ""} className="transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-950/80 to-transparent p-4 text-sm font-semibold text-white">{tr.title}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Call to action + visit */}
      <section className="container-page">
        <div className="grid overflow-hidden rounded-3xl bg-leaf-600 text-white lg:grid-cols-2">
          <div className="p-10 md:p-14">
            <h2 className="font-display text-3xl font-bold md:text-4xl">{t.home.ctaTitle}</h2>
            <p className="mt-4 text-lg text-white/85">{t.home.ctaText}</p>
            <Link href={href(locale, "contact")} className="btn mt-8 bg-white text-forest-900 hover:bg-cream-100">
              {t.nav.quote} <ArrowForward width={18} height={18} />
            </Link>
          </div>
          <div className="bg-forest-800 p-10 md:p-14">
            <h3 className="text-xl font-bold">{t.home.visitTitle}</h3>
            <ul className="mt-5 space-y-4 text-white/85">
              {settings.tr?.address && (
                <li className="flex gap-3">
                  <PinIcon className="mt-1 shrink-0" /> <span className="whitespace-pre-line">{settings.tr.address}</span>
                </li>
              )}
              {settings.tr?.openingHours && (
                <li className="flex gap-3">
                  <ClockIcon className="mt-1 shrink-0" /> {settings.tr.openingHours}
                </li>
              )}
              {(s?.phones ?? []).map((p) => (
                <li key={p} className="flex gap-3">
                  <PhoneIcon className="mt-1 shrink-0" />
                  <a href={`tel:${p.replace(/\s/g, "")}`} dir="ltr" className="hover:text-white">
                    {p}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
