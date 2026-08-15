"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, Check, CheckCircle2, Copy, Download, FileCode2, History, Layers3, LayoutList, Loader2, Play, Plus, Settings2, Sparkles, TestTube2 } from "lucide-react";

type Score = {
  cobertura: number;
  clareza: number;
  estrutura: number;
  executabilidade: number;
  score_final: number;
  aprovado: boolean;
  threshold: number;
};

type GenerateResult = {
  bdd_text: string;
  score: Score;
  attempts: number;
  total_tokens: number;
  converged: boolean;
  duration_seconds: number;
};

const EXAMPLE = `Como usuário, quero fazer login com e-mail e senha para acessar minha conta.

Critérios de aceitação:
- Permitir login com credenciais válidas
- Exibir erro para credenciais inválidas
- Bloquear o acesso após 3 tentativas incorretas`;

export function BddGenerator() {
  const [story, setStory] = useState("");
  const [context, setContext] = useState("");
  const [threshold, setThreshold] = useState(7);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const selectedStory = new URLSearchParams(window.location.search).get("story");
    if (selectedStory) setStory(selectedStory);
  }, []);

  async function generate() {
    if (story.trim().length < 5) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch("/api/bist/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          story: story.trim(),
          project_context: context.trim() || undefined,
          model: "llama",
          threshold,
          max_attempts: 5,
          until_converged: false,
        }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.detail || "Não foi possível gerar o BDD.");
      setResult(body);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Erro ao gerar o BDD.");
    } finally {
      setLoading(false);
    }
  }

  async function copyResult() {
    if (!result) return;
    await navigator.clipboard.writeText(result.bdd_text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function downloadResult() {
    if (!result) return;
    const url = URL.createObjectURL(new Blob([result.bdd_text], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "cenario.feature";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0D1117]">
      <div className="border-b border-white/10 bg-[#12161C]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-neon text-[#101319] shadow-[0_0_24px_rgba(212,245,110,.16)]"><TestTube2 className="size-5" /></span>
            <div><div className="flex items-center gap-2"><span className="text-sm font-black tracking-wide text-off-white">BIST</span><span className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#8B949E]">Test Design</span></div><p className="mt-0.5 text-[11px] text-[#69737E]">Inteligência aplicada ao desenho de testes</p></div>
          </div>
          <nav className="flex items-center gap-1 overflow-x-auto rounded-xl border border-white/10 bg-[#0D1117] p-1 text-xs font-bold">
            <Link href="/lab/historias" className="flex items-center gap-2 rounded-lg px-3 py-2 text-[#8B949E] hover:bg-white/5 hover:text-[#9BC0F5]"><LayoutList className="size-3.5" />Histórias</Link>
            <span className="flex items-center gap-2 rounded-lg bg-mint/10 px-3 py-2 text-mint"><Layers3 className="size-3.5" />Design BDD</span>
            <Link href="/lab/execution" className="flex items-center gap-2 rounded-lg px-3 py-2 text-[#8B949E] hover:bg-white/5 hover:text-off-white"><Play className="size-3.5" />Execução</Link>
            <span className="flex cursor-not-allowed items-center gap-2 rounded-lg px-3 py-2 text-[#4F5965]"><History className="size-3.5" />Histórico</span>
          </nav>
          <div className="hidden items-center gap-2 text-[11px] font-semibold text-[#8B949E] lg:flex"><span className="size-2 rounded-full bg-neon shadow-[0_0_8px_#D4F56E]" />Motor BIST conectado</div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8">
      <header className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#69737E]"><span>Test Design</span><ArrowRight className="size-3" /><span className="text-mint">Novo design</span></div>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-off-white sm:text-4xl">Transforme requisitos em testes executáveis</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#8B949E]">Descreva o comportamento esperado. O BIST cria os cenários, refina a escrita e mede a qualidade antes da execução.</p>
        </div>
        <button type="button" onClick={() => { setStory(""); setContext(""); setResult(null); setError(""); }} className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-white/10 px-4 text-xs font-bold text-off-white transition hover:border-mint/30 hover:bg-mint/5"><Plus className="size-4" />Novo design</button>
      </header>

      <div className="mb-6 grid grid-cols-3 overflow-hidden rounded-xl border border-white/10 bg-[#12161C]">
        {[["01", "Definir história"], ["02", "Gerar cenários"], ["03", "Revisar qualidade"]].map(([number, label], index) => { const active = index === 0 || loading || Boolean(result); const complete = (index === 0 && story.trim().length >= 5) || (index > 0 && Boolean(result)); return <div key={number} className={`relative flex items-center gap-3 border-r border-white/10 px-3 py-3 last:border-r-0 sm:px-5 ${active ? "bg-mint/[.035]" : ""}`}><span className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${complete ? "bg-neon text-[#101319]" : active ? "border border-mint/40 bg-mint/10 text-mint" : "border border-white/10 text-[#4F5965]"}`}>{complete ? <Check className="size-3.5" /> : number}</span><span className={`hidden text-xs font-bold sm:block ${active ? "text-off-white" : "text-[#4F5965]"}`}>{label}</span>{active && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-mint" />}</div>; })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[440px_minmax(0,1fr)]">
        <section className="space-y-4 rounded-2xl border border-white/10 bg-[#12161C] p-4 shadow-2xl shadow-black/20 sm:p-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4"><div><h2 className="text-sm font-black text-off-white">Contexto do requisito</h2><p className="mt-1 text-[11px] text-[#69737E]">Dados usados para gerar os cenários</p></div><Settings2 className="size-4 text-[#69737E]" /></div>
          <div className="rounded-xl border border-white/10 bg-[#171B21] p-4">
            <div className="mb-3 flex items-center justify-between">
              <label htmlFor="story" className="text-sm font-bold text-off-white">User story</label>
              <button type="button" onClick={() => setStory(EXAMPLE)} className="text-xs font-semibold text-mint hover:text-neon">Usar exemplo</button>
            </div>
            <textarea id="story" value={story} onChange={(event) => setStory(event.target.value)} rows={9} className="field w-full resize-y leading-6" placeholder="Como [persona], quero [ação] para [benefício]..." />
          </div>

          <div className="rounded-xl border border-white/10 bg-[#171B21] p-4">
            <label htmlFor="context" className="text-sm font-bold text-off-white">Contexto do produto <span className="font-normal text-[#69737E]">(opcional)</span></label>
            <textarea id="context" value={context} onChange={(event) => setContext(event.target.value)} rows={4} className="field mt-3 w-full resize-y leading-6" placeholder="Regras do domínio, restrições e comportamento esperado..." />
          </div>

          <div className="rounded-xl border border-white/10 bg-[#171B21] p-4">
            <div className="flex justify-between text-sm"><span className="text-[#8B949E]">Nota mínima</span><strong className="text-off-white">{threshold.toFixed(1)}</strong></div>
            <input type="range" min="1" max="10" step="0.5" value={threshold} onChange={(event) => setThreshold(Number(event.target.value))} className="mt-3 w-full accent-[#2DD4BF]" />
          </div>

          <button type="button" onClick={generate} disabled={loading || story.trim().length < 5} className="flex w-full items-center justify-center gap-2 rounded-xl bg-neon px-5 py-3.5 text-sm font-black text-[#0D1117] shadow-[0_8px_30px_rgba(212,245,110,.12)] transition hover:-translate-y-0.5 hover:bg-[#DDFB80] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {loading ? "Gerando e avaliando..." : "Gerar BDD"}
          </button>
        </section>

        <section className="min-w-0 rounded-2xl border border-white/10 bg-[#12161C] p-4 shadow-2xl shadow-black/20 sm:p-5">
          <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4"><div className="flex items-center gap-2"><FileCode2 className="size-4 text-mint" /><div><h2 className="text-sm font-black text-off-white">Artefato gerado</h2><p className="mt-1 text-[11px] text-[#69737E]">Gherkin pronto para revisão e exportação</p></div></div>{result && <span className="flex items-center gap-1.5 rounded-full bg-neon/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-neon"><CheckCircle2 className="size-3" />Gerado</span>}</div>
          {error && <div className="flex gap-3 rounded-2xl border border-coral/30 bg-coral/10 p-5 text-sm text-coral"><AlertCircle className="mt-0.5 size-4 shrink-0" /><p>{error}</p></div>}
          {!result && !error && <div className="flex min-h-[480px] flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#0D1117]/60 p-8 text-center"><span className="flex size-16 items-center justify-center rounded-2xl border border-mint/15 bg-mint/[.06]"><FileCode2 className="size-7 text-mint/60" /></span><p className="mt-5 font-bold text-off-white">Seu arquivo .feature aparecerá aqui</p><p className="mt-2 max-w-sm text-sm leading-6 text-[#8B949E]">O BIST analisa a história, cria cenários positivos e negativos e valida quatro dimensões de qualidade.</p><div className="mt-6 grid grid-cols-2 gap-2 text-left">{["Cobertura de regras", "Estrutura Gherkin", "Clareza dos passos", "Executabilidade"].map((item) => <span key={item} className="flex items-center gap-2 rounded-lg bg-white/[.03] px-3 py-2 text-[11px] text-[#8B949E]"><CheckCircle2 className="size-3 text-mint/60" />{item}</span>)}</div></div>}
          {result && <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-[#171B21] p-5">
              <div className="flex items-center justify-between"><h2 className="font-bold text-off-white">Qualidade</h2><span className={`rounded-full px-3 py-1 text-xs font-black ${result.score.aprovado ? "bg-neon/15 text-neon" : "bg-coral/15 text-coral"}`}>{result.score.score_final.toFixed(1)} · {result.score.aprovado ? "Aprovado" : "Refinar"}</span></div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{([['Cobertura', result.score.cobertura], ['Clareza', result.score.clareza], ['Estrutura', result.score.estrutura], ['Executável', result.score.executabilidade]] as const).map(([label, value]) => <div key={label} className="rounded-xl bg-[#101319] p-3"><p className="text-[10px] uppercase text-[#69737E]">{label}</p><p className="mt-1 text-lg font-black text-off-white">{value.toFixed(1)}</p></div>)}</div>
              <p className="mt-4 text-xs text-[#69737E]">{result.attempts} tentativa(s) · {result.duration_seconds.toFixed(1)}s · {result.total_tokens} tokens</p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#171B21]">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-3"><span className="text-xs font-bold uppercase tracking-wider text-[#8B949E]">cenario.feature</span><div className="flex gap-2"><button type="button" onClick={copyResult} className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-off-white hover:border-mint/40">{copied ? <Check className="size-3.5 text-neon" /> : <Copy className="size-3.5" />}{copied ? "Copiado" : "Copiar"}</button><button type="button" onClick={downloadResult} className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-off-white hover:border-mint/40"><Download className="size-3.5" />Baixar</button></div></div>
              <pre className="max-h-[640px] overflow-auto whitespace-pre-wrap p-5 font-mono text-sm leading-7 text-[#D4F56E]">{result.bdd_text}</pre>
            </div>
          </div>}
        </section>
      </div>
      </main>
    </div>
  );
}
