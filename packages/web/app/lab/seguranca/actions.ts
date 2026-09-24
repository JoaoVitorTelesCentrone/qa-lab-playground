"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isSecurityAnswerCorrect, securityMissions } from "@/lib/security-lab";

const PREFIX = "security:";

export async function markSecurityMissionSolved(missionId: string, optionId: string) {
  const mission = securityMissions.find((item) => item.id === missionId);
  if (!mission || !isSecurityAnswerCorrect(mission, optionId)) return { saved: false };
  if (!isSupabaseConfigured()) return { saved: false };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { saved: false };

  const { error } = await supabase.from("mission_progress").upsert(
    { user_id: user.id, mission_id: PREFIX + missionId, status: "completed", completed_at: new Date().toISOString() },
    { onConflict: "user_id,mission_id" },
  );
  if (error) throw new Error(error.message);
  revalidatePath("/lab/seguranca");
  revalidatePath("/lab/competencias");
  return { saved: true };
}
