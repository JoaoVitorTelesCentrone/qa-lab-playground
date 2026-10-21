import { createAdminClient } from "@/lib/supabase/admin";

export type PublicMentorshipOffer = {
  id: string;
  cohort_id: string;
  offer_code: string;
  title: string;
  summary: string;
  price: number;
  currency: string;
  enrollment_opens_at: string | null;
  enrollment_closes_at: string | null;
  support_contact: string;
  terms: string;
  cancellation_policy: string;
  version: number;
  cohort: { name: string; starts_on: string; ends_on: string; capacity: number; status: string };
  occupied: number;
};

export type MyMentorshipApplication = {
  id: string;
  status: string;
  created_at: string;
  updated_at: string;
  cohort: { name: string } | null;
};

export async function getMyMentorshipApplications(userId: string): Promise<MyMentorshipApplication[]> {
  try {
    const { data, error } = await createAdminClient().from("mentorship_applications")
      .select("id,status,created_at,updated_at,cohort:mentorship_cohorts(name)")
      .eq("user_id", userId).order("created_at", { ascending: false }).limit(5);
    if (error) return [];
    return (data ?? []).map((row) => ({
      ...row,
      cohort: Array.isArray(row.cohort) ? row.cohort[0] ?? null : row.cohort,
    })) as MyMentorshipApplication[];
  } catch {
    return [];
  }
}

export async function getPublicMentorshipOffers(): Promise<PublicMentorshipOffer[]> {
  try {
    const admin = createAdminClient();
    const { data: offers, error } = await admin.from("mentorship_offers")
      .select("id,cohort_id,offer_code,title,summary,price,currency,enrollment_opens_at,enrollment_closes_at,support_contact,terms,cancellation_policy,version,cohort:mentorship_cohorts!inner(name,starts_on,ends_on,capacity,status)")
      .eq("published", true).eq("cohort.status", "enrollment").order("enrollment_opens_at", { ascending: true });
    if (error) return [];
    const rows = offers ?? [];
    const visible = rows as unknown as PublicMentorshipOffer[];
    const counts = await Promise.all(visible.map(async (offer) => {
      const [enrollmentResult, orderResult] = await Promise.all([
        admin.from("mentorship_enrollments").select("id", { count: "exact", head: true }).eq("cohort_id", offer.cohort_id).in("status", ["invited", "active", "paused", "completed"]),
        admin.from("mentorship_orders").select("id", { count: "exact", head: true }).eq("cohort_id", offer.cohort_id).eq("status", "pending").gt("reservation_expires_at", new Date().toISOString()),
      ]);
      return { ...offer, price: Number(offer.price), occupied: (enrollmentResult.count ?? 0) + (orderResult.count ?? 0), cohort: Array.isArray(offer.cohort) ? offer.cohort[0] : offer.cohort };
    }));
    return counts;
  } catch {
    return [];
  }
}

export function isOfferOpen(offer: PublicMentorshipOffer, now = Date.now()) {
  return offer.cohort.status === "enrollment"
    && offer.occupied < offer.cohort.capacity
    && (!offer.enrollment_opens_at || new Date(offer.enrollment_opens_at).getTime() <= now)
    && (!offer.enrollment_closes_at || new Date(offer.enrollment_closes_at).getTime() > now);
}
