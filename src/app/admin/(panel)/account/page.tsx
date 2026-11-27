import { getAdminT } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth";
import { changeOwnPassword, updateOwnName } from "@/app/admin/users-actions";
import { Notice } from "@/components/admin/Notice";

type Props = { searchParams: Promise<{ ok?: string; error?: string }> };

export default async function AccountPage({ searchParams }: Props) {
  const me = await requireAdmin();
  const { t } = await getAdminT();
  const a = t.admin.accountPage;
  const u = t.admin.usersPage;
  const sp = await searchParams;
  const msg = (k?: string) => (!k ? undefined : k in a ? a[k as keyof typeof a] : k in u ? u[k as keyof typeof u] : undefined);

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-forest-900">{a.title}</h1>
        <p className="mt-1 text-ink-600">{a.intro}</p>
        <p className="mt-2 text-sm text-ink-600">
          <span dir="ltr">{me.email}</span> ·{" "}
          <span className="rounded-full bg-leaf-100 px-2 py-0.5 text-xs font-semibold text-forest-800">{me.role === "ADMIN" ? u.roleAdmin : u.roleEditor}</span>
        </p>
      </div>
      <Notice ok={msg(sp.ok)} error={msg(sp.error)} />

      <form action={updateOwnName} className="space-y-4 rounded-2xl bg-white p-5 shadow-soft">
        <label className="block text-sm font-medium">{u.name}<input name="name" defaultValue={me.name ?? ""} className="input mt-1" /></label>
        <button className="btn btn-outline !py-2">{a.saveName}</button>
      </form>

      <form action={changeOwnPassword} className="space-y-4 rounded-2xl bg-white p-5 shadow-soft">
        <label className="block text-sm font-medium">{a.currentPassword}<input name="current" type="password" required dir="ltr" className="input mt-1" autoComplete="current-password" /></label>
        <label className="block text-sm font-medium">{a.newPassword}<input name="password" type="password" required minLength={8} dir="ltr" className="input mt-1" autoComplete="new-password" /></label>
        <label className="block text-sm font-medium">{a.confirmPassword}<input name="confirm" type="password" required minLength={8} dir="ltr" className="input mt-1" autoComplete="new-password" /></label>
        <button className="btn btn-primary !py-2">{a.change}</button>
      </form>
    </div>
  );
}
