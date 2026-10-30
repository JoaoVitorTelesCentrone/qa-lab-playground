import { describe, expect, test } from "bun:test";
import { buildMetrics, type ActivityEvent, type Signup } from "./metrics";

const event = (name: string, userId: string, createdAt: string, props: Record<string, unknown> = {}): ActivityEvent => ({ name, userId, createdAt, props });

// Ana entra e começa um Lab no mesmo dia (ativada) e conclui no dia seguinte.
// Bruno entra num dia e só começa no outro (não ativado).
const events: ActivityEvent[] = [
  event("lab_started", "ana", "2026-08-10T10:00:00Z", { lab: "desafio-001" }),
  event("lab_completed", "ana", "2026-08-11T10:00:00Z", { lab: "desafio-001" }),
  event("lab_started", "ana", "2026-08-11T11:00:00Z", { lab: "desafio-002" }),
  event("case_published", "bruno", "2026-08-10T09:00:00Z"),
  event("lab_started", "bruno", "2026-08-12T09:00:00Z", { lab: "desafio-001" }),
  event("api_error", "bruno", "2026-08-12T09:05:00Z", { message: "Lab não encontrado." }),
];
const signups: Signup[] = [
  { userId: "ana", createdAt: "2026-08-10T08:00:00Z" },
  { userId: "bruno", createdAt: "2026-08-10T08:30:00Z" },
];

describe("métricas de produto", () => {
  const metrics = buildMetrics(events, signups);

  test("conta contas ativas, Labs iniciados e concluídos", () => {
    expect(metrics.activeUsers).toBe(2);
    expect(metrics.newUsers).toBe(2);
    expect(metrics.labsStarted).toBe(3);
    expect(metrics.labsCompleted).toBe(1);
  });

  test("taxa de conclusão é sobre os Labs iniciados", () => {
    expect(metrics.completionRate).toBe(33);
  });

  test("ativação exige iniciar um Lab no mesmo dia do cadastro", () => {
    expect(metrics.activatedUsers).toBe(1);
    expect(metrics.activationRate).toBe(50);
  });

  test("agrupa por dia em ordem cronológica", () => {
    expect(metrics.daily.map((item) => item.date)).toEqual(["2026-08-10", "2026-08-11", "2026-08-12"]);
    expect(metrics.daily[1]).toEqual({ date: "2026-08-11", events: 2, started: 1, completed: 1 });
  });

  test("ranqueia os Labs mais iniciados e conta as conclusões", () => {
    expect(metrics.topLabs[0]).toEqual({ lab: "desafio-001", started: 2, completed: 1 });
  });

  test("agrupa os erros por mensagem", () => {
    expect(metrics.errors).toBe(1);
    expect(metrics.topErrors[0]).toEqual({ message: "Lab não encontrado.", total: 1 });
    expect(metrics.casesPublished).toBe(1);
  });

  test("sem eventos, nenhuma métrica divide por zero", () => {
    expect(buildMetrics([])).toMatchObject({ activeUsers: 0, completionRate: 0, activationRate: 0, daily: [], topLabs: [] });
  });

  test("eventos repetidos não duplicam Labs nem elevam conclusão acima de 100%", () => {
    const duplicate = buildMetrics([
      event("lab_started", "ana", "2026-08-10T10:00:00Z", { lab: "desafio-001" }),
      event("lab_started", "ana", "2026-08-10T11:00:00Z", { lab: "desafio-001" }),
      event("lab_completed", "ana", "2026-08-10T12:00:00Z", { lab: "desafio-001" }),
      event("lab_completed", "ana", "2026-08-10T13:00:00Z", { lab: "desafio-001" }),
    ], signups);
    expect(duplicate).toMatchObject({ labsStarted: 1, labsCompleted: 1, completionRate: 100 });
    expect(duplicate.topLabs[0]).toEqual({ lab: "desafio-001", started: 1, completed: 1 });
  });

  test("primeiro evento tardio não faz uma conta antiga parecer ativada no cadastro", () => {
    const late = buildMetrics([event("lab_started", "ana", "2026-08-11T10:00:00Z", { lab: "desafio-001" })], signups);
    expect(late.activatedUsers).toBe(0);
  });

  test("evidência persistida do desafio conta uma vez na coorte de sete dias", () => {
    const cohort = [
      { userId: "ana", createdAt: "2026-08-10T08:00:00Z" },
      { userId: "bruno", createdAt: "2026-08-10T08:00:00Z" },
      { userId: "recente", createdAt: "2026-08-19T08:00:00Z" },
    ];
    const result = buildMetrics([
      event("lab_completed", "ana", "2026-08-11T08:00:00Z"),
      event("lab_completed", "ana", "2026-08-12T08:00:00Z"),
      event("lab_completed", "ana", "2026-08-13T08:00:00Z"),
      event("lab_completed", "bruno", "2026-08-13T08:00:00Z"),
      event("lab_completed", "recente", "2026-08-20T08:00:00Z"),
    ], cohort, new Date("2026-08-20T09:00:00Z"));
    expect(result.firstEvidenceWithin7Days).toEqual({ users: 2, eligibleUsers: 2, rate: 100 });
    expect(result.medianHoursToFirstEvidence).toBe(48);
  });

  test("coortes semanais e origens deduplicam usuários e só calculam taxas após D+7", () => {
    const cohort = [
      { userId: "ana", createdAt: "2026-08-10T08:00:00Z", acquisitionSource: "instagram" },
      { userId: "ana", createdAt: "2026-08-10T08:00:00Z", acquisitionSource: "instagram" },
      { userId: "bruno", createdAt: "2026-08-11T08:00:00Z", acquisitionSource: "instagram" },
      { userId: "sem-evidencia", createdAt: "2026-08-12T08:00:00Z", acquisitionSource: "instagram" },
      { userId: "recente", createdAt: "2026-08-19T08:00:00Z" },
    ];
    const result = buildMetrics([
      event("lab_started", "ana", "2026-08-10T09:00:00Z", { lab: "desafio-001" }),
      event("lab_completed", "ana", "2026-08-11T09:00:00Z", { lab: "desafio-001" }),
      event("lab_started", "bruno", "2026-08-12T09:00:00Z", { lab: "desafio-001" }),
      event("lab_completed", "bruno", "2026-08-13T09:00:00Z"),
      event("lab_started", "sem-evidencia", "2026-08-13T09:00:00Z", { lab: "desafio-001" }),
      event("lab_completed", "recente", "2026-08-20T09:00:00Z"),
    ], cohort, new Date("2026-08-20T10:00:00Z"));

    expect(result.weeklyCohorts).toContainEqual({ key: "2026-08-10", signups: 3, eligibleUsers: 3, startedUsers: 3, evidenceUsers: 2, abandonedUsers: 1, evidenceRate: 67 });
    expect(result.acquisitionSources).toContainEqual({ key: "instagram", signups: 3, eligibleUsers: 3, startedUsers: 3, evidenceUsers: 2, abandonedUsers: 1, evidenceRate: 67 });
    expect(result.acquisitionSources).toContainEqual({ key: "Direto / sem UTM", signups: 1, eligibleUsers: 0, startedUsers: 0, evidenceUsers: 0, abandonedUsers: 0, evidenceRate: null });
  });

  test("conta eventos de upload bem-sucedidos e com falha", () => {
    const result = buildMetrics([
      event("evidence_upload_succeeded", "ana", "2026-08-10T09:00:00Z", { lab: "desafio-001" }),
      event("evidence_upload_failed", "ana", "2026-08-10T09:01:00Z", { reason: "unsupported_type" }),
    ]);
    expect(result.uploads).toEqual({ successful: 1, failed: 1 });
  });

  test("conta a primeira revisão por aluno na janela de 30 dias", () => {
    const result = buildMetrics([], [], new Date("2026-08-20T10:00:00Z"), 0, [
      { studentId: "ana", reviewedAt: "2026-08-02T10:00:00Z" },
      { studentId: "ana", reviewedAt: "2026-08-12T10:00:00Z" },
      { studentId: "bruno", reviewedAt: "2026-07-01T10:00:00Z" },
      { studentId: "caio", reviewedAt: "2026-08-21T10:00:00Z" },
    ]);
    expect(result.mentorshipFunnel.firstReviewedSubmissions).toBe(1);
  });
});
