"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const clean = (value: FormDataEntryValue | null, max = 10000) => String(value ?? "").trim().slice(0, max);
const uuid = (value: FormDataEntryValue | null) => { const result = clean(value, 36); if (!uuidPattern.test(result)) throw new Error("Identificador inválido."); return result; };
const ensure = (error: { message: string } | null) => { if (error) throw new Error(error.message); };

async function context(next = "/lab/studio") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  return { supabase, user };
}

async function version(workspaceId: string, entityType: string, entityId: string, snapshot: Record<string, unknown>) {
  const { supabase, user } = await context();
  const { data: profile } = await supabase.from("profiles").select("plan").eq("id", user.id).maybeSingle();
  if (!profile || profile.plan === "free") return;
  const { count } = await supabase.from("artifact_versions").select("id", { count: "exact", head: true }).eq("entity_type", entityType).eq("entity_id", entityId);
  await supabase.from("artifact_versions").insert({ user_id: user.id, workspace_id: workspaceId, entity_type: entityType, entity_id: entityId, version: (count ?? 0) + 1, snapshot });
}

export async function createStudio(formData: FormData) {
  const projectId = uuid(formData.get("project_id"));
  const { supabase, user } = await context();
  const { data: project, error: projectError } = await supabase.from("projects").select("id").eq("id", projectId).eq("user_id", user.id).eq("status", "active").single();
  ensure(projectError); if (!project) return;
  const { error } = await supabase.from("studio_workspaces").insert({ user_id: user.id, project_id: projectId, objective: clean(formData.get("objective"), 2000) });
  ensure(error); revalidatePath("/lab/studio"); redirect(`/lab/studio/${projectId}`);
}

export async function createRequirement(formData: FormData) {
  const workspaceId = uuid(formData.get("workspace_id")); const title = clean(formData.get("title"), 140); if (!title) return;
  const { supabase, user } = await context();
  const { error } = await supabase.from("requirements").insert({ user_id: user.id, workspace_id: workspaceId, title, description: clean(formData.get("description")), acceptance_criteria: clean(formData.get("acceptance_criteria")), business_rules: clean(formData.get("business_rules")), open_questions: clean(formData.get("open_questions"), 5000), status: clean(formData.get("status"), 20) || "draft" });
  ensure(error); revalidatePath(`/lab/studio`);
}

export async function updateRequirement(formData: FormData) {
  const id = uuid(formData.get("id")); const workspaceId = uuid(formData.get("workspace_id")); const title = clean(formData.get("title"), 140); if (!title) return;
  const { supabase, user } = await context();
  const payload = { title, description: clean(formData.get("description")), acceptance_criteria: clean(formData.get("acceptance_criteria")), business_rules: clean(formData.get("business_rules")), open_questions: clean(formData.get("open_questions"), 5000), status: clean(formData.get("status"), 20) || "draft" };
  const { error } = await supabase.from("requirements").update(payload).eq("id", id).eq("workspace_id", workspaceId).eq("user_id", user.id); ensure(error);
  await version(workspaceId, "requirement", id, payload); revalidatePath("/lab/studio");
}

export async function deleteRequirement(formData: FormData) {
  const { supabase, user } = await context(); const { error } = await supabase.from("requirements").delete().eq("id", uuid(formData.get("id"))).eq("user_id", user.id); ensure(error); revalidatePath("/lab/studio");
}

export async function createRisk(formData: FormData) {
  const workspaceId = uuid(formData.get("workspace_id")); const title = clean(formData.get("title"), 160); if (!title) return;
  const { supabase, user } = await context(); const probability = Math.min(5, Math.max(1, Number(formData.get("probability")) || 3)); const impact = Math.min(5, Math.max(1, Number(formData.get("impact")) || 3));
  const requirementId = clean(formData.get("requirement_id"), 36);
  const { error } = await supabase.from("risk_items").insert({ user_id: user.id, workspace_id: workspaceId, title, category: clean(formData.get("category"), 30) || "produto", probability, impact, mitigation: clean(formData.get("mitigation"), 3000), requirement_id: uuidPattern.test(requirementId) ? requirementId : null }); ensure(error); revalidatePath("/lab/studio");
}

export async function deleteRisk(formData: FormData) {
  const { supabase, user } = await context(); const { error } = await supabase.from("risk_items").delete().eq("id", uuid(formData.get("id"))).eq("user_id", user.id); ensure(error); revalidatePath("/lab/studio");
}

export async function updateRisk(formData: FormData) {
  const id = uuid(formData.get("id")); const workspaceId = uuid(formData.get("workspace_id")); const title = clean(formData.get("title"), 160); if (!title) return;
  const { supabase, user } = await context(); const probability = Math.min(5, Math.max(1, Number(formData.get("probability")) || 3)); const impact = Math.min(5, Math.max(1, Number(formData.get("impact")) || 3)); const requirementId = clean(formData.get("requirement_id"), 36);
  const payload = { title, category: clean(formData.get("category"), 30) || "produto", probability, impact, mitigation: clean(formData.get("mitigation"), 3000), status: clean(formData.get("status"), 20) || "open", requirement_id: uuidPattern.test(requirementId) ? requirementId : null };
  const { error } = await supabase.from("risk_items").update(payload).eq("id", id).eq("workspace_id", workspaceId).eq("user_id", user.id); ensure(error); await version(workspaceId, "risk", id, payload); revalidatePath("/lab/studio", "layout");
}

export async function createTestCase(formData: FormData) {
  const workspaceId = uuid(formData.get("workspace_id")); const title = clean(formData.get("title"), 180); if (!title) return;
  const { supabase, user } = await context();
  const payload = { user_id: user.id, workspace_id: workspaceId, title, objective: clean(formData.get("objective"), 5000), preconditions: clean(formData.get("preconditions"), 5000), test_data: clean(formData.get("test_data"), 5000), expected_result: clean(formData.get("expected_result"), 5000), case_type: clean(formData.get("case_type"), 20) || "positive", priority: clean(formData.get("priority"), 20) || "medium", layer: clean(formData.get("layer"), 20) || "ui", status: "draft" };
  const { data: testCase, error } = await supabase.from("test_cases").insert(payload).select("id").single(); ensure(error); if (!testCase) return;
  const action = clean(formData.get("step_action"), 3000); if (action) { const { error: stepError } = await supabase.from("test_steps").insert({ user_id: user.id, test_case_id: testCase.id, position: 1, action, expected_result: clean(formData.get("step_expected"), 3000) }); ensure(stepError); }
  const requirementId = clean(formData.get("requirement_id"), 36); const riskId = clean(formData.get("risk_id"), 36);
  if (uuidPattern.test(requirementId) || uuidPattern.test(riskId)) { const { error: linkError } = await supabase.from("coverage_links").insert({ user_id: user.id, workspace_id: workspaceId, test_case_id: testCase.id, requirement_id: uuidPattern.test(requirementId) ? requirementId : null, risk_id: uuidPattern.test(riskId) ? riskId : null }); ensure(linkError); }
  revalidatePath("/lab/studio");
}

export async function addTestStep(formData: FormData) {
  const caseId = uuid(formData.get("test_case_id")); const action = clean(formData.get("action"), 3000); if (!action) return;
  const { supabase, user } = await context(); const { count } = await supabase.from("test_steps").select("id", { count: "exact", head: true }).eq("test_case_id", caseId);
  const { error } = await supabase.from("test_steps").insert({ user_id: user.id, test_case_id: caseId, position: (count ?? 0) + 1, action, expected_result: clean(formData.get("expected_result"), 3000) }); ensure(error); revalidatePath("/lab/studio");
}

export async function deleteTestCase(formData: FormData) {
  const { supabase, user } = await context(); const { error } = await supabase.from("test_cases").delete().eq("id", uuid(formData.get("id"))).eq("user_id", user.id); ensure(error); revalidatePath("/lab/studio");
}

export async function updateTestCase(formData: FormData) {
  const id = uuid(formData.get("id")); const workspaceId = uuid(formData.get("workspace_id")); const title = clean(formData.get("title"), 180); if (!title) return;
  const { supabase, user } = await context(); const payload = { title, objective: clean(formData.get("objective"), 5000), preconditions: clean(formData.get("preconditions"), 5000), test_data: clean(formData.get("test_data"), 5000), expected_result: clean(formData.get("expected_result"), 5000), case_type: clean(formData.get("case_type"), 20), priority: clean(formData.get("priority"), 20), layer: clean(formData.get("layer"), 20), status: clean(formData.get("status"), 20) || "draft" };
  const { error } = await supabase.from("test_cases").update(payload).eq("id", id).eq("workspace_id", workspaceId).eq("user_id", user.id); ensure(error);
  const { error: deleteLinksError } = await supabase.from("coverage_links").delete().eq("test_case_id", id).eq("user_id", user.id); ensure(deleteLinksError);
  const requirementId = clean(formData.get("requirement_id"), 36); const riskId = clean(formData.get("risk_id"), 36);
  if (uuidPattern.test(requirementId) || uuidPattern.test(riskId)) { const { error: linkError } = await supabase.from("coverage_links").insert({ user_id: user.id, workspace_id: workspaceId, test_case_id: id, requirement_id: uuidPattern.test(requirementId) ? requirementId : null, risk_id: uuidPattern.test(riskId) ? riskId : null }); ensure(linkError); }
  await version(workspaceId, "test_case", id, payload); revalidatePath("/lab/studio", "layout");
}

export async function deleteTestStep(formData: FormData) {
  const { supabase, user } = await context(); const { error } = await supabase.from("test_steps").delete().eq("id", uuid(formData.get("id"))).eq("user_id", user.id); ensure(error); revalidatePath("/lab/studio", "layout");
}

export type TestPlanInput = { objective: string; scope: string; out_of_scope: string; strategy: string; environments: string; tools: string; entry_criteria: string; exit_criteria: string; dependencies: string; responsibilities: string; schedule: string };
export async function saveTestPlan(workspaceId: string, input: TestPlanInput) {
  if (!uuidPattern.test(workspaceId)) throw new Error("Workspace inválido."); const { supabase, user } = await context();
  const payload = Object.fromEntries(Object.entries(input).map(([key, value]) => [key, String(value ?? "").trim().slice(0, 20000)])) as TestPlanInput;
  const { data, error } = await supabase.from("test_plans").upsert({ user_id: user.id, workspace_id: workspaceId, ...payload }, { onConflict: "workspace_id" }).select("id").single(); ensure(error);
  if (data) await version(workspaceId, "test_plan", data.id, payload); revalidatePath("/lab/studio");
}
