"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function authenticated() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/lab");
  return { supabase, user };
}

function text(value: FormDataEntryValue | null, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

function ensure(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

export async function createProject(formData: FormData) {
  const { supabase, user } = await authenticated();
  const title = text(formData.get("title"), 100);
  if (!title) return;
  const requestedColor = text(formData.get("color"), 10);
  const color = ["mint", "coral", "neon"].includes(requestedColor) ? requestedColor : "mint";
  const { error } = await supabase.from("projects").insert({ user_id: user.id, title, description: text(formData.get("description"), 1000), color });
  ensure(error);
  revalidatePath("/lab");
}

export async function archiveProject(formData: FormData) {
  const { supabase, user } = await authenticated();
  const { error } = await supabase.from("projects").update({ status: "archived" }).eq("id", text(formData.get("id"), 50)).eq("user_id", user.id);
  ensure(error);
  revalidatePath("/lab");
}

export async function createDraft(formData: FormData) {
  const { supabase, user } = await authenticated();
  const title = text(formData.get("title"), 120);
  if (!title) return;
  const requestedKind = text(formData.get("kind"), 20);
  const kind = ["note", "bug_report", "test_case", "gherkin", "test_plan"].includes(requestedKind) ? requestedKind : "note";
  const { error } = await supabase.from("drafts").insert({ user_id: user.id, title, content: text(formData.get("content"), 20000), kind, project_id: text(formData.get("project_id"), 50) || null });
  ensure(error);
  revalidatePath("/lab");
}

export async function deleteDraft(formData: FormData) {
  const { supabase, user } = await authenticated();
  const { error } = await supabase.from("drafts").delete().eq("id", text(formData.get("id"), 50)).eq("user_id", user.id);
  ensure(error);
  revalidatePath("/lab");
}

export async function toggleFavorite(resourceType: string, resourceId: string, title: string, href: string) {
  const { supabase, user } = await authenticated();
  const { data } = await supabase.from("favorites").select("id").eq("user_id", user.id).eq("resource_type", resourceType).eq("resource_id", resourceId).maybeSingle();
  if (data) { const { error } = await supabase.from("favorites").delete().eq("id", data.id).eq("user_id", user.id); ensure(error); }
  else { const { error } = await supabase.from("favorites").insert({ user_id: user.id, resource_type: resourceType, resource_id: resourceId, title, href }); ensure(error); }
  revalidatePath("/lab");
}

export async function syncLocalProgress(ids: string[]) {
  const { supabase, user } = await authenticated();
  const cleanIds = [...new Set(ids.filter((id) => /^[a-z0-9-]{1,80}$/.test(id)))].slice(0, 50);
  if (!cleanIds.length) return;
  const { error } = await supabase.from("mission_progress").upsert(cleanIds.map((missionId) => ({ user_id: user.id, mission_id: missionId, status: "completed", completed_at: new Date().toISOString() })), { onConflict: "user_id,mission_id" });
  ensure(error);
  revalidatePath("/lab");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
