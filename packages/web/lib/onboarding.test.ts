import { describe, expect, test } from "bun:test";
import { onboardingSteps, parseTourState, supportsOnboarding, type TourState } from "./onboarding";

describe("guia flutuante", () => {
  test("usa o Lab fornecido e não inventa uma prática quando não há Lab liberado", () => {
    const steps = onboardingSteps({ number: 103, label: "02", title: "Orçamento" });
    expect(steps[2].route).toBe("/labs/103");
    expect(steps[3].labStep).toBe(2);
    expect(onboardingSteps(null).map((step) => step.route)).toEqual(["/", "/labs"]);
  });

  test("restaura a etapa e respeita guia fechado ou concluído", () => {
    for (const status of ["active", "dismissed", "completed"] as const) {
      const state: TourState = { version: 1, step: 3, status };
      expect(parseTourState(JSON.stringify({ ...state, redirect: "https://example.com" }), 5)).toEqual(state);
    }
  });

  test("descarta armazenamento corrompido, etapas inválidas e versões desconhecidas", () => {
    for (const raw of [null, "{", "null", "[]", '{"version":2,"step":0,"status":"active"}', '{"version":1,"step":-1,"status":"active"}', '{"version":1,"step":5,"status":"active"}', '{"version":1,"step":0.5,"status":"active"}', '{"version":1,"step":0,"status":"unknown"}']) expect(parseTourState(raw, 5)).toBeNull();
  });

  test("não exibe o guia em autenticação, checkout ou portfólios públicos", () => {
    for (const path of ["/login", "/cadastro", "/auth/callback", "/planos", "/mentoria/inscricao", "/portfolio/ana", "/labs-outro"]) expect(supportsOnboarding(path)).toBe(false);
    for (const path of ["/", "/labs", "/labs/101", "/perfil", "/conteudo", "/blog/artigo"]) expect(supportsOnboarding(path)).toBe(true);
  });
});
