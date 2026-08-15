// Convite a colaborar com um texto do blog.
//
// Fica no fim do índice e no fim de cada artigo — é onde quem gostou do que
// leu está mais propenso a querer escrever. Usa o mesmo destaque visual do
// artigo em destaque para não passar como rodapé decorativo.

import { Linkedin, PenLine } from "lucide-react";

const linkedin = "https://www.linkedin.com/company/qa-lab-oficial/";

export function CollaborateCta() {
  return <aside aria-labelledby="colabore-title" className="qa-blog-collab mt-16">
    <div>
      <p className="qa-eyebrow inline-flex items-center gap-2"><PenLine className="size-3.5" aria-hidden="true" /> Escreva com a gente</p>
      <h2 id="colabore-title">Quer colaborar em um texto?</h2>
      <p>
        Se você tem um caso real, uma investigação que rendeu aprendizado ou um tema que faz falta aqui,
        mande uma mensagem no LinkedIn. A gente escreve junto e publica com seu crédito.
      </p>
    </div>
    <a href={linkedin} target="_blank" rel="noreferrer" className="qa-blog-collab-action">
      <Linkedin className="size-4" aria-hidden="true" />
      Mandar mensagem no LinkedIn
    </a>
  </aside>;
}
