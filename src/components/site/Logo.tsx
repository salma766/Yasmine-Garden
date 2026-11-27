import Link from "next/link";

/**
 * Site logo. Shows the logo uploaded in the admin (Site settings) and falls
 * back to a neutral placeholder mark until one is uploaded.
 */
export function Logo({
  href,
  logoUrl,
  name,
  alt,
  light = false,
}: {
  href: string;
  logoUrl?: string | null;
  name: string;
  alt: string;
  light?: boolean;
}) {
  return (
    <Link href={href} className="flex min-w-0 items-center gap-2.5" aria-label={name}>
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt={alt} className="h-11 w-auto max-w-[180px] object-contain" />
      ) : (
        <>
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-dashed ${light ? "border-white/60 text-white" : "border-leaf-500 text-leaf-600"}`}
            title="Logo"
            aria-hidden
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z" />
              <path d="M2 21c0-3 1.9-5.4 5.1-6C9.5 14.5 12 13 13 12" />
            </svg>
          </span>
          <span className={`font-display text-[15px] font-bold leading-tight sm:text-lg ${light ? "text-white" : "text-forest-800"}`}>{name}</span>
        </>
      )}
    </Link>
  );
}
