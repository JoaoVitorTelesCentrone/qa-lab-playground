"use client";

import { FormEvent, type ReactNode, useEffect, useState } from "react";
import { ArrowUpRight, Bug, Check, ChevronRight, ClipboardCheck, Download, FileSearch, ListChecks, Plus, Trash2 } from "lucide-react";
import { ChallengeStepper } from "@/components/challenge/challenge-stepper";
import { DELIVERABLES_KEY, emptyDeliverables, exportDeliverables, parseDeliverables, type BddScenario, type BugReport, type ChallengeDeliverables } from "@/lib/challenge-deliverables";

type Stage = "bugs" | "bdd";
const stages = {
  bugs: { number: "01", label: "Bug reports", subtitle: "Registre fatos, não suposições.", icon: Bug },
  bdd: { number: "02", label: "Cenários BDD", subtitle: "Transforme risco em comportamento verificável.", icon: ListChecks },
} as const;

function newId() { return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`; }

export function DeliverablesWorkbench() {
  const [stage, setStage] = useState<Stage>("bugs");
  const [data, setData] = useState<ChallengeDeliverables>(emptyDeliverables);
  const [loaded, setLoaded] = useState(false);
  const current = stages[stage];
  const CurrentIcon = current.icon;
  const completed = [data.bugs.length, data.bdd.length].filter(Boolean).length;

  useEffect(() => {
    const timer = window.setTimeout(() => { setData(parseDeliverables(localStorage.getItem(DELIVERABLES_KEY))); setLoaded(true); }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => { if (loaded) localStorage.setItem(DELIVERABLES_KEY, JSON.stringify(data)); }, [data, loaded]);

  function downloadDeliverables() {
    const files = exportDeliverables(data);
    const url = URL.createObjectURL(new Blob([`${files.bugReports}\n---\n\n${files.bdd}`], { type: "text/markdown;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "expenseflow-investigacao.md"; anchor.click(); URL.revokeObjectURL(url);
  }
  function remove(group: Stage, id: string) { setData((value) => ({ ...value, [group]: value[group].filter((item) => item.id !== id) })); }

  return <main className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
    <ChallengeStepper />

    <header className="relative mt-10 overflow-hidden border-b border-[#3A4147] pb-9">
      <div className="absolute -right-4 -top-14 select-none font-mono text-[10rem] font-black leading-none text-white/[.025] sm:text-[14rem]">QA</div>
      <div className="relative flex flex-wrap items-end justify-between gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8EB99B]"><FileSearch className="size-4" /> Registro da investigação</div>
          <h1 className="mt-5 font-display text-5xl leading-[.9] text-off-white sm:text-7xl">Evidência<br />antes de opinião.</h1>
          <p className="mt-5 max-w-xl text-[15px] leading-7 text-[#AAB2BC]">Organize o que encontrou no ExpenseFlow. Primeiro, um bug report reproduzível. Depois, o comportamento que não pode voltar a quebrar.</p>
        </div>
        <div className="flex min-w-44 items-center gap-4 border-l border-[#3A4147] pl-5">
          <span className="font-mono text-4xl font-bold text-[#A5D9B6]">{String(completed).padStart(2, "0")}</span>
          <span className="max-w-20 text-xs leading-4 text-[#89939E]">de 2 registros iniciados</span>
        </div>
      </div>
    </header>

    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_250px]">
      <section>
        <div role="tablist" aria-label="Tipo de entrega" className="flex border-b border-[#3A4147]">
          {(Object.keys(stages) as Stage[]).map((id) => {
            const item = stages[id]; const Icon = item.icon; const active = id === stage; const count = data[id].length;
            return <button key={id} role="tab" aria-selected={active} onClick={() => setStage(id)} className={`group -mb-px flex items-center gap-3 border-b-2 px-1 py-4 pr-7 text-left transition sm:pr-10 ${active ? "border-[#81C899] text-off-white" : "border-transparent text-[#7F8993] hover:text-[#C7D0D8]"}`}><Icon className="size-4" /><span><span className="block text-sm font-bold">{item.label}</span><span className="mt-1 block text-[11px] font-normal">{item.subtitle}</span></span>{count > 0 && <span className={`ml-1 inline-flex size-5 items-center justify-center rounded-full text-[10px] font-black ${active ? "bg-[#81C899] text-[#172019]" : "bg-white/[.08]"}`}>{count}</span>}</button>;
          })}
        </div>

        <div className="mt-8">
          <div className="flex items-start gap-4">
            <span className="font-mono text-sm text-[#81C899]">{current.number}</span>
            <div><h2 className="text-2xl font-bold tracking-tight text-off-white">{current.label}</h2><p className="mt-1 text-sm text-[#89939E]">{current.subtitle}</p></div>
          </div>
          <div className="mt-7 border-l border-[#4E9C67] pl-5 sm:pl-7">
            {stage === "bugs" && <BugForm add={(item) => setData((value) => ({ ...value, bugs: [...value.bugs, item] }))} />}
            {stage === "bdd" && <BddForm add={(item) => setData((value) => ({ ...value, bdd: [...value.bdd, item] }))} />}
          </div>
          <EntryList stage={stage} items={data[stage]} remove={(id) => remove(stage, id)} />
        </div>
      </section>

      <aside className="border-t border-[#3A4147] pt-6 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-1">
        <CurrentIcon className="size-5 text-[#81C899]" />
        <p className="mt-4 text-sm font-bold text-off-white">O que uma boa entrega mostra</p>
        {stage === "bugs" ? <ul className="mt-4 space-y-3 text-xs leading-5 text-[#9CA7B0]"><li className="flex gap-2"><Check className="mt-0.5 size-3.5 shrink-0 text-[#81C899]" />Passos que outra pessoa consegue repetir.</li><li className="flex gap-2"><Check className="mt-0.5 size-3.5 shrink-0 text-[#81C899]" />Evidência que sustenta o relato.</li><li className="flex gap-2"><Check className="mt-0.5 size-3.5 shrink-0 text-[#81C899]" />Resultado esperado descrito com clareza.</li></ul> : <ul className="mt-4 space-y-3 text-xs leading-5 text-[#9CA7B0]"><li className="flex gap-2"><Check className="mt-0.5 size-3.5 shrink-0 text-[#81C899]" />Um comportamento observável por cenário.</li><li className="flex gap-2"><Check className="mt-0.5 size-3.5 shrink-0 text-[#81C899]" />Dado, Quando e Então sem detalhe técnico.</li><li className="flex gap-2"><Check className="mt-0.5 size-3.5 shrink-0 text-[#81C899]" />Regra de negócio fácil de revisar.</li></ul>}
        <div className="mt-8 border-t border-[#3A4147] pt-5"><p className="text-xs leading-5 text-[#71808B]">Os registros ficam só neste navegador enquanto você trabalha.</p><button type="button" onClick={downloadDeliverables} disabled={completed === 0} className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#A5D9B6] disabled:opacity-35"><Download className="size-3.5" />Exportar investigação <ArrowUpRight className="size-3.5" /></button></div>
      </aside>
    </div>
  </main>;
}

function FieldLabel({ children }: { children: ReactNode }) { return <label className="grid gap-2 text-xs font-bold text-[#C7D0D8]">{children}</label>; }
function AddButton({ children }: { children: ReactNode }) { return <button className="mt-2 inline-flex h-11 items-center gap-2 bg-[#81C899] px-4 text-sm font-bold text-[#172019] transition hover:bg-[#9cdaae]"><Plus className="size-4" />{children}</button>; }

function BugForm({ add }: { add: (item: BugReport) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = new FormData(event.currentTarget); add({ id: newId(), title: String(form.get("title")), steps: String(form.get("steps")), actual: String(form.get("actual")), expected: String(form.get("expected")), severity: String(form.get("severity")) as BugReport["severity"], evidence: String(form.get("evidence")) }); event.currentTarget.reset(); }
  return <form onSubmit={submit} className="grid gap-5"><FieldLabel>Título do problema<input required name="title" className="field" placeholder="Ex.: total mensal não atualiza ao excluir uma despesa" /></FieldLabel><div className="grid gap-5 sm:grid-cols-2"><FieldLabel>Como reproduzir<textarea required name="steps" rows={4} className="field resize-y" placeholder="1. Acesse...&#10;2. Cadastre...&#10;3. Observe..." /></FieldLabel><FieldLabel>O que aconteceu<textarea required name="actual" rows={4} className="field resize-y" placeholder="Descreva apenas o comportamento observado." /></FieldLabel></div><div className="grid gap-5 sm:grid-cols-[1fr_180px]"><FieldLabel>O que deveria acontecer<textarea required name="expected" rows={3} className="field resize-y" placeholder="Descreva o resultado esperado." /></FieldLabel><div className="grid gap-5"><FieldLabel>Impacto<select name="severity" className="field"><option>Baixa</option><option>Média</option><option>Alta</option><option>Crítica</option></select></FieldLabel><FieldLabel>Evidência<input required name="evidence" className="field" placeholder="URL, vídeo ou descrição" /></FieldLabel></div></div><AddButton>Registrar bug report</AddButton></form>;
}

function BddForm({ add }: { add: (item: BddScenario) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = new FormData(event.currentTarget); add({ id: newId(), feature: String(form.get("feature")), title: String(form.get("title")), given: String(form.get("given")), when: String(form.get("when")), then: String(form.get("then")) }); event.currentTarget.reset(); }
  return <form onSubmit={submit} className="grid gap-5"><div className="grid gap-5 sm:grid-cols-2"><FieldLabel>Funcionalidade<input required name="feature" className="field" placeholder="Ex.: gestão de despesas" /></FieldLabel><FieldLabel>Nome do cenário<input required name="title" className="field" placeholder="Ex.: excluir despesa recalcula total" /></FieldLabel></div><div className="grid gap-5"><FieldLabel>Dado que<textarea required name="given" rows={2} className="field resize-y" placeholder="o usuário possui uma despesa registrada..." /></FieldLabel><FieldLabel>Quando<textarea required name="when" rows={2} className="field resize-y" placeholder="ele exclui essa despesa..." /></FieldLabel><FieldLabel>Então<textarea required name="then" rows={2} className="field resize-y" placeholder="o total mensal deve ser recalculado..." /></FieldLabel></div><AddButton>Registrar cenário BDD</AddButton></form>;
}

function EntryList<T extends { id: string }>({ stage, items, remove }: { stage: Stage; items: T[]; remove: (id: string) => void }) {
  if (!items.length) return <div className="mt-10 border-t border-dashed border-[#3A4147] py-8"><p className="text-sm text-[#76818B]">Ainda não há registros nesta etapa.</p></div>;
  return <div className="mt-10 border-t border-[#3A4147]"><p className="pt-5 text-xs font-bold text-[#7F8993]">{items.length} registro{items.length > 1 ? "s" : ""}</p><div className="mt-2 divide-y divide-[#30373D]">{items.map((item) => <EntryRow key={item.id} stage={stage} item={item} remove={remove} />)}</div></div>;
}

function EntryRow({ stage, item, remove }: { stage: Stage; item: BugReport | BddScenario; remove: (id: string) => void }) {
  const title = item.title;
  const detail = stage === "bugs" ? `${(item as BugReport).severity} — ${(item as BugReport).expected}` : `Dado ${(item as BddScenario).given} · Quando ${(item as BddScenario).when} · Então ${(item as BddScenario).then}`;
  return <article className="group flex items-start gap-4 py-5"><ClipboardCheck className="mt-0.5 size-4 shrink-0 text-[#81C899]" /><div className="min-w-0 flex-1"><h3 className="font-semibold text-off-white">{title}</h3><p className="mt-1 line-clamp-2 text-xs leading-5 text-[#89939E]">{detail}</p></div><button type="button" onClick={() => remove(item.id)} className="p-1 text-[#65707A] opacity-0 transition hover:text-[#E48D88] group-hover:opacity-100 focus:opacity-100" aria-label="Excluir registro"><Trash2 className="size-4" /></button><ChevronRight className="mt-1 size-4 text-[#56616A]" /></article>;
}
