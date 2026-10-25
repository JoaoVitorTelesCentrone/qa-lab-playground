import { fail, ok, readJson, withUser } from "@/lib/product/api";
import { createPortfolioProject } from "@/lib/product/store";
import { parsePortfolioProjectInput } from "@/lib/product/portfolio-projects";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await readJson(request);
  return withUser(async (user) => {
    const parsed = parsePortfolioProjectInput(body);
    if (!parsed.input) return fail("Revise os dados do projeto.", 422, parsed.details);
    try {
      return ok(await createPortfolioProject(user.id, parsed.input), 201);
    } catch (error) {
      return fail(error instanceof Error ? error.message : "Não foi possível criar o projeto.", 500);
    }
  });
}
