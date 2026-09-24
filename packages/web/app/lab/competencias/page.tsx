import { CompetencyMap } from "./competency-map";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { PeopleAttempt } from "@/lib/people-scenarios";

export const metadata = { title: "Mapa de competências", description: "Acompanhe evidências e próximos passos da sua evolução em qualidade." };

const CICD_PREFIX = "cicd:";
const SECURITY_PREFIX = "security:";

export default async function Page() {
  let serverCicd: string[] = [];
  let serverSecurity: string[] = [];
  let serverPeople: PeopleAttempt[] = [];

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const [cicd, security, people] = await Promise.all([
        supabase.from("mission_progress").select("mission_id").eq("user_id", user.id).like("mission_id", `${CICD_PREFIX}%`),
        supabase.from("mission_progress").select("mission_id").eq("user_id", user.id).like("mission_id", `${SECURITY_PREFIX}%`),
        supabase.from("people_attempts").select("scenario_id, response, created_at").eq("user_id", user.id),
      ]);
      serverCicd = (cicd.data ?? []).map((row) => row.mission_id.slice(CICD_PREFIX.length));
      serverSecurity = (security.data ?? []).map((row) => row.mission_id.slice(SECURITY_PREFIX.length));
      serverPeople = (people.data ?? []).map((row) => ({ scenarioId: row.scenario_id, response: row.response, createdAt: row.created_at }));
    }
  }

  return <CompetencyMap serverCicd={serverCicd} serverSecurity={serverSecurity} serverPeople={serverPeople} />;
}
