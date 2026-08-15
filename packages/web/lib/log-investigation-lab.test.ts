import { describe, expect, test } from "bun:test";
import { buildLogInvestigationDraft, logIncidents, scoreLogInvestigation } from "./log-investigation-lab";

describe("Log Investigation Lab", () => {
  test("gera muitos incidentes com logs", () => {
    expect(logIncidents.length).toBeGreaterThanOrEqual(150);
    expect(logIncidents[0].logs.length).toBeGreaterThan(2);
  });

  test("pontua investigacao alinhada", () => {
    const incident = logIncidents[0];
    const result = scoreLogInvestigation(incident, { cause: incident.expectedCause, action: incident.expectedAction, hypothesis: "Hipotese suficientemente detalhada conectando erro observado, contexto da mudanca, impacto no fluxo e causa provavel.", evidence: "Evidencia suficientemente detalhada citando logs, metricas, relatos e correlacao temporal entre evento e falha.", nextChecks: "Validar ambiente, comparar versoes, reproduzir com request id e checar dependencia.", communication: "Comunicacao objetiva para produto e engenharia com impacto, recomendacao, risco e proximo update." });
    expect(result.ready).toBe(true);
  });

  test("gera rascunho de investigacao", () => {
    const incident = logIncidents[0];
    const draft = buildLogInvestigationDraft(incident, { cause: incident.expectedCause, action: incident.expectedAction, hypothesis: "Hipotese suficientemente detalhada conectando erro observado, contexto da mudanca, impacto no fluxo e causa provavel.", evidence: "Evidencia suficientemente detalhada citando logs, metricas, relatos e correlacao temporal entre evento e falha.", nextChecks: "Validar ambiente, comparar versoes, reproduzir com request id e checar dependencia.", communication: "Comunicacao objetiva para produto e engenharia com impacto, recomendacao, risco e proximo update." });
    expect(draft.content).toContain("## Logs usados");
  });
});