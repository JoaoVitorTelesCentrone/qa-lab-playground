"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, FlaskConical, Library, Linkedin, Menu, ShoppingCart, X } from "lucide-react";

const LINKEDIN_URL = "https://www.linkedin.com/company/qa-lab-oficial/";

type NavItem = { label: string; href: string; hint: string; accent: string; icon: typeof BookOpen };

// Lançamento enxuto: apenas Blog e a Biblioteca de referências científicas.
const nav: NavItem[] = [
  { label: "Labs", href: "/labs", hint: "Hub de desafios praticos", accent: "text-mint", icon: FlaskConical },
  { label: "Loja", href: "/shop/products", hint: "Produto demo QA Lab Shop", accent: "text-neon", icon: ShoppingCart },
  { label: "Blog", href: "/blog", hint: "Artigos sobre QA, testes e qualidade", accent: "text-mint", icon: BookOpen },
  { label: "Referências", href: "/pesquisa", hint: "Biblioteca de artigos científicos de QA", accent: "text-neon", icon: Library },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#101319]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5 sm:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="QA Lab — início">
          <span className="flex size-8 items-center justify-center rounded-lg border border-mint/25 bg-mint/10"><FlaskConical className="size-4 text-mint" /></span>
          <span className="font-[family-name:var(--font-display)] text-xl italic tracking-widest text-mint">QA LAB</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
          {nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.hint}
                className={`rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wide transition ${active ? `bg-white/5 ${item.accent}` : "text-[#AAB2BC] hover:bg-white/5 hover:text-off-white"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden h-9 items-center gap-2 rounded-lg border border-white/10 px-3 text-xs font-bold uppercase tracking-wide text-[#8B949E] transition hover:border-mint/30 hover:text-mint sm:flex"
            aria-label="QA Lab no LinkedIn"
          >
            <Linkedin className="size-4" />
            LinkedIn
          </a>
          <button type="button" onClick={() => setMobileOpen((open) => !open)} aria-label="Abrir menu" aria-expanded={mobileOpen} className="flex size-9 items-center justify-center rounded-lg border border-white/10 text-off-white lg:hidden">
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#101319] lg:hidden">
          <div className="mx-auto max-w-6xl px-5 py-4 sm:px-8">
            <div className="grid gap-1">
              {nav.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-white/5 ${isActive(pathname, item.href) ? "bg-white/5" : ""}`}>
                    <span className={item.accent}><Icon className="size-4" /></span>
                    <span className="text-sm font-bold text-off-white">{item.label}</span>
                  </Link>
                );
              })}
            </div>
            <div className="mt-4 border-t border-white/10 pt-4">
              <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-white/15 text-sm font-bold text-off-white">
                <Linkedin className="size-4" />
                LinkedIn do QA Lab
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
