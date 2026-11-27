import type { Metadata } from "next";
import { staticAlternates, type Locale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { getPage, getSettings, isPreview } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageAlternates } from "@/components/site/LocaleNav";
import { PageHero } from "@/components/site/ui";
import { ClockIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/Icons";
import { ContactForm } from "./ContactForm";

type Props = { params: Promise<{ locale: Locale }>; searchParams: Promise<Record<string, string | undefined>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const [t, data] = await Promise.all([getMessages(locale), getPage("contact", locale)]);
  return buildMetadata({
    locale,
    alternates: staticAlternates("contact"),
    title: data?.tr?.seoTitle || data?.tr?.title || t.contact.title,
    description: data?.tr?.seoDescription || t.contact.intro,
  });
}

export default async function Contact({ params, searchParams }: Props) {
  const { locale } = await params;
  const preview = await isPreview(searchParams);
  const [t, data, settings] = await Promise.all([getMessages(locale), getPage("contact", locale, preview), getSettings(locale)]);
  const s = settings.base;
  const tr = settings.tr;
  const mapSrc = s?.mapEmbedUrl || `https://www.google.com/maps?q=${encodeURIComponent("HH4P+G6X Bouargoub, Tunisia")}&hl=${locale}&output=embed`;
  const c = t.contact;

  return (
    <>
      <PageAlternates value={staticAlternates("contact")} />
      <PageHero title={data?.tr?.title || c.title} subtitle={data?.tr?.subtitle || c.intro} />
      <section className="container-page grid gap-10 py-16 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          {tr?.address && (
            <InfoCard icon={<PinIcon />} title={c.address}>
              <p className="whitespace-pre-line">{tr.address}</p>
              {s?.mapLink && (
                <a href={s.mapLink} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block font-semibold text-leaf-600 hover:underline">
                  {c.directions}
                </a>
              )}
            </InfoCard>
          )}
          {s?.phones && s.phones.length > 0 && (
            <InfoCard icon={<PhoneIcon />} title={c.phone}>
              {s.phones.map((p) => (
                <a key={p} href={`tel:${p.replace(/\s/g, "")}`} dir="ltr" className="block hover:text-forest-800">
                  {p}
                </a>
              ))}
            </InfoCard>
          )}
          {s?.email && (
            <InfoCard icon={<MailIcon />} title={c.email}>
              <a href={`mailto:${s.email}`} dir="ltr" className="hover:text-forest-800">
                {s.email}
              </a>
            </InfoCard>
          )}
          {tr?.openingHours && (
            <InfoCard icon={<ClockIcon />} title={c.hours}>
              <p>{tr.openingHours}</p>
            </InfoCard>
          )}
        </div>
        <div className="lg:col-span-3">
          <ContactForm
            locale={locale}
            labels={{
              formTitle: c.formTitle,
              name: c.name,
              emailField: c.emailField,
              phoneField: c.phoneField,
              subject: c.subject,
              message: c.message,
              send: c.send,
              sending: c.sending,
              success: c.success,
              errorRequired: c.errorRequired,
              errorEmail: c.errorEmail,
              errorShort: c.errorShort,
              errorGeneric: c.errorGeneric,
            }}
          />
        </div>
      </section>
      <section className="container-page">
        <h2 className="sr-only">{c.mapTitle}</h2>
        <div className="overflow-hidden rounded-3xl shadow-soft">
          <iframe title={c.mapTitle} src={mapSrc} className="h-[420px] w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
        </div>
      </section>
    </>
  );
}

function InfoCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 rounded-2xl bg-white p-6 shadow-soft">
      <span className="h-fit rounded-xl bg-leaf-100 p-3 text-leaf-600">{icon}</span>
      <div className="text-ink-600">
        <h3 className="mb-1 font-bold text-forest-900">{title}</h3>
        {children}
      </div>
    </div>
  );
}
