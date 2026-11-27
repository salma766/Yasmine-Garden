import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getSession } from "@/lib/auth";
import { isLocale, localeInfo } from "@/lib/i18n";

// Fields that must never be sent for translation (URLs, images).
const SKIP = new Set(["image", "logo", "slug"]);

/**
 * AI translation assistant. Returns a suggested translation; it never writes
 * to the database. The admin reviews the suggestion and must approve it
 * before it can be published.
 */
export async function POST(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ error: "not-configured" }, { status: 501 });

  const body = (await req.json()) as { from?: string; to?: string; fields?: Record<string, string> };
  if (!isLocale(body.from) || !isLocale(body.to) || !body.fields) return NextResponse.json({ error: "bad-request" }, { status: 400 });

  const source = Object.fromEntries(Object.entries(body.fields).filter(([k, v]) => !SKIP.has(k) && typeof v === "string" && v.trim()));
  if (Object.keys(source).length === 0) return NextResponse.json({ error: "empty" }, { status: 400 });

  const client = new Anthropic();
  const from = localeInfo[body.from].label;
  const to = localeInfo[body.to].label;
  const system =
    `You translate website content for Pépinière Yasmine Gardens, a plant nursery and landscaping company in Nabeul, Tunisia. ` +
    `Translate from ${from} to ${to}. Keep the meaning, tone and formatting (line breaks, "- " list markers, "### " headings). ` +
    `Use natural, professional ${to} suited to customers in Tunisia and abroad. Keep botanical Latin names, phone numbers, emails and place names as they are` +
    (body.to === "ar" ? ", and write Modern Standard Arabic." : ".") +
    ` SEO titles should stay under 60 characters and meta descriptions under 160 characters. ` +
    `Reply with only a JSON object that has exactly the same keys as the input, with translated string values.`;

  try {
    const response = await client.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 16000,
      output_config: { effort: "low" },
      system,
      messages: [{ role: "user", content: JSON.stringify(source, null, 2) }],
    });
    if (response.stop_reason === "refusal") return NextResponse.json({ error: "failed" }, { status: 502 });
    const text = response.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
    const parsed = JSON.parse(json) as Record<string, unknown>;
    const fields: Record<string, string> = {};
    for (const k of Object.keys(source)) if (typeof parsed[k] === "string") fields[k] = parsed[k] as string;
    return NextResponse.json({ fields });
  } catch (e) {
    if (e instanceof Anthropic.APIError) return NextResponse.json({ error: "failed", status: e.status }, { status: 502 });
    return NextResponse.json({ error: "failed" }, { status: 502 });
  }
}
