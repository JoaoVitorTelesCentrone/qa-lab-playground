import Link from "next/link";
import { ArrowRight, FolderKanban, Plus, TestTube2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createStudio } from "./actions";

export const metadata = {
  title: "Test Design Studio | QA Lab",
  description: "Organize requisitos, riscos, casos de teste e planos por projeto.",
  robots: { index: false, follow: false },
};

type Project = { id: string; title: string; description: string | null; color: string };
type Workspace = { id: string; project_id: string; objective: string | null; status: string; updated_at: string };

export default async function StudioPage() {
  let projects: Project[] = [];
  let workspaces: Workspace[] = [];
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const [projectsResult, workspacesResult] = await Promise.all([
        supabase.from("projects").select("id,title,description,color").eq("user_id", user.id).eq("status", "active").order("updated_at", { ascending: false }),
        supabase.from("studio_workspaces").select("id,project_id,objective,status,updated_at").eq("user_id", user.id).eq("status", "active").order("updated_at", { ascending: false }),
      ]);
      projects = (projectsResult.data ?? []) as Project[];
      workspaces = (workspacesResult.data ?? []) as Workspace[];
    }
  }
  const projectsById = new Map(projects.map((project) => [project.id, project]));
  const assignedProjects = new Set(workspaces.map((workspace) => workspace.project_id));
  const availableProjects = projects.filter((project) => !assignedProjects.has(project.id));

  return <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-black uppercase tracking-[.2em] text-neon">Test Design Studio</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-off-white">Projetos e casos de teste</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#8B949E]">Estruture requisitos, riscos, cobertura, casos manuais, passos e plano de teste sem geração automática.</p>
      </div>
      <Link href="/test-suite" className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-mint/25 px-4 text-xs font-bold text-mint hover:bg-mint/10"><TestTube2 className="size-4" /> Abrir Test Suite</Link>
    </header>

    <section className="mt-10">
      <div className="flex items-end justify-between gap-4">
        <div><h2 className="text-xl font-black text-off-white">Seus Studios</h2><p className="mt-1 text-sm text-[#8B949E]">Cada Studio concentra o design de testes de um projeto.</p></div>
        <span className="text-xs text-[#69737E]">{workspaces.length} ativos</span>
      </div>

      {workspaces.length > 0 ? <div className="mt-5 grid gap-4 md:grid-cols-2">
        {workspaces.map((workspace) => {
          const project = projectsById.get(workspace.project_id);
          return <Link key={workspace.id} href={`/lab/studio/${workspace.project_id}`} className="group rounded-2xl border border-white/10 bg-[#171B21] p-5 transition hover:border-neon/35">
            <span className="flex size-10 items-center justify-center rounded-xl bg-neon/10 text-neon"><FolderKanban className="size-5" /></span>
            <h3 className="mt-5 text-lg font-black text-off-white">{project?.title ?? "Projeto"}</h3>
            <p className="mt-2 min-h-12 text-sm leading-6 text-[#8B949E]">{workspace.objective || project?.description || "Organize a estratégia e os casos de teste deste projeto."}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-neon">Abrir Studio <ArrowRight className="size-4 transition group-hover:translate-x-1" /></span>
          </Link>;
        })}
      </div> : <div className="mt-5 rounded-2xl border border-dashed border-white/15 bg-[#11151B] p-8 text-center">
        <FolderKanban className="mx-auto size-7 text-[#69737E]" />
        <h3 className="mt-4 font-black text-off-white">Nenhum Studio criado</h3>
        <p className="mt-2 text-sm text-[#8B949E]">Escolha um projeto abaixo para começar pelo contexto e pelos riscos.</p>
      </div>}
    </section>

    <section className="mt-10 rounded-2xl border border-white/10 bg-[#11151B] p-5 sm:p-6">
      <div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-lg bg-mint/10 text-mint"><Plus className="size-4" /></span><div><h2 className="font-black text-off-white">Criar Studio</h2><p className="text-xs text-[#8B949E]">Vincule o design de testes a um projeto ativo.</p></div></div>
      {availableProjects.length > 0 ? <form action={createStudio} className="mt-5 grid gap-4 sm:grid-cols-[1fr_1.5fr_auto] sm:items-end">
        <label className="space-y-2 text-xs font-bold text-[#AAB2BC]">Projeto<select name="project_id" required className="field w-full"><option value="">Selecione</option>{availableProjects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}</select></label>
        <label className="space-y-2 text-xs font-bold text-[#AAB2BC]">Objetivo<input name="objective" maxLength={2000} className="field w-full" placeholder="Ex.: cobrir os fluxos críticos do checkout" /></label>
        <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-neon px-4 text-xs font-black text-[#101319] hover:bg-neon/90"><Plus className="size-4" /> Criar</button>
      </form> : <p className="mt-5 text-sm text-[#8B949E]">Todos os projetos ativos já possuem Studio. Crie outro projeto no <Link href="/lab" className="font-bold text-mint hover:underline">workspace</Link> para adicionar um novo.</p>}
    </section>
  </main>;
}
