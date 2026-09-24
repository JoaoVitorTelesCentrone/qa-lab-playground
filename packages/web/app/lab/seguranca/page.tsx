import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SecurityLab } from "./security-lab";

export const metadata = { title: "Security Lab", description: "Pratique decisões de segurança em simulações locais e autorizadas." };

export default async function Page() {
  let authed = false;
  let initialSolved: string[] = [];

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      authed = true;
      const { data } = await supabase.from("mission_progress").select("mission_id").eq("user_id", user.id).like("mission_id", "security:%");
      initialSolved = (data ?? []).map((row) => row.mission_id.slice("security:".length));
    }
  }

  return <SecurityLab initialSolved={initialSolved} authed={authed} />;
}
