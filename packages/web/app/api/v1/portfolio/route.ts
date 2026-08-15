import { fail, ok, readJson, withUser } from "@/lib/product/api";
import { normalizeUsername, savePortfolioSettings, setSubmissionPublished } from "@/lib/product/store";

export const dynamic = "force-dynamic";

// PATCH /api/v1/portfolio { username?, portfolioPublic?, portfolioHeadline? }
export async function PATCH(request: Request) {
  const body = await readJson(request);
  return withUser(async (user) => {
    if (body.username !== undefined) {
      if (typeof body.username !== "string") return fail("Nome de usuário inválido.", 422, { username: "Informe um nome de usuário." });
      const normalized = normalizeUsername(body.username);
      // Publicar sem endereço não faz sentido: a página vive em /portfolio/<nome>.
      if (normalized.length < 3) return fail("Verifique os campos destacados.", 422, { username: "Use ao menos 3 caracteres: letras, números ou hífen." });
    }

    try {
      return ok(await savePortfolioSettings(user.id, {
        username: typeof body.username === "string" ? body.username : undefined,
        portfolioPublic: typeof body.portfolioPublic === "boolean" ? body.portfolioPublic : undefined,
        portfolioHeadline: typeof body.portfolioHeadline === "string" ? body.portfolioHeadline : undefined,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível salvar o portfólio.";
      return fail(message, message.includes("já está em uso") ? 409 : 500, message.includes("já está em uso") ? { username: message } : undefined);
    }
  });
}

// POST /api/v1/portfolio { submissionId, published } — publica uma evidência.
export async function POST(request: Request) {
  const body = await readJson(request);
  return withUser(async (user) => {
    if (typeof body.submissionId !== "string" || !body.submissionId) return fail("Informe a evidência.", 400);
    if (typeof body.published !== "boolean") return fail("Informe se a evidência fica publicada.", 422, { published: "Campo obrigatório." });

    try {
      return ok(await setSubmissionPublished(user.id, body.submissionId, body.published));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível publicar a evidência.";
      return fail(message, message.includes("não encontrada") ? 404 : 500);
    }
  });
}
