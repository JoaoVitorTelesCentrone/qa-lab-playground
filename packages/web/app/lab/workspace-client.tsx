"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Archive, ArrowRight, BookOpen, CheckCircle2, FileText, FolderKanban, Heart, LogOut, Plus, Sparkles, Target, Trash2 } from "lucide-react";
import { archiveProject, createDraft, createProject, deleteDraft, signOut, syncLocalProgress, toggleFavorite } from "./actions";

type Project = { id: string; title: string; description: string; status: string; color: string; updated_at: string };
type Draft = { id: string; title: string; content: string; kind: string; updated_at: string };
type Favorite = { id: string; resource_type: string; resource_id: string; title: string; href: string };
type Progress = { mission_id: string; status: string };
type PlaygroundSession = { id: string; playground_id: string; status: string; findings_count: number; started_at: string; completed_at: string | null };

const catalog = [
  { type: "playground", id: "expenseflow", title: "ExpenseFlow", href: "/despesas" },
  { type: "playground", id: "datas", title: "Datas Bugadas", href: "/datas" },
  { type: "tool", id: "bdd", title: "Gerador BDD", href: "/bdd" },
  { type: "mission", id: "missions", title: "Missões de QA", href: "/missoes" },
];

export function WorkspaceClient({ name, email, plan, projects, drafts, favorites, progress, sessions }: { name: string; email: string; plan: string; projects: Project[]; drafts: Draft[]; favorites: Favorite[]; progress: Progress[]; sessions: PlaygroundSession[] }) {
  const [projectForm, setProjectForm] = useState(false);
  const [draftForm, setDraftForm] = useState(false);

  useEffect(() => {
    const migrated = localStorage.getItem("qa-lab-cloud-migration-v1");
    if (migrated) return;
    try {
      const ids = JSON.parse(localStorage.getItem("qa-lab-free-missions") ?? "[]");
      if (Array.isArray(ids) && ids.length) void syncLocalProgress(ids).then(() => localStorage.setItem("qa-lab-cloud-migration-v1", "done")).catch(() => undefined);
      else localStorage.setItem("qa-lab-cloud-migration-v1", "done");
    } catch { localStorage.setItem("qa-lab-cloud-migration-v1", "done"); }
  }, []);

  const favoriteIds = new Set(favorites.map((item) => `${item.resource_type}:${item.resource_id}`));
  const activeProjectCount = projects.filter((item) => item.status === "active").length;
  const canCreateProject = plan !== "free" || activeProjectCount < 3;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><div className="flex items-center gap-2"><span className="rounded-full border border-mint/25 bg-mint/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-mint">Plano {plan}</span><span className="text-xs text-[#69737E]">Workspace pessoal</span></div><h1 className="mt-4 text-4xl font-black tracking-tight text-off-white">Olá, {name || "QA"}.</h1><p className="mt-2 text-sm text-[#8B949E]">Organize sua prática e continue de onde parou.</p></div><div className="flex gap-2"><Link href="/perfil" className="inline-flex h-9 items-center rounded-lg border border-white/10 px-3 text-xs font-semibold text-[#AAB2BC] hover:border-mint/30 hover:text-mint">Perfil</Link><form action={signOut}><button className="inline-flex size-9 items-center justify-center rounded-lg border border-white/10 text-[#8B949E] hover:border-coral/30 hover:text-coral" aria-label="Sair"><LogOut className="size-4" /></button></form></div></header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Stat icon={FolderKanban} label="Projetos ativos" value={`${activeProjectCount}${plan === "free" ? "/3" : ""}`} /><Stat icon={FileText} label="Rascunhos" value={String(drafts.length)} /><Stat icon={CheckCircle2} label="Missões concluídas" value={String(progress.filter((item) => item.status === "completed").length)} /><Stat icon={Target} label="Sessões registradas" value={String(sessions.length)} /></div>

      {sessions.length > 0 && <section className="mt-10"><h2 className="text-xl font-black text-off-white">Atividade recente</h2><p className="mt-1 text-sm text-[#8B949E]">Histórico das suas sessões nos playgrounds.</p><div className="mt-4 space-y-2">{sessions.slice(0, 5).map((session) => <div key={session.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#171B21] p-4"><span className={`size-2 rounded-full ${session.status === "completed" ? "bg-neon" : "bg-coral"}`} /><div className="flex-1"><p className="text-sm font-bold text-off-white">{session.playground_id === "expenseflow" ? "ExpenseFlow" : "Datas Bugadas"}</p><p className="text-[10px] text-[#69737E]">{session.status === "completed" ? "Sessão concluída" : "Sessão em andamento"}</p></div><time className="text-xs text-[#69737E]">{new Date(session.started_at).toLocaleDateString("pt-BR")}</time></div>)}</div></section>}

      <section className="mt-10"><SectionHeader title="Projetos" description={canCreateProject ? "Contextos para agrupar sua estratégia e seus artefatos." : "O plano Free permite até três projetos ativos. Arquive um para criar outro."} action={() => setProjectForm((value) => !value)} actionLabel="Novo projeto" disabled={!canCreateProject} />
        {projectForm && <form action={createProject} className="mt-4 grid gap-3 rounded-xl border border-mint/20 bg-mint/[0.04] p-4 sm:grid-cols-[1fr_1.5fr_auto_auto]"><input name="title" required maxLength={100} placeholder="Nome do projeto" className="field" /><input name="description" maxLength={1000} placeholder="Objetivo ou contexto" className="field" /><select name="color" className="field"><option value="mint">Mint</option><option value="coral">Coral</option><option value="neon">Neon</option></select><button className="rounded-lg bg-mint px-4 text-xs font-black text-[#101319]">Criar</button></form>}
        <div className="mt-4 grid gap-4 md:grid-cols-2">{projects.filter((item) => item.status === "active").map((project) => <article key={project.id} className="rounded-xl border border-white/10 bg-[#171B21] p-5"><div className="flex items-start justify-between"><FolderKanban className={`size-5 ${project.color === "coral" ? "text-coral" : project.color === "neon" ? "text-neon" : "text-mint"}`} /><form action={archiveProject}><input type="hidden" name="id" value={project.id} /><button className="text-[#69737E] hover:text-coral" aria-label={`Arquivar ${project.title}`}><Archive className="size-4" /></button></form></div><h3 className="mt-5 font-bold text-off-white">{project.title}</h3><p className="mt-2 min-h-10 text-sm leading-5 text-[#8B949E]">{project.description || "Sem descrição."}</p><p className="mt-4 text-[10px] text-[#69737E]">Atualizado em {new Date(project.updated_at).toLocaleDateString("pt-BR")}</p></article>)}</div>
        {!projects.some((item) => item.status === "active") && <Empty text="Crie seu primeiro projeto para organizar uma prática, produto ou estudo." />}
      </section>

      <section className="mt-10"><SectionHeader title="Rascunhos" description="Notas, bugs, casos e planos que ainda estão em construção." action={() => setDraftForm((value) => !value)} actionLabel="Novo rascunho" />
        {draftForm && <form action={createDraft} className="mt-4 space-y-3 rounded-xl border border-mint/20 bg-mint/[0.04] p-4"><div className="grid gap-3 sm:grid-cols-3"><input name="title" required maxLength={120} placeholder="Título" className="field sm:col-span-2" /><select name="kind" className="field"><option value="note">Nota</option><option value="bug_report">Bug report</option><option value="test_case">Caso de teste</option><option value="gherkin">Gherkin</option><option value="test_plan">Plano de teste</option></select></div><textarea name="content" rows={5} maxLength={20000} placeholder="Comece a escrever..." className="field w-full resize-y" /><button className="rounded-lg bg-mint px-4 py-2.5 text-xs font-black text-[#101319]">Salvar rascunho</button></form>}
        <div className="mt-4 space-y-3">{drafts.map((draft) => <article key={draft.id} className="flex items-start gap-4 rounded-xl border border-white/10 bg-[#171B21] p-4"><FileText className="mt-0.5 size-4 shrink-0 text-neon" /><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h3 className="truncate text-sm font-bold text-off-white">{draft.title}</h3><span className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] uppercase text-[#69737E]">{draft.kind.replace("_", " ")}</span></div><p className="mt-1 line-clamp-2 whitespace-pre-wrap text-xs leading-5 text-[#8B949E]">{draft.content || "Rascunho vazio"}</p></div><form action={deleteDraft}><input type="hidden" name="id" value={draft.id} /><button className="text-[#69737E] hover:text-coral" aria-label={`Excluir ${draft.title}`}><Trash2 className="size-4" /></button></form></article>)}</div>
        {!drafts.length && <Empty text="Seus bug reports, cenários e anotações podem começar aqui." />}
      </section>

      <section className="mt-10"><div className="flex items-end justify-between"><div><h2 className="text-xl font-black text-off-white">Acesso rápido</h2><p className="mt-1 text-sm text-[#8B949E]">Favorite os recursos que mais usa.</p></div><span className="text-xs text-[#69737E]">{email}</span></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{catalog.map((item) => { const active = favoriteIds.has(`${item.type}:${item.id}`); return <article key={item.id} className="rounded-xl border border-white/10 bg-[#171B21] p-4"><form action={toggleFavorite.bind(null, item.type, item.id, item.title, item.href)} className="flex justify-end"><button aria-label={`${active ? "Desfavoritar" : "Favoritar"} ${item.title}`}><Heart className={`size-4 ${active ? "fill-coral text-coral" : "text-[#69737E] hover:text-coral"}`} /></button></form><Link href={item.href} className="group mt-6 flex items-end justify-between"><div><p className="text-sm font-bold text-off-white">{item.title}</p><p className="mt-1 text-[10px] uppercase text-[#69737E]">{item.type}</p></div><ArrowRight className="size-4 text-[#69737E] group-hover:translate-x-1 group-hover:text-mint" /></Link></article>; })}</div></section>

      <section className="mt-10 rounded-2xl border border-neon/20 bg-neon/[0.05] p-6"><Sparkles className="size-5 text-neon" /><h2 className="mt-4 text-lg font-bold text-off-white">Test Design Studio</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#8B949E]">O próximo produto do Workspace reunirá riscos, cenários, planos e exportações em um único fluxo. Sua base de projetos já está preparada para recebê-lo.</p></section>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Target; label: string; value: string }) { return <div className="rounded-xl border border-white/10 bg-[#171B21] p-4"><Icon className="size-4 text-mint" /><p className="mt-4 text-2xl font-black text-off-white">{value}</p><p className="mt-1 text-xs text-[#69737E]">{label}</p></div>; }
function SectionHeader({ title, description, action, actionLabel, disabled = false }: { title: string; description: string; action: () => void; actionLabel: string; disabled?: boolean }) { return <div className="flex items-end justify-between gap-4"><div><h2 className="text-xl font-black text-off-white">{title}</h2><p className="mt-1 text-sm text-[#8B949E]">{description}</p></div><button type="button" onClick={action} disabled={disabled} className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-mint/25 px-3 text-xs font-bold text-mint hover:bg-mint/10 disabled:cursor-not-allowed disabled:opacity-40"><Plus className="size-3.5" />{actionLabel}</button></div>; }
function Empty({ text }: { text: string }) { return <div className="mt-4 rounded-xl border border-dashed border-white/10 p-8 text-center"><BookOpen className="mx-auto size-5 text-[#69737E]" /><p className="mt-3 text-sm text-[#69737E]">{text}</p></div>; }
