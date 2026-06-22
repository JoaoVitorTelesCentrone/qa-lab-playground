import { redirect } from "next/navigation";
import { WorkspaceClient } from "./workspace-client";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata = { title: "Meu Lab", description: "Seu Workspace pessoal de prática em qualidade de software.", robots: { index: false, follow: false } };

export default async function LabPage() {
  if (!isSupabaseConfigured()) return <div className="mx-auto max-w-xl px-5 py-24 text-center"><h1 className="text-3xl font-black text-off-white">Workspace aguardando configuração</h1><p className="mt-4 leading-7 text-[#8B949E]">Conecte um projeto Supabase e aplique a migração do Workspace para ativar contas, projetos e sincronização.</p></div>;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/lab");

  const [profileResult, projectsResult, draftsResult, favoritesResult, progressResult, sessionsResult] = await Promise.all([
    supabase.from("profiles").select("full_name, plan").eq("id", user.id).maybeSingle(),
    supabase.from("projects").select("id,title,description,status,color,updated_at").eq("user_id", user.id).order("updated_at", { ascending: false }),
    supabase.from("drafts").select("id,title,content,kind,updated_at").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(20),
    supabase.from("favorites").select("id,resource_type,resource_id,title,href").eq("user_id", user.id),
    supabase.from("mission_progress").select("mission_id,status").eq("user_id", user.id),
    supabase.from("playground_sessions").select("id,playground_id,status,findings_count,started_at,completed_at").eq("user_id", user.id).order("started_at", { ascending: false }).limit(20),
  ]);

  return <WorkspaceClient name={profileResult.data?.full_name ?? user.user_metadata.full_name ?? ""} email={user.email ?? ""} plan={profileResult.data?.plan ?? "free"} projects={projectsResult.data ?? []} drafts={draftsResult.data ?? []} favorites={favoritesResult.data ?? []} progress={progressResult.data ?? []} sessions={sessionsResult.data ?? []} />;
}
