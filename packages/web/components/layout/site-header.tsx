"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, FlaskConical, Library, Linkedin, Menu, Boxes, CalendarDays, Users, WalletCards, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LINKEDIN_URL = "https://www.linkedin.com/company/qa-lab-oficial/";

const nav = [
  { label: "Lab", href: "/shop", icon: Boxes },
  { label: "Finanças", href: "/financas", icon: WalletCards },
  { label: "Agendamentos", href: "/agendamentos", icon: CalendarDays },
  { label: "CRM", href: "/crm", icon: Users },
  { label: "Desafios", href: "/labs", icon: FlaskConical },
  { label: "Blog", href: "/blog", icon: BookOpen },
  { label: "Referencias", href: "/pesquisa", icon: Library },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5 sm:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="QA Lab - inicio">
          <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <FlaskConical className="size-4" />
          </span>
          <span className="text-lg font-semibold text-foreground">QA Lab</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegacao principal">
          {nav.map((item) => (
            <Button key={item.href} asChild variant={isActive(pathname, item.href) ? "secondary" : "ghost"} size="sm">
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" aria-label="QA Lab no LinkedIn">
              <Linkedin className="size-4" />
              LinkedIn
            </a>
          </Button>
          <Button type="button" variant="outline" size="icon-sm" onClick={() => setMobileOpen((open) => !open)} aria-label="Abrir menu" aria-expanded={mobileOpen} className="lg:hidden">
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="mx-auto max-w-6xl px-5 py-4 sm:px-8">
            <div className="grid gap-1">
              {nav.map((item) => {
                const Icon = item.icon;
                const active = isActive(pathname, item.href);
                return (
                  <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition hover:bg-accent", active && "bg-accent text-accent-foreground")}>
                    <Icon className="size-4 text-primary" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <Button asChild variant="outline" className="mt-4 w-full">
              <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
                <Linkedin className="size-4" />
                LinkedIn do QA Lab
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
