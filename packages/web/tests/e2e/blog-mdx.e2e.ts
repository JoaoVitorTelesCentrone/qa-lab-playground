import { expect, test } from "@playwright/test";

// "modo-bugado" é um rascunho: abre pelo link direto (noindex) e fica fora do índice.
const slug = "modo-bugado";

test("@smoke post MDX renderiza com data, tempo de leitura, tags e autor", async ({ page }) => {
  await page.goto(`/blog/${slug}`);
  await expect(page.getByRole("heading", { level: 1, name: /^Modo bugado/ })).toBeVisible();
  await expect(page.getByTestId("reading-time")).toContainText(/\d+ min de leitura/);
  await expect(page.locator("time[datetime='2026-11-09']")).toBeVisible();
  await expect(page.getByRole("list", { name: "Tags" })).toContainText("#bug-mode");
  await expect(page.getByTestId("author-byline")).toContainText("João Centrone");
  // Corpo em MDX: tabela (remark-gfm) e frontmatter fora do texto.
  await expect(page.locator(".qa-article-body table")).toBeVisible();
  await expect(page.locator(".qa-article-body")).not.toContainText("draft: true");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("@smoke post tem versão em inglês ligada à versão em português", async ({ page }) => {
  await page.goto(`/blog/${slug}`);
  await page.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(new RegExp(`/blog/${slug}/en$`));
  await expect(page.getByRole("heading", { level: 1, name: /^Bug mode/ })).toBeVisible();
  await expect(page.getByTestId("reading-time")).toContainText(/\d+ min read/);
  await expect(page.locator("main")).toHaveAttribute("lang", "en");
  await page.getByRole("link", { name: "Português" }).click();
  await expect(page).toHaveURL(new RegExp(`/blog/${slug}$`));
});

test("@smoke idioma principal tem uma URL só e idioma inexistente é 404", async ({ page }) => {
  await page.goto(`/blog/${slug}/pt`);
  await expect(page).toHaveURL(new RegExp(`/blog/${slug}$`));
  const missing = await page.goto(`/blog/${slug}/es`);
  expect(missing?.status()).toBe(404);
});

test("@smoke rascunho não aparece no índice do blog", async ({ page }) => {
  await page.goto("/blog");
  await expect(page.locator(`a[href="/blog/${slug}"]`)).toHaveCount(0);
});
