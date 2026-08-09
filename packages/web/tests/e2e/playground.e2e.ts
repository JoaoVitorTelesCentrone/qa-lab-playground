import { expect, test } from "@playwright/test";

test("login valido e cenarios negativos", async ({ page }) => {
  await page.goto("/labs/login");
  await page.getByTestId("login-button").click();
  await expect(page.getByTestId("login-message")).toContainText("Usuario obrigatorio");
  await page.getByTestId("username").fill("locked_out_user");
  await page.getByTestId("password").fill("qa_lab_secret");
  await page.getByTestId("login-button").click();
  await expect(page.getByTestId("login-message")).toContainText("Usuario bloqueado");
  await page.getByTestId("username").fill("standard_user");
  await page.getByTestId("password").fill("qa_lab_secret");
  await page.getByTestId("login-button").click();
  await expect(page.getByTestId("login-message")).toContainText("Login realizado");
});

test("waits sem sleep fixo", async ({ page }) => {
  await page.goto("/labs/waits?delay=500");
  await expect(page.getByTestId("ajax-result")).toContainText("Dados persistidos");
  await expect(page.getByTestId("delayed-button")).toBeEnabled();
});

test("CRUD de API", async ({ request }) => {
  await request.post("/api/test/reset");
  const login = await request.post("/api/auth/login", { data: { username: "standard_user", password: "qa_lab_secret" } });
  const auth = await login.json();
  const created = await request.post("/api/bookings", {
    data: { firstname: "E2E", lastname: "Playwright", totalprice: 500, depositpaid: true, bookingdates: { checkin: "2026-12-10", checkout: "2026-12-12" }, additionalneeds: "" },
  });
  expect(created.status()).toBe(201);
  const booking = await created.json();
  const updated = await request.patch(`/api/bookings/${booking.data.id}`, {
    headers: { authorization: `Bearer ${auth.data.token}` },
    data: { additionalneeds: "Mesa silenciosa" },
  });
  expect(updated.status()).toBe(200);
  const deleted = await request.delete(`/api/bookings/${booking.data.id}`, { headers: { authorization: `Bearer ${auth.data.token}` } });
  expect(deleted.status()).toBe(204);
});

test("export do relatorio exploratorio", async ({ page }) => {
  await page.goto("/labs/exploratorio");
  await page.getByTestId("session-note").fill("Cupom aceito sem recalcular frete.");
  await page.getByRole("button", { name: "Adicionar" }).click();
  await page.getByTestId("bug-title").fill("Total nao recalculado");
  await expect(page.getByTestId("exploratory-report")).toContainText("Total nao recalculado");
});

test("checkout por teclado", async ({ page }) => {
  await page.goto("/shop/products");
  await page.getByTestId("add-product-1").focus();
  await page.keyboard.press("Enter");
  await page.goto("/shop/checkout");
  await page.getByTestId("checkout-first-name").fill("Teclado");
  await page.keyboard.press("Tab");
  await page.keyboard.type("QA");
  await page.keyboard.press("Tab");
  await page.keyboard.type("01001000");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("order-id")).toContainText("QL-");
});
