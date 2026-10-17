import { expect, test, type Page } from "@playwright/test";

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
const mutationsEnabled = process.env.MENTORSHIP_E2E_MUTATIONS_ENABLED === "true";
const adminEmail = process.env.MENTORSHIP_E2E_ADMIN_EMAIL;
const adminPassword = process.env.MENTORSHIP_E2E_ADMIN_PASSWORD;
const studentEmail = process.env.MENTORSHIP_E2E_STUDENT_EMAIL;
const studentPassword = process.env.MENTORSHIP_E2E_STUDENT_PASSWORD;
const studentId = process.env.MENTORSHIP_E2E_STUDENT_ID;
const mentorEmail = process.env.MENTORSHIP_E2E_MENTOR_EMAIL;
const mentorPassword = process.env.MENTORSHIP_E2E_MENTOR_PASSWORD;
const cohortId = process.env.MENTORSHIP_E2E_COHORT_ID;
const weekNumber = Number(process.env.MENTORSHIP_E2E_WEEK ?? "1");
const assignmentKey = `mentoria.w${String(weekNumber).padStart(2, "0")}.assignment`;

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

async function reviewSubmission(page: Page, decision: "Pedir ajustes" | "Aprovar entrega") {
  const criteria = page.locator("form fieldset");
  await expect(criteria).not.toHaveCount(0);
  for (const fieldset of await criteria.all()) await fieldset.getByRole("radio").nth(2).check();
  await page.getByLabel("Decisao").selectOption(decision === "Aprovar entrega" ? "approved" : "changes_requested");
  await page.getByLabel("Pontos fortes").fill("A evidência conecta o cenário aos riscos prioritários.");
  await page.getByLabel("O que melhorar").fill("Explique também o comportamento observado nos casos de borda.");
  await page.getByLabel("Proxima acao").fill("Atualize a evidência e envie uma nova tentativa para revisão.");
  await page.getByRole("button", { name: "Salvar revisão" }).click();
  await expect(page.getByRole("status")).toContainText("O aluno já pode acompanhar o feedback.");
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

test.describe("jornada E2E da mentoria em staging", () => {
  test("admin matricula; aluno envia anexo, corrige; mentor aprova", async ({ browser }) => {
    test.skip(!mutationsEnabled || !adminEmail || !adminPassword || !studentEmail || !studentPassword || !studentId || !mentorEmail || !mentorPassword || !cohortId,
      "Requer MENTORSHIP_E2E_MUTATIONS_ENABLED=true e contas/IDs descartáveis configurados no staging.");
    test.skip(!Number.isInteger(weekNumber) || weekNumber < 1 || weekNumber > 11,
      "MENTORSHIP_E2E_WEEK deve apontar para uma semana de atividade comum (1-11).");
    test.setTimeout(120_000);

    const adminContext = await browser.newContext();
    const studentContext = await browser.newContext();
    const mentorContext = await browser.newContext();
    try {
      const admin = await adminContext.newPage();
      await signIn(admin, adminEmail!, adminPassword!, "/mentoria/admin");
      const enrollmentResponse = await admin.request.post(apiUrl("/api/v1/mentorship/admin/enrollments"), {
        data: { cohortId, userId: studentId, level: "beginner" },
      });
      expect(enrollmentResponse.status(), await enrollmentResponse.text()).toBe(201);

      const student = await studentContext.newPage();
      await signIn(student, studentEmail!, studentPassword!);
      await expect(student.getByRole("main").first()).toBeVisible();
      await expect(student.getByRole("heading", { name: /falta vincular sua matrícula/i })).toHaveCount(0);
      await student.goto(`/mentoria/semanas/${weekNumber}`);
      await expect(student.getByLabel("Sua evidência")).toBeVisible();
      await student.getByLabel(/Anexos/).setInputFiles({
        name: "qa-lab-e2e-evidence.pdf",
        mimeType: "application/pdf",
        buffer: Buffer.from("%PDF-1.4\nEvidencia de teste E2E da mentoria\n%%EOF\n"),
      });
      await expect(student.getByText(/Anexo enviado/)).toBeVisible();
      await student.getByLabel("Sua evidência").fill("Investiguei o fluxo principal e identifiquei risco nas transições de estado e nos dados inválidos.");
      const firstSubmissionResponse = student.waitForResponse((response) => response.url().includes("/api/v1/mentorship/submissions") && response.request().method() === "POST");
      await student.getByRole("button", { name: "Enviar para revisão" }).click();
      const firstResponse = await firstSubmissionResponse;
      expect(firstResponse.status(), await firstResponse.text()).toBe(201);
      const firstPayload = await firstResponse.json() as { data?: { id?: string } };
      const firstSubmissionId = firstPayload.data?.id;
      expect(firstSubmissionId).toBeTruthy();
      await expect(student.getByText(/Entrega \d+ enviada para revisao/)).toBeVisible();

      const unauthorizedAdmin = await student.request.post(apiUrl("/api/v1/mentorship/admin/enrollments"), {
        data: { cohortId, userId: studentId, level: "beginner" },
      });
      expect(unauthorizedAdmin.status()).toBe(403);
      const unauthorizedReview = await student.request.post(apiUrl(`/api/v1/mentorship/mentor/submissions/${firstSubmissionId}/review`), {
        data: { decision: "approved", scores: {}, strengths: "", improvements: "", nextAction: "" },
      });
      expect(unauthorizedReview.status()).toBe(403);
      await student.goto(`/mentoria/mentor/entregas/${firstSubmissionId}`);
      await expect(student).toHaveURL(/\/mentoria(?:\?|$)/);

      const mentor = await mentorContext.newPage();
      await signIn(mentor, mentorEmail!, mentorPassword!, `/mentoria/mentor/entregas/${firstSubmissionId}`);
      await expect(mentor.getByRole("heading", { name: /Entrega do aluno/ })).toBeVisible();
      await reviewSubmission(mentor, "Pedir ajustes");

      await student.goto(`/mentoria/semanas/${weekNumber}`);
      await expect(student.getByText(/Ajustes solicitados/).first()).toBeVisible();
      await student.getByLabel("Sua evidência").fill("Corrigi a análise com casos de borda, riscos priorizados e evidência reproduzível para cada comportamento.");
      const resubmissionResponse = student.waitForResponse((response) => response.url().includes("/api/v1/mentorship/submissions") && response.request().method() === "POST");
      await student.getByRole("button", { name: "Enviar para revisão" }).click();
      const resubmission = await resubmissionResponse;
      expect(resubmission.status(), await resubmission.text()).toBe(201);
      const resubmissionPayload = await resubmission.json() as { data?: { id?: string; attemptNumber?: number } };
      const revisedSubmissionId = resubmissionPayload.data?.id;
      expect(revisedSubmissionId).toBeTruthy();
      expect(resubmissionPayload.data?.attemptNumber).toBeGreaterThan(1);

      await mentor.goto(`/mentoria/mentor/entregas/${revisedSubmissionId}`);
      await reviewSubmission(mentor, "Aprovar entrega");
      await student.goto(`/mentoria/semanas/${weekNumber}`);
      await expect(student.getByText(/Aprovada/).first()).toBeVisible();
    } finally {
      await Promise.all([adminContext.close(), studentContext.close(), mentorContext.close()]);
    }
  });

  test("aluno publica o case final aprovado no portfolio publico", async ({ browser }) => {
    const email = process.env.MENTORSHIP_E2E_PORTFOLIO_EMAIL ?? studentEmail;
    const password = process.env.MENTORSHIP_E2E_PORTFOLIO_PASSWORD ?? studentPassword;
    const username = process.env.MENTORSHIP_E2E_STUDENT_USERNAME;
    test.skip(!mutationsEnabled || !email || !password || !username,
      "Requer aluno com entrega final aprovada, username público e MENTORSHIP_E2E_MUTATIONS_ENABLED=true.");

    const context = await browser.newContext();
    try {
      const page = await context.newPage();
      await signIn(page, email!, password!, "/mentoria/semanas/12");
      await expect(page.getByRole("heading", { name: "Transformar a entrega em case" })).toBeVisible();
      const title = `Case de validacao ${new Date().toISOString()}`;
      await page.getByLabel("Titulo").fill(title);
      await page.getByLabel("Resumo").fill("Validação E2E do case aprovado, incluindo contexto, risco, abordagem e resultado do projeto.");
      const published = page.getByLabel("Publicar este case no meu portfolio publico");
      if (!(await published.isChecked())) await published.check();
      const portfolioResponse = page.waitForResponse((response) => response.url().includes("/api/v1/mentorship/portfolio") && response.request().method() === "POST");
      await page.getByRole("button", { name: "Salvar decisao de publicacao" }).click();
      const response = await portfolioResponse;
      expect(response.status(), await response.text()).toBe(200);
      const payload = await response.json() as { data?: { id?: string; published?: boolean } };
      expect(payload.data?.id).toBeTruthy();
      expect(payload.data?.published).toBe(true);
      await expect(page.getByRole("status")).toContainText("Case publicado");
      await page.goto(`/portfolio/${username}/mentoria/${payload.data!.id}`);
      await expect(page.getByRole("heading", { name: title })).toBeVisible();
      await expect(page.getByText("Validação E2E do case aprovado", { exact: false })).toBeVisible();
    } finally {
      await context.close();
    }
  });
});
