import { expect, test } from "@playwright/test";
import { mentorshipEnabled } from "./helpers/features";

// Com FEATURE_MENTORSHIP desligada, a mentoria, os planos e o checkout somem da
// experiência pública: páginas e APIs respondem 404. Código e tabelas ficam.
test.describe("mentoria desligada", () => {
  test.skip(mentorshipEnabled, "Só vale com FEATURE_MENTORSHIP desligada.");

  for (const path of ["/mentoria", "/mentoria/inscricao", "/mentoria/app", "/planos", "/cursos", "/portfolio/qualquer/mentoria/abc"]) {
    test(`@smoke ${path} responde 404`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(404);
    });
  }

  test("@smoke APIs de mentoria e cobrança respondem 404", async ({ request }) => {
    for (const [method, path] of [
      ["post", "/api/v1/mentorship/applications"],
      ["post", "/api/v1/mentorship/checkout"],
      ["post", "/api/billing/mercado-pago/checkout"],
      ["get", "/api/cron/mentorship-emails"],
    ] as const) {
      const response = await request[method](path, method === "post" ? { data: {} } : undefined);
      expect(response.status(), path).toBe(404);
    }
  });

  test("@smoke bancadas de prática sob /mentoria continuam abertas", async ({ page }) => {
    for (const path of ["/mentoria/labs/oraculo", "/mentoria/performance"]) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(200);
    }
  });

  test("@smoke navegação não oferece mentoria nem planos", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.locator('a[href="/mentoria"]')).toHaveCount(0);
    await expect(page.locator('a[href="/planos"]')).toHaveCount(0);
  });
});
