import { CicdLab } from "./cicd-lab";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata = {
  title: "CI/CD Lab",
  description: "Pipeline simulado para praticar build, testes, quality gates, deploy e rollback com decisões reais de entrega.",
};

const PREFIX = "cicd:";

export default async function Page() {
  let authed = false;
  let initialSolved: string[] = [];

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      authed = true;
      const { data } = await supabase
        .from("mission_progress")
        .select("mission_id")
        .eq("user_id", user.id)
        .like("mission_id", `${PREFIX}%`);
      initialSolved = (data ?? []).map((row) => row.mission_id.slice(PREFIX.length));
    }
  }

  return <CicdLab initialSolved={initialSolved} authed={authed} />;
}
