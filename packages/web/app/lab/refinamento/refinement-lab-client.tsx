"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, ClipboardCheck, RotateCcw, Save, Shuffle, Sparkles } from "lucide-react";
import { refinementItems, scoreRefinement, type RefinementItem } from "@/lib/refinement-lab";
import { saveRefinementSubmission } from "./actions";

type Props = { initialItemId?: string; completedIds: string[]; saved?: boolean; error?: boolean };
const priorities = { baixa: "text-[#8B949E]", media: "text-[#9BC0F5]", alta: "text-[#F0C040]", critica: "text-coral" } as const;

function nextDraft(item: RefinementItem) {
  if (item.kind === "bug") {
    return {
      title: `${item.title}: comportamento inconsistente em ${item.domain}`,
      body: `Ao executar o fluxo em ${item.domain}, ${item.body} O problema precisa ser descrito com passos claros, dados usados, resultado atual, resultado esperado, impacto para ${item.persona} e condicao em que ocorre.`,
      criteria: "Passos de reproducao estao claros\nResultado atual e esperado estao separados\nImpacto e severidade estao justificados",
      questions: "Em qual ambiente e massa de dados isso aconteceu?",
    };
  }
  return {
    title: `${item.title} em ${item.domain}`,
    body: `Como ${item.persona}, preciso de uma melhoria em ${item.domain} que resolva um problema verificavel e gere valor claro. A descricao deve explicar contexto, regra de negocio, limites de escopo, comportamento esperado e como produto/QA vao validar a entrega.`,
    criteria: "Dado um usuario elegivel, quando executar o fluxo, entao o resultado esperado e apresentado\nDado um caso invalido, quando tentar concluir, entao o sistema bloqueia com mensagem clara\nDado um usuario sem permissao, quando acessar o recurso, entao a acao nao fica disponivel",
    questions: "Qual regra de negocio define elegibilidade?",
  };
}

export function RefinementLabClient({ initialItemId, completedIds, saved = false, error = false }: Props) {
  const initialIndex = Math.max(0, refinementItems.findIndex((item) => item.id === initialItemId));
  const [index, setIndex] = useState(initialIndex === -1 ? 0 : initialIndex);
  const [kind, setKind] = useState<"todos" | "pbi" | "bug">("todos");
  const completed = useMemo(() => new Set(completedIds), [completedIds]);
  const filtered = useMemo(() => refinementItems.filter((item) => kind === "todos" || item.kind === kind), [kind]);
  const item = filtered[index % filtered.length] ?? refinementItems[0];
  const draft = nextDraft(item);
  const [title, setTitle] = useState(draft.title);
  const [body, setBody] = useState(draft.body);
  const [criteria, setCriteria] = useState(draft.criteria);
  const [questions, setQuestions] = useState(draft.questions);
  const [ratings, setRatings] = useState({ clarity: 2, testability: 2, value: 2, scope: 2 });
  const result = scoreRefinement({ title, body, criteria, questions, ...ratings });

  function go(nextIndex: number) {
    const bounded = (nextIndex + filtered.length) % filtered.length;
    const next = filtered[bounded];
    const nextValues = nextDraft(next);
    setIndex(bounded); setTitle(nextValues.title); setBody(nextValues.body); setCriteria(nextValues.criteria); setQuestions(nextValues.questions); setRatings({ clarity: 2, testability: 2, value: 2, scope: 2 });
  }

  return <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
    <Link href="/lab" className="inline-flex items-center gap-2 text-xs text-[#8B949E] hover:text-mint"><ArrowLeft className="size-3.5" />Voltar ao Lab</Link>
    <header className="mt-8 grid gap-6 border-b border-white/10 pb-8 lg:grid-cols-[1fr_22rem] lg:items-end"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-neon">Refinement Lab</p><h1 className="mt-3 text-4xl font-black tracking-tight text-off-white sm:text-5xl">Refine PBIs e bugs mal escritos.</h1><p className="mt-4 max-w-3xl leading-8 text-[#AAB2BC]">A fila tem centenas de itens ruins. Seu trabalho e avaliar, editar e transformar cada card em uma entrada pronta para refinamento, desenvolvimento e teste.</p></div><div className="rounded-2xl border border-neon/20 bg-neon/[.045] p-5"><ClipboardCheck className="size-5 text-neon" /><p className="mt-4 text-3xl font-black text-off-white">{completed.size}/{refinementItems.length}</p><p className="mt-1 text-xs text-[#8B949E]">itens refinados</p></div></header>
    {(saved || error) && <div className={`mt-5 rounded-xl border p-4 text-sm ${saved ? "border-mint/25 bg-mint/[.05] text-mint" : "border-coral/25 bg-coral/[.05] text-coral"}`}>{saved ? "Refinamento salvo no workspace." : "Complete descricao, criterios e score minimo antes de salvar."}</div>}
    <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,24rem)_1fr]">
      <aside className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-[#171B21] p-5">
          <div className="flex items-center justify-between"><span className="font-mono text-xs font-black text-neon">{item.id}</span><span className={`text-xs font-bold uppercase ${priorities[item.severity]}`}>{item.severity}</span></div>
          <div className="mt-4 flex gap-2"><button onClick={() => setKind("todos")} className={`rounded-lg px-3 py-2 text-xs font-bold ${kind === "todos" ? "bg-neon text-[#101319]" : "border border-white/10 text-[#8B949E]"}`}>Todos</button><button onClick={() => { setKind("pbi"); setIndex(0); }} className={`rounded-lg px-3 py-2 text-xs font-bold ${kind === "pbi" ? "bg-neon text-[#101319]" : "border border-white/10 text-[#8B949E]"}`}>PBI</button><button onClick={() => { setKind("bug"); setIndex(0); }} className={`rounded-lg px-3 py-2 text-xs font-bold ${kind === "bug" ? "bg-neon text-[#101319]" : "border border-white/10 text-[#8B949E]"}`}>Bug</button></div>
          <article className="mt-5 min-h-80 rounded-2xl border border-white/10 bg-[#101319] p-5"><div className="flex items-center justify-between"><span className="rounded-full border border-white/10 px-2 py-1 text-[10px] font-bold uppercase text-[#AAB2BC]">{item.kind}</span>{completed.has(item.id) && <CheckCircle2 className="size-4 text-mint" />}</div><h2 className="mt-5 text-xl font-black text-off-white">{item.title}</h2><p className="mt-3 text-sm leading-6 text-[#AAB2BC]">{item.body}</p><div className="mt-5 space-y-2"><p className="text-[10px] font-black uppercase tracking-[.18em] text-[#69737E]">Problemas provaveis</p>{item.flaws.map((flaw) => <div key={flaw} className="rounded-lg bg-coral/[.06] px-3 py-2 text-xs text-[#D7B0AC]">{flaw}</div>)}</div></article>
          <div className="mt-4 grid grid-cols-4 gap-2"><button className="tool" onClick={() => go(index - 1)} aria-label="Anterior"><ChevronLeft className="size-4" /></button><button className="tool" onClick={() => go(index + 1)} aria-label="Proximo"><ChevronRight className="size-4" /></button><button className="tool" onClick={() => go(Math.floor(Math.random() * filtered.length))} aria-label="Aleatorio"><Shuffle className="size-4" /></button><button className="tool" onClick={() => go(index)} aria-label="Resetar"><RotateCcw className="size-4" /></button></div>
        </div>
      </aside>
      <section className="rounded-2xl border border-white/10 bg-[#171B21] p-5">
        <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-mint">Sua versao refinada</p><h2 className="mt-2 text-2xl font-black text-off-white">Editar, testar clareza e salvar</h2></div><div className="rounded-xl border border-white/10 bg-[#101319] px-4 py-3"><p className="text-[10px] font-bold uppercase text-[#69737E]">Score</p><strong className={`text-2xl ${result.ready ? "text-mint" : "text-coral"}`}>{result.score}</strong></div></div>
        <form action={saveRefinementSubmission} className="mt-5 space-y-4"><input type="hidden" name="item_id" value={item.id} />
          <label className="block text-xs font-bold text-[#AAB2BC]">Titulo refinado<input name="title" value={title} onChange={(event) => setTitle(event.target.value)} className="field mt-2 w-full" /></label>
          <label className="block text-xs font-bold text-[#AAB2BC]">Descricao refinada<textarea name="body" value={body} onChange={(event) => setBody(event.target.value)} rows={7} className="field mt-2 w-full resize-y" /></label>
          <label className="block text-xs font-bold text-[#AAB2BC]">Criterios de aceite / verificacao<textarea name="criteria" value={criteria} onChange={(event) => setCriteria(event.target.value)} rows={6} className="field mt-2 w-full resize-y" /></label>
          <label className="block text-xs font-bold text-[#AAB2BC]">Perguntas abertas<textarea name="questions" value={questions} onChange={(event) => setQuestions(event.target.value)} rows={4} className="field mt-2 w-full resize-y" /></label>
          <div className="grid gap-3 sm:grid-cols-4">{(["clarity", "testability", "value", "scope"] as const).map((key) => <label key={key} className="text-xs font-bold capitalize text-[#AAB2BC]">{key}<select name={key} value={ratings[key]} onChange={(event) => setRatings((current) => ({ ...current, [key]: Number(event.target.value) }))} className="field mt-2 w-full">{[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}</option>)}</select></label>)}</div>
          {!!result.missing.length && <div className="rounded-xl border border-coral/20 bg-coral/[.04] p-4 text-xs leading-6 text-[#D7B0AC]"><strong>Falta:</strong> {result.missing.join(", ")}</div>}
          <div className="flex flex-col gap-2 sm:flex-row"><button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-mint px-5 text-sm font-black text-[#101319]"><Save className="size-4" />Salvar refinamento</button><Link href="/lab/studio" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-neon/25 px-5 text-sm font-bold text-neon"><Sparkles className="size-4" />Levar ao Studio</Link></div>
        </form>
      </section>
    </section>
  </main>;
}