"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Clipboard, Download, FileCode2, FolderKanban, Plus, Save, Trash2 } from "lucide-react";
import { buildGherkin, type BddScenario } from "@/lib/bdd/gherkin";

type Draft = { id: string; title: string; content: string; updated_at: string };
type ApiResult<T> = { data?: T; error?: { message?: string } };

const blankScenario = (): BddScenario => ({ id: crypto.randomUUID(), title: "", given: "", when: "", then: "" });

export function BddGenerator({ initialDrafts, boardId, signedIn }: { initialDrafts: Draft[]; boardId: string | null; signedIn: boolean }) {
  const router = useRouter();
  const [feature, setFeature] = useState("");
  const [context, setContext] = useState("");
  const [scenarios, setScenarios] = useState<BddScenario[]>([{ id: "first", title: "", given: "", when: "", then: "" }]);
  const [output, setOutput] = useState("");
  const [drafts, setDrafts] = useState(initialDrafts);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [busy, setBusy] = useState<"save" | "board" | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [createdCard, setCreatedCard] = useState<string | null>(null);

  function updateScenario(id: string, field: keyof Omit<BddScenario, "id">, value: string) {
    setScenarios((current) => current.map((scenario) => scenario.id === id ? { ...scenario, [field]: value } : scenario));
  }

  function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = buildGherkin(feature, context, scenarios);
    if (!next || scenarios.some((scenario) => !scenario.title.trim() || !scenario.given.trim() || !scenario.when.trim() || !scenario.then.trim())) {
      setError("Preencha a funcionalidade e todos os campos de cada cenário.");
      return;
    }
    setOutput(next);
    setCreatedCard(null);
    setError("");
    setMessage(`${scenarios.length} cenário${scenarios.length === 1 ? "" : "s"} gerado${scenarios.length === 1 ? "" : "s"}. Revise o resultado antes de salvar.`);
  }

  async function copy() {
    if (!output.trim()) return;
    try {
      await navigator.clipboard.writeText(output);
      setMessage("Gherkin copiado.");
      setError("");
    } catch {
      setError("Não foi possível copiar. Selecione o texto e copie manualmente.");
    }
  }

  function download() {
    if (!output.trim()) return;
    const blob = new Blob([output.endsWith("\n") ? output : `${output}\n`], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${feature.trim().toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "cenario"}.feature`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage("Arquivo .feature baixado.");
  }

  async function save() {
    if (!output.trim() || !signedIn || busy) return;
    setBusy("save");
    setError("");
    try {
      const response = await fetch("/api/v1/bdd-drafts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: draftId, title: feature.trim() || "Cenário BDD", content: output }),
      });
      const result = await response.json() as ApiResult<Draft>;
      if (!response.ok || !result.data) throw new Error(result.error?.message ?? "Não foi possível salvar.");
      const saved = result.data;
      setDraftId(saved.id);
      setDrafts((current) => [saved, ...current.filter((draft) => draft.id !== saved.id)]);
      setMessage("Rascunho salvo na sua área do aluno.");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível salvar.");
    } finally {
      setBusy(null);
    }
  }

  async function createCard() {
    if (!boardId || !output.trim() || busy) return;
    if (output.length > 10000) {
      setError("O card aceita até 10.000 caracteres. Resuma o Gherkin antes de enviá-lo ao board.");
      return;
    }
    setBusy("board");
    setError("");
    try {
      const response = await fetch(`/api/v1/boards/${boardId}/items`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: `Testar ${feature.trim() || "cenário BDD"}`.slice(0, 180), type: "test", priority: "medium", description: output }),
      });
      const result = await response.json() as ApiResult<{ key: string }>;
      if (!response.ok || !result.data) throw new Error(result.error?.message ?? "Não foi possível criar o card.");
      setCreatedCard(result.data.key);
      setMessage(`Card ${result.data.key} criado no board.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível criar o card.");
    } finally {
      setBusy(null);
    }
  }

  function openDraft(draft: Draft) {
    setFeature(draft.title);
    setContext("");
    setScenarios([{ id: "first", title: "", given: "", when: "", then: "" }]);
    setOutput(draft.content);
    setDraftId(draft.id);
    setCreatedCard(null);
    setMessage("Rascunho carregado. Edite o Gherkin diretamente no resultado.");
    setError("");
  }

  function newDraft() {
    setFeature("");
    setContext("");
    setScenarios([{ id: "first", title: "", given: "", when: "", then: "" }]);
    setOutput("");
    setDraftId(null);
    setCreatedCard(null);
    setMessage("");
    setError("");
  }

  return <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Link href="/lab" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#AAB2BC] hover:text-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint"><ArrowLeft className="size-4" aria-hidden="true" /> Voltar ao workspace</Link>
      <Link href="/boards" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-mint/30 px-4 text-sm font-bold text-mint hover:bg-mint/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint"><FolderKanban className="size-4" aria-hidden="true" /> Abrir board <ArrowRight className="size-4" aria-hidden="true" /></Link>
    </div>

    <header className="mt-8 border-b border-white/10 pb-7">
      <p className="inline-flex items-center gap-2 text-sm font-bold text-neon"><FileCode2 className="size-4" aria-hidden="true" /> Gerador de BDD</p>
      <h1 className="mt-3 text-3xl font-black tracking-tight text-off-white sm:text-4xl">Da regra ao cenário de teste.</h1>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-[#AAB2BC]">Descreva comportamentos observáveis, gere Gherkin em português e revise o resultado com seu time. Cada cenário completo vira um bloco Dado, Quando, Então.</p>
    </header>

    <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,.85fr)]">
      <div>
        <form onSubmit={generate} className="space-y-5">
          <section className="rounded-xl border border-white/10 bg-[#171B21] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4"><h2 className="text-lg font-bold text-off-white">Funcionalidade</h2><span className="text-xs text-[#8B949E]">1 de 2</span></div>
            <label className="mt-5 block text-sm font-semibold text-[#D5DCE3]" htmlFor="bdd-feature">Nome da funcionalidade</label>
            <input id="bdd-feature" className="field mt-2 w-full" value={feature} onChange={(event) => setFeature(event.target.value)} maxLength={120} required placeholder="Ex.: Recuperação de senha" />
            <label className="mt-4 block text-sm font-semibold text-[#D5DCE3]" htmlFor="bdd-context">Regra ou contexto (opcional)</label>
            <textarea id="bdd-context" className="field mt-2 w-full resize-y" rows={3} value={context} onChange={(event) => setContext(event.target.value)} maxLength={500} placeholder="Ex.: Uma conta pode redefinir a senha por um link válido." />
          </section>

          <section className="rounded-xl border border-white/10 bg-[#171B21] p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-bold text-off-white">Cenários</h2><p className="mt-1 text-xs text-[#8B949E]">Escreva um exemplo por comportamento.</p></div><span className="text-xs text-[#8B949E]">2 de 2</span></div>
            <div className="mt-5 space-y-5">{scenarios.map((scenario, index) => <fieldset key={scenario.id} className="rounded-lg border border-white/10 bg-[#101319] p-4">
              <legend className="px-2 text-sm font-bold text-neon">Cenário {index + 1}</legend>
              <div className="flex justify-end"><button type="button" disabled={scenarios.length === 1} onClick={() => setScenarios((current) => current.filter((item) => item.id !== scenario.id))} className="inline-flex min-h-10 items-center gap-1 rounded-md px-2 text-xs text-[#AAB2BC] hover:text-coral disabled:cursor-not-allowed disabled:opacity-40" aria-label={`Remover cenário ${index + 1}`}><Trash2 className="size-3.5" aria-hidden="true" /> Remover</button></div>
              <label className="block text-xs font-semibold text-[#D5DCE3]" htmlFor={`title-${scenario.id}`}>Título</label>
              <input id={`title-${scenario.id}`} className="field mt-2 w-full" required maxLength={120} value={scenario.title} onChange={(event) => updateScenario(scenario.id, "title", event.target.value)} placeholder="Ex.: Redefinir senha com link válido" />
              {([ ["given", "Dado", "Ex.: que tenho uma conta ativa e um link válido"], ["when", "Quando", "Ex.: solicito a redefinição da senha"], ["then", "Então", "Ex.: a nova senha permite entrar na conta"] ] as const).map(([field, label, placeholder]) => <div key={field} className="mt-4"><label className="block text-xs font-semibold text-[#D5DCE3]" htmlFor={`${field}-${scenario.id}`}>{label}</label><textarea id={`${field}-${scenario.id}`} className="field mt-2 w-full resize-y" required maxLength={500} rows={2} value={scenario[field]} onChange={(event) => updateScenario(scenario.id, field, event.target.value)} placeholder={placeholder} /></div>)}
            </fieldset>)}</div>
            <button type="button" onClick={() => setScenarios((current) => [...current, blankScenario()])} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg border border-mint/30 px-4 text-sm font-bold text-mint hover:bg-mint/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint"><Plus className="size-4" aria-hidden="true" /> Adicionar cenário</button>
          </section>
          <button type="submit" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-neon px-5 text-sm font-black text-[#101319] hover:bg-neon/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><FileCode2 className="size-4" aria-hidden="true" /> Gerar Gherkin</button>
        </form>
      </div>

      <div className="space-y-5 xl:sticky xl:top-6 xl:self-start">
        <section className="rounded-xl border border-mint/20 bg-[#11151B] p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-bold text-off-white">Resultado</h2><p className="mt-1 text-xs text-[#AAB2BC]">Edite antes de salvar ou exportar.</p></div><span className="rounded-md bg-mint/10 px-2 py-1 text-[11px] font-bold text-mint">.feature</span></div>
          <label htmlFor="bdd-output" className="sr-only">Gherkin gerado</label>
          <textarea id="bdd-output" className="mt-5 min-h-[340px] w-full resize-y rounded-lg border border-white/10 bg-[#0D1117] p-4 font-mono text-xs leading-6 text-[#D5E7E1] placeholder:text-[#69737E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint" value={output} onChange={(event) => setOutput(event.target.value)} maxLength={20000} placeholder="Preencha os campos e escolha Gerar Gherkin." spellCheck={false} />
          {error && <p role="alert" className="mt-3 rounded-md border border-coral/30 bg-coral/10 p-3 text-sm text-coral">{error}</p>}
          {message && <p role="status" className="mt-3 text-sm text-mint">{message}</p>}
          <div className="mt-5 grid grid-cols-2 gap-2"><button type="button" disabled={!output.trim()} onClick={() => void copy()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/15 px-3 text-xs font-bold text-off-white hover:border-mint/40 disabled:opacity-40"><Clipboard className="size-4" aria-hidden="true" /> Copiar</button><button type="button" disabled={!output.trim()} onClick={download} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/15 px-3 text-xs font-bold text-off-white hover:border-mint/40 disabled:opacity-40"><Download className="size-4" aria-hidden="true" /> Baixar</button></div>
          {signedIn ? <div className="mt-2 grid gap-2 sm:grid-cols-2"><button type="button" disabled={!output.trim() || busy !== null} onClick={() => void save()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-mint px-3 text-xs font-black text-[#101319] hover:bg-mint/90 disabled:opacity-40"><Save className="size-4" aria-hidden="true" /> {busy === "save" ? "Salvando…" : draftId ? "Atualizar rascunho" : "Salvar rascunho"}</button><button type="button" disabled={!boardId || !output.trim() || busy !== null} onClick={() => void createCard()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-neon/40 px-3 text-xs font-bold text-neon hover:bg-neon/10 disabled:opacity-40"><FolderKanban className="size-4" aria-hidden="true" /> {busy === "board" ? "Criando…" : "Criar card de teste"}</button></div> : <Link href="/login?next=/lab/bdd" className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-mint px-4 text-sm font-bold text-[#101319]">Entrar para salvar e criar cards</Link>}
          {signedIn && !boardId && <p className="mt-3 text-xs text-[#AAB2BC]">O board ainda não está disponível nesta instalação. Seus cenários podem ser salvos como rascunho.</p>}
          {createdCard && boardId && <Link href={`/boards/${boardId}?item=${encodeURIComponent(createdCard)}`} className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-neon hover:underline"><Check className="size-4" aria-hidden="true" /> Abrir {createdCard} no board <ArrowRight className="size-4" aria-hidden="true" /></Link>}
        </section>

        {signedIn && <section className="rounded-xl border border-white/10 bg-[#171B21] p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><div><h2 className="text-base font-bold text-off-white">Meus cenários</h2><p className="mt-1 text-xs text-[#AAB2BC]">Rascunhos salvos na sua conta.</p></div><button type="button" onClick={newDraft} className="inline-flex min-h-10 items-center gap-1 rounded-md px-2 text-xs font-bold text-mint hover:bg-mint/10"><Plus className="size-4" aria-hidden="true" /> Novo</button></div><div className="mt-4 space-y-2">{drafts.map((draft) => <button key={draft.id} type="button" onClick={() => openDraft(draft)} className={`flex min-h-14 w-full items-center justify-between gap-3 rounded-lg border p-3 text-left hover:border-mint/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint ${draft.id === draftId ? "border-mint/50 bg-mint/5" : "border-white/10 bg-[#101319]"}`}><span className="min-w-0"><span className="block truncate text-sm font-semibold text-off-white">{draft.title}</span><span className="mt-1 block text-xs text-[#AAB2BC]">{new Date(draft.updated_at).toLocaleDateString("pt-BR")}</span></span><ArrowRight className="size-4 shrink-0 text-mint" aria-hidden="true" /></button>)}{drafts.length === 0 && <p className="rounded-lg border border-dashed border-white/15 p-5 text-center text-sm text-[#AAB2BC]">Seus cenários salvos aparecerão aqui.</p>}</div></section>}
      </div>
    </div>
  </main>;
}
