import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { SignJWT, jwtVerify } from "jose";
import type { AdminRole } from "@prisma/client";
import { prisma } from "./db";

export const SESSION_COOKIE = "yg_admin";
const MAX_AGE = 60 * 60 * 12; // 12 hours

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) throw new Error("AUTH_SECRET must be set (at least 16 characters).");
  return new TextEncoder().encode(s);
}

export type Session = { sub: string; email: string; name?: string | null };

export async function createSession(user: Session) {
  const token = await new SignJWT({ email: user.email, name: user.name ?? null })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.sub)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return { sub: String(payload.sub), email: String(payload.email), name: (payload.name as string) ?? null };
  } catch {
    return null;
  }
}

export type CurrentUser = Session & { role: AdminRole };

/**
 * The signed-in user, read from the database on every request so that a
 * role change or a deleted account takes effect immediately.
 */
export const currentUser = cache(async (): Promise<CurrentUser | null> => {
  const s = await getSession();
  if (!s) return null;
  const user = await prisma.adminUser.findUnique({ where: { id: s.sub }, select: { id: true, email: true, name: true, role: true } });
  if (!user) return null;
  return { sub: user.id, email: user.email, name: user.name, role: user.role };
});

/** Any signed-in user (administrator or editor). */
export async function requireAdmin(): Promise<CurrentUser> {
  const u = await currentUser();
  if (!u) redirect("/admin/login");
  return u;
}

/** Administrators only (user management). */
export async function requireAdministrator(): Promise<CurrentUser> {
  const u = await requireAdmin();
  if (u.role !== "ADMIN") redirect("/admin");
  return u;
}
