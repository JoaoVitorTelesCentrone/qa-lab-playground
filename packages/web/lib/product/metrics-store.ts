// Leitura da telemetria para o painel de métricas.
//
// É a única parte do produto que lê linhas de outras contas, e por isso tem
// duas travas: a chave de serviço precisa estar configurada e o e-mail
// precisa estar em QALAB_ADMIN_EMAILS. Sem as duas, o painel não abre.

import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";
import { buildMetrics, type ActivityEvent, type Metrics, type Signup } from "./metrics";
import { CHALLENGE_KIND, validChallengeDeliverables } from "@/lib/challenge-account";
import { isChallengeReady } from "@/lib/challenge-deliverables";

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
  const pageSize = 500;
  const [events, signups, challengeEvidence] = await Promise.all([
    (async () => {
      const all: ActivityEvent[] = [];
      for (let offset = 0; ; offset += pageSize) {
        const { data, error } = await supabase.from("activity_events")
          .select("id,name,user_id,props,created_at").gte("created_at", since)
          .order("created_at", { ascending: true }).order("id", { ascending: true })
          .range(offset, offset + pageSize - 1);
        if (error) throw new Error(error.message);
        all.push(...(data ?? []).map((row) => ({ name: row.name, userId: row.user_id, createdAt: row.created_at, props: (row.props ?? {}) as Record<string, unknown> })));
        if ((data?.length ?? 0) < pageSize) return all;
      }
    })(),
    (async () => {
      const all: Signup[] = [];
      for (let offset = 0; ; offset += pageSize) {
        const { data, error } = await supabase.from("profiles")
          .select("id,created_at").gte("created_at", since)
          .order("created_at", { ascending: true }).order("id", { ascending: true })
          .range(offset, offset + pageSize - 1);
        if (error) throw new Error(error.message);
        all.push(...(data ?? []).map((row) => ({ userId: row.id, createdAt: row.created_at })));
        if ((data?.length ?? 0) < pageSize) return all;
      }
    })(),
    (async () => {
      const all: ActivityEvent[] = [];
      for (let offset = 0; ; offset += pageSize) {
        const { data, error } = await supabase.from("deliverables")
          .select("id,user_id,created_at,payload").eq("kind", CHALLENGE_KIND).gte("created_at", since)
          .order("created_at", { ascending: true }).order("id", { ascending: true })
          .range(offset, offset + pageSize - 1);
        if (error) throw new Error(error.message);
        for (const row of data ?? []) {
          if (validChallengeDeliverables(row.payload) && isChallengeReady(row.payload)) {
            all.push({ name: "challenge_evidence_submitted", userId: row.user_id, createdAt: row.created_at, props: { product: "expenseflow" } });
          }
        }
        if ((data?.length ?? 0) < pageSize) return all;
      }
    })(),
  ]);
  return buildMetrics([...events, ...challengeEvidence], signups);
}
