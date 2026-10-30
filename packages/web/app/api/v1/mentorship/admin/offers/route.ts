import { createAdminClient } from "@/lib/supabase/admin";
import { MentorshipAccessError, requireStaff } from "@/lib/mentorship/access";
import { fail, ok, readJson } from "@/lib/product/api";
import { validatePublicOfferDetails } from "@/lib/mentorship/offer-details";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { user } = await requireStaff("admin");
    const body = await readJson(request);
    const cohortId = typeof body.cohortId === "string" ? body.cohortId : "";
    const offerCode = typeof body.offerCode === "string" ? body.offerCode.trim().toLowerCase() : "";
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const summary = typeof body.summary === "string" ? body.summary.trim() : "";
    const price = Number(body.price);
    const supportContact = typeof body.supportContact === "string" ? body.supportContact.trim() : "";
    const terms = typeof body.terms === "string" ? body.terms.trim() : "";
    const cancellationPolicy = typeof body.cancellationPolicy === "string" ? body.cancellationPolicy.trim() : "";
    const deliveryFormat = typeof body.deliveryFormat === "string" ? body.deliveryFormat.trim() : "";
    const recordingsPolicy = typeof body.recordingsPolicy === "string" ? body.recordingsPolicy.trim() : "";
    const weeklyRhythm = typeof body.weeklyRhythm === "string" ? body.weeklyRhythm.trim() : "";
    const supportResponseHours = Number(body.supportResponseHours);
    const expectedOutcome = typeof body.expectedOutcome === "string" ? body.expectedOutcome.trim() : "";
    const published = body.published === true;
    const validSupportContact = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supportContact)
      || (() => { try { const url = new URL(supportContact); return url.protocol === "https:"; } catch { return false; } })();
    const opensAt = typeof body.enrollmentOpensAt === "string" && body.enrollmentOpensAt ? new Date(body.enrollmentOpensAt) : null;
    const closesAt = typeof body.enrollmentClosesAt === "string" && body.enrollmentClosesAt ? new Date(body.enrollmentClosesAt) : null;
    if (!cohortId || !/^[a-z0-9][a-z0-9-]{1,79}$/.test(offerCode) || !title || title.length > 180 || summary.length > 2000 || !Number.isFinite(price) || price <= 0 || price > 100000 || Math.round(price * 100) !== price * 100 || !terms || !cancellationPolicy || supportContact.length > 240 || !validSupportContact) {
      return fail("Preencha código, título, preço, suporte e condições da oferta.", 422);
    }
    if ((opensAt && Number.isNaN(opensAt.getTime())) || (closesAt && Number.isNaN(closesAt.getTime())) || (opensAt && closesAt && closesAt <= opensAt)) return fail("O período de inscrição é inválido.", 422);
    const offerDetailsError = validatePublicOfferDetails({ deliveryFormat, recordingsPolicy, weeklyRhythm, supportResponseHours, expectedOutcome }, published);
    if (offerDetailsError) return fail(offerDetailsError, 422);
    const admin = createAdminClient();
    const { data: cohort } = await admin.from("mentorship_cohorts").select("id,capacity").eq("id", cohortId).maybeSingle();
    if (!cohort) return fail("Turma não encontrada.", 404);
    if (published && Number(cohort.capacity) > 20) return fail("A oferta fundadora não pode abrir mais de 20 vagas.", 422);
    const values = {
      cohort_id: cohortId, offer_code: offerCode, title, summary, price, currency: "BRL",
      enrollment_opens_at: opensAt?.toISOString() ?? null, enrollment_closes_at: closesAt?.toISOString() ?? null,
      support_contact: supportContact.slice(0, 240), terms: terms.slice(0, 8000), cancellation_policy: cancellationPolicy.slice(0, 4000),
      delivery_format: deliveryFormat.slice(0, 500), recordings_policy: recordingsPolicy.slice(0, 1000),
      weekly_rhythm: weeklyRhythm.slice(0, 1000), support_response_hours: Number.isInteger(supportResponseHours) ? supportResponseHours : 0,
      expected_outcome: expectedOutcome.slice(0, 1000), published, created_by: user.id,
    };
    const { data: current } = await admin.from("mentorship_offers").select("id,version").eq("cohort_id", cohortId).maybeSingle();
    const query = current
      ? admin.from("mentorship_offers").update({ ...values, version: Number(current.version) + 1, updated_at: new Date().toISOString() }).eq("id", current.id)
      : admin.from("mentorship_offers").insert(values);
    const { data, error } = await query.select("id,cohort_id,offer_code,title,summary,price,currency,enrollment_opens_at,enrollment_closes_at,support_contact,terms,cancellation_policy,delivery_format,recordings_policy,weekly_rhythm,support_response_hours,expected_outcome,published,version").single();
    if (error || !data) return fail("Não foi possível salvar a oferta.", 500);
    return ok(data, current ? 200 : 201);
  } catch (error) {
    if (error instanceof MentorshipAccessError) return fail(error.message, error.status);
    return fail("Não foi possível salvar a oferta.", 500);
  }
}
