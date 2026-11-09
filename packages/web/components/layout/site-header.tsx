"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, FlaskConical, FolderOpen, LogOut, Menu, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { AccountNav, signOutAndGoHome, useAccount } from "@/components/auth/account-nav";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type NavLink = { href: string; label: string; hint?: string; match: (path: string) => boolean };

const under = (...prefixes: string[]) => (path: string) => prefixes.some((p) => path === p || path.startsWith(`${p}/`));

// Duas entradas para aprender e praticar: o Caminho (módulos, aulas e os Labs de
// cada aula, com os cursos como "Aprofundar") e o catálogo de Labs. Conteúdo e
// Trilhas deixaram de ser itens do menu: viram partes do Caminho.
const PATH: NavLink = { href: "/conteudo", label: "Caminho", match: under("/conteudo", "/trilhas") };
const LABS: NavLink = { href: "/labs", label: "Labs", match: under("/labs") };
const MORE: NavLink[] = [
  { href: "/blog", label: "Blog", hint: "Artigos sobre a rotina de quem testa", match: under("/blog") },
  { href: "/pesquisa", label: "Referências", hint: "Pesquisas que embasam a prática", match: under("/pesquisa") },
];
const TOOLS: NavLink = { href: "/ferramentas", label: "Ferramentas", match: (p) => under("/ferramentas", "/boards", "/lab/ferramentas")(p) || p === "/lab/bdd" };
const MENTORSHIP: NavLink = { href: "/mentoria", label: "Mentoria", match: under("/mentoria") };

// Item ativo: sublinhado na linha de base do header (DESIGN.md), não pílula.
const topItem = (active: boolean) => cn(
  "relative inline-flex h-11 items-center gap-1 px-3 text-sm font-medium transition-colors",
  "after:absolute after:inset-x-3 after:-bottom-[11px] after:h-0.5 after:bg-primary after:transition-opacity",
  active ? "text-foreground after:opacity-100" : "text-muted-foreground after:opacity-0 hover:text-foreground",
);

function MoreMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const active = MORE.some((item) => item.match(pathname));
  return <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger className={cn(topItem(active), "data-[state=open]:text-foreground")}>
      Mais<ChevronDown className="size-3.5 transition-transform data-[open=true]:rotate-180" data-open={open} aria-hidden="true" />
    </PopoverTrigger>
    <PopoverContent align="start" sideOffset={14} className="w-80 rounded-sm border-border bg-popover p-1.5">
      <ul className="grid">
        {MORE.map((item) => {
          const current = item.match(pathname);
          return <li key={item.href}>
            <Link href={item.href} onClick={() => setOpen(false)} aria-current={current ? "page" : undefined}
              className={cn("grid gap-0.5 rounded-sm px-3 py-2.5 transition-colors hover:bg-accent focus-visible:bg-accent", current && "bg-accent")}>
              <span className={cn("text-sm font-semibold", current ? "text-primary" : "text-foreground")}>{item.label}</span>
              <span className="text-xs leading-5 text-muted-foreground">{item.hint}</span>
            </Link>
          </li>;
        })}
      </ul>
    </PopoverContent>
  </Popover>;
}

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
  const account = useAccount(isSupabaseConfigured());
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
            <Link href={PATH.href} aria-current={PATH.match(pathname) ? "page" : undefined} className={topItem(PATH.match(pathname))}>{PATH.label}</Link>
            <Link href={LABS.href} aria-current={LABS.match(pathname) ? "page" : undefined} className={topItem(LABS.match(pathname))}>{LABS.label}</Link>
            <MoreMenu pathname={pathname} />
            <Link href={TOOLS.href} aria-current={TOOLS.match(pathname) ? "page" : undefined} className={topItem(TOOLS.match(pathname))}>{TOOLS.label}</Link>
            <Link href={MENTORSHIP.href} aria-current={MENTORSHIP.match(pathname) ? "page" : undefined} className={topItem(MENTORSHIP.match(pathname))}>{MENTORSHIP.label}</Link>
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <div className="hidden sm:block"><AccountNav account={account} /></div>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="size-11 lg:hidden" aria-label="Abrir menu"><Menu className="size-5" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="qa-site-header-menu flex w-[min(320px,88vw)] flex-col gap-6 overflow-y-auto p-5">
              <SheetTitle className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-sm bg-primary text-primary-foreground"><FlaskConical className="size-4" aria-hidden="true" /></span>
                <span className="text-lg font-semibold">QA Lab</span>
              </SheetTitle>
              <SheetDescription className="sr-only">Páginas do QA Lab e da sua conta.</SheetDescription>

              <nav aria-label="Navegação principal" className="grid gap-5">
                <div className="grid gap-1">
                  <p className="px-3 text-xs font-semibold text-muted-foreground">Aprender e praticar</p>
                  <MobileLink item={PATH} pathname={pathname} onNavigate={close} />
                  <MobileLink item={LABS} pathname={pathname} onNavigate={close} />
                </div>
                <div className="grid gap-1">
                  <p className="px-3 text-xs font-semibold text-muted-foreground">Mais</p>
                  <MobileLink item={TOOLS} pathname={pathname} onNavigate={close} />
                  {MORE.map((item) => <MobileLink key={item.href} item={item} pathname={pathname} onNavigate={close} />)}
                </div>
                <div className="grid gap-1">
                  <MobileLink item={MENTORSHIP} pathname={pathname} onNavigate={close} />
                </div>
              </nav>

              <div className="mt-auto grid gap-2 border-t border-border pt-5">
                {account.authenticated ? <>
                  <p className="truncate px-1 pt-2 text-xs text-muted-foreground">{account.displayName || "Minha conta"}</p>
                  <Link href="/perfil" onClick={close} className="flex min-h-11 items-center gap-3 rounded-sm px-3 text-sm hover:bg-accent"><UserRound className="size-4 text-muted-foreground" aria-hidden="true" />Meu perfil</Link>
                  <Link href="/perfil/portfolio" onClick={close} className="flex min-h-11 items-center gap-3 rounded-sm px-3 text-sm hover:bg-accent"><FolderOpen className="size-4 text-muted-foreground" aria-hidden="true" />Portfólio</Link>
                  <button type="button" onClick={() => void signOutAndGoHome()} className="flex min-h-11 items-center gap-3 rounded-sm px-3 text-left text-sm hover:bg-accent"><LogOut className="size-4 text-muted-foreground" aria-hidden="true" />Sair</button>
                </> : <Button asChild variant="outline" className="h-11 w-full"><Link href="/login" onClick={close}>Entrar na minha conta</Link></Button>}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
