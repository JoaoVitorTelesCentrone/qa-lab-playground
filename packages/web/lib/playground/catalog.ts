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
};

export const SEMANA_1 = "2026-08-10";
export const tracks: LabTrack[] = ["UI Automation", "API e Contrato"];

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

export function findLabByNumber(number: number) {
  return labs.find((lab) => lab.number === number);
}
