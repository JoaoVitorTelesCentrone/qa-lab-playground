import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { challengeThemes } from "@/lib/labs/challenges";

export const metadata = {
  title: "30 desafios de QA | QA Lab",
  description: "Trinta desafios práticos de QA organizados em seis temas, com tarefas, entregas e Labs para praticar.",
};

const challengeCount = challengeThemes.reduce((total, theme) => total + theme.challenges.length, 0);

export default function ChallengesPage() {
  return <main className="qa-system">
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-10 sm:px-8 lg:pt-14">
      <header className="border-b border-border pb-10">
        <Link href="/labs" className="inline-flex items-center gap-2 text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-primary">Voltar aos Labs</Link>
        <h1 className="mt-7 max-w-3xl text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">{challengeCount} desafios para praticar QA</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">Escolha um tema, resolva um problema e registre suas evidências.</p>
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground"><span><strong className="text-foreground">{challengeThemes.length}</strong> temas</span></div>
      </header>

      <div className="divide-y divide-border border-y border-border">
        {challengeThemes.map((theme, index) => <details key={theme.id} id={theme.id} open={index === 0} className="group scroll-mt-24">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <span><span className="block text-xl font-semibold tracking-[-0.025em]">{theme.title}</span><span className="mt-1 block text-sm text-muted-foreground">{theme.challenges.length} desafios</span></span>
            <ChevronDown className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="pb-4">
            <p className="max-w-2xl pb-4 leading-7 text-muted-foreground">{theme.summary}</p>
            <div className="divide-y divide-border border-y border-border">
            {theme.challenges.map((challenge) => <article key={challenge.id} id={`desafio-${challenge.id}`} className="grid gap-4 py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:gap-8 md:py-7">
              <div>
                <h3 className="text-xl font-semibold leading-snug">{challenge.title}</h3>
                <p className="mt-2 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">{challenge.level}</p>
                <p className="mt-4 leading-7 text-muted-foreground">{challenge.task}</p>
              </div>
              <div className="flex flex-col items-start md:pt-1">
                <details className="group/expectation">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 text-sm font-medium text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    Ver entrega esperada
                    <ChevronDown className="size-4 transition-transform group-open/expectation:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="pb-2 text-sm leading-6 text-muted-foreground">{challenge.delivery}</p>
                </details>
                <Link href={challenge.href} className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary underline underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Praticar em {challenge.lab} <ArrowUpRight className="size-4" aria-hidden="true" /></Link>
              </div>
            </article>)}
            </div>
          </div>
        </details>)}
      </div>

      <footer className="border-t border-border pt-8">
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">São roteiros de prática; esta página não registra conclusão. O progresso fica nos Labs com entrega própria.</p>
        <Link href="/labs" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Explorar todos os Labs <ArrowRight className="size-4" aria-hidden="true" /></Link>
      </footer>
    </div>
  </main>;
}
