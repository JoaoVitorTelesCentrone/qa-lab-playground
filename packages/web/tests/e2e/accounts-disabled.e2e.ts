import { expect, test } from "@playwright/test";
import { accountsEnabled, labsEnabled } from "./helpers/features";

test.describe("lançamento sem contas", () => {
  test.skip(accountsEnabled, "Contas habilitadas neste ambiente.");

  test("@smoke páginas de conta respondem 404", async ({ request }) => {
    for (const path of ["/login", "/cadastro", "/recuperar", "/perfil", "/auth/callback"]) {
      expect((await request.get(path)).status(), path).toBe(404);
    }
    expect((await request.get("/labs/login")).status()).toBe(labsEnabled ? 200 : 404);
  });

  test("@smoke navegação e Lab público não oferecem login", async ({ page }) => {
    test.skip(!labsEnabled, "Labs desativados neste ambiente.");
    await page.goto("/");
    await expect(page.locator('a[href^="/login"], a[href^="/cadastro"]')).toHaveCount(0);
    await page.goto("/labs/101?etapa=entregar");
    await expect(page.locator('a[href^="/login"], a[href^="/cadastro"]')).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Entregar evidência" })).toHaveCount(0);
    await expect(page.getByTestId("download-report")).toBeVisible();
    await page.goto("/lab/studio");
    await expect(page.getByRole("heading", { name: "Studio indisponível nesta versão" })).toBeVisible();
  });
});
