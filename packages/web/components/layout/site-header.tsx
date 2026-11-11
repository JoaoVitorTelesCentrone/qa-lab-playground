"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FlaskConical, FolderOpen, LogOut, Menu, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { AccountNav, signOutAndGoHome, useAccount } from "@/components/auth/account-nav";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { ACCOUNTS_ENABLED, LABS_ENABLED, MENTORSHIP_ENABLED } from "@/lib/product/features";

type NavLink = { href: string; label: string; hint?: string; match: (path: string) => boolean };

const under = (...prefixes: string[]) => (path: string) => prefixes.some((p) => path === p || path.startsWith(`${p}/`));

// Menu do site de autoridade (docs/PLANO_AUTORIDADE_2026-11.md): o que prova o
// trabalho do autor. Caminho, Ferramentas e Referências científicas continuam
// existindo como rotas, só saíram do menu. Projetos e Referências entram na etapa 7.
const NAV: NavLink[] = [
  ...(LABS_ENABLED ? [
    { href: "/labs", label: "Labs", match: under("/labs") },
    { href: "/desafio", label: "Weekly challenge", match: under("/desafio") },
  ] : []),
  { href: "/blog", label: "Blog", match: under("/blog") },
  { href: "/sobre", label: "About", match: under("/sobre") },
];
const MENTORSHIP: NavLink = { href: "/mentoria", label: "Mentoria", match: under("/mentoria") };
const items = () => MENTORSHIP_ENABLED ? [...NAV, MENTORSHIP] : NAV;

// Item ativo: sublinhado na linha de base do header (DESIGN.md), não pílula.
const topItem = (active: boolean) => cn(
  "relative inline-flex h-11 items-center gap-1 px-3 text-sm font-medium transition-colors",
  "after:absolute after:inset-x-3 after:-bottom-[11px] after:h-0.5 after:bg-primary after:transition-opacity",
  active ? "text-foreground after:opacity-100" : "text-muted-foreground after:opacity-0 hover:text-foreground",
);

function MobileLink({ item, pathname, onNavigate }: { item: NavLink; pathname: string; onNavigate: () => void }) {
  const current = item.match(pathname);
  return <Link href={item.href} onClick={onNavigate} aria-current={current ? "page" : undefined}
    className={cn("flex min-h-11 items-center justify-between rounded-sm px-3 text-base font-medium transition-colors hover:bg-accent", current ? "bg-accent text-primary" : "text-foreground")}>
    {item.label}
    {current && <span className="text-xs font-normal text-muted-foreground">Você está aqui</span>}
  </Link>;
}

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const account = useAccount(ACCOUNTS_ENABLED && isSupabaseConfigured());
  const close = () => setMenuOpen(false);

  return (
    <header className="qa-site-header sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-6">
          <Link href="/" className="flex h-11 shrink-0 items-center gap-2.5" aria-label="QA Lab, início">
            <span className="flex size-8 items-center justify-center rounded-sm bg-primary text-primary-foreground"><FlaskConical className="size-4" aria-hidden="true" /></span>
            <span className="text-lg font-semibold tracking-[-0.02em]">QA Lab</span>
          </Link>

          <nav className="hidden items-center lg:flex" aria-label="Navegação principal">
            {items().map((item) => <Link key={item.href} href={item.href} aria-current={item.match(pathname) ? "page" : undefined} className={topItem(item.match(pathname))}>{item.label}</Link>)}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          {ACCOUNTS_ENABLED && <div className="hidden sm:block"><AccountNav account={account} /></div>}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="size-11 lg:hidden" aria-label="Abrir menu"><Menu className="size-5" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="qa-site-header-menu flex w-[min(320px,88vw)] flex-col gap-6 overflow-y-auto p-5">
              <SheetTitle className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-sm bg-primary text-primary-foreground"><FlaskConical className="size-4" aria-hidden="true" /></span>
                <span className="text-lg font-semibold">QA Lab</span>
              </SheetTitle>
              <SheetDescription className="sr-only">Páginas do QA Lab.</SheetDescription>

              <nav aria-label="Navegação principal" className="grid gap-1">
                {items().map((item) => <MobileLink key={item.href} item={item} pathname={pathname} onNavigate={close} />)}
              </nav>

              {ACCOUNTS_ENABLED && <div className="mt-auto grid gap-2 border-t border-border pt-5">
                {account.authenticated ? <>
                  <p className="truncate px-1 pt-2 text-xs text-muted-foreground">{account.displayName || "Minha conta"}</p>
                  <Link href="/perfil" onClick={close} className="flex min-h-11 items-center gap-3 rounded-sm px-3 text-sm hover:bg-accent"><UserRound className="size-4 text-muted-foreground" aria-hidden="true" />Meu perfil</Link>
                  <Link href="/perfil/portfolio" onClick={close} className="flex min-h-11 items-center gap-3 rounded-sm px-3 text-sm hover:bg-accent"><FolderOpen className="size-4 text-muted-foreground" aria-hidden="true" />Portfólio</Link>
                  <button type="button" onClick={() => void signOutAndGoHome()} className="flex min-h-11 items-center gap-3 rounded-sm px-3 text-left text-sm hover:bg-accent"><LogOut className="size-4 text-muted-foreground" aria-hidden="true" />Sair</button>
                </> : <Button asChild variant="outline" className="h-11 w-full"><Link href="/login" onClick={close}>Entrar na minha conta</Link></Button>}
              </div>}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
