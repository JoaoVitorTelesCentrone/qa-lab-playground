import Link from "next/link";
import { ArrowDownRight, ArrowRight, Check } from "lucide-react";
import { OnboardingLink } from "@/components/onboarding/floating-onboarding";
import { labs, labLabel } from "@/lib/playground/catalog";
import { HomeHeroScreens } from "./home-hero-screens";
import { HomeReveal } from "./home-reveal";
import { HomeInvestigationDemo } from "./home-investigation-demo";

// A home vende o QA Lab: missão → investigação → evidência. O BrotoSpace
// aparece como o sistema que a pessoa vai testar, nunca como o produto, e
// todos os CTAs levam para dentro do site.
const steps = [
  { title: "Receba uma missão.", text: "Cada Lab traz um objetivo, dados de treino e os critérios da entrega. Você sabe o que procurar antes de abrir o sistema." },
  { title: "Investigue o sistema.", text: "Teste o BrotoSpace, um produto real, ou os ambientes de prática do QA Lab, que têm falhas plantadas de propósito. Compare o esperado com o que acontece." },
  { title: "Entregue a evidência.", text: "Registre os passos, o resultado observado e a severidade. A entrega fica na sua conta e pode virar um case no seu portfólio, se você quiser." },
];

const routes = [
  { href: "/labs", title: "Labs", text: "Escolha uma missão e pratique uma investigação do início ao fim." },
  { href: "/conteudo", title: "Conteúdo", text: "Módulos e casos para estudar antes ou depois de uma prática." },
  { href: "/trilhas", title: "Trilhas", text: "Percursos guiados por tema e ferramenta, como Cypress e Playwright." },
];

const difficultyLabel: Record<string, string> = { iniciante: "Iniciante", intermediario: "Intermediário", avancado: "Avançado" };

export function ProductHome() {
  const firstLab = labs.find((lab) => lab.status === "liberado");
  const firstLabHref = firstLab ? `/labs/${firstLab.number}` : "/labs";
  const firstLabName = firstLab ? `Lab ${labLabel(firstLab)}` : "primeiro Lab";

  return <div className="qa-home">
    <main className="mx-auto max-w-[1360px] px-5 pb-20 sm:px-8 lg:px-12">
      <HomeReveal><section data-onboarding="home-intro" className="qa-home-hero" aria-labelledby="home-title">
        <div className="qa-home-hero-copy">
          <h1 id="home-title">Aprenda QA na prática.</h1>
          <p>Teste sistemas, investigue falhas e transforme suas descobertas em evidências que você pode mostrar.</p>
          <div className="qa-home-actions">
            <OnboardingLink data-onboarding="home-cta" className="qa-home-primary">Começar a praticar <ArrowRight aria-hidden="true" /></OnboardingLink>
            <Link className="qa-home-secondary" href="/labs">Ver os Labs</Link>
          </div>
          {firstLab && <p className="qa-home-facts">
            <span>Primeira missão: {firstLabName}</span>
            <span>{firstLab.minutes} min</span>
            <span>{difficultyLabel[firstLab.difficulty] ?? firstLab.difficulty}</span>
            <span>Explore sem criar conta</span>
          </p>}
        </div>
        <HomeHeroScreens />
        <a className="qa-home-scroll" href="#como-funciona"><ArrowDownRight aria-hidden="true" /> Veja como funciona</a>
      </section></HomeReveal>

      <HomeReveal><section id="como-funciona" className="qa-home-method" aria-labelledby="home-method-title">
        <div className="qa-home-method-intro">
          <h2 id="home-method-title">Da missão à evidência.</h2>
          <p>Todo Lab segue o mesmo percurso. No fim, você tem uma entrega que outra pessoa consegue entender e verificar.</p>
        </div>
        <ol className="qa-home-steps">
          {steps.map((step, index) => <li key={step.title}>
            <span className="qa-home-step-number" aria-hidden="true">{index + 1}</span>
            <div><h3>{step.title}</h3><p>{step.text}</p></div>
          </li>)}
        </ol>
      </section></HomeReveal>

      <HomeReveal><section className="qa-home-investigation" aria-labelledby="home-process-title">
        <div className="qa-home-section-heading">
          <h2 id="home-process-title">Pergunte antes de concluir.</h2>
          <p>Um bom teste começa por uma pergunta clara. Este exemplo fictício mostra o raciocínio do {firstLabName}.</p>
        </div>
        <HomeInvestigationDemo />
      </section></HomeReveal>

      {firstLab && <HomeReveal><section className="qa-home-evidence" aria-labelledby="home-evidence-title">
        <div className="qa-home-section-heading">
          <h2 id="home-evidence-title">Termine com algo para mostrar.</h2>
          <p>Cada entrega é conferida por critérios explícitos. Ao concluir, você pode publicá-la como case no seu portfólio e compartilhar o link com quem for avaliar seu trabalho.</p>
        </div>
        <div className="qa-home-sheet">
          <div className="qa-home-sheet-head">
            <span>Ficha de entrega · {firstLabName}</span>
            <strong>{firstLab.title}</strong>
          </div>
          <p className="qa-home-sheet-label">Critérios para a entrega ser aceita</p>
          <ul>
            {firstLab.acceptanceCriteria.map((criterion) => <li key={criterion}><Check aria-hidden="true" />{criterion}</li>)}
          </ul>
        </div>
      </section></HomeReveal>}

      <HomeReveal><nav className="qa-home-routes" aria-labelledby="home-routes-title">
        <div className="qa-home-section-heading">
          <h2 id="home-routes-title">Escolha por onde continuar.</h2>
          <p>Comece com uma prática ou aprofunde o que já está investigando.</p>
        </div>
        <ul>
          {routes.map((route) => <li key={route.href}><Link href={route.href}><span><strong>{route.title}</strong><small>{route.text}</small></span><ArrowRight aria-hidden="true" /></Link></li>)}
        </ul>
      </nav></HomeReveal>

      <HomeReveal><section className="qa-home-closing" aria-labelledby="home-closing-title">
        <div>
          <h2 id="home-closing-title">Comece pelo {firstLabName}.</h2>
          <p>{firstLab ? `${firstLab.title}. Leva cerca de ${firstLab.minutes} minutos, e você só precisa de conta para salvar a entrega.` : "Escolha uma missão e comece a investigar."}</p>
        </div>
        <Link href={firstLabHref}>Abrir o {firstLabName} <ArrowRight aria-hidden="true" /></Link>
      </section></HomeReveal>
    </main>
  </div>;
}
