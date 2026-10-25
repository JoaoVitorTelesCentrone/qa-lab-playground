import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

test("@smoke a primeira aula apresenta captura e retomada no BrotoSpace", async ({ page }) => {
  await page.goto("/conteudo/modulos/produto-risco/produto-jornada");
  const main = page.locator("main");
  await expect(main).toContainText("No BrotoSpace, salvar um pensamento");
  expect(await main.textContent()).not.toMatch(/despesa|reembolso|ExpenseFlow|R\$/i);
  await page.goto("/conteudo/broto");
  await expect(page.getByRole("link", { name: "Abrir o Broto", exact: true })).toHaveAttribute("href", "https://www.brotospace.com/");
});

test("@smoke o oráculo conta somente ações concluídas e exporta a evidência", async ({ page }) => {
  await page.goto("/mentoria/labs/oraculo");
  await page.getByRole("button", { name: "Executar teste superficial", exact: true }).click();
  await expect(page.getByText("PASS", { exact: true })).toHaveCount(2);
  const expected = page.getByLabel("Quantidade esperada de ações concluídas");
  await expected.fill("4");
  await page.getByRole("button", { name: "Executar nas duas versões", exact: true }).click();
  await page.getByLabel("Justificativa e limites").fill("Contei somente ações concluídas da tabela, sem consultar a implementação avaliada.");
  await expect(page.getByRole("button", { name: "Exportar evidência .md", exact: true })).toBeDisabled();
  await expected.fill("3");
  await page.getByRole("button", { name: "Executar nas duas versões", exact: true }).click();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exportar evidência .md", exact: true }).click();
  const path = await (await download).path();
  const report = await readFile(path!, "utf8");
  expect(report).toContain("3 ações concluídas");
  expect(report).toContain("reference: PASS");
  expect(report).toContain("defective: FAIL");
  expect(report).not.toMatch(/despesa|reembolso|R\$/i);
});

test("@smoke o exercício de requisitos preserva a resposta inicial e exporta regras do BrotoSpace", async ({ page }) => {
  await page.goto("/mentoria/labs/requisitos");
  await expect(page.locator("main")).toContainText("transformar um pensamento próprio");
  const initial = "A pessoa autora transforma o pensamento fictício em uma ação e consegue retomar o contexto.";
  await page.getByLabel("Perguntas e hipóteses", { exact: true }).fill("Como a autoria e a duplicação são verificadas neste cenário?");
  await page.getByLabel("Cenários e resultados esperados", { exact: true }).fill(initial);
  await page.getByRole("button", { name: "Preservar resposta e revelar critérios", exact: true }).click();
  await expect(page.locator("main")).toContainText("R3 — Neste exercício, cada pensamento origina no máximo uma ação.");
  const revised = "R2: um título com 101 caracteres é recusado; R3: repetir a transformação retoma a mesma ação.";
  await page.getByRole("textbox", { name: "Cenários ligados às regras", exact: true }).fill(revised);
  await page.getByRole("button", { name: "Comparar respostas", exact: true }).click();
  await page.getByLabel("Comparação e limites", { exact: true }).fill("Acrescentei limite de texto e repetição com base nas regras sintéticas; não afirmei ter executado o fluxo real.");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exportar relatório .md", exact: true }).click();
  const path = await (await download).path();
  const report = await readFile(path!, "utf8");
  expect(report).toContain(initial);
  expect(report).toContain(revised);
  expect(report).toContain("broto-thought-action-01");
  expect(report).not.toMatch(/despesa|reembolso|R\$/i);
});

test("@smoke o incidente de crescimento distingue ações pendentes e concluídas", async ({ page }) => {
  await page.goto("/mentoria/labs/incidente");
  await page.getByLabel("A contagem recebeu também uma ação pendente.", { exact: true }).check();
  await page.getByLabel("Evidência que sustenta ou enfraquece a hipótese").fill("O log action.query mostra três concluídas e uma pendente; a contagem usa quatro linhas.");
  await page.getByRole("button", { name: "Reproduzir incidente", exact: true }).click();
  await expect(page.getByText("3 ações", { exact: true })).toBeVisible();
  await expect(page.getByText("4 ações", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Executar pacote de regressão", exact: true }).click();
  await expect(page.getByRole("cell", { name: "PASS", exact: true })).toHaveCount(4);
  await expect(page.getByRole("cell", { name: "FAIL", exact: true })).toHaveCount(2);
  await page.getByLabel("Análise final").fill("O filtro deve excluir ações pendentes. A regressão cobre o incidente, outra proporção e o contracaso com todas concluídas.");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exportar cadeia de evidências .md", exact: true }).click();
  const path = await (await download).path();
  const report = await readFile(path!, "utf8");
  expect(report).toContain("broto-growth-incident-01");
  expect(report).toContain("| Incidente original | 3 | 4 | FAIL | 3 | PASS |");
  expect(report).not.toMatch(/despesa|reembolso|R\$/i);
});
