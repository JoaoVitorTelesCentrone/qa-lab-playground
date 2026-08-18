import { fail, ok, readJson, withUser } from "@/lib/product/api";
import { createPortfolioSection, deletePortfolioSection, reorderPortfolioSections, updatePortfolioSection } from "@/lib/product/store";
import { SECTION_LIMITS } from "@/lib/product/portfolio-sections";

export const dynamic = "force-dynamic";

// A validação repete a do editor de propósito: o cliente avisa antes, a API é
// quem barra. Ver lib/product/portfolio-sections.ts.

// POST /api/v1/portfolio/sections { title, body? } — cria uma seção livre.
export async function POST(request: Request) {
  const body = await readJson(request);
  return withUser(async (user) => {
    if (typeof body.title !== "string" || !body.title.trim()) return fail("Dê um título à seção.", 422, { title: "Campo obrigatório." });
    if (body.title.trim().length > SECTION_LIMITS.title) return fail("Título muito longo.", 422, { title: `Use até ${SECTION_LIMITS.title} caracteres.` });
    if (body.body !== undefined && typeof body.body !== "string") return fail("Conteúdo inválido.", 422, { body: "Envie texto." });

    try {
      return ok(await createPortfolioSection(user.id, { title: body.title, body: typeof body.body === "string" ? body.body : "" }), 201);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível criar a seção.";
      return fail(message, message.includes("seções") || message.includes("migração") ? 409 : 500);
    }
  });
}

// PATCH /api/v1/portfolio/sections { id, title?, body?, visible? } — edita uma
// seção; ou { order: string[] } — grava a ordem da página.
export async function PATCH(request: Request) {
  const body = await readJson(request);
  return withUser(async (user) => {
    if (Array.isArray(body.order)) {
      const ids = body.order.filter((id): id is string => typeof id === "string" && id.length > 0);
      if (ids.length === 0) return fail("Informe a ordem das seções.", 422, { order: "Lista vazia." });
      try {
        return ok(await reorderPortfolioSections(user.id, ids));
      } catch (error) {
        return fail(error instanceof Error ? error.message : "Não foi possível reordenar as seções.", 500);
      }
    }

    if (typeof body.id !== "string" || !body.id) return fail("Informe a seção.", 400);
    if (body.title !== undefined && (typeof body.title !== "string" || !body.title.trim())) return fail("Dê um título à seção.", 422, { title: "Campo obrigatório." });
    if (body.body !== undefined && typeof body.body !== "string") return fail("Conteúdo inválido.", 422, { body: "Envie texto." });
    if (body.visible !== undefined && typeof body.visible !== "boolean") return fail("Informe se a seção fica visível.", 422, { visible: "Campo booleano." });

    try {
      return ok(await updatePortfolioSection(user.id, body.id, {
        title: typeof body.title === "string" ? body.title : undefined,
        body: typeof body.body === "string" ? body.body : undefined,
        visible: typeof body.visible === "boolean" ? body.visible : undefined,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível salvar a seção.";
      return fail(message, message.includes("não encontrada") ? 404 : 500);
    }
  });
}

// DELETE /api/v1/portfolio/sections { id }
export async function DELETE(request: Request) {
  const body = await readJson(request);
  return withUser(async (user) => {
    if (typeof body.id !== "string" || !body.id) return fail("Informe a seção.", 400);
    try {
      return ok(await deletePortfolioSection(user.id, body.id));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível apagar a seção.";
      return fail(message, message.includes("não encontrada") ? 404 : 500);
    }
  });
}
