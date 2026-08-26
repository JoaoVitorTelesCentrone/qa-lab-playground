const BOARD_API_PREFIXES = [
  "/api/v1/board-projects",
  "/api/v1/boards",
  "/api/v1/board-columns",
  "/api/v1/work-items",
  "/api/v1/checklist-items",
] as const;

export function isBoardProductPath(pathname: string) {
  if (pathname === "/boards" || pathname.startsWith("/boards/")) return true;
  return BOARD_API_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}
