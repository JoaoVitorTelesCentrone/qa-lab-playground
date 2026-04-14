"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FlaskConical,
  Target,
  Layers,
  BookOpen,
  Lightbulb,
  Rocket,
  X,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Bug,
  Terminal,
  ArrowRight,
  LayoutGrid,
  CalendarDays,
  Wallet,
  Trophy,
  FileCode2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ==============================
// Steps
// ==============================

interface Step {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  titulo: string;
  descricao: string;
  destaques?: { icon: React.ElementType; texto: string }[];
  cta?: { label: string; href: string };
}

const steps: Step[] = [
  {
    icon: FlaskConical,
    iconColor: "text-mint",
    iconBg: "bg-mint/10",
    titulo: "Bem-vindo ao QA Lab Playground",
    descricao:
      "Uma plataforma para evoluir em QA na prática. Aqui você explora sistemas propositalmente quebrados, escreve testes reais e acumula experiência com cenários do dia a dia.",
    destaques: [
      { icon: Bug,        texto: "Sistemas com bugs intencionais para você encontrar" },
      { icon: Terminal,   texto: "Missões com snippets de Playwright e Cypress" },
      { icon: Trophy,     texto: "Desafios mensais com XP para evoluir no seu ritmo" },
    ],
  },
  {
    icon: Lightbulb,
    iconColor: "text-[#F4A8A3]",
    iconBg: "bg-[#F4A8A3]/10",
    titulo: "Como o lab funciona",
    descricao:
      "O lab tem três tipos de conteúdo: módulos de prática com bugs reais, missões para automatizar e ferramentas para acelerar seu aprendizado.",
    destaques: [
      { icon: LayoutGrid, texto: "Módulos: Elementos, Datas e Despesas com bugs intencionais" },
      { icon: Target,     texto: "Missões: automatize bugs reais com Playwright ou Cypress" },
      { icon: Trophy,     texto: "Desafios mensais + Gerador de BDD para praticar escrita" },
    ],
  },
  {
    icon: LayoutGrid,
    iconColor: "text-mint",
    iconBg: "bg-mint/10",
    titulo: "Módulos de prática",
    descricao:
      "Cada módulo é um sistema com comportamentos propositalmente errados. Explore, encontre os bugs e use os data-testid para escrever seus testes.",
    destaques: [
      { icon: LayoutGrid,  texto: "Elementos: tabela dinâmica, loading assíncrono e interações de UI" },
      { icon: CalendarDays, texto: "Datas Bugadas: 10 bugs de data, hora e timezone para encontrar" },
      { icon: Wallet,      texto: "Despesas: paginação, bulk delete, filtros e export CSV" },
    ],
    cta: { label: "Ver Elementos", href: "/elementos" },
  },
  {
    icon: Trophy,
    iconColor: "text-neon",
    iconBg: "bg-neon/10",
    titulo: "Desafios",
    descricao:
      "Os desafios mensais te mantêm em ritmo com objetivos maiores e XP acumulado. Aceite, complete os passos e suba de nível.",
    destaques: [
      { icon: Trophy,  texto: "Desafios mensais com progresso e XP" },
      { icon: Target,  texto: "Aceite o desafio e acompanhe cada passo" },
      { icon: Lightbulb, texto: "Dificuldades variadas: iniciante ao avançado" },
    ],
    cta: { label: "Ver Desafios", href: "/desafios" },
  },
  {
    icon: Rocket,
    iconColor: "text-neon",
    iconBg: "bg-neon/10",
    titulo: "Pronto para começar?",
    descricao:
      "Explore um módulo, leia os Alvos, escolha uma Missão e escreva seu primeiro teste que prova um bug real.",
    destaques: [
      { icon: LayoutGrid, texto: "1. Explore Elementos, Datas ou Despesas" },
      { icon: Target,     texto: "2. Escolha uma Missão e escreva o teste" },
      { icon: Trophy,     texto: "3. Aceite um Desafio mensal e acumule XP" },
    ],
    cta: { label: "Explorar Elementos", href: "/elementos" },
  },
];

const STORAGE_KEY = "qa-lab-onboarding-seen";

// ==============================
// Component
// ==============================

export function OnboardingTour() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      const timer = setTimeout(() => {
        setOpen(true);
        setPulse(false);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setPulse(false);
    }
  }, []);

  function openTour() {
    setStep(0);
    setOpen(true);
    setPulse(false);
  }

  function close() {
    localStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
  }

  function next() {
    if (step < steps.length - 1) {
      setStep(s => s + 1);
    } else {
      close();
    }
  }

  function prev() {
    if (step > 0) setStep(s => s - 1);
  }

  const current = steps[step];
  const Icon = current.icon;
  const isLast = step === steps.length - 1;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={openTour}
        className={`fixed bottom-6 right-6 z-40 flex size-12 items-center justify-center rounded-full bg-mint text-[#3D5454] shadow-lg transition-transform hover:scale-110 active:scale-95 ${pulse ? "animate-pulse" : ""}`}
        title="Tour de boas-vindas"
        aria-label="Abrir tour de onboarding"
      >
        <HelpCircle className="size-5" />
      </button>

      {/* Modal overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#3D5454]/70 backdrop-blur-sm"
            onClick={close}
          />

          {/* Modal */}
          <div className="relative z-10 w-full max-w-lg rounded-2xl border border-mint/20 bg-[#405555] shadow-2xl overflow-hidden">
            {/* Progress bar */}
            <div className="h-1 w-full bg-off-white/10">
              <div
                className="h-1 bg-mint transition-all duration-300"
                style={{ width: `${((step + 1) / steps.length) * 100}%` }}
              />
            </div>

            {/* Close */}
            <button
              onClick={close}
              className="absolute right-4 top-4 z-10 rounded-md p-1.5 text-off-white/50 hover:bg-off-white/5 hover:text-off-white transition-colors"
            >
              <X className="size-4" />
            </button>

            {/* Content */}
            <div className="px-8 pt-8 pb-6 flex flex-col items-center text-center gap-5">
              {/* Icon */}
              <div className={`flex size-16 items-center justify-center rounded-2xl ${current.iconBg}`}>
                <Icon className={`size-8 ${current.iconColor}`} />
              </div>

              {/* Step label */}
              <span className="text-xs font-medium text-off-white/50">
                Passo {step + 1} de {steps.length}
              </span>

              {/* Title */}
              <h2 className="text-xl font-bold tracking-tight leading-snug">
                {current.titulo}
              </h2>

              {/* Description */}
              <p className="text-sm text-off-white/50 leading-relaxed max-w-sm">
                {current.descricao}
              </p>

              {/* Highlights */}
              {current.destaques && (
                <div className="w-full space-y-2 rounded-xl bg-dark-green/50 p-4">
                  {current.destaques.map((d, i) => {
                    const DIcon = d.icon;
                    return (
                      <div key={i} className="flex items-center gap-3 text-left">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#3D5454] border border-mint/10">
                          <DIcon className="size-3.5 text-mint" />
                        </div>
                        <span className="text-xs text-off-white">{d.texto}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* CTA link */}
              {current.cta && (
                <Link
                  href={current.cta.href}
                  onClick={close}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-mint hover:underline"
                >
                  {current.cta.label}
                  <ArrowRight className="size-3" />
                </Link>
              )}
            </div>

            {/* Footer — navigation */}
            <div className="flex items-center justify-between border-t border-mint/10 px-6 py-4">
              {/* Dot indicators */}
              <div className="flex items-center gap-1.5">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(i)}
                    className={`rounded-full transition-all ${
                      i === step
                        ? "size-2 bg-mint"
                        : "size-1.5 bg-off-white/20 hover:bg-off-white/40"
                    }`}
                  />
                ))}
              </div>

              {/* Prev / Next */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prev}
                  disabled={step === 0}
                  className="gap-1"
                >
                  <ChevronLeft className="size-3.5" />
                  Anterior
                </Button>
                <Button size="sm" onClick={next} className="gap-1">
                  {isLast ? "Começar!" : "Próximo"}
                  {!isLast && <ChevronRight className="size-3.5" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
