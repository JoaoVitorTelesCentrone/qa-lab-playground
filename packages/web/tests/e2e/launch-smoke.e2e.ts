import { expect, test } from "@playwright/test";

test("@smoke apresenta o QA Lab e os caminhos de prática", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Aprenda QA no BrotoSpace.", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Começar a praticar", exact: true })).toHaveAttribute("href", "/comecar");
  await expect(page.getByRole("link", { name: "Abrir o BrotoSpace", exact: true })).toHaveAttribute("href", "https://www.brotospace.com/");

  await page.getByRole("link", { name: "Veja como funciona", exact: true }).click();
  await expect(page).toHaveURL(/#como-funciona$/);
  await expect(page.getByRole("heading", { name: "Uma ideia. Duas visitas.", exact: true })).toBeVisible();

  const routes = page.getByRole("navigation", { name: "Escolha por onde continuar." });
  await expect(routes.getByRole("link", { name: /^Labs/ })).toHaveAttribute("href", "/labs");
  await expect(routes.getByRole("link", { name: /^Trilhas/ })).toHaveAttribute("href", "/trilhas");
  await expect(routes.getByRole("link", { name: /^Conteúdo/ })).toHaveAttribute("href", "/conteudo");

  await routes.getByRole("link", { name: /^Labs/ }).click();
  await expect(page).toHaveURL(/\/labs\/?$/);
});

test("@smoke playground legado leva à página atual do Lab", async ({ page }) => {
  await page.goto("/playground");
  await expect(page).toHaveURL(/\/lab\/?$/);
  await expect(page.getByRole("heading", { name: /Qualidade se aprende fazendo perguntas melhores/i })).toBeVisible();
});

test("@smoke rota legada do desafio leva ao caso Broto", async ({ page }) => {
  await page.goto("/playground/expenseflow");
  await expect(page).toHaveURL(/\/conteudo\/broto\/?$/);
  await expect(page.getByRole("link", { name: "Abrir o Broto", exact: true })).toHaveAttribute("href", "https://www.brotospace.com/");
});

test("@smoke Labs liberados e rota antiga de Finanças levam ao Broto", async ({ page }) => {
  await page.goto("/labs/101");
  await expect(page.getByRole("heading", { name: "Investigar a captura e a retomada de um pensamento" })).toBeVisible();
  await page.getByRole("button", { name: "Etapa 3: Ambiente" }).click();
  await expect(page.getByRole("link", { name: /Abrir caso de treino/ })).toHaveAttribute("href", "/conteudo/broto");
  await page.goto("/financas");
  await expect(page).toHaveURL(/\/conteudo\/broto\/?$/);
});

test("@smoke anônimo não envia evidência à API do produto", async ({ request }) => {
  const response = await request.post("/api/v1/submissions", { data: { labSlug: "desafio-101", evidence: "Um relato suficientemente longo." } });
  expect(response.status()).toBe(401);
});
