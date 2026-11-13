import { expect, test } from "@playwright/test";
import { labsEnabled } from "./helpers/features";

// Elementos de autoridade: quem construiu o QA Lab aparece em todo Lab e post.
test("@smoke Lab mostra a byline do autor e o botão de compartilhar", async ({ page }) => {
  test.skip(!labsEnabled, "Labs desativados neste ambiente.");
  await page.goto("/labs/101");
  const byline = page.getByTestId("author-byline");
  await expect(byline).toContainText("Feito por");
  await expect(byline).toContainText("João Centrone");
  await expect(byline).toHaveAttribute("href", "/sobre");
  await expect(page.getByRole("link", { name: /Compartilhar no LinkedIn/ })).toHaveAttribute("href", /linkedin\.com\/sharing\/share-offsite\/\?url=.*%2Flabs%2F101/);
});

test("@smoke post do blog é assinado pelo autor", async ({ page }) => {
  await page.goto("/blog");
  const firstPost = page.locator('a[href^="/blog/"]').first();
  const href = await firstPost.getAttribute("href");
  await page.goto(href!);
  await expect(page.getByTestId("author-byline")).toContainText("João Centrone");
  await expect(page.getByRole("link", { name: /Compartilhar no LinkedIn/ })).toBeVisible();
});

test("@smoke /sobre tem trajetória, stack, projetos e os links do autor", async ({ page }) => {
  await page.goto("/sobre");
  await expect(page.getByRole("heading", { level: 1, name: "Engenheiro de Automação de QA" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Do playground à biblioteca" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Com o que eu trabalho" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "O que eu construí" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 3, name: "QA Lab Playground" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Vamos conversar" })).toBeVisible();
  // O footer tem outro link "LinkedIn" (página da empresa): olhar só os perfis do autor.
  const profiles = page.getByRole("navigation", { name: "Perfis" });
  await expect(profiles.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", "https://www.linkedin.com/in/joao-centrone");
  await expect(profiles.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", /^https:\/\/github\.com\//);
  const jsonLd = await page.locator('script[type="application/ld+json"]').evaluate((element) => element.textContent);
  expect(jsonLd).toContain('"@type":"ProfilePage"');
});
