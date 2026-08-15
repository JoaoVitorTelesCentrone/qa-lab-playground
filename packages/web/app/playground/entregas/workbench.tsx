"use client";

import Link from "next/link";
import { FormEvent, type ReactNode, useEffect, useState } from "react";
import { ArrowRight, Bot, Bug, CheckCircle2, Clipboard, ClipboardList, Code2, Download, Github, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { ChallengeStepper } from "@/components/challenge/challenge-stepper";
import {
  countCompletedStages,
  DELIVERABLES_KEY,
  emptyDeliverables,
  exportDeliverables,
  parseDeliverables,
  type BddScenario,
  type BugReport,
  type ChallengeDeliverables,
  ciGates,
  type CiGateName,
  type CiGateStatus,
  type E2eCandidate,
  type ReleaseDecision,
} from "@/lib/challenge-deliverables";

type Stage = "bugs" | "bdd" | "e2e" | "release";
type DeliverableStage = Exclude<Stage, "release">;
const stages: { id: Stage; label: string; hint: string }[] = [
  { id: "bugs", label: "1. Bug reports", hint: "Registre risco e evidência" },
  { id: "bdd", label: "2. Cenários BDD", hint: "Modele a regressão" },
  { id: "e2e", label: "3. Plano E2E", hint: "Decida o que automatizar" },
  { id: "release", label: "4. Release", hint: "Registre CI e a decisão" },
];

function newId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

export function DeliverablesWorkbench() {
  const [stage, setStage] = useState<Stage>("bugs");
  const [data, setData] = useState<ChallengeDeliverables>(emptyDeliverables);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setData(parseDeliverables(localStorage.getItem(DELIVERABLES_KEY)));
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(DELIVERABLES_KEY, JSON.stringify(data));
  }, [data, loaded]);

  const completed = countCompletedStages(data);

  function downloadPortfolio() {
    const files = exportDeliverables(data);
    const content = `${files.bugReports}\n---\n\n${files.bdd}\n---\n\n${files.e2e}\n---\n\n${files.release}`;
    const url = URL.createObjectURL(new Blob([content], { type: "text/markdown;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "expenseflow-qa-portfolio.md";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function remove(group: DeliverableStage, id: string) {
    setData((current) => ({ ...current, [group]: current[group].filter((item) => item.id !== id) }));
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <ChallengeStepper />
      <header className="mt-7 grid gap-6 border-b border-white/10 pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-coral">Bancada de entregas</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-off-white sm:text-5xl">Do bug à regressão automatizada.</h1>
          <p className="mt-4 max-w-3xl leading-7 text-[#8B949E]">Documente sua investigação, converta riscos em exemplos executáveis e justifique o que merece cobertura E2E. O conteúdo fica salvo somente neste navegador.</p>
        </div>
        <div className="rounded-xl border border-neon/20 bg-neon/[.05] px-5 py-4 text-right">
          <strong className="text-2xl font-black text-neon">{completed}/4</strong>
          <p className="text-xs text-[#8B949E]">etapas com entregas</p>
        </div>
      </header>

      <nav className="mt-8 grid gap-3 md:grid-cols-4" aria-label="Etapas do desafio">
        {stages.map((item) => {
          const count = item.id === "release" ? Number(Boolean(data.release)) : data[item.id].length;
          return <button key={item.id} type="button" onClick={() => setStage(item.id)} className={`rounded-xl border p-4 text-left transition ${stage === item.id ? "border-mint/45 bg-mint/[.07]" : "border-white/10 bg-[#171B21] hover:border-white/20"}`}>
            <span className="flex items-center justify-between text-sm font-black text-off-white">{item.label}{count > 0 && <span className="inline-flex size-6 items-center justify-center rounded-full bg-neon text-[11px] text-[#101319]">{count}</span>}</span>
            <span className="mt-1 block text-xs text-[#69737E]">{item.hint}</span>
          </button>;
        })}
      </nav>

      <section className="mt-6 rounded-2xl border border-white/10 bg-[#151A20] p-5 sm:p-7">
        {stage === "bugs" && <BugStage items={data.bugs} add={(item) => setData((value) => ({ ...value, bugs: [...value.bugs, item] }))} remove={(id) => remove("bugs", id)} />}
        {stage === "bdd" && <BddStage items={data.bdd} add={(item) => setData((value) => ({ ...value, bdd: [...value.bdd, item] }))} remove={(id) => remove("bdd", id)} />}
        {stage === "e2e" && <E2eStage items={data.e2e} add={(item) => setData((value) => ({ ...value, e2e: [...value.e2e, item] }))} remove={(id) => remove("e2e", id)} />}
        {stage === "release" && <ReleaseStage value={data.release} save={(release) => setData((value) => ({ ...value, release }))} />}
      </section>

      <PortfolioGuide />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-[#69737E]">Qualidade vale mais que quantidade. Uma entrega bem justificada por etapa já fecha o ciclo.</p>
        <div className="flex flex-col gap-3 sm:flex-row"><button type="button" onClick={downloadPortfolio} disabled={completed === 0} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-mint/30 px-5 text-sm font-black text-mint disabled:cursor-not-allowed disabled:opacity-40"><Download className="size-4" />Exportar portfólio</button><Link href="/playground/conclusao" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-neon px-5 text-sm font-black text-[#101319]">Revisar e concluir <ArrowRight className="size-4" /></Link></div>
      </div>
    </main>
  );
}

const repositoryCommands = `mkdir expenseflow-qa-challenge
cd expenseflow-qa-challenge
git init
git add .
git commit -m "docs: adiciona desafio QA ExpenseFlow"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/expenseflow-qa-challenge.git
git push -u origin main`;

const readmeTemplate = `# ExpenseFlow — QA Challenge

Projeto de portfólio com investigação exploratória, bug reports, cenários BDD e estratégia de automação E2E.

## Objetivo
Explique o contexto do sistema e o risco de negócio avaliado.

## Estratégia de testes
- Escopo e abordagem exploratória
- Ambientes e ferramentas
- Critérios de priorização

## Resultados
- Quantidade de bugs por severidade
- Principais riscos encontrados
- Cenários BDD criados
- Fluxos escolhidos para automação E2E

## Estrutura
- docs/bug-reports.md
- docs/cenarios-bdd.feature
- docs/estrategia-e2e.md
- e2e/ (quando houver código de automação)

## Decisões de qualidade
Documente o que foi automatizado, o que continuou manual e por quê.

## Como executar
Inclua os pré-requisitos e comandos somente quando houver testes automatizados.`;

function PortfolioGuide() {
  const [copied, setCopied] = useState<"commands" | "readme" | null>(null);
  async function copy(value: string, type: "commands" | "readme") {
    await navigator.clipboard.writeText(value);
    setCopied(type);
    window.setTimeout(() => setCopied(null), 1800);
  }
  const steps = [
    ["Organize os artefatos", "Crie uma pasta para o projeto e separe bug reports, cenários BDD, estratégia E2E e evidências. Remova dados pessoais e segredos."],
    ["Crie o repositório", "No GitHub, selecione New repository, use um nome como expenseflow-qa-challenge, adicione uma descrição objetiva e escolha Public."],
    ["Prepare um README", "Apresente contexto, estratégia, resultados e decisões. Recrutadores precisam entender seu raciocínio antes de abrir arquivos técnicos."],
    ["Publique com Git", "Adicione os arquivos, faça um commit claro, conecte o repositório remoto e envie a branch main usando os comandos abaixo."],
    ["Transforme em portfólio", "Fixe o repositório no perfil do GitHub e adicione o link ao currículo e LinkedIn com uma frase sobre riscos encontrados e cobertura proposta."],
  ];
  return <section className="mt-8 overflow-hidden rounded-2xl border border-[#7BA7E8]/25 bg-[#151A20]" aria-labelledby="portfolio-title">
    <div className="border-b border-white/10 bg-[#7BA7E8]/[.06] p-5 sm:p-7"><Github className="size-6 text-[#9BC0F5]" /><p className="mt-4 text-xs font-bold uppercase tracking-[.2em] text-[#9BC0F5]">4. Publicação</p><h2 id="portfolio-title" className="mt-2 text-2xl font-black text-off-white">Leve o desafio para o seu portfólio.</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-[#8B949E]">Um bom repositório demonstra processo, evidência e decisões de qualidade. Não publique apenas uma lista de bugs nem copie o gabarito do desafio.</p></div>
    <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[1fr_1.05fr]">
      <ol className="space-y-5">{steps.map(([title, text], index) => <li key={title} className="flex gap-3"><span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-[#7BA7E8]/15 text-xs font-black text-[#9BC0F5]">{index + 1}</span><div><h3 className="text-sm font-black text-off-white">{title}</h3><p className="mt-1 text-xs leading-5 text-[#8B949E]">{text}</p></div></li>)}</ol>
      <div className="space-y-4">
        <CodeBlock title="Comandos para publicar" value={repositoryCommands} copied={copied === "commands"} copy={() => copy(repositoryCommands, "commands")} />
        <CodeBlock title="Modelo de README.md" value={readmeTemplate} copied={copied === "readme"} copy={() => copy(readmeTemplate, "readme")} tall />
      </div>
    </div>
    <div className="border-t border-white/10 px-5 py-4 sm:px-7"><p className="flex items-start gap-2 text-xs leading-5 text-[#8B949E]"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-neon" /><span><strong className="text-off-white">Frase para o currículo:</strong> “Planejei e executei testes exploratórios em um sistema financeiro, documentei bugs por risco, modelei regressão em BDD e defini a estratégia de automação E2E.”</span></p></div>
  </section>;
}

function CodeBlock({ title, value, copied, copy, tall = false }: { title: string; value: string; copied: boolean; copy: () => void; tall?: boolean }) {
  return <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0D1117]"><div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5"><span className="text-xs font-bold text-[#AAB2BC]">{title}</span><button type="button" onClick={copy} className="inline-flex items-center gap-1.5 text-[11px] font-bold text-mint"><Clipboard className="size-3.5" />{copied ? "Copiado" : "Copiar"}</button></div><pre className={`${tall ? "max-h-72" : "max-h-56"} overflow-auto p-4 text-[11px] leading-5 text-[#C4CBD3]`}><code>{value}</code></pre></div>;
}

function SectionTitle({ icon: Icon, title, text }: { icon: typeof Bug; title: string; text: string }) {
  return <div className="mb-6"><Icon className="size-5 text-mint" /><h2 className="mt-3 text-xl font-black text-off-white">{title}</h2><p className="mt-2 text-sm leading-6 text-[#8B949E]">{text}</p></div>;
}

function BugStage({ items, add, remove }: { items: BugReport[]; add: (item: BugReport) => void; remove: (id: string) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    add({ id: newId(), title: String(form.get("title")), steps: String(form.get("steps")), actual: String(form.get("actual")), expected: String(form.get("expected")), severity: String(form.get("severity")) as BugReport["severity"], evidence: String(form.get("evidence")) });
    event.currentTarget.reset();
  }
  return <><SectionTitle icon={Bug} title="Bug report" text="Registre comportamento, impacto e expectativa. Não confunda sintoma com causa sem evidência." /><form onSubmit={submit} className="grid gap-3"><input required name="title" className="field" placeholder="Título objetivo do problema" /><div className="grid gap-3 md:grid-cols-2"><textarea required name="steps" rows={4} className="field" placeholder="Passos para reproduzir" /><textarea required name="actual" rows={4} className="field" placeholder="Resultado atual" /><textarea required name="expected" rows={3} className="field" placeholder="Resultado esperado" /><div className="grid gap-3"><select name="severity" className="field"><option>Baixa</option><option>Média</option><option>Alta</option><option>Crítica</option></select><input required name="evidence" className="field" placeholder="Evidência: arquivo, vídeo ou descrição" /></div></div><SaveButton label="Adicionar bug report" /></form><ItemList items={items} remove={remove} render={(item) => <><strong>{item.title}</strong><span>{item.severity} · {item.expected}</span><span className="text-[#69737E]">Evidência: {item.evidence || "não informada"}</span></>} /></>;
}

function BddStage({ items, add, remove }: { items: BddScenario[]; add: (item: BddScenario) => void; remove: (id: string) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    add({ id: newId(), feature: String(form.get("feature")), title: String(form.get("title")), given: String(form.get("given")), when: String(form.get("when")), then: String(form.get("then")) }); event.currentTarget.reset();
  }
  return <><SectionTitle icon={Code2} title="Cenário de regressão em BDD" text="Descreva comportamento observável. Cada cenário deve comunicar uma regra e um resultado verificável." /><form onSubmit={submit} className="grid gap-3"><div className="grid gap-3 md:grid-cols-2"><input required name="feature" className="field" placeholder="Funcionalidade: gestão de despesas" /><input required name="title" className="field" placeholder="Cenário: cadastrar despesa válida" /></div><textarea required name="given" rows={2} className="field" placeholder="Dado que..." /><textarea required name="when" rows={2} className="field" placeholder="Quando..." /><textarea required name="then" rows={2} className="field" placeholder="Então..." /><SaveButton label="Adicionar cenário BDD" /></form><ItemList items={items} remove={remove} render={(item) => <><strong>{item.title}</strong><span>Dado {item.given} · Quando {item.when} · Então {item.then}</span></>} /></>;
}

function E2eStage({ items, add, remove }: { items: E2eCandidate[]; add: (item: E2eCandidate) => void; remove: (id: string) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    add({ id: newId(), flow: String(form.get("flow")), priority: String(form.get("priority")) as E2eCandidate["priority"], decision: String(form.get("decision")) as E2eCandidate["decision"], reason: String(form.get("reason")), assertions: String(form.get("assertions")) }); event.currentTarget.reset();
  }
  return <><SectionTitle icon={Bot} title="Plano de automação E2E" text="Automação é uma decisão de risco e retorno. Priorize fluxos estáveis, críticos e repetíveis." /><form onSubmit={submit} className="grid gap-3"><input required name="flow" className="field" placeholder="Fluxo candidato" /><div className="grid gap-3 md:grid-cols-2"><select name="priority" className="field"><option>Baixa</option><option>Média</option><option>Alta</option></select><select name="decision" className="field"><option>Automatizar</option><option>Manter manual</option></select></div><textarea required name="reason" rows={3} className="field" placeholder="Por que esta decisão faz sentido?" /><textarea required name="assertions" rows={3} className="field" placeholder="Quais resultados e estados o teste deve validar?" /><SaveButton label="Adicionar decisão E2E" /></form><ItemList items={items} remove={remove} render={(item) => <><strong>{item.flow}</strong><span>{item.decision} · Prioridade {item.priority} · {item.reason}</span></>} /></>;
}

function ReleaseStage({ value, save }: { value: ReleaseDecision | null | undefined; save: (value: ReleaseDecision) => void }) {
  const defaults: Record<CiGateName, CiGateStatus> = Object.fromEntries(ciGates.map((gate) => [gate, "not-run"])) as Record<CiGateName, CiGateStatus>;
  const [gates, setGates] = useState<Record<CiGateName, CiGateStatus>>(value?.gates ?? defaults);
  const [decision, setDecision] = useState<ReleaseDecision["decision"]>(value?.decision ?? "Bloquear");
  const [rationale, setRationale] = useState(value?.rationale ?? "");
  const [residualRisk, setResidualRisk] = useState(value?.residualRisk ?? "");
  const [monitoring, setMonitoring] = useState(value?.monitoring ?? "");
  const failed = Object.entries(gates).filter(([, status]) => status === "failed").map(([gate]) => gate);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    save({ decision, rationale, residualRisk, monitoring, gates });
  }

  return <><SectionTitle icon={ShieldCheck} title="Gates de CI e decisão de release" text="Uma release não é aprovada por parecer pronta. Registre o sinal de cada gate, o risco residual e a ação depois da publicação." />
    <form onSubmit={submit} className="grid gap-5">
      <div className="grid gap-3 md:grid-cols-5">{ciGates.map((gate) => <label key={gate} className="grid gap-2 rounded-xl border border-white/10 bg-[#101319] p-3 text-xs font-bold text-[#AAB2BC]">{gate}<select value={gates[gate]} onChange={(event) => setGates((current) => ({ ...current, [gate]: event.target.value as CiGateStatus }))} className="field h-9 text-xs"><option value="not-run">não executado</option><option value="passed">passou</option><option value="failed">falhou</option></select></label>)}</div>
      {failed.length > 0 && <p role="status" className="rounded-lg border border-coral/25 bg-coral/[.06] p-3 text-sm text-coral">Gate(s) falhando: {failed.join(", ")}. Se decidir liberar, explique por que o risco é aceitável e como será contido.</p>}
      <div className="grid gap-3 md:grid-cols-2"><label className="grid gap-2 text-sm font-bold text-off-white">Decisão<select value={decision} onChange={(event) => setDecision(event.target.value as ReleaseDecision["decision"])} className="field"><option>Liberar</option><option>Liberar com ressalvas</option><option>Bloquear</option></select></label><Link href="/lab/cicd" className="flex items-end rounded-lg border border-mint/25 px-4 py-3 text-sm font-bold text-mint">Praticar gates no CI/CD Lab <ArrowRight className="ml-2 size-4" /></Link></div>
      <textarea required minLength={80} value={rationale} onChange={(event) => setRationale(event.target.value)} rows={4} className="field" placeholder="Justifique a decisão com os bugs, cobertura e resultado dos gates (mínimo de 80 caracteres)." />
      <textarea required value={residualRisk} onChange={(event) => setResidualRisk(event.target.value)} rows={3} className="field" placeholder="Qual risco permanece se a release seguir? Quem o aceita?" />
      <textarea required value={monitoring} onChange={(event) => setMonitoring(event.target.value)} rows={3} className="field" placeholder="O que será monitorado após a release e qual sinal dispara rollback ou investigação?" />
      <SaveButton label="Salvar decisão de release" />
    </form>
  </>;
}

function SaveButton({ label }: { label: string }) { return <button className="mt-1 inline-flex h-10 w-fit items-center gap-2 rounded-lg bg-mint px-4 text-xs font-black text-[#101319]"><Plus className="size-4" />{label}</button>; }

function ItemList<T extends { id: string }>({ items, remove, render }: { items: T[]; remove: (id: string) => void; render: (item: T) => ReactNode }) {
  if (!items.length) return <div className="mt-7 flex items-center gap-3 rounded-xl border border-dashed border-white/10 p-4 text-xs text-[#69737E]"><ClipboardList className="size-4" />Nenhuma entrega registrada nesta etapa.</div>;
  return <div className="mt-7 space-y-2">{items.map((item) => <article key={item.id} className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-[#101319] p-4"><div className="grid gap-1 text-sm text-off-white">{render(item)}</div><button type="button" onClick={() => remove(item.id)} aria-label="Excluir entrega" className="text-[#69737E] hover:text-coral"><Trash2 className="size-4" /></button></article>)}</div>;
}
