import { expect, test } from "@playwright/test";

test("@smoke visita a jornada pública do ExpenseFlow", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Aprenda QA investigando um sistema real/i })).toBeVisible();
  await page.getByRole("link", { name: /Começar o Lab/i }).first().click();
  await expect(page).toHaveURL(/\/playground\/?$/);
  await expect(page.getByRole("heading", { name: /ExpenseFlow Free Challenge/i })).toBeVisible();
  await page.getByRole("link", { name: /Abrir sistema/i }).click();
  await expect(page).toHaveURL(/\/playground\/expenseflow\/?$/);
  await expect(page.getByRole("navigation", { name: /Navegação do ExpenseFlow/i })).toBeVisible();
  await page.goto("/playground/entregas");
  await expect(page.getByRole("heading", { name: /Evidência.*antes de opinião/i })).toBeVisible();
  await page.goto("/playground/conclusao");
  await expect(page.getByRole("heading", { name: /Finalize sua entrega/i })).toBeVisible();
});

test("@smoke anônimo não envia evidência à API do produto", async ({ request }) => {
  const response = await request.post("/api/v1/submissions", { data: { labSlug: "desafio-101", evidence: "Um relato suficientemente longo." } });
  expect(response.status()).toBe(401);
});

test("@smoke rascunho do desafio permanece local e conta exige login", async ({ page, request }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/playground/entregas");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await expect(page.getByRole("link", { name: "Criar conta e guardar entrega" })).toBeVisible();
  await page.getByRole("textbox", { name: "Título do problema" }).fill("Total errado");
  await page.getByRole("textbox", { name: "Como reproduzir" }).fill("Adicionar despesa e abrir resumo");
  await page.getByRole("textbox", { name: "O que aconteceu" }).fill("O valor não mudou");
  await page.getByRole("textbox", { name: "O que deveria acontecer" }).fill("O resumo deve atualizar");
  await page.getByRole("textbox", { name: "Evidência" }).fill("Print da tela");
  await page.getByRole("button", { name: "Registrar bug report" }).focus();
  await page.keyboard.press("Enter");
  await page.goto("/playground/conclusao");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await expect(page.getByText("1/5")).toBeVisible();
  await expect(page.getByRole("link", { name: "Criar conta e guardar entrega" })).toBeVisible();
  const response = await request.post("/api/v1/challenge", { data: { deliverables: { bugs: [], bdd: [], e2e: [] } } });
  expect(response.status()).toBe(401);
  const publish = await request.post("/api/v1/challenge/case", { data: { title: "Case", summary: "Resumo", sourceId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" } });
  expect(publish.status()).toBe(401);
});

test("@smoke aluno revisa, publica e despublica o case", async ({ page }, testInfo) => {
  const draft = {
    bugs: Array.from({ length: 5 }, (_, index) => ({ id: `bug-${index}`, title: `Falha ${index + 1}`, steps: "Abrir resumo", actual: "Total incorreto", expected: "Total correto", severity: "Alta", evidence: "Print da tela" })),
    bdd: [{ id: "bdd-1", feature: "Despesas", title: "Total atualizado", given: "há despesa", when: "excluo", then: "o total muda" }],
    e2e: [{ id: "e2e-1", flow: "Exclusão", priority: "Alta", decision: "Manter manual", reason: "Exige inspeção visual", assertions: "Total correto" }],
    release: { decision: "Bloquear", rationale: "O fluxo crítico apresentou um total incorreto após a exclusão e não há evidência suficiente para liberar esta versão com segurança.", residualRisk: "Total incorreto", monitoring: "Rerodar testes após a correção", gates: { Lint: "passed", "Testes unitários": "passed", "Integração/API": "passed", "E2E crítico": "passed", Acessibilidade: "passed" } },
  };
  await page.addInitScript((value) => localStorage.setItem("qa-lab-expenseflow-deliverables-v1", JSON.stringify(value)), draft);
  await page.route("**/api/v1/challenge", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: { id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", savedAt: "2026-10-19T12:00:00Z", deliverables: draft } }) }));
  await page.route("**/api/v1/challenge/case", (route) => {
    if (route.request().method() === "GET") return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: { profile: { username: "", portfolioPublic: false }, case: null } }) });
    if (route.request().method() === "POST") return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: { published: true, url: "/portfolio/aluna-qa/expenseflow" } }) });
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: { published: false } }) });
  });
  await page.goto("/playground/conclusao");
  await expect(page.getByRole("heading", { name: "Transforme a entrega em case" })).toBeVisible();
  await expect(page.getByText("Falha 1")).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("case-preview-desktop.png"), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("case-preview-mobile.png"), fullPage: true });
  await page.getByRole("textbox", { name: "Endereço público do portfólio" }).fill("aluna-qa");
  await page.getByRole("checkbox", { name: /Revisei título, resumo e evidências/ }).check();
  await page.getByRole("button", { name: "Publicar case" }).click();
  await expect(page.getByRole("link", { name: "Abrir case" })).toHaveAttribute("href", "/portfolio/aluna-qa/expenseflow");
  await page.getByRole("button", { name: "Despublicar" }).click();
  await expect(page.getByText("Case retirado do portfólio público.", { exact: false })).toBeVisible();
});
