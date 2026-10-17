"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { canExportRequirements, createRequirementsAttempt, exportRequirementsMarkdown, hasResponse, parseRequirementsDraft, requirementsExperiment, revealRequirements, type ExperimentResponse, type RequirementsAttempt } from "@/lib/mentorship/requirements-experiment";

const draftKey = "qa-lab:requirements-experiment:v1";
const fieldClass = "mt-2 w-full rounded-lg border border-white/25 bg-[#101319] p-3 text-base leading-7 text-off-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint";
const buttonClass = "rounded-lg border border-white/25 px-4 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint disabled:cursor-not-allowed disabled:opacity-40";

export function RequirementsLab() {
  const [attempt, setAttempt] = useState<RequirementsAttempt>(createRequirementsAttempt);
  const [stage, setStage] = useState<1 | 2 | 3>(1);
  const [notice, setNotice] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, [stage]);

  function save() {
    try { localStorage.setItem(draftKey, JSON.stringify(attempt)); setNotice("Rascunho salvo neste navegador. Em computador compartilhado, remova-o ao terminar."); }
    catch { setNotice("Não foi possível salvar neste navegador. Mantenha a página aberta e exporte seu relatório ao concluir."); }
  }
  function restore() {
    if (!window.confirm("Recuperar o último rascunho salvo? Isso substitui o que está aberto nesta página.")) return;
    try {
      const draft = parseRequirementsDraft(localStorage.getItem(draftKey) ?? "");
      if (!draft) { setNotice("Nenhum rascunho compatível foi encontrado."); return; }
      setAttempt(draft); setStage(draft.baseline ? 2 : 1); setNotice("Rascunho recuperado. Confira as respostas antes de continuar.");
    } catch { setNotice("Não foi possível acessar o rascunho neste navegador."); }
  }
  function restart() {
    if (!window.confirm("Iniciar outra tentativa e apagar o rascunho local? Exporte antes se quiser preservar esta entrega.")) return;
    try { localStorage.removeItem(draftKey); } catch { setNotice("O navegador não permitiu remover o rascunho. A tentativa aberta foi reiniciada."); setAttempt(createRequirementsAttempt()); setStage(1); return; }
    setAttempt(createRequirementsAttempt()); setStage(1); setNotice("Nova tentativa iniciada; rascunho anterior removido.");
  }
  function download() {
    const url = URL.createObjectURL(new Blob([exportRequirementsMarkdown(attempt)], { type: "text/markdown;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = "lab-requisitos-comparacao.md"; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Relatório exportado. Ele ainda não foi enviado ao mentor: use a entrega da semana 3.");
  }
  function updateResponse(key: "initial" | "revised", value: ExperimentResponse) {
    setAttempt(current => key === "initial" && current.baseline ? current : { ...current, [key]: value });
  }

  return <div>
    <ol aria-label="Etapas do experimento" className="grid gap-3 border-y border-white/15 py-4 text-sm sm:grid-cols-3">
      {["Registrar interpretação", "Revisar com critérios", "Comparar e exportar"].map((label, index) => <li key={label} aria-current={stage === index + 1 ? "step" : undefined} className={stage === index + 1 ? "font-bold text-mint" : "text-[#AAB2BC]"}>{index + 1}. {label}</li>)}
    </ol>
    <div className="my-5 flex flex-wrap gap-3"><button className={buttonClass} onClick={save}>Salvar rascunho</button><button className={buttonClass} onClick={restore}>Recuperar rascunho</button><button className={buttonClass} onClick={restart}>Nova tentativa</button></div>
    <p className="text-sm leading-6 text-[#AAB2BC]">Salvamento manual, apenas neste navegador. Salve antes de sair ou recarregar. Use somente dados fictícios.</p>
    <p role="status" aria-live="polite" className="my-4 min-h-6 text-sm text-mint">{notice}</p>
    <h2 ref={heading} tabIndex={-1} className="text-2xl font-bold outline-none">{stage === 1 ? "O que você entendeu da história?" : stage === 2 ? "Agora, confronte sua interpretação" : "O que mudou na sua cobertura?"}</h2>
    {stage === 1 && <section className="mt-6 space-y-6">
      <blockquote className="max-w-[70ch] border-l-4 border-mint bg-white/5 p-5 text-lg leading-8">{requirementsExperiment.brief}</blockquote>
      <p className="max-w-[70ch] leading-7 text-[#C8CFD7]">Registre as perguntas que faria ao produto e seus primeiros cenários, com entradas e resultados esperados. Marque como hipótese qualquer regra que você precisar supor.</p>
      <ResponseFields response={attempt.initial} onChange={value => updateResponse("initial", value)} prefix="initial" revised={false} />
      <p className="text-sm text-[#AAB2BC]">Ao continuar, esta resposta fica congelada para a comparação. Preencha perguntas (mínimo 10 caracteres) e cenários (mínimo 20).</p>
      <button disabled={!hasResponse(attempt.initial)} className={`${buttonClass} bg-mint text-[#101319]`} onClick={() => { setAttempt(current => revealRequirements(current)); setStage(2); setNotice("Interpretação inicial preservada. Revise sua resposta com as quatro regras."); }}>Preservar resposta e revelar critérios</button>
    </section>}
    {stage === 2 && <section className="mt-6 space-y-7">
      <ul className="space-y-3 rounded-lg bg-white/5 p-5 text-base leading-7 text-[#D9DEE4]">{requirementsExperiment.rules.map(rule => <li key={rule}>{rule}</li>)}</ul>
      <details className="border-y border-white/15 py-4"><summary className="cursor-pointer text-mint">Consultar minha resposta inicial (preservada)</summary><Snapshot response={attempt.baseline!} /></details>
      <p className="max-w-[70ch] leading-7 text-[#C8CFD7]">Revise os cenários citando R1–R4. Investigue fronteiras monetárias, papéis, equipe e estado. Informe quais dúvidas foram resolvidas e quais ainda restam; se não houver dúvidas, explique por quê.</p>
      <ResponseFields response={attempt.revised} onChange={value => updateResponse("revised", value)} prefix="revised" revised />
      <button disabled={!hasResponse(attempt.revised)} className={`${buttonClass} bg-mint text-[#101319]`} onClick={() => setStage(3)}>Comparar respostas</button>
    </section>}
    {stage === 3 && <section className="mt-6 space-y-7">
      <div className="grid gap-6 md:grid-cols-2"><article className="min-w-0 rounded-lg border border-white/20 p-5"><h3 className="text-lg font-bold">Antes do esclarecimento</h3><Snapshot response={attempt.baseline!} /></article><article className="min-w-0 rounded-lg border border-mint/40 p-5"><h3 className="text-lg font-bold">Depois do esclarecimento</h3><Snapshot response={attempt.revised} /></article></div>
      <label className="block font-semibold" htmlFor="conclusion">Comparação e limites<textarea id="conclusion" rows={6} maxLength={12000} className={fieldClass} value={attempt.conclusion} onChange={e => setAttempt(current => ({ ...current, conclusion: e.target.value }))} aria-describedby="conclusion-help" /></label>
      <p id="conclusion-help" className="text-sm leading-6 text-[#AAB2BC]">Explique um cenário adicionado, removido ou mantido, a regra que motivou sua decisão e uma limitação desta comparação. Mínimo de 30 caracteres para exportar; o conteúdo será avaliado pelo mentor.</p>
      <div className="flex flex-wrap gap-3"><button className={buttonClass} onClick={() => setStage(2)}>Revisar cenários</button><button disabled={!canExportRequirements(attempt)} className={`${buttonClass} bg-mint text-[#101319]`} onClick={download}>Exportar relatório .md</button></div>
      <p className="text-sm leading-7 text-[#C8CFD7]">Copie o relatório para o campo de conteúdo ou inclua uma referência ao arquivo na sua entrega. <Link className="text-mint underline" href="/mentoria/semanas/3#enviar">Abrir entrega da semana 3</Link>. Exportar não registra conclusão automática.</p>
    </section>}
  </div>;
}

function ResponseFields({ response, onChange, prefix, revised }: { response: ExperimentResponse; onChange: (response: ExperimentResponse) => void; prefix: string; revised: boolean }) {
  return <div className="space-y-6">
    <label htmlFor={`${prefix}-questions`} className="block font-semibold">{revised ? "Perguntas resolvidas e dúvidas restantes" : "Perguntas e hipóteses"}<textarea id={`${prefix}-questions`} rows={4} maxLength={12000} className={fieldClass} value={response.questions} onChange={e => onChange({ ...response, questions: e.target.value })} /></label>
    <label htmlFor={`${prefix}-scenarios`} className="block font-semibold">{revised ? "Cenários ligados às regras" : "Cenários e resultados esperados"}<textarea id={`${prefix}-scenarios`} rows={7} maxLength={12000} className={fieldClass} value={response.scenarios} onChange={e => onChange({ ...response, scenarios: e.target.value })} placeholder="Contexto e papel → entrada → ação → resultado esperado → regra ou hipótese" /></label>
  </div>;
}

function Snapshot({ response }: { response: ExperimentResponse }) {
  return <div className="mt-4 space-y-4 break-words text-sm leading-7 text-[#C8CFD7]"><div><h4 className="font-semibold text-off-white">Perguntas</h4><p className="whitespace-pre-wrap">{response.questions}</p></div><div><h4 className="font-semibold text-off-white">Cenários</h4><p className="whitespace-pre-wrap">{response.scenarios}</p></div></div>;
}
