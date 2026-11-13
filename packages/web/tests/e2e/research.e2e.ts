import { expect, test } from "@playwright/test";

test("@smoke biblioteca científica busca, filtra e carrega mais", async ({ page }) => {
  await page.goto("/pesquisa");
  await expect(page.getByRole("heading", { name: /Explore os \d+ trabalhos/ })).toBeVisible();

  const count = page.getByTestId("research-count");
  await expect(count).toContainText(/trabalhos/);

  const cards = page.locator("#trabalhos article");
  await expect(cards).toHaveCount(12);

  await page.getByLabel("Buscar na biblioteca").fill("defect prediction");
  await page.getByRole("button", { name: "Filtrar" }).click();
  await expect(page).toHaveURL(/\/pesquisa\?/);
  await expect(page).toHaveURL(/#trabalhos$/);
  await expect(count).toContainText(/trabalhos/);

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
