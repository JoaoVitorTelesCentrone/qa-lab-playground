import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { fail, ok } from "@/lib/product/api";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return fail("Entre para consultar sua inscrição.", 401);
  const { id } = await params;
  const { data, error } = await createAdminClient().from("mentorship_orders")
    .select("id,status,payment_status,amount,currency,reservation_expires_at,paid_at,enrollment_id,cohort:mentorship_cohorts(name)")
    .eq("id", id).eq("user_id", user.id).maybeSingle();
  if (error || !data) return fail("Inscrição não encontrada.", 404);
  return ok({ ...data, cohort: Array.isArray(data.cohort) ? data.cohort[0] : data.cohort });
}
