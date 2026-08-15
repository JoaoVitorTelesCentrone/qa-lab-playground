"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export function MicroChallengePage({ kind }: { kind: "elements" | "tables" | "dialogs" | "frames" | "shadow-dom" | "files" }) {
  const [tags, setTags] = useState(["qa", "playwright"]);
  const [tagText, setTagText] = useState("");
  const [dialog, setDialog] = useState("");
  const [progress, setProgress] = useState(35);
  const shadowHost = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (kind !== "shadow-dom" || !shadowHost.current || shadowHost.current.shadowRoot) return;
    const root = shadowHost.current.attachShadow({ mode: "open" });
    root.innerHTML = `<style>button{border:1px solid #2DD4BF;background:#101319;color:#D4F56E;border-radius:8px;padding:10px 12px;font-weight:800}</style><button data-testid="shadow-confirm">Confirmar no shadow DOM</button>`;
  }, [kind]);

  function addTag() {
    if (!tagText.trim()) return;
    setTags([...tags, tagText.trim()]);
    setTagText("");
  }

  return (
    <div className="qa-simple">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/labs" className="text-sm font-bold text-mint">Voltar para labs</Link>
      <h1 className="mt-4 text-4xl font-black leading-tight text-off-white">Microdesafio: {kind}</h1>
      <p className="mt-3 text-sm leading-7 text-[#AAB2BC]">Pagina isolada com objetivo tecnico, seletores bons e ruins, criterios de aceite e bugs opcionais.</p>
      <section className="mt-6 rounded-lg border border-white/10 bg-card p-5">
        {kind === "elements" && (
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold">Input<input className="field" data-testid="healthy-input" placeholder="seletor saudavel" /></label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" data-testid="terms-checkbox" /> checkbox</label>
            <fieldset className="grid gap-2 text-sm"><legend className="font-bold">Radio</legend><label><input type="radio" name="level" /> iniciante</label><label><input type="radio" name="level" /> avancado</label></fieldset>
            <label className="grid gap-2 text-sm font-bold">Dropdown<select className="field"><option>API</option><option>UI</option></select></label>
            <label className="grid gap-2 text-sm font-bold">Date picker<input className="field" type="date" /></label>
            <label className="grid gap-2 text-sm font-bold">Slider<input type="range" value={progress} onChange={(event) => setProgress(Number(event.target.value))} /></label>
            <div><input value={tagText} onChange={(event) => setTagText(event.target.value)} className="field" placeholder="Nova tag" /><button onClick={addTag} className="mt-2 rounded-lg bg-neon px-3 py-2 text-sm font-black text-[#101319]">Adicionar tag</button><div className="mt-2 flex gap-2">{tags.map((tag) => <span key={tag} className="rounded bg-white/10 px-2 py-1 text-xs">{tag}</span>)}</div></div>
            <div><p className="text-sm font-bold">Rating</p><div className="mt-2 flex gap-1" role="radiogroup" aria-label="Rating">{[1, 2, 3, 4, 5].map((star) => <button key={star} className="text-neon" aria-label={`${star} estrelas`}>*</button>)}</div></div>
          </div>
        )}
        {kind === "tables" && <DynamicTable />}
        {kind === "dialogs" && (
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setDialog("alert")} className="rounded-lg bg-neon px-3 py-2 text-sm font-black text-[#101319]">Alert</button>
            <button onClick={() => setDialog("modal")} className="rounded-lg border border-white/10 px-3 py-2 text-sm font-bold">Modal</button>
            <button onClick={() => window.open("/playground/elements", "_blank", "noopener,noreferrer")} className="rounded-lg border border-white/10 px-3 py-2 text-sm font-bold">Nova aba</button>
            {dialog && <div role="dialog" aria-modal="true" className="mt-4 w-full rounded-lg border border-mint/30 bg-[#101319] p-4"><p>Dialog ativo: {dialog}</p><button onClick={() => setDialog("")} className="mt-3 rounded bg-mint px-3 py-2 text-[#101319]">Fechar</button></div>}
          </div>
        )}
        {kind === "frames" && <iframe title="Frame de treino" srcDoc="<style>body{margin:0;padding:16px;background:#181B1F;color:#F8FBF9;font-family:system-ui,sans-serif}button{background:#4CAF72;color:#0C160F;border:0;border-radius:6px;padding:8px 12px;font-weight:700}</style><button data-testid='inside-frame'>Botao no iframe</button><p>Iframe aninhado simulado</p>" className="h-56 w-full rounded-lg border border-[#2B3136]" />}
        {kind === "shadow-dom" && <div ref={shadowHost} className="rounded-lg border border-white/10 bg-[#101319] p-5" data-testid="shadow-host" />}
        {kind === "files" && (
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-bold">Upload<input type="file" className="field" data-testid="file-upload" /></label>
            <a href="/bug-report-template.md" download className="rounded-lg bg-neon px-4 py-2 text-center text-sm font-black text-[#101319]">Download template</a>
            <button className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold">Secure download exige token simulado</button>
          </div>
        )}
      </section>
      <section className="mt-4 rounded-lg border border-white/10 bg-[#161B22] p-5 text-sm leading-6 text-[#AAB2BC]">
        <p><strong className="text-off-white">Criterios:</strong> usar role/data-testid, validar estado final e evitar seletor visual fragil.</p>
        <p><strong className="text-off-white">Bugs opcionais:</strong> ID dinamico, overlay, foco ausente, status errado e imagem quebrada.</p>
      </section>
      </div>
    </div>
  );
}

function DynamicTable() {
  const rows = ["Login", "Checkout", "API", "A11y", "Waits"].map((name, index) => ({ name, priority: index % 2 ? "media" : "alta", status: index % 3 ? "ativo" : "bloqueado" }));
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-white/5"><tr><th className="p-3">Modulo</th><th className="p-3">Prioridade</th><th className="p-3">Status</th></tr></thead>
        <tbody>{rows.map((row) => <tr key={row.name} className="border-t border-white/10"><td className="p-3">{row.name}</td><td className="p-3">{row.priority}</td><td className="p-3">{row.status}</td></tr>)}</tbody>
      </table>
      <div className="mt-4 h-3 overflow-hidden rounded bg-white/10"><div className="h-full w-2/3 bg-neon" data-testid="table-progress" /></div>
    </div>
  );
}
