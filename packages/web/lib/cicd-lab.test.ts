import { describe, expect, test } from "bun:test";
import {
  buildModuleProgress,
  buildReliabilityReport,
  cicdMissions,
  cicdModules,
  cicdProgressPercent,
  firstUnsolvedMission,
  isCicdComplete,
  isChoiceCorrect,
  isDecisionBest,
  isOrderSolved,
  parseCicdProgress,
  scoreGate,
  validateYamlEdit,
  type CicdMission,
} from "./cicd-lab";

function byKind<K extends CicdMission["kind"]>(kind: K) {
  return cicdMissions.find((mission) => mission.kind === kind) as Extract<CicdMission, { kind: K }>;
}

describe("CI/CD Lab", () => {
  test("define dez módulos e missões com ids únicos e módulo válido", () => {
    expect(cicdModules.length).toBe(10);
    expect(new Set(cicdMissions.map((mission) => mission.id)).size).toBe(cicdMissions.length);
    const moduleIds = new Set(cicdModules.map((cicdModule) => cicdModule.id));
    expect(cicdMissions.every((mission) => moduleIds.has(mission.moduleId))).toBe(true);
  });

  test("todos os dez módulos têm ao menos uma missão", () => {
    for (const cicdModule of cicdModules) {
      expect(cicdMissions.some((mission) => mission.moduleId === cicdModule.id)).toBe(true);
    }
  });

  test("cobre os cinco tipos de missão", () => {
    const kinds = new Set(cicdMissions.map((mission) => mission.kind));
    expect(kinds).toEqual(new Set(["order", "diagnose", "gate", "decision", "yaml"]));
  });

  test("missões de escolha têm exatamente uma resposta correta", () => {
    for (const mission of cicdMissions) {
      if (mission.kind === "diagnose") {
        expect(mission.options.filter((option) => option.correct).length).toBe(1);
      }
      if (mission.kind === "decision") {
        expect(mission.options.filter((option) => option.verdict === "best").length).toBe(1);
      }
    }
  });

  test("o editor de YAML valida a correção real e rejeita o estado quebrado", () => {
    const mission = byKind("yaml");
    const broken = validateYamlEdit(mission, mission.yaml);
    expect(broken.solved).toBe(false);
    expect(broken.message).toBeTruthy();

    const fixed = validateYamlEdit(mission, mission.solution);
    expect(fixed.solved).toBe(true);
    expect(fixed.message).toBeNull();
    expect(fixed.passed).toBe(fixed.total);

    // checkout depois do setup-node não resolve: a ordem importa
    const wrongOrder = mission.yaml.replace("      - uses: actions/setup-node@v4", "      - uses: actions/setup-node@v4\n      - uses: actions/checkout@v4");
    expect(validateYamlEdit(mission, wrongOrder).solved).toBe(false);
  });

  test("valida a ordem correta do pipeline", () => {
    const mission = byKind("order");
    const correct = mission.steps.map((step) => step.id);
    expect(isOrderSolved(mission, correct)).toBe(true);
    expect(isOrderSolved(mission, [...correct].reverse())).toBe(false);
    expect(isOrderSolved(mission, correct.slice(1))).toBe(false);
  });

  test("valida escolha correta e decisão melhor", () => {
    const diagnose = byKind("diagnose");
    const right = diagnose.options.find((option) => option.correct)!.id;
    const wrong = diagnose.options.find((option) => !option.correct)!.id;
    expect(isChoiceCorrect(diagnose.options, right)).toBe(true);
    expect(isChoiceCorrect(diagnose.options, wrong)).toBe(false);
    expect(isChoiceCorrect(diagnose.options, null)).toBe(false);

    const decision = byKind("decision");
    const best = decision.options.find((option) => option.verdict === "best")!.id;
    const ok = decision.options.find((option) => option.verdict === "ok")?.id ?? null;
    expect(isDecisionBest(decision.options, best)).toBe(true);
    if (ok) expect(isDecisionBest(decision.options, ok)).toBe(false);
  });

  test("pontua quality gates por correspondência com o recomendado", () => {
    const mission = byKind("gate");
    const perfect = mission.options.filter((option) => option.recommended).map((option) => option.id);
    const result = scoreGate(mission.options, perfect);
    expect(result.solved).toBe(true);
    expect(result.matched).toBe(result.total);

    const noisy = scoreGate(mission.options, mission.options.map((option) => option.id));
    expect(noisy.solved).toBe(false);
  });

  test("calcula progresso e ignora ids inválidos", () => {
    expect(parseCicdProgress("inválido")).toEqual([]);
    expect(cicdProgressPercent([])).toBe(0);
    expect(cicdProgressPercent(cicdMissions.map((mission) => mission.id))).toBe(100);
    expect(cicdProgressPercent(["fantasma", cicdMissions[0].id])).toBe(Math.round((1 / cicdMissions.length) * 100));
  });

  test("agrega progresso por módulo e aponta a próxima missão", () => {
    const progress = buildModuleProgress([]);
    expect(progress.length).toBe(10);
    expect(progress.every((module) => module.total > 0)).toBe(true);
    expect(progress.every((module) => !module.complete && !module.started)).toBe(true);
    expect(firstUnsolvedMission([])?.id).toBe(cicdMissions[0].id);

    const allIds = cicdMissions.map((mission) => mission.id);
    expect(buildModuleProgress(allIds).every((module) => module.complete)).toBe(true);
    expect(firstUnsolvedMission(allIds)).toBeNull();
    expect(isCicdComplete(allIds)).toBe(true);
    expect(isCicdComplete([])).toBe(false);
  });

  test("gera relatório de confiabilidade só com o que foi resolvido", () => {
    const date = new Date("2026-06-26T12:00:00");
    const report = buildReliabilityReport([cicdMissions[0].id], date);
    expect(report).toContain("Relatório de Confiabilidade");
    expect(report).toContain(`1/${cicdMissions.length}`);
    expect(report).toContain(cicdMissions[0].title);
    expect(report).not.toContain(cicdMissions[1].title);
  });
});
