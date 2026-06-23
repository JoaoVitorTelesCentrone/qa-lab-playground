import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, FlaskConical, FolderKanban, Plus, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createStudio } from "./actions";

export const metadata = { title: "Test Design Studio", robots: { index: false, follow: false } };

export default async function StudioPage() {
  if (!isSupabaseConfigured()) redirect("/lab");
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect("/login?next=/lab/studio");
  const [{ data: profile }, { data: projects }, { data: studios }] = await Promise.all([
    supabase.from("profiles").select("plan").eq("id", user.id).maybeSingle(),
    supabase.from("projects").select("id,title,description,color").eq("user_id", user.id).eq("status", "active").order("updated_at", { ascending: false }),
    supabase.from("studio_workspaces").select("id,project_id,objective,status,updated_at,projects(title,description,color)").eq("user_id", user.id).order("updated_at", { ascending: false }),
  ]);
  const used = new Set((studios ?? []).map((item) => item.project_id)); const available = (projects ?? []).filter((item) => !used.has(item.id)); const canCreate = profile?.plan !== "free" || !studios?.length;

  return <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14"><Link href="/lab" className="inline-flex items-center gap-1.5 text-xs text-[#8B949E] hover:text-mint"><ArrowLeft className="size-3.5" /> Meu Lab</Link><header className="mt-8 max-w-3xl"><div className="flex items-center gap-2"><span className="rounded-full border border-neon/25 bg-neon/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neon">{profile?.plan ?? "free"}</span><span className="text-xs text-[#69737E]">Sem integração BDD nesta versão</span></div><h1 className="mt-4 text-4xl font-black tracking-tight text-off-white sm:text-5xl">Test Design Studio</h1><p className="mt-4 leading-7 text-[#8B949E]">Transforme contexto de produto em requisitos claros, riscos priorizados, casos rastreáveis e um plano de teste consistente.</p></header>

    <section className="mt-10"><h2 className="text-xl font-black text-off-white">Seus Studios</h2><div className="mt-4 grid gap-4 md:grid-cols-2">{(studios ?? []).map((studio) => { const project = Array.isArray(studio.projects) ? studio.projects[0] : studio.projects; return <Link key={studio.id} href={`/lab/studio/${studio.project_id}`} className="group rounded-2xl border border-white/10 bg-[#171B21] p-5 transition hover:-translate-y-0.5 hover:border-mint/30"><div className="flex items-start justify-between"><FolderKanban className="size-5 text-mint" /><ArrowRight className="size-4 text-[#69737E] group-hover:translate-x-1 group-hover:text-mint" /></div><h3 className="mt-6 text-lg font-bold text-off-white">{project?.title ?? "Projeto"}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-[#8B949E]">{studio.objective || project?.description || "Studio pronto para estruturar."}</p><p className="mt-5 text-[10px] uppercase text-[#69737E]">{studio.status}</p></Link>; })}</div>{!studios?.length && <div className="mt-4 rounded-2xl border border-dashed border-white/10 p-8 text-center"><FlaskConical className="mx-auto size-6 text-[#69737E]" /><p className="mt-3 text-sm text-[#8B949E]">Nenhum Studio criado ainda.</p></div>}</section>

    <section className="mt-10 rounded-2xl border border-mint/20 bg-mint/[0.04] p-5 sm:p-6"><div className="flex items-center gap-2"><Plus className="size-4 text-mint" /><h2 className="font-bold text-off-white">Criar a partir de um projeto</h2></div>{canCreate && available.length ? <form action={createStudio} className="mt-5 grid gap-3 sm:grid-cols-[1fr_1.5fr_auto]"><select name="project_id" required className="field"><option value="">Selecione um projeto</option>{available.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}</select><input name="objective" maxLength={2000} placeholder="Objetivo de qualidade deste Studio" className="field" /><button className="rounded-lg bg-mint px-4 py-2.5 text-xs font-black text-[#101319]">Criar Studio</button></form> : <p className="mt-4 text-sm leading-6 text-[#8B949E]">{!canCreate ? "O plano Free permite um Studio. O banco também aplica esse limite." : "Crie um projeto ativo no Meu Lab antes de iniciar um Studio."}</p>}</section>
    <div className="mt-8 flex gap-3 rounded-xl border border-white/10 p-4 text-xs leading-5 text-[#8B949E]"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-mint" />Os artefatos são privados e protegidos por RLS. O gerador BDD em Python será conectado depois, sem duplicar sua lógica.</div>
  </div>;
}
