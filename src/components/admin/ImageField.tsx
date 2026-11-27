"use client";

import { useRef, useState } from "react";

export function ImageField({
  name,
  defaultValue,
  labels,
}: {
  name: string;
  defaultValue?: string | null;
  labels: { upload: string; uploading: string; remove: string; url: string; error: string };
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
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
      setValue(json.url);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="flex flex-wrap items-start gap-4">
      <div className="flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-sand-200 bg-cream-50">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-full w-full object-contain" />
        ) : (
          <span className="text-3xl text-sand-200">▢</span>
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
            <button type="button" onClick={() => setValue("")} className="rounded-full px-3 py-1.5 text-sm text-terracotta-600 hover:bg-terracotta-500/10">
              {labels.remove}
            </button>
          )}
        </div>
        <input type="text" dir="ltr" value={value} onChange={(e) => setValue(e.target.value)} placeholder={labels.url} className="input !py-1.5 text-xs" />
        {error && <p className="text-xs text-terracotta-600">{labels.error}</p>}
      </div>
    </div>
  );
}
