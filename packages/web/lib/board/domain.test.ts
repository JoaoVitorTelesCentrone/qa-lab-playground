import { describe, expect, test } from "bun:test";
import { isProjectKey, moveInMemory, normalizeAcceptanceCriteria, normalizeColumnName, normalizeComment, normalizeProjectKey, normalizeProjectName, optionalWipLimit } from "./domain";
import type { BoardWorkItem } from "./types";
import { parseBoardUrlState, serializeBoardUrlState } from "./url-state";
import { isBoardProductPath } from "./access";

const item = (id: string, columnId: string, rank: number): BoardWorkItem => ({
  id,
  projectId: "project",
  boardId: "board",
  columnId,
  key: `QA-${id}`,
  type: "story",
  title: id,
  description: "",
  priority: "medium",
  severity: null,
  storyPoints: null,
  reporterId: "user",
  assigneeId: null,
  rank,
  version: 1,
  inBacklog: false,
  acceptanceCriteria: [],
  dueAt: null,
  createdAt: "2026-08-23T00:00:00Z",
  updatedAt: "2026-08-23T00:00:00Z",
});

describe("domínio do board", () => {
  test("normaliza nome e chave do projeto", () => {
    expect(normalizeProjectName("  Meu   produto  ")).toBe("Meu produto");
    expect(normalizeProjectKey("qa-lab_2026")).toBe("QALAB2026");
    expect(isProjectKey("QA")).toBe(true);
    expect(isProjectKey("1QA")).toBe(false);
  });

  test("move item entre colunas e calcula os vizinhos", () => {
    const items = [item("1", "todo", 1024), item("2", "doing", 1024), item("3", "doing", 2048)];
    const moved = moveInMemory(items, "1", "doing", "3");
    expect(moved.beforeItemId).toBe("2");
    expect(moved.afterItemId).toBe("3");
    expect(moved.items.filter((entry) => entry.columnId === "doing").sort((a, b) => a.rank - b.rank).map((entry) => entry.id)).toEqual(["2", "1", "3"]);
  });

  test("move item para o fim de uma coluna vazia", () => {
    const moved = moveInMemory([item("1", "todo", 1024)], "1", "done", null);
    expect(moved.beforeItemId).toBeNull();
    expect(moved.afterItemId).toBeNull();
    expect(moved.items[0].columnId).toBe("done");
  });

  test("normaliza critérios e comentários nos limites do contrato", () => {
    expect(normalizeAcceptanceCriteria("- Primeiro\n* Segundo\n\nTerceiro")).toEqual(["Primeiro", "Segundo", "Terceiro"]);
    expect(normalizeComment("  contexto importante  ")).toBe("contexto importante");
  });

  test("normaliza configuração de coluna", () => {
    expect(normalizeColumnName("  Em   homologação ")).toBe("Em homologação");
    expect(optionalWipLimit("5")).toBe(5);
    expect(optionalWipLimit("0")).toBeNull();
  });

  test("lê e normaliza o estado compartilhável do board", () => {
    const state = parseBoardUrlState(new URLSearchParams("view=backlog&q=login&type=bug&priority=high&item=QA-42"));
    expect(state).toEqual({ view: "backlog", query: "login", type: "bug", priority: "high", item: "QA-42" });

    const invalid = parseBoardUrlState(new URLSearchParams("view=timeline&type=unknown&priority=urgent"));
    expect(invalid).toEqual({ view: "board", query: "", type: "all", priority: "all", item: null });
  });

  test("serializa somente filtros ativos e preserva outros parâmetros", () => {
    const params = serializeBoardUrlState(new URLSearchParams("source=home&view=backlog&q=old"), {
      view: "board",
      query: "checkout",
      type: "test",
      priority: "all",
      item: "QA-7",
    });
    expect(params.toString()).toBe("source=home&q=checkout&type=test&item=QA-7");
  });

  test("protege as paginas e APIs exclusivas do board", () => {
    expect(isBoardProductPath("/boards")).toBe(true);
    expect(isBoardProductPath("/boards/board-1/items/QA-1")).toBe(true);
    expect(isBoardProductPath("/api/v1/work-items/item-1/move")).toBe(true);
    expect(isBoardProductPath("/api/v1/board-projects")).toBe(true);
    expect(isBoardProductPath("/api/v1/progress")).toBe(false);
    expect(isBoardProductPath("/blog")).toBe(false);
  });
});
