import { fail, ok, readJson, withUser } from "@/lib/product/api";
import { setPortfolioProjectPublished } from "@/lib/product/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await readJson(request);
  return withUser(async (user) => {
    if (typeof body.published !== "boolean") return fail("Informe se o projeto fica publicado.", 422);
    try {
      return ok(await setPortfolioProjectPublished(user.id, id, body.published));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível publicar o projeto.";
      return fail(message, message.includes("não encontrado") ? 404 : 422);
    }
  });
}
