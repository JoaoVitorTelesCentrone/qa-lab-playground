import { fail, readJson, withUser } from "@/lib/product/api";
import { normalizeComment } from "@/lib/board/domain";
import { runBoard } from "@/lib/board/http";
import { addWorkItemComment } from "@/lib/board/store";

export const dynamic = "force-dynamic";
type Context = { params: Promise<{ itemId: string }> };

export async function POST(request: Request, context: Context) {
  const { itemId } = await context.params;
  const body = await readJson(request);
  return withUser(async () => {
    const comment = normalizeComment(body.body);
    if (!comment) return fail("Escreva um comentário.", 422, { body: "Campo obrigatório." });
    return runBoard(() => addWorkItemComment(itemId, comment), 201);
  });
}

