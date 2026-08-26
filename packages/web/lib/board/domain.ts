import { boardColumnCategories, boardColumnColors, boardKinds, workItemPriorities, workItemTypes, type BoardColumnCategory, type BoardColumnColor, type BoardKind, type BoardWorkItem, type WorkItemPriority, type WorkItemType } from "./types";

export const BOARD_LIMITS = {
  projectName: 100,
  projectKey: 10,
  boardName: 100,
  itemTitle: 180,
  itemDescription: 10_000,
} as const;

export function normalizeProjectName(value: unknown) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, BOARD_LIMITS.projectName) : "";
}

export function normalizeProjectKey(value: unknown) {
  return typeof value === "string" ? value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, BOARD_LIMITS.projectKey) : "";
}

export function isProjectKey(value: string) {
  return /^[A-Z][A-Z0-9]{1,9}$/.test(value);
}

export function normalizeItemTitle(value: unknown) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, BOARD_LIMITS.itemTitle) : "";
}

export function normalizeDescription(value: unknown) {
  return typeof value === "string" ? value.replace(/\r\n/g, "\n").trim().slice(0, BOARD_LIMITS.itemDescription) : "";
}

export function normalizeAcceptanceCriteria(value: unknown) {
  const entries = Array.isArray(value) ? value : typeof value === "string" ? value.split("\n") : [];
  return entries
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim().replace(/^[-*]\s*/, "").slice(0, 500))
    .filter(Boolean)
    .slice(0, 20);
}

export function normalizeComment(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, 4000) : "";
}

export function normalizeChecklistText(value: unknown) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, 300) : "";
}

export function optionalStoryPoints(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 9999 ? parsed : null;
}

export function optionalSeverity(value: unknown): BoardWorkItem["severity"] {
  return typeof value === "string" && ["low", "medium", "high", "critical"].includes(value) ? value as BoardWorkItem["severity"] : null;
}

export function normalizeColumnName(value: unknown) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, 60) : "";
}

export function asColumnCategory(value: unknown): BoardColumnCategory {
  return typeof value === "string" && (boardColumnCategories as readonly string[]).includes(value) ? value as BoardColumnCategory : "in_progress";
}

export function asColumnColor(value: unknown): BoardColumnColor {
  return typeof value === "string" && (boardColumnColors as readonly string[]).includes(value) ? value as BoardColumnColor : "slate";
}

export function optionalWipLimit(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 9999 ? parsed : null;
}

export function asBoardKind(value: unknown): BoardKind {
  return typeof value === "string" && (boardKinds as readonly string[]).includes(value) ? value as BoardKind : "kanban";
}

export function asWorkItemType(value: unknown): WorkItemType {
  return typeof value === "string" && (workItemTypes as readonly string[]).includes(value) ? value as WorkItemType : "story";
}

export function asWorkItemPriority(value: unknown): WorkItemPriority {
  return typeof value === "string" && (workItemPriorities as readonly string[]).includes(value) ? value as WorkItemPriority : "medium";
}

export function moveInMemory(
  items: BoardWorkItem[],
  itemId: string,
  toColumnId: string,
  overItemId: string | null,
) {
  const moving = items.find((item) => item.id === itemId);
  if (!moving) return { items, beforeItemId: null, afterItemId: null };

  const remaining = items.filter((item) => item.id !== itemId);
  const target = remaining
    .filter((item) => item.columnId === toColumnId)
    .sort((a, b) => a.rank - b.rank);
  const targetIndex = overItemId ? target.findIndex((item) => item.id === overItemId) : target.length;
  const insertAt = targetIndex < 0 ? target.length : targetIndex;
  const optimistic = { ...moving, columnId: toColumnId };
  target.splice(insertAt, 0, optimistic);

  const beforeItemId = target[insertAt - 1]?.id ?? null;
  const afterItemId = target[insertAt + 1]?.id ?? null;
  const targetIds = new Set(target.map((item) => item.id));
  const next = [
    ...remaining.filter((item) => !targetIds.has(item.id)),
    ...target.map((item, index) => ({ ...item, rank: (index + 1) * 1024 })),
  ];

  return { items: next, beforeItemId, afterItemId };
}
