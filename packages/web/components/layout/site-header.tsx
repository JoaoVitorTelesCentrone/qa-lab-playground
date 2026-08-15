"use client";

// Navegação única do produto.
//
// Uma hierarquia só: os ambientes de prática ficam agrupados sob "Ambientes"
// porque são onde o aluno testa, não produtos concorrentes. Labs, Blog e
// Referências ficam no primeiro nível. A sessão é lida no cliente para não
// tornar todas as páginas dinâmicas por causa do header.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BookOpen, ChevronDown, FlaskConical, Library, Linkedin, Menu, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { practiceApps } from "@/lib/product/apps";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const LINKEDIN_URL = "https://www.linkedin.com/company/qa-lab-oficial/";

const nav = [
  { label: "Labs", href: "/labs", icon: FlaskConical },
  { label: "Blog", href: "/blog", icon: BookOpen },
  { label: "Referências", href: "/pesquisa", icon: Library },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function useSession() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  useEffect(() => {
    if (!isSupabaseConfigured()) { setSignedIn(false); return; }
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setSignedIn(Boolean(data.user)));
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(Boolean(session?.user)));
    return () => subscription.subscription.unsubscribe();
  }, []);
  return signedIn;
}

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);
  const appsRef = useRef<HTMLDivElement>(null);
  const signedIn = useSession();

  useEffect(() => { setMobileOpen(false); setAppsOpen(false); }, [pathname]);

  useEffect(() => {
    if (!appsOpen) return;
    const close = (event: MouseEvent) => { if (!appsRef.current?.contains(event.target as Node)) setAppsOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setAppsOpen(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", escape); };
  }, [appsOpen]);

  const appsActive = practiceApps.some((app) => isActive(pathname, app.route));

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5 sm:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="QA Lab - início">
          <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground"><FlaskConical className="size-4" /></span>
          <span className="text-lg font-semibold text-foreground">QA Lab</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
          <div className="relative" ref={appsRef}>
            <Button type="button" variant={appsActive ? "secondary" : "ghost"} size="sm" onClick={() => setAppsOpen((open) => !open)} aria-expanded={appsOpen} aria-haspopup="true">
              Ambientes <ChevronDown className={cn("size-3.5 transition", appsOpen && "rotate-180")} />
            </Button>
            {appsOpen && (
              <div className="absolute left-0 top-full mt-1 w-80 rounded-md border border-border bg-popover p-1.5 shadow-lg">
                {practiceApps.map((app) => (
                  <Link key={app.id} href={app.route} className={cn("block rounded-md px-3 py-2.5 transition hover:bg-accent", isActive(pathname, app.route) && "bg-accent")}>
                    <span className="text-sm font-medium text-foreground">{app.name}</span>
                    <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">{app.summary}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          {nav.map((item) => (
            <Button key={item.href} asChild variant={isActive(pathname, item.href) ? "secondary" : "ghost"} size="sm">
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" aria-label="QA Lab no LinkedIn" className="hidden size-9 items-center justify-center rounded-md text-muted-foreground transition hover:text-primary sm:inline-flex">
            <Linkedin className="size-4" />
          </a>
          {signedIn !== null && (signedIn
            ? <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex"><Link href="/perfil"><User className="size-4" /> Perfil</Link></Button>
            : <Button asChild size="sm" className="hidden sm:inline-flex"><Link href="/cadastro">Criar conta</Link></Button>)}
          <Button type="button" variant="outline" size="icon-sm" onClick={() => setMobileOpen((open) => !open)} aria-label="Abrir menu" aria-expanded={mobileOpen} className="lg:hidden">
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="mx-auto max-w-6xl px-5 py-4 sm:px-8">
            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.11em] text-muted-foreground">Ambientes de prática</p>
            <div className="grid gap-1">
              {practiceApps.map((app) => (
                <Link key={app.id} href={app.route} className={cn("rounded-md px-3 py-2.5 text-sm font-medium transition hover:bg-accent", isActive(pathname, app.route) && "bg-accent text-accent-foreground")}>{app.name}</Link>
              ))}
            </div>
            <div className="mt-4 grid gap-1 border-t border-border pt-4">
              {nav.map((item) => {
                const Icon = item.icon;
                return <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition hover:bg-accent", isActive(pathname, item.href) && "bg-accent text-accent-foreground")}>
                  <Icon className="size-4 text-primary" />{item.label}
                </Link>;
              })}
            </div>
            {signedIn !== null && <Button asChild className="mt-4 w-full" variant={signedIn ? "outline" : "default"}><Link href={signedIn ? "/perfil" : "/cadastro"}>{signedIn ? "Meu perfil" : "Criar conta"}</Link></Button>}
            <Button asChild variant="ghost" className="mt-2 w-full">
              <a href={LINKEDIN_URL} target="_blank" rel="noreferrer"><Linkedin className="size-4" /> LinkedIn do QA Lab</a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
