import { ClipboardCheck, FlaskConical, SearchCheck } from "lucide-react";

export function MentorshipLabVisual({ compact = false }: { compact?: boolean }) {
  return <div className={`mentoria-lab-visual${compact ? " mentoria-lab-visual--compact" : ""}`} aria-hidden="true">
    <div className="mentoria-lab-toolbar">
      <span className="mentoria-lab-logo"><FlaskConical size={17} strokeWidth={2.2} /></span>
      <strong>QA Lab</strong>
      <span className="mentoria-lab-toolbar-end">Mentoria / investigação</span>
    </div>
    <div className="mentoria-lab-body">
      <div className="mentoria-lab-product">
        <span className="mentoria-lab-caption">Produto investigado</span>
        <strong>Broto Space</strong>
        <div className="mentoria-lab-journey"><span>Capturar</span><span>Organizar</span><span>Agir</span></div>
      </div>
      <div className="mentoria-lab-question">
        <span className="mentoria-lab-question-icon"><SearchCheck size={21} strokeWidth={1.9} /></span>
        <span className="mentoria-lab-caption">Pergunta de QA</span>
        <strong>O que acontece quando a jornada é interrompida?</strong>
        <div className="mentoria-lab-rule" />
        <div className="mentoria-lab-evidence"><ClipboardCheck size={19} strokeWidth={1.8} /><span>Investigue. Registre o que observou. Defenda sua decisão.</span></div>
      </div>
    </div>
    <div className="mentoria-lab-footer"><span className="mentoria-lab-live" /> Prática em produto real <span className="mentoria-lab-footer-mark">QA / LAB</span></div>
  </div>;
}
