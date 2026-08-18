import { describe, expect, test } from "bun:test";
import { plantedBugs } from "./product/practice/bugs";
import { practiceApps } from "./product/apps";
import { findRegressionPack, regressionLayers, regressionPacks, scenariosForBug } from "./regression-packs";

describe("packs de regressão", () => {
  test("há um pack por ambiente de prática", () => {
    expect(regressionPacks.map((pack) => pack.id)).toEqual(practiceApps.map((app) => app.id));
  });

  // Finanças roda um recorte de 20 da mesma matriz de 35 — é o único ambiente
  // liberado no lançamento enxuto. Ver [[qa-lab-lancamento-enxuto]].
  test("cada pack tem os cenários da matriz — 35, exceto Finanças, que roda 20", () => {
    for (const pack of regressionPacks) expect(pack.scenarios).toHaveLength(pack.id === "financas" ? 20 : 35);
  });

  test("a matriz é a mesma nos ambientes de 35, na mesma ordem", () => {
    const fullPacks = regressionPacks.filter((pack) => pack.id !== "financas");
    const reference = fullPacks[0].scenarios.map((scenario) => `${scenario.number} ${scenario.title} ${scenario.layer}`);
    for (const pack of fullPacks) {
      expect(pack.scenarios.map((scenario) => `${scenario.number} ${scenario.title} ${scenario.layer}`)).toEqual(reference);
    }
  });

  test("o recorte de Finanças é um subconjunto da matriz de 35, na mesma ordem relativa", () => {
    const full = regressionPacks.find((pack) => pack.id === "qa-lab")!.scenarios.map((scenario) => `${scenario.title} ${scenario.layer}`);
    const financas = findRegressionPack("financas")!.scenarios.map((scenario) => `${scenario.title} ${scenario.layer}`);
    let cursor = -1;
    for (const scenario of financas) {
      const at = full.indexOf(scenario, cursor + 1);
      expect(at).toBeGreaterThan(cursor);
      cursor = at;
    }
  });

  test("os ids são únicos e prefixados pelo ambiente", () => {
    const ids = regressionPacks.flatMap((pack) => pack.scenarios.map((scenario) => scenario.id));
    expect(new Set(ids).size).toBe(ids.length);
    for (const pack of regressionPacks) {
      expect(pack.scenarios.every((scenario) => scenario.id.startsWith(`${pack.id}-`))).toBe(true);
    }
  });

  test("todo cenário tem pré-condição, três passos, oráculo e rota", () => {
    for (const pack of regressionPacks) {
      for (const scenario of pack.scenarios) {
        expect(scenario.precondition.length).toBeGreaterThan(10);
        expect(scenario.steps).toHaveLength(3);
        expect(scenario.expected.length).toBeGreaterThan(20);
        expect(scenario.route.startsWith("/")).toBe(true);
      }
    }
  });

  test("cenário sem âncora aponta para a raiz do ambiente", () => {
    const pack = findRegressionPack("financas")!;
    expect(pack.scenarios[0].route).toBe("/financas");
    expect(pack.scenarios[3].route).toBe("/financas#lancamentos");
  });

  test("todo bugId citado existe no catálogo de desvios", () => {
    const known = new Set(plantedBugs.map((bug) => bug.id));
    for (const pack of regressionPacks) {
      for (const scenario of pack.scenarios) {
        if (scenario.bugId) expect(known.has(scenario.bugId)).toBe(true);
      }
    }
  });

  test("todo desvio plantado é coberto por pelo menos um cenário", () => {
    for (const bug of plantedBugs) expect(scenariosForBug(bug.id).length).toBeGreaterThan(0);
  });

  test("o cenário do desvio pertence ao ambiente daquele desvio", () => {
    for (const bug of plantedBugs) {
      for (const { pack } of scenariosForBug(bug.id)) expect(pack.id).toBe(bug.appId);
    }
  });

  test("as camadas cobrem da interface à governança", () => {
    expect(regressionLayers).toEqual(["UI", "Fluxo", "Validação", "Dados", "Acessibilidade", "Responsividade", "Resiliência", "Segurança", "Performance", "Governança", "Regressão"]);
  });
});
