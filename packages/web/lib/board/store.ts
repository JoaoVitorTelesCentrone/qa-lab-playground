import { createClient } from "@/lib/supabase/server";
import type {
  BoardColumn,
  BoardChecklistItem,
  BoardColumnCategory,
  BoardColumnColor,
  BoardComment,
  BoardSnapshot,
  BoardSummary,
  BoardWorkItem,
  BoardWorkItemDetail,
  BoardWorkItemEvent,
  CreateBoardProjectInput,
  CreateWorkItemInput,
  MoveWorkItemInput,
  UpdateWorkItemInput,
} from "./types";

type DbError = { code?: string; message?: string; details?: string | null } | null;
type UnknownRow = Record<string, unknown>;

export class BoardError extends Error {
  constructor(message: string, readonly status = 500, readonly code = "BOARD_ERROR") {
    super(message);
  }
}

function firstRelation(value: unknown): UnknownRow | null {
  if (Array.isArray(value)) return value[0] && typeof value[0] === "object" ? value[0] as UnknownRow : null;
  return value && typeof value === "object" ? value as UnknownRow : null;
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asNullableString(value: unknown) {
  return typeof value === "string" ? value : null;
}

function asNumber(value: unknown) {
  return typeof value === "number" ? value : Number(value ?? 0);
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : [];
}

function mapSummary(row: UnknownRow): BoardSummary {
  const project = firstRelation(row.board_projects);
  if (!project) throw new BoardError("Projeto do board não encontrado.", 500, "INVALID_BOARD_DATA");
  return {
    id: asString(row.id),
    name: asString(row.name),
    kind: row.kind === "scrum" ? "scrum" : "kanban",
    project: { id: asString(project.id), name: asString(project.name), key: asString(project.key) },
  };
}

function mapColumn(row: UnknownRow): BoardColumn {
  const category = row.category === "done" ? "done" : row.category === "in_progress" ? "in_progress" : "todo";
  return {
    id: asString(row.id),
    name: asString(row.name),
    position: asNumber(row.position),
    category,
    color: (["slate", "blue", "amber", "violet", "green", "coral"].includes(asString(row.color)) ? asString(row.color) : "slate") as BoardColumnColor,
    wipLimit: row.wip_limit == null ? null : asNumber(row.wip_limit),
    isInitial: row.is_initial === true,
    isFinal: row.is_final === true,
  };
}

export function mapWorkItem(row: UnknownRow): BoardWorkItem {
  const allowedTypes = new Set(["epic", "story", "task", "bug", "test", "subtask"]);
  const allowedPriorities = new Set(["lowest", "low", "medium", "high", "highest"]);
  const severity = ["low", "medium", "high", "critical"].includes(asString(row.severity)) ? asString(row.severity) as BoardWorkItem["severity"] : null;
  return {
    id: asString(row.id),
    projectId: asString(row.project_id),
    boardId: asString(row.board_id),
    columnId: asString(row.column_id),
    key: asString(row.key),
    type: allowedTypes.has(asString(row.type)) ? asString(row.type) as BoardWorkItem["type"] : "story",
    title: asString(row.title),
    description: asString(row.description),
    priority: allowedPriorities.has(asString(row.priority)) ? asString(row.priority) as BoardWorkItem["priority"] : "medium",
    severity,
    storyPoints: row.story_points == null ? null : asNumber(row.story_points),
    reporterId: asString(row.reporter_id),
    assigneeId: asNullableString(row.assignee_id),
    rank: asNumber(row.rank),
    version: asNumber(row.version),
    inBacklog: row.in_backlog === true,
    acceptanceCriteria: asStringArray(row.acceptance_criteria),
    dueAt: asNullableString(row.due_at),
    createdAt: asString(row.created_at),
    updatedAt: asString(row.updated_at),
  };
}

function mapComment(row: UnknownRow): BoardComment {
  return {
    id: asString(row.id),
    workItemId: asString(row.work_item_id),
    authorId: asString(row.author_id),
    body: asString(row.body),
    createdAt: asString(row.created_at),
    updatedAt: asString(row.updated_at),
  };
}

function mapChecklist(row: UnknownRow): BoardChecklistItem {
  return {
    id: asString(row.id),
    workItemId: asString(row.work_item_id),
    text: asString(row.text),
    position: asNumber(row.position),
    done: row.done === true,
    createdBy: asString(row.created_by),
    completedBy: asNullableString(row.completed_by),
    completedAt: asNullableString(row.completed_at),
  };
}

function mapEvent(row: UnknownRow): BoardWorkItemEvent {
  return {
    id: asNumber(row.id),
    workItemId: asString(row.work_item_id),
    actorId: asString(row.actor_id),
    eventType: asString(row.event_type),
    payload: asRecord(row.payload),
    createdAt: asString(row.created_at),
  };
}

function fromDbError(error: DbError): BoardError {
  const raw = `${error?.code ?? ""} ${error?.message ?? ""} ${error?.details ?? ""}`;
  if (raw.includes("42P01") || raw.includes("42883") || raw.includes("PGRST202") || raw.includes("PGRST205") || raw.includes("schema cache") || raw.includes("does not exist")) {
    return new BoardError("O Board V2 ainda não está disponível: aplique as migrações 0016 a 0021 do board.", 503, "BOARD_UNAVAILABLE");
  }
  if (raw.includes("PRO_REQUIRED")) return new BoardError("O Board é exclusivo dos planos Pro e Team.", 403, "PRO_REQUIRED");
  if (raw.includes("PROJECT_KEY_TAKEN") || raw.includes("23505")) return new BoardError("Esta chave de projeto já está em uso.", 409, "PROJECT_KEY_TAKEN");
  if (raw.includes("VERSION_CONFLICT")) return new BoardError("Este item foi alterado em outra sessão. Atualize o board e tente novamente.", 409, "VERSION_CONFLICT");
  if (raw.includes("COLUMN_NOT_EMPTY")) return new BoardError("Mova ou arquive os itens desta coluna antes de removê-la.", 409, "COLUMN_NOT_EMPTY");
  if (raw.includes("PROTECTED_COLUMN")) return new BoardError("As colunas inicial e final do workflow não podem ser removidas.", 409, "PROTECTED_COLUMN");
  if (raw.includes("FORBIDDEN")) return new BoardError("Você não tem permissão para alterar este board.", 403, "FORBIDDEN");
  if (raw.includes("NOT_FOUND")) return new BoardError("Board ou item não encontrado.", 404, "NOT_FOUND");
  if (raw.includes("INVALID_")) return new BoardError("Os dados enviados não atendem às regras do board.", 422, "VALIDATION_ERROR");
  return new BoardError(error?.message ?? "Não foi possível concluir a operação no board.");
}

export async function listBoards(): Promise<BoardSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("boards")
    .select("id,name,kind,project_id,board_projects!inner(id,name,key)")
    .eq("status", "active")
    .order("updated_at", { ascending: false });
  if (error) throw fromDbError(error);
  return (data ?? []).map((row) => mapSummary(row as UnknownRow));
}

export async function getBoardSnapshot(boardId: string, viewerId?: string): Promise<BoardSnapshot> {
  const supabase = await createClient();
  const boardQuery = supabase
    .from("boards")
    .select("id,name,kind,project_id,board_projects!inner(id,name,key)")
    .eq("id", boardId)
    .eq("status", "active")
    .maybeSingle();
  const columnsQuery = supabase
    .from("board_columns")
    .select("id,name,position,category,color,wip_limit,is_initial,is_final")
    .eq("board_id", boardId)
    .eq("active", true)
    .order("position");
  const itemsQuery = supabase
    .from("board_work_items")
    .select("id,project_id,board_id,column_id,key,type,title,description,priority,severity,story_points,reporter_id,assignee_id,rank,version,in_backlog,acceptance_criteria,due_at,created_at,updated_at")
    .eq("board_id", boardId)
    .is("archived_at", null)
    .order("rank");

  const [boardResult, columnsResult, itemsResult] = await Promise.all([boardQuery, columnsQuery, itemsQuery]);
  if (boardResult.error) throw fromDbError(boardResult.error);
  if (!boardResult.data) throw new BoardError("Board não encontrado.", 404, "NOT_FOUND");
  if (columnsResult.error) throw fromDbError(columnsResult.error);
  if (itemsResult.error) throw fromDbError(itemsResult.error);

  const project = firstRelation((boardResult.data as UnknownRow).board_projects);
  let viewerRole: BoardSnapshot["viewerRole"] = "viewer";
  if (viewerId && project) {
    const membership = await supabase.from("board_members").select("role").eq("project_id", asString(project.id)).eq("user_id", viewerId).eq("status", "active").maybeSingle();
    if (membership.error) throw fromDbError(membership.error);
    if (["owner", "admin", "member", "viewer"].includes(membership.data?.role ?? "")) viewerRole = membership.data!.role as BoardSnapshot["viewerRole"];
  }

  return {
    board: mapSummary(boardResult.data as UnknownRow),
    columns: (columnsResult.data ?? []).map((row) => mapColumn(row as UnknownRow)),
    items: (itemsResult.data ?? []).map((row) => mapWorkItem(row as UnknownRow)),
    viewerRole,
  };
}

export async function addBoardColumn(boardId: string, input: { name: string; category: BoardColumnCategory; color: BoardColumnColor; wipLimit: number | null }) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("add_board_column", { p_board_id: boardId, p_name: input.name, p_category: input.category, p_color: input.color, p_wip_limit: input.wipLimit });
  if (error) throw fromDbError(error);
  return mapColumn((data ?? {}) as UnknownRow);
}

export async function updateBoardColumn(columnId: string, input: { name: string; category: BoardColumnCategory; color: BoardColumnColor; wipLimit: number | null }) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("update_board_column", { p_column_id: columnId, p_name: input.name, p_category: input.category, p_color: input.color, p_wip_limit: input.wipLimit });
  if (error) throw fromDbError(error);
  return mapColumn((data ?? {}) as UnknownRow);
}

export async function reorderBoardColumns(boardId: string, columnIds: string[]) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("reorder_board_columns", { p_board_id: boardId, p_column_ids: columnIds });
  if (error) throw fromDbError(error);
  return Array.isArray(data) ? data.map((row) => mapColumn(row as UnknownRow)) : [];
}

export async function archiveBoardColumn(columnId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("archive_board_column", { p_column_id: columnId });
  if (error) throw fromDbError(error);
  return mapColumn((data ?? {}) as UnknownRow);
}

export async function createBoardProject(input: CreateBoardProjectInput) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_board_project", {
    p_name: input.name,
    p_key: input.key,
    p_board_name: input.boardName ?? "Board principal",
    p_kind: input.kind ?? "kanban",
  });
  if (error) throw fromDbError(error);
  const result = data && typeof data === "object" ? data as UnknownRow : {};
  return { projectId: asString(result.projectId), boardId: asString(result.boardId) };
}

export async function ensurePersonalBoard() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("ensure_personal_board");
  if (error) throw fromDbError(error);
  const result = data && typeof data === "object" ? data as UnknownRow : {};
  return {
    projectId: asString(result.projectId),
    boardId: asString(result.boardId),
    created: result.created === true,
  };
}

export async function archiveBoard(boardId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("archive_board", { p_board_id: boardId });
  if (error) throw fromDbError(error);
  const result = data && typeof data === "object" ? data as UnknownRow : {};
  return {
    id: asString(result.id),
    projectId: asString(result.projectId),
    status: "archived" as const,
    projectArchived: result.projectArchived === true,
  };
}

export async function archiveBoardProject(projectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("archive_board_project", { p_project_id: projectId });
  if (error) throw fromDbError(error);
  const result = data && typeof data === "object" ? data as UnknownRow : {};
  return { id: asString(result.id), status: "archived" as const };
}

export async function createWorkItem(boardId: string, input: CreateWorkItemInput) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_board_work_item", {
    p_board_id: boardId,
    p_title: input.title,
    p_type: input.type,
    p_priority: input.priority,
    p_description: input.description ?? "",
    p_in_backlog: input.inBacklog ?? false,
  });
  if (error) throw fromDbError(error);
  return mapWorkItem((data ?? {}) as UnknownRow);
}

export async function moveWorkItem(input: MoveWorkItemInput) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("move_board_work_item", {
    p_item_id: input.itemId,
    p_to_column_id: input.toColumnId,
    p_before_item_id: input.beforeItemId,
    p_after_item_id: input.afterItemId,
    p_expected_version: input.expectedVersion,
  });
  if (error) throw fromDbError(error);
  return mapWorkItem((data ?? {}) as UnknownRow);
}

const WORK_ITEM_COLUMNS = "id,project_id,board_id,column_id,key,type,title,description,priority,severity,story_points,reporter_id,assignee_id,rank,version,in_backlog,acceptance_criteria,due_at,created_at,updated_at";

export async function getWorkItemDetail(itemId: string): Promise<BoardWorkItemDetail> {
  const supabase = await createClient();
  const [itemResult, commentsResult, checklistResult, eventsResult] = await Promise.all([
    supabase.from("board_work_items").select(WORK_ITEM_COLUMNS).eq("id", itemId).is("archived_at", null).maybeSingle(),
    supabase.from("board_work_item_comments").select("id,work_item_id,author_id,body,created_at,updated_at").eq("work_item_id", itemId).is("deleted_at", null).order("created_at"),
    supabase.from("board_work_item_checklist").select("id,work_item_id,text,position,done,created_by,completed_by,completed_at").eq("work_item_id", itemId).order("position"),
    supabase.from("board_work_item_events").select("id,work_item_id,actor_id,event_type,payload,created_at").eq("work_item_id", itemId).order("created_at", { ascending: false }).limit(100),
  ]);
  if (itemResult.error) throw fromDbError(itemResult.error);
  if (!itemResult.data) throw new BoardError("Item não encontrado.", 404, "NOT_FOUND");
  if (commentsResult.error) throw fromDbError(commentsResult.error);
  if (checklistResult.error) throw fromDbError(checklistResult.error);
  if (eventsResult.error) throw fromDbError(eventsResult.error);
  return {
    item: mapWorkItem(itemResult.data as UnknownRow),
    comments: (commentsResult.data ?? []).map((row) => mapComment(row as UnknownRow)),
    checklist: (checklistResult.data ?? []).map((row) => mapChecklist(row as UnknownRow)),
    events: (eventsResult.data ?? []).map((row) => mapEvent(row as UnknownRow)),
  };
}

export async function updateWorkItem(itemId: string, input: UpdateWorkItemInput) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("update_board_work_item", {
    p_item_id: itemId,
    p_expected_version: input.expectedVersion,
    p_title: input.title,
    p_description: input.description,
    p_type: input.type,
    p_priority: input.priority,
    p_severity: input.severity,
    p_story_points: input.storyPoints,
    p_due_at: input.dueAt,
    p_acceptance_criteria: input.acceptanceCriteria,
  });
  if (error) throw fromDbError(error);
  return mapWorkItem((data ?? {}) as UnknownRow);
}

export async function archiveWorkItem(itemId: string, expectedVersion: number) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("archive_board_work_item", { p_item_id: itemId, p_expected_version: expectedVersion });
  if (error) throw fromDbError(error);
  return mapWorkItem((data ?? {}) as UnknownRow);
}

export async function setWorkItemBacklog(itemId: string, inBacklog: boolean, expectedVersion: number) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("set_board_work_item_backlog", {
    p_item_id: itemId,
    p_in_backlog: inBacklog,
    p_expected_version: expectedVersion,
  });
  if (error) throw fromDbError(error);
  return mapWorkItem((data ?? {}) as UnknownRow);
}

export async function addWorkItemComment(itemId: string, body: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("add_board_comment", { p_item_id: itemId, p_body: body });
  if (error) throw fromDbError(error);
  return mapComment((data ?? {}) as UnknownRow);
}

export async function addChecklistItem(itemId: string, text: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("add_board_checklist_item", { p_item_id: itemId, p_text: text });
  if (error) throw fromDbError(error);
  return mapChecklist((data ?? {}) as UnknownRow);
}

export async function setChecklistItem(checklistId: string, done: boolean, actorId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("board_work_item_checklist").update({
    done,
    completed_by: done ? actorId : null,
    completed_at: done ? new Date().toISOString() : null,
  }).eq("id", checklistId).select("id,work_item_id,text,position,done,created_by,completed_by,completed_at").maybeSingle();
  if (error) throw fromDbError(error);
  if (!data) throw new BoardError("Item de checklist não encontrado.", 404, "NOT_FOUND");
  return mapChecklist(data as UnknownRow);
}

export async function deleteChecklistItem(checklistId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("board_work_item_checklist").delete().eq("id", checklistId).select("id").maybeSingle();
  if (error) throw fromDbError(error);
  if (!data) throw new BoardError("Item de checklist não encontrado.", 404, "NOT_FOUND");
  return { id: asString(data.id) };
}
