import { withUser } from "@/lib/product/api";
import { runBoard } from "@/lib/board/http";
import { archiveBoardProject } from "@/lib/board/store";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ projectId: string }> };

export async function DELETE(_request: Request, context: Context) {
  const { projectId } = await context.params;
  return withUser(() => runBoard(() => archiveBoardProject(projectId)));
}
