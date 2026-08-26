import { fail, readJson, withUser } from "@/lib/product/api";
import { runBoard } from "@/lib/board/http";
import { asBoardKind, isProjectKey, normalizeProjectKey, normalizeProjectName } from "@/lib/board/domain";
import { createBoardProject, listBoards } from "@/lib/board/store";

export const dynamic = "force-dynamic";

export function GET() {
  return withUser(() => runBoard(() => listBoards()));
}

export async function POST(request: Request) {
  const body = await readJson(request);
  return withUser(async () => {
    const name = normalizeProjectName(body.name);
    const key = normalizeProjectKey(body.key);
    const boardName = normalizeProjectName(body.boardName) || "Board principal";
    if (!name) return fail("Informe o nome do projeto.", 422, { name: "Campo obrigatório." });
    if (!isProjectKey(key)) return fail("Use uma chave com 2 a 10 letras ou números, começando por letra.", 422, { key: "Exemplo: QALAB." });
    return runBoard(() => createBoardProject({ name, key, boardName, kind: asBoardKind(body.kind) }), 201);
  });
}
