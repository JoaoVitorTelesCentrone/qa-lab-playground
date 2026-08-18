"use client";

// Rodapé enxuto: só navegação. O slogan e o tagline que moravam aqui não
// diziam nada que a home já não diga melhor.
//
// Client component por causa de uma coisa só: a lista de rotas sem rodapé.
// O catálogo de Labs é uma tela de duas colunas com a coluna da esquerda fixa,
// e uma faixa de links no fim da rolagem competia com ela.

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKEDIN_URL = "https://www.linkedin.com/company/qa-lab-oficial/";

/** Rotas que renderizam sem rodapé. Comparação exata: /labs/101 continua com ele. */
const WITHOUT_FOOTER = ["/labs"];

export function SiteFooter() {
  const pathname = usePathname() ?? "/";
  if (WITHOUT_FOOTER.includes(pathname)) return null;

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-5 gap-y-2 px-5 py-3.5 text-xs text-muted-foreground sm:px-8">
        <span>© {new Date().getFullYear()} QA Lab</span>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <Link href="/blog" className="transition hover:text-primary">Blog</Link>
          <Link href="/pesquisa" className="transition hover:text-primary">Pesquisa</Link>
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="transition hover:text-primary">LinkedIn</a>
        </nav>
      </div>
    </footer>
  );
}
