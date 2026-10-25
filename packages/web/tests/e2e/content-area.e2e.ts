import { expect, test } from "@playwright/test";

test("@smoke conteúdo leva do mapa ao capítulo e ao caso do Broto", async ({ page }) => {
  await page.goto("/conteudo");
  await expect(page.getByRole("heading", { name: "Aprenda QA fazendo." })).toBeVisible();
  await expect(page.getByRole("list", { name: "Como se aprende QA no conteúdo" }).getByRole("listitem")).toHaveCount(4);
  await page.getByRole("link", { name: /Abrir módulo 1: Produto, risco e exploração/ }).click();
  await expect(page).toHaveURL(/\/conteudo\/modulos\/produto-risco\/?$/);
  await page.getByRole("link", { name: /Abrir capítulo 1: Produto, atores e jornada/ }).click();
  await expect(page.getByRole("heading", { name: "Produto, atores e jornada", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Entenda" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Faça" })).toBeVisible();
  await page.goto("/conteudo/broto");
  await expect(page.getByRole("link", { name: "Abrir o Broto" })).toHaveAttribute("href", "https://www.brotospace.com/");
  await expect(page.getByRole("button", { name: /Copiar Textos fictícios do caso/ })).toBeVisible();
});

test("@smoke conteúdo permanece navegável no celular", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ["/conteudo", "/conteudo/modulos/produto-risco", "/conteudo/modulos/produto-risco/produto-jornada", "/conteudo/broto", "/conteudo/temas/fundamentos-produto-risco", "/conteudo/1/teoria-1"]) {
    await page.goto(path);
    await expect(page.locator("main")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `${path} transborda horizontalmente`).toBeLessThanOrEqual(1);
    await page.screenshot({ path: testInfo.outputPath(`${path.replaceAll("/", "-") || "home"}-mobile.png`), fullPage: true });
  }
});

test("@smoke conteúdo organiza o percurso no desktop", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const path of ["/conteudo", "/conteudo/modulos/produto-risco", "/conteudo/modulos/produto-risco/produto-jornada", "/conteudo/broto", "/conteudo/temas/fundamentos-produto-risco", "/conteudo/1/teoria-1"]) {
    await page.goto(path);
    await expect(page.locator("main")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `${path} transborda horizontalmente`).toBeLessThanOrEqual(1);
    await page.screenshot({ path: testInfo.outputPath(`${path.replaceAll("/", "-")}-desktop.png`), fullPage: true });
  }
});
