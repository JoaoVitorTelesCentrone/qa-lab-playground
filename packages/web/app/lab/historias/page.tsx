import { HistoriasBoard, type UserStory } from "./historias-board";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata = { title: "Histórias — Backlog e Sprint", robots: { index: false, follow: false } };

export default async function HistoriasPage() {
  let authed = false;
  let initialStates: Record<string, string> = {};
  let initialUserStories: UserStory[] = [];

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      authed = true;
      const [states, userStories] = await Promise.all([
        supabase.from("story_states").select("story_id, status").eq("user_id", user.id),
        supabase.from("user_stories").select("id, key, title, description, criteria, status, priority, points").eq("user_id", user.id).order("created_at", { ascending: true }),
      ]);
      initialStates = Object.fromEntries((states.data ?? []).map((row) => [row.story_id, row.status]));
      initialUserStories = (userStories.data ?? []) as UserStory[];
    }
  }

  return <HistoriasBoard authed={authed} initialStates={initialStates} initialUserStories={initialUserStories} />;
}
