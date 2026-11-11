import { expect, test } from "@playwright/test";
import { labsEnabled } from "./helpers/features";

test.describe("lançamento sem Labs", () => {
  test.skip(labsEnabled, "Labs habilitados neste ambiente.");

  test("@smoke rotas de prática respondem 404", async ({ request }) => {
    for (const path of ["/labs", "/labs/101", "/labs/login", "/lab", "/lab/bdd", "/trilhas", "/desafio", "/conteudo", "/mentoria/labs/oraculo", "/mentoria/performance", "/boards", "/test-suite", "/api-playground"]) {
      expect((await request.get(path)).status(), path).toBe(404);
    }
  });

  test("@smoke home, blog e menu não anunciam Labs", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Quality engineering");
    await expect(page.getByRole("link", { name: "Read the blog" })).toHaveAttribute("href", "/blog");
    await expect(page.locator('a[href^="/labs"], a[href^="/lab"], a[href="/desafio"]')).toHaveCount(0);
    await page.goto("/blog");
    await expect(page.locator('a[href^="/labs"], a[href^="/lab"]')).toHaveCount(0);
    await page.goto("/ferramentas");
    await expect(page.locator('a[href^="/labs"], a[href^="/lab"]')).toHaveCount(0);
  });
});
