import Link from "next/link";
import { ArrowRight, Bug, ClipboardCheck, SearchCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LAUNCH_ENVIRONMENT, LAUNCH_LAB } from "@/lib/product/launch";

const steps = [
  { icon: SearchCheck, title: "Explore o sistema", text: "Navegue pelo ExpenseFlow como colaborador, gestora e admin." },
  { icon: Bug, title: "Encontre os riscos", text: "Teste regras, permissões, filtros e os números dos relatórios." },
  { icon: ClipboardCheck, title: "Registre sua análise", text: "Documente bugs, cenários de regressão e o que vale automatizar." },
];

export function ProductHome() {
  return (
    <div className="qa-home">
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-14">
        <section className="qa-next-lab overflow-hidden rounded-3xl border border-primary/20 px-6 py-10 sm:px-10 sm:py-14" aria-labelledby="home-title">
          <p className="qa-watermark" aria-hidden="true">ExpenseFlow</p>
          <div className="qa-next-content max-w-3xl">
            <p className="qa-eyebrow">Um Lab de lançamento</p>
            <h1 id="home-title" className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-6xl">Aprenda QA investigando um sistema real.</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">No {LAUNCH_LAB.label}, você entra no ExpenseFlow antes da liberação e decide o que precisa ser corrigido, coberto e acompanhado.</p>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="rounded-full border border-border bg-card px-3 py-1.5">{LAUNCH_LAB.duration} de prática</span>
              <span className="rounded-full border border-border bg-card px-3 py-1.5">Sem login</span>
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link href={LAUNCH_LAB.route}>Começar o Lab <ArrowRight className="size-4" /></Link></Button>
              <Button asChild size="lg" variant="outline"><Link href={LAUNCH_ENVIRONMENT.route}>Ver o ExpenseFlow</Link></Button>
            </div>
          </div>
        </section>

        <section className="mt-14" aria-labelledby="what-you-learn">
          <div className="max-w-2xl">
            <p className="qa-eyebrow">O que você vai praticar</p>
            <h2 id="what-you-learn" className="mt-3 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">Uma investigação completa, do risco à evidência.</h2>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-2xl border border-border bg-card p-6">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></span>
                <h3 className="mt-6 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 flex flex-col gap-5 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">ExpenseFlow Challenge</h2>
            <p className="mt-1 text-sm text-muted-foreground">Seu ponto de partida no QA Lab.</p>
          </div>
          <Button asChild variant="outline"><Link href={LAUNCH_LAB.route}>Abrir briefing <ArrowRight className="size-4" /></Link></Button>
        </section>
      </main>
    </div>
  );
}
