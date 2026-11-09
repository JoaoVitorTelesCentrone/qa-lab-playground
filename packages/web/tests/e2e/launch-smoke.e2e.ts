import { expect, test } from "@playwright/test";

test("@smoke apresenta o QA Lab e os caminhos de prática", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Aprenda QA na prática.", exact: true })).toBeVisible();
  const main = page.locator("main");
  await expect(main.getByRole("link", { name: "Começar a praticar", exact: true })).toHaveAttribute("href", "/comecar");
  await expect(main.getByRole("link", { name: "Ver os Labs", exact: true })).toHaveAttribute("href", "/labs");
  // A home não manda o visitante para fora do QA Lab.
  await expect(main.locator("a[target=_blank]")).toHaveCount(0);
  await expect(main.getByRole("link", { name: /^Abrir o Lab 01/ })).toHaveAttribute("href", "/labs/101");

  await page.getByRole("link", { name: "Veja como funciona", exact: true }).click();
  await expect(page).toHaveURL(/#como-funciona$/);
  await expect(page.getByRole("heading", { name: "Da missão à evidência.", exact: true })).toBeVisible();

  const routes = page.getByRole("navigation", { name: "Escolha por onde continuar." });
  await expect(routes.getByRole("link", { name: /^Labs/ })).toHaveAttribute("href", "/labs");
  await expect(routes.getByRole("link", { name: /^Caminho/ })).toHaveAttribute("href", "/conteudo");
  // Conteúdo e Trilhas não são mais entradas da home: os cursos ficam em "Aprofundar" dentro do Caminho.
  await expect(routes.getByRole("link", { name: /^Trilhas/ })).toHaveCount(0);

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
  // O caso de treino entra no próprio Lab: dados para copiar no Preparar e o Broto direto no Testar.
  await expect(page.getByRole("button", { name: /Copiar Pensamento para a Mente/ })).toBeVisible();
  await page.getByRole("button", { name: /^Etapa 2: Testar/ }).click();
  await expect(page.getByRole("link", { name: /Abrir o Broto/ })).toHaveAttribute("href", "https://www.brotospace.com/");
  await page.goto("/financas");
  await expect(page).toHaveURL(/\/conteudo\/broto\/?$/);
});

test("@smoke anônimo não envia evidência à API do produto", async ({ request }) => {
  const response = await request.post("/api/v1/submissions", { data: { labSlug: "desafio-101", evidence: "Um relato suficientemente longo." } });
  expect(response.status()).toBe(401);
});
