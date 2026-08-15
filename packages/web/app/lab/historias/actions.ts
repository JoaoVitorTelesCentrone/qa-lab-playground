"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const STATUS = ["backlog", "todo", "progress", "review", "done"];
const PRIORITY = ["baixa", "media", "alta", "critica"];

async function session() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return { supabase, user };
}

// Overlay: o status que o usuário move nas stories autorais (conteúdo
// compartilhado) vive aqui, nunca na story original.
export async function setStoryStatus(storyId: string, status: string) {
  if (!storyId || !STATUS.includes(status)) return;
  const ctx = await session();
  if (!ctx) return;
  const { error } = await ctx.supabase.from("story_states").upsert(
    { user_id: ctx.user.id, story_id: storyId.slice(0, 80), status, updated_at: new Date().toISOString() },
    { onConflict: "user_id,story_id" },
  );
  if (error) throw new Error(error.message);
  revalidatePath("/lab/historias");
}

// Stories criadas pelo próprio usuário: artefato que ele possui.
export async function createUserStory(input: { key: string; title: string; description: string; criteria: string[]; priority: string; points: number }): Promise<{ id: string } | null> {
  const ctx = await session();
  if (!ctx) return null;
  const title = input.title.trim().slice(0, 180);
  if (!title) return null;
  const { data, error } = await ctx.supabase.from("user_stories").insert({
    user_id: ctx.user.id,
    key: input.key.slice(0, 20),
    title,
    description: input.description.slice(0, 2000),
    criteria: input.criteria.slice(0, 20).map((c) => c.slice(0, 300)),
    status: "backlog",
    priority: PRIORITY.includes(input.priority) ? input.priority : "media",
    points: Number.isFinite(input.points) ? Math.max(1, Math.min(21, input.points)) : 3,
  }).select("id").single();
  if (error) throw new Error(error.message);
  revalidatePath("/lab/historias");
  return data ? { id: data.id } : null;
}

export async function updateUserStoryStatus(id: string, status: string) {
  if (!STATUS.includes(status)) return;
  const ctx = await session();
  if (!ctx) return;
  const { error } = await ctx.supabase.from("user_stories").update({ status }).eq("id", id).eq("user_id", ctx.user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/lab/historias");
}
