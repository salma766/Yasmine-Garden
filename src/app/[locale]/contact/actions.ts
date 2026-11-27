"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { isLocale } from "@/lib/i18n";

export type ContactState = {
  ok: boolean;
  errors?: Partial<Record<"name" | "email" | "message" | "form", "required" | "email" | "short" | "generic">>;
  values?: Record<string, string>;
};

const schema = z.object({
  name: z.string().trim().min(1, "required").max(120),
  email: z.string().trim().min(1, "required").email("email").max(200),
  phone: z.string().trim().max(40).optional(),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(1, "required").min(10, "short").max(5000),
});

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const raw = Object.fromEntries(["name", "email", "phone", "subject", "message", "locale", "website"].map((k) => [k, String(formData.get(k) ?? "")]));
  // Honeypot field: bots fill it, people do not see it.
  if (raw.website) return { ok: true };
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const errors: ContactState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as "name" | "email" | "message";
      if (!errors[field]) errors[field] = issue.message as "required" | "email" | "short";
    }
    return { ok: false, errors, values: raw };
  }
  try {
    await prisma.contactMessage.create({
      data: { ...parsed.data, phone: parsed.data.phone || null, subject: parsed.data.subject || null, locale: isLocale(raw.locale) ? raw.locale : "fr" },
    });
    return { ok: true };
  } catch {
    return { ok: false, errors: { form: "generic" }, values: raw };
  }
}
