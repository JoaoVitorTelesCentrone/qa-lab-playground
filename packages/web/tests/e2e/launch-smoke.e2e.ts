import { expect, test } from "@playwright/test";

test("@smoke robots permite descobrir as areas publicas de pratica", async ({ request }) => {
  const response = await request.get("/robots.txt");
  expect(response.ok()).toBe(true);
  const robots = await response.text();
  for (const path of ["/lab", "/labs", "/trilhas"]) {
    expect(robots).not.toContain(`Disallow: ${path}`);
  }
  expect(robots).toContain("Sitemap:");
});

test("@smoke home apresenta o autor, os CTAs e as seções de autoridade", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /Hands-on QA labs with real bugs, built by a QA Automation Engineer/i })).toBeVisible();
  await expect(page.getByTestId("author-byline").first()).toContainText("João Centrone");
  const main = page.locator("main");
  await expect(main.getByRole("link", { name: "Start a lab", exact: true })).toHaveAttribute("href", "/labs");
  await expect(main.getByRole("link", { name: "Weekly challenge", exact: true })).toHaveAttribute("href", "/desafio");
  for (const name of ["Pick a bug to hunt", "From the blog", "What I've built"]) {
    await expect(main.getByRole("heading", { level: 2, name })).toBeVisible();
  }
  await expect(main.getByRole("heading", { level: 2, name: /Find the \d+ bugs/ })).toBeVisible();

  await main.getByRole("link", { name: "Start a lab", exact: true }).click();
  await expect(page).toHaveURL(/\/labs\/?$/);
});

test("@smoke menu leva às páginas de autoridade, sem mentoria", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Navegação principal" }).first();
  for (const [name, href] of [["Labs", "/labs"], ["Weekly challenge", "/desafio"], ["Blog", "/blog"], ["About", "/sobre"]]) {
    await expect(nav.getByRole("link", { name, exact: true })).toHaveAttribute("href", href);
  }
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
