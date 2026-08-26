import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { StudioClient } from "./studio-client";
import type { TestPlan } from "../types";

const emptyPlan: TestPlan = { objective: "", scope: "", out_of_scope: "", strategy: "", environments: "", tools: "", entry_criteria: "", exit_criteria: "", dependencies: "", responsibilities: "", schedule: "" };

export default async function StudioProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  if (!isSupabaseConfigured()) return <GuestStudio projectId={projectId} />;
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <GuestStudio projectId={projectId} />;
  const { data: workspace } = await supabase.from("studio_workspaces").select("id,project_id,objective,status,updated_at,projects(title,description,color)").eq("project_id", projectId).eq("user_id", user.id).maybeSingle(); if (!workspace) notFound();
  const [profileResult, requirementsResult, risksResult, casesResult, planResult, linksResult] = await Promise.all([
    supabase.from("profiles").select("plan").eq("id", user.id).maybeSingle(),
    supabase.from("requirements").select("id,title,description,acceptance_criteria,business_rules,open_questions,status,updated_at").eq("workspace_id", workspace.id).order("updated_at", { ascending: false }),
    supabase.from("risk_items").select("id,requirement_id,title,category,probability,impact,score,mitigation,status").eq("workspace_id", workspace.id).order("score", { ascending: false }),
    supabase.from("test_cases").select("id,title,objective,preconditions,test_data,expected_result,case_type,priority,layer,status,updated_at").eq("workspace_id", workspace.id).order("updated_at", { ascending: false }),
    supabase.from("test_plans").select("objective,scope,out_of_scope,strategy,environments,tools,entry_criteria,exit_criteria,dependencies,responsibilities,schedule").eq("workspace_id", workspace.id).maybeSingle(),
    supabase.from("coverage_links").select("id,requirement_id,risk_id,test_case_id").eq("workspace_id", workspace.id),
  ]);
  const caseIds = (casesResult.data ?? []).map((item) => item.id); const { data: steps } = caseIds.length ? await supabase.from("test_steps").select("id,test_case_id,position,action,expected_result").in("test_case_id", caseIds).order("position") : { data: [] };
  const project = Array.isArray(workspace.projects) ? workspace.projects[0] : workspace.projects;
  return <StudioClient workspaceId={workspace.id} projectId={projectId} project={{ title: project?.title ?? "Projeto", description: project?.description ?? "", color: project?.color ?? "mint", objective: workspace.objective }} planName={profileResult.data?.plan ?? "free"} requirements={requirementsResult.data ?? []} risks={risksResult.data ?? []} testCases={casesResult.data ?? []} steps={steps ?? []} coverageLinks={linksResult.data ?? []} initialPlan={(planResult.data as TestPlan | null) ?? emptyPlan} />;
}

function GuestStudio({ projectId }: { projectId: string }) {
  return <StudioClient workspaceId="demo-workspace" projectId={projectId} project={{ title: "Projeto demonstrativo", description: "Workspace público para explorar o Test Design Studio.", color: "mint", objective: "Planejar a cobertura dos fluxos críticos." }} planName="pro" requirements={[]} risks={[]} testCases={[]} steps={[]} coverageLinks={[]} initialPlan={emptyPlan} />;
}
