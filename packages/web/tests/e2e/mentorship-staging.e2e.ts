import { expect, test } from "@playwright/test";

test.describe("mentoria: smoke publico e responsivo", () => {
  test("roadmap e 12 modulos exibem teoria, enunciado e Broto Space", async ({ page }) => {
    test.setTimeout(90_000);
    await page.goto("/mentoria/conteudo");
    await expect(page.getByRole("heading", { name: /Conteúdo de qualidade de software/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Teste um produto real: Broto Space/i })).toBeVisible();
    for (let week = 1; week <= 12; week++) {
      await page.goto(`/mentoria/conteudo/${week}`);
      await expect(page.getByText("Enunciado completo do lab")).toBeVisible();
      await expect(page.getByText("Projeto transversal · site real")).toBeVisible();
      await expect(page.getByRole("heading", { name: "Aulas desta semana" })).toBeVisible();
    }
  });

  test("landing apresenta conteudo principal em viewport mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/mentoria");
    await expect(page.getByRole("main").first()).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
  });

  test("area do aluno pede autenticacao", async ({ page }) => {
    await page.goto("/mentoria/app");
    await expect(page).toHaveURL(/entrar|login/i);
  });
});

const credentials = {
  student: [process.env.MENTORSHIP_E2E_STUDENT_EMAIL, process.env.MENTORSHIP_E2E_STUDENT_PASSWORD],
  mentor: [process.env.MENTORSHIP_E2E_MENTOR_EMAIL, process.env.MENTORSHIP_E2E_MENTOR_PASSWORD],
  admin: [process.env.MENTORSHIP_E2E_ADMIN_EMAIL, process.env.MENTORSHIP_E2E_ADMIN_PASSWORD],
} as const;

async function signIn(page: import("@playwright/test").Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel(/e-mail/i).fill(email);
  await page.getByLabel(/senha/i).fill(password);
  await page.getByRole("button", { name: /entrar/i }).click();
}

for (const role of ["student", "mentor", "admin"] as const) {
  test(`staging: fluxo inicial do perfil ${role}`, async ({ page }) => {
    const [email, password] = credentials[role];
    test.skip(!email || !password, `Configure MENTORSHIP_E2E_${role.toUpperCase()}_EMAIL/PASSWORD`);
    await signIn(page, email!, password!);
    const target = role === "student" ? "/mentoria/app" : role === "mentor" ? "/mentoria/mentor" : "/mentoria/admin";
    await page.goto(target);
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    if (role === "admin") await expect(page.getByRole("heading", { name: /sinais de acompanhamento por turma/i })).toBeVisible();
  });
}
