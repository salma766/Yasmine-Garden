import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { getAdminT } from "@/lib/admin";
import { LoginForm } from "./LoginForm";
import { AdminLanguagePicker } from "@/components/admin/AdminLanguagePicker";

export default async function LoginPage() {
  if (await currentUser()) redirect("/admin");
  const { locale, t } = await getAdminT();
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-soft">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-leaf-600">{t.meta.siteName}</p>
            <h1 className="text-xl font-bold text-forest-900">{t.admin.loginTitle}</h1>
          </div>
          <AdminLanguagePicker current={locale} />
        </div>
        <LoginForm labels={{ email: t.admin.email, password: t.admin.password, signIn: t.admin.signIn, bad: t.admin.badCredentials }} />
      </div>
    </div>
  );
}
