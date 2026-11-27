import Link from "next/link";
import { headers } from "next/headers";
import { isLocale, href, defaultLocale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";

export default async function NotFound() {
  const h = await headers();
  const l = h.get("x-locale");
  const locale = isLocale(l) ? l : defaultLocale;
  const t = await getMessages(locale);
  return (
    <section className="container-page flex min-h-[55vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-display text-7xl font-bold text-leaf-500">404</p>
      <h1 className="mt-4 font-display text-3xl font-bold text-forest-900">{t.notFound.title}</h1>
      <p className="mt-3 max-w-md text-ink-600">{t.notFound.text}</p>
      <Link href={href(locale, "home")} className="btn btn-primary mt-8">
        {t.notFound.back}
      </Link>
    </section>
  );
}
