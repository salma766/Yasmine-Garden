"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function AdminNavLink({ href, exact, children }: { href: string; exact?: boolean; children: ReactNode }) {
  const path = usePathname();
  const active = exact ? path === href : path === href || (path.startsWith(href + "/") && !(href === "/admin/translations" && path.startsWith("/admin/translations/interface")));
  return (
    <Link href={href} className={`flex shrink-0 items-center whitespace-nowrap rounded-lg px-3 py-2 ${active ? "bg-white/15 font-semibold text-white" : "text-white/75 hover:bg-white/10 hover:text-white"}`}>
      {children}
    </Link>
  );
}
