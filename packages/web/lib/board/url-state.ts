import { workItemPriorities, workItemTypes, type WorkItemPriority, type WorkItemType } from "./types";

export type BoardView = "board" | "backlog";
export type BoardTypeFilter = "all" | WorkItemType;
export type BoardPriorityFilter = "all" | WorkItemPriority;

export type BoardUrlState = {
  view: BoardView;
  query: string;
  type: BoardTypeFilter;
  priority: BoardPriorityFilter;
  item: string | null;
};

export function parseBoardUrlState(params: Pick<URLSearchParams, "get">): BoardUrlState {
  const type = params.get("type");
  const priority = params.get("priority");
  const item = params.get("item")?.trim().slice(0, 180) || null;

  return {
    view: params.get("view") === "backlog" ? "backlog" : "board",
    query: (params.get("q") ?? "").slice(0, 180),
    type: type && (workItemTypes as readonly string[]).includes(type) ? type as WorkItemType : "all",
    priority: priority && (workItemPriorities as readonly string[]).includes(priority) ? priority as WorkItemPriority : "all",
    item,
  };
}

export function serializeBoardUrlState(current: URLSearchParams, state: BoardUrlState) {
  const params = new URLSearchParams(current);
  setOptional(params, "view", state.view === "backlog" ? state.view : "");
  setOptional(params, "q", state.query);
  setOptional(params, "type", state.type === "all" ? "" : state.type);
  setOptional(params, "priority", state.priority === "all" ? "" : state.priority);
  setOptional(params, "item", state.item ?? "");
  return params;
}

function setOptional(params: URLSearchParams, key: string, value: string) {
  if (value) params.set(key, value);
  else params.delete(key);
}
