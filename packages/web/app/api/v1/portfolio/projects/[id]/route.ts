import { fail, ok, readJson, withUser } from "@/lib/product/api";
import { deletePortfolioProject, updatePortfolioProject } from "@/lib/product/store";
import { parsePortfolioProjectInput } from "@/lib/product/portfolio-projects";

export const dynamic = "force-dynamic";
type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  const { id } = await params;
  const body = await readJson(request);
  return withUser(async (user) => {
    const parsed = parsePortfolioProjectInput(body);
    if (!parsed.input) return fail("Revise os dados do projeto.", 422, parsed.details);
    try {
      return ok(await updatePortfolioProject(user.id, id, parsed.input));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível salvar o projeto.";
      return fail(message, message.includes("não encontrado") ? 404 : 500);
    }
  });
}

export async function DELETE(_request: Request, { params }: Context) {
  const { id } = await params;
  return withUser(async (user) => {
    try {
      await deletePortfolioProject(user.id, id);
      return ok({ deleted: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível excluir o projeto.";
      return fail(message, message.includes("não encontrado") ? 404 : 500);
    }
  });
}
