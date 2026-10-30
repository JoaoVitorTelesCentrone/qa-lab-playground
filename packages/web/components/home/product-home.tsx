import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowRight, ExternalLink } from "lucide-react";
import { OnboardingLink } from "@/components/onboarding/floating-onboarding";
import { brotoSpaceSite } from "@/lib/mentorship/brotospace-track";
import { HomeHeroScreens } from "./home-hero-screens";
import { HomeReveal } from "./home-reveal";
import { HomeInvestigationDemo } from "./home-investigation-demo";

const surfaces = [
  {
    title: "Mente",
    src: "/mentoria/broto-mente.webp",
    alt: "Tela Mente do BrotoSpace com registros de demonstração.",
    note: "Capturar e revisitar uma ideia",
    className: "qa-home-shot-mente",
  },
  {
    title: "Desafios",
    src: "/mentoria/broto-desafio.webp",
    alt: "Tela Desafios do BrotoSpace com um desafio de demonstração.",
    note: "Relacionar uma ideia a um desafio",
    className: "qa-home-shot-desafios",
  },
  {
    title: "Hábitos",
    src: "/mentoria/broto-habitos.webp",
    alt: "Tela Hábitos do BrotoSpace com hábitos de demonstração.",
    note: "Observar a continuidade de uma ação",
    className: "qa-home-shot-habitos",
  },
];

const practiceSteps = [
  { title: "Comece pela pergunta.", text: "O que a pessoa precisa conseguir fazer? Defina o resultado antes de abrir a tela." },
  { title: "Acompanhe a mesma ideia.", text: "Percorra o caminho no BrotoSpace e observe o que muda quando você sai e volta." },
  { title: "Compare com o esperado.", text: "Coloque lado a lado o resultado previsto e o que realmente encontrou." },
  { title: "Explique o que ocorreu.", text: "Registre os passos, o resultado e a evidência para outra pessoa entender." },
];

const routes = [
  { href: "/labs", title: "Labs", text: "Abra um caso de treino e pratique uma investigação do início ao fim." },
  { href: "/trilhas", title: "Trilhas", text: "Siga uma sequência de práticas no contexto do BrotoSpace." },
  { href: "/conteudo", title: "Conteúdo", text: "Leia explicações e exemplos para apoiar sua próxima investigação." },
];

export function ProductHome() {
  return <div className="qa-home">
    <main className="mx-auto max-w-[1360px] px-5 pb-20 sm:px-8 lg:px-12">
      <HomeReveal><section data-onboarding="home-intro" className="qa-home-hero" aria-labelledby="home-title">
        <div className="qa-home-hero-copy">
          <h1 id="home-title">Aprenda QA no BrotoSpace.</h1>
          <p>O QA Lab ensina testes de software com práticas guiadas nos espaços Mente, Desafios e Hábitos do BrotoSpace.</p>
          <div className="qa-home-actions">
            <OnboardingLink data-onboarding="home-cta" className="qa-home-primary">Começar a praticar <ArrowRight aria-hidden="true" /></OnboardingLink>
            <a className="qa-home-secondary" href={brotoSpaceSite.url} target="_blank" rel="noreferrer">Abrir o BrotoSpace <ExternalLink aria-hidden="true" /></a>
          </div>
        </div>
        <HomeHeroScreens />
        <a className="qa-home-scroll" href="#como-funciona"><ArrowDownRight aria-hidden="true" /> Veja como funciona</a>
      </section></HomeReveal>

      <HomeReveal><section className="qa-home-showcase" aria-labelledby="home-showcase-title">
        <div className="qa-home-section-heading">
          <h2 id="home-showcase-title">Investigue jornadas reais.</h2>
          <p>Use o BrotoSpace como contexto para observar uma jornada, levantar perguntas e reunir evidências. Os exemplos abaixo usam dados de demonstração.</p>
        </div>
        <div className="qa-home-mosaic">
          {surfaces.map((surface) => <figure className={`qa-home-mosaic-item ${surface.className}`} key={surface.title}>
            <div className="qa-home-mosaic-image"><Image src={surface.src} alt={surface.alt} fill sizes="(max-width: 700px) 48vw, 33vw" /></div>
            <figcaption><strong>{surface.title}</strong><span>{surface.note}</span></figcaption>
          </figure>)}
          <div className="qa-home-mosaic-note"><p>Siga a jornada. Registre o que encontrou.</p></div>
        </div>
      </section></HomeReveal>

      <HomeReveal><section id="como-funciona" className="qa-home-investigation" aria-labelledby="home-process-title">
        <div className="qa-home-section-heading">
          <h2 id="home-process-title">Uma ideia. Duas visitas.</h2>
          <p>Faça uma pergunta antes de concluir. Neste exemplo, acompanhe um registro fictício e decida o que observar ao voltar.</p>
        </div>
        <HomeInvestigationDemo />
      </section></HomeReveal>

      <HomeReveal><section className="qa-home-method" aria-labelledby="home-method-title">
        <div className="qa-home-method-intro">
          <h2 id="home-method-title">Investigue com clareza.</h2>
          <p>Uma boa investigação deixa claro o que você fez, o que esperava e o que encontrou.</p>
        </div>
        <ol className="qa-home-steps">
          {practiceSteps.map((step, index) => <li key={step.title}>
            <span className="qa-home-step-number">{index + 1}</span>
            <div><h3>{step.title}</h3><p>{step.text}</p></div>
          </li>)}
        </ol>
      </section></HomeReveal>

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
        <div><h2 id="home-closing-title">Explore o BrotoSpace.</h2><p>Escolha uma jornada para investigar com atenção.</p></div>
        <a href={brotoSpaceSite.url} target="_blank" rel="noreferrer">Visitar o BrotoSpace <ExternalLink aria-hidden="true" /></a>
      </section></HomeReveal>
    </main>
  </div>;
}
