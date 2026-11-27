import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { currentUser } from "@/lib/auth";

const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/gif", "image/x-icon", "image/vnd.microsoft.icon"];
const MAX = 8 * 1024 * 1024;

/**
 * Image upload for the admin. Uses Vercel Blob when BLOB_READ_WRITE_TOKEN is
 * set (production); otherwise stores files in public/uploads (local dev).
 */
export async function POST(req: Request) {
  if (!(await currentUser())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "no file" }, { status: 400 });
  if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: "type" }, { status: 400 });
  if (file.size > MAX) return NextResponse.json({ error: "size" }, { status: 400 });

  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const base = file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9-]+/g, "-").slice(0, 40) || "image";
  const name = `${Date.now()}-${base}.${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`uploads/${name}`, file, { access: "public", contentType: file.type });
    return NextResponse.json({ url: blob.url });
  }
  if (process.env.VERCEL) {
    return NextResponse.json({ error: "blob-missing" }, { status: 500 });
  }
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: `/uploads/${name}` });
}
