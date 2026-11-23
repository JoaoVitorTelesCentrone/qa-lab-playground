import { expect, test } from "@playwright/test";

test("@smoke biblioteca busca, filtra e carrega mais", async ({ page }) => {
  await page.goto("/biblioteca");
  await expect(page.getByRole("heading", { name: /Explore as \d+ referências/ })).toBeVisible();

  const count = page.getByTestId("library-count");
  await expect(count).toContainText(/referências no acervo/);

  const rows = page.locator("#acervo article");
  await expect(rows).toHaveCount(12);

  await page.locator("#library-kind").selectOption("livro");
  await page.getByRole("button", { name: "Filtrar" }).click();
  await expect(page).toHaveURL(/tipo=livro/);
  await expect(count).toContainText("em livros");
  await expect(rows.first().getByText("Livro", { exact: true })).toBeVisible();

  await page.getByRole("link", { name: "Limpar" }).click();
  await expect(count).toContainText("no acervo");

  // Busca em português acha o estudo em inglês sobre testes instáveis.
  await page.getByLabel("Buscar no acervo").fill("testes instáveis");
  await page.getByRole("button", { name: "Filtrar" }).click();
  await expect(page).toHaveURL(/#acervo$/);
  await expect(page.locator("#acervo").getByRole("link", { name: "An Empirical Analysis of Flaky Tests" })).toBeVisible();

  await page.getByRole("link", { name: "Limpar" }).click();
  const loadMore = page.getByRole("link", { name: /Carregar mais/ });
  await loadMore.click();
  await expect(page).toHaveURL(/visiveis=/);
  expect(await rows.count()).toBeGreaterThan(12);
});

test("@smoke referência tem resumo, citação e trilhas", async ({ page }) => {
  await page.goto("/biblioteca/empirical-analysis-of-flaky-tests");
  await expect(page.getByRole("heading", { level: 1, name: "An Empirical Analysis of Flaky Tests" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Ideias principais" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Automação que se sustenta" })).toBeVisible();

  await expect(page.locator("pre").first()).toContainText("LUO, Qingzhou et al.");
  await page.getByRole("tab", { name: "BibTeX" }).click();
  await expect(page.getByRole("tabpanel")).toContainText("@inproceedings{luo2014empirical,");
});

test("@smoke trilha lista as leituras em ordem e /pesquisa redireciona", async ({ page }) => {
  await page.goto("/biblioteca/trilhas/primeiros-passos");
  await expect(page.getByRole("heading", { level: 1, name: "Primeiros passos em QA" })).toBeVisible();
  await expect(page.locator("main ol > li")).toHaveCount(6);
  await page.getByRole("link", { name: /ISTQB Certified Tester/ }).click();
  await expect(page).toHaveURL(/\/biblioteca\/istqb-ctfl-v4$/);

  await page.goto("/pesquisa");
  await expect(page).toHaveURL(/\/biblioteca$/);
});
