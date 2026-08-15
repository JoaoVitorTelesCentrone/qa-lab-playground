"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const SCENARIO_ID = /^[a-z0-9-]{1,80}$/;

async function session() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return { supabase, user };
}

// Append-only: cada resposta vira uma linha, para mostrar a evolução do
// raciocínio ao longo do tempo. Só persiste para usuário logado.
export async function savePeopleAttempt(scenarioId: string, response: string) {
  const clean = response.trim().slice(0, 8000);
  if (!SCENARIO_ID.test(scenarioId) || clean.length < 120) return;
  const ctx = await session();
  if (!ctx) return;
  const { error } = await ctx.supabase.from("people_attempts").insert({ user_id: ctx.user.id, scenario_id: scenarioId, response: clean });
  if (error) throw new Error(error.message);
  revalidatePath("/lab/pessoas");
}
