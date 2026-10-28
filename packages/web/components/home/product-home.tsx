import Link from "next/link";
import { ArrowRight, Bug, ClipboardCheck, SearchCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OnboardingLink } from "@/components/onboarding/floating-onboarding";
import { HomeInvestigationDemo } from "./home-investigation-demo";

const steps = [
  { icon: SearchCheck, title: "Entenda", text: "Leia o contexto e identifique o risco." },
  { icon: Bug, title: "Investigue", text: "Teste o fluxo e compare os resultados." },
  { icon: ClipboardCheck, title: "Registre", text: "Explique o que encontrou com evidências." },
];

export function ProductHome() {
  return <div className="qa-home">
    <main className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-10 lg:py-12">
      <section data-onboarding="home-intro" className="qa-next-lab" aria-labelledby="home-title">
        <div className="qa-home-grid">
          <div className="qa-next-content">
            <h1 id="home-title" className="qa-page-title qa-page-title-hero text-foreground">Aprenda QA na prática.</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">Teste fluxos, investigue falhas e registre evidências.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg"><OnboardingLink data-onboarding="home-cta">Começar a praticar <ArrowRight aria-hidden="true" className="size-4" /></OnboardingLink></Button>
            </div>
            <Link href="/labs" className="mt-3 inline-flex min-h-10 items-center text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">Ver todos os Labs</Link>
          </div>
          <HomeInvestigationDemo />
        </div>
      </section>

      <section className="mt-9" aria-labelledby="what-you-learn">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
          <h2 id="what-you-learn" className="qa-page-title text-2xl">Do contexto à evidência.</h2>
        </div>
        <ol className="qa-practice-sequence mt-5" aria-label="Etapas de uma prática">
          {steps.map(({ icon: Icon, title, text }, index) => <li key={title}>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/[.06] text-primary"><Icon aria-hidden="true" className="size-4" /></span>
            <div><h3 className="text-sm font-semibold">{String(index + 1).padStart(2, "0")} · {title}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p></div>
          </li>)}
        </ol>
      </section>

    </main>
  </div>;
}
