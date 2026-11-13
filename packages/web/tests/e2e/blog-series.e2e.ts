import { expect, test } from "@playwright/test";

test("@smoke trilogias públicas aparecem completas no índice", async ({ page }) => {
  await page.goto("/blog");
  for (const slug of [
    "da-regra-ao-caso-de-teste",
    "primeiro-plano-de-testes-enxuto",
    "investigando-bugs-intermitentes",
    "evidencia-util-em-bug-report",
  ]) {
    await expect(page.locator(`a[href="/blog/${slug}"]`)).toHaveCount(1);
  }

  await expect(page.locator('section[aria-labelledby="qa-do-zero-title"] .qa-editorial-story-card')).toHaveCount(3);
  await expect(page.locator('section[aria-labelledby="bug-report-title"] .qa-editorial-story-card')).toHaveCount(3);
});

test("@smoke artigo mostra a posição na trilogia e o próximo capítulo", async ({ page }) => {
  await page.goto("/blog/qa-antes-de-executar-testes");
  const breadcrumb = page.locator(".qa-editorial-breadcrumb");
  await expect(breadcrumb).toContainText("QA do Zero");
  await expect(breadcrumb).toContainText("Parte 1 de 3");

  const next = page.locator('nav[aria-label="Continue a leitura"] a[href="/blog/da-regra-ao-caso-de-teste"]');
  await expect(next).toContainText("Próximo artigo");
  await expect(next).toContainText("Parte 2");
});

test("@smoke listas numeradas do artigo mostram os marcadores", async ({ page }) => {
  await page.goto("/blog/qa-antes-de-executar-testes");
  const list = page.locator(".qa-editorial-reading-main .qa-article-body ol").first();
  await expect(list).toBeVisible();
  await expect(list.locator("li")).toHaveCount(3);
  await expect(list).toHaveCSS("list-style-type", "decimal");
});
