import { ACCOUNTS_ENABLED } from "@/lib/product/features";

const AUTHENTICATED_ROUTE_PREFIXES = [
  "/mentoria/admin",
  "/mentoria/app",
  "/mentoria/diagnostico",
  "/mentoria/encontros",
  "/mentoria/inscricao/status",
  "/mentoria/mentor",
  "/mentoria/semanas",
] as const;

export function requiresAuthentication(pathname: string) {
  if (pathname === "/boards" || pathname === "/lab/bdd") return ACCOUNTS_ENABLED;
  if (pathname.startsWith("/boards/")) return true;
  return AUTHENTICATED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function requestedPath(pathname: string, search: string) {
  return `${pathname}${search}`;
}
