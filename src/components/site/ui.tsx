import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowForward } from "@/components/Icons";

export function SectionHeading({ eyebrow, title, intro, action }: { eyebrow?: string; title: string; intro?: string | null; action?: { href: string; label: string } }) {
  return (
    <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-leaf-600 rtl:tracking-normal">{eyebrow}</p>}
        <h2 className="font-display text-3xl font-bold text-forest-900 md:text-4xl">{title}</h2>
        {intro && <p className="mt-3 text-lg text-ink-600">{intro}</p>}
      </div>
      {action && (
        <Link href={action.href} className="group inline-flex items-center gap-2 font-semibold text-forest-800 hover:text-leaf-600">
          {action.label}
          <ArrowForward width={18} height={18} className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
        </Link>
      )}
    </div>
  );
}

export function PageHero({ title, subtitle, image, children }: { title: string; subtitle?: string | null; image?: string | null; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-forest-900 text-white">
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-forest-950/30 to-forest-950/70" />
      <div className="container-page relative py-16 md:py-24">
        {children}
        <h1 className="font-display text-4xl font-bold md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg text-white/85">{subtitle}</p>}
      </div>
    </section>
  );
}

/** Renders admin-entered text: blank line = paragraph, "- " = list item, "### " = subheading. */
export function RichText({ text, className = "" }: { text?: string | null; className?: string }) {
  if (!text) return null;
  const blocks = text.replace(/\r/g, "").split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className={`prose-content text-ink-600 ${className}`}>
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        if (lines.every((l) => l.trim().startsWith("- "))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{l.trim().slice(2)}</li>
              ))}
            </ul>
          );
        }
        if (block.startsWith("### ")) return <h3 key={i}>{block.slice(4)}</h3>;
        return (
          <p key={i} className="whitespace-pre-line">
            {block}
          </p>
        );
      })}
    </div>
  );
}

export function Img({ src, alt, className = "" }: { src?: string | null; alt: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src || "/images/placeholders/leaf.svg"} alt={alt} loading="lazy" className={`img-cover ${className}`} />
  );
}

export function Card({ href, image, title, text, meta, cta }: { href: string; image?: string | null; title: string; text?: string | null; meta?: string | null; cta?: string }) {
  return (
    <Link href={href} className="card group flex flex-col transition-transform hover:-translate-y-1">
      <div className="aspect-[4/3] overflow-hidden bg-leaf-100">
        <Img src={image} alt={title} className="transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        {meta && <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-leaf-600 rtl:tracking-normal">{meta}</p>}
        <h3 className="font-display text-xl font-bold text-forest-900">{title}</h3>
        {text && <p className="mt-2 line-clamp-3 text-sm text-ink-600">{text}</p>}
        {cta && (
          <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-forest-800 group-hover:text-leaf-600">
            {cta}
            <ArrowForward width={16} height={16} />
          </span>
        )}
      </div>
    </Link>
  );
}

export function Pill({ href, active, children }: { href: string; active?: boolean; children: ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${active ? "border-forest-800 bg-forest-800 text-white" : "border-sand-200 bg-white text-ink-600 hover:border-forest-800 hover:text-forest-800"}`}
    >
      {children}
    </Link>
  );
}

export function Empty({ text }: { text: string }) {
  return <p className="rounded-2xl border border-dashed border-sand-200 bg-white p-10 text-center text-ink-400">{text}</p>;
}
