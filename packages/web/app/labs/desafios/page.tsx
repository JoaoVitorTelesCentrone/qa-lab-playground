import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
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
        <h1 className="mt-7 max-w-3xl text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">30 desafios para praticar QA com direção</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">Escolha um tema, resolva um problema concreto e produza uma evidência que outra pessoa consiga avaliar. Cada desafio aponta para uma prática que já existe no QA Lab.</p>
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground"><span><strong className="text-foreground">{challengeCount}</strong> desafios</span><span><strong className="text-foreground">{challengeThemes.length}</strong> temas</span><span>Do primeiro teste à decisão de release</span></div>
      </header>

      <nav aria-label="Ir para um tema" className="border-b border-border py-7">
        <p className="mb-4 text-sm font-medium text-foreground">Escolha um tema</p>
        <div className="flex flex-wrap gap-2">
          {challengeThemes.map((theme) => <a key={theme.id} href={`#${theme.id}`} className="inline-flex min-h-10 items-center rounded-md border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">{theme.title}</a>)}
        </div>
      </nav>

      <div className="divide-y divide-border">
        {challengeThemes.map((theme) => <section key={theme.id} id={theme.id} aria-labelledby={`${theme.id}-title`} className="scroll-mt-24 py-12 sm:py-16">
          <div className="mb-7 grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-10">
            <h2 id={`${theme.id}-title`} className="max-w-md text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">{theme.title}</h2>
            <p className="max-w-xl leading-7 text-muted-foreground md:pt-1">{theme.summary}</p>
          </div>
          <div className="divide-y divide-border border-y border-border">
            {theme.challenges.map((challenge) => <article key={challenge.id} id={`desafio-${challenge.id}`} className="grid gap-5 py-6 md:grid-cols-[3.5rem_minmax(0,1fr)_minmax(0,1.05fr)] md:gap-6 md:py-7">
              <span className="font-mono text-sm tabular-nums text-primary" aria-label={`Desafio ${Number(challenge.id)}`}>{challenge.id}</span>
              <div>
                <h3 className="text-xl font-semibold leading-snug">{challenge.title}</h3>
                <p className="mt-2 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">{challenge.level}</p>
                <p className="mt-4 leading-7 text-muted-foreground">{challenge.task}</p>
              </div>
              <div className="flex flex-col items-start md:pl-5">
                <p className="text-sm font-medium text-primary">O que entregar</p>
                <p className="mt-2 text-sm leading-6 text-foreground">{challenge.delivery}</p>
                <Link href={challenge.href} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary underline underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Praticar em {challenge.lab} <ArrowUpRight className="size-4" aria-hidden="true" /></Link>
              </div>
            </article>)}
          </div>
        </section>)}
      </div>

      <footer className="border-t border-border pt-8">
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">Estes desafios são roteiros de prática. O progresso registrado continua nos Labs que têm entrega própria; esta página não marca desafios como concluídos automaticamente.</p>
        <Link href="/labs" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Explorar todos os Labs <ArrowRight className="size-4" aria-hidden="true" /></Link>
      </footer>
    </div>
  </main>;
}
