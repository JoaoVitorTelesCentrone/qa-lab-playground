import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import { labsEnabled } from "./helpers/features";

test.skip(!labsEnabled, "Labs desativados neste ambiente.");

test("@smoke /labs lista as 6 trilhas e filtra pela URL", async ({ page }) => {
  await page.goto("/labs");
  const tracks = page.getByRole("navigation", { name: "Tracks" });
  for (const name of ["UI", "API", "Exploratory", "Product", "CI", "Non-functional"]) {
    await expect(tracks.getByRole("button", { name: new RegExp(`^${name}\\s*\\d+$`) })).toBeVisible();
  }
  await tracks.getByRole("button", { name: /^API\s*\d+$/ }).click();
  await expect(page).toHaveURL(/[?&]trilha=api/);
  await expect(page.getByRole("link", { name: "Bookings REST API" })).toBeVisible();
  await expect(page.getByRole("link", { name: "A login that lies about locked accounts" })).toHaveCount(0);

  // A trilha também abre direto pela URL.
  await page.goto("/labs?trilha=ci");
  await expect(page.getByRole("navigation", { name: "Tracks" }).getByRole("button", { name: /^CI\s*\d+$/ })).toHaveAttribute("aria-pressed", "true");
});

async function loginAsLockedUser(page: import("@playwright/test").Page) {
  await page.getByTestId("username").fill("locked_out_user");
  await page.getByTestId("password").fill("qa_lab_secret");
  await page.getByTestId("login-button").click();
}

test("@smoke Lab com ?bug=1 mostra o comportamento bugado; sem ?bug mostra o correto", async ({ page }) => {
  await page.goto("/labs/login?bug=1");
  await expect(page.getByTestId("bug-mode")).toHaveAttribute("data-state", "on");
  await loginAsLockedUser(page);
  await expect(page.locator("#login-feedback")).toHaveText("Credenciais invalidas.");

  await page.goto("/labs/login");
  await expect(page.getByTestId("bug-mode")).toHaveAttribute("data-state", "off");
  await loginAsLockedUser(page);
  await expect(page.locator("#login-feedback")).toHaveText("Usuario bloqueado.");
});

test("@smoke a faixa alterna entre modo bugado e correto", async ({ page }) => {
  await page.goto("/labs/waits");
  await page.getByRole("link", { name: "Turn the bug on (?bug=1)" }).click();
  await expect(page).toHaveURL(/\/labs\/waits\?bug=1$/);
  await expect(page.getByTestId("bug-mode")).toHaveAttribute("data-bug", "infinite-loading");
  await page.getByRole("link", { name: "Switch to the correct mode" }).click();
  await expect(page).toHaveURL(/\/labs\/waits$/);
});

test("@smoke API CRUD repassa o modo bugado para a API", async ({ page }) => {
  await page.goto("/labs/api-crud?bug=1");
  // Sem token: no modo correto o DELETE é 401; no bugado (delete-without-auth) passa.
  await page.getByRole("button", { name: "DELETE" }).click();
  await expect(page.getByTestId("api-output")).toContainText("HTTP 204");
  await page.goto("/labs/api-crud");
  await page.getByRole("button", { name: "DELETE" }).click();
  await expect(page.getByTestId("api-output")).toContainText("HTTP 401");
});

test("@smoke Labs exportam relatório em Markdown", async ({ page }) => {
  await page.goto("/labs/login?bug=1");
  const [playground] = await Promise.all([page.waitForEvent("download"), page.getByTestId("download-report").click()]);
  expect(playground.suggestedFilename()).toMatch(/^bug-report-.*\.md$/);
  const playgroundText = await readFile((await playground.path())!, "utf8");
  expect(playgroundText).toContain("Mode: bug mode on (`locked-message`)");

  await page.goto("/labs/101");
  await page.getByRole("button", { name: /^Etapa 3: Entregar/ }).click();
  const [lab] = await Promise.all([page.waitForEvent("download"), page.getByTestId("download-report").click()]);
  expect(lab.suggestedFilename()).toMatch(/^lab-01-.*\.md$/);
  const labText = await readFile((await lab.path())!, "utf8");
  expect(labText).toMatch(/^# Lab 01: /);
  expect(labText).toContain("## What happened");
});
