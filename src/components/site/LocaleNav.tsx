"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { anySegment, locales, localeInfo, LOCALE_COOKIE, segments, type Alternates, type Locale } from "@/lib/i18n";
import { ChevronDown, CloseIcon, GlobeIcon, MenuIcon, PhoneIcon } from "@/components/Icons";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const AltCtx = createContext<{ alternates: Alternates | null; set: (a: Alternates | null) => void }>({
  alternates: null,
  set: () => {},
});

export function AlternatesProvider({ children }: { children: ReactNode }) {
  const [alternates, set] = useState<Alternates | null>(null);
  return <AltCtx.Provider value={{ alternates, set }}>{children}</AltCtx.Provider>;
}

/** Rendered by each page to tell the language selector where each language lives. */
export function PageAlternates({ value }: { value: Alternates }) {
  const { set } = useContext(AltCtx);
  const key = JSON.stringify(value);
  useIsoLayoutEffect(() => {
    set(value);
    return () => set(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return null;
}

/** Fallback when a page did not declare alternates: translate the URL segments. */
function translatePath(pathname: string, target: Locale): string {
  const parts = pathname.split("/").filter(Boolean).map((p) => {
    try {
      return decodeURIComponent(p);
    } catch {
      return p;
    }
  });
  const rest = parts.slice(1);
  const seg = rest[0] ? anySegment(rest[0]) : null;
  if (!seg) return `/${target}`;
  if (rest.length > 1) return "/" + [target, segments[seg][target]].map(encodeURIComponent).join("/");
  return "/" + [target, segments[seg][target]].map(encodeURIComponent).join("/");
}

function remember(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}

export function LanguageSwitcher({ locale, label, unavailable }: { locale: Locale; label: string; unavailable: string }) {
  const { alternates } = useContext(AltCtx);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const targetFor = (l: Locale) => {
    if (alternates) return alternates[l];
    return translatePath(pathname, l);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        className="flex items-center gap-1.5 rounded-full border border-forest-800/15 bg-white/70 px-3 py-2 text-sm font-semibold text-forest-800 hover:bg-white"
      >
        <GlobeIcon width={16} height={16} />
        <span>{localeInfo[locale].code}</span>
        <ChevronDown width={14} height={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label={label}
          className="absolute end-0 z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-sand-200 bg-white py-1 shadow-soft"
        >
          {locales.map((l) => {
            const target = targetFor(l);
            const fallback = `/${l}`;
            const active = l === locale;
            return (
              <li key={l} role="option" aria-selected={active}>
                <Link
                  href={target ?? fallback}
                  hrefLang={l}
                  lang={l}
                  dir={localeInfo[l].dir}
                  onClick={() => {
                    remember(l);
                    setOpen(false);
                  }}
                  title={target ? undefined : unavailable}
                  className={`flex items-center justify-between gap-3 px-4 py-2.5 text-sm hover:bg-leaf-100 ${active ? "bg-cream-100 font-bold text-forest-800" : "text-ink-900"}`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="inline-flex h-6 w-8 items-center justify-center rounded-md bg-forest-800 text-[11px] font-bold tracking-wide text-white">
                      {localeInfo[l].code}
                    </span>
                    <span className={l === "ar" ? "font-arabic text-base" : ""}>{localeInfo[l].native}</span>
                  </span>
                  {!target && <span className="text-[10px] text-ink-400">↺</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

type NavItem = { href: string; label: string };

export function DesktopNav({ items, label }: { items: NavItem[]; label: string }) {
  const pathname = decodeURIComponent(usePathname());
  return (
    <nav className="hidden items-center gap-0.5 xl:flex" aria-label={label}>
      {items.map((it) => {
        const target = decodeURIComponent(it.href);
        const active = target.split("/").length <= 2 ? pathname === target : pathname.startsWith(target);
        return (
          <Link
            key={it.href}
            href={it.href}
            aria-current={active ? "page" : undefined}
            className={`whitespace-nowrap rounded-full px-3 py-2 text-[0.9rem] font-medium transition-colors ${active ? "bg-leaf-100 text-forest-800" : "text-ink-600 hover:text-forest-800"}`}
          >
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileNav({
  items,
  openLabel,
  closeLabel,
  quote,
  phone,
}: {
  items: NavItem[];
  openLabel: string;
  closeLabel: string;
  quote: NavItem;
  phone?: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={openLabel}
        aria-expanded={open}
        className="rounded-full p-2 text-forest-800 hover:bg-leaf-100"
      >
        <MenuIcon width={24} height={24} />
      </button>
      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-forest-950/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 end-0 flex w-80 max-w-[85vw] flex-col bg-cream-50 p-6 shadow-2xl">
            <div className="mb-6 flex justify-end">
              <button type="button" onClick={() => setOpen(false)} aria-label={closeLabel} className="rounded-full p-2 hover:bg-leaf-100">
                <CloseIcon width={24} height={24} />
              </button>
            </div>
            <nav className="flex flex-col gap-1" aria-label={openLabel}>
              {items.map((it) => (
                <Link key={it.href} href={it.href} className="rounded-xl px-4 py-3 text-lg font-medium text-ink-900 hover:bg-leaf-100">
                  {it.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-3">
              {phone && (
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="btn btn-outline">
                  <PhoneIcon width={18} height={18} />
                  <span dir="ltr">{phone}</span>
                </a>
              )}
              <Link href={quote.href} className="btn btn-accent">
                {quote.label}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
