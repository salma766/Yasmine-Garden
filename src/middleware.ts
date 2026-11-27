import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, internalSegment, anySegment, isLocale, LOCALE_COOKIE, segments, type Locale } from "@/lib/i18n";

const ONE_YEAR = 60 * 60 * 24 * 365;

function preferredLocale(req: NextRequest): Locale {
  const cookie = req.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookie)) return cookie;
  const header = req.headers.get("accept-language") ?? "";
  const wanted = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase().slice(0, 2), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  for (const { tag } of wanted) if (isLocale(tag)) return tag;
  return defaultLocale;
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const parts = pathname.split("/").filter(Boolean).map((p) => {
    try {
      return decodeURIComponent(p);
    } catch {
      return p;
    }
  });

  // 1. No language prefix: redirect to the visitor's preferred language.
  if (!isLocale(parts[0])) {
    const locale = preferredLocale(req);
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  const locale = parts[0] as Locale;
  const rest = parts.slice(1);

  // 2. Translate localized segments to internal folder names.
  let redirectNeeded = false;
  const internal = [...rest];
  if (rest[0]) {
    const seg = internalSegment(locale, rest[0]);
    if (seg) {
      internal[0] = seg;
    } else {
      // A segment from another language (or the internal name): send the
      // visitor to the canonical localized URL.
      const other = anySegment(rest[0]);
      if (other) {
        internal[0] = other;
        redirectNeeded = true;
      }
    }
    if (internal[0] === "plants" && rest[1]) {
      const sub = internalSegment(locale, rest[1]);
      if (sub === "category") internal[1] = "category";
      else if (anySegment(rest[1]) === "category") {
        internal[1] = "category";
        redirectNeeded = true;
      }
    }
  }

  if (redirectNeeded) {
    const localized = internal.map((p, i) => {
      if (i === 0 && p in segments) return segments[p as keyof typeof segments][locale];
      if (i === 1 && internal[0] === "plants" && p === "category") return segments.category[locale];
      return p;
    });
    const url = req.nextUrl.clone();
    url.pathname = "/" + [locale, ...localized].map(encodeURIComponent).join("/");
    url.search = search;
    return NextResponse.redirect(url, 301);
  }

  const target = "/" + [locale, ...internal].map(encodeURIComponent).join("/");
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-locale", locale);
  const res =
    decodeURIComponent(target) === decodeURIComponent(pathname)
      ? NextResponse.next({ request: { headers: requestHeaders } })
      : NextResponse.rewrite(new URL(target + search, req.url), { request: { headers: requestHeaders } });

  // 3. Remember the language the visitor is reading.
  if (req.cookies.get(LOCALE_COOKIE)?.value !== locale) {
    res.cookies.set(LOCALE_COOKIE, locale, { path: "/", maxAge: ONE_YEAR, sameSite: "lax" });
  }
  return res;
}

export const config = {
  // Everything except the admin, API routes, Next internals and static files.
  matcher: ["/((?!admin|api|_next|uploads|images|favicon.ico|robots.txt|sitemap.xml|.*\\.[a-zA-Z0-9]+$).*)"],
};

