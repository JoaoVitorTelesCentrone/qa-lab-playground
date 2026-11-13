/**
 * Quem está por trás do QA Lab. Este é um arquivo de conteúdo: edite à vontade.
 * Byline, /sobre, schema.org Person, OG images e o botão de compartilhar leem daqui.
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://qa-lab-playground-web.vercel.app").replace(/\/$/, "");

export const author = {
  name: "João Centrone",
  title: "Engenheiro de Automação de QA",
  /** Usado na byline: "Feito por João Centrone". */
  shortBio: "Engenheiro de Automação de QA. Escrevo sobre qualidade de software e construo ferramentas práticas.",
  /**
   * TODO(João): trocar pelo arquivo real (ex.: /author/joao-centrone.jpg, quadrado,
   * pelo menos 400×400). Enquanto isso, um monograma em SVG.
   */
  photo: "/author/joao-centrone.svg",
  links: {
    linkedin: "https://www.linkedin.com/in/joao-centrone",
    /** TODO(João): confirmar o usuário do GitHub. */
    github: "https://github.com/JoaoVitorTelesCentrone",
  },
  /**
   * TODO(João): colocar o PDF em public/cv/ e apontar aqui (ex.: "/cv/joao-centrone-cv.pdf").
   * Enquanto for null, o botão de baixar CV não aparece.
   */
  cv: null as string | null,
  /** Conteúdo da página /sobre. A trajetória é a do projeto, não uma lista de empregos. */
  about: {
    intro: "Meu trabalho é transformar qualidade de software em algo que se possa ver: um bug reproduzível, uma evidência anexada, uma decisão de teste explicada.",
    story: "O QA Lab começou como um lugar para praticar o que falta em muitos tutoriais: sistemas com defeitos de verdade, um modo correto para comparar e um relatório que registra o que foi encontrado. A partir daí, o projeto cresceu em três frentes.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "Bun", "Playwright"],
    stackNote: "Tecnologias com que mantenho o QA Lab Playground, o produto, os testes e o conteúdo deste site.",
    contactNote: "Para conversar sobre QA, automação ou o QA Lab, me encontre no LinkedIn. O código do projeto está no GitHub.",
  },
  /** Página com a bio completa. */
  aboutHref: "/sobre",
} as const;

export type Author = typeof author;
