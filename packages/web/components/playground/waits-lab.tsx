"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LabBrief, LabShell } from "./login-lab";

export function WaitsLab() {
  const params = useSearchParams();
  const initialDelay = Number(params.get("delay") ?? 500);
  const bug = params.get("bug");
  const [delay, setDelay] = useState(initialDelay);
  const [unstable, setUnstable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dynamicId, setDynamicId] = useState("dynamic-initial");
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (bug === "infinite-loading") return;
    const done = window.setTimeout(() => {
      setLoading(false);
      setEnabled(true);
    }, unstable ? delay + Math.floor(Math.random() * 700) : delay);
    const interval = window.setInterval(() => setProgress((value) => Math.min(100, value + 10)), Math.max(80, delay / 10));
    return () => {
      window.clearTimeout(done);
      window.clearInterval(interval);
    };
  }, [bug, delay, run, unstable]);

  function restart(nextDelay = delay, nextUnstable = unstable) {
    setLoading(true);
    setEnabled(false);
    setProgress(0);
    setDynamicId(`dynamic-${nextDelay}-${nextUnstable ? "unstable" : "stable"}-${run + 1}`);
    setRun((value) => value + 1);
  }

  return (
    <LabShell title="Lab 5: waits inteligentes" description="Use estado observavel da UI, rede e acessibilidade para esperar o comportamento correto sem sleep fixo.">
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <section className="rounded-lg border border-white/10 bg-card p-5">
          <div className="flex flex-wrap items-center gap-4">
            <label className="grid gap-2 text-sm font-bold text-off-white">
              Delay: {delay} ms
              <input type="range" min="0" max="5000" step="500" value={delay} onChange={(event) => { const next = Number(event.target.value); setDelay(next); restart(next); }} data-testid="delay-slider" />
            </label>
            <label className="flex items-center gap-2 text-sm text-[#AAB2BC]"><input type="checkbox" checked={unstable} onChange={(event) => { setUnstable(event.target.checked); restart(delay, event.target.checked); }} /> modo instavel</label>
            <button type="button" onClick={() => restart()} className="rounded-lg border border-white/10 px-3 py-2 text-sm font-bold text-off-white">Resetar estado</button>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-[#101319] p-4" data-testid="ajax-panel">
              <h2 className="font-bold text-off-white">AJAX delay</h2>
              {loading ? <div className="mt-4 h-20 animate-pulse rounded bg-white/10" data-testid="skeleton" /> : <p className="mt-4 text-sm text-neon" data-testid="ajax-result">Dados persistidos com sucesso.</p>}
            </div>
            <div className="relative rounded-lg border border-white/10 bg-[#101319] p-4">
              <h2 className="font-bold text-off-white">Overlay e disabled</h2>
              <button disabled={!enabled} className="mt-4 rounded-lg bg-mint px-4 py-2 text-sm font-black text-[#101319] disabled:cursor-not-allowed disabled:opacity-40" data-testid="delayed-button">Confirmar</button>
              {loading && <div className="absolute inset-0 rounded-lg bg-[#101319]/50" aria-hidden data-testid="blocking-overlay" />}
            </div>
            <div className="rounded-lg border border-white/10 bg-[#101319] p-4">
              <h2 className="font-bold text-off-white">Progress bar</h2>
              <div className="mt-4 h-3 overflow-hidden rounded bg-white/10"><div className="h-full bg-neon" style={{ width: `${progress}%` }} data-testid="progress-value" /></div>
            </div>
            <div id={dynamicId} className="rounded-lg border border-white/10 bg-[#101319] p-4" data-testid="dynamic-id-card">
              <h2 className="font-bold text-off-white">ID dinamico</h2>
              <p className="mt-2 font-mono text-xs text-[#8B949E]">{dynamicId}</p>
            </div>
          </div>
        </section>
        <LabBrief items={["Esperar o texto final aparecer.", "Esperar o botao ficar habilitado antes do clique.", "Nao usar ID dinamico como seletor principal.", "Detectar loading infinito em modo bugado."]} />
      </div>
    </LabShell>
  );
}
