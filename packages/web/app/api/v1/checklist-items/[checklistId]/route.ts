import { fail, readJson, withUser } from "@/lib/product/api";
import { runBoard } from "@/lib/board/http";
import { deleteChecklistItem, setChecklistItem } from "@/lib/board/store";

export const dynamic = "force-dynamic";
type Context = { params: Promise<{ checklistId: string }> };

export async function PATCH(request: Request, context: Context) {
  const { checklistId } = await context.params;
  const body = await readJson(request);
  return withUser(async (user) => {
    if (typeof body.done !== "boolean") return fail("O estado do checklist é inválido.", 422, { done: "Informe true ou false." });
    return runBoard(() => setChecklistItem(checklistId, body.done as boolean, user.id));
  });
}

export async function DELETE(_request: Request, context: Context) {
  const { checklistId } = await context.params;
  return withUser(() => runBoard(() => deleteChecklistItem(checklistId)));
}

