import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import "../globals.css";
import { getAdminLocale } from "@/lib/admin-locale";
import { dirOf } from "@/lib/i18n";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo", display: "swap" });

export const metadata: Metadata = { title: "Admin | Yasmine Gardens", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminRoot({ children }: { children: ReactNode }) {
  const locale = await getAdminLocale();
  return (
    <html lang={locale} dir={dirOf(locale)} className={`${inter.variable} ${cairo.variable}`}>
      <body className="min-h-screen bg-cream-100">{children}</body>
    </html>
  );
}
