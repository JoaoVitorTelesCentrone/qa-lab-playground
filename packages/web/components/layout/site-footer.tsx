"use client";

// Rodapé enxuto: só navegação. O slogan e o tagline que moravam aqui não
// diziam nada que a home já não diga melhor.
//
// Client component por causa de uma coisa só: a lista de rotas sem rodapé.
// O catálogo de Labs é uma tela de duas colunas com a coluna da esquerda fixa,
// e uma faixa de links no fim da rolagem competia com ela.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { OnboardingLink } from "@/components/onboarding/floating-onboarding";
import { LABS_ENABLED, MENTORSHIP_ENABLED } from "@/lib/product/features";

const LINKEDIN_URL = "https://www.linkedin.com/company/qa-lab-oficial/";

/** Rotas que renderizam sem rodapé. Comparação exata: /labs/101 continua com ele. */
const WITHOUT_FOOTER = ["/labs"];

export function SiteFooter() {
  const pathname = usePathname() ?? "/";
  if (WITHOUT_FOOTER.includes(pathname)) return null;

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-5 py-3 text-sm text-muted-foreground sm:px-8">
        <span>© {new Date().getFullYear()} QA Lab</span>
        <nav aria-label="Rodapé" className="flex flex-wrap items-center gap-x-5">
          {LABS_ENABLED && <OnboardingLink className="inline-flex min-h-11 items-center transition hover:text-foreground">Primeiros passos</OnboardingLink>}
          {MENTORSHIP_ENABLED && <>
            <Link href="/planos" className="inline-flex min-h-11 items-center transition hover:text-foreground">Planos</Link>
            <Link href="/mentoria" className="inline-flex min-h-11 items-center transition hover:text-foreground">Mentoria</Link>
          </>}
          <Link href="/privacidade" className="inline-flex min-h-11 items-center transition hover:text-foreground">Privacidade</Link>
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center transition hover:text-foreground">LinkedIn<span className="sr-only"> (abre em nova aba)</span></a>
        </nav>
      </div>
    </footer>
  );
}
