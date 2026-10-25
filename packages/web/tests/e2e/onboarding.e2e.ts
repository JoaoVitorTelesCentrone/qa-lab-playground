import { expect, test } from "@playwright/test";

const storageKey = "qa-lab:onboarding:floating:v1";

test("@smoke guia flutua sobre as páginas e acompanha a prática real", async ({ page }) => {
  await page.goto("/");
  await page.locator("main").getByRole("link", { name: "Começar a praticar", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  const guide = page.getByRole("dialog", { name: "Aprenda QA fazendo." });
  await expect(guide).toHaveAttribute("aria-modal", "false");
  expect(await guide.evaluate((element) => getComputedStyle(element).position)).toBe("fixed");
  await expect(page.locator('[data-onboarding="home-intro"]')).toHaveAttribute("data-onboarding-highlight", "true");
  await guide.getByRole("button", { name: "Explorar Labs", exact: true }).click();
  await expect(page).toHaveURL(/\/labs$/);
  await expect(page.locator('[data-onboarding="lab-101"]')).toHaveAttribute("data-onboarding-highlight", "true");
  await page.getByRole("dialog").getByRole("button", { name: "Abrir Lab 01", exact: true }).click();
  await expect(page).toHaveURL(/\/labs\/101$/);
  await expect(page.locator('[data-onboarding="lab-step-0"]')).toHaveAttribute("aria-current", "step");
  await page.getByRole("dialog").getByRole("button", { name: "Ver ambiente" }).click();
  await expect(page.locator('[data-onboarding="lab-step-2"]')).toHaveAttribute("aria-current", "step");
  await expect(page.locator('[data-onboarding="lab-panel"]').getByRole("link", { name: "Abrir ambiente do Lab" })).toBeVisible();
  await page.getByRole("dialog").getByRole("button", { name: "Ver entrega" }).click();
  await expect(page.locator('[data-onboarding="lab-step-3"]')).toHaveAttribute("aria-current", "step");
  await expect(page.getByRole("heading", { name: "Entrega de evidência", exact: true })).toBeVisible();
  await page.getByRole("dialog").getByRole("button", { name: "Concluir", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("[data-onboarding-highlight]")).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole("button", { name: "Abrir guia de primeiros passos" })).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("fecha com Escape, não reaparece e pode ser retomado sem trocar de página", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.reload();
  await page.waitForTimeout(1100);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "Abrir guia de primeiros passos" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("dialog").getByRole("button", { name: "Explorar Labs", exact: true }).click();
  await expect(page).toHaveURL(/\/labs$/);
  await page.getByRole("dialog").getByRole("button", { name: "Fechar orientação" }).click();
  await page.reload();
  await page.getByRole("button", { name: "Abrir guia de primeiros passos" }).click();
  await expect(page.getByRole("dialog").getByRole("status")).toHaveText("Etapa 2 de 5");
  await expect(page).toHaveURL(/\/labs$/);
  await page.getByRole("dialog").getByRole("button", { name: "Voltar", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("guia não bloqueia a página e links antigos abrem o painel flutuante", async ({ page }) => {
  await page.goto("/comecar");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page).toHaveURL(/\/$/);
  await page.getByRole("navigation", { name: "Navegação principal" }).getByRole("link", { name: "Trilhas", exact: true }).click();
  await expect(page).toHaveURL(/\/trilhas$/);
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("dialog").getByRole("button", { name: "Ver esta etapa" }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("funciona com armazenamento bloqueado e dados antigos inválidos", async ({ page }) => {
  await page.addInitScript((key) => {
    localStorage.setItem(key, '{"version":1,"step":99,"status":"active"}');
    Storage.prototype.setItem = () => { throw new Error("Storage disabled"); };
  }, storageKey);
  await page.goto("/");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog").getByRole("status").filter({ hasText: /não será lembrada/ })).toBeVisible();
  await page.getByRole("dialog").getByRole("button", { name: "Explorar Labs", exact: true }).click();
  await expect(page).toHaveURL(/\/labs$/);
  await page.getByRole("dialog").getByRole("button", { name: "Fechar orientação" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("painel cabe no celular, navega por teclado e permite pular", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 667 });
  await page.goto("/");
  await page.locator("main").getByRole("link", { name: "Começar a praticar", exact: true }).click();
  const guide = page.getByRole("dialog");
  await expect(guide.getByRole("heading")).toBeFocused();
  const box = await guide.boundingBox();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(390);
  expect(box!.y + box!.height).toBeLessThanOrEqual(667);
  await guide.getByRole("button", { name: "Pular", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(guide).toHaveCount(0);
  await expect(page.locator("main").getByRole("link", { name: "Começar a praticar", exact: true })).toBeFocused();
  await page.getByRole("button", { name: "Abrir guia de primeiros passos" }).click();
  await expect(guide).toBeVisible();
});

test("cadastro preserva a prática específica e o guia fica fora da autenticação", async ({ page }) => {
  await page.goto("/login?next=%2Flabs%2F103");
  await expect(page.getByRole("link", { name: "Criar conta", exact: true })).toHaveAttribute("href", "/cadastro?next=%2Flabs%2F103");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Abrir guia de primeiros passos" })).toHaveCount(0);
  await page.goto("/cadastro");
  await expect(page.locator("#main-content").getByRole("link", { name: "Entrar", exact: true })).toHaveAttribute("href", "/login?next=%2Fcomecar");
});
