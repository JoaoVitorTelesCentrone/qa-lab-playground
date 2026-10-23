import Link from "next/link";
import { ArrowRight, Bug, ClipboardCheck, SearchCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrotoSpaceLink } from "@/components/home/broto-space-link";

const steps = [
  { icon: SearchCheck, title: "Entenda o contexto", text: "Leia a situação, identifique a regra e faça perguntas antes de executar." },
  { icon: Bug, title: "Investigue o risco", text: "Explore comportamentos, compare resultados e descubra o que precisa de atenção." },
  { icon: ClipboardCheck, title: "Explique sua decisão", text: "Registre a evidência e o raciocínio para que outra pessoa possa agir." },
];

export function ProductHome() {
  return (
    <div className="qa-home">
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-14">
        <section className="qa-next-lab overflow-hidden rounded-3xl border border-primary/20 px-6 py-10 sm:px-10 sm:py-14" aria-labelledby="home-title">
          <p className="qa-watermark" aria-hidden="true">QA Lab</p>
          <div className="qa-next-content max-w-3xl">
            <p className="qa-eyebrow">Aprenda pela prática</p>
            <h1 id="home-title" className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-6xl">Qualidade se aprende investigando.</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">Entre em situações de produto, explore o que acontece e transforme suas descobertas em decisões claras. Escolha um Lab para começar.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link href="/lab">Conhecer o Lab <ArrowRight className="size-4" /></Link></Button>
              <Button asChild size="lg" variant="outline"><Link href="/lab/refinamento">Praticar refinamento</Link></Button>
            </div>
          </div>
        </section>

        <section className="mt-14" aria-labelledby="what-you-learn">
          <div className="max-w-2xl">
            <p className="qa-eyebrow">Como funciona</p>
            <h2 id="what-you-learn" className="mt-3 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">Do contexto à evidência.</h2>
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
            <h2 className="text-lg font-semibold">Escolha uma situação para investigar</h2>
            <p className="mt-1 text-sm text-muted-foreground">Refinamento, critérios de aceite, triagem e outros exercícios práticos.</p>
          </div>
          <Button asChild variant="outline"><Link href="/lab">Explorar o Lab <ArrowRight className="size-4" /></Link></Button>
        </section>

        <BrotoSpaceLink />
      </main>
    </div>
  );
}
