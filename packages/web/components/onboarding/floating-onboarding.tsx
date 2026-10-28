"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, Suspense, useCallback, useContext, useEffect, useEffectEvent, useRef, useState, useSyncExternalStore, type ComponentProps, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Compass, Minus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { onboardingSteps, ONBOARDING_STORAGE_KEY, parseTourState, supportsOnboarding, type TourLab, type TourState } from "@/lib/onboarding";

const OnboardingContext = createContext<(() => void) | null>(null);
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}
function readSaved() {
  try { return window.localStorage.getItem(ONBOARDING_STORAGE_KEY); }
  catch { return null; }
}
const serverSnapshot = () => null;
const placementClasses = {
  "top-left": "left-4 top-4 sm:left-6 sm:top-6",
  "top-right": "right-4 top-4 sm:right-6 sm:top-6",
  "bottom-left": "bottom-4 left-4 sm:bottom-6 sm:left-6",
  "bottom-right": "bottom-4 right-4 sm:bottom-6 sm:right-6",
} as const;

/** Keeps auth callbacks and previously shared /comecar links working. */
function OnboardingRequest({ start }: { start: () => void }) {
  const params = useSearchParams();
  const requestStart = useEffectEvent(start);
  useEffect(() => {
    if (params.get("onboarding") !== "1") return;
    const timer = setTimeout(() => {
      requestStart();
      const url = new URL(window.location.href);
      url.searchParams.delete("onboarding");
      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    }, 0);
    return () => clearTimeout(timer);
  }, [params]);
  return null;
}

export function OnboardingLink({ children, onClick, ...props }: Omit<ComponentProps<typeof Link>, "href">) {
  const start = useContext(OnboardingContext);
  return <Link {...props} href="/comecar" onClick={(event) => {
    onClick?.(event);
    if (!start || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target === "_blank") return;
    event.preventDefault();
    start();
  }}>{children}</Link>;
}

export function FloatingOnboarding({ lab, children }: { lab: TourLab | null; children: ReactNode }) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const saved = useSyncExternalStore(subscribe, readSaved, serverSnapshot);
  const [edited, setEdited] = useState<TourState | null>(null);
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  const [minimized, setMinimized] = useState(true);
  const [placement, setPlacement] = useState<keyof typeof placementClasses>("bottom-right");
  const heading = useRef<HTMLHeadingElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const steps = onboardingSteps(lab);
  const tour = edited ?? parseTourState(saved, steps.length);
  const tourStep = tour?.step ?? 0;
  const tourStatus = tour?.status;
  const open = tour?.status === "active" && !minimized && supportsOnboarding(pathname);
  const current = steps[tour?.step ?? 0];

  const save = useCallback((next: TourState) => {
    setEdited(next);
    try { window.localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(next)); }
    catch { setStorageUnavailable(true); }
  }, []);

  function start() {
    setMinimized(false);
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    save({ version: 1, step: tourStatus && tourStatus !== "completed" ? tourStep : pathname === "/labs" ? 1 : 0, status: "active" });
    if (!supportsOnboarding(pathname)) router.push("/");
    requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }));
  }

  function close(completed = false) {
    if (!tourStatus) return;
    save({ version: 1, step: tourStep, status: completed ? "completed" : "dismissed" });
    requestAnimationFrame(() => {
      const target = returnFocus.current?.isConnected ? returnFocus.current : launcher.current;
      target?.focus({ preventScroll: true });
    });
  }
  const closeOnEscape = useEffectEvent(() => close());

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") closeOnEscape(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // The guide activates the real Lab controls and highlights the real content.
  useEffect(() => {
    if (!open || pathname !== current.route) return;
    let highlighted: HTMLElement | null = null;
    let activated = false;
    function reveal() {
      if (current.labStep !== undefined && !activated) {
        const button = document.querySelector<HTMLButtonElement>(`[data-onboarding="lab-step-${current.labStep}"]`);
        if (!button) return;
        activated = true;
        button.click();
      }
      const target = document.querySelector<HTMLElement>(current.selector);
      if (!target || highlighted === target) return;
      highlighted?.removeAttribute("data-onboarding-highlight");
      highlighted = target;
      target.setAttribute("data-onboarding-highlight", "true");
      target.scrollIntoView({ block: "start", behavior: "instant" });
      const bounds = target.getBoundingClientRect();
      const horizontal = bounds.left + bounds.width / 2 > window.innerWidth / 2 ? "left" : "right";
      const vertical = bounds.top + bounds.height / 2 < window.innerHeight / 2 ? "bottom" : "top";
      setPlacement(`${vertical}-${horizontal}` as keyof typeof placementClasses);
    }
    const observer = new MutationObserver(reveal);
    observer.observe(document.getElementById("main-content") ?? document.body, { childList: true, subtree: true });
    reveal();
    return () => {
      observer.disconnect();
      highlighted?.removeAttribute("data-onboarding-highlight");
    };
  }, [current.labStep, current.route, current.selector, open, pathname]);

  function goTo(step: number) {
    save({ version: 1, step, status: "active" });
    if (pathname !== steps[step].route) router.push(steps[step].route);
    requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }));
  }

  function advance() {
    if (!tour) return;
    if (pathname !== current.route) { router.push(current.route); return; }
    if (tour.step === steps.length - 1) close(true);
    else goTo(tour.step + 1);
  }

  return <OnboardingContext.Provider value={start}>
    {children}
    <Suspense fallback={null}><OnboardingRequest start={start} /></Suspense>
    {supportsOnboarding(pathname) && (open && tour ? <section role="dialog" aria-modal="false" aria-labelledby="floating-onboarding-title" aria-describedby="floating-onboarding-description" className={`qa-onboarding-panel fixed z-[70] flex max-h-[min(34rem,calc(100dvh-2rem))] w-[min(23rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl bg-card text-foreground shadow-[0_12px_48px_rgba(0,0,0,0.45)] sm:max-h-[calc(100dvh-3rem)] ${placementClasses[placement]}`}>
      <div className="flex items-center justify-between gap-4 px-5 pt-3">
        <p className="flex items-center gap-2 text-sm font-medium text-primary"><Compass aria-hidden="true" className="size-4" /> Primeiros passos</p>
        <div className="flex items-center">
          <button type="button" onClick={() => setMinimized(true)} aria-label="Minimizar orientação" className="flex size-11 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"><Minus aria-hidden="true" className="size-4" /></button>
          <button type="button" onClick={() => close()} aria-label="Fechar orientação" className="flex size-11 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"><X aria-hidden="true" className="size-4" /></button>
        </div>
      </div>
      <div className="overflow-y-auto px-5 pb-5">
        <p role="status" className="mt-1 text-xs text-muted-foreground">Etapa {tour.step + 1} de {steps.length}</p>
        <h2 ref={heading} tabIndex={-1} id="floating-onboarding-title" className="mt-3 text-balance text-xl font-semibold leading-tight tracking-[-0.025em] outline-none">{current.title}</h2>
        <p id="floating-onboarding-description" className="mt-3 text-sm leading-6 text-muted-foreground">{current.text}</p>
        <div className="mt-5 flex gap-1.5" aria-hidden="true">{steps.map((_, index) => <span key={index} className={`h-1 flex-1 rounded-full ${index <= tour.step ? "bg-primary" : "bg-muted"}`} />)}</div>
        {storageUnavailable && <p role="status" className="mt-3 text-xs leading-5 text-muted-foreground">Você pode continuar, mas esta visita não será lembrada ao sair.</p>}
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-border p-3">
        {tour.step > 0 ? <Button type="button" variant="ghost" size="lg" className="px-3" onClick={() => goTo(tour.step - 1)}><ArrowLeft aria-hidden="true" className="size-4" /> Voltar</Button> : <Button type="button" variant="ghost" size="lg" className="px-3" onClick={() => close()}>Pular</Button>}
        <Button type="button" size="lg" className="px-4 text-sm" onClick={advance}>{pathname === current.route ? current.action : "Ver esta etapa"}<ArrowRight aria-hidden="true" className="size-4" /></Button>
      </div>
    </section> : <button ref={launcher} type="button" onClick={start} aria-label="Abrir guia de primeiros passos" className={`fixed z-40 inline-flex size-11 items-center justify-center rounded-full bg-primary p-0 text-sm font-semibold text-primary-foreground shadow-[0_6px_24px_rgba(0,0,0,0.28)] hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:h-auto sm:w-auto sm:gap-2 sm:px-4 ${placementClasses[placement]}`}><Compass aria-hidden="true" className="size-4" /><span className="sr-only sm:not-sr-only">Primeiros passos</span></button>)}
  </OnboardingContext.Provider>;
}
