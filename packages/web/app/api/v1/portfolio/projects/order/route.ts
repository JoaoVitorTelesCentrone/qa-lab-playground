import { fail, ok, readJson, withUser } from "@/lib/product/api";
import { reorderPortfolioProjects } from "@/lib/product/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await readJson(request);
  return withUser(async () => {
    const ids = body.projectIds;
    const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!Array.isArray(ids) || ids.length > 200 || !ids.every((id) => typeof id === "string" && uuid.test(id))) {
      return fail("Envie a ordem dos projetos do seu portfólio.", 400);
    }
    try {
      return ok(await reorderPortfolioProjects(ids));
    } catch (error) {
      return fail(error instanceof Error ? error.message : "Não foi possível ordenar os projetos.", 422);
    }
  });
}
