"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FlaskConical, Linkedin, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LAUNCH_LAB } from "@/lib/product/launch";
import { cn } from "@/lib/utils";

const LINKEDIN_URL = "https://www.linkedin.com/company/qa-lab-oficial/";

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const labActive = pathname === LAUNCH_LAB.route || pathname.startsWith("/playground/");

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-3 sm:px-6 sm:py-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-full border border-border bg-card/95 py-2 pl-4 pr-2 shadow-lg backdrop-blur sm:pl-5 sm:pr-3">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="QA Lab — início">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground"><FlaskConical className="size-4" /></span>
          <span className="text-lg font-semibold tracking-[-0.02em]">QA Lab</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
          <Link href={LAUNCH_LAB.route} className={cn("rounded-full px-4 py-2 text-sm font-medium transition-colors", labActive ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
            O Lab
          </Link>
        </nav>

        <div className="flex items-center gap-1.5">
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" aria-label="QA Lab no LinkedIn" className="hidden size-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-primary sm:inline-flex">
            <Linkedin className="size-4" />
          </a>
          <Button asChild size="sm" className="hidden rounded-full px-4 sm:inline-flex">
            <Link href={LAUNCH_LAB.route}>Começar</Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="rounded-full lg:hidden" aria-label="Abrir menu"><Menu className="size-5" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-[300px] flex-col gap-6 p-6">
              <SheetTitle className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground"><FlaskConical className="size-4" /></span>
                <span className="text-lg font-semibold">QA Lab</span>
              </SheetTitle>
              <Link href={LAUNCH_LAB.route} className="text-base font-medium hover:text-primary">O Lab</Link>
              <div className="mt-auto flex flex-col gap-2">
                <Button asChild className="w-full rounded-full"><Link href={LAUNCH_LAB.route}>Começar o Lab</Link></Button>
                <Button asChild variant="ghost" className="w-full rounded-full"><a href={LINKEDIN_URL} target="_blank" rel="noreferrer"><Linkedin className="size-4" /> LinkedIn do QA Lab</a></Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
