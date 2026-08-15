// "Minha jornada": deriva o painel do aluno a partir do que está no banco.
//
// Módulo puro — recebe as linhas já lidas do Supabase e devolve o resumo que a
// home e o perfil renderizam. Nenhuma regra de progresso mora em componente.

import { labs, type Lab } from "@/lib/playground/catalog";
import { practiceApps, type PracticeAppId } from "./apps";
import { regressionPacks } from "@/lib/regression-packs";

export type EnrollmentStatus = "started" | "completed" | "abandoned";

export type Enrollment = {
  labSlug: string;
  status: EnrollmentStatus;
  startedAt: string;
  completedAt: string | null;
  updatedAt: string;
};

export type Submission = {
  id: string;
  labSlug: string;
  result: string;
  reproduction: string;
  severity: "baixa" | "media" | "alta" | "critica";
  createdAt: string;
};

export type ScenarioRun = {
  appId: string;
  scenarioId: string;
  status: "passou" | "falhou" | "bloqueado";
};

export type LabProgress = {
  lab: Lab;
  status: EnrollmentStatus | "nao-iniciado";
  submissions: number;
  updatedAt: string | null;
};

export type AppCoverage = {
  id: PracticeAppId;
  name: string;
  route: string;
  summary: string;
  executed: number;
  total: number;
  failed: number;
  percent: number;
};

export type Journey = {
  started: number;
  completed: number;
  evidence: number;
  /** Percentual de Labs iniciados que chegaram a ter evidência entregue. */
  completionRate: number;
  /** Próximo Lab a praticar: o iniciado mais recente ou o primeiro ainda intocado. */
  nextLab: Lab | null;
  /** Todos os Labs já tocados, do mais recente para o mais antigo. */
  labs: LabProgress[];
  /** Os 5 mais recentes, para o painel da home. */
  recent: LabProgress[];
  coverage: AppCoverage[];
};

const releasedLabs = () => labs.filter((lab) => lab.status === "liberado");

export function buildJourney(enrollments: Enrollment[], submissions: Submission[], runs: ScenarioRun[]): Journey {
  const byLab = new Map(enrollments.map((item) => [item.labSlug, item]));
  const submissionsByLab = new Map<string, number>();
  for (const submission of submissions) submissionsByLab.set(submission.labSlug, (submissionsByLab.get(submission.labSlug) ?? 0) + 1);

  const started = enrollments.filter((item) => item.status !== "abandoned").length;
  const completed = enrollments.filter((item) => item.status === "completed").length;

  // flatMap descarta a matrícula de um Lab que saiu do catálogo sem quebrar o painel.
  const recent = enrollments
    .flatMap<LabProgress>((item) => {
      const lab = labs.find((candidate) => candidate.slug === item.labSlug);
      return lab ? [{ lab, status: item.status, submissions: submissionsByLab.get(item.labSlug) ?? 0, updatedAt: item.updatedAt }] : [];
    })
    .sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""));

  const inProgress = recent.find((item) => item.status === "started")?.lab ?? null;
  const untouched = releasedLabs().find((lab) => !byLab.has(lab.slug)) ?? null;

  return {
    started,
    completed,
    evidence: submissions.length,
    completionRate: started === 0 ? 0 : Math.round((completed / started) * 100),
    nextLab: inProgress ?? untouched,
    labs: recent,
    recent: recent.slice(0, 5),
    coverage: buildCoverage(runs),
  };
}

export function buildCoverage(runs: ScenarioRun[]): AppCoverage[] {
  return practiceApps.map((app) => {
    const total = regressionPacks.find((pack) => pack.id === app.id)?.scenarios.length ?? 0;
    const appRuns = runs.filter((run) => run.appId === app.id);
    const executed = new Set(appRuns.map((run) => run.scenarioId)).size;
    return {
      id: app.id,
      name: app.name,
      route: app.route,
      summary: app.summary,
      executed,
      total,
      failed: appRuns.filter((run) => run.status === "falhou").length,
      percent: total === 0 ? 0 : Math.round((executed / total) * 100),
    };
  });
}

export const emptyJourney: Journey = buildJourney([], [], []);
