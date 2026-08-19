import { FieldReader, fail, ok, readJson, validated, withUser } from "@/lib/product/api";
import { deleteSubmission, listSubmissions, submitEvidence, updateSubmission } from "@/lib/product/store";
import { evaluateEvidence } from "@/lib/product/evaluation";
import { toAttachments } from "@/lib/product/journey";
import { labs } from "@/lib/playground/catalog";

export const dynamic = "force-dynamic";

// GET /api/v1/submissions?lab=<slug> — evidências entregues pelo aluno.
export function GET(request: Request) {
  return withUser(async (user) => {
    const lab = new URL(request.url).searchParams.get("lab") ?? undefined;
    return ok(await listSubmissions(user.id, lab));
  });
}

// POST /api/v1/submissions — avalia a entrega, registra a evidência e conclui o Lab.
export function POST(request: Request) {
  return withUser((user) =>
    validated(async () => {
      const raw = await readJson(request);
      const body = new FieldReader(raw);
      const labSlug = body.text("labSlug", { max: 120 });
      body.done();

      const lab = labs.find((item) => item.slug === labSlug);
      if (!lab) return fail("Lab não encontrado.", 404);
      if (lab.status !== "liberado") return fail("Este Lab ainda não foi liberado.", 409);

      const evidence = typeof raw.evidence === "string" ? raw.evidence : "";
      // Os anexos chegam já subidos (POST /api/v1/evidence/upload devolve o
      // ponteiro). Aqui só sobra revalidar o formato — o cliente não decide
      // sozinho o que entra no banco.
      const attachments = toAttachments(raw.attachments);

      // A avaliação é a mesma do formulário. O servidor é quem decide.
      const evaluation = evaluateEvidence({ evidence, attachments: attachments.length });
      if (!evaluation.passed) {
        return fail("A entrega ainda não atende aos critérios do Lab.", 422, Object.fromEntries(evaluation.issues.map((issue) => [issue.field, issue.message])));
      }

      const submission = await submitEvidence(user.id, {
        labSlug: lab.slug,
        evidence: evidence.trim(),
        attachments,
      });
      return ok(submission, 201);
    }),
  );
}

// PATCH /api/v1/submissions { id, evidence, attachments } — corrige uma entrega.
export function PATCH(request: Request) {
  return withUser((user) =>
    validated(async () => {
      const raw = await readJson(request);
      const id = typeof raw.id === "string" ? raw.id : "";
      if (!id) return fail("Informe a evidência.", 400);

      const evidence = typeof raw.evidence === "string" ? raw.evidence : "";
      const attachments = toAttachments(raw.attachments);

      // Mesma régua da entrega original: corrigir não pode ser um atalho para
      // deixar a evidência vazia depois que o Lab já foi dado como concluído.
      const evaluation = evaluateEvidence({ evidence, attachments: attachments.length });
      if (!evaluation.passed) {
        return fail("A entrega ainda não atende aos critérios do Lab.", 422, Object.fromEntries(evaluation.issues.map((issue) => [issue.field, issue.message])));
      }

      return ok(await updateSubmission(user.id, id, { evidence: evidence.trim(), attachments }));
    }),
  );
}

// DELETE /api/v1/submissions?id=... — apaga a entrega e os anexos dela.
export function DELETE(request: Request) {
  return withUser(async (user) => {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return fail("Informe a evidência.", 400);
    return ok(await deleteSubmission(user.id, id));
  });
}
