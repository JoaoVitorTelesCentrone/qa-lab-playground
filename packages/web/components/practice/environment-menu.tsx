// Menu de telas do ambiente — links de verdade, uma rota por tela.
//
// Nada de esconder seção com JS: cada tela é uma página própria
// (app/<ambiente>/<tela>/page.tsx), então o menu é só navegação.

import Link from "next/link";
import { LayoutPanelLeft } from "lucide-react";
import type { PracticeApp } from "@/lib/product/apps";

export function EnvironmentMenu({ app, active }: { app: PracticeApp; active: string }) {
  const screens = app.screens ?? [];
  if (screens.length === 0) return null;

  return <aside className="rounded-xl border border-border bg-card p-3 lg:sticky lg:top-5 lg:h-fit" aria-label={`Menu de ${app.name}`}>
    <p className="flex items-center gap-2 px-2 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"><LayoutPanelLeft className="size-3.5" aria-hidden="true" /> Telas do ambiente</p>
    <nav className="mt-1 flex gap-1 overflow-x-auto lg:flex-col" aria-label={`Telas de ${app.name}`}>
      {screens.map((screen) => {
        const href = screen.id === "overview" ? app.route : `${app.route}/${screen.id}`;
        const current = active === screen.id;
        return <Link
          key={screen.id}
          href={href}
          aria-current={current ? "page" : undefined}
          className={`shrink-0 rounded-md px-3 py-2 text-sm transition ${current ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}
        >
          {screen.label}
        </Link>;
      })}
    </nav>
  </aside>;
}
