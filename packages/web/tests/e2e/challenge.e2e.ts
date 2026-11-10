import { expect, test } from "@playwright/test";
import { challenge, isSolutionReleased } from "../../lib/authority/challenge";

test("@smoke /desafio mostra o desafio da semana com autor e link para o lab", async ({ page }) => {
  await page.goto("/desafio");
  await expect(page.getByRole("heading", { level: 1, name: challenge.title })).toBeVisible();
  await expect(page.getByTestId("author-byline")).toBeVisible();
  await expect(page.getByRole("link", { name: "Open the lab" })).toHaveAttribute("href", challenge.labHref);
});

test("@smoke a solução só existe depois da data configurada", async ({ page }) => {
  // O teste lê a mesma configuração do app: continua válido depois da liberação.
  const released = isSolutionReleased(challenge);
  await page.goto("/desafio");
  await expect(page.getByRole("link", { name: /See all .* bugs explained/ })).toHaveCount(released ? 1 : 0);
  const response = await page.goto("/desafio/solucao");
  expect(response?.status()).toBe(released ? 200 : 404);
  if (released) await expect(page.locator("ol > li")).toHaveCount(challenge.bugCount);
});

test("@smoke o modo bugado da API reproduz o bug 1 do gabarito", async ({ request }) => {
  const correct = await request.get("/api/users/999");
  expect(correct.status()).toBe(404);
  const buggy = await request.get("/api/users/999?scenario=bug");
  expect(buggy.status()).toBe(200);
});
