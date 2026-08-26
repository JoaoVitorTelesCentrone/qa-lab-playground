import { fail, readJson, withUser } from "@/lib/product/api";
import { runBoard } from "@/lib/board/http";
import { setWorkItemBacklog } from "@/lib/board/store";

export const dynamic = "force-dynamic";
type Context = { params: Promise<{ itemId: string }> };

export async function POST(request: Request, context: Context) {
  const { itemId } = await context.params;
  const body = await readJson(request);
  return withUser(async () => {
    const version = typeof body.expectedVersion === "number" ? body.expectedVersion : Number(body.expectedVersion);
    if (typeof body.inBacklog !== "boolean") return fail("O destino do item é inválido.", 422, { inBacklog: "Informe true ou false." });
    if (!Number.isInteger(version) || version < 1) return fail("A versão do item é inválida.", 422);
    return runBoard(() => setWorkItemBacklog(itemId, body.inBacklog as boolean, version));
  });
}

