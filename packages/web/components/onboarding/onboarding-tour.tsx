"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FlaskConical,
  Target,
  Layers,
  Send,
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
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    titulo: "Bem-vindo ao QA Lab Playground",
    descricao:
      "Uma plataforma para evoluir em automação de testes na prática. Aqui você não lê sobre bugs — você os prova com código real em sistemas propositalmente quebrados.",
    destaques: [
      { icon: Bug,      texto: "Bugs reais escondidos nos sistemas alvo" },
      { icon: Terminal, texto: "Missões com snippets de Playwright e Cypress" },
      { icon: Target,   texto: "Do iniciante ao intermediário no seu ritmo" },
    ],
  },
  {
    icon: Lightbulb,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-100",
    titulo: "Como o lab funciona",
    descricao:
      "O lab tem dois elementos principais: Alvos (os sistemas que você vai testar) e Missões (os objetivos que você vai provar com automação). Simples assim.",
    destaques: [
      { icon: Layers, texto: "Alvos: API, E-commerce e Form Bugado documentados" },
      { icon: Target, texto: "Missões: bugs reais com objetivo claro pra automatizar" },
      { icon: Send,   texto: "API Playground para exploração manual antes de automatizar" },
    ],
  },
  {
    icon: Layers,
    iconColor: "text-sky-500",
    iconBg: "bg-sky-500/10",
    titulo: "Alvos — o que você vai testar",
    descricao:
      "Antes de escrever um teste, você precisa conhecer o sistema. Em Alvos você encontra todos os endpoints da API, seletores do E-commerce e bugs do formulário documentados.",
    destaques: [
      { icon: Send,     texto: "10 endpoints com método, contrato e bug conhecido" },
      { icon: Layers,   texto: "Seletores data-testid do E-commerce prontos pra usar" },
      { icon: Bug,      texto: "5 bugs do formulário numerados e descritos" },
    ],
    cta: { label: "Ver Alvos", href: "/alvos" },
  },
  {
    icon: Target,
    iconColor: "text-green-600",
    iconBg: "bg-green-100",
    titulo: "Missões — prove o bug com código",
    descricao:
      "Cada missão tem um bug real pra você provar com automação. Leia o objetivo, tente escrever o teste sozinho e só depois expanda a dica ou o snippet.",
    destaques: [
      { icon: Target,   texto: "Iniciante: snippets prontos para adaptar e rodar" },
      { icon: Terminal, texto: "Intermediário: apenas objetivo e alvo, sem mão na massa" },
      { icon: Bug,      texto: "Seu teste deve falhar — isso confirma o bug" },
    ],
    cta: { label: "Ver Missões", href: "/missoes" },
  },
  {
    icon: Send,
    iconColor: "text-violet-500",
    iconBg: "bg-violet-500/10",
    titulo: "API Playground",
    descricao:
      "Explore os endpoints manualmente antes de automatizar. Útil para entender o comportamento real da API e confirmar o bug que você vai provar no teste.",
    destaques: [
      { icon: Send,     texto: "Envie requests e veja as respostas em tempo real" },
      { icon: Bug,      texto: "10 endpoints com falhas propositais diferentes" },
      { icon: Terminal, texto: "Use junto com as missões de API Testing" },
    ],
    cta: { label: "Abrir API Playground", href: "/api-playground" },
  },
  {
    icon: BookOpen,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-100",
    titulo: "Blog e Roadmap",
    descricao:
      "Conteúdo de apoio para complementar a prática. O Blog tem artigos sobre técnicas de teste e o Roadmap mostra trilhas de aprendizado por especialidade.",
    destaques: [
      { icon: BookOpen, texto: "Artigos sobre API testing, E2E, performance e mais" },
      { icon: Target,   texto: "Roadmap com 5 trilhas e 4 níveis de evolução" },
      { icon: Lightbulb, texto: "Teoria que faz sentido depois da prática" },
    ],
  },
  {
    icon: Rocket,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    titulo: "Pronto para começar?",
    descricao:
      "Comece pelos Alvos para entender os sistemas, escolha uma Missão pelo seu nível e escreva seu primeiro teste automatizado que prova um bug real.",
    destaques: [
      { icon: Layers,   texto: "1. Leia os Alvos e conheça o sistema" },
      { icon: Target,   texto: "2. Escolha uma Missão e escreva o teste" },
      { icon: Terminal, texto: "3. Rode, veja falhar e confirme o bug" },
    ],
    cta: { label: "Ver Missões", href: "/missoes" },
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
        className={`fixed bottom-6 right-6 z-40 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 active:scale-95 ${pulse ? "animate-pulse" : ""}`}
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
            className="absolute inset-0 bg-gray-800/70 backdrop-blur-sm"
            onClick={close}
          />

          {/* Modal */}
          <div className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
            {/* Progress bar */}
            <div className="h-1 w-full bg-secondary">
              <div
                className="h-1 bg-primary transition-all duration-300"
                style={{ width: `${((step + 1) / steps.length) * 100}%` }}
              />
            </div>

            {/* Close */}
            <button
              onClick={close}
              className="absolute right-4 top-4 z-10 rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
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
              <span className="text-xs font-medium text-muted-foreground">
                Passo {step + 1} de {steps.length}
              </span>

              {/* Title */}
              <h2 className="text-xl font-bold tracking-tight leading-snug">
                {current.titulo}
              </h2>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                {current.descricao}
              </p>

              {/* Highlights */}
              {current.destaques && (
                <div className="w-full space-y-2 rounded-xl bg-secondary/50 p-4">
                  {current.destaques.map((d, i) => {
                    const DIcon = d.icon;
                    return (
                      <div key={i} className="flex items-center gap-3 text-left">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-background border border-border">
                          <DIcon className="size-3.5 text-primary" />
                        </div>
                        <span className="text-xs text-foreground">{d.texto}</span>
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
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                >
                  {current.cta.label}
                  <ArrowRight className="size-3" />
                </Link>
              )}
            </div>

            {/* Footer — navigation */}
            <div className="flex items-center justify-between border-t border-border px-6 py-4">
              {/* Dot indicators */}
              <div className="flex items-center gap-1.5">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(i)}
                    className={`rounded-full transition-all ${
                      i === step
                        ? "size-2 bg-primary"
                        : "size-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
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
