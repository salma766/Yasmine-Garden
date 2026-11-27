import { getAdminT } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { isLocale, localeInfo } from "@/lib/i18n";
import { deleteMessage, toggleMessageRead } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

export default async function Messages() {
  const { locale, t } = await getAdminT();
  const a = t.admin;
  const list = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  const fmt = new Intl.DateTimeFormat(locale === "ar" ? "ar-TN" : locale, { dateStyle: "medium", timeStyle: "short" });
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-forest-900">{a.messages}</h1>
      {list.length === 0 && <p className="rounded-2xl bg-white p-8 text-center text-ink-400 shadow-soft">{a.messagesPage.empty}</p>}
      {list.map((m) => (
        <article key={m.id} className={`rounded-2xl bg-white p-5 shadow-soft ${m.read ? "opacity-75" : "ring-2 ring-leaf-500"}`}>
          <header className="mb-3 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-forest-900">{m.subject || "—"}</p>
              <p className="text-sm text-ink-600">
                {a.messagesPage.from} <strong>{m.name}</strong> · <a href={`mailto:${m.email}`} dir="ltr" className="text-leaf-600">{m.email}</a>
                {m.phone && <> · <a href={`tel:${m.phone}`} dir="ltr">{m.phone}</a></>}
              </p>
              <p className="text-xs text-ink-400">
                {a.messagesPage.received} {fmt.format(m.createdAt)} · {a.messagesPage.language}: {isLocale(m.locale) ? localeInfo[m.locale].code : m.locale}
              </p>
            </div>
            <div className="flex gap-2">
              <form action={toggleMessageRead}>
                <input type="hidden" name="id" value={m.id} />
                <button className="rounded-full border border-sand-200 px-3 py-1 text-xs font-semibold hover:bg-leaf-100">{m.read ? "↺" : a.messagesPage.markRead}</button>
              </form>
              <form action={deleteMessage}>
                <input type="hidden" name="id" value={m.id} />
                <ConfirmButton message={a.confirmDelete} className="rounded-full px-3 py-1 text-xs font-semibold text-terracotta-600 hover:bg-terracotta-500/10">{a.delete}</ConfirmButton>
              </form>
            </div>
          </header>
          <p className="whitespace-pre-line text-sm text-ink-900" dir="auto">{m.message}</p>
        </article>
      ))}
    </div>
  );
}
