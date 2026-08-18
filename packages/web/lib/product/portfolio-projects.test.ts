import { describe, expect, test } from "bun:test";
import { labs } from "@/lib/playground/catalog";
import { systemChallenges } from "@/lib/system-challenges";
import { toEntries } from "./portfolio-format";
import { buildProjects, portfolioSkills, statsFor } from "./portfolio-projects";
import type { Submission } from "./journey";

const financas = labs.find((lab) => systemChallenges.find((item) => item.id === lab.slug)?.area === "Financas")!;
const investigacao = labs.find((lab) => systemChallenges.find((item) => item.id === lab.slug)?.mode === "investigacao" && systemChallenges.find((item) => item.id === lab.slug)?.area === "Financas")!;
const loja = labs.find((lab) => systemChallenges.find((item) => item.id === lab.slug)?.area === "Catalogo")!;

const submission = (over: Partial<Submission> = {}): Submission => ({
  id: "1",
  labSlug: financas.slug,
  result: "O saldo não atualiza. O valor anterior continua no topo depois de salvar.",
  reproduction: "1. Abrir o dashboard\n2. Criar um lançamento",
  severity: "media",
  checklist: ["Passos reproduziveis", "Impacto justificado"],
  published: true,
  createdAt: "2026-08-10T10:00:00Z",
  ...over,
});

describe("projetos do portfólio", () => {
  test("agrupa evidências por ambiente e nomeia a loja pelo domínio que ela simula", () => {
    const projects = buildProjects(toEntries([submission(), submission({ id: "2", labSlug: loja.slug })]));
    expect(projects.map((project) => project.id).sort()).toEqual(["financas", "qa-lab"]);
    expect(projects.find((project) => project.id === "qa-lab")?.name).toBe("E-commerce");
  });

  test("ordena pelo projeto com mais evidência", () => {
    const projects = buildProjects(toEntries([
      submission(),
      submission({ id: "2", labSlug: investigacao.slug }),
      submission({ id: "3", labSlug: loja.slug }),
    ]));
    expect(projects[0].id).toBe("financas");
    expect(projects[0].stats.evidences).toBe(2);
  });

  test("bug é evidência de Lab de investigação; critério é o que a pessoa confirmou", () => {
    const stats = statsFor(toEntries([submission(), submission({ id: "2", labSlug: investigacao.slug })]));
    expect(stats.evidences).toBe(2);
    expect(stats.bugs).toBe(1);
    expect(stats.criteria).toBe(4);
    expect(stats.labs).toBe(2);
  });

  test("competência só entra quando existe evidência dela", () => {
    expect(portfolioSkills([])).toEqual([]);
    const skills = portfolioSkills(toEntries([submission({ labSlug: investigacao.slug })]));
    expect(skills).toContain("Teste exploratório");
    expect(skills).not.toContain("Validação de fluxo ponta a ponta");
  });
});
