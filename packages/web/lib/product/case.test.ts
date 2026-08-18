import { describe, expect, test } from "bun:test";
import { labs } from "@/lib/playground/catalog";
import { systemChallenges } from "@/lib/system-challenges";
import type { Submission } from "./journey";
import { buildCase, caseSkills, headline, linkedInPost, severityLabels } from "./case";

const lab = labs.find((item) => item.number === 101)!;
const challenge = systemChallenges.find((item) => item.number === 101)!;

function submission(overrides: Partial<Submission> = {}): Submission {
  return {
    id: "sub-1",
    labSlug: lab.slug,
    result: "O saldo do período exibe 5.502,80 enquanto a soma dos lançamentos listados dá 5.502,80 apenas se o recorrente for contado duas vezes.",
    reproduction: "1. Abrir /financas\n2. Filtrar por agosto\n3. Somar os lançamentos à mão\n4. Comparar com o card de saldo\n5. Repetir com o filtro limpo",
    severity: "alta",
    checklist: challenge.acceptance,
    published: false,
    createdAt: "2026-08-15T12:00:00.000Z",
    ...overrides,
  };
}

describe("case de QA", () => {
  test("junta evidência e briefing do Lab", () => {
    const item = buildCase(submission(), lab, challenge)!;
    expect(item.labNumber).toBe(101);
    expect(item.title).toBe(lab.title);
    expect(item.objective).toBe(challenge.objective);
    expect(item.expected).toBe(challenge.expected);
  });

  test("Lab fora do catálogo não vira case", () => {
    expect(buildCase(submission(), undefined, challenge)).toBeNull();
    expect(buildCase(submission(), lab, undefined)).toBeNull();
  });

  test("os passos saem numerados uma vez só", () => {
    const item = buildCase(submission(), lab, challenge)!;
    expect(item.steps[0]).toBe("Abrir /financas");
    expect(item.steps).toHaveLength(5);
  });

  test("a manchete é a primeira frase, truncada", () => {
    const item = buildCase(submission({ result: `${"a".repeat(300)}. Segunda frase.` }), lab, challenge)!;
    expect(headline(item).length).toBeLessThanOrEqual(180);
    expect(headline(item).endsWith("…")).toBe(true);
  });

  test("uma frase curta demais não vira manchete sozinha", () => {
    const item = buildCase(submission({ result: "Deu erro. O saldo do período veio 200 reais acima da soma dos lançamentos." }), lab, challenge)!;
    expect(headline(item)).toContain("saldo do período");
  });

  test("as competências só listam o que a entrega comprova", () => {
    const rico = caseSkills(buildCase(submission(), lab, challenge)!);
    expect(rico).toContain("Reprodutibilidade de defeito");
    expect(rico).toContain("Critérios de aceite");

    const magro = caseSkills(buildCase(submission({ reproduction: "1. Abrir a tela", checklist: [] }), lab, challenge)!);
    expect(magro).not.toContain("Reprodutibilidade de defeito");
    expect(magro).not.toContain("Critérios de aceite");
  });

  test("o post traz severidade, link e o corte dos passos que sobraram", () => {
    const item = buildCase(submission(), lab, challenge)!;
    const post = linkedInPost(item, { name: "Ana", url: "https://exemplo.test/case" });
    expect(post).toContain(severityLabels.alta.toLowerCase());
    expect(post).toContain("https://exemplo.test/case");
    expect(post).toContain("1. Abrir /financas");
    expect(post).toContain("+1 passo");
    expect(post).not.toContain("Repetir com o filtro limpo");
  });

  test("o post cabe no limite de caracteres do LinkedIn", () => {
    const item = buildCase(submission({ result: "x".repeat(3000), reproduction: Array.from({ length: 40 }, (_, index) => `passo ${index}`).join("\n") }), lab, challenge)!;
    expect(linkedInPost(item, { name: "Ana", url: "https://exemplo.test/case" }).length).toBeLessThan(3000);
  });
});
