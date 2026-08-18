import { FieldReader, fail, ok, readJson, validated, withUser } from "@/lib/product/api";
import { listSubmissions, submitEvidence } from "@/lib/product/store";
import { evaluateEvidence, severities } from "@/lib/product/evaluation";
import { labs } from "@/lib/playground/catalog";
import { systemChallenges } from "@/lib/system-challenges";

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
      const notes = body.text("notes", { max: 2000, required: false });
      body.done();

      const lab = labs.find((item) => item.slug === labSlug);
      if (!lab) return fail("Lab não encontrado.", 404);
      if (lab.status !== "liberado") return fail("Este Lab ainda não foi liberado.", 409);

      // A avaliação é a mesma do formulário: campos obrigatórios e todos os
      // critérios de aceite do Lab confirmados. O servidor é quem decide.
      const acceptance = systemChallenges.find((item) => item.id === lab.slug)?.acceptance ?? [];
      const draft = {
        result: typeof raw.result === "string" ? raw.result : "",
        reproduction: typeof raw.reproduction === "string" ? raw.reproduction : "",
        severity: typeof raw.severity === "string" ? raw.severity : "",
        checklist: Array.isArray(raw.checklist) ? raw.checklist.filter((item): item is string => typeof item === "string") : [],
      };
      const evaluation = evaluateEvidence(draft, acceptance);
      if (!evaluation.passed) {
        return fail("A entrega ainda não atende aos critérios do Lab.", 422, Object.fromEntries(evaluation.issues.map((issue) => [issue.field, issue.message])));
      }

      const submission = await submitEvidence(user.id, {
        labSlug: lab.slug,
        result: draft.result.trim(),
        reproduction: draft.reproduction.trim(),
        severity: draft.severity as (typeof severities)[number],
        checklist: acceptance,
        notes,
      });
      return ok(submission, 201);
    }),
  );
}
