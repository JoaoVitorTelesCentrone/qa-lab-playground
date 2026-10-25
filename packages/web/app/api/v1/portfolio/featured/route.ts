import { fail, ok, readJson, withUser } from "@/lib/product/api";
import { saveFeaturedPortfolioCases } from "@/lib/product/store";

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function PUT(request: Request) {
  const body = await readJson(request);
  return withUser(async (user) => {
    const ids = body.submissionIds;
    if (!Array.isArray(ids) || ids.length > 3 || !ids.every((id) => typeof id === "string" && UUID.test(id)) || new Set(ids).size !== ids.length) {
      return fail("Selecione até três cases válidos, sem repetir.", 422, { submissionIds: "Use até três cases publicados." });
    }
    try {
      return ok(await saveFeaturedPortfolioCases(user.id, ids as string[]));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível salvar os destaques.";
      if (message.includes("portfolio_featured_submission_ids")) return fail("Destaques ainda indisponíveis: aplique a migração portfolio_featured_work no Supabase.", 503);
      return fail(message, message.includes("Escolha apenas") ? 422 : 500);
    }
  });
}
