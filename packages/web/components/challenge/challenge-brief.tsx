"use client";

import { useState } from "react";
import { Check, Clipboard, Clock3, FileText, Lightbulb, Share2, Target } from "lucide-react";
import { SessionTracker } from "@/components/workspace/session-tracker";

const reportTemplate = `Título: [resumo objetivo do problema]

Contexto:
- Ambiente: QA Lab Playground — ExpenseFlow
- Navegador/dispositivo:

Passos para reproduzir:
1.
2.
3.

Resultado atual:

Resultado esperado:

Impacto e severidade:

Evidências:`;

export function ChallengeBrief() {
  const [copied, setCopied] = useState(false);

  function showCopied() {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function copyText(text: string) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copiedSuccessfully = document.execCommand("copy");
    textarea.remove();

    if (!copiedSuccessfully) throw new Error("Não foi possível copiar o texto.");
  }

  async function copyTemplate() {
    await copyText(reportTemplate);
    showCopied();
  }

  async function shareChallenge() {
    const data = {
      title: "ExpenseFlow Free Challenge",
      text: "Estou treinando QA em um sistema com falhas intencionais no QA Lab Playground.",
      url: window.location.href,
    };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await copyText(`${data.text} ${data.url}`);
        showCopied();
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      await copyText(`${data.text} ${data.url}`);
      showCopied();
    }
  }

  return (
    <section className="rounded-2xl border border-mint/20 bg-[#151A20] p-5 shadow-xl shadow-black/20 sm:p-7" aria-labelledby="challenge-title">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-coral/25 bg-coral/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-coral">Free Challenge</span>
            <span className="flex items-center gap-1.5 text-xs text-[#7D8793]"><Clock3 className="size-3.5" /> Timebox sugerido: 30 min</span>
          </div>
          <h1 id="challenge-title" className="text-3xl font-black tracking-tight text-off-white sm:text-4xl">ExpenseFlow</h1>
          <p className="mt-3 text-sm leading-6 text-[#AAB2BC]">
            Você entrou em um sistema financeiro antes de uma entrega. Explore os fluxos, identifique riscos e documente os problemas que considerar mais relevantes.
          </p>
        </div>
        <div className="flex flex-wrap gap-2"><SessionTracker playgroundId="expenseflow" /><button type="button" onClick={shareChallenge} className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-white/15 px-3.5 text-xs font-semibold text-[#AAB2BC] transition hover:border-mint/35 hover:text-mint"><Share2 className="size-3.5" /> Compartilhar desafio</button></div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
          <Target className="mb-3 size-4 text-mint" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-off-white">Sua missão</h2>
          <p className="mt-2 text-xs leading-5 text-[#8B949E]">Avalie os fluxos mais críticos e encontre comportamentos que ameaçam a confiança nos dados.</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
          <Lightbulb className="mb-3 size-4 text-neon" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-off-white">Ponto de partida</h2>
          <p className="mt-2 text-xs leading-5 text-[#8B949E]">Pense em consistência, limites, estados da interface e combinação de operações. Não há roteiro obrigatório.</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
          <FileText className="mb-3 size-4 text-coral" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-off-white">Entregável</h2>
          <p className="mt-2 text-xs leading-5 text-[#8B949E]">Registre título, passos, atual vs. esperado, impacto, severidade e evidência para cada achado.</p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-white/[0.08] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-[#7D8793]">Os dados são locais e voltam ao estado inicial ao recarregar a página.</p>
        <button type="button" onClick={copyTemplate} className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-mint/10 px-3.5 text-xs font-bold text-mint transition hover:bg-mint/15" aria-live="polite">
          {copied ? <Check className="size-3.5" /> : <Clipboard className="size-3.5" />}
          {copied ? "Copiado" : "Copiar modelo de bug report"}
        </button>
      </div>
    </section>
  );
}
