"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { buildTriageDraft, getTriageCase, scoreTriageReview, type TriageDecision, type TriagePriority, type TriageReview, type TriageSeverity } from "@/lib/triage-lab";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const severities = ["baixa", "media", "alta", "critica"];
const priorities = ["p3", "p2", "p1", "p0"];
const decisions = ["corrigir_agora", "planejar_sprint", "monitorar", "fechar_invalido"];
function text(value: FormDataEntryValue | null, max: number) { return String(value ?? "").trim().slice(0, max); }
async function session() { if (!isSupabaseConfigured()) redirect("/login?next=/lab/triagem"); const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect("/login?next=/lab/triagem"); return { supabase, user }; }
export async function saveTriageSubmission(formData: FormData) {
  const item = getTriageCase(text(formData.get("case_id"), 20)); if (!item) return;
  const severity = text(formData.get("severity"), 20); const priority = text(formData.get("priority"), 20); const decision = text(formData.get("decision"), 30);
  const review: TriageReview = { severity: (severities.includes(severity) ? severity : "media") as TriageSeverity, priority: (priorities.includes(priority) ? priority : "p2") as TriagePriority, decision: (decisions.includes(decision) ? decision : "planejar_sprint") as TriageDecision, owner: text(formData.get("owner"), 120), rationale: text(formData.get("rationale"), 5000), nextStep: text(formData.get("next_step"), 3000) };
  if (!scoreTriageReview(item, review).ready) redirect(`/lab/triagem?case=${item.id}&error=incomplete`);
  const { supabase, user } = await session(); const draft = buildTriageDraft(item, review);
  const { error: draftError } = await supabase.from("drafts").insert({ user_id: user.id, title: draft.title, content: draft.content, kind: "bug_report" }); if (draftError) throw new Error(draftError.message);
  const { error: progressError } = await supabase.from("mission_progress").upsert({ user_id: user.id, mission_id: `triage:${item.id}`, status: "completed", completed_at: new Date().toISOString() }, { onConflict: "user_id,mission_id" }); if (progressError) throw new Error(progressError.message);
  revalidatePath("/lab/triagem"); revalidatePath("/lab"); redirect(`/lab/triagem?case=${item.id}&saved=1`);
}