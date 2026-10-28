const AUTHENTICATED_ROUTE_PREFIXES = ["/mentoria", "/boards", "/lab/bdd"] as const;

export function requiresAuthentication(pathname: string) {
  return AUTHENTICATED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function requestedPath(pathname: string, search: string) {
  return `${pathname}${search}`;
}
