import { test, expect } from "@playwright/test";

test.describe("Catálogo da loja", () => {
  test("encontra um produto pelo nome", async ({ page }) => {
    await page.goto("/shop/products");
    await page.getByRole("textbox", { name: "Buscar produto" }).fill("Kit Smoke Test");
    await expect(page.getByText("Kit Smoke Test")).toBeVisible();
  });

  test("explica quando a busca não encontra produtos", async ({ page }) => {
    await page.goto("/shop/products");
    await page.getByRole("textbox", { name: "Buscar produto" }).fill("produto inexistente");
    await expect(page.getByRole("status")).toContainText("Nenhum produto encontrado");
  });
});

test.describe("Carrinho", () => {
  test("adiciona um produto e exibe a quantidade", async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem("qa-lab-cart"));
    await page.goto("/shop/products");
    await page.getByTestId("add-product-1").click();
    await page.locator('a[href="/shop/cart"]').click();

    await expect(page.getByTestId("qty-1")).toHaveText("1");
    await expect(page.getByTestId("cart-subtotal")).toContainText("R$");
  });
});
