import { fail, readJson, withUser } from "@/lib/product/api";
import { asWorkItemPriority, asWorkItemType, normalizeDescription, normalizeItemTitle } from "@/lib/board/domain";
import { runBoard } from "@/lib/board/http";
import { createWorkItem } from "@/lib/board/store";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ boardId: string }> };

export async function POST(request: Request, context: Context) {
  const { boardId } = await context.params;
  const body = await readJson(request);
  return withUser(async () => {
    const title = normalizeItemTitle(body.title);
    if (!title) return fail("Informe o título do item.", 422, { title: "Campo obrigatório." });
    return runBoard(() => createWorkItem(boardId, {
      title,
      description: normalizeDescription(body.description),
      type: asWorkItemType(body.type),
      priority: asWorkItemPriority(body.priority),
      inBacklog: body.inBacklog === true,
    }), 201);
  });
}
