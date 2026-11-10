import { expect, test } from "@playwright/test";

// Elementos de autoridade: quem construiu o QA Lab aparece em todo Lab e post.
test("@smoke Lab mostra a byline do autor e o botão de compartilhar", async ({ page }) => {
  await page.goto("/labs/101");
  const byline = page.getByTestId("author-byline");
  await expect(byline).toContainText("Built by");
  await expect(byline).toContainText("João Centrone");
  await expect(byline).toHaveAttribute("href", "/sobre");
  await expect(page.getByRole("link", { name: /Share on LinkedIn/ })).toHaveAttribute("href", /linkedin\.com\/sharing\/share-offsite\/\?url=.*%2Flabs%2F101/);
});

test("@smoke post do blog é assinado pelo autor", async ({ page }) => {
  await page.goto("/blog");
  const firstPost = page.locator('a[href^="/blog/"]').first();
  const href = await firstPost.getAttribute("href");
  await page.goto(href!);
  await expect(page.getByTestId("author-byline")).toContainText("João Centrone");
  await expect(page.getByRole("link", { name: /Share on LinkedIn/ })).toBeVisible();
});

test("@smoke /sobre tem título e os links do LinkedIn e do GitHub", async ({ page }) => {
  await page.goto("/sobre");
  await expect(page.getByRole("heading", { level: 1, name: "QA Automation Engineer" })).toBeVisible();
  // O footer tem outro link "LinkedIn" (página da empresa): olhar só os perfis do autor.
  const profiles = page.getByRole("navigation", { name: "Profiles" });
  await expect(profiles.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", "https://www.linkedin.com/in/joao-centrone");
  await expect(profiles.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", /^https:\/\/github\.com\//);
});
