import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, PlayCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata = { title: "Execution & Defect Hub", robots: { index: false, follow: false } };

export default async function Page() {
  if (!isSupabaseConfigured()) redirect("/lab");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/lab/execution");
  const { data } = await supabase.from("studio_workspaces").select("project_id,projects(title,description)").eq("user_id", user.id);
  return <div className="mx-auto max-w-6xl px-5 py-12"><Link href="/lab" className="text-xs text-[#8B949E]"><ArrowLeft className="mr-1 inline size-3" />Meu Lab</Link><header className="mt-8"><p className="text-xs font-bold uppercase tracking-[.2em] text-mint">Produto 03</p><h1 className="mt-3 text-4xl font-black text-off-white">Execution & Defect Hub</h1><p className="mt-3 max-w-2xl leading-7 text-[#8B949E]">Execute casos do Studio, registre evidências e acompanhe defeitos até o fechamento.</p></header><div className="mt-10 grid gap-4 md:grid-cols-2">{(data ?? []).map((item) => { const project = Array.isArray(item.projects) ? item.projects[0] : item.projects; return <Link key={item.project_id} href={`/lab/execution/${item.project_id}`} className="group rounded-2xl border border-white/10 bg-[#171B21] p-5 hover:border-mint/30"><PlayCircle className="size-5 text-mint" /><h2 className="mt-5 font-bold text-off-white">{project?.title ?? "Projeto"}</h2><p className="mt-2 text-sm text-[#8B949E]">{project?.description || "Pronto para uma rodada de execução."}</p><ArrowRight className="mt-5 size-4 text-[#69737E] group-hover:text-mint" /></Link>; })}</div>{!data?.length && <section className="mt-10 rounded-2xl border border-dashed border-white/10 p-10 text-center"><PlayCircle className="mx-auto size-6 text-[#69737E]" /><h2 className="mt-4 font-bold text-off-white">Nenhum projeto pronto para execução</h2><p className="mt-2 text-sm text-[#8B949E]">Crie um projeto e seus casos no Test Design Studio. Depois ele aparecerá aqui.</p><Link href="/lab/studio" className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg border border-neon/25 px-4 text-xs font-bold text-neon">Ir para o Studio<ArrowRight className="size-4" /></Link></section>}</div>;
}
