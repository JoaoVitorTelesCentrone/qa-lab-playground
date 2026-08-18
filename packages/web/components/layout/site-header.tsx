"use client";

// Navegação única do produto, em pill flutuante.
//
// Base: Navigation 5 do Watermelon UI (registry `navigation-5`). O registry
// referencia um item `navigation.json` que não existe mais no shadcn, então os
// primitivos (`navigation-menu`, `sheet`) vieram direto do shadcn e o layout
// foi remontado aqui. Duas mudanças de fundo em relação ao original:
//
// 1. Cor por token do tema (`border-border`, `bg-card`…) e não `neutral-*`
//    fixo com variante `dark:` — o produto tem um tema só, e a versão clara
//    do original apareceria como um retângulo branco no site inteiro.
// 2. O mega-menu de quatro colunas virou uma lista: "Ambientes" tem um item
//    liberado hoje (ver liveApps), e quatro colunas de vitrine seriam mais
//    navegação do que produto.
//
// Uma hierarquia só: os ambientes de prática ficam agrupados sob "Ambientes"
// porque são onde o aluno testa, não produtos concorrentes. Labs, Blog e
// Referências ficam no primeiro nível. A sessão é lida no cliente para não
// tornar todas as páginas dinâmicas por causa do header.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FlaskConical, Linkedin, Menu, User } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { liveApps } from "@/lib/product/apps";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const LINKEDIN_URL = "https://www.linkedin.com/company/qa-lab-oficial/";

const nav = [
  { label: "Labs", href: "/labs" },
  { label: "Blog", href: "/blog" },
  { label: "Referências", href: "/pesquisa" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Nome exibido no header: `profiles.full_name` é a fonte de verdade (é o que a
// pessoa edita em /perfil), mas o metadata do cadastro serve de primeira pintura
// para o botão não piscar "Perfil" antes da query voltar.
function useSession() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) { setSignedIn(false); return; }
    const supabase = createClient();
    let active = true;

    const load = async (user: SupabaseUser) => {
      if (!active) return;
      setSignedIn(true);
      const meta = typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name.trim() : "";
      setName(meta || user.email?.split("@")[0] || null);
      const { data } = await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle();
      const full = data?.full_name?.trim();
      if (active && full) setName(full);
    };

    const clear = () => { if (active) { setSignedIn(false); setName(null); } };

    supabase.auth.getUser().then(({ data }) => { if (data.user) void load(data.user); else clear(); }).catch(clear);
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => { if (session?.user) void load(session.user); else clear(); });
    return () => { active = false; subscription.subscription.unsubscribe(); };
  }, []);

  return { signedIn, name };
}

// No pill o espaço é curto: só o primeiro nome.
function firstName(value: string) {
  return value.split(/\s+/)[0] || value;
}

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const { signedIn, name } = useSession();

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const appsActive = liveApps.some((app) => isActive(pathname, app.route));

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-3 sm:px-6 sm:py-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 rounded-full border border-border bg-card/95 py-2 pr-2 pl-4 shadow-lg backdrop-blur sm:pr-3 sm:pl-5">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="QA Lab — início">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground"><FlaskConical className="size-4" /></span>
          <span className="text-lg font-semibold tracking-[-0.02em]">QA Lab</span>
        </Link>

        <NavigationMenu className="hidden lg:flex" viewport={false}>
          <NavigationMenuList className="gap-1">
            <NavigationMenuItem>
              <NavigationMenuTrigger className={cn("h-auto rounded-full bg-transparent px-4 py-2 text-sm font-medium transition-colors", appsActive ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
                Ambientes
              </NavigationMenuTrigger>
              <NavigationMenuContent className="rounded-2xl border border-border bg-popover p-2 shadow-2xl">
                <ul className="grid w-80 gap-1">
                  {liveApps.map((app) => (
                    <li key={app.id}>
                      <NavigationMenuLink asChild>
                        <Link href={app.route} className={cn("block rounded-xl px-3 py-2.5 transition hover:bg-accent", isActive(pathname, app.route) && "bg-accent")}>
                          <span className="text-sm font-medium">{app.name}</span>
                          <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">{app.summary}</span>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {nav.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "rounded-full bg-transparent px-4 py-2 text-sm font-medium transition-colors",
                      isActive(pathname, item.href) ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-1.5">
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" aria-label="QA Lab no LinkedIn" className="hidden size-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-primary sm:inline-flex">
            <Linkedin className="size-4" />
          </a>

          {/* Só renderiza depois de saber a sessão: mostrar "Criar conta" para
              quem já está logado, mesmo que por um instante, é pior que esperar. */}
          {signedIn !== null && (signedIn
            ? <Button asChild variant="outline" size="sm" className="hidden max-w-44 rounded-full sm:inline-flex"><Link href="/perfil"><User className="size-4" /> <span className="truncate">{name ? firstName(name) : "Perfil"}</span></Link></Button>
            : <Button asChild size="sm" className="hidden rounded-full px-5 font-semibold sm:inline-flex"><Link href="/cadastro">Criar conta</Link></Button>)}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="rounded-full lg:hidden" aria-label="Abrir menu"><Menu className="size-5" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-[300px] flex-col gap-6 p-6">
              <SheetTitle className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground"><FlaskConical className="size-4" /></span>
                <span className="text-lg font-semibold">QA Lab</span>
              </SheetTitle>

              <div className="flex flex-col gap-4">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="ambientes" className="border-none">
                    <AccordionTrigger className="justify-between py-0 text-base font-medium hover:no-underline">Ambientes</AccordionTrigger>
                    <AccordionContent className="mt-1 ml-2 flex flex-col gap-3 border-l border-border pb-0 pl-4">
                      <div className="flex flex-col gap-2 pt-4">
                        {liveApps.map((app) => (
                          <Link key={app.id} href={app.route} className={cn("text-sm font-medium tracking-tight text-muted-foreground transition hover:text-primary", isActive(pathname, app.route) && "text-primary")}>
                            {app.name}
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {nav.map((item) => (
                  <Link key={item.href} href={item.href} className={cn("text-base font-medium transition", isActive(pathname, item.href) ? "text-primary" : "hover:text-primary")}>
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-auto flex flex-col gap-2">
                {signedIn !== null && (
                  <Button asChild className="w-full rounded-full" variant={signedIn ? "outline" : "default"}>
                    <Link href={signedIn ? "/perfil" : "/cadastro"}><span className="truncate">{signedIn ? (name ?? "Meu perfil") : "Criar conta"}</span></Link>
                  </Button>
                )}
                <Button asChild variant="ghost" className="w-full rounded-full">
                  <a href={LINKEDIN_URL} target="_blank" rel="noreferrer"><Linkedin className="size-4" /> LinkedIn do QA Lab</a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
