import type { Messages } from "@/messages/fr";

/** Resolve a dotted message path such as "admin.fields.name". */
export function tp(t: Messages, path: string): string {
  const v = path.split(".").reduce<unknown>((o, k) => (o && typeof o === "object" ? (o as Record<string, unknown>)[k] : undefined), t);
  return typeof v === "string" ? v : path;
}
