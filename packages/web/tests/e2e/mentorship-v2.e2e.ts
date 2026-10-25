import { test, expect, localEnabled, checked, signIn } from "./helpers/mentorship-local";
import { mentorshipPathV2, pathV2Assignments, pathV2Chapters, pathV2ChapterHref, pathV2LessonKeys, pathV2PracticeKeys } from "../../lib/mentorship/path-v2";
import type { Page } from "@playwright/test";
import { createHmac } from "node:crypto";

const firstAssignment = pathV2Assignments[0];
const firstChapter = pathV2Chapters.find((item) => item.chapter.assignmentKey === firstAssignment.key)!;
const assignmentUrl = pathV2ChapterHref(firstChapter.module, firstChapter.chapter);
const responseText = "Investiguei a captura, documentei os estados antes e depois, comparei os resultados com a regra confirmada e registrei as lacunas e o risco residual para a próxima investigação.";
const pdf = Buffer.from("%PDF-1.4\nEvidencia sintetica QA Lab\n%%EOF\n");

async function review(page: Page, decision: "changes_requested" | "approved") {
  for (const fieldset of await page.locator("form fieldset").all()) await fieldset.getByRole("radio").nth(2).check();
  await page.getByLabel("Decisao").selectOption(decision);
  await page.getByLabel("Pontos fortes").fill("Evidência rastreável e reproduzível.");
  await page.getByLabel("O que melhorar").fill("Declare a lacuna e a hipótese de borda.");
  await page.getByLabel("Proxima acao").fill("Revise o risco residual e atualize o parecer.");
  await page.getByRole("button", { name: "Salvar revisão", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("O aluno já pode acompanhar o feedback.");
}

test.describe("mentoria v2: banco local e três perfis", () => {
  test.skip(!localEnabled, "Execute bun run test:e2e:mentorship para preparar o ambiente local obrigatório.");
  test.setTimeout(120_000);

  test("diagnóstico, aula, prática, anexo, ajustes e aprovação", async ({ browser, lab }) => {
    const studentContext = await browser.newContext();
    const mentorContext = await browser.newContext();
    const operatorContext = await browser.newContext();
    try {
      await checked(lab.admin.from("mentorship_enrollments").update({ status: "invited" }).eq("id", lab.enrollmentId));
      const operator = await operatorContext.newPage();
      await signIn(operator, lab.actors.operator, "/mentoria/admin");
      await expect(operator.getByRole("heading", { name: /Sinais de acompanhamento por turma/i })).toBeVisible();
      const activated = await operator.request.patch(`/api/v1/mentorship/admin/enrollments/${lab.enrollmentId}`, { data: { status: "active", level: "beginner" } });
      expect(activated.status(), await activated.text()).toBe(200);
      const student = await studentContext.newPage();
      await signIn(student, lab.actors.student, "/mentoria/diagnostico");
      await student.getByLabel(/Qual resultado voce quer buscar/).fill("Construir um case com evidências e explicar minha decisão de release.");
      await student.getByRole("button", { name: /Salvar diagnostico/i }).click();
      await expect(student.getByRole("status")).toContainText("Diagnostico salvo");
      const opening = mentorshipPathV2[0].chapters[0];
      await student.goto(pathV2ChapterHref(mentorshipPathV2[0], opening));
      await student.getByRole("button", { name: "Marcar como concluída", exact: true }).first().click();
      await expect(student.getByRole("button", { name: "Concluída", exact: true }).first()).toBeDisabled();
      await student.getByRole("region", { name: "Faça", exact: true }).getByRole("button", { name: "Marcar como concluída", exact: true }).first().click();
      await student.goto(assignmentUrl);
      await student.getByLabel(/Anexos/).setInputFiles({ name: "evidencia.pdf", mimeType: "application/pdf", buffer: pdf });
      await expect(student.getByRole("link", { name: "evidencia.pdf", exact: true })).toBeVisible();
      await student.getByLabel("Sua evidência").fill(responseText);
      const sent = student.waitForResponse((r) => r.url().endsWith("/api/v1/mentorship/submissions") && r.request().method() === "POST");
      await student.getByRole("button", { name: "Enviar para revisão", exact: true }).click();
      const firstResponse = await sent;
      expect(firstResponse.status(), await firstResponse.text()).toBe(201);
      const first = (await firstResponse.json()).data;
      expect(first.attachments[0].path).toContain(lab.actors.student.id);
      const mentor = await mentorContext.newPage();
      await signIn(mentor, lab.actors.mentor, `/mentoria/mentor/entregas/${first.id}`);
      await expect(mentor.getByRole("heading", { level: 1, name: firstAssignment.title })).toBeVisible();
      await review(mentor, "changes_requested");
      await student.goto(assignmentUrl);
      await expect(student.getByText("Ajustes solicitados", { exact: true }).first()).toBeVisible();
      await student.getByLabel("Sua evidência").fill(`${responseText} Incluí a borda ausente e uma condição explícita para revisar a conclusão.`);
      const resent = student.waitForResponse((r) => r.url().endsWith("/api/v1/mentorship/submissions") && r.request().method() === "POST");
      await student.getByRole("button", { name: "Enviar para revisão", exact: true }).click();
      const revisedResponse = await resent;
      expect(revisedResponse.status(), await revisedResponse.text()).toBe(201);
      const revised = (await revisedResponse.json()).data;
      expect(revised.attemptNumber).toBe(2);
      await mentor.goto(`/mentoria/mentor/entregas/${revised.id}`);
      await review(mentor, "approved");
      await student.goto(assignmentUrl);
      await expect(student.getByText("Aprovada", { exact: true }).first()).toBeVisible();
      const persisted = await checked(lab.admin.from("mentorship_submissions").select("status,attachments").eq("id", revised.id).single());
      expect(persisted.status).toBe("approved");
      expect(persisted.attachments[0].url).toBe("");
      const notifications = await checked(lab.admin.from("mentorship_notifications").select("href").eq("user_id", lab.actors.student.id).eq("kind", "review"));
      expect(notifications).toHaveLength(2);
      expect(notifications.every((item) => item.href === `${assignmentUrl}#entrega-heading`)).toBe(true);
      await expect.poll(async () => {
        const messages = await checked(lab.admin.from("mentorship_email_outbox").select("id").eq("user_id", lab.actors.student.id).eq("status", "sent"));
        return messages.length;
      }, { timeout: 15_000, message: "Review emails must be delivered after the event, without waiting for daily cron" }).toBe(2);
    } finally { await studentContext.close(); await mentorContext.close(); await operatorContext.close(); }
  });

  test("materiais, agendamento, encontros, replay e privacidade em mobile e desktop", async ({ page, browser, lab }) => {
    const now = Date.now();
    const sessions = await checked(lab.admin.from("mentorship_live_sessions").insert([
      { cohort_id: lab.cohortId, week_number: 1, title: "Encontro gravado", agenda: "Revisão de evidências", starts_at: new Date(now - 172_800_000).toISOString(), ends_at: new Date(now - 169_200_000).toISOString(), meeting_url: "https://example.test/old-meeting", recording_url: "https://example.test/replay-visible", recording_available_until: new Date(now + 86_400_000).toISOString() },
      { cohort_id: lab.cohortId, week_number: 2, title: "Gravação expirada", starts_at: new Date(now - 86_400_000).toISOString(), ends_at: new Date(now - 82_800_000).toISOString(), meeting_url: "https://example.test/expired-meeting", recording_url: "https://example.test/replay-expired", recording_available_until: new Date(now - 1000).toISOString() },
      { cohort_id: lab.cohortId, week_number: 3, title: "Próximo encontro", agenda: "Traga uma dúvida", starts_at: new Date(now + 3_600_000).toISOString(), ends_at: new Date(now + 7_200_000).toISOString(), meeting_url: "https://example.test/next-meeting" },
      { cohort_id: lab.otherCohortId, week_number: 1, title: "Encontro de outra turma", starts_at: new Date(now + 3_600_000).toISOString(), ends_at: new Date(now + 7_200_000).toISOString(), meeting_url: "https://example.test/other-cohort" },
    ].map((session) => ({ agenda: "", ...session }))).select("id,week_number,cohort_id"));
    const keys = mentorshipPathV2[0].chapters[0].lessonKeys;
    await checked(lab.admin.from("mentorship_lesson_content").upsert([
      { lesson_key: keys[0], status: "published", material_url: "https://example.test/published-material" },
      { lesson_key: keys[1], status: "scheduled", available_at: new Date(now + 86_400_000).toISOString(), material_url: "https://example.test/future-material" },
    ]));
    try {
      await signIn(page, lab.actors.student, "/mentoria/encontros");
      for (const width of [390, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await expect(page.getByRole("link", { name: /Assistir gravação.*Encontro gravado/ })).toHaveAttribute("href", "https://example.test/replay-visible");
        await expect(page.getByRole("link", { name: "Entrar no encontro", exact: true })).toHaveAttribute("href", "https://example.test/next-meeting");
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        expect(await page.content()).not.toContain("https://example.test/replay-expired");
        expect(await page.content()).not.toContain("https://example.test/other-cohort");
        await page.screenshot({ path: test.info().outputPath(`encontros-${width}.png`), fullPage: true });
      }
      await page.getByLabel("Meu compromisso desta semana").fill("Apresentar uma dúvida sobre risco residual.");
      await page.getByRole("button", { name: "Salvar compromisso", exact: true }).click();
      await expect(page.getByRole("status")).toContainText("Compromisso salvo");
      const nextId = sessions.find((session) => session.cohort_id === lab.cohortId && session.week_number === 3)!.id;
      const cron = await page.request.get("/api/cron/mentorship-emails", { headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` } });
      expect(cron.status()).toBe(200);
      await page.request.get("/api/cron/mentorship-emails", { headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` } });
      const reminders = await checked(lab.admin.from("mentorship_email_outbox").select("id,href").eq("dedupe_key", `session-reminder:${nextId}:${lab.actors.student.id}`));
      expect(reminders).toHaveLength(1);
      expect(reminders[0].href).toBe(`/mentoria/encontros#encontro-${nextId}`);
      const chapterUrl = pathV2ChapterHref(mentorshipPathV2[0], mentorshipPathV2[0].chapters[0]);
      await page.goto(chapterUrl);
      await expect(page.getByRole("link", { name: /Abrir material de apoio/ })).toHaveAttribute("href", "https://example.test/published-material");
      expect(await page.content()).not.toContain("https://example.test/future-material");
      await checked(lab.admin.from("mentorship_lesson_content").update({ status: "draft" }).eq("lesson_key", keys[0]));
      await page.reload();
      await expect(page.getByRole("link", { name: /Abrir material de apoio/ })).toHaveCount(0);
      await checked(lab.admin.from("mentorship_lesson_content").update({ available_at: new Date(now - 1000).toISOString() }).eq("lesson_key", keys[1]));
      await page.reload();
      // Second lesson is collapsed; the URL is still present only for the authorized student.
      await expect(page.locator('a[href="https://example.test/future-material"]')).toHaveCount(1);
      const visitor = await browser.newContext();
      try {
        const anonymous = await visitor.newPage();
        await anonymous.goto(chapterUrl);
        expect(await anonymous.content()).not.toContain("https://example.test/future-material");
        await anonymous.goto("/mentoria/encontros");
        await expect(anonymous).toHaveURL(/\/login/);
      } finally { await visitor.close(); }
    } finally { await checked(lab.admin.from("mentorship_lesson_content").delete().in("lesson_key", [...keys])); }
  });

  test("alunos e mentores de outra turma não leem nem alteram evidências e arquivos", async ({ browser, lab }) => {
    const studentContext = await browser.newContext();
    const peerContext = await browser.newContext();
    const otherContext = await browser.newContext();
    try {
      const student = await studentContext.newPage();
      const peer = await peerContext.newPage();
      const other = await otherContext.newPage();
      await signIn(student, lab.actors.student, assignmentUrl);
      await signIn(peer, lab.actors.peer, assignmentUrl);
      await signIn(other, lab.actors.otherMentor, "/mentoria/mentor");
      const upload = await student.request.post("/api/v1/mentorship/attachments", { multipart: { assignmentKey: firstAssignment.key, file: { name: "privado.pdf", mimeType: "application/pdf", buffer: pdf } } });
      expect(upload.status(), await upload.text()).toBe(201);
      const attachment = (await upload.json()).data;
      const submitted = await student.request.post("/api/v1/mentorship/submissions", { data: { assignmentKey: firstAssignment.key, enrollmentId: "ignored-spoofed-id", content: { response: responseText }, attachments: [attachment] } });
      expect(submitted.status(), await submitted.text()).toBe(201);
      const submission = (await submitted.json()).data;
      expect(submission.enrollmentId).toBe(lab.enrollmentId);
      for (const actor of [lab.actors.peer, lab.actors.mentor, lab.actors.otherMentor]) {
        const direct = await actor.client.from("mentorship_submissions").select("*").eq("id", submission.id);
        expect(direct.error?.code).toBe("42501");
        const mutation = await actor.client.from("mentorship_enrollments").update({ user_id: actor.id }).eq("id", lab.enrollmentId);
        expect(mutation.error?.code).toBe("42501");
        const signed = await actor.client.storage.from("lab-evidence").createSignedUrl(attachment.path, 60);
        expect(signed.error).toBeTruthy();
      }
      const stolen = await peer.request.post("/api/v1/mentorship/submissions", { data: { assignmentKey: firstAssignment.key, content: { response: responseText }, attachments: [attachment] } });
      expect(stolen.status()).toBe(422);
      const spoofed = await peer.request.post("/api/v1/mentorship/submissions/draft", { data: { assignmentKey: firstAssignment.key, content: { response: responseText }, attachments: [{ ...attachment, path: `${lab.actors.peer.id}/../${attachment.path}` }] } });
      expect(spoofed.status()).toBe(422);
      const nonexistent = await student.request.post("/api/v1/mentorship/submissions/draft", { data: { assignmentKey: firstAssignment.key, content: { response: responseText }, attachments: [{ ...attachment, path: attachment.path.replace(/[^/]+$/, "00000000-0000-4000-8000-000000000000.pdf") }] } });
      expect(nonexistent.status()).toBe(422);
      const reviewResponse = await other.request.post(`/api/v1/mentorship/mentor/submissions/${submission.id}/review`, { data: { decision: "approved", scores: Object.fromEntries(firstAssignment.rubric.map((key) => [key, 3])), strengths: "Teste", improvements: "Teste", nextAction: "Teste" } });
      expect(reviewResponse.status()).toBe(403);
      await other.goto(`/mentoria/mentor/entregas/${submission.id}`);
      expect(await other.content()).not.toContain(attachment.path);
      const unchanged = await checked(lab.admin.from("mentorship_submissions").select("status").eq("id", submission.id).single());
      expect(unchanged.status).toBe("submitted");
      const draftCase = await checked(lab.admin.from("mentorship_portfolio_cases").insert({ user_id: lab.actors.student.id, submission_id: submission.id, title: "Rascunho privado", summary: "Este rascunho não deve aparecer para outro aluno.", published: false }).select("id").single());
      const peerCases = await lab.actors.peer.client.from("mentorship_portfolio_cases").select("id").eq("id", draftCase.id);
      expect(peerCases.error).toBeNull();
      expect(peerCases.data).toEqual([]);
      const directUpload = await lab.actors.peer.client.storage.from("lab-evidence").upload(`${lab.actors.peer.id}/mentoria-test/00000000-0000-4000-8000-000000000001.pdf`, pdf, { contentType: "application/pdf" });
      expect(directUpload.error).toBeTruthy();
      const evidence = await checked(lab.admin.from("lab_submissions").insert({ user_id: lab.actors.student.id, lab_slug: "desafio-101", evidence: "Evidência privada da conta A com passos reproduzíveis." }).select("id").single());
      const stolenEvidence = await peer.request.post("/api/v1/mentorship/submissions", { data: { assignmentKey: firstAssignment.key, content: { response: responseText }, labSubmissionId: evidence.id } });
      expect(stolenEvidence.status()).toBe(422);
      await checked(lab.admin.from("mentorship_staff").update({ active: false }).eq("user_id", lab.actors.otherMentor.id));
      expect((await other.request.get("/api/v1/mentorship/mentor/queue")).status()).toBe(403);
    } finally { await studentContext.close(); await peerContext.close(); await otherContext.close(); }
  });

  test("convite, pausa e conclusão bloqueiam escrita; histórico permanece legível", async ({ page, lab }) => {
    await signIn(page, lab.actors.student, assignmentUrl);
    for (const status of ["invited", "paused", "completed"] as const) {
      await checked(lab.admin.from("mentorship_enrollments").update({ status }).eq("id", lab.enrollmentId));
      const writes = await Promise.all([
        page.request.post("/api/v1/mentorship/submissions", { data: { assignmentKey: firstAssignment.key, content: { response: responseText } } }),
        page.request.post("/api/v1/mentorship/submissions/draft", { data: { assignmentKey: firstAssignment.key, content: { response: responseText } } }),
        page.request.post(`/api/v1/mentorship/lessons/${pathV2LessonKeys[0]}/progress`),
        page.request.post("/api/v1/mentorship/attachments", { multipart: { assignmentKey: firstAssignment.key, file: { name: "blocked.pdf", mimeType: "application/pdf", buffer: pdf } } }),
      ]);
      expect(writes.map((item) => item.status())).toEqual([403, 403, 403, 403]);
      if (status !== "invited") {
        await page.goto(assignmentUrl);
        await expect(page.getByRole("heading", { level: 1, name: firstChapter.chapter.title })).toBeVisible();
        await expect(page.getByRole("button", { name: "Enviar para revisão", exact: true })).toHaveCount(0);
        await expect(page.getByRole("button", { name: "Marcar como concluída", exact: true })).toHaveCount(0);
      }
    }
    expect(await checked(lab.admin.from("mentorship_submissions").select("id").eq("enrollment_id", lab.enrollmentId))).toHaveLength(0);
  });

  test("case final exige onze aprovações; certificado exige aulas, práticas e entregas", async ({ page, browser, lab }) => {
    const final = pathV2Assignments[pathV2Assignments.length - 1];
    const finalChapter = pathV2Chapters.find((item) => item.chapter.assignmentKey === final.key)!;
    const finalUrl = pathV2ChapterHref(finalChapter.module, finalChapter.chapter);
    await signIn(page, lab.actors.student, finalUrl);
    const early = await page.request.post("/api/v1/mentorship/submissions", { data: { assignmentKey: final.key, content: { response: responseText } } });
    expect(early.status()).toBe(422);
    await checked(lab.admin.from("mentorship_submissions").insert(pathV2Assignments.slice(0, -1).map((assignment) => ({ enrollment_id: lab.enrollmentId, assignment_key: assignment.key, attempt_number: 1, level: "beginner", content: { response: responseText }, status: "approved", reviewed_at: new Date().toISOString() }))));
    const sent = await page.request.post("/api/v1/mentorship/submissions", { data: { assignmentKey: final.key, content: { response: responseText } } });
    expect(sent.status(), await sent.text()).toBe(201);
    const submission = (await sent.json()).data;
    expect((await page.request.post("/api/v1/mentorship/certificate")).status()).toBe(409);
    const mentorContext = await browser.newContext();
    try {
      const mentor = await mentorContext.newPage();
      await signIn(mentor, lab.actors.mentor, `/mentoria/mentor/entregas/${submission.id}`);
      await review(mentor, "approved");
    } finally { await mentorContext.close(); }
    // Build an almost-complete precondition, then prove each final requirement via real APIs.
    await checked(lab.admin.from("mentorship_lesson_progress").insert([...pathV2LessonKeys.slice(0, -1), ...pathV2PracticeKeys.slice(0, -1)].map((key) => ({ enrollment_id: lab.enrollmentId, lesson_key: key, status: "completed", completed_at: new Date().toISOString() }))));
    expect((await page.request.post("/api/v1/mentorship/certificate")).status()).toBe(409);
    expect((await page.request.post(`/api/v1/mentorship/lessons/${pathV2LessonKeys.at(-1)}/progress`)).status()).toBe(200);
    expect((await page.request.post("/api/v1/mentorship/certificate")).status()).toBe(409);
    expect((await page.request.post(`/api/v1/mentorship/lessons/${pathV2PracticeKeys.at(-1)}/progress`)).status()).toBe(200);
    const issued = await page.request.post("/api/v1/mentorship/certificate");
    expect(issued.status(), await issued.text()).toBe(200);
    const code = (await issued.json()).data.certificate.code;
    const again = await page.request.post("/api/v1/mentorship/certificate");
    expect((await again.json()).data.certificate.code).toBe(code);
    expect(await checked(lab.admin.from("mentorship_certificates").select("id").eq("enrollment_id", lab.enrollmentId))).toHaveLength(1);
    await page.goto(finalUrl);
    await page.getByLabel("Titulo", { exact: true }).fill("Case final da turma de teste");
    await page.getByLabel("Resumo", { exact: true }).fill("Investiguei um fluxo, registrei evidências e recomendei uma decisão com riscos explícitos.");
    await page.getByLabel("Publicar este case no meu portfolio publico").check();
    const publishing = page.waitForResponse((r) => r.url().endsWith("/api/v1/mentorship/portfolio") && r.request().method() === "POST");
    await page.getByRole("button", { name: "Salvar decisao de publicacao", exact: true }).click();
    const published = await publishing;
    expect(published.status(), await published.text()).toBe(200);
    const item = (await published.json()).data;
    const visitor = await browser.newContext();
    try {
      const publicPage = await visitor.newPage();
      const publicUrl = `/portfolio/${lab.actors.student.username}/mentoria/${item.id}`;
      await publicPage.goto(publicUrl);
      await expect(publicPage.getByRole("heading", { level: 1, name: "Case final da turma de teste" })).toBeVisible();
      await publicPage.goto(`/mentoria/certificado/${code}`);
      await expect(publicPage.getByText(code, { exact: false }).first()).toBeVisible();
      const unpublish = await page.request.post("/api/v1/mentorship/portfolio", { data: { submissionId: submission.id, title: item.title, summary: item.summary, published: false } });
      expect(unpublish.status()).toBe(200);
      const hidden = await publicPage.goto(publicUrl);
      expect(hidden?.status()).toBe(404);
    } finally { await visitor.close(); }
  });

  test("checkout da mentoria: reserva, assinatura, pagamento, repetição e reembolso", async ({ page, lab }) => {
    await checked(lab.admin.from("mentorship_enrollments").delete().eq("id", lab.enrollmentId));
    const offer = await checked(lab.admin.from("mentorship_offers").insert({ cohort_id: lab.cohortId, offer_code: `qa-${lab.cohortId}`, title: "Oferta local de teste", price: 297, currency: "BRL", terms: "Condições locais de teste", cancellation_policy: "Política local de teste", support_contact: "suporte@example.test", published: true, version: 1 }).select("id").single());
    await signIn(page, lab.actors.student, "/mentoria/inscricao");
    const checkout = await page.request.post("/api/v1/mentorship/checkout", { data: { offerId: offer.id, offerVersion: 1, acceptedTerms: true } });
    expect(checkout.status(), await checkout.text()).toBe(201);
    const order = (await checkout.json()).data;
    expect(new URL(order.checkoutUrl).hostname).toBe("www.mercadopago.com.br");
    const repeat = await page.request.post("/api/v1/mentorship/checkout", { data: { offerId: offer.id, offerVersion: 1, acceptedTerms: true } });
    expect((await repeat.json()).data.orderId).toBe(order.orderId);
    const notify = async (status: string, valid = true) => {
      const id = order.orderId;
      const simulated = await fetch(`${process.env.QALAB_TEST_MERCADO_PAGO_URL}/test/payments`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id, status }) });
      expect(simulated.ok).toBe(true);
      const requestId = `local-${status}`;
      const timestamp = String(Date.now());
      const signature = createHmac("sha256", process.env.MERCADO_PAGO_WEBHOOK_SECRET!).update(`id:${id};request-id:${requestId};ts:${timestamp};`).digest("hex");
      return page.request.post(`/api/billing/mercado-pago/webhook?data.id=${encodeURIComponent(id)}`, { headers: { "x-request-id": requestId, "x-signature": `ts=${timestamp},v1=${valid ? signature : "invalid"}` }, data: { data: { id } } });
    };
    expect((await notify("approved", false)).status()).toBe(401);
    expect((await notify("pending")).status()).toBe(200);
    expect(await checked(lab.admin.from("mentorship_enrollments").select("id").eq("user_id", lab.actors.student.id))).toHaveLength(0);
    expect((await notify("wrong-amount")).status()).toBe(500);
    expect((await notify("approved")).status()).toBe(200);
    expect((await notify("approved")).status()).toBe(200);
    const enrollments = await checked(lab.admin.from("mentorship_enrollments").select("id,status,cohort_id").eq("user_id", lab.actors.student.id));
    expect(enrollments).toHaveLength(1);
    expect(enrollments[0]).toMatchObject({ status: "active", cohort_id: lab.cohortId });
    expect((await notify("refunded")).status()).toBe(200);
    expect((await notify("approved")).status()).toBe(200);
    const refunded = await checked(lab.admin.from("mentorship_enrollments").select("status").eq("id", enrollments[0].id).single());
    expect(refunded.status).toBe("paused");
    expect((await page.request.post(`/api/v1/mentorship/lessons/${pathV2LessonKeys[0]}/progress`)).status()).toBe(403);
    const profile = await checked(lab.admin.from("profiles").select("plan").eq("id", lab.actors.student.id).single());
    expect(profile.plan).toBe("free");
  });
});
