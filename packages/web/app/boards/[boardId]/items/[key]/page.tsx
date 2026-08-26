import { redirect } from "next/navigation";

type Props = { params: Promise<{ boardId: string; key: string }> };

export default async function BoardItemDeepLinkPage({ params }: Props) {
  const { boardId, key } = await params;
  redirect(`/boards/${encodeURIComponent(boardId)}?item=${encodeURIComponent(key)}`);
}
