import "server-only";
import { cache } from "react";
import fr, { type Messages } from "@/messages/fr";
import en from "@/messages/en";
import it from "@/messages/it";
import ar from "@/messages/ar";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "./i18n";
import { prisma } from "./db";

export const dictionaries: Record<Locale, Messages> = { fr, en, it, ar };

type Flat = Record<string, string>;

export function flatten(obj: unknown, prefix = "", out: Flat = {}): Flat {
  if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      flatten(v, prefix ? `${prefix}.${k}` : k, out);
    }
  } else if (typeof obj === "string") {
    out[prefix] = obj;
  }
  return out;
}

function setPath(obj: Record<string, unknown>, path: string, value: string) {
  const keys = path.split(".");
  let cur: Record<string, unknown> = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const next = cur[keys[i]];
    if (!next || typeof next !== "object") return;
    cur = next as Record<string, unknown>;
  }
  if (typeof cur[keys[keys.length - 1]] === "string") cur[keys[keys.length - 1]] = value;
}

/**
 * Interface texts for a language: the built-in dictionary, with any
 * overrides an administrator saved in "Interface texts" applied on top.
 */
export const getMessages = cache(async (locale: Locale): Promise<Messages> => {
  // Requests like /apple-touch-icon.png reach [locale] with a non-locale value.
  if (!isLocale(locale)) notFound();
  const base = structuredClone(dictionaries[locale]);
  try {
    const overrides = await prisma.uiTranslation.findMany({ where: { locale } });
    for (const o of overrides) if (o.value.trim()) setPath(base as unknown as Record<string, unknown>, o.key, o.value);
  } catch {
    // Database unavailable: fall back to built-in texts.
  }
  return base;
});
