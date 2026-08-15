import { FieldReader, fail, ok, readJson, validated, withUser } from "@/lib/product/api";
import { listSubmissions, submitEvidence } from "@/lib/product/store";
import { labs } from "@/lib/playground/catalog";

export const dynamic = "force-dynamic";

const severities = ["baixa", "media", "alta", "critica"] as const;

// GET /api/v1/submissions?lab=<slug> — evidências entregues pelo aluno.
export function GET(request: Request) {
  return withUser(async (user) => {
    const lab = new URL(request.url).searchParams.get("lab") ?? undefined;
    return ok(await listSubmissions(user.id, lab));
  });
}

// POST /api/v1/submissions — registra a evidência e conclui o Lab.
export function POST(request: Request) {
  return withUser((user) =>
    validated(async () => {
      const body = new FieldReader(await readJson(request));
      const labSlug = body.text("labSlug", { max: 120 });
      const result = body.text("result", { max: 2000 });
      const reproduction = body.text("reproduction", { max: 4000 });
      const notes = body.text("notes", { max: 2000, required: false });
      const severity = body.oneOf("severity", severities);
      body.done();

      const lab = labs.find((item) => item.slug === labSlug);
      if (!lab) return fail("Lab não encontrado.", 404);

      return ok(await submitEvidence(user.id, { labSlug: lab.slug, result, reproduction, severity, notes }), 201);
    }),
  );
}
