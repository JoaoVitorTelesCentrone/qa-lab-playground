import { expect, test } from "@playwright/test";

test("@smoke cards, artigo e home mostram a data editorial", async ({ page }) => {
  await page.goto("/blog");
  const card = page.locator('.qa-editorial-story-card[href="/blog/qa-antes-de-executar-testes"]');
  await expect(card.locator(".qa-editorial-story-card-top")).toContainText("28 out 2026");

  await page.goto("/blog/qa-antes-de-executar-testes");
  await expect(page.locator('time[datetime="2026-10-28"]')).toContainText("28 de outubro de 2026");

  await page.goto("/");
  const latest = page.locator('a[href="/blog/qa-antes-de-executar-testes"]').first();
  await expect(latest).toContainText("O que um QA faz antes de executar testes");
  await expect(latest).toContainText("28 de outubro de 2026");
});
