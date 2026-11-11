/**
 * Quem está por trás do QA Lab. Este é um arquivo de conteúdo: edite à vontade.
 * Byline, /sobre, schema.org Person, OG images e o botão de compartilhar leem daqui.
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://qa-lab-playground-web.vercel.app").replace(/\/$/, "");

export const author = {
  name: "João Centrone",
  title: "QA Automation Engineer",
  /** Usado na byline: "Built by João Centrone". */
  shortBio: "QA Automation Engineer writing about software quality and building practical tools.",
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
  /** Página com a bio completa. */
  aboutHref: "/sobre",
} as const;

export type Author = typeof author;
