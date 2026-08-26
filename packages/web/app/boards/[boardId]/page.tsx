import { notFound } from "next/navigation";
import { getSessionUser } from "@/lib/product/store";
import { BoardError, getBoardSnapshot } from "@/lib/board/store";
import { BoardClient } from "./board-client";
import { demoBoard } from "@/lib/board/demo";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ boardId: string }> };

export default async function BoardPage({ params }: Props) {
  const { boardId } = await params;
  if (boardId === "demo") return <BoardClient initial={demoBoard} viewerId="demo-viewer" publicDemo />;
  const user = await getSessionUser();
  if (!user) notFound();
  let snapshot;
  try {
    snapshot = await getBoardSnapshot(boardId, user.id);
  } catch (error) {
    if (error instanceof BoardError && error.status === 404) notFound();
    throw error;
  }
  return <BoardClient initial={snapshot} viewerId={user.id} />;
}
