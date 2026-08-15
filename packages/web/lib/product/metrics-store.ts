// Leitura da telemetria para o painel de métricas.
//
// É a única parte do produto que lê linhas de outras contas, e por isso tem
// duas travas: a chave de serviço precisa estar configurada e o e-mail
// precisa estar em QALAB_ADMIN_EMAILS. Sem as duas, o painel não abre.

import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";
import { buildMetrics, type ActivityEvent, type Metrics } from "./metrics";

/** E-mails autorizados a ver números do produto inteiro. Vazio = ninguém. */
export function isAdmin(email: string) {
  const allowed = (process.env.QALAB_ADMIN_EMAILS ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  return allowed.length > 0 && allowed.includes(email.trim().toLowerCase());
}

export function metricsAvailable() {
  return hasServiceRole();
}

export async function loadMetrics(days = 30): Promise<Metrics> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("activity_events")
    .select("name,user_id,props,created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: true })
    .limit(20000);
  if (error) throw new Error(error.message);

  const events: ActivityEvent[] = (data ?? []).map((row) => ({
    name: row.name,
    userId: row.user_id,
    createdAt: row.created_at,
    props: (row.props ?? {}) as Record<string, unknown>,
  }));
  return buildMetrics(events);
}
