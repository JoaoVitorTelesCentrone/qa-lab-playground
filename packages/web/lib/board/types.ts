export const boardKinds = ["kanban", "scrum"] as const;
export const workItemTypes = ["epic", "story", "task", "bug", "test", "subtask"] as const;
export const workItemPriorities = ["lowest", "low", "medium", "high", "highest"] as const;
export const boardColumnCategories = ["todo", "in_progress", "done"] as const;
export const boardColumnColors = ["slate", "blue", "amber", "violet", "green", "coral"] as const;

export type BoardKind = (typeof boardKinds)[number];
export type WorkItemType = (typeof workItemTypes)[number];
export type WorkItemPriority = (typeof workItemPriorities)[number];
export type BoardColumnCategory = (typeof boardColumnCategories)[number];
export type BoardColumnColor = (typeof boardColumnColors)[number];
export type BoardRole = "owner" | "admin" | "member" | "viewer";

export type BoardSummary = {
  id: string;
  name: string;
  kind: BoardKind;
  project: { id: string; name: string; key: string };
};

export type BoardColumn = {
  id: string;
  name: string;
  position: number;
  category: BoardColumnCategory;
  color: BoardColumnColor;
  wipLimit: number | null;
  isInitial: boolean;
  isFinal: boolean;
};

export type BoardWorkItem = {
  id: string;
  projectId: string;
  boardId: string;
  columnId: string;
  key: string;
  type: WorkItemType;
  title: string;
  description: string;
  priority: WorkItemPriority;
  severity: "low" | "medium" | "high" | "critical" | null;
  storyPoints: number | null;
  reporterId: string;
  assigneeId: string | null;
  rank: number;
  version: number;
  inBacklog: boolean;
  acceptanceCriteria: string[];
  dueAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BoardComment = {
  id: string;
  workItemId: string;
  authorId: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

export type BoardChecklistItem = {
  id: string;
  workItemId: string;
  text: string;
  position: number;
  done: boolean;
  createdBy: string;
  completedBy: string | null;
  completedAt: string | null;
};

export type BoardWorkItemEvent = {
  id: number;
  workItemId: string;
  actorId: string;
  eventType: "created" | "updated" | "moved" | "archived" | string;
  payload: Record<string, unknown>;
  createdAt: string;
};

export type BoardWorkItemDetail = {
  item: BoardWorkItem;
  comments: BoardComment[];
  checklist: BoardChecklistItem[];
  events: BoardWorkItemEvent[];
};

export type BoardSnapshot = {
  board: BoardSummary;
  columns: BoardColumn[];
  items: BoardWorkItem[];
  viewerRole: BoardRole;
};

export type CreateBoardProjectInput = {
  name: string;
  key: string;
  boardName?: string;
  kind?: BoardKind;
};

export type CreateWorkItemInput = {
  title: string;
  type: WorkItemType;
  priority: WorkItemPriority;
  description?: string;
  inBacklog?: boolean;
};

export type MoveWorkItemInput = {
  itemId: string;
  toColumnId: string;
  beforeItemId: string | null;
  afterItemId: string | null;
  expectedVersion: number;
};

export type UpdateWorkItemInput = {
  expectedVersion: number;
  title: string;
  description: string;
  type: WorkItemType;
  priority: WorkItemPriority;
  severity: BoardWorkItem["severity"];
  storyPoints: number | null;
  dueAt: string | null;
  acceptanceCriteria: string[];
};
