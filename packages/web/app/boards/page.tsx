import { redirect } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { getSessionUser } from "@/lib/product/store";
import { BoardError, ensurePersonalBoard, listBoards } from "@/lib/board/store";
import { BoardsIndexClient } from "./boards-index-client";
import { BoardClient } from "./[boardId]/board-client";
import { demoBoard } from "@/lib/board/demo";

export const metadata = { title: "Boards" };
export const dynamic = "force-dynamic";

export default async function BoardsPage() {
  const user = await getSessionUser();
  if (!user) return <BoardClient initial={demoBoard} viewerId="demo-viewer" publicDemo />;

  let boards;
  let personalBoard;
  let unavailable: BoardError | null = null;
  try {
    personalBoard = await ensurePersonalBoard();
    boards = await listBoards();
  } catch (error) {
    if (!(error instanceof BoardError)) throw error;
    if (error.code === "PRO_REQUIRED") return <BoardClient initial={demoBoard} viewerId={user.id} publicDemo />;
    if (error.code !== "BOARD_UNAVAILABLE") throw error;
    unavailable = error;
  }
  if (unavailable) return <main className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
      <section className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
        <LayoutDashboard className="mx-auto size-8 text-muted-foreground" />
        <h1 className="mt-5 text-2xl font-bold">Board pronto no código</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{unavailable.message}</p>
        <code className="mt-5 inline-block rounded-md bg-muted px-3 py-2 text-xs">packages/web/supabase/migrations/0016 a 0021</code>
      </section>
    </main>;
  if (personalBoard?.created) redirect(`/boards/${personalBoard.boardId}`);
  return <BoardsIndexClient initialBoards={boards ?? []} />;
}
