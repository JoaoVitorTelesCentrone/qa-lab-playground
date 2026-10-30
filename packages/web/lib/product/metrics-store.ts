// Leitura da telemetria para o painel de métricas.
//
// É a única parte do produto que lê linhas de outras contas, e por isso tem
// duas travas: a chave de serviço precisa estar configurada e o e-mail
// precisa estar em QALAB_ADMIN_EMAILS. Sem as duas, o painel não abre.

import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";
import { buildMetrics, type ActivityEvent, type Metrics, type ReviewedSubmission, type Signup } from "./metrics";

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
  const [events, signups, waitlistLeads, reviewedSubmissions] = await Promise.all([
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
          .select("id,created_at,acquisition_source,acquisition_medium,acquisition_campaign").gte("created_at", since)
          .order("created_at", { ascending: true }).order("id", { ascending: true })
          .range(offset, offset + pageSize - 1);
        if (error) throw new Error(error.message);
        all.push(...(data ?? []).map((row) => ({
          userId: row.id,
          createdAt: row.created_at,
          acquisitionSource: row.acquisition_source,
          acquisitionMedium: row.acquisition_medium,
          acquisitionCampaign: row.acquisition_campaign,
        })));
        if ((data?.length ?? 0) < pageSize) return all;
      }
    })(),
    (async () => {
      const { count, error } = await supabase.from("mentorship_waitlist_leads")
        .select("id", { count: "exact", head: true }).gte("created_at", since);
      if (error) throw new Error(error.message);
      return count ?? 0;
    })(),
    loadReviewedSubmissions(supabase, pageSize),
  ]);
  return buildMetrics(events, signups, new Date(), waitlistLeads, reviewedSubmissions);
}

async function loadReviewedSubmissions(supabase: ReturnType<typeof createAdminClient>, pageSize: number): Promise<ReviewedSubmission[]> {
  const submissions: Array<{ id: string; enrollment_id: string; reviewed_at: string }> = [];
  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await supabase.from("mentorship_submissions")
      .select("id,enrollment_id,reviewed_at").not("reviewed_at", "is", null)
      .order("reviewed_at", { ascending: true }).order("id", { ascending: true })
      .range(offset, offset + pageSize - 1);
    if (error) throw new Error(error.message);
    submissions.push(...(data ?? []).map((row) => ({ id: row.id, enrollment_id: row.enrollment_id, reviewed_at: row.reviewed_at! })));
    if ((data?.length ?? 0) < pageSize) break;
  }

  const enrollmentIds = [...new Set(submissions.map((row) => row.enrollment_id))];
  const ownerByEnrollment = new Map<string, string>();
  for (let offset = 0; offset < enrollmentIds.length; offset += pageSize) {
    const { data, error } = await supabase.from("mentorship_enrollments")
      .select("id,user_id").in("id", enrollmentIds.slice(offset, offset + pageSize));
    if (error) throw new Error(error.message);
    for (const row of data ?? []) ownerByEnrollment.set(row.id, row.user_id);
  }
  return submissions.flatMap((row) => {
    const studentId = ownerByEnrollment.get(row.enrollment_id);
    return studentId ? [{ studentId, reviewedAt: row.reviewed_at }] : [];
  });
}
