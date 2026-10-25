"use client";

import { useState } from "react";
import { ArrowRight, Check, GitCompareArrows, ReceiptText } from "lucide-react";

export function HomeInvestigationDemo() {
  const [compared, setCompared] = useState(false);

  return <section aria-labelledby="investigation-demo-title" className="rounded-2xl border border-border bg-[#121714] p-4 shadow-[0_18px_55px_rgba(0,0,0,.22)] sm:p-5">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
      <div className="flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><ReceiptText aria-hidden="true" className="size-4" /></span>
        <div>
          <h2 id="investigation-demo-title" className="text-sm font-semibold">Extrato de janeiro</h2>
          <p className="text-xs text-muted-foreground">Ambiente de Finanças · Lab 01</p>
        </div>
      </div>
      <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] text-muted-foreground">12 lançamentos</span>
    </div>

    <div className="grid grid-cols-2 gap-2.5 py-4 sm:gap-3">
      <div className="rounded-xl border border-white/10 bg-white/[.025] p-3 sm:p-4">
        <p className="text-xs text-muted-foreground">Saldo exibido</p>
        <p className="mt-1 whitespace-nowrap font-mono text-[.9rem] font-semibold tabular-nums sm:text-2xl">R$ 1.530,00</p>
      </div>
      <div className={`rounded-xl border p-3 transition-colors sm:p-4 ${compared ? "border-primary/40 bg-primary/[.07]" : "border-white/10 bg-white/[.025]"}`}>
        <p className="text-xs text-muted-foreground">Saldo esperado</p>
        <p className={`mt-1 whitespace-nowrap font-mono text-[.9rem] font-semibold tabular-nums transition-colors sm:text-2xl ${compared ? "text-primary" : "text-muted-foreground"}`}>{compared ? "R$ 1.730,00" : "—"}</p>
        {!compared && <p className="mt-1 text-[10px] leading-4 text-muted-foreground">Revele o esperado</p>}
      </div>
    </div>

    <button type="button" onClick={() => setCompared((value) => !value)} aria-expanded={compared} aria-controls="investigation-demo-result" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-primary/35 bg-primary/[.08] px-4 text-sm font-semibold text-primary transition hover:border-primary/60 hover:bg-primary/[.13] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
      <GitCompareArrows aria-hidden="true" className="size-4" />
      {compared ? "Ocultar comparação" : "Comparar resultados"}
      <ArrowRight aria-hidden="true" className={`size-4 transition-transform ${compared ? "rotate-90" : ""}`} />
    </button>

    {compared && <div id="investigation-demo-result" className="qa-demo-result mt-3 rounded-xl border border-amber-400/25 bg-amber-400/[.055] p-3.5 sm:p-4" aria-live="polite">
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-300/15 text-amber-200"><Check aria-hidden="true" className="size-3.5" /></span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-amber-100">Diferença encontrada: R$ 200,00</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">O exercício pede comparar os 12 lançamentos com o saldo esperado e explicar o que consegue reproduzir.</p>
        </div>
      </div>
      <div className="mt-3 border-t border-amber-200/10 pt-3 font-mono text-[11px] leading-5 text-[#D7DED9]">
        <p><span className="text-muted-foreground">Esperado</span>  R$ 1.730,00</p>
        <p><span className="text-muted-foreground">Exibido&nbsp; </span>  R$ 1.530,00</p>
        <p><span className="text-muted-foreground">Diferença</span>  R$ 200,00</p>
      </div>
    </div>}
    <p className="mt-3 text-center text-[11px] text-muted-foreground">Demonstração do Lab 01 · não altera nem conclui seu progresso</p>
  </section>;
}
