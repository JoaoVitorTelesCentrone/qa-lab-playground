// Moldura comum dos ambientes de prática.
//
// A regra aqui é chegar direto no ambiente: quem abre /financas quer usar o
// app, não ler sobre ele. Por isso a moldura é uma linha só — de onde veio,
// para onde ir e os controles recolhidos — e o conteúdo começa logo abaixo.
//
// Server Component: só o que precisa de interação (a barra de controles) é
// cliente. Deslogado, no lugar dela aparece o aviso de que a prática é
// efêmera — o ambiente continua aberto, porque login protege a persistência,
// não o experimentar.

import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { EnvironmentBar } from "./environment-bar";
import { EnvironmentMenu } from "./environment-menu";
import { bugsForApp } from "@/lib/product/practice/bugs";
import type { PracticeApp } from "@/lib/product/apps";
import type { PracticeSettings } from "@/lib/product/practice/store";

export function EnvironmentShell({ app, settings, signedIn, screen = "overview", children }: {
  app: PracticeApp;
  settings: PracticeSettings;
  signedIn: boolean;
  screen?: string;
  children: ReactNode;
}) {
  const activeHere = bugsForApp(app.id).filter((bug) => settings.activeBugs.includes(bug.id)).length;

  return <main className="qa-system">
    <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 text-xs">
        <p className="text-muted-foreground">
          <Link href="/" className="transition hover:text-foreground">QA Lab</Link>
          <span aria-hidden="true"> · </span>
          <span className="font-medium text-foreground">{app.name}</span>
        </p>
        <nav aria-label={`Atalhos do ambiente ${app.name}`} className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <Link href={`/labs/regressao#${app.id}`} className="text-muted-foreground transition hover:text-foreground">Pack de regressão</Link>
          <Link href="/labs" className="text-muted-foreground transition hover:text-foreground">Labs</Link>
        </nav>
      </div>

      {signedIn
        ? <details className="group mt-3">
            <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40">
              <SlidersHorizontal className="size-3.5" aria-hidden="true" />
              Controles do ambiente
              {activeHere > 0 && <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">{activeHere} desvio(s)</span>}
              <ChevronDown className="size-3.5 transition group-open:rotate-180" aria-hidden="true" />
            </summary>
            <div className="mt-3"><EnvironmentBar appId={app.id} settings={settings} /></div>
          </details>
        : <p className="mt-3 text-xs leading-5 text-muted-foreground">
            Praticando sem conta: o que criar aqui some ao sair.{" "}
            <Link href={`/login?next=${encodeURIComponent(app.route)}`} className="text-primary">Entre para salvar</Link>.
          </p>}

      <div className="mt-6 grid gap-6 lg:grid-cols-[13rem_minmax(0,1fr)] lg:items-start">
        <EnvironmentMenu app={app} active={screen} />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  </main>;
}
