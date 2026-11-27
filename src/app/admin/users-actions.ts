"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Prisma, type AdminRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin, requireAdministrator } from "@/lib/auth";

const MIN_PASSWORD = 8;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const roleOf = (v: string): AdminRole => (v === "ADMIN" ? "ADMIN" : "EDITOR");

function back(path: string, param: "ok" | "error", key: string): never {
  revalidatePath(path);
  redirect(`${path}?${param}=${key}`);
}

async function otherAdmins(excludeId: string) {
  return prisma.adminUser.count({ where: { role: "ADMIN", id: { not: excludeId } } });
}

// ---------------------------------------------------------------- users (administrators only)
export async function createUser(formData: FormData) {
  await requireAdministrator();
  const email = str(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  const name = str(formData, "name") || null;
  if (!EMAIL_RE.test(email)) back("/admin/users", "error", "emailInvalid");
  if (password.length < MIN_PASSWORD) back("/admin/users", "error", "passwordShort");
  try {
    await prisma.adminUser.create({
      data: { email, name, role: roleOf(str(formData, "role")), passwordHash: await bcrypt.hash(password, 10) },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") back("/admin/users", "error", "emailTaken");
    throw e;
  }
  back("/admin/users", "ok", "createdOk");
}

export async function updateUser(formData: FormData) {
  await requireAdministrator();
  const id = str(formData, "id");
  const user = await prisma.adminUser.findUnique({ where: { id } });
  if (!user) back("/admin/users", "error", "lastAdmin");
  const email = str(formData, "email").toLowerCase();
  const role = roleOf(str(formData, "role"));
  const password = String(formData.get("password") ?? "");
  if (!EMAIL_RE.test(email)) back("/admin/users", "error", "emailInvalid");
  if (password && password.length < MIN_PASSWORD) back("/admin/users", "error", "passwordShort");
  if (user.role === "ADMIN" && role !== "ADMIN" && (await otherAdmins(id)) === 0) back("/admin/users", "error", "lastAdmin");
  try {
    await prisma.adminUser.update({
      where: { id },
      data: {
        email,
        name: str(formData, "name") || null,
        role,
        ...(password ? { passwordHash: await bcrypt.hash(password, 10) } : {}),
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") back("/admin/users", "error", "emailTaken");
    throw e;
  }
  back("/admin/users", "ok", "saved");
}

export async function deleteUser(formData: FormData) {
  const me = await requireAdministrator();
  const id = str(formData, "id");
  if (id === me.sub) back("/admin/users", "error", "cannotDeleteSelf");
  const user = await prisma.adminUser.findUnique({ where: { id } });
  if (!user) back("/admin/users", "ok", "deleted");
  if (user.role === "ADMIN" && (await otherAdmins(id)) === 0) back("/admin/users", "error", "lastAdmin");
  await prisma.adminUser.delete({ where: { id } });
  back("/admin/users", "ok", "deleted");
}

// ---------------------------------------------------------------- own account (everyone)
export async function updateOwnName(formData: FormData) {
  const me = await requireAdmin();
  await prisma.adminUser.update({ where: { id: me.sub }, data: { name: str(formData, "name") || null } });
  back("/admin/account", "ok", "nameSaved");
}

export async function changeOwnPassword(formData: FormData) {
  const me = await requireAdmin();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const user = await prisma.adminUser.findUnique({ where: { id: me.sub } });
  if (!user || !(await bcrypt.compare(current, user.passwordHash))) back("/admin/account", "error", "wrongPassword");
  if (next.length < MIN_PASSWORD) back("/admin/account", "error", "passwordShort");
  if (next !== confirm) back("/admin/account", "error", "mismatch");
  await prisma.adminUser.update({ where: { id: me.sub }, data: { passwordHash: await bcrypt.hash(next, 10) } });
  back("/admin/account", "ok", "changed");
}
