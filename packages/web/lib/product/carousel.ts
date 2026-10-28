import { posts, type BlogPost } from "@/lib/blog-posts";
import { challenges, type Challenge } from "@/lib/challenges";
import { researchLibrary, type ResearchWork } from "@/lib/research-library";

export type CarouselSourceKind = "tema" | "blog" | "desafio" | "referencia";

export type CarouselSlide = {
  id: string;
  kind: "cover" | "content" | "list" | "cta";
  eyebrow: string;
  title: string;
  body?: string;
  bullets?: string[];
  footer?: string;
};

export type CarouselSourceOption = {
  kind: CarouselSourceKind;
  id: string;
  label: string;
  hint: string;
};

const MAX_SLIDES = 8;

const readyTopics: { id: string; label: string; hint: string; slides: CarouselSlide[] }[] = [
  {
    id: "ia-e-julgamento",
    label: "IA executa. QA decide.",
    hint: "Carreira · IA · 5 slides",
    slides: [
      { id: "cover", kind: "cover", eyebrow: "IA + QA", title: "A IA executa. Você decide.", body: "O valor do QA aparece quando o teste termina e a pergunta começa." },
      { id: "sinal", kind: "content", eyebrow: "O sinal", title: "Um teste verde é um sinal.", body: "A resposta 200 confirma a execução. Ela não prova sozinha que a regra de negócio foi atendida." },
      { id: "diferenca", kind: "list", eyebrow: "O julgamento", title: "Resultado não é decisão.", bullets: ["A IA ajuda a repetir, resumir e sugerir.", "O QA investiga o contexto e prioriza riscos.", "A evidência sustenta a escolha e explica o impacto."] },
      { id: "exemplo", kind: "content", eyebrow: "Exemplo fictício", title: "O teste passou. E agora?", body: "Um clique duplo criou dois pedidos. A suíte estava verde; o risco para o usuário ainda precisava ser investigado." },
      { id: "cta", kind: "cta", eyebrow: "Pratique", title: "Pare de só rodar. Comece a decidir.", body: "Explore os labs gratuitos do QA Lab." },
    ],
  },
  {
    id: "bug-report-util",
    label: "Bug report que ajuda a decidir",
    hint: "Evidência · comunicação · 5 slides",
    slides: [
      { id: "cover", kind: "cover", eyebrow: "Evidência", title: "Achou um bug. E agora?", body: "Um bom relato permite que outra pessoa entenda o risco e reproduza o problema." },
      { id: "sintoma", kind: "content", eyebrow: "Primeiro passo", title: "Separe fato de hipótese.", body: "Fato: o pedido foi duplicado. Hipótese: o botão aceitou dois envios antes da resposta." },
      { id: "estrutura", kind: "list", eyebrow: "Checklist", title: "O que registrar", bullets: ["Passos e dados necessários para reproduzir.", "Resultado esperado e comportamento observado.", "Evidência verificável e impacto possível."] },
      { id: "decisao", kind: "content", eyebrow: "Depois do relato", title: "Mostre o que falta saber.", body: "Diga quem pode ser afetado, o que ainda não foi confirmado e qual verificação ajudaria a decidir." },
      { id: "cta", kind: "cta", eyebrow: "Sua vez", title: "Transforme achado em evidência.", body: "Pratique em um caso gratuito do QA Lab." },
    ],
  },
  {
    id: "priorizacao-por-risco",
    label: "Como priorizar testes por risco",
    hint: "Estratégia · priorização · 5 slides",
    slides: [
      { id: "cover", kind: "cover", eyebrow: "Estratégia", title: "Não dá tempo de testar tudo.", body: "A saída é escolher com critério e tornar o risco residual visível." },
      { id: "pergunta", kind: "content", eyebrow: "Comece aqui", title: "O que pode dar errado?", body: "Liste as falhas que mudariam a decisão de liberar o fluxo. Não comece pela contagem de casos." },
      { id: "criterios", kind: "list", eyebrow: "Quatro perguntas", title: "Priorize pelo impacto.", bullets: ["Quem é afetado se falhar?", "Qual o custo ou a gravidade da falha?", "Quão provável é o problema neste contexto?", "Qual evidência já temos?" ] },
      { id: "limite", kind: "content", eyebrow: "A decisão", title: "Registre o que ficou de fora.", body: "Teste primeiro os riscos mais relevantes e comunique o que não foi coberto antes da release." },
      { id: "cta", kind: "cta", eyebrow: "Pratique", title: "Troque volume por critério.", body: "Explore os desafios gratuitos do QA Lab." },
    ],
  },
  {
    id: "api-status-200",
    label: "Status 200 não garante o fluxo",
    hint: "API · contrato · 5 slides",
    slides: [
      { id: "cover", kind: "cover", eyebrow: "Teste de API", title: "Deu 200. Mas funcionou?", body: "O status é uma pista. A regra de negócio pede outras verificações." },
      { id: "resposta", kind: "content", eyebrow: "A resposta", title: "HTTP não conta a história toda.", body: "A API respondeu com sucesso, mas o corpo pode trazer dados errados ou um estado inconsistente." },
      { id: "checklist", kind: "list", eyebrow: "O que conferir", title: "Vá além do status.", bullets: ["Contrato e campos obrigatórios.", "Estado persistido após a operação.", "Permissões e dados de outro usuário.", "Repetição da mesma requisição."] },
      { id: "exemplo", kind: "content", eyebrow: "Exemplo fictício", title: "DELETE respondeu 200.", body: "Uma nova consulta ainda encontrou o registro. Sem verificar o estado, o teste teria passado." },
      { id: "cta", kind: "cta", eyebrow: "Treine", title: "Teste o comportamento, não só o código.", body: "Abra o API Lab gratuito do QA Lab." },
    ],
  },
  {
    id: "automacao-com-criterio",
    label: "O que vale automatizar?",
    hint: "Automação · decisão · 5 slides",
    slides: [
      { id: "cover", kind: "cover", eyebrow: "Automação", title: "Nem todo teste precisa virar script.", body: "Escolha onde a automação reduz risco sem criar manutenção desnecessária." },
      { id: "filtro", kind: "content", eyebrow: "Antes do código", title: "Pergunte por que repetir.", body: "Um fluxo frequente e estável costuma oferecer mais retorno do que uma interface que ainda muda a cada sprint." },
      { id: "criterios", kind: "list", eyebrow: "Quatro critérios", title: "Automatize com intenção.", bullets: ["Risco que o teste protege.", "Frequência de execução.", "Estabilidade do comportamento.", "Custo de criar e manter o teste."] },
      { id: "limite", kind: "content", eyebrow: "E o exploratório?", title: "Reserve espaço para investigar.", body: "Automação verifica expectativas conhecidas. Exploração ajuda a descobrir perguntas que ainda não entraram na suíte." },
      { id: "cta", kind: "cta", eyebrow: "Pratique", title: "Decida antes de automatizar.", body: "Experimente os labs gratuitos do QA Lab." },
    ],
  },
];

function slugTitle(kind: CarouselSourceKind) {
  return kind === "blog" ? "Artigo" : kind === "desafio" ? "Desafio" : "Referência";
}

function slidesFromBlogPost(post: BlogPost): CarouselSlide[] {
  const slides: CarouselSlide[] = [
    { id: "cover", kind: "cover", eyebrow: "QA Lab · Artigo", title: post.titulo, body: post.resumo, footer: post.tags.slice(0, 3).join("  ·  ") },
  ];
  for (const block of post.blocos) {
    if (slides.length >= MAX_SLIDES - 1) break;
    if (block.type === "heading" && block.content) {
      slides.push({ id: `h-${slides.length}`, kind: "content", eyebrow: "Continua", title: block.content });
    } else if (block.type === "subheading" && block.content) {
      slides.push({ id: `sh-${slides.length}`, kind: "content", eyebrow: "Continua", title: block.content });
    } else if ((block.type === "list" || block.type === "ordered-list") && block.items?.length) {
      const last = slides[slides.length - 1];
      if (last && last.kind === "content" && !last.bullets) last.bullets = block.items.slice(0, 5);
      else slides.push({ id: `l-${slides.length}`, kind: "list", eyebrow: "Continua", title: "Pontos-chave", bullets: block.items.slice(0, 5) });
    } else if (block.type === "paragraph" && block.content) {
      const last = slides[slides.length - 1];
      if (last && last.kind === "content" && !last.body) last.body = block.content;
    }
  }
  slides.push({ id: "cta", kind: "cta", eyebrow: "Leia completo", title: "Continue no blog do QA Lab", body: "Encontre o artigo pelo título e aprofunde o exemplo.", footer: "Conteúdo aberto" });
  return slides;
}

function slidesFromChallenge(challenge: Challenge): CarouselSlide[] {
  const slides: CarouselSlide[] = [
    {
      id: "cover",
      kind: "cover",
      eyebrow: `QA Lab · Desafio ${challenge.tipo === "semanal" ? "semanal" : "mensal"}`,
      title: challenge.titulo,
      body: challenge.descricao,
      footer: `${challenge.dificuldade.toUpperCase()}  ·  ${challenge.xp} XP`,
    },
    {
      id: "passos",
      kind: "list",
      eyebrow: "Como topar",
      title: "Passo a passo",
      bullets: challenge.passos.slice(0, 6).map((step) => step.descricao),
    },
  ];
  slides.push({
    id: "cta",
    kind: "cta",
    eyebrow: "Bora praticar?",
    title: "Topa o desafio?",
    body: "Use o cenário do desafio para investigar e registrar sua evidência.",
    footer: challenge.tags.slice(0, 3).join("  ·  "),
  });
  return slides;
}

function slidesFromResearch(work: ResearchWork): CarouselSlide[] {
  const authors = work.authors.slice(0, 3).join(", ") + (work.authors.length > 3 ? " et al." : "");
  return [
    { id: "cover", kind: "cover", eyebrow: "QA Lab · Referência", title: work.title, body: `${authors} · ${work.year}`, footer: work.venue },
    { id: "abstract", kind: "content", eyebrow: "Do que trata", title: "Resumo", body: work.abstract.slice(0, 420) },
    { id: "topics", kind: "list", eyebrow: "Por que interessa ao QA", title: "Tópicos", bullets: work.topics.slice(0, 6) },
    { id: "cta", kind: "cta", eyebrow: "Fonte", title: work.source, body: work.doi || work.url, footer: "Link nos comentários" },
  ];
}

export function listCarouselSources(): CarouselSourceOption[] {
  const temas = readyTopics.map((topic) => ({ kind: "tema" as const, id: topic.id, label: topic.label, hint: topic.hint }));
  const blog = posts.map((post) => ({ kind: "blog" as const, id: post.slug, label: post.titulo, hint: `${slugTitle("blog")} · ${post.tempoLeitura} min` }));
  const desafios = challenges.map((challenge) => ({ kind: "desafio" as const, id: challenge.id, label: challenge.titulo, hint: `${slugTitle("desafio")} · ${challenge.dificuldade}` }));
  const referencias = researchLibrary.items.slice(0, 60).map((work) => ({ kind: "referencia" as const, id: work.id, label: work.title, hint: `${slugTitle("referencia")} · ${work.year}` }));
  return [...temas, ...blog, ...desafios, ...referencias];
}

export function buildCarouselDeck(kind: CarouselSourceKind, id: string): CarouselSlide[] | null {
  if (kind === "tema") {
    const topic = readyTopics.find((item) => item.id === id);
    return topic ? topic.slides.map((slide) => ({ ...slide, bullets: slide.bullets ? [...slide.bullets] : undefined })) : null;
  }
  if (kind === "blog") {
    const post = posts.find((item) => item.slug === id);
    return post ? slidesFromBlogPost(post) : null;
  }
  if (kind === "desafio") {
    const challenge = challenges.find((item) => item.id === id);
    return challenge ? slidesFromChallenge(challenge) : null;
  }
  const work = researchLibrary.items.find((item) => item.id === id);
  return work ? slidesFromResearch(work) : null;
}
