// ==============================
// Types
// ==============================

export type Difficulty = "facil" | "medio" | "dificil" | "expert";
export type ChallengeType = "semanal" | "mensal";
export type ChallengeModule =
  | "api"
  | "ecommerce"
  | "cenarios"
  | "datas"
  | "board"
  | "blog";

export interface ChallengeStep {
  id: string;
  descricao: string;
}

export interface Challenge {
  id: string;
  tipo: ChallengeType;
  titulo: string;
  descricao: string;
  dificuldade: Difficulty;
  xp: number;
  modulo: ChallengeModule;
  moduloHref: string;
  passos: ChallengeStep[];
  participantes: number;
  tags: string[];
  destaque?: boolean;
}

// ==============================
// Data
// ==============================

export const challenges: Challenge[] = [
  // ── Semanais ──────────────────────────────────────────────────────────────
  {
    id: "semanal-01",
    tipo: "semanal",
    titulo: "Bug Hunt Relampago",
    descricao:
      "Voce tem 30 minutos para encontrar o maximo de bugs no E-commerce. Documente cada um com passos de reproducao, evidencia e severidade.",
    dificuldade: "facil",
    xp: 150,
    modulo: "ecommerce",
    moduloHref: "/ecommerce",
    destaque: true,
    participantes: 47,
    tags: ["Exploratorio", "E-commerce", "Documentacao"],
    passos: [
      { id: "s01-p1", descricao: "Acesse o modulo E-commerce" },
      { id: "s01-p2", descricao: "Execute testes exploratorios por 30 minutos" },
      {
        id: "s01-p3",
        descricao: "Encontre e documente pelo menos 3 bugs com passos de reproducao",
      },
      {
        id: "s01-p4",
        descricao: "Classifique cada bug por severidade (Critico/Alto/Medio/Baixo)",
      },
      {
        id: "s01-p5",
        descricao: "Registre tudo nas suas anotacoes no modulo de Cenarios",
      },
    ],
  },
  {
    id: "semanal-02",
    tipo: "semanal",
    titulo: "API no Limite",
    descricao:
      "Teste todos os 10 endpoints da API com dados invalidos. Descubra quais retornam os status codes corretos e quais falham silenciosamente.",
    dificuldade: "medio",
    xp: 250,
    modulo: "api",
    moduloHref: "/api-playground",
    participantes: 31,
    tags: ["API", "Validacao", "Status Codes"],
    passos: [
      { id: "s02-p1", descricao: "Acesse o API Playground" },
      {
        id: "s02-p2",
        descricao: "Para cada endpoint, envie pelo menos 1 request com dados invalidos",
      },
      {
        id: "s02-p3",
        descricao: "Verifique se o status code retornado e semanticamente correto",
      },
      {
        id: "s02-p4",
        descricao: "Identifique endpoints que retornam 200 para requests invalidas",
      },
      {
        id: "s02-p5",
        descricao: "Documente os 3 comportamentos mais inesperados que encontrou",
      },
    ],
  },
  {
    id: "semanal-03",
    tipo: "semanal",
    titulo: "Sobrevivente do Caos",
    descricao:
      "Ative o Modo Caos e tente completar um fluxo de compra do inicio ao fim no E-commerce. Documente cada falha que impedir o fluxo.",
    dificuldade: "dificil",
    xp: 400,
    modulo: "api",
    moduloHref: "/api-playground",
    participantes: 19,
    tags: ["Chaos Engineering", "API", "E-commerce", "Resiliencia"],
    passos: [
      {
        id: "s03-p1",
        descricao: "Ative o Modo Caos no API Playground (botao no header)",
      },
      { id: "s03-p2", descricao: "Acesse o E-commerce e tente adicionar um produto ao carrinho" },
      { id: "s03-p3", descricao: "Tente avancar para o checkout" },
      {
        id: "s03-p4",
        descricao: "Documente cada mensagem de erro ou comportamento inesperado",
      },
      {
        id: "s03-p5",
        descricao:
          "Responda: o frontend trata os erros da API de forma amigavel ou deixa o usuario perdido?",
      },
    ],
  },
  {
    id: "semanal-04",
    tipo: "semanal",
    titulo: "Armadilhas do Tempo",
    descricao:
      "O modulo de Datas tem 10 bugs propositais. Encontre e documente pelo menos 5 deles nesta semana.",
    dificuldade: "medio",
    xp: 300,
    modulo: "datas",
    moduloHref: "/datas",
    participantes: 28,
    tags: ["Datas", "Timezone", "Edge Cases"],
    passos: [
      { id: "s04-p1", descricao: "Acesse o modulo Datas Bugadas" },
      { id: "s04-p2", descricao: "Interaja com todos os componentes da pagina" },
      {
        id: "s04-p3",
        descricao: "Encontre pelo menos 5 dos 10 bugs propositais",
      },
      {
        id: "s04-p4",
        descricao: "Para cada bug: descreva o comportamento esperado vs. o real",
      },
      {
        id: "s04-p5",
        descricao: "Identifique a categoria do bug (timezone, calculo, exibicao...)",
      },
    ],
  },

  // ── Mensais ───────────────────────────────────────────────────────────────
  {
    id: "mensal-01",
    tipo: "mensal",
    titulo: "Plano de Teste Completo",
    descricao:
      "Crie um plano de teste completo para o modulo E-commerce usando o Test Suite do QA Lab. Deve cobrir fluxo principal, casos negativos, edge cases e performance.",
    dificuldade: "dificil",
    xp: 800,
    modulo: "cenarios",
    moduloHref: "/cenarios",
    destaque: true,
    participantes: 12,
    tags: ["Planejamento", "Test Plan", "Documentacao", "E-commerce"],
    passos: [
      {
        id: "m01-p1",
        descricao: "Crie um novo Test Plan no modulo Cenarios chamado 'E-commerce - Plano Completo'",
      },
      {
        id: "m01-p2",
        descricao: "Crie pelo menos 3 suites: Fluxo Principal, Casos Negativos e Edge Cases",
      },
      {
        id: "m01-p3",
        descricao: "Adicione no minimo 20 casos de teste distribuidos entre as suites",
      },
      {
        id: "m01-p4",
        descricao: "Cada caso deve ter titulo, precondição, passos claros e resultado esperado especifico",
      },
      {
        id: "m01-p5",
        descricao: "Execute pelo menos 10 casos de teste e registre o resultado (Passou/Falhou/Bloqueado)",
      },
      {
        id: "m01-p6",
        descricao: "Vincule casos de teste aos Cenarios guiados existentes onde aplicavel",
      },
    ],
  },
  {
    id: "mensal-02",
    tipo: "mensal",
    titulo: "100% Bug Coverage",
    descricao:
      "Encontre TODOS os bugs propositais distribuidos nos modulos do QA Lab: 7 no E-commerce, 10 no modulo Datas, e os bugs escondidos na API.",
    dificuldade: "expert",
    xp: 1500,
    modulo: "ecommerce",
    moduloHref: "/ecommerce",
    participantes: 5,
    tags: ["Expert", "Todos os Modulos", "Bug Hunt", "Completionismo"],
    passos: [
      {
        id: "m02-p1",
        descricao: "Encontre e documente todos os 7 bugs do E-commerce",
      },
      {
        id: "m02-p2",
        descricao: "Encontre e documente todos os 10 bugs do modulo Datas",
      },
      {
        id: "m02-p3",
        descricao:
          "Identifique os endpoints da API que tem comportamento incorreto (pelo menos 3)",
      },
      {
        id: "m02-p4",
        descricao: "Para cada bug: escreva um caso de teste que o reproduz de forma deterministica",
      },
      {
        id: "m02-p5",
        descricao: "Classifique todos os bugs por: severidade, impacto no usuario e facilidade de correcao",
      },
      {
        id: "m02-p6",
        descricao: "Escreva um relatorio executivo com os 3 bugs de maior impacto e por que",
      },
    ],
  },
  {
    id: "mensal-03",
    tipo: "mensal",
    titulo: "Shift-Left na Pratica",
    descricao:
      "Simule o processo shift-left completo: para cada tarefa no Board, escreva os casos de teste ANTES de 'executar' a feature, e verifique quantos bugs voce previu.",
    dificuldade: "dificil",
    xp: 900,
    modulo: "board",
    moduloHref: "/ecommerce/board",
    participantes: 9,
    tags: ["Shift-Left", "DevOps", "Board", "Planejamento"],
    passos: [
      {
        id: "m03-p1",
        descricao: "Acesse o Board de Tarefas e escolha 4 historias do Backlog",
      },
      {
        id: "m03-p2",
        descricao: "Para cada historia, crie casos de teste no modulo Cenarios ANTES de testar",
      },
      {
        id: "m03-p3",
        descricao: "Vincule os casos de teste a cada card do board via modal de edicao",
      },
      {
        id: "m03-p4",
        descricao: "Execute os testes e mova os cards conforme o progresso (Backlog → Em Progresso → Concluido)",
      },
      {
        id: "m03-p5",
        descricao: "Compare: quantos bugs voce previu nos casos de teste vs. quantos encontrou ao executar?",
      },
    ],
  },
  {
    id: "mensal-04",
    tipo: "mensal",
    titulo: "Mestre das APIs",
    descricao:
      "Escreva um suite completo de testes para a API do QA Lab cobrindo todos os endpoints, com e sem Chaos Mode. Documente o comportamento de cada cenario de falha.",
    dificuldade: "expert",
    xp: 1200,
    modulo: "api",
    moduloHref: "/api-playground",
    participantes: 7,
    tags: ["API", "Chaos Engineering", "Automacao", "Expert"],
    passos: [
      {
        id: "m04-p1",
        descricao: "Mapeie todos os 10 endpoints: metodo, path, parametros e schema esperado",
      },
      {
        id: "m04-p2",
        descricao: "Crie um suite no modulo Cenarios com casos para cada endpoint (happy path + negativos)",
      },
      {
        id: "m04-p3",
        descricao: "Execute todos os casos COM Chaos Mode desativado e registre os resultados",
      },
      {
        id: "m04-p4",
        descricao: "Ative o Chaos Mode e re-execute os mesmos casos — compare os resultados",
      },
      {
        id: "m04-p5",
        descricao: "Identifique quais endpoints sao mais vunleraveis ao Chaos e explique por que",
      },
      {
        id: "m04-p6",
        descricao:
          "Proponha 3 melhorias de resiliencia para a API baseadas nos seus achados",
      },
    ],
  },
];

// ==============================
// Helpers
// ==============================

export const difficultyConfig: Record<
  Difficulty,
  { label: string; className: string; xpMultiplier: number }
> = {
  facil: {
    label: "Fácil",
    className: "text-neon bg-neon/20 border-neon/30",
    xpMultiplier: 1,
  },
  medio: {
    label: "Médio",
    className: "text-off-white/80 bg-off-white/10 border-off-white/20",
    xpMultiplier: 1.5,
  },
  dificil: {
    label: "Difícil",
    className: "text-[#F4A8A3] bg-[#F4A8A3]/10 border-[#F4A8A3]/30",
    xpMultiplier: 2,
  },
  expert: {
    label: "Expert",
    className: "text-coral bg-coral/20 border-coral/30",
    xpMultiplier: 3,
  },
};

export const moduleConfig: Record<
  ChallengeModule,
  { label: string; color: string }
> = {
  api: { label: "API Playground", color: "text-mint" },
  ecommerce: { label: "E-commerce", color: "text-[#F4A8A3]" },
  cenarios: { label: "Cenários", color: "text-mint/80" },
  datas: { label: "Datas", color: "text-mint/70" },
  board: { label: "Board", color: "text-mint/60" },
  blog: { label: "Blog", color: "text-coral/70" },
};
