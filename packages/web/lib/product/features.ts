/**
 * Feature flags do produto. Um ponto único: proxy, navegação e páginas leem daqui.
 *
 * `FEATURE_MENTORSHIP` vem do ambiente e é embutida no build (ver `env` em
 * next.config.ts), então vale igual no servidor, no proxy e nos componentes de
 * cliente. Mudar o valor exige um novo build/deploy.
 *
 * Desligada (padrão): a mentoria, os planos pagos e o checkout somem da
 * experiência pública e as rotas respondem 404. Código e tabelas continuam
 * intactos; ligar a flag traz tudo de volta.
 */
export const MENTORSHIP_ENABLED = process.env.FEATURE_MENTORSHIP === "true";

/** Rotas que só existem com a mentoria ligada (páginas e APIs). */
const MENTORSHIP_PREFIXES = [
  "/mentoria",
  "/planos",
  "/cursos",
  "/api/v1/mentorship",
  "/api/billing",
  "/api/cron/mentorship-emails",
];

/**
 * Bancadas de prática que moram sob /mentoria por razão histórica, mas são
 * usadas por Labs públicos (159–164 e os Labs do Broto). Continuam abertas.
 */
const PRACTICE_UNDER_MENTORSHIP = ["/mentoria/labs", "/mentoria/performance"];

const under = (pathname: string, prefix: string) => pathname === prefix || pathname.startsWith(`${prefix}/`);

/** A rota pertence à mentoria (e portanto fica fechada com a flag desligada)? */
export function isMentorshipPath(pathname: string) {
  if (PRACTICE_UNDER_MENTORSHIP.some((prefix) => under(pathname, prefix))) return false;
  if (/^\/portfolio\/[^/]+\/mentoria(\/|$)/.test(pathname)) return true;
  return MENTORSHIP_PREFIXES.some((prefix) => under(pathname, prefix));
}
