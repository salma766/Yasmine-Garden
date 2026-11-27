import { getAdminT } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { requireAdministrator } from "@/lib/auth";
import { createUser, deleteUser, updateUser } from "@/app/admin/users-actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Notice } from "@/components/admin/Notice";

type Props = { searchParams: Promise<{ ok?: string; error?: string }> };

export default async function UsersPage({ searchParams }: Props) {
  const me = await requireAdministrator();
  const { locale, t } = await getAdminT();
  const u = t.admin.usersPage;
  const sp = await searchParams;
  const msg = (k?: string) => (k && k in u ? u[k as keyof typeof u] : undefined);
  const users = await prisma.adminUser.findMany({ orderBy: [{ role: "asc" }, { createdAt: "asc" }] });
  const fmt = new Intl.DateTimeFormat(locale === "ar" ? "ar-TN" : locale, { dateStyle: "medium" });

  const RoleSelect = ({ value }: { value: string }) => (
    <select name="role" defaultValue={value} className="input mt-1">
      <option value="EDITOR">{u.roleEditor}</option>
      <option value="ADMIN">{u.roleAdmin}</option>
    </select>
  );

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-forest-900">{u.title}</h1>
        <p className="mt-1 text-ink-600">{u.intro}</p>
      </div>
      <Notice ok={msg(sp.ok)} error={msg(sp.error)} />

      <ul className="grid gap-2 text-sm text-ink-600 sm:grid-cols-2">
        <li className="rounded-xl bg-white p-3 shadow-soft"><strong className="text-forest-900">{u.roleAdmin}</strong> : {u.roleAdminHint}</li>
        <li className="rounded-xl bg-white p-3 shadow-soft"><strong className="text-forest-900">{u.roleEditor}</strong> : {u.roleEditorHint}</li>
      </ul>

      <section className="rounded-2xl bg-white p-5 shadow-soft">
        <h2 className="mb-4 font-bold text-forest-900">{u.add}</h2>
        <form action={createUser} className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">{u.name}<input name="name" className="input mt-1" autoComplete="off" /></label>
          <label className="block text-sm font-medium">{u.email}<input name="email" type="email" required dir="ltr" className="input mt-1" autoComplete="off" /></label>
          <label className="block text-sm font-medium">{u.password}<input name="password" type="password" required minLength={8} dir="ltr" className="input mt-1" autoComplete="new-password" /></label>
          <label className="block text-sm font-medium">{u.role}<RoleSelect value="EDITOR" /></label>
          <div className="sm:col-span-2"><button className="btn btn-primary !py-2">{u.create}</button></div>
        </form>
      </section>

      <section className="space-y-3">
        {users.map((user) => (
          <details key={user.id} className="group rounded-2xl bg-white shadow-soft">
            <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 p-4">
              <span className="min-w-0">
                <span className="block font-semibold text-forest-900">
                  {user.name || user.email}
                  {user.id === me.sub && <span className="ms-2 text-xs font-normal text-ink-400">({u.you})</span>}
                </span>
                <span className="block truncate text-sm text-ink-600" dir="ltr">{user.email}</span>
              </span>
              <span className="flex items-center gap-3 text-xs">
                <span className="text-ink-400">{u.created} {fmt.format(user.createdAt)}</span>
                <span className={`rounded-full px-3 py-1 font-semibold ${user.role === "ADMIN" ? "bg-forest-800 text-white" : "bg-leaf-100 text-forest-800"}`}>
                  {user.role === "ADMIN" ? u.roleAdmin : u.roleEditor}
                </span>
                <span className="text-ink-400 transition-transform group-open:rotate-180">▾</span>
              </span>
            </summary>
            <div className="border-t border-sand-200 p-4">
              <form action={updateUser} className="grid gap-4 sm:grid-cols-2">
                <input type="hidden" name="id" value={user.id} />
                <label className="block text-sm font-medium">{u.name}<input name="name" defaultValue={user.name ?? ""} className="input mt-1" /></label>
                <label className="block text-sm font-medium">{u.email}<input name="email" type="email" required defaultValue={user.email} dir="ltr" className="input mt-1" /></label>
                <label className="block text-sm font-medium">
                  {u.newPassword}
                  <input name="password" type="password" minLength={8} dir="ltr" className="input mt-1" autoComplete="new-password" />
                  <span className="mt-1 block text-xs font-normal text-ink-400">{u.passwordHint}</span>
                </label>
                <label className="block text-sm font-medium">{u.role}<RoleSelect value={user.role} /></label>
                <div className="sm:col-span-2"><button className="btn btn-primary !py-2">{u.save}</button></div>
              </form>
              {user.id !== me.sub && (
                <form action={deleteUser} className="mt-3 border-t border-sand-200 pt-3">
                  <input type="hidden" name="id" value={user.id} />
                  <ConfirmButton message={u.confirmDelete} className="rounded-full px-3 py-1 text-sm font-semibold text-terracotta-600 hover:bg-terracotta-500/10">
                    {t.admin.delete}
                  </ConfirmButton>
                </form>
              )}
            </div>
          </details>
        ))}
      </section>
    </div>
  );
}
