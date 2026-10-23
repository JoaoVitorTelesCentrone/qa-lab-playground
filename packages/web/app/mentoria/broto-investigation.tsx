"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight, ClipboardCheck, MessageSquareText } from "lucide-react";

const surfaces = [
  {
    id: "mente",
    label: "Mente",
    action: "Capturar",
    image: "/mentoria/broto-mente.webp",
    alt: "Tela Mente do Broto Space com campo para capturar uma reflexão e registros anteriores",
    question: "Uma reflexão interrompida continua encontrável depois?",
    evidence: "Mapa da jornada e notas da exploração.",
  },
  {
    id: "broto",
    label: "Broto",
    action: "Organizar",
    image: "/mentoria/broto-desafio.webp",
    alt: "Tela Broto com um desafio aberto, o custo de não resolvê-lo e soluções vinculadas",
    question: "Uma ideia mantém o contexto quando vira desafio e ação?",
    evidence: "Cenários de estados, vínculos e transições.",
  },
  {
    id: "habitos",
    label: "Hábitos",
    action: "Conferir",
    image: "/mentoria/broto-habitos.webp",
    alt: "Tela Hábitos comparando os planos da pessoa com as ações concluídas na semana",
    question: "O histórico representa o que a pessoa realmente fez?",
    evidence: "Bug report ou parecer de cobertura com impacto.",
  },
] as const;

export function BrotoInvestigation() {
  const [active, setActive] = useState(0);
  const surface = surfaces[active];

  return <div className="mentoria-broto-explorer">
    <div className="mentoria-broto-side">
      <div className="mentoria-broto-choices" role="group" aria-label="Explorar superfícies do Broto Space">
        {surfaces.map((item, index) => <button key={item.id} type="button" aria-pressed={index === active} onClick={() => setActive(index)}>
          <span>{item.label}</span><small>{item.action}</small>
        </button>)}
      </div>
      <div className="mentoria-broto-investigation" aria-live="polite">
        <span>O que você vai investigar</span>
        <h3>{surface.question}</h3>
        <p><ClipboardCheck aria-hidden="true" size={18} /> {surface.evidence}</p>
      </div>
      <div className="mentoria-broto-mentor"><MessageSquareText aria-hidden="true" size={19} /><span>O mentor revisa sua evidência e orienta a próxima tentativa.</span></div>
    </div>
    <figure className="mentoria-broto-screen" key={surface.id}>
      <a href={surface.image} target="_blank" rel="noopener noreferrer" aria-label={`Ampliar a tela ${surface.label} do Broto Space`}>
        <Image src={surface.image} alt={surface.alt} width={1200} height={586} sizes="(max-width: 700px) 100vw, 56vw" />
      </a>
      <figcaption><span>Tela real do Broto Space · {surface.label}</span><a href={surface.image} target="_blank" rel="noopener noreferrer">Ampliar <ArrowUpRight aria-hidden="true" size={15} /></a></figcaption>
    </figure>
  </div>;
}
