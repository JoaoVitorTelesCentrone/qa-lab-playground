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
  blocos: Block[];
}

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
    tempoLeitura: 6,
    destaque: true,
    publicado: true,
    blocos: [
      {
        type: "paragraph",
        content:
          "Uma sprint de 15 dias com 14 de desenvolvimento e apenas 1 para o QA. Se você reconhece esse cenário, seu time está vivendo o Gargalo do Teste — e o burnout é só uma questão de tempo.",
      },
      {
        type: "heading",
        content: "O Mini-Waterfall disfarçado de ágil",
      },
      {
        type: "paragraph",
        content:
          "Muitas equipes operam em um modelo que parece ágil no papel, mas na prática é um waterfall comprimido. O teste é tratado como a última fase antes do deploy, e aí vem a pressão absurda: validar em 24 horas o que levou duas semanas para ser construído.",
      },
      {
        type: "callout",
        variant: "warning",
        content:
          "Segundo o relatório Katalon, 55% dos profissionais de QA citam o tempo insuficiente como o principal desafio. Mas o problema vai muito além da agenda apertada.",
      },
      {
        type: "heading",
        content: "Bugs de última hora não são só falhas técnicas",
      },
      {
        type: "paragraph",
        content:
          "Defeitos descobertos às vésperas do deploy não são apenas um problema de engenharia. São riscos financeiros e reputacionais concretos. Um bug de timezone custou 440 milhões de dólares à Knight Capital em 45 minutos. Um erro que, identificado no início da sprint, teria custado horas de trabalho.",
      },
      {
        type: "callout",
        variant: "danger",
        content:
          "Regra empírica da indústria: o custo de corrigir um bug aumenta 10x a cada fase que ele avança. Encontrado no desenvolvimento custa 1x. Em produção, pode custar 100x — em tempo, dinheiro e reputação.",
      },
      {
        type: "heading",
        content: "Qualidade não é uma fase. É uma mentalidade.",
      },
      {
        type: "paragraph",
        content:
          "A raiz do problema é cultural. Enquanto qualidade for vista como responsabilidade exclusiva do QA e como etapa final do processo, o gargalo vai se repetir sprint após sprint. A transformação começa quando qualidade passa a ser uma preocupação de toda a equipe, desde o primeiro dia.",
      },
      {
        type: "heading",
        content: "Shift Left na prática: três mudanças reais",
      },
      {
        type: "paragraph",
        content:
          "Shift Left não é teoria — é uma mudança de comportamento. Aqui estão três práticas que fazem diferença real:",
      },
      {
        type: "ordered-list",
        items: [
          "Definition of Done honesta — o código só está pronto se passar por validação e automação. Sem exceções, sem o clássico 'a gente testa depois'.",
          "Integração Contínua de verdade — commits pequenos e frequentes permitem testes paralelos e constantes. Branches gigantes são bombas-relógio esperando explodir na véspera do release.",
          "QA no refinamento desde o início — cenários de teste planejados antes da primeira linha de código. Perguntar 'e se?' enquanto ainda dá tempo de ajustar o design custa zero.",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        content:
          "Mover a qualidade para o início da sprint reduz custos com hotfixes, gera previsibilidade para o negócio e libera o QA para fazer o trabalho estratégico que realmente importa — em vez de apagar incêndios nas últimas horas.",
      },
      {
        type: "heading",
        content: "O papel do QA muda — e para melhor",
      },
      {
        type: "paragraph",
        content:
          "No modelo Shift Left, o QA deixa de ser a última barreira antes do deploy e se torna um parceiro de produto. As perguntas mudam: de 'esse código está correto?' para 'esse comportamento é o que o usuário precisa?'. Essa mudança de perspectiva é o que transforma um time de QA reativo em um time de qualidade estratégico.",
      },
      {
        type: "paragraph",
        content:
          "Pare de testar apenas no final. Comece a prevenir falhas desde o dia zero da sprint.",
      },
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

export const posts: BlogPost[] = allPosts.filter((post) => post.publicado);

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
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
