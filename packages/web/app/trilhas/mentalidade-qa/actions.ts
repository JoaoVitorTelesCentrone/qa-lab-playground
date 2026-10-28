"use server";

import { revalidatePath } from "next/cache";
import { qaMindsetModules } from "@/lib/qa-mindset-course";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

const PREFIX = "mentalidade-qa:";
const moduleIds = new Set(qaMindsetModules.map((module) => module.id));

export async function setQAMindsetCompletion(moduleId: string, completed: boolean) {
  if (!moduleIds.has(moduleId)) return { ok: false as const, error: "Lab inválido." };
  if (!isSupabaseConfigured()) return { ok: false as const, error: "O salvamento de progresso não está configurado neste ambiente." };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "Entre na sua conta para salvar o progresso." };
  const query = supabase.from("mission_progress");
  const { error } = completed
    ? await query.upsert({ user_id: user.id, mission_id: PREFIX + moduleId, status: "completed", completed_at: new Date().toISOString() }, { onConflict: "user_id,mission_id" })
    : await query.delete().eq("user_id", user.id).eq("mission_id", PREFIX + moduleId);
  if (error) return { ok: false as const, error: "Não foi possível salvar seu progresso agora." };
  revalidatePath("/trilhas/mentalidade-qa");
  revalidatePath(`/trilhas/mentalidade-qa/${moduleId}`);
  return { ok: true as const };
}
