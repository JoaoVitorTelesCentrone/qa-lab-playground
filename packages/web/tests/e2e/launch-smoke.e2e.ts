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
});
