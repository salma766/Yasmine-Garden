import type { ReactNode } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getAdminT } from "@/lib/admin";
import { entityOrder } from "@/lib/entities";
import { prisma } from "@/lib/db";
import { logout } from "../actions";
import { AdminLanguagePicker } from "@/components/admin/AdminLanguagePicker";
import { AdminNavLink } from "@/components/admin/AdminNavLink";

export default async function PanelLayout({ children }: { children: ReactNode }) {
  const session = await requireAdmin();
  const { locale, t } = await getAdminT();
  const unread = await prisma.contactMessage.count({ where: { read: false } });
  const a = t.admin;
  const content = entityOrder.filter((k) => k !== "settings");

  return (
    <div className="min-h-screen lg:flex">
      <aside className="bg-forest-950 text-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:overflow-y-auto">
        <div className="flex items-center justify-between gap-2 p-5">
          <Link href="/admin" className="font-bold leading-tight">
            <span className="block text-xs font-semibold uppercase tracking-wider text-sage-300">{a.title}</span>
            {t.meta.siteName}
          </Link>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 text-sm lg:flex-col lg:overflow-visible">
          <AdminNavLink href="/admin" exact>{a.dashboard}</AdminNavLink>
          <AdminNavLink href="/admin/translations">{a.translations}</AdminNavLink>
          <AdminNavLink href="/admin/translations/interface">{a.interfaceTexts}</AdminNavLink>
          <p className="hidden px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-white/40 lg:block">{a.content}</p>
          {content.map((k) => (
            <AdminNavLink key={k} href={`/admin/content/${k}`}>{a.entities[k]}</AdminNavLink>
          ))}
          <p className="hidden px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-white/40 lg:block">—</p>
          <AdminNavLink href="/admin/content/settings/1">{a.settings}</AdminNavLink>
          <AdminNavLink href="/admin/messages">
            {a.messages}
            {unread > 0 && <span className="ms-2 rounded-full bg-terracotta-500 px-2 py-0.5 text-[11px] font-bold">{unread}</span>}
          </AdminNavLink>
          {session.role === "ADMIN" && <AdminNavLink href="/admin/users">{a.usersNav}</AdminNavLink>}
          <AdminNavLink href="/admin/account">{a.accountNav}</AdminNavLink>
        </nav>
        <div className="space-y-3 border-t border-white/10 p-5 text-sm">
          <AdminLanguagePicker current={locale} dark />
          <p className="truncate text-white/60" dir="ltr">{session.email}</p>
          <div className="flex gap-3">
            <a href={`/${locale}`} target="_blank" className="text-sage-300 hover:text-white">{a.viewSite} ↗</a>
            <form action={logout}>
              <button className="text-white/70 hover:text-white">{a.signOut}</button>
            </form>
          </div>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">{children}</main>
    </div>
  );
}
