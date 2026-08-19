"use client";

// Barra de progresso no topo durante a troca de página.
//
// O App Router não expõe um evento global de navegação (o antigo
// `router.events` do pages router não existe mais), então a barra é montada a
// partir de dois sinais:
//
// 1. Início: clique de captura em qualquer `<a>` interno e `popstate` (voltar/
//    avançar do navegador). Praticamente toda navegação do site é `<Link>`,
//    e para os poucos `router.push` existe `startNavigationProgress()`.
// 2. Fim: mudança de `pathname`/`searchParams`, que só acontece depois que a
//    nova rota foi comprometida na tela.
//
// O atraso antes de aparecer evita piscar a barra em navegação instantânea
// (rota já pré-carregada pelo prefetch do Link).

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const SHOW_DELAY_MS = 150;
const TICK_MS = 200;
const FADE_MS = 240;
const MAX_WAIT_MS = 10000;

const START_EVENT = "qa-lab:navigation-start";

/** Dispara a barra para navegações feitas por `router.push`/`router.replace`. */
export function startNavigationProgress() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(START_EVENT));
}

function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timers = useRef<{ show?: number; tick?: number; hide?: number; guard?: number }>({});
  const running = useRef(false);
  const shown = useRef(false);

  const clearTimers = useCallback(() => {
    window.clearTimeout(timers.current.show);
    window.clearInterval(timers.current.tick);
    window.clearTimeout(timers.current.hide);
    window.clearTimeout(timers.current.guard);
    timers.current = {};
  }, []);

  const finish = useCallback(() => {
    if (!running.current) return;
    running.current = false;
    clearTimers();
    if (!shown.current) return;
    setProgress(100);
    timers.current.hide = window.setTimeout(() => {
      shown.current = false;
      setVisible(false);
      setProgress(0);
    }, FADE_MS);
  }, [clearTimers]);

  const start = useCallback(() => {
    if (running.current) return;
    running.current = true;
    clearTimers();
    timers.current.show = window.setTimeout(() => {
      shown.current = true;
      setVisible(true);
      setProgress(12);
      // Avanço assintótico: chega perto de 90% e espera a rota comprometer.
      timers.current.tick = window.setInterval(() => {
        setProgress((current) => current + (90 - current) * 0.14);
      }, TICK_MS);
    }, SHOW_DELAY_MS);
    // Rede de segurança: navegação abortada não deixa a barra presa na tela.
    timers.current.guard = window.setTimeout(finish, MAX_WAIT_MS);
  }, [clearTimers, finish]);

  // A rota mudou de fato — só aqui a barra pode fechar.
  useEffect(() => {
    finish();
  }, [pathname, searchParams, finish]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor || !anchor.getAttribute("href")) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Âncora na mesma página (só o hash muda) não troca de rota.
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      start();
    }

    window.addEventListener("click", onClick, true);
    window.addEventListener("popstate", start);
    window.addEventListener(START_EVENT, start);
    return () => {
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", start);
      window.removeEventListener(START_EVENT, start);
    };
  }, [start]);

  useEffect(() => clearTimers, [clearTimers]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[200] h-[3px]" role="status" aria-label="Carregando página">
      <div
        className="h-full rounded-r-full bg-primary shadow-[0_0_12px_var(--primary)] transition-[width,opacity] duration-200 ease-out"
        style={{ width: `${progress}%`, opacity: progress >= 100 ? 0 : 1 }}
      />
    </div>
  );
}

export function NavigationProgress() {
  // `useSearchParams` exige Suspense para não tornar todas as páginas dinâmicas.
  return (
    <Suspense fallback={null}>
      <NavigationProgressBar />
    </Suspense>
  );
}
