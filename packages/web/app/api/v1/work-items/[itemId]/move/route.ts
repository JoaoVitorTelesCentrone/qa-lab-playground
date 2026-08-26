import { fail, readJson, withUser } from "@/lib/product/api";
import { runBoard } from "@/lib/board/http";
import { moveWorkItem } from "@/lib/board/store";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ itemId: string }> };

function optionalId(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

export async function POST(request: Request, context: Context) {
  const { itemId } = await context.params;
  const body = await readJson(request);
  return withUser(async () => {
    const toColumnId = optionalId(body.toColumnId);
    const expectedVersion = typeof body.expectedVersion === "number" ? body.expectedVersion : Number(body.expectedVersion);
    if (!toColumnId) return fail("Informe a coluna de destino.", 422, { toColumnId: "Campo obrigatório." });
    if (!Number.isInteger(expectedVersion) || expectedVersion < 1) return fail("A versão do item é inválida.", 422, { expectedVersion: "Informe um inteiro positivo." });
    return runBoard(() => moveWorkItem({
      itemId,
      toColumnId,
      beforeItemId: optionalId(body.beforeItemId),
      afterItemId: optionalId(body.afterItemId),
      expectedVersion,
    }));
  });
}
