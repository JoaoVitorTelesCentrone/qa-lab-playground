import { expect, test } from "@playwright/test";

test("@smoke apresenta o QA Lab e os Labs disponíveis", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Aprenda QA na prática.", exact: true })).toBeVisible();
  const practiceSection = page.getByRole("region", { name: "Aprenda em um sistema real" });
  await expect(practiceSection).toBeVisible();
  await expect(practiceSection.getByRole("link", { name: "Explorar os Labs" })).toHaveAttribute("href", "/labs");
  await expect(page.getByRole("link", { name: /Ir para o Broto Space/i })).toHaveCount(0);
  await expect(page.locator("main").getByRole("link", { name: "Começar a praticar", exact: true })).toHaveAttribute("href", "/comecar");
  await page.locator("main").getByRole("link", { name: "Como funciona o QA Lab", exact: true }).click();
  await expect(page).toHaveURL(/\/lab\/?$/);
  await expect(page.getByRole("heading", { name: /Qualidade se aprende fazendo perguntas melhores/i })).toBeVisible();
  await page.getByRole("link", { name: /Conhecer os Labs/i }).click();
  await expect(page).toHaveURL(/\/labs\/?$/);
});

test("@smoke playground legado leva à página atual do Lab", async ({ page }) => {
  await page.goto("/playground");
  await expect(page).toHaveURL(/\/lab\/?$/);
  await expect(page.getByRole("heading", { name: /Qualidade se aprende fazendo perguntas melhores/i })).toBeVisible();
});

test("@smoke rotas antigas do ExpenseFlow levam ao caso BrotoSpace", async ({ page }) => {
  await page.goto("/playground/expenseflow");
  await expect(page).toHaveURL(/\/conteudo\/broto\/?$/);
  await expect(page.getByRole("link", { name: "Abrir o Broto", exact: true })).toHaveAttribute("href", "https://www.brotospace.com/");
});

test("@smoke anônimo não envia evidência à API do produto", async ({ request }) => {
  const response = await request.post("/api/v1/submissions", { data: { labSlug: "desafio-101", evidence: "Um relato suficientemente longo." } });
  expect(response.status()).toBe(401);
});
