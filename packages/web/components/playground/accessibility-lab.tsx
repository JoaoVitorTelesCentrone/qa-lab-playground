"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LabShell } from "./login-lab";
import { SelectField, toOptions } from "@/components/ui/select-field";

export function AccessibilityLab() {
  const bug = useSearchParams().get("bug");
  const [modal, setModal] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  function close() {
    setModal(false);
    if (bug !== "missing-focus") triggerRef.current?.focus();
  }
  return (
    <LabShell title="Lab 89: acessibilidade por teclado" description="Conclua login, carrinho e checkout sem mouse e valide foco, labels, aria-live e modal acessivel.">
      <a href="#a11y-main" className="sr-only focus:not-sr-only focus:rounded-lg focus:bg-neon focus:px-3 focus:py-2 focus:text-[#101319]">Pular para conteudo</a>
      <main id="a11y-main" className={bug === "missing-focus" ? "[&_*:focus-visible]:outline-none" : ""}>
        <section className="grid gap-4 rounded-lg border border-white/10 bg-card p-5 sm:grid-cols-3">
          <label className="grid gap-2 text-sm font-bold">Email<input className="field" type="email" aria-describedby="email-help" /></label>
          <label className="grid gap-2 text-sm font-bold">Opcao<SelectField options={toOptions(["Entrega padrao", "Retirada"])} defaultValue="Entrega padrao" aria-label="Opcao" /></label>
          <button ref={triggerRef} onClick={() => setModal(true)} className="self-end rounded-lg bg-neon px-4 py-3 text-sm font-black text-[#101319]" aria-haspopup="dialog">Abrir modal</button>
          <p id="email-help" className="text-xs text-[#8B949E]">Campo usado para testar label e descricao.</p>
        </section>
        <section className="mt-5 overflow-x-auto rounded-lg border border-white/10 bg-[#161B22]">
          <table className="w-full min-w-[520px] text-left text-sm">
            <caption className="sr-only">Checklist de acessibilidade</caption>
            <thead className="bg-white/5 text-off-white"><tr><th className="p-3">Item</th><th className="p-3">Esperado</th><th className="p-3">Status</th></tr></thead>
            <tbody className="text-[#AAB2BC]">
              {["Foco visivel", "Ordem de tab", "Nome acessivel", "Erro anunciado"].map((item) => <tr key={item} className="border-t border-white/10"><td className="p-3">{item}</td><td className="p-3">Navegavel por teclado</td><td className="p-3">verificar</td></tr>)}
            </tbody>
          </table>
        </section>
        {modal && (
          <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
            <div className="w-full max-w-md rounded-lg border border-white/10 bg-card p-5">
              <h2 id="modal-title" className="text-xl font-black text-off-white">Modal acessivel</h2>
              <p className="mt-3 text-sm text-[#AAB2BC]">Feche com o botao e confirme se o foco volta para o acionador.</p>
              <button autoFocus onClick={close} className="mt-5 rounded-lg bg-neon px-4 py-2 text-sm font-black text-[#101319]">Fechar</button>
            </div>
          </div>
        )}
      </main>
    </LabShell>
  );
}
