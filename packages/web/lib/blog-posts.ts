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
  blocos: Block[];
}

// ==============================
// Posts
// ==============================

export const posts: BlogPost[] = [
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
];

// ==============================
// Helpers
// ==============================

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
