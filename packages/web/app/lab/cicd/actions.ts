"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const PREFIX = "cicd:";
const MISSION_ID = /^[a-z0-9-]{1,80}$/;

// Estado anônimo é efêmero (não chega aqui). Estas actions só persistem para
// usuários logados; se não houver sessão, retornam em silêncio (o client já
// mostra o convite de login).
async function session() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return { supabase, user };
}

export async function markCicdSolved(missionId: string) {
  if (!MISSION_ID.test(missionId)) return;
  const ctx = await session();
  if (!ctx) return;
  const { error } = await ctx.supabase.from("mission_progress").upsert(
    { user_id: ctx.user.id, mission_id: PREFIX + missionId, status: "completed", completed_at: new Date().toISOString() },
    { onConflict: "user_id,mission_id" },
  );
  if (error) throw new Error(error.message);
  revalidatePath("/trilhas/cicd");
}

export async function resetCicdProgress() {
  const ctx = await session();
  if (!ctx) return;
  const { error } = await ctx.supabase.from("mission_progress").delete().eq("user_id", ctx.user.id).like("mission_id", `${PREFIX}%`);
  if (error) throw new Error(error.message);
  revalidatePath("/trilhas/cicd");
}
