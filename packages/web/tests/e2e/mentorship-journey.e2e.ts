import { expect, test, type Page } from "@playwright/test";

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

async function signIn(page: Page, email: string, password: string, next = "/mentoria/app") {
  await page.goto(`/login?next=${encodeURIComponent(next)}`);
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Senha").fill(password);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(new RegExp(next.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
}

function apiUrl(path: string) {
  return new URL(path, baseUrl).toString();
}

test("cron da mentoria rejeita chamadas sem segredo", async ({ request }) => {
  const response = await request.get(apiUrl("/api/cron/mentorship-emails"));
  expect([401, 503]).toContain(response.status());
});

test("checkout Pro abre uma preferência de pagamento no Mercado Pago", async ({ browser }) => {
  const email = process.env.QA_E2E_CHECKOUT_EMAIL;
  const password = process.env.QA_E2E_CHECKOUT_PASSWORD;
  const sandboxToken = process.env.MERCADO_PAGO_ACCESS_TOKEN?.startsWith("TEST-") === true;
  test.skip(process.env.QA_E2E_CHECKOUT_ENABLED !== "true" || !email || !password || !sandboxToken,
    "Use uma conta descartável, access token TEST- do Mercado Pago e habilite QA_E2E_CHECKOUT_ENABLED.");

  const context = await browser.newContext();
  try {
    test.setTimeout(60_000);
    const page = await context.newPage();
    await signIn(page, email!, password!, "/planos");
    await expect(page.getByRole("button", { name: "Quero acesso Pro" })).toBeVisible();
    const checkoutResponse = page.waitForResponse((response) => response.url().includes("/api/billing/mercado-pago/checkout") && response.request().method() === "POST");
    await page.getByRole("button", { name: "Quero acesso Pro" }).click();
    const response = await checkoutResponse;
    expect(response.status()).toBe(200);
    const payload = await response.json() as { checkoutUrl?: string };
    expect(payload.checkoutUrl).toBeTruthy();
    const checkout = new URL(payload.checkoutUrl!);
    expect(checkout.hostname).toMatch(/(^|\.)mercadopago\.com(\.br)?$/);
    await expect(page).toHaveURL(payload.checkoutUrl!);
  } finally {
    await context.close();
  }
});
