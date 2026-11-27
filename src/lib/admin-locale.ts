import "server-only";
import { cookies } from "next/headers";
import { isLocale, type Locale } from "./i18n";

export const ADMIN_LOCALE_COOKIE = "yg_admin_locale";

export async function getAdminLocale(): Promise<Locale> {
  const c = await cookies();
  const v = c.get(ADMIN_LOCALE_COOKIE)?.value ?? c.get("NEXT_LOCALE")?.value;
  return isLocale(v) ? v : "fr";
}
