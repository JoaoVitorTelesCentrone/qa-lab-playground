import type { ChallengeDeliverables } from "./challenge-deliverables";
import { cicdMissions } from "./cicd-lab";
import { peopleScenarios, type PeopleAttempt } from "./people-scenarios";

export type LearningCompetency = {
  id: "investigation" | "test-design" | "management" | "people" | "cicd" | "security";
  name: string;
  score: number;
  evidence: string;
  nextAction: string;
  href: string;
  available: boolean;
};

export function buildLearningProgress(deliverables: ChallengeDeliverables, attempts: PeopleAttempt[], cicdSolvedIds: string[] = []): LearningCompetency[] {
  const attemptedScenarios = attempts.map((attempt) => peopleScenarios.find((scenario) => scenario.id === attempt.scenarioId)).filter(Boolean);
  const uniquePeople = new Set(attempts.map((attempt) => attempt.scenarioId)).size;
  const cicdSolved = new Set(cicdSolvedIds.filter((id) => cicdMissions.some((mission) => mission.id === id))).size;
  const security = new Set(attemptedScenarios.filter((scenario) => scenario?.competencies.some((item) => item.includes("Segurança") || item.includes("Ética"))).map((scenario) => scenario?.id)).size;
  return [
    { id: "investigation", name: "Investigação e bugs", score: Math.min(100, deliverables.bugs.length * 20), evidence: `${deliverables.bugs.length} bug report(s)`, nextAction: deliverables.bugs.length >= 5 ? "Revisar evidências" : "Encontrar e documentar 5 bugs", href: "/playground/expenseflow", available: true },
    { id: "test-design", name: "Design de testes", score: Math.min(100, deliverables.bdd.length * 20 + deliverables.e2e.length * 20), evidence: `${deliverables.bdd.length} BDD · ${deliverables.e2e.length} decisões E2E`, nextAction: "Transformar riscos em cobertura", href: "/playground/entregas", available: true },
    { id: "management", name: "Gestão da qualidade", score: Math.min(100, deliverables.e2e.length * 15), evidence: `${deliverables.e2e.length} decisão(ões) justificadas`, nextAction: "Criar estratégia e priorização", href: "/lab/studio", available: true },
    { id: "people", name: "Pessoas e comunicação", score: Math.min(100, Math.round(uniquePeople * 12.5)), evidence: `${uniquePeople} situação(ões) praticadas`, nextAction: "Responder uma situação ainda não vista", href: "/lab/pessoas", available: true },
    { id: "cicd", name: "CI/CD e entrega", score: Math.round((cicdSolved / cicdMissions.length) * 100), evidence: cicdSolved ? `${cicdSolved}/${cicdMissions.length} missão(ões) resolvida(s)` : "Sem evidência técnica ainda", nextAction: cicdSolved >= cicdMissions.length ? "Revisar decisões de entrega" : "Continuar um Lab da Trilha CI/CD", href: "/trilhas/cicd", available: true },
    { id: "security", name: "Segurança", score: Math.min(20, security * 10), evidence: security ? `${security} situação(ões) relacionada(s)` : "Sem evidência técnica ainda", nextAction: "Security Lab em construção", href: "/#produtos", available: false },
  ];
}
