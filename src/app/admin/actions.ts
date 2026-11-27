"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { createSession, destroySession, requireAdmin } from "@/lib/auth";
import { ADMIN_LOCALE_COOKIE } from "@/lib/admin-locale";
import { entities, isEntityKey, type FieldDef } from "@/lib/entities";
import { delegate } from "@/lib/admin";
import { dictionaries, flatten } from "@/lib/messages";
import { isLocale, slugify } from "@/lib/i18n";

// ---------------------------------------------------------------- auth
export async function login(_prev: { error?: boolean }, formData: FormData): Promise<{ error?: boolean }> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return { error: true };
  await createSession({ sub: user.id, email: user.email, name: user.name });
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

export async function setAdminLocale(formData: FormData) {
  const l = String(formData.get("locale"));
  if (isLocale(l)) (await cookies()).set(ADMIN_LOCALE_COOKIE, l, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  revalidatePath("/admin", "layout");
}

// ---------------------------------------------------------------- content
function coerce(field: FieldDef, formData: FormData): unknown {
  const raw = formData.get(field.key);
  const v = typeof raw === "string" ? raw.trim() : "";
  switch (field.type) {
    case "checkbox":
      return formData.get(field.key) === "on";
    case "number":
      if (!v) return field.key === "sortOrder" ? 0 : null;
      return Number.isFinite(Number(v)) ? Math.trunc(Number(v)) : null;
    case "lines":
      return v.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    default:
      return v || null;
  }
}

function refreshSite() {
  revalidatePath("/", "layout");
}

export type BaseState = { ok?: boolean; error?: string };

export async function saveBase(_prev: BaseState, formData: FormData): Promise<BaseState> {
  await requireAdmin();
  const key = String(formData.get("_entity"));
  const id = String(formData.get("_id"));
  if (!isEntityKey(key)) return { error: "saveError" };
  const cfg = entities[key];
  const data: Record<string, unknown> = {};
  for (const f of cfg.baseFields) data[f.key] = coerce(f, formData);
  const model = delegate(cfg.model);
  if (id === "new") {
    if (!cfg.creatable) return { error: "saveError" };
    const created = await model.create({ data });
    refreshSite();
    redirect(`/admin/content/${key}/${created.id}?saved=1`);
  }
  try {
    await model.update({ where: { id: cfg.idType === "int" ? Number(id) : id }, data });
  } catch {
    return { error: "saveError" };
  }
  refreshSite();
  return { ok: true };
}

export type TrSaveState = {
  ok?: boolean;
  error?: "slugTaken" | "saveError";
  approved?: boolean;
  aiGenerated?: boolean;
  status?: "DRAFT" | "PUBLISHED";
};

/**
 * Saves one language of one item, independently of the others.
 * AI-generated text stays a draft until an administrator approves it, and
 * approval is always an explicit action.
 */
export async function saveTranslation(_prev: TrSaveState, formData: FormData): Promise<TrSaveState> {
  await requireAdmin();
  const key = String(formData.get("_entity"));
  const rawId = String(formData.get("_id"));
  const locale = String(formData.get("_locale"));
  const intent = String(formData.get("_intent") ?? "save");
  const fromAi = formData.get("_ai") === "1";
  if (!isEntityKey(key) || !isLocale(locale)) return { error: "saveError" };
  const cfg = entities[key];
  const entityId = cfg.idType === "int" ? Number(rawId) : rawId;

  const data: Record<string, unknown> = {};
  for (const f of cfg.trFields) data[f.key] = coerce(f, formData);
  const slugField = cfg.trFields.find((f) => f.type === "slug");
  if (slugField && !data[slugField.key] && slugField.slugFrom && data[slugField.slugFrom]) {
    data[slugField.key] = slugify(String(data[slugField.slugFrom]), locale);
  } else if (slugField && data[slugField.key]) {
    data[slugField.key] = slugify(String(data[slugField.key]), locale) || data[slugField.key];
  }

  let status = formData.get("status") === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
  let approved: boolean;
  let aiGenerated: boolean;
  if (intent === "approve") {
    approved = true;
    aiGenerated = fromAi;
  } else if (fromAi) {
    approved = false;
    aiGenerated = true;
    status = "DRAFT";
  } else {
    approved = true;
    aiGenerated = false;
  }

  const payload = { ...data, status, approved, aiGenerated };
  try {
    await delegate(cfg.trModel).upsert({
      where: { entityId_locale: { entityId, locale } },
      create: { entityId, locale, ...payload },
      update: payload,
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") return { error: "slugTaken" };
    return { error: "saveError" };
  }
  refreshSite();
  return { ok: true, approved, aiGenerated, status: status as "DRAFT" | "PUBLISHED" };
}

export async function deleteEntity(formData: FormData) {
  await requireAdmin();
  const key = String(formData.get("_entity"));
  const id = String(formData.get("_id"));
  if (!isEntityKey(key)) return;
  const cfg = entities[key];
  if (!cfg.creatable) return;
  await delegate(cfg.model).delete({ where: { id } });
  refreshSite();
  redirect(`/admin/content/${key}`);
}

// ---------------------------------------------------------------- interface texts
export async function saveUiTexts(_prev: { ok?: boolean }, formData: FormData) {
  await requireAdmin();
  const locale = String(formData.get("_locale"));
  if (!isLocale(locale)) return {};
  const defaults = flatten(dictionaries[locale]);
  const ops = [];
  for (const [name, value] of formData.entries()) {
    if (!name.startsWith("k:")) continue;
    const key = name.slice(2);
    if (!(key in defaults)) continue;
    const v = String(value).trim();
    if (!v || v === defaults[key]) {
      ops.push(prisma.uiTranslation.deleteMany({ where: { key, locale } }));
    } else {
      ops.push(prisma.uiTranslation.upsert({ where: { key_locale: { key, locale } }, create: { key, locale, value: v }, update: { value: v } }));
    }
  }
  await prisma.$transaction(ops);
  refreshSite();
  return { ok: true };
}

// ---------------------------------------------------------------- messages
export async function toggleMessageRead(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const m = await prisma.contactMessage.findUnique({ where: { id } });
  if (m) await prisma.contactMessage.update({ where: { id }, data: { read: !m.read } });
  revalidatePath("/admin", "layout");
}

export async function deleteMessage(formData: FormData) {
  await requireAdmin();
  await prisma.contactMessage.delete({ where: { id: String(formData.get("id")) } }).catch(() => null);
  revalidatePath("/admin", "layout");
}
