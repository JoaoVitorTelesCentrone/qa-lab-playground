import { FieldReader, ok, readJson, validated, withUser, fail } from "@/lib/product/api";
import { getJourney, startLab } from "@/lib/product/store";
import { labs } from "@/lib/playground/catalog";

export const dynamic = "force-dynamic";

// GET /api/v1/progress — jornada completa (Labs, evidências e cobertura).
export function GET() {
  return withUser(async (user) => ok(await getJourney(user.id)));
}

// POST /api/v1/progress { labSlug } — matricula o aluno e marca o Lab como iniciado.
export function POST(request: Request) {
  return withUser((user) =>
    validated(async () => {
      const body = new FieldReader(await readJson(request));
      const labSlug = body.text("labSlug", { max: 120 });
      body.done();

      const lab = labs.find((item) => item.slug === labSlug);
      if (!lab) return fail("Lab não encontrado.", 404);
      if (lab.status !== "liberado") return fail("Este Lab ainda não foi liberado.", 409);

      return ok(await startLab(user.id, lab.slug), 201);
    }),
  );
}
