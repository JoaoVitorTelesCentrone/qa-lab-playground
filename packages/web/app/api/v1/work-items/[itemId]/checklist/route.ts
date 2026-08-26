import { fail, readJson, withUser } from "@/lib/product/api";
import { normalizeChecklistText } from "@/lib/board/domain";
import { runBoard } from "@/lib/board/http";
import { addChecklistItem } from "@/lib/board/store";

export const dynamic = "force-dynamic";
type Context = { params: Promise<{ itemId: string }> };

export async function POST(request: Request, context: Context) {
  const { itemId } = await context.params;
  const body = await readJson(request);
  return withUser(async () => {
    const text = normalizeChecklistText(body.text);
    if (!text) return fail("Informe o item do checklist.", 422, { text: "Campo obrigatório." });
    return runBoard(() => addChecklistItem(itemId, text), 201);
  });
}

