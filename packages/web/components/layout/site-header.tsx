"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FlaskConical, Linkedin, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { AccountNav } from "@/components/auth/account-nav";
import { OnboardingLink } from "@/components/onboarding/floating-onboarding";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const LINKEDIN_URL = "https://www.linkedin.com/company/qa-lab-oficial/";

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const labActive = pathname === "/labs" || pathname.startsWith("/labs/");
  const tracksActive = pathname === "/trilhas" || pathname.startsWith("/trilhas/");
  const contentActive = pathname === "/conteudo" || pathname.startsWith("/conteudo/");
  const mentorshipActive = pathname.startsWith("/mentoria");
  const toolsActive = pathname === "/ferramentas" || pathname === "/lab/bdd" || pathname === "/boards" || pathname.startsWith("/boards/");

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-3 sm:px-6 sm:py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border border-border bg-card/95 py-2 pl-4 pr-2 shadow-lg backdrop-blur sm:pl-5 sm:pr-3">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="QA Lab — início">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground"><FlaskConical className="size-4" /></span>
          <span className="text-lg font-semibold tracking-[-0.02em]">QA Lab</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
          <Link href="/labs" aria-current={labActive ? "page" : undefined} className={cn("rounded-full px-2.5 py-2 text-sm font-medium transition-colors", labActive ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
            Labs
          </Link>
          <Link href="/trilhas" aria-current={tracksActive ? "page" : undefined} className={cn("rounded-full px-2.5 py-2 text-sm font-medium transition-colors", tracksActive ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
            Trilhas
          </Link>
          <Link href="/mentoria" aria-current={mentorshipActive ? "page" : undefined} className={cn("rounded-full px-2.5 py-2 text-sm font-medium transition-colors", mentorshipActive ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
            Mentoria
          </Link>
          <Link href="/conteudo" aria-current={contentActive ? "page" : undefined} className={cn("rounded-full px-2.5 py-2 text-sm font-medium transition-colors", contentActive ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
            Conteúdo
          </Link>
          <Link href="/ferramentas" aria-current={toolsActive ? "page" : undefined} className={cn("rounded-full px-2.5 py-2 text-sm font-medium transition-colors", toolsActive ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>Ferramentas</Link>
        </nav>

        <div className="flex items-center gap-1.5">
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" aria-label="QA Lab no LinkedIn" className="hidden size-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-primary 2xl:inline-flex">
            <Linkedin className="size-4" />
          </a>
          <AccountNav configured={isSupabaseConfigured()} />
          <Button asChild size="sm" className="hidden rounded-full px-4 xl:inline-flex">
            <OnboardingLink>Começar a praticar</OnboardingLink>
          </Button>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="rounded-full lg:hidden" aria-label="Abrir menu"><Menu className="size-5" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-[300px] flex-col gap-4 overflow-y-auto p-6">
              <SheetTitle className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground"><FlaskConical className="size-4" /></span>
                <span className="text-lg font-semibold">QA Lab</span>
              </SheetTitle>
              <SheetDescription className="sr-only">Acesse as páginas e ferramentas do QA Lab.</SheetDescription>
              <Link href="/labs" onClick={() => setMenuOpen(false)} aria-current={labActive ? "page" : undefined} className="text-base font-medium hover:text-primary">Labs</Link>
              <Link href="/trilhas" onClick={() => setMenuOpen(false)} aria-current={tracksActive ? "page" : undefined} className="text-base font-medium hover:text-primary">Trilhas</Link>
              <Link href="/mentoria" onClick={() => setMenuOpen(false)} className="text-base font-medium hover:text-primary">Mentoria</Link>
              <Link href="/conteudo" onClick={() => setMenuOpen(false)} aria-current={contentActive ? "page" : undefined} className="text-base font-medium hover:text-primary">Conteúdo</Link>
              <Link href="/ferramentas" onClick={() => setMenuOpen(false)} aria-current={toolsActive ? "page" : undefined} className="text-base font-medium hover:text-primary">Ferramentas</Link>
              <div className="mt-auto flex flex-col gap-2">
                <Button asChild variant="outline" className="w-full rounded-full"><Link href="/login" onClick={() => setMenuOpen(false)}>Entrar na minha conta</Link></Button>
                <Button asChild className="w-full rounded-full"><OnboardingLink onClick={() => setMenuOpen(false)}>Começar a praticar</OnboardingLink></Button>
                <Button asChild variant="ghost" className="w-full rounded-full"><a href={LINKEDIN_URL} target="_blank" rel="noreferrer"><Linkedin className="size-4" /> LinkedIn do QA Lab</a></Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
