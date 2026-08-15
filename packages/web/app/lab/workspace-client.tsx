"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Archive,
  ArrowRight,
  BookOpen,
  Bug,
  CheckCircle2,
  ClipboardCheck,
  Code2,
  FileText,
  Filter,
  FolderKanban,
  GraduationCap,
  Heart,
  Layers3,
  ListChecks,
  LogOut,
  PlayCircle,
  Plus,
  Route,
  SearchCode,
  Sparkles,
  Target,
  Trash2,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import {
  archiveProject,
  completeEvolutionStep,
  createDraft,
  createProject,
  deleteDraft,
  signOut,
  syncLocalProgress,
  toggleFavorite,
} from "./actions";
import { DELIVERABLES_KEY, emptyDeliverables, parseDeliverables, type ChallengeDeliverables } from "@/lib/challenge-deliverables";
import { buildEvolutionPlan, buildEvolutionSummary, type EvolutionIconKey } from "@/lib/evolution-plan";

type Project = { id: string; title: string; description: string; status: string; color: string; updated_at: string };
type Draft = { id: string; title: string; content: string; kind: string; updated_at: string };
type Favorite = { id: string; resource_type: string; resource_id: string; title: string; href: string };
type Progress = { mission_id: string; status: string };
type PlaygroundSession = { id: string; playground_id: string; status: string; findings_count: number; started_at: string; completed_at: string | null };
type Tone = "coral" | "neon" | "mint" | "blue";
type LabCategory = "Produto e requisitos" | "Defeitos e investigacao" | "Entrega e automacao" | "Carreira e operacao";

type LabModule = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  tone: Tone;
  status: string;
  category: LabCategory;
  outcome: string;
};

const labModules = [
  { id: "refinement", title: "Refinement Lab", description: "Avalie, edite e melhore PBIs e bugs mal escritos em formato de cards.", href: "/lab/refinamento", icon: Filter, tone: "neon", status: "Real lab", category: "Produto e requisitos", outcome: "Clareza de demanda" },
  { id: "criteria", title: "Acceptance Criteria Lab", description: "Transforme PBIs vagos em criterios testaveis, exemplos e perguntas abertas.", href: "/lab/criterios", icon: ListChecks, tone: "blue", status: "Real lab", category: "Produto e requisitos", outcome: "Criterios testaveis" },
  { id: "stories", title: "Historias", description: "Organize historias, criterios e fluxo de trabalho em um board de produto.", href: "/lab/historias", icon: Route, tone: "blue", status: "Board", category: "Produto e requisitos", outcome: "Fluxo de produto" },
  { id: "studio", title: "Test Design Studio", description: "Transforme contexto, riscos e requisitos em cenarios, casos e plano de teste.", href: "/lab/studio", icon: Sparkles, tone: "neon", status: "Studio", category: "Produto e requisitos", outcome: "Design de teste" },
  { id: "triage", title: "Bug Triage Lab", description: "Classifique bugs, defina prioridade, dono e proximo passo com evidencias.", href: "/lab/triagem", icon: Bug, tone: "coral", status: "Real lab", category: "Defeitos e investigacao", outcome: "Decisao de bug" },
  { id: "logs", title: "Log Investigation Lab", description: "Investigue logs, metricas e relatos para formar hipotese e acao.", href: "/lab/logs", icon: SearchCode, tone: "mint", status: "Real lab", category: "Defeitos e investigacao", outcome: "Analise tecnica" },
  { id: "execution", title: "Execution & Defect Hub", description: "Execute casos do Studio, registre evidencias e acompanhe defeitos.", href: "/lab/execution", icon: Target, tone: "mint", status: "Hub", category: "Defeitos e investigacao", outcome: "Evidencia e defeitos" },
  { id: "api", title: "API Lab", description: "Teste endpoints, leia respostas e transforme falhas em bug reports.", href: "/api-playground", icon: Code2, tone: "mint", status: "Ferramenta", category: "Defeitos e investigacao", outcome: "Teste de API" },
  { id: "playground", title: "Playground", description: "Pratique em sistemas com falhas intencionais e gere seus primeiros entregaveis.", href: "/playground", icon: PlayCircle, tone: "coral", status: "Aberto", category: "Entrega e automacao", outcome: "Pratica completa" },
  { id: "cicd", title: "CI/CD Lab", description: "Diagnostique pipelines, quality gates, rollback e decisoes de entrega.", href: "/lab/cicd", icon: Workflow, tone: "coral", status: "Lab", category: "Entrega e automacao", outcome: "Decisao de release" },
  { id: "people", title: "People Lab", description: "Treine comunicacao, conflito, alinhamento e decisoes dificeis de QA.", href: "/lab/pessoas", icon: Users, tone: "blue", status: "Lab", category: "Carreira e operacao", outcome: "Comunicacao" },
  { id: "skills", title: "Competencias", description: "Veja sinais de progresso por pratica, entregaveis, execucao e colaboracao.", href: "/lab/competencias", icon: CheckCircle2, tone: "mint", status: "Progresso", category: "Carreira e operacao", outcome: "Mapa de evolucao" },
] satisfies LabModule[];

const categoryOrder: LabCategory[] = ["Produto e requisitos", "Defeitos e investigacao", "Entrega e automacao", "Carreira e operacao"];

const categoryDescriptions: Record<LabCategory, string> = {
  "Produto e requisitos": "Para transformar demanda ruim em trabalho claro, testavel e negociavel.",
  "Defeitos e investigacao": "Para analisar falhas, registrar evidencia e decidir prioridade sem chute.",
  "Entrega e automacao": "Para praticar execucao ponta a ponta, pipeline e decisao de entrega.",
  "Carreira e operacao": "Para acompanhar progresso, comunicacao e comportamento profissional.",
};

const recommendedJourney = [
  { title: "Refinar demanda", description: "Comece corrigindo PBIs e bugs mal escritos.", href: "/lab/refinamento", icon: Filter, tone: "neon" as Tone },
  { title: "Definir aceite", description: "Converta a demanda em criterios e exemplos.", href: "/lab/criterios", icon: ListChecks, tone: "blue" as Tone },
  { title: "Triar defeitos", description: "Priorize impacto, urgencia, dono e proximo passo.", href: "/lab/triagem", icon: Bug, tone: "coral" as Tone },
  { title: "Investigar logs", description: "Use sinais tecnicos para sustentar a decisao.", href: "/lab/logs", icon: SearchCode, tone: "mint" as Tone },
];

const toneClass = {
  coral: "border-coral/20 bg-coral/[0.04] text-coral hover:border-coral/40",
  neon: "border-neon/20 bg-neon/[0.04] text-neon hover:border-neon/40",
  mint: "border-mint/20 bg-mint/[0.04] text-mint hover:border-mint/40",
  blue: "border-[#7BA7E8]/20 bg-[#7BA7E8]/[0.04] text-[#9BC0F5] hover:border-[#7BA7E8]/40",
} as const;

const toneBadge = {
  coral: "border-coral/25 bg-coral/10 text-coral",
  neon: "border-neon/25 bg-neon/10 text-neon",
  mint: "border-mint/25 bg-mint/10 text-mint",
  blue: "border-[#7BA7E8]/25 bg-[#7BA7E8]/10 text-[#9BC0F5]",
} as const;

const evolutionIcons: Record<EvolutionIconKey, LucideIcon> = {
  folder: FolderKanban,
  clipboard: ClipboardCheck,
  graduation: GraduationCap,
  layers: Layers3,
  file: FileText,
  target: Target,
  workflow: Workflow,
  check: CheckCircle2,
  users: Users,
};

const catalog = labModules.map((item) => ({ type: item.status, id: item.id, title: item.title, href: item.href }));

export function WorkspaceClient({ name, email, plan, projects, drafts, favorites, progress, sessions, initialDeliverables = emptyDeliverables, localMode = false }: { name: string; email: string; plan: string; projects: Project[]; drafts: Draft[]; favorites: Favorite[]; progress: Progress[]; sessions: PlaygroundSession[]; initialDeliverables?: ChallengeDeliverables; localMode?: boolean }) {
  const [projectForm, setProjectForm] = useState(false);
  const [draftForm, setDraftForm] = useState(false);
  const [deliverables, setDeliverables] = useState<ChallengeDeliverables>(initialDeliverables);

  useEffect(() => {
    if (localMode) return;
    const migrated = localStorage.getItem("qa-lab-cloud-migration-v1");
    if (migrated) return;
    try {
      const ids = JSON.parse(localStorage.getItem("qa-lab-free-missions") ?? "[]");
      if (Array.isArray(ids) && ids.length) void syncLocalProgress(ids).then(() => localStorage.setItem("qa-lab-cloud-migration-v1", "done")).catch(() => undefined);
      else localStorage.setItem("qa-lab-cloud-migration-v1", "done");
    } catch { localStorage.setItem("qa-lab-cloud-migration-v1", "done"); }
  }, [localMode]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDeliverables(mergeDeliverables(initialDeliverables, parseDeliverables(localStorage.getItem(DELIVERABLES_KEY))));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [initialDeliverables]);

  const favoriteIds = new Set(favorites.map((item) => `${item.resource_type}:${item.resource_id}`));
  const activeProjectCount = projects.filter((item) => item.status === "active").length;
  const canCreateProject = plan !== "free" || activeProjectCount < 3;
  const evolutionPlan = buildEvolutionPlan({ projects, drafts, progress, sessions, deliverables });
  const evolutionSummary = buildEvolutionSummary(evolutionPlan);
  const nextStep = evolutionSummary.next ?? evolutionPlan.find((step) => !step.done) ?? evolutionPlan[0];
  const completedMissions = progress.filter((item) => item.status === "completed").length;
  const groupedModules = useMemo(() => categoryOrder.map((category) => ({ category, modules: labModules.filter((item) => item.category === category) })), []);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-mint/25 bg-mint/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-mint">Plano {localMode ? "local" : plan}</span>
            <span className="text-xs text-[#69737E]">Workspace pessoal</span>
          </div>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-off-white">Ola, {name || "QA"}.</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8B949E]">{localMode ? "Modo local ativo. O app abre normalmente sem Supabase." : "Continue pelo proximo exercicio recomendado ou escolha um modulo por objetivo."}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/perfil" className="inline-flex h-9 items-center rounded-lg border border-white/10 px-3 text-xs font-semibold text-[#AAB2BC] hover:border-mint/30 hover:text-mint">Perfil</Link>
          {localMode ? <Link href="/playground" className="inline-flex h-9 items-center rounded-lg border border-white/10 px-3 text-xs font-semibold text-[#AAB2BC] hover:border-mint/30 hover:text-mint">Abrir Playground</Link> : <form action={signOut}><button className="inline-flex size-9 items-center justify-center rounded-lg border border-white/10 text-[#8B949E] hover:border-coral/30 hover:text-coral" aria-label="Sair"><LogOut className="size-4" /></button></form>}
        </div>
      </header>

      <section className="mt-8 grid gap-4 lg:grid-cols-[1.35fr_.85fr]">
        <article className="rounded-2xl border border-neon/20 bg-[#171B21] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-neon">Continuar agora</p>
              <h2 className="mt-3 text-2xl font-black text-off-white">{nextStep?.title ?? "Escolha uma missao"}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8B949E]">{nextStep?.reason ?? "O Lab monta uma rota de pratica com conteudo, tarefa e evidencia."}</p>
            </div>
            <div className="w-full rounded-xl border border-white/10 bg-[#101319] p-4 sm:w-56">
              <div className="flex items-center justify-between text-xs"><span className="font-bold text-[#AAB2BC]">Evolucao</span><strong className="text-neon">{evolutionSummary.done}/{evolutionSummary.total}</strong></div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-neon" style={{ width: `${evolutionSummary.percent}%` }} /></div>
              <p className="mt-3 text-[11px] leading-4 text-[#69737E]">Plano ajustado pelo que voce ja criou, concluiu e praticou.</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {nextStep && <Link href={`/lab/evolucao/${nextStep.id}`} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-neon px-4 text-xs font-black text-[#101319] hover:bg-neon/90">Abrir missao guiada<ArrowRight className="size-4" /></Link>}
            {nextStep && <Link href={nextStep.href} className="inline-flex h-10 items-center justify-center rounded-lg border border-mint/25 px-4 text-xs font-bold text-mint hover:bg-mint/10">Abrir ambiente</Link>}
            <Link href="/lab/refinamento" className="inline-flex h-10 items-center justify-center rounded-lg border border-white/10 px-4 text-xs font-bold text-[#AAB2BC] hover:border-neon/30 hover:text-neon">Treinar PBIs ruins</Link>
          </div>
        </article>

        <aside className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <Stat icon={FolderKanban} label="Projetos ativos" value={`${activeProjectCount}${plan === "free" ? "/3" : ""}`} />
          <Stat icon={FileText} label="Rascunhos" value={String(drafts.length)} />
          <Stat icon={CheckCircle2} label="Missoes concluidas" value={String(completedMissions)} />
          <Stat icon={Target} label="Sessoes registradas" value={String(sessions.length)} />
        </aside>
      </section>

      <section className="mt-10">
        <SectionTitle eyebrow="Trilha recomendada" title="O caminho mais pratico para evoluir" description="Use esta sequencia quando quiser um treino completo: melhorar a demanda, tornar aceite testavel, decidir bugs e sustentar a investigacao." />
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {recommendedJourney.map((item, index) => <JourneyCard key={item.href} index={index + 1} {...item} />)}
        </div>
      </section>

      <section className="mt-10">
        <SectionTitle eyebrow="Modulos do Lab" title="Escolha por objetivo" description="Cada grupo resolve um tipo de trabalho de QA. Os labs principais usam massa grande de casos para o usuario avaliar, editar e justificar." />
        <div className="mt-5 space-y-5">
          {groupedModules.map(({ category, modules }) => (
            <div key={category} className="rounded-2xl border border-white/10 bg-[#11151B] p-4 sm:p-5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-lg font-black text-off-white">{category}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#8B949E]">{categoryDescriptions[category]}</p>
                </div>
                <span className="text-xs text-[#69737E]">{modules.length} modulos</span>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {modules.map((item) => <ModuleCard key={item.id} item={item} />)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <SectionTitle eyebrow="Plano de evolucao" title="Missoes guiadas" description="O Lab combina conteudo, pratica e evidencia. Cada etapa termina com algo que pode virar revisao, portfolio ou plano de melhoria." />
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {evolutionPlan.map((step) => {
            const Icon = evolutionIcons[step.icon];
            return (
              <article key={step.id} className={`flex min-h-80 flex-col rounded-2xl border p-5 ${step.done ? "border-neon/30 bg-neon/[.045]" : "border-white/10 bg-[#171B21]"}`}>
                <div className="flex items-start justify-between gap-3"><div className="flex size-10 items-center justify-center rounded-xl border border-neon/20 bg-neon/10 text-neon"><Icon className="size-5" /></div><span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#AAB2BC]">{step.done ? "Concluido" : step.status}</span></div>
                <p className="mt-5 text-[10px] font-bold uppercase tracking-[.18em] text-mint">{step.competency}</p>
                <h3 className="mt-2 text-lg font-black text-off-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#8B949E]">{step.reason}</p>
                <div className="mt-4 space-y-2 rounded-xl border border-white/10 bg-[#101319] p-4 text-xs leading-5 text-[#AAB2BC]"><p><strong className="text-off-white">Conteudo:</strong> {step.content}</p><p><strong className="text-off-white">Evidencia:</strong> {step.evidence}</p></div>
                <div className="mt-auto grid gap-2 pt-5">
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"><Link href={step.contentHref} className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-white/10 px-3 text-xs font-bold text-[#AAB2BC] hover:border-neon/30 hover:text-neon">{step.contentCta}</Link><Link href={`/lab/evolucao/${step.id}`} className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-neon/25 px-3 text-xs font-black text-neon hover:bg-neon/10">Entrar no lab<ArrowRight className="size-3.5" /></Link></div>
                  {!localMode && <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"><Link href={step.href} className="inline-flex h-9 w-full items-center justify-center rounded-lg border border-mint/25 px-3 text-xs font-bold text-mint hover:bg-mint/10">Abrir ambiente</Link><form action={completeEvolutionStep}><input type="hidden" name="step_id" value={step.id} /><button disabled={step.done} className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-mint px-3 text-xs font-black text-[#101319] disabled:cursor-not-allowed disabled:opacity-45">{step.done ? "Feito" : "Marcar feito"}</button></form></div>}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {sessions.length > 0 && <section className="mt-10"><h2 className="text-xl font-black text-off-white">Atividade recente</h2><p className="mt-1 text-sm text-[#8B949E]">Historico das suas sessoes nos playgrounds.</p><div className="mt-4 space-y-2">{sessions.slice(0, 5).map((session) => <div key={session.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#171B21] p-4"><span className={`size-2 rounded-full ${session.status === "completed" ? "bg-neon" : "bg-coral"}`} /><div className="flex-1"><p className="text-sm font-bold text-off-white">{session.playground_id === "expenseflow" ? "ExpenseFlow" : "Datas Bugadas"}</p><p className="text-[10px] text-[#69737E]">{session.status === "completed" ? "Sessao concluida" : "Sessao em andamento"}</p></div><time className="text-xs text-[#69737E]">{new Date(session.started_at).toLocaleDateString("pt-BR")}</time></div>)}</div></section>}

      <section className="mt-10"><SectionHeader title="Projetos" description={localMode ? "Modo local: veja a estrutura do workspace sem salvar na nuvem." : canCreateProject ? "Contextos para agrupar sua estrategia e seus artefatos." : "O plano Free permite ate tres projetos ativos. Arquive um para criar outro."} action={() => setProjectForm((value) => !value)} actionLabel="Novo projeto" disabled={localMode || !canCreateProject} />
        {!localMode && projectForm && <form action={createProject} className="mt-4 grid gap-3 rounded-xl border border-mint/20 bg-mint/[0.04] p-4 sm:grid-cols-[1fr_1.5fr_auto_auto]"><input name="title" required maxLength={100} placeholder="Nome do projeto" className="field" /><input name="description" maxLength={1000} placeholder="Objetivo ou contexto" className="field" /><select name="color" className="field"><option value="mint">Mint</option><option value="coral">Coral</option><option value="neon">Neon</option></select><button className="rounded-lg bg-mint px-4 text-xs font-black text-[#101319]">Criar</button></form>}
        <div className="mt-4 grid gap-4 md:grid-cols-2">{projects.filter((item) => item.status === "active").map((project) => <article key={project.id} className="rounded-xl border border-white/10 bg-[#171B21] p-5"><div className="flex items-start justify-between"><FolderKanban className={`size-5 ${project.color === "coral" ? "text-coral" : project.color === "neon" ? "text-neon" : "text-mint"}`} />{localMode ? <span className="text-[10px] uppercase tracking-wider text-[#69737E]">Local</span> : <form action={archiveProject}><input type="hidden" name="id" value={project.id} /><button className="text-[#69737E] hover:text-coral" aria-label={`Arquivar ${project.title}`}><Archive className="size-4" /></button></form>}</div><h3 className="mt-5 font-bold text-off-white">{project.title}</h3><p className="mt-2 min-h-10 text-sm leading-5 text-[#8B949E]">{project.description || "Sem descricao."}</p><p className="mt-4 text-[10px] text-[#69737E]">Atualizado em {new Date(project.updated_at).toLocaleDateString("pt-BR")}</p></article>)}</div>
        {!projects.some((item) => item.status === "active") && <Empty text="Crie seu primeiro projeto para organizar uma pratica, produto ou estudo." />}
      </section>

      <section className="mt-10"><SectionHeader title="Rascunhos" description="Notas, bugs, casos e planos que ainda estao em construcao." action={() => setDraftForm((value) => !value)} actionLabel="Novo rascunho" />
        {!localMode && draftForm && <form action={createDraft} className="mt-4 space-y-3 rounded-xl border border-mint/20 bg-mint/[0.04] p-4"><div className="grid gap-3 sm:grid-cols-3"><input name="title" required maxLength={120} placeholder="Titulo" className="field sm:col-span-2" /><select name="kind" className="field"><option value="note">Nota</option><option value="bug_report">Bug report</option><option value="test_case">Caso de teste</option><option value="gherkin">Gherkin</option><option value="test_plan">Plano de teste</option></select></div><textarea name="content" rows={5} maxLength={20000} placeholder="Comece a escrever..." className="field w-full resize-y" /><button className="rounded-lg bg-mint px-4 py-2.5 text-xs font-black text-[#101319]">Salvar rascunho</button></form>}
        <div className="mt-4 space-y-3">{drafts.map((draft) => <article key={draft.id} className="flex items-start gap-4 rounded-xl border border-white/10 bg-[#171B21] p-4"><FileText className="mt-0.5 size-4 shrink-0 text-neon" /><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h3 className="truncate text-sm font-bold text-off-white">{draft.title}</h3><span className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] uppercase text-[#69737E]">{draft.kind.replace("_", " ")}</span></div><p className="mt-1 line-clamp-2 whitespace-pre-wrap text-xs leading-5 text-[#8B949E]">{draft.content || "Rascunho vazio"}</p></div>{localMode ? null : <form action={deleteDraft}><input type="hidden" name="id" value={draft.id} /><button className="text-[#69737E] hover:text-coral" aria-label={`Excluir ${draft.title}`}><Trash2 className="size-4" /></button></form>}</article>)}</div>
        {!drafts.length && <Empty text="Seus bug reports, cenarios e anotacoes podem comecar aqui." />}
      </section>

      <section className="mt-10"><div className="flex items-end justify-between"><div><h2 className="text-xl font-black text-off-white">Acesso rapido</h2><p className="mt-1 text-sm text-[#8B949E]">Favorite os recursos que mais usa.</p></div><span className="text-xs text-[#69737E]">{email}</span></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{catalog.map((item) => { const active = favoriteIds.has(`${item.type}:${item.id}`); return <article key={item.id} className="rounded-xl border border-white/10 bg-[#171B21] p-4">{localMode ? <div className="flex justify-end"><Heart className="size-4 text-[#69737E]" /></div> : <form action={toggleFavorite.bind(null, item.type, item.id, item.title, item.href)} className="flex justify-end"><button aria-label={`${active ? "Desfavoritar" : "Favoritar"} ${item.title}`}><Heart className={`size-4 ${active ? "fill-coral text-coral" : "text-[#69737E] hover:text-coral"}`} /></button></form>}<Link href={item.href} className="group mt-6 flex items-end justify-between"><div><p className="text-sm font-bold text-off-white">{item.title}</p><p className="mt-1 text-[10px] uppercase text-[#69737E]">{item.type}</p></div><ArrowRight className="size-4 text-[#69737E] group-hover:translate-x-1 group-hover:text-mint" /></Link></article>; })}</div></section>
    </div>
  );
}

function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-mint">{eyebrow}</p><h2 className="mt-2 text-2xl font-black text-off-white">{title}</h2></div><p className="max-w-xl text-sm leading-6 text-[#8B949E]">{description}</p></div>;
}

function JourneyCard({ index, title, description, href, icon: Icon, tone }: { index: number; title: string; description: string; href: string; icon: LucideIcon; tone: Tone }) {
  return <Link href={href} className={`group flex min-h-44 flex-col rounded-2xl border p-5 transition ${toneClass[tone]}`}><div className="flex items-start justify-between"><span className={`inline-flex size-8 items-center justify-center rounded-lg border text-xs font-black ${toneBadge[tone]}`}>{index}</span><Icon className="size-5" /></div><h3 className="mt-5 text-base font-black text-off-white">{title}</h3><p className="mt-2 flex-1 text-sm leading-6 text-[#8B949E]">{description}</p><span className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide">Abrir treino <ArrowRight className="size-4 transition group-hover:translate-x-1" /></span></Link>;
}

function ModuleCard({ item }: { item: LabModule }) {
  const Icon = item.icon;
  return <Link href={item.href} className={`group flex min-h-52 flex-col rounded-xl border p-4 transition ${toneClass[item.tone]}`}><div className="flex items-start justify-between gap-3"><Icon className="size-5 shrink-0" /><span className="rounded-full border border-current/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">{item.status}</span></div><h4 className="mt-5 text-base font-black text-off-white">{item.title}</h4><p className="mt-2 flex-1 text-sm leading-6 text-[#8B949E]">{item.description}</p><div className="mt-4 flex items-center justify-between gap-3"><span className="text-[10px] font-bold uppercase tracking-wider text-[#69737E]">{item.outcome}</span><ArrowRight className="size-4 transition group-hover:translate-x-1" /></div></Link>;
}

function Stat({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) { return <div className="rounded-xl border border-white/10 bg-[#171B21] p-4"><Icon className="size-4 text-mint" /><p className="mt-4 text-2xl font-black text-off-white">{value}</p><p className="mt-1 text-xs text-[#69737E]">{label}</p></div>; }
function SectionHeader({ title, description, action, actionLabel, disabled = false }: { title: string; description: string; action: () => void; actionLabel: string; disabled?: boolean }) { return <div className="flex items-end justify-between gap-4"><div><h2 className="text-xl font-black text-off-white">{title}</h2><p className="mt-1 text-sm text-[#8B949E]">{description}</p></div><button type="button" onClick={action} disabled={disabled} className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-mint/25 px-3 text-xs font-bold text-mint hover:bg-mint/10 disabled:cursor-not-allowed disabled:opacity-40"><Plus className="size-3.5" />{actionLabel}</button></div>; }
function Empty({ text }: { text: string }) { return <div className="mt-4 rounded-xl border border-dashed border-white/10 p-8 text-center"><BookOpen className="mx-auto size-5 text-[#69737E]" /><p className="mt-3 text-sm text-[#69737E]">{text}</p></div>; }
function mergeDeliverables(cloud: ChallengeDeliverables, local: ChallengeDeliverables): ChallengeDeliverables {
  return {
    bugs: mergeById(cloud.bugs, local.bugs),
    bdd: mergeById(cloud.bdd, local.bdd),
    e2e: mergeById(cloud.e2e, local.e2e),
  };
}

function mergeById<T extends { id: string }>(cloud: T[], local: T[]) {
  const items = new Map<string, T>();
  for (const item of cloud) items.set(item.id, item);
  for (const item of local) items.set(item.id, item);
  return [...items.values()];
}
