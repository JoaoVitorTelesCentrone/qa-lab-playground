import { systemChallenges } from "@/lib/system-challenges";

export type LabTrack = "UI Automation" | "API e Contrato";
export type LabDifficulty = "iniciante" | "intermediario" | "avancado";
export type LabStatus = "liberado" | "agendado";

export type LabContent = {
  postSegunda: string;
  postQuarta: string;
  blogQuinta: string;
  postSexta: string;
  videoSabado: string;
};

export type Lab = {
  number: number;
  slug: string;
  title: string;
  track: LabTrack;
  difficulty: LabDifficulty;
  minutes: 15 | 30 | 60 | 90;
  week: number;
  releaseDate: string;
  objective: string;
  requiredFeature: string;
  delivery: string;
  acceptanceCriteria: string[];
  tags: string[];
  route: string;
  status: LabStatus;
  content: LabContent;
  postPrompt: string;
};

type LabSeed = {
  title: string;
  objective: string;
  requiredFeature: string;
  delivery: string;
  route: string;
  difficulty?: LabDifficulty;
  minutes?: 15 | 30 | 60 | 90;
};

export const SEMANA_1 = "2026-08-10";
export const tracks: LabTrack[] = ["UI Automation", "API e Contrato"];

const uiLabs: LabSeed[] = [
  { title: "Carrinho resiliente", objective: "Automatizar busca, detalhe, carrinho e remocao sem depender de ordem visual.", requiredFeature: "QA Lab Shop", delivery: "Suite Playwright do fluxo principal da loja.", route: "/shop/products", minutes: 30 },
  { title: "Locators que sobrevivem", objective: "Comparar seletores frageis com role, label e data-testid.", requiredFeature: "QA Lab Shop com classes e textos dinamicos.", delivery: "Antes/depois de locators com justificativa.", route: "/shop/products" },
  { title: "Checkout com dados ruins", objective: "Cobrir obrigatorios, limites e mensagens de erro no checkout.", requiredFeature: "Checkout da loja.", delivery: "Cenarios positivos, negativos e de borda.", route: "/shop/checkout", minutes: 30 },
  { title: "Login quebravel", objective: "Validar login feliz, obrigatorios, credencial invalida, usuario bloqueado e sessao expirada.", requiredFeature: "Tela de login com usuarios de teste.", delivery: "Suite curta de autenticacao.", route: "/labs/login" },
  { title: "Waits inteligentes", objective: "Esperar estado real de UI/API sem sleep fixo.", requiredFeature: "Tela de delays, skeleton, overlay e progress bar.", delivery: "Teste sem wait arbitrario.", route: "/labs/waits", minutes: 60 },
  { title: "Elementos dinamicos", objective: "Testar conteudo que muda entre renders sem acoplar ao texto errado.", requiredFeature: "Microdesafio com cards e IDs dinamicos.", delivery: "Assertions por estado e contrato visual.", route: "/labs/6" },
  { title: "Checklist de smoke", objective: "Montar smoke curto para o fluxo critico da loja.", requiredFeature: "Loja e checkout.", delivery: "Smoke de ate 10 minutos com criterio de corte.", route: "/labs/7" },
  { title: "Code review de teste", objective: "Identificar fragilidade em uma suite automatizada.", requiredFeature: "Diff com teste ruim e teste melhorado.", delivery: "Review comentado com riscos.", route: "/labs/8" },
  { title: "Tabela dinamica", objective: "Testar sorting, filtro e paginacao.", requiredFeature: "Tabela interativa.", delivery: "Suite cobrindo combinacoes relevantes.", route: "/labs/9" },
  { title: "Upload e download", objective: "Validar arquivo enviado e arquivo exportado.", requiredFeature: "Area de arquivos.", delivery: "Evidencia de conteudo e nome do arquivo.", route: "/labs/10" },
  { title: "Smoke vs sanity", objective: "Separar testes por objetivo e momento de execucao.", requiredFeature: "Fluxos da loja.", delivery: "Suite marcada por tipo.", route: "/labs/11" },
  { title: "Cobertura util", objective: "Relacionar cobertura a risco, nao a quantidade de testes.", requiredFeature: "Mapa de risco da loja.", delivery: "Matriz cobertura versus risco.", route: "/labs/12" },
  { title: "Pergunta antes de assumir", objective: "Transformar incerteza em criterio testavel.", requiredFeature: "Briefing ambiguo de produto.", delivery: "Perguntas e criterios reescritos.", route: "/labs/13" },
  { title: "Automacao sustentavel", objective: "Refatorar teste rapido que vira manutencao cara.", requiredFeature: "Suite fragil da loja.", delivery: "Refactor com motivo tecnico.", route: "/labs/14" },
  { title: "Manual estrategico", objective: "Definir quando automatizar nao paga.", requiredFeature: "Cenarios de risco e frequencia.", delivery: "Decisao documentada.", route: "/labs/15" },
  { title: "IA em testes", objective: "Avaliar sugestoes de IA antes de aceitar como teste.", requiredFeature: "Prompt e resposta simulada.", delivery: "Checklist de qualidade da sugestao.", route: "/labs/16" },
  { title: "Definition of Done", objective: "Comparar DoD escrito e praticado.", requiredFeature: "Release candidate da loja.", delivery: "Checklist de pronto com evidencias.", route: "/labs/17" },
  { title: "Bug em producao", objective: "Distinguir falha de QA e falha de processo.", requiredFeature: "Pedido da loja com defeito plantado.", delivery: "Analise de causa e prevencao.", route: "/shop/orders/1", minutes: 60 },
  { title: "Automacao doente", objective: "Diagnosticar sinais de uma suite instavel.", requiredFeature: "Suite da loja com anti-padroes.", delivery: "Plano de tratamento priorizado.", route: "/shop/products", minutes: 60 },
  { title: "Bug report ignorado", objective: "Reescrever bug para destravar decisao.", requiredFeature: "Template de bug report.", delivery: "Report com impacto, passos e evidencia.", route: "/playground/template-bug-report" },
];

const apiLabs: LabSeed[] = [
  { title: "CRUD completo de API", objective: "Criar, ler, atualizar, atualizar parcialmente e deletar reservas.", requiredFeature: "API REST /api/bookings.", delivery: "Suite cobrindo ciclo completo.", route: "/labs/api-crud", minutes: 60 },
  { title: "Status codes", objective: "Validar 200, 201, 400, 401, 404, 405 e 409.", requiredFeature: "Mesma API de reservas.", delivery: "Matriz de status com exemplos.", route: "/labs/api-crud" },
  { title: "Payload minimo", objective: "Descobrir campos obrigatorios por contrato.", requiredFeature: "POST /api/bookings.", delivery: "Casos positivos e negativos.", route: "/labs/api-crud" },
  { title: "Contrato JSON", objective: "Validar nomes, tipos e campos obrigatorios.", requiredFeature: "GET /api/bookings/:id.", delivery: "Contrato documentado.", route: "/labs/api-crud" },
  { title: "Auth por token", objective: "Proteger alteracoes de reserva.", requiredFeature: "PUT, PATCH e DELETE em /api/bookings.", delivery: "Cenarios 401, 403 e sucesso.", route: "/labs/api-crud" },
  { title: "Idempotencia", objective: "Evitar duplicidade em retry.", requiredFeature: "POST /api/bookings com Idempotency-Key.", delivery: "Teste de retry seguro.", route: "/labs/api-crud" },
  { title: "Paginacao", objective: "Validar page, perPage, total e totalPages.", requiredFeature: "GET /api/bookings.", delivery: "Suite de paginacao.", route: "/labs/api-crud" },
  { title: "Ordenacao", objective: "Validar ordem por nome, data e preco.", requiredFeature: "GET /api/bookings?sort=.", delivery: "Assertions de ordenacao.", route: "/labs/api-crud" },
  { title: "Filtros combinados", objective: "Combinar filtros sem perder dados.", requiredFeature: "GET /api/bookings com firstname, lastname e checkin.", delivery: "Tabela de combinacoes.", route: "/labs/api-crud" },
  { title: "Dados dinamicos", objective: "Resetar seed e isolar massa por sessao.", requiredFeature: "POST /api/test/reset e x-qalab-session.", delivery: "Plano de dados deterministico.", route: "/labs/api-crud" },
];

function slugify(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function addWeeks(date: string, weeks: number) {
  const parsed = new Date(`${date}T00:00:00.000Z`);
  parsed.setUTCDate(parsed.getUTCDate() + weeks * 7);
  return parsed.toISOString().slice(0, 10);
}

export function isLabReleased(lab: Pick<Lab, "releaseDate">, now = new Date()) {
  return now >= new Date(`${lab.releaseDate}T00:00:00.000Z`);
}

function contentFor(seed: LabSeed, number: number): LabContent {
  return {
    postSegunda: `Desafio da semana: ${seed.title}. Link para praticar e entrega esperada: ${seed.delivery}.`,
    postQuarta: `Erro comum em ${seed.title}: testar o caminho feliz e ignorar o risco que o lab quer expor.`,
    blogQuinta: `Conceito longo: como ${seed.objective.toLowerCase()} e transformar isso em criterio testavel.`,
    postSexta: `Solucao comentada: uma abordagem para ${seed.delivery.toLowerCase()} sem acoplar o teste ao detalhe errado.`,
    videoSabado: `Screencast resolvendo o Lab ${number}: do risco inicial ate a evidencia final.`,
  };
}

function buildLab(seed: LabSeed, index: number, track: LabTrack): Lab {
  const number = index + 1;
  const releaseDate = addWeeks(SEMANA_1, number - 1);
  const minutes = seed.minutes ?? (number % 5 === 0 ? 60 : number % 2 === 0 ? 30 : 15);
  const content = contentFor(seed, number);
  const status = isLabReleased({ releaseDate }) ? "liberado" : "agendado";
  return {
    number,
    slug: slugify(seed.title),
    title: seed.title,
    track,
    difficulty: seed.difficulty ?? (number % 3 === 0 ? "avancado" : number % 2 === 0 ? "intermediario" : "iniciante"),
    minutes,
    week: number,
    releaseDate,
    objective: seed.objective,
    requiredFeature: seed.requiredFeature,
    delivery: seed.delivery,
    acceptanceCriteria: [
      "Executar o fluxo principal sem depender de servicos externos.",
      "Registrar evidencia clara do comportamento observado.",
      "Separar resultado esperado, resultado atual e impacto.",
    ],
    tags: [track.split(" ")[0].toLowerCase(), seed.title.toLowerCase().split(" ")[0], status],
    route: seed.route,
    status,
    content,
    postPrompt: [
      content.postSegunda,
      "",
      `Desafio: ${seed.objective}.`,
      `Entrega: ${seed.delivery}.`,
      "Criterios: evidencias, assertions e risco documentado.",
      "Pergunta: que caso voce adicionaria?",
      "",
      "#QA #QualityAssurance #TestesDeSoftware #AutomacaoDeTestes #Playwright #APITesting #QALab",
    ].join("\n"),
  };
}

export const labs: Lab[] = systemChallenges.map((challenge) => {
  const track: LabTrack = challenge.area === "API" ? "API e Contrato" : "UI Automation";
  const content = contentFor({ title: challenge.title, objective: challenge.objective, requiredFeature: challenge.area, delivery: "Evidencia registrada no proprio Lab.", route: challenge.route }, challenge.number);
  return {
    number: challenge.number,
    slug: challenge.id,
    title: challenge.title,
    track,
    difficulty: challenge.difficulty === "Basico" ? "iniciante" : challenge.difficulty === "Intermediario" ? "intermediario" : "avancado",
    minutes: challenge.difficulty === "Basico" ? 15 : challenge.difficulty === "Intermediario" ? 30 : 60,
    week: challenge.number,
    releaseDate: SEMANA_1,
    objective: challenge.objective,
    requiredFeature: challenge.area,
    delivery: "Resultado observado, passos de reproducao e severidade registrados no Lab.",
    acceptanceCriteria: challenge.acceptance,
    tags: [challenge.area.toLowerCase(), challenge.mode, "liberado"],
    route: challenge.route,
    status: "liberado",
    content,
    postPrompt: `${content.postSegunda}\n\n${challenge.objective}\n\n#QA #QALab`,
  };
});

export const featuredLabNumbers = [1, 25, 50, 100];

export const bugCatalog = [
  { id: "locked-message", area: "Login", severity: "media", impact: "Usuario bloqueado recebe mensagem incorreta.", steps: "Acesse /labs/login?bug=locked-message e tente locked_out_user." },
  { id: "infinite-loading", area: "Waits", severity: "alta", impact: "Loading nunca termina e mascara falha de ambiente.", steps: "Acesse /labs/waits?bug=infinite-loading." },
  { id: "wrong-total", area: "Checkout", severity: "alta", impact: "Total cobrado difere do resumo esperado.", steps: "Acesse /shop/checkout?bug=wrong-total." },
  { id: "delete-without-auth", area: "API", severity: "critica", impact: "Reserva pode ser excluida sem token.", steps: "Envie DELETE /api/bookings/1?bug=delete-without-auth sem Authorization." },
  { id: "missing-focus", area: "Acessibilidade", severity: "alta", impact: "Usuario de teclado perde contexto visual.", steps: "Acesse /labs/acessibilidade?bug=missing-focus e navegue com Tab." },
];

export function findLabByNumber(number: number) {
  return labs.find((lab) => lab.number === number);
}
