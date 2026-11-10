/**
 * Modo bugado padronizado por query param. Todo Lab com defeito plantado aceita:
 * - `?bug=1` (ou `true`/`on`): liga o bug padrão do Lab;
 * - `?bug=<id>`: liga um bug específico (os ids antigos continuam valendo);
 * - sem `?bug`, `?bug=0` ou `?bug=false`: modo correto.
 */
export function resolveBug(param: string | null | undefined, defaultBug: string): string | null {
  const value = param?.trim().toLowerCase();
  if (!value || value === "0" || value === "false" || value === "off") return null;
  if (value === "1" || value === "true" || value === "on") return defaultBug;
  return param!.trim();
}

/** Mesma URL com o modo bugado ligado (`?bug=1`) ou desligado, preservando os outros parâmetros. */
export function bugModeHref(pathname: string, search: string, on: boolean) {
  const params = new URLSearchParams(search);
  if (on) params.set("bug", "1"); else params.delete("bug");
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
