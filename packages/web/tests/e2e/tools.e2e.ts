import { expect, test } from "@playwright/test";
import { toolGuides } from "../../lib/tool-guides";
import { qaTools } from "../../lib/qa-tools";

test("@smoke o índice de ferramentas leva a todos os guias", async ({ page }) => {
  await page.goto("/ferramentas");
  const guides = page.locator("#guias");
  await expect(guides.getByRole("heading", { name: "Guias de estudo das ferramentas do mercado" })).toBeVisible();
  for (const guide of toolGuides) {
    await expect(guides.locator(`a[href="/ferramentas/${guide.slug}"]`)).toHaveCount(1);
  }
});

test("@smoke cada guia abre com documentação e vídeos", async ({ page }) => {
  for (const guide of toolGuides) {
    await page.goto(`/ferramentas/${guide.slug}`);
    await expect(page.getByRole("heading", { level: 1, name: guide.name })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Documentação" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Vídeos no YouTube" })).toBeVisible();
    // Todo link externo abre em outra aba sem expor a página de origem.
    for (const link of await page.locator("main a[target=_blank]").all()) {
      await expect(link).toHaveAttribute("rel", /noopener/);
    }
    if (guide.internalCourse) await expect(page.locator(`main a[href="${guide.internalCourse.href}"]`)).toBeVisible();
  }
});

test("@smoke guia inexistente é 404", async ({ page }) => {
  const response = await page.goto("/ferramentas/nao-existe");
  expect(response?.status()).toBe(404);
});

test("@smoke cada bancada abre no primeiro Lab", async ({ page }) => {
  for (const tool of qaTools) {
    await page.goto(`/lab/ferramentas/${tool.id}`);
    await expect(page.getByRole("heading", { level: 1, name: tool.title })).toBeVisible();
    await expect(page.getByRole("link", { name: "Registrar entrega do Lab" })).toHaveAttribute("href", /^\/labs\/\d+$/);
  }
});

test("a bancada de SQL encontra o pedido com total negativo", async ({ page }) => {
  await page.goto("/lab/ferramentas/sql?lab=401");
  await page.getByRole("button", { name: "Executar" }).click();
  await expect(page.getByRole("cell", { name: "QL-1046" })).toBeVisible();
  await expect(page.getByText("1 linha(s)")).toBeVisible();
});

test("o Lab 411 mostra o status e o total com tipo errado na mesma resposta", async ({ page }) => {
  await page.goto("/lab/ferramentas/contrato?lab=411");
  await page.getByRole("button", { name: "Validar contrato" }).click();
  await expect(page.getByText('Esperado: número 200 ou 422 · recebido: "200"')).toBeVisible();
  await expect(page.getByText("Esperado: number · recebido: string")).toBeVisible();
});
