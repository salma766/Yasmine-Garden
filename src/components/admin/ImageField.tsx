"use client";

import { useRef, useState } from "react";

export type ImageSizeInfo = {
  w: number;
  h: number;
  ratio: string;
  flexible?: boolean;
  tip: string;
  labels: { recommended: string; px: string; tooSmall: string; ratioOff: string; good: string };
};

const fill = (s: string, w: number, h: number) => s.replace("{w}", String(w)).replace("{h}", String(h));

function verdict(size: ImageSizeInfo, w: number, h: number): { tone: "ok" | "warn"; text: string } {
  const tooSmall = size.flexible ? h < size.h * 0.75 : w < size.w * 0.6 || h < size.h * 0.6;
  if (tooSmall) return { tone: "warn", text: fill(size.labels.tooSmall, w, h) };
  if (!size.flexible && Math.abs(w / h / (size.w / size.h) - 1) > 0.12) return { tone: "warn", text: fill(size.labels.ratioOff, w, h) };
  return { tone: "ok", text: fill(size.labels.good, w, h) };
}

export function ImageField({
  name,
  defaultValue,
  labels,
  size,
}: {
  name: string;
  defaultValue?: string | null;
  labels: { upload: string; uploading: string; remove: string; url: string; error: string };
  size?: ImageSizeInfo;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const input = useRef<HTMLInputElement>(null);

  async function onFile(file: File) {
    setBusy(true);
    setError(false);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error();
      setNatural(null);
      setValue(json.url);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  // Preview frame uses the recommended proportions (capped for very wide logos).
  const ratio = size ? Math.min(size.w / size.h, 3) : 4 / 3;
  const isSvg = /\.svg(\?|$)/i.test(value);
  const check = size && natural && !isSvg ? verdict(size, natural.w, natural.h) : null;

  return (
    <div className="space-y-2">
      {size && (
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 rounded-xl bg-leaf-100/60 px-3 py-2 text-xs text-forest-800">
          <span className="font-semibold">{size.labels.recommended} :</span>
          <span className="rounded-md bg-white px-2 py-0.5 font-bold" dir="ltr">
            {size.w} × {size.h} {size.labels.px}
          </span>
          {!size.flexible && <span className="text-ink-600" dir="ltr">({size.ratio})</span>}
          <span className="basis-full text-ink-600">{size.tip}</span>
        </div>
      )}
      <div className="flex flex-wrap items-start gap-4">
        <div
          className="relative flex w-44 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-sand-200 bg-cream-50"
          style={{ aspectRatio: String(ratio) }}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt=""
              className={`h-full w-full ${size?.flexible ? "object-contain p-2" : "object-cover"}`}
              onLoad={(e) => setNatural({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
            />
          ) : (
            <span className="flex flex-col items-center gap-1 text-center text-sand-200">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <circle cx="9" cy="10" r="2" />
                <path d="m21 16-5-5-9 9" />
              </svg>
              {size && (
                <span className="text-[11px] font-semibold text-ink-400" dir="ltr">
                  {size.w} × {size.h}
                </span>
              )}
            </span>
          )}
        </div>
        <div className="min-w-48 flex-1 space-y-2">
          <input type="hidden" name={name} value={value} />
          <div className="flex flex-wrap gap-2">
            <label className={`btn btn-outline cursor-pointer !px-4 !py-1.5 text-sm ${busy ? "pointer-events-none opacity-60" : ""}`}>
              {busy ? labels.uploading : labels.upload}
              <input ref={input} type="file" accept="image/*" className="sr-only" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
            </label>
            {value && (
              <button type="button" onClick={() => { setValue(""); setNatural(null); }} className="rounded-full px-3 py-1.5 text-sm text-terracotta-600 hover:bg-terracotta-500/10">
                {labels.remove}
              </button>
            )}
          </div>
          <input type="text" dir="ltr" value={value} onChange={(e) => { setNatural(null); setValue(e.target.value); }} placeholder={labels.url} className="input !py-1.5 text-xs" />
          {check && <p className={`text-xs ${check.tone === "ok" ? "text-leaf-600" : "text-terracotta-600"}`}>{check.text}</p>}
          {error && <p className="text-xs text-terracotta-600">{labels.error}</p>}
        </div>
      </div>
    </div>
  );
}
