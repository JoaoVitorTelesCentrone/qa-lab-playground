import { describe, expect, test } from "bun:test";
import { buildMetrics, type ActivityEvent } from "./metrics";

const event = (name: string, userId: string, createdAt: string, props: Record<string, unknown> = {}): ActivityEvent => ({ name, userId, createdAt, props });

// Ana entra e começa um Lab no mesmo dia (ativada) e conclui no dia seguinte.
// Bruno entra num dia e só começa no outro (não ativado).
const events: ActivityEvent[] = [
  event("lab_started", "ana", "2026-08-10T10:00:00Z", { lab: "desafio-001" }),
  event("lab_completed", "ana", "2026-08-11T10:00:00Z", { lab: "desafio-001" }),
  event("lab_started", "ana", "2026-08-11T11:00:00Z", { lab: "desafio-002" }),
  event("evidence_published", "bruno", "2026-08-10T09:00:00Z"),
  event("lab_started", "bruno", "2026-08-12T09:00:00Z", { lab: "desafio-001" }),
  event("api_error", "bruno", "2026-08-12T09:05:00Z", { message: "Lab não encontrado." }),
];

describe("métricas de produto", () => {
  const metrics = buildMetrics(events);

  test("conta contas ativas, Labs iniciados e concluídos", () => {
    expect(metrics.activeUsers).toBe(2);
    expect(metrics.labsStarted).toBe(3);
    expect(metrics.labsCompleted).toBe(1);
  });

  test("taxa de conclusão é sobre os Labs iniciados", () => {
    expect(metrics.completionRate).toBe(33);
  });

  test("ativação exige iniciar um Lab no mesmo dia do primeiro evento", () => {
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
  });

  test("sem eventos, nenhuma métrica divide por zero", () => {
    expect(buildMetrics([])).toMatchObject({ activeUsers: 0, completionRate: 0, activationRate: 0, daily: [], topLabs: [] });
  });
});
