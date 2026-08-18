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
  /** Identidade interna: rota /labs/[number], trilhas e `lab_slug` no banco. */
  number: number;
  /** Número que o aluno lê, pela ordem de lançamento. `null` enquanto agendado. */
  position: number | null;
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
};

export const SEMANA_1 = "2026-08-10";
export const tracks: LabTrack[] = ["UI Automation", "API e Contrato"];

// Lançamento enxuto: só o ambiente de Finanças abre agora (ver apps.ts e
// product-home.tsx), então os 3 desafios liberados são desafios de Finanças —
// não faz sentido liberar um desafio de um ambiente que está fechado. O resto
// fica "agendado" (badge "em breve" no catálogo, redireciona pra waitlist se
// acessado direto) até o time decidir liberar mais. Nada é deletado — só a
// data de liberação muda. Ver [[qa-lab-lancamento-enxuto]].
// Números 101/103/105 = Lançamentos e saldo, Orçamento por categoria e Metas
// de reserva (variante "fluxo" de cada um) — ver lib/system-challenges.ts.
//
// A ORDEM importa e a lista é APPEND-ONLY: a posição aqui é o número que o
// aluno lê ("Lab 01"), e o número de catálogo (101) fica só como identidade
// interna — rota, trilha e `lab_slug` no banco. Mostrar 101 num lançamento de
// três Labs anuncia cem Labs que não existem.
//
// Nunca reordene nem insira no meio: o Lab 01 precisa continuar sendo o Lab 01
// depois que alguém publicar o case dele. Lab novo entra no fim, sempre.
const LAUNCH_ORDER = [101, 103, 105];
const launchPosition = (number: number) => {
  const index = LAUNCH_ORDER.indexOf(number);
  return index === -1 ? null : index + 1;
};
const AGENDADO = "2099-01-01";

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

export const labs: Lab[] = systemChallenges.map((challenge) => {
  const track: LabTrack = challenge.area === "API" ? "API e Contrato" : "UI Automation";
  const content = contentFor({ title: challenge.title, objective: challenge.objective, requiredFeature: challenge.area, delivery: "Evidencia registrada no proprio Lab.", route: challenge.route }, challenge.number);
  const position = launchPosition(challenge.number);
  const released = position !== null;
  const status: LabStatus = released ? "liberado" : "agendado";
  return {
    number: challenge.number,
    position,
    slug: challenge.id,
    title: challenge.title,
    track,
    difficulty: challenge.difficulty === "Basico" ? "iniciante" : challenge.difficulty === "Intermediario" ? "intermediario" : "avancado",
    minutes: challenge.difficulty === "Basico" ? 15 : challenge.difficulty === "Intermediario" ? 30 : 60,
    week: challenge.number,
    releaseDate: released ? SEMANA_1 : AGENDADO,
    objective: challenge.objective,
    requiredFeature: challenge.area,
    delivery: "Resultado observado, passos de reproducao e severidade registrados no Lab.",
    acceptanceCriteria: challenge.acceptance,
    tags: [challenge.area.toLowerCase(), challenge.mode, status],
    route: challenge.route,
    status,
    content,
    postPrompt: `${content.postSegunda}\n\n${challenge.objective}\n\n#QA #QALab`,
  };
});

export function findLabByNumber(number: number) {
  return labs.find((lab) => lab.number === number);
}

/** O número que o aluno lê. Cai no de catálogo se o Lab ainda não foi lançado. */
export function labLabel(lab: Pick<Lab, "number" | "position">) {
  return String(lab.position ?? lab.number).padStart(2, "0");
}
