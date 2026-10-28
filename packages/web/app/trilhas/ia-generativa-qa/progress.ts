import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

const PREFIX = "genai-qa:";

export async function getGenerativeAIQAProgress() {
  if (!isSupabaseConfigured()) return { signedIn: false, completed: [] as string[] };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { signedIn: false, completed: [] as string[] };
  const { data, error } = await supabase
    .from("mission_progress")
    .select("mission_id")
    .eq("user_id", user.id)
    .like("mission_id", `${PREFIX}%`);
  if (error) return { signedIn: true, completed: [] as string[] };
  return { signedIn: true, completed: (data ?? []).map((row) => row.mission_id.slice(PREFIX.length)) };
}
