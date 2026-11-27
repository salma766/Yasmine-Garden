"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowBack, ArrowForward, CloseIcon } from "@/components/Icons";

export type GalleryPhoto = { id: string; src: string; title: string; caption?: string | null; alt?: string | null };

export function GalleryGrid({ items, labels }: { items: GalleryPhoto[]; labels: { close: string; previous: string; next: string } }) {
  const [index, setIndex] = useState<number | null>(null);
  const close = useCallback(() => setIndex(null), []);
  const move = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + items.length) % items.length)), [items.length]);

  useEffect(() => {
    if (index === null) return;
    const rtl = document.documentElement.dir === "rtl";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") move(rtl ? -1 : 1);
      if (e.key === "ArrowLeft") move(rtl ? 1 : -1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, move]);

  const current = index === null ? null : items[index];

  return (
    <>
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {items.map((it, i) => (
          <figure key={it.id} className="mb-5 break-inside-avoid">
            <button type="button" onClick={() => setIndex(i)} className="group block w-full overflow-hidden rounded-2xl bg-leaf-100 text-start shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.src} alt={it.alt || it.title} loading="lazy" className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${i % 3 === 1 ? "aspect-[3/4]" : "aspect-[4/3]"}`} />
            </button>
            <figcaption className="mt-2 px-1">
              <span className="block font-semibold text-forest-900">{it.title}</span>
              {it.caption && <span className="text-sm text-ink-600">{it.caption}</span>}
            </figcaption>
          </figure>
        ))}
      </div>
      {current && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-forest-950/90 p-4" role="dialog" aria-modal="true" aria-label={current.title}>
          <button type="button" onClick={close} aria-label={labels.close} className="absolute end-4 top-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20">
            <CloseIcon />
          </button>
          <button type="button" onClick={() => move(-1)} aria-label={labels.previous} className="absolute start-3 rounded-full bg-white/10 p-3 text-white hover:bg-white/20">
            <ArrowBack />
          </button>
          <figure className="max-h-full max-w-5xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.src} alt={current.alt || current.title} className="max-h-[78vh] w-auto rounded-xl object-contain" />
            <figcaption className="mt-3 text-center text-white">
              <span className="block font-semibold">{current.title}</span>
              {current.caption && <span className="text-sm text-white/75">{current.caption}</span>}
            </figcaption>
          </figure>
          <button type="button" onClick={() => move(1)} aria-label={labels.next} className="absolute end-3 rounded-full bg-white/10 p-3 text-white hover:bg-white/20">
            <ArrowForward />
          </button>
        </div>
      )}
    </>
  );
}
