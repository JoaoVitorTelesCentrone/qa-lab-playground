import Link from "next/link";
import { ArrowDownRight, ArrowRight, FlaskConical } from "lucide-react";
import "./lab-intro.css";

export const metadata = {
  title: "O Lab | QA Lab",
  description: "Entenda por que o QA Lab ensina qualidade de software pela prática e como cada Lab transforma uma situação de trabalho em aprendizado e evidência.",
};

const practice = [
  {
    title: "Entenda o contexto",
    text: "Você recebe uma situação de produto, uma regra ou um comportamento para investigar. Antes de testar, precisa entender o que está em jogo.",
  },
  {
    title: "Tome uma decisão",
    text: "Explore o ambiente, faça perguntas, compare o esperado com o observado e escolha o próximo passo. Errar e revisar fazem parte do processo.",
  },
  {
    title: "Registre o raciocínio",
    text: "Anote o que encontrou e por que isso importa. Uma evidência clara ajuda outra pessoa a entender, reproduzir e agir.",
  },
];

const territories = [
  { title: "Produto e requisitos", text: "Esclarecer demandas, formular critérios e enxergar riscos antes da implementação." },
  { title: "Investigação", text: "Observar falhas, analisar sinais e sustentar hipóteses com evidência." },
  { title: "Execução e entrega", text: "Planejar testes, acompanhar defeitos e decidir com mais segurança o que pode avançar." },
];

export default function LabPage() {
  return (
    <main className="lab-intro">
      <section className="lab-intro-hero" aria-labelledby="lab-intro-title">
        <div className="lab-intro-hero-copy">
          <p className="lab-intro-kicker"><FlaskConical size={17} aria-hidden="true" /> O que é o QA Lab</p>
          <h1 id="lab-intro-title">Qualidade se aprende fazendo perguntas melhores.</h1>
          <p className="lab-intro-lead">O QA Lab é um espaço para aprender qualidade de software pela prática. Em cada Lab, você entra em uma situação, investiga o que acontece e explica as decisões que tomou.</p>
          <a className="lab-intro-jump" href="#por-que-existe">Entenda a ideia <ArrowDownRight size={18} aria-hidden="true" /></a>
        </div>
        <div className="lab-intro-specimen" aria-label="Exemplo de raciocínio em um Lab">
          <div className="lab-intro-specimen-top"><span className="lab-intro-specimen-mark" aria-hidden="true" /> Caderno de prática <span>QA LAB</span></div>
          <div className="lab-intro-specimen-body">
            <p className="lab-intro-specimen-label">Situação</p>
            <h2>O sistema aprovou uma despesa fora da regra.</h2>
            <div className="lab-intro-specimen-rule" />
            <dl>
              <div><dt>Observar</dt><dd>O que aconteceu? Em quais condições?</dd></div>
              <div><dt>Investigar</dt><dd>É um defeito, uma regra ambígua ou falta de contexto?</dd></div>
              <div><dt>Decidir</dt><dd>Que evidência permitiria ao time agir?</dd></div>
            </dl>
          </div>
          <div className="lab-intro-specimen-foot"><span>Contexto → investigação → evidência</span><span>01 / 03</span></div>
        </div>
      </section>

      <section id="por-que-existe" className="lab-intro-why" aria-labelledby="lab-intro-why-title">
        <div className="lab-intro-section-heading"><span>Por que existe</span><h2 id="lab-intro-why-title">Saber o conceito é o começo. Usá-lo em uma situação real é o aprendizado.</h2></div>
        <div className="lab-intro-why-copy">
          <p>Em QA, raramente aparece uma pergunta com todos os dados e uma única resposta pronta. Há regras incompletas, comportamentos inesperados, prioridades em disputa e pessoas que precisam entender o risco.</p>
          <p>Por isso, os Labs colocam o raciocínio em movimento. Você pode testar uma hipótese, descobrir que faltou contexto, voltar ao problema e melhorar sua entrega. É nessa repetição que a prática ganha profundidade.</p>
        </div>
      </section>

      <section className="lab-intro-method" aria-labelledby="lab-intro-method-title">
        <div className="lab-intro-method-heading"><span>Como se aprende aqui</span><h2 id="lab-intro-method-title">Cada Lab é uma oportunidade de pensar como QA.</h2><p>O objetivo é construir um caminho de investigação que você consiga explicar.</p></div>
        <ol className="lab-intro-steps">
          {practice.map((step, index) => <li key={step.title}><span className="lab-intro-step-number">0{index + 1}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}
        </ol>
      </section>

      <section className="lab-intro-territories" aria-labelledby="lab-intro-territories-title">
        <div className="lab-intro-section-heading"><span>Onde praticar</span><h2 id="lab-intro-territories-title">A prática acompanha diferentes momentos do trabalho.</h2></div>
        <div className="lab-intro-territory-list">{territories.map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
      </section>

      <section className="lab-intro-close" aria-labelledby="lab-intro-close-title">
        <div><span>O próximo passo</span><h2 id="lab-intro-close-title">Aprenda, experimente, explique. Depois, faça de novo com mais critério.</h2><p>Os Labs são o lugar para transformar conteúdo em decisão e decisão em evidência. Explore os temas no seu ritmo e escolha o que faz sentido praticar agora.</p></div>
        <Link href="/labs" className="lab-intro-catalog-link">Conhecer os Labs <ArrowRight size={19} aria-hidden="true" /></Link>
      </section>
    </main>
  );
}
