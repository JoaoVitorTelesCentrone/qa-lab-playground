import { PeopleLab } from "./people-lab";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { PeopleAttempt } from "@/lib/people-scenarios";

export const metadata = { title: "People Lab", description: "Pratique decisões, comunicação e liderança em situações reais de qualidade." };

export default async function Page() {
  let authed = false;
  let initialAttempts: PeopleAttempt[] = [];

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      authed = true;
      const { data } = await supabase
        .from("people_attempts")
        .select("scenario_id, response, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(100);
      initialAttempts = (data ?? []).map((row) => ({ scenarioId: row.scenario_id, response: row.response, createdAt: row.created_at }));
    }
  }

  return <PeopleLab initialAttempts={initialAttempts} authed={authed} />;
}
