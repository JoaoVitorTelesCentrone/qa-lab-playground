import { expect, test } from "@playwright/test";

test("@smoke biblioteca científica busca, filtra e carrega mais", async ({ page }) => {
  await page.goto("/pesquisa");
  await expect(page.getByRole("heading", { name: /Explore os \d+ trabalhos/ })).toBeVisible();

  const count = page.getByTestId("research-count");
  await expect(count).toContainText(/trabalhos/);

  const cards = page.locator("#trabalhos article");
  await expect(cards).toHaveCount(12);

  await page.locator("#research-theme").selectOption("testes");
  await page.getByRole("button", { name: "Filtrar" }).click();
  await expect(page).toHaveURL(/tema=testes/);
  await expect(count).toContainText("13 trabalhos");

  await page.locator("#research-year").selectOption("2026");
  await page.getByRole("button", { name: "Filtrar" }).click();
  await expect(page).toHaveURL(/tema=testes.*ano=2026/);
  await expect(count).toContainText("de 2026");

  await page.getByRole("link", { name: "Limpar" }).click();
  await expect(count).toContainText("48 trabalhos selecionados");

  await page.getByLabel("Buscar na biblioteca").fill("predição de defeitos");
  await page.getByRole("button", { name: "Filtrar" }).click();
  await expect(page).toHaveURL(/\/pesquisa\?/);
  await expect(page).toHaveURL(/#trabalhos$/);
  await expect(count).toContainText("13 trabalhos");

  const filteredCount = await cards.count();
  expect(filteredCount).toBeGreaterThan(0);
  expect(filteredCount).toBeLessThanOrEqual(12);

  const loadMore = page.getByRole("link", { name: /Carregar mais/ });
  if (await loadMore.count()) {
    await loadMore.click();
    await expect(page).toHaveURL(/visiveis=/);
    await expect(page).toHaveURL(/#trabalhos$/);
    expect(await cards.count()).toBeGreaterThan(filteredCount);
  }
});
