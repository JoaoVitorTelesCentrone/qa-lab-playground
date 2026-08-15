import { RefinementLabClient } from "./refinement-lab-client";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata = { title: "Refinement Lab", description: "Pratique refinamento de PBIs e bugs mal escritos.", robots: { index: false, follow: false } };

export default async function RefinementPage({ searchParams }: { searchParams: Promise<{ item?: string; saved?: string; error?: string }> }) {
  const params = await searchParams;
  let completedIds: string[] = [];
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from("mission_progress").select("mission_id").eq("user_id", user.id).like("mission_id", "refinement:%");
      completedIds = (data ?? []).map((row) => row.mission_id.replace("refinement:", ""));
    }
  }
  return <RefinementLabClient initialItemId={params.item} completedIds={completedIds} saved={params.saved === "1"} error={Boolean(params.error)} />;
}