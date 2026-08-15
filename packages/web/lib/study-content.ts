import { posts } from "./blog-posts";

export type StudyTrack = {
  id: string;
  title: string;
  summary: string;
  level: "Fundacao" | "Pratica" | "Avancado";
  duration: string;
  focus: string[];
  exerciseHref: string;
  exerciseLabel: string;
  postSlugs: string[];
  checkpoint: string;
};

export type DiscussionPrompt = {
  id: string;
  title: string;
  summary: string;
  replies: number;
  tags: string[];
  exerciseHref: string;
};

export const studyTracks: StudyTrack[] = [
  {
    id: "bug-report",
    title: "Bug report que acelera decisao",
    summary:
      "Aprenda a transformar uma descoberta em um relato que engenharia, produto e negocio conseguem priorizar sem retrabalho.",
    level: "Fundacao",
    duration: "45 min",
    focus: ["impacto", "reproducao", "evidencia", "severidade"],
    exerciseHref: "/playground/expenseflow",
    exerciseLabel: "Cacar bugs no ExpenseFlow",
    postSlugs: ["como-escrever-um-bug-report-que-ajuda", "severidade-e-prioridade-nao-sao-a-mesma-coisa"],
    checkpoint:
      "Entregar 3 bugs com titulo, passos minimos, resultado atual, resultado esperado, severidade, prioridade e evidencia.",
  },
  {
    id: "exploratorio",
    title: "Teste exploratorio com foco",
    summary:
      "Use charters para investigar sem virar checklist mecanico e sem perder o rastro do que foi aprendido.",
    level: "Pratica",
    duration: "60 min",
    focus: ["charter", "timebox", "notas", "heuristicas"],
    exerciseHref: "/playground",
    exerciseLabel: "Abrir briefing do desafio",
    postSlugs: ["charter-de-teste-exploratorio-na-pratica"],
    checkpoint:
      "Rodar uma sessao de 30 minutos com missao clara, riscos observados, duvidas abertas e evidencias anexadas.",
  },
  {
    id: "bdd",
    title: "BDD a partir de comportamento",
    summary:
      "Escreva exemplos que removem ambiguidade antes da implementacao e que depois podem virar regressao.",
    level: "Pratica",
    duration: "75 min",
    focus: ["exemplos", "gherkin", "regra de negocio", "regressao"],
    exerciseHref: "/desafios",
    exerciseLabel: "Usar gerador de BDD",
    postSlugs: ["bdd-alem-do-dado-quando-entao"],
    checkpoint:
      "Criar 5 cenarios em Gherkin para fluxo principal, validacoes negativas e um edge case relevante.",
  },
  {
    id: "risco",
    title: "Estrategia baseada em risco",
    summary:
      "Priorize profundidade de teste quando nao existe tempo para testar tudo e comunique risco residual com clareza.",
    level: "Avancado",
    duration: "90 min",
    focus: ["probabilidade", "impacto", "cobertura", "risco residual"],
    exerciseHref: "/lab/studio",
    exerciseLabel: "Desenhar plano no Test Design",
    postSlugs: ["estrategia-de-testes-baseada-em-risco", "gargalo-do-teste-qa-de-bombeiro-a-parceiro-estrategico"],
    checkpoint:
      "Montar uma matriz com areas criticas, cobertura planejada, o que ficou fora e justificativa de negocio.",
  },
];

export const discussionPrompts: DiscussionPrompt[] = [
  {
    id: "bug-sem-video",
    title: "Quando um bug report sem video ainda e aceitavel?",
    summary:
      "Compare evidencia obrigatoria, contexto suficiente e custo de reproducao em defeitos simples versus instaveis.",
    replies: 18,
    tags: ["Bugs", "Evidencia", "Comunicacao"],
    exerciseHref: "/playground/template-bug-report",
  },
  {
    id: "prioridade-vs-severidade",
    title: "Quem decide prioridade: QA, produto ou engenharia?",
    summary:
      "Discuta como o QA influencia a decisao sem confundir impacto tecnico com urgencia de negocio.",
    replies: 24,
    tags: ["Triagem", "Risco", "Produto"],
    exerciseHref: "/estudos/severidade-e-prioridade-nao-sao-a-mesma-coisa",
  },
  {
    id: "bdd-detalhe-ui",
    title: "Cenario BDD deve falar de clique, tela e botao?",
    summary:
      "Analise quando detalhes de interface ajudam e quando escondem a regra que o time precisa alinhar.",
    replies: 15,
    tags: ["BDD", "Gherkin", "Requisitos"],
    exerciseHref: "/estudos/bdd-alem-do-dado-quando-entao",
  },
];

export const featuredPosts = posts.filter((post) =>
  [
    "como-escrever-um-bug-report-que-ajuda",
    "charter-de-teste-exploratorio-na-pratica",
    "bdd-alem-do-dado-quando-entao",
    "estrategia-de-testes-baseada-em-risco",
  ].includes(post.slug),
);

export function getTrackPosts(track: StudyTrack) {
  return track.postSlugs
    .map((slug) => posts.find((post) => post.slug === slug))
    .filter((post): post is (typeof posts)[number] => Boolean(post));
}
