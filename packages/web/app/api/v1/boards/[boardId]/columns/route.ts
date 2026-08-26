import { asColumnCategory, asColumnColor, normalizeColumnName, optionalWipLimit } from "@/lib/board/domain";
import { runBoard } from "@/lib/board/http";
import { addBoardColumn, reorderBoardColumns } from "@/lib/board/store";
import { boardColumnCategories, boardColumnColors } from "@/lib/board/types";
import { fail, readJson, withUser } from "@/lib/product/api";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ boardId: string }> };

export async function POST(request: Request, context: Context) {
  const { boardId } = await context.params;
  const body = await readJson(request);
  return withUser(async () => {
    const name = normalizeColumnName(body.name);
    const wipLimit = optionalWipLimit(body.wipLimit);
    if (!name) return fail("Informe o nome da coluna.", 422, { name: "Campo obrigatório." });
    if (typeof body.category !== "string" || !boardColumnCategories.includes(body.category as never)) {
      return fail("Categoria de coluna inválida.", 422, { category: "Use todo, in_progress ou done." });
    }
    if (typeof body.color !== "string" || !boardColumnColors.includes(body.color as never)) {
      return fail("Cor de coluna inválida.", 422, { color: "Escolha uma cor disponível." });
    }
    if (body.wipLimit !== null && body.wipLimit !== undefined && body.wipLimit !== "" && wipLimit === null) {
      return fail("Limite de WIP inválido.", 422, { wipLimit: "Use um inteiro entre 1 e 9999." });
    }
    return runBoard(() => addBoardColumn(boardId, {
      name,
      category: asColumnCategory(body.category),
      color: asColumnColor(body.color),
      wipLimit,
    }), 201);
  });
}

export async function PATCH(request: Request, context: Context) {
  const { boardId } = await context.params;
  const body = await readJson(request);
  return withUser(() => {
    const columnIds = Array.isArray(body.columnIds)
      ? body.columnIds.filter((id): id is string => typeof id === "string" && id.length > 0)
      : [];
    if (columnIds.length === 0 || columnIds.length !== (Array.isArray(body.columnIds) ? body.columnIds.length : 0)) {
      return Promise.resolve(fail("Ordem de colunas inválida.", 422, { columnIds: "Envie todas as colunas do workflow." }));
    }
    return runBoard(() => reorderBoardColumns(boardId, columnIds));
  });
}
