import { withUser } from "@/lib/product/api";
import { runBoard } from "@/lib/board/http";
import { archiveBoard, getBoardSnapshot } from "@/lib/board/store";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ boardId: string }> };

export async function GET(_request: Request, context: Context) {
  const { boardId } = await context.params;
  return withUser((user) => runBoard(() => getBoardSnapshot(boardId, user.id)));
}

export async function DELETE(_request: Request, context: Context) {
  const { boardId } = await context.params;
  return withUser(() => runBoard(() => archiveBoard(boardId)));
}
