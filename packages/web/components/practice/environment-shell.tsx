// Moldura comum dos ambientes de prática.
//
// Server Component: só o que precisa de interação (a barra de controles) é
// cliente. Deslogado, no lugar da barra aparece o aviso de que a prática é
// efêmera — o ambiente continua aberto, porque login protege a persistência,
// não o experimentar.

import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { EnvironmentBar } from "./environment-bar";
import type { PracticeApp } from "@/lib/product/apps";
import type { PracticeSettings } from "@/lib/product/practice/store";

export function EnvironmentShell({ app, settings, signedIn, children }: {
  app: PracticeApp;
  settings: PracticeSettings;
  signedIn: boolean;
  children: ReactNode;
}) {
  return <main className="qa-system">
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <header>
        <p className="qa-eyebrow">Ambiente de prática</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-[-0.03em]">{app.name}</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{app.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5">{app.flows.map((flow) => <li key={flow}><Badge variant="secondary" className="font-normal">{flow}</Badge></li>)}</ul>
        <p className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <Link href={`/labs/regressao#${app.id}`} className="text-primary">Pack de regressão deste ambiente →</Link>
          <Link href="/labs" className="text-muted-foreground hover:text-foreground">Ver Labs e desafios</Link>
        </p>
      </header>

      <div className="mt-8">
        {signedIn
          ? <EnvironmentBar appId={app.id} settings={settings} />
          : <p className="rounded-xl border border-border bg-card p-4 text-sm leading-6 text-muted-foreground sm:p-5">
              Você está praticando sem conta: o que criar aqui vive só nesta tela e some ao sair, e os perfis de teste e desvios plantados ficam indisponíveis.{" "}
              <Link href={`/login?next=${encodeURIComponent(app.route)}`} className="text-primary">Entre para salvar</Link> a massa de teste e registrar evidência.
            </p>}
      </div>

      {children}
    </div>
  </main>;
}
