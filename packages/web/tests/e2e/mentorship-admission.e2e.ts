import { expect, test, type Page } from "@playwright/test";

async function signIn(page: Page, email: string, password: string) {
  await page.goto("/login?next=%2Fmentoria%2Finscricao");
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Senha").fill(password);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/mentoria\/inscricao/);
}

test("@smoke inscrição pública da mentoria funciona no celular", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/mentoria/inscricao");
  await expect(page.getByRole("heading", { level: 1, name: /Confira a turma e as condições/i })).toBeVisible();
  await expect(page.getByRole("main")).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});

test("@smoke visitante não cria solicitação nem checkout da mentoria", async ({ request }) => {
  const application = await request.post("/api/v1/mentorship/applications", {
    data: { cohortId: null, acceptedContact: true },
  });
  expect(application.status()).toBe(401);
  const checkout = await request.post("/api/v1/mentorship/checkout", {
    data: { offerId: "00000000-0000-0000-0000-000000000000", offerVersion: 1, acceptedTerms: true },
  });
  expect(checkout.status()).toBe(401);
});

test("staging: solicitação, confirmação administrativa e acesso ao diagnóstico", async ({ browser }) => {
  const studentEmail = process.env.MENTORSHIP_ADMISSION_E2E_STUDENT_EMAIL;
  const studentPassword = process.env.MENTORSHIP_ADMISSION_E2E_STUDENT_PASSWORD;
  const adminEmail = process.env.MENTORSHIP_E2E_ADMIN_EMAIL;
  const adminPassword = process.env.MENTORSHIP_E2E_ADMIN_PASSWORD;
  const cohortId = process.env.MENTORSHIP_ADMISSION_E2E_COHORT_ID;
  test.skip(process.env.MENTORSHIP_ADMISSION_E2E_ENABLED !== "true" || !studentEmail || !studentPassword || !adminEmail || !adminPassword || !cohortId,
    "Requer staging e aluno descartável ainda sem inscrição na turma.");

  const studentContext = await browser.newContext();
  const adminContext = await browser.newContext();
  try {
    const student = await studentContext.newPage();
    await signIn(student, studentEmail!, studentPassword!);
    const applicationResponse = await student.request.post("/api/v1/mentorship/applications", {
      data: { cohortId, acceptedContact: true },
    });
    expect(applicationResponse.status(), await applicationResponse.text()).toBe(201);
    const application = await applicationResponse.json() as { data?: { id?: string; status?: string } };
    expect(application.data?.status).toBe("requested");
    expect(application.data?.id).toBeTruthy();
    await student.reload();
    await expect(student.getByText("Interesse recebido")).toBeVisible();

    const admin = await adminContext.newPage();
    await signIn(admin, adminEmail!, adminPassword!);
    const unauthorized = await student.request.patch(`/api/v1/mentorship/admin/applications/${application.data!.id}`, {
      data: { decision: "confirmed", source: "scholarship", note: "Tentativa indevida", cohortId },
    });
    expect(unauthorized.status()).toBe(403);
    const confirmation = await admin.request.patch(`/api/v1/mentorship/admin/applications/${application.data!.id}`, {
      data: { decision: "confirmed", source: "scholarship", note: "Bolsa de teste em staging", cohortId },
    });
    expect(confirmation.status(), await confirmation.text()).toBe(200);
    await student.goto("/mentoria/diagnostico");
    await expect(student.getByRole("main")).toBeVisible();
    await expect(student.getByRole("heading", { level: 1 })).toBeVisible();
  } finally {
    await Promise.all([studentContext.close(), adminContext.close()]);
  }
});
