import { fail, ok, readJson, withUser } from "@/lib/product/api";
import { finalizePortfolioProjectMediaUpload, preparePortfolioProjectMediaUpload, removePortfolioProjectMedia, setPortfolioProjectMediaCover, setPortfolioProjectMediaVisibility } from "@/lib/product/store";
import { isEvidenceUploadLimitError } from "@/lib/product/evidence-storage";

export const dynamic = "force-dynamic";
type Context = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Context) {
  const { id } = await params;
  const body = await readJson(request);
  return withUser(async (user) => {
    if (typeof body.size !== "number" || typeof body.type !== "string") return fail("Informe tamanho e tipo da mídia.", 400);
    try {
      return ok(await preparePortfolioProjectMediaUpload(user.id, id, body.size, body.type), 201);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível preparar a mídia.";
      return fail(message, isEvidenceUploadLimitError(error) ? 429 : message.includes("não encontrado") ? 404 : 422);
    }
  });
}

export async function PUT(request: Request, { params }: Context) {
  const { id } = await params;
  const body = await readJson(request);
  return withUser(async (user) => {
    if (typeof body.path !== "string" || typeof body.name !== "string") return fail("Informe o arquivo enviado.", 400);
    try {
      return ok(await finalizePortfolioProjectMediaUpload(user.id, id, body.path, body.name), 201);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível finalizar a mídia.";
      return fail(message, message.includes("não encontrado") ? 404 : 422);
    }
  });
}

export async function DELETE(request: Request, { params }: Context) {
  const { id } = await params;
  const body = await readJson(request);
  return withUser(async (user) => {
    if (typeof body.path !== "string" || !body.path) return fail("Informe a mídia que deseja remover.", 400);
    try {
      return ok(await removePortfolioProjectMedia(user.id, id, body.path));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível remover a mídia.";
      return fail(message, message.includes("não encontrado") ? 404 : 422);
    }
  });
}

export async function PATCH(request: Request, { params }: Context) {
  const { id } = await params;
  const body = await readJson(request);
  return withUser(async (user) => {
    if (typeof body.path !== "string" || !body.path) return fail("Informe a mídia que deseja atualizar.", 400);
    if (typeof body.isCover === "boolean") {
      try {
        return ok(await setPortfolioProjectMediaCover(user.id, id, body.path, body.isCover));
      } catch (error) {
        const message = error instanceof Error ? error.message : "Não foi possível atualizar a capa.";
        return fail(message, message.includes("não encontrado") ? 404 : 422);
      }
    }
    if (body.visibility !== "private" && body.visibility !== "public") return fail("Escolha se a mídia será privada ou pública.", 400);
    try {
      return ok(await setPortfolioProjectMediaVisibility(user.id, id, body.path, body.visibility));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível atualizar a mídia.";
      return fail(message, message.includes("não encontrado") ? 404 : 422);
    }
  });
}
