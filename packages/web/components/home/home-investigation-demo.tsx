"use client";

import { useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";

export function HomeInvestigationDemo() {
  const [showPlan, setShowPlan] = useState(false);

  return <div className="qa-home-demo">
    <div className="qa-home-demo-question">
      <p>O pensamento continua depois que saio?</p>
    </div>
    <div className="qa-home-demo-journey" aria-label="Roteiro do caso de demonstração">
      <div><span>1</span><strong>Registre</strong><p>Use o conteúdo fictício do caso.</p></div>
      <ArrowRight aria-hidden="true" />
      <div><span>2</span><strong>Saia e volte</strong><p>Repita o caminho sem atalhos.</p></div>
      <ArrowRight aria-hidden="true" />
      <div><span>3</span><strong>Observe</strong><p>Anote onde o registro aparece.</p></div>
    </div>
    <button type="button" onClick={() => setShowPlan((value) => !value)} aria-expanded={showPlan} aria-controls="home-demo-plan">
      <RotateCcw aria-hidden="true" /> {showPlan ? "Fechar roteiro de investigação" : "Ver roteiro de investigação"}
    </button>
    {showPlan && <div id="home-demo-plan" className="qa-home-demo-result" aria-live="polite">
      <h3>Registre o que você realmente encontrou.</h3>
      <p>O resultado depende da sua investigação. Não assuma que o pensamento foi salvo ou perdido antes de verificar a tela.</p>
      <ul><li>Escreva os passos na ordem em que os executou.</li><li>Compare o conteúdo antes e depois de voltar.</li><li>Guarde uma captura sem dados pessoais.</li></ul>
    </div>}
    <p className="qa-home-demo-note">Exemplo fictício de prática · não representa um resultado confirmado do produto.</p>
  </div>;
}
