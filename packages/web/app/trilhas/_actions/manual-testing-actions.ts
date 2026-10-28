"use server";

import { revalidatePath } from "next/cache";
import { manualTestingCourses, type ManualTestingTrackSlug } from "@/lib/manual-testing-courses";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function setManualTestingCompletion(slug: ManualTestingTrackSlug, moduleId: string, completed: boolean) {
  const course = manualTestingCourses[slug];
  if (!course || !course.modules.some((module) => module.id === moduleId)) return { ok: false as const, error: "Lab inválido." };
  if (!isSupabaseConfigured()) return { ok: false as const, error: "O salvamento de progresso não está configurado neste ambiente." };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "Entre na sua conta para salvar o progresso." };
  const query = supabase.from("mission_progress");
  const missionId = course.prefix + moduleId;
  const { error } = completed
    ? await query.upsert({ user_id: user.id, mission_id: missionId, status: "completed", completed_at: new Date().toISOString() }, { onConflict: "user_id,mission_id" })
    : await query.delete().eq("user_id", user.id).eq("mission_id", missionId);
  if (error) return { ok: false as const, error: "Não foi possível salvar seu progresso agora." };
  revalidatePath(`/trilhas/${slug}`);
  revalidatePath(`/trilhas/${slug}/${moduleId}`);
  return { ok: true as const };
}
