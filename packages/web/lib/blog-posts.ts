// ==============================
// Types
// ==============================

export type BlockType =
  | "paragraph"
  | "heading"
  | "subheading"
  | "list"
  | "ordered-list"
  | "callout"
  | "code"
  | "quote"
  | "divider";

export interface Block {
  type: BlockType;
  content?: string;
  items?: string[];
  language?: string;
  variant?: "info" | "warning" | "tip" | "danger";
}

export interface BlogPost {
  slug: string;
  titulo: string;
  resumo: string;
  autor: string;
  data: string;
  tags: string[];
  tempoLeitura: number;
  destaque?: boolean;
  /** Lançamento enxuto: só posts com publicado=true aparecem no /blog. */
  publicado?: boolean;
  editorial?: {
    seriesId: string;
    seriesTitle: string;
    seriesHref: string;
    color: string;
    number: number;
    composition: "field" | "sequence" | "decision";
    artifact: [string, string, string];
    source?: { label: string; href: string };
  };
  blocos: Block[];
}

import { editorialPosts } from "./blog-editorial";

// ==============================
// Posts
// ==============================

const allPosts: BlogPost[] = [
  {
    slug: "gargalo-do-teste-qa-de-bombeiro-a-parceiro-estrategico",
    titulo: "O Gargalo do Teste: de Bombeiro a Parceiro Estratégico",
    resumo:
      "14 dias de desenvolvimento, 1 dia para o QA. Se o seu time vive esse ciclo, o problema não é agenda — é cultura. Entenda por que qualidade não é uma fase e como o Shift Left muda tudo.",
    autor: "QA Lab",
    data: "2026-04-28",
    tags: ["Shift-Left", "Estratégia", "Agilidade", "DevOps"],
    tempoLeitura: 3,
    destaque: true,
    publicado: true,
    blocos: [
      { type: "paragraph", content: "Uma sprint de quinze dias em que o desenvolvimento ocupa catorze e sobra um para QA parece um problema de agenda. Na prática, é um sinal de que a qualidade entrou tarde demais no processo. Nesse último dia, a pessoa de QA recebe uma mudança grande, ainda está tentando entender as regras e precisa decidir o que vale testar primeiro. Se encontra um problema importante, corrigir e validar de novo compete com a data de entrega. Se não encontra, o silêncio pode ser confundido com confiança, mesmo quando várias áreas nem chegaram a ser investigadas." },
      { type: "paragraph", content: "Esse arranjo cria uma espécie de mini-waterfall dentro de uma equipe que talvez trabalhe em sprints: alguém define, alguém desenvolve e, só no fim, outra pessoa tenta descobrir se o resultado atende ao combinado. O atraso não está apenas na execução dos testes. Dúvidas que poderiam ser resolvidas no refinamento reaparecem como retrabalho, e decisões de produto ficam escondidas dentro do código até que alguém tente usá-lo de um jeito diferente do esperado." },
      { type: "paragraph", content: "Pense em uma mudança no fluxo de captura de pensamentos do BrotoSpace. A pessoa consegue registrar uma ideia, sair daquela área e reencontrá-la depois? Se relacioná-la a um desafio ou a uma ação, esse contexto continua visível ao retomar? Uma conversa sobre esses exemplos antes da implementação pode esclarecer qual resultado foi combinado e indicar quais verificações dão mais informação. Descobrir a mesma dúvida depois de pronto costuma envolver mais gente e mais mudanças." },
      { type: "paragraph", content: "Trazer qualidade para mais perto do início não significa fazer QA aprovar cada linha de código, nem escrever uma lista enorme de testes antes de começar. Significa compartilhar a responsabilidade. Produto ajuda a explicitar o comportamento esperado; desenvolvimento considera casos-limite e facilita a verificação; QA contribui com perguntas sobre risco, uso e evidência. A automação também ajuda, desde que proteja comportamentos importantes e dê retorno frequente. Testes instáveis ou uma suíte lenta podem apenas deslocar o gargalo." },
      { type: "paragraph", content: "Uma equipe pode começar pequeno: no refinamento, escolher um fluxo e perguntar o que pode falhar e como isso seria percebido; durante a implementação, integrar mudanças menores e executar checagens relevantes; antes de encerrar, combinar que evidência é suficiente e quais riscos permanecem. A definição de pronto deixa de ser uma frase genérica e passa a refletir o que realmente foi construído e verificado." },
      { type: "paragraph", content: "O resultado esperado não é eliminar todos os defeitos nem prometer que cada entrega será perfeita. É reduzir surpresas, dar tempo para investigar o que importa e tornar explícitas as decisões. QA continua testando; só deixa de ser a última barreira encarregada de compensar, em poucas horas, todas as conversas que o time adiou. Se o teste sempre começa no fim, experimente trazer uma pergunta de qualidade para o próximo refinamento e observe que retrabalho ela evita." },
    ],
  },
  {
    slug: "como-escrever-um-bug-report-que-ajuda",
    titulo: "Como escrever um bug report que realmente ajuda",
    resumo: "Um bom relato reduz dúvidas, acelera a reprodução e deixa claro por que o problema merece atenção.",
    autor: "QA Lab", data: "2026-05-05", tags: ["Bugs", "Comunicação", "Prática"], tempoLeitura: 5,
    blocos: [
      { type: "paragraph", content: "Um bug report não é apenas um registro técnico. Ele conecta investigação, produto e engenharia para permitir uma decisão rápida e segura." },
      { type: "heading", content: "Comece pelo impacto" },
      { type: "paragraph", content: "Explique quem é afetado, com que frequência e o que deixa de ser possível. Isso oferece contexto para prioridade sem confundir prioridade com severidade." },
      { type: "heading", content: "Torne a reprodução determinística" },
      { type: "list", items: ["Informe ambiente e dados utilizados.", "Escreva passos mínimos e numerados.", "Separe resultado atual do esperado.", "Anexe evidência que acrescente informação."] },
      { type: "callout", variant: "tip", content: "Antes de enviar, siga seus próprios passos do zero. Se você não reproduzir, outra pessoa provavelmente também não conseguirá." },
    ],
  },
  {
    slug: "severidade-e-prioridade-nao-sao-a-mesma-coisa",
    titulo: "Severidade e prioridade não são a mesma coisa",
    resumo: "Separar impacto técnico de urgência de negócio melhora a triagem e evita discussões baseadas apenas em opinião.",
    autor: "QA Lab", data: "2026-05-12", tags: ["Risco", "Triagem", "Produto"], tempoLeitura: 4,
    blocos: [
      { type: "paragraph", content: "Severidade descreve o tamanho do dano causado pelo defeito. Prioridade indica quando ele deve ser tratado dentro do contexto atual do produto." },
      { type: "heading", content: "Um exemplo simples" },
      { type: "paragraph", content: "Um erro visual na campanha que começa amanhã pode ter baixa severidade e alta prioridade. Uma falha crítica em uma função ainda desativada pode ter alta severidade e prioridade temporariamente menor." },
      { type: "callout", variant: "info", content: "A classificação ganha valor quando vem acompanhada de alcance, frequência, alternativa disponível e impacto para o negócio." },
    ],
  },
  {
    slug: "charter-de-teste-exploratorio-na-pratica",
    titulo: "Charter de teste exploratório na prática",
    resumo: "Direcione uma sessão exploratória com foco suficiente para aprender sem transformar exploração em roteiro rígido.",
    autor: "QA Lab", data: "2026-05-19", tags: ["Exploratório", "Estratégia", "Heurísticas"], tempoLeitura: 6,
    blocos: [
      { type: "paragraph", content: "Um charter define missão, alvo e riscos de uma sessão. Ele evita exploração aleatória, mas preserva espaço para seguir descobertas relevantes." },
      { type: "heading", content: "Estrutura mínima" },
      { type: "ordered-list", items: ["Explore um alvo específico.", "Use dados, ferramentas ou heurísticas definidas.", "Busque riscos e comportamentos relevantes.", "Limite a sessão com um timebox.", "Registre notas, dúvidas e evidências."] },
      { type: "callout", variant: "tip", content: "Exemplo: explorar o cadastro de despesas usando valores-limite para descobrir perdas de precisão e inconsistências de saldo em 30 minutos." },
    ],
  },
  {
    slug: "bdd-alem-do-dado-quando-entao",
    titulo: "BDD além do Dado, Quando, Então",
    resumo: "Gherkin organiza exemplos, mas BDD começa na conversa sobre regras, riscos e comportamentos observáveis.",
    autor: "QA Lab", data: "2026-05-26", tags: ["BDD", "Gherkin", "Colaboração"], tempoLeitura: 5,
    blocos: [
      { type: "paragraph", content: "Cenários bem formatados podem continuar ruins. BDD não é uma técnica de tradução automática de requisitos: é uma forma colaborativa de descobrir exemplos antes da implementação." },
      { type: "heading", content: "Prefira comportamento observável" },
      { type: "paragraph", content: "Evite descrever cliques e detalhes de tela quando a regra é o que importa. Escreva o contexto relevante, a ação do negócio e o resultado que alguém consegue observar." },
      { type: "callout", variant: "warning", content: "Se o cenário apenas repete o requisito sem adicionar um exemplo concreto, a equipe ainda não eliminou a ambiguidade." },
    ],
  },
  {
    slug: "estrategia-de-testes-baseada-em-risco",
    titulo: "Estratégia de testes baseada em risco",
    resumo: "Quando não é possível testar tudo, risco ajuda a decidir onde profundidade e velocidade realmente importam.",
    autor: "QA Lab", data: "2026-06-02", tags: ["Risco", "Estratégia", "Planejamento"], tempoLeitura: 7,
    blocos: [
      { type: "paragraph", content: "Cobertura não é sinônimo de quantidade. Uma estratégia útil concentra esforço onde probabilidade de falha e impacto se combinam de forma mais perigosa." },
      { type: "heading", content: "Mapeie antes de executar" },
      { type: "list", items: ["Fluxos que movimentam dinheiro ou dados sensíveis.", "Integrações e dependências instáveis.", "Mudanças grandes ou pouco conhecidas.", "Áreas com histórico de incidentes.", "Comportamentos sem alternativa para o usuário."] },
      { type: "heading", content: "Comunique o que ficou de fora" },
      { type: "paragraph", content: "Uma estratégia madura explicita cobertura, limitações e risco residual. Isso transforma teste em informação para decisão, não em promessa impossível de ausência de bugs." },
    ],
  },
];

// ==============================
// Helpers
// ==============================

export const posts: BlogPost[] = [...allPosts.filter((post) => post.publicado), ...editorialPosts];

const postsBySlug = new Map(posts.map((post) => [post.slug, post]));

export function getPostBySlug(slug: string): BlogPost | undefined {
  return postsBySlug.get(slug);
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const post = getPostBySlug(slug);
  if (!post) return [];

  return posts
    .filter((p) => p.slug !== slug)
    .filter((p) => p.tags.some((t) => post.tags.includes(t)))
    .slice(0, limit);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
