"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { buildRefinementDraft, getRefinementItem, scoreRefinement, type RefinementReview } from "@/lib/refinement-lab";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function text(value: FormDataEntryValue | null, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

function rating(value: FormDataEntryValue | null) {
  return Math.max(1, Math.min(5, Number(value) || 1));
}

async function session() {
  if (!isSupabaseConfigured()) redirect("/login?next=/lab/refinamento");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/lab/refinamento");
  return { supabase, user };
}

export async function saveRefinementSubmission(formData: FormData) {
  const item = getRefinementItem(text(formData.get("item_id"), 20));
  if (!item) return;
  const review: RefinementReview = {
    title: text(formData.get("title"), 180),
    body: text(formData.get("body"), 5000),
    criteria: text(formData.get("criteria"), 5000),
    questions: text(formData.get("questions"), 3000),
    clarity: rating(formData.get("clarity")),
    testability: rating(formData.get("testability")),
    value: rating(formData.get("value")),
    scope: rating(formData.get("scope")),
  };
  const result = scoreRefinement(review);
  if (!result.ready) redirect(`/lab/refinamento?item=${item.id}&error=incomplete`);
  const draft = buildRefinementDraft(item, review);
  const { supabase, user } = await session();
  const { error: draftError } = await supabase.from("drafts").insert({ user_id: user.id, title: draft.title, content: draft.content, kind: item.kind === "bug" ? "bug_report" : "note" });
  if (draftError) throw new Error(draftError.message);
  const { error: progressError } = await supabase.from("mission_progress").upsert({ user_id: user.id, mission_id: `refinement:${item.id}`, status: "completed", completed_at: new Date().toISOString() }, { onConflict: "user_id,mission_id" });
  if (progressError) throw new Error(progressError.message);
  revalidatePath("/lab/refinamento");
  revalidatePath("/lab");
  redirect(`/lab/refinamento?item=${item.id}&saved=1`);
}