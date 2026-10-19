import { FieldReader, fail, ok, readJson, validated, withUser } from "@/lib/product/api";
import { deleteSubmission, getSubmissionLabSlug, listSubmissions, submitEvidence, updateSubmission } from "@/lib/product/store";
import { evaluateEvidence, evaluateLab101Evidence } from "@/lib/product/evaluation";
import { validateEvidenceAttachments } from "@/lib/product/evidence-attachments";
import { evidenceFilesExist } from "@/lib/product/evidence-storage";
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
      const attachments = validateEvidenceAttachments(raw.attachments, user.id, lab.slug);
      if (!attachments) return fail("Anexo inválido ou de outro Lab.", 422, { attachments: "Envie apenas arquivos deste Lab." });
      if (!(await evidenceFilesExist(attachments))) return fail("Anexo não encontrado.", 422, { attachments: "Envie o arquivo novamente." });

      // A avaliação é a mesma do formulário. O servidor é quem decide.
      const evaluation = evaluateEvidence({ evidence, attachments: attachments.length });
      if (!evaluation.passed) {
        return fail("A entrega ainda não atende aos critérios do Lab.", 422, Object.fromEntries(evaluation.issues.map((issue) => [issue.field, issue.message])));
      }

      const submission = await submitEvidence({
        labSlug: lab.slug,
        evidence: evidence.trim(),
        attachments,
      });
      return ok({
        submission,
        feedback: lab.number === 101 ? evaluateLab101Evidence(evidence) : null,
      }, 201);
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
      const labSlug = await getSubmissionLabSlug(user.id, id);
      if (!labSlug) return fail("Evidência não encontrada.", 404);
      const attachments = validateEvidenceAttachments(raw.attachments, user.id, labSlug);
      if (!attachments) return fail("Anexo inválido ou de outro Lab.", 422, { attachments: "Envie apenas arquivos deste Lab." });
      if (!(await evidenceFilesExist(attachments))) return fail("Anexo não encontrado.", 422, { attachments: "Envie o arquivo novamente." });

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
