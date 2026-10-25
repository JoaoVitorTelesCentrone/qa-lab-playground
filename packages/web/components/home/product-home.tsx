import Link from "next/link";
import { ArrowRight, Bug, ClipboardCheck, SearchCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OnboardingLink } from "@/components/onboarding/floating-onboarding";
import { HomeInvestigationDemo } from "./home-investigation-demo";

const steps = [
  { icon: SearchCheck, title: "Entenda o contexto", text: "Leia a situação, identifique a regra e faça perguntas antes de executar." },
  { icon: Bug, title: "Investigue o risco", text: "Explore comportamentos, compare resultados e descubra o que precisa de atenção." },
  { icon: ClipboardCheck, title: "Explique sua decisão", text: "Registre a evidência e o raciocínio para que outra pessoa possa agir." },
];

export function ProductHome() {
  return <div className="qa-home">
    <main className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-10 lg:py-12">
      <section data-onboarding="home-intro" className="qa-next-lab rounded-3xl border border-primary/20" aria-labelledby="home-title">
        <div className="qa-home-grid">
          <div className="qa-next-content">
            <p className="qa-eyebrow">Aprender fazendo</p>
            <h1 id="home-title" className="qa-page-title qa-page-title-hero mt-3 text-foreground">Aprenda QA na prática.</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">Teste sistemas, investigue falhas e explique o que descobriu. Cada prática aproxima você do trabalho real de QA.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg"><OnboardingLink data-onboarding="home-cta">Começar a praticar <ArrowRight aria-hidden="true" className="size-4" /></OnboardingLink></Button>
              <Button asChild size="lg" variant="outline"><Link href="/labs">Explorar os Labs</Link></Button>
            </div>
            <Link href="/lab" className="mt-3 inline-flex min-h-10 items-center text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">Como funciona o QA Lab</Link>
          </div>
          <HomeInvestigationDemo />
        </div>
      </section>

      <section className="mt-9" aria-labelledby="what-you-learn">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
          <div><p className="qa-eyebrow">O ciclo de prática</p><h2 id="what-you-learn" className="qa-page-title mt-2 text-2xl">Do contexto à evidência.</h2></div>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">O que você observa vira uma evidência que consegue explicar.</p>
        </div>
        <ol className="qa-practice-sequence mt-5" aria-label="Etapas de uma prática">
          {steps.map(({ icon: Icon, title, text }, index) => <li key={title}>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/[.06] text-primary"><Icon aria-hidden="true" className="size-4" /></span>
            <div><h3 className="text-sm font-semibold">{String(index + 1).padStart(2, "0")} · {title}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p></div>
          </li>)}
        </ol>
      </section>

      <section className="mt-9 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between" aria-labelledby="real-system-title">
        <div className="max-w-2xl"><h2 id="real-system-title" className="text-xl font-semibold tracking-[-0.03em]">Aprenda em um sistema real</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Explore fluxos, teste regras de negócio e investigue falhas em ambientes com dados de treino.</p></div>
        <Button asChild size="lg" className="self-start sm:shrink-0"><Link href="/labs">Explorar os Labs <ArrowRight aria-hidden="true" className="size-4" /></Link></Button>
      </section>
    </main>
  </div>;
}
