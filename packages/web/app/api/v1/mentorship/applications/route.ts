import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { notifyMentorshipUsers } from "@/lib/mentorship/store";
import { fail, ok, readJson } from "@/lib/product/api";
import { trackEvent } from "@/lib/product/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return fail("Entre ou crie uma conta para entrar na lista de interesse.", 401);
  const body = await readJson(request);
  const cohortId = typeof body.cohortId === "string" && body.cohortId.length < 80 ? body.cohortId : null;
  if (body.acceptedContact !== true) return fail("Autorize o contato da equipe sobre a Mentoria QA Lab.", 422);
  const admin = createAdminClient();
  if (cohortId) {
    const { data: cohort } = await admin.from("mentorship_cohorts").select("id,status").eq("id", cohortId).maybeSingle();
    if (!cohort || cohort.status !== "enrollment") return fail("Essa turma não está recebendo inscrições.", 409);
  }
  const query = admin.from("mentorship_applications").select("id,status").eq("user_id", user.id);
  const existing = cohortId ? await query.eq("cohort_id", cohortId).maybeSingle() : await query.is("cohort_id", null).maybeSingle();
  if (existing.data && ["requested","awaiting_payment","waitlisted","confirmed"].includes(existing.data.status)) return ok({ id: existing.data.id, status: existing.data.status, alreadyRegistered: true });
  const write = existing.data
    ? admin.from("mentorship_applications").update({ status: "requested", offer_id: null, offer_version: null, terms_accepted_at: null, terms_snapshot: "", cancellation_policy_snapshot: "", contact_consent_at: new Date().toISOString(), decision_note: "", payment_reference: null, reviewed_by: null, reviewed_at: null, updated_at: new Date().toISOString() }).eq("id", existing.data.id)
    : admin.from("mentorship_applications").insert({ user_id: user.id, cohort_id: cohortId, status: "requested", contact_consent_at: new Date().toISOString() });
  const { data, error } = await write.select("id,status,created_at").single();
  if (error) {
    const duplicateQuery = admin.from("mentorship_applications").select("id,status").eq("user_id", user.id);
    const duplicate = cohortId ? await duplicateQuery.eq("cohort_id", cohortId).maybeSingle() : await duplicateQuery.is("cohort_id", null).maybeSingle();
    if (duplicate.data && ["requested","awaiting_payment","waitlisted","confirmed"].includes(duplicate.data.status)) return ok({ id: duplicate.data.id, status: duplicate.data.status, alreadyRegistered: true });
    return fail("Não foi possível registrar seu interesse agora.", 500);
  }
  await trackEvent(user.id, "mentorship_application_submitted", { cohort: cohortId });
  await notifyMentorshipUsers([user.id], { kind: "system", title: "Interesse na Mentoria QA Lab registrado", body: "A equipe entrará em contato quando houver uma atualização sobre a turma.", href: "/mentoria/inscricao" });
  return ok({ id: data.id, status: data.status, createdAt: data.created_at }, 201);
}
