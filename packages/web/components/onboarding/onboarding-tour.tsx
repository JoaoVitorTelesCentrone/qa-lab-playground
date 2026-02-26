"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FlaskConical,
  ClipboardList,
  ShoppingBag,
  Send,
  ListChecks,
  Lightbulb,
  Rocket,
  X,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Bug,
  Zap,
  Calendar,
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
      "Uma plataforma educacional para aprender Quality Assurance na prática. Aqui você não lê sobre bugs — você os encontra, reproduz e documenta em um ambiente real.",
    destaques: [
      { icon: Bug,      texto: "Bugs propositais escondidos em cada módulo" },
      { icon: Zap,      texto: "API com modo caos que simula falhas reais" },
      { icon: ListChecks, texto: "Cenários guiados para praticar técnicas de QA" },
    ],
  },
  {
    icon: Lightbulb,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-100",
    titulo: "A ideia por trás do lab",
    descricao:
      "Você vai testar um e-commerce em desenvolvimento — com todos os problemas reais que um produto tem antes de ir para produção. Cada funcionalidade tem bugs intencionais para você encontrar.",
    destaques: [
      { icon: ShoppingBag, texto: "Um e-commerce completo sendo desenvolvido" },
      { icon: ClipboardList, texto: "Histórias de dev com bugs mapeados no board" },
      { icon: Send,          texto: "API instável que falha de formas diferentes" },
    ],
  },
  {
    icon: ClipboardList,
    iconColor: "text-sky-400",
    iconBg: "bg-sky-500/10",
    titulo: "O Board de Tarefas",
    descricao:
      "O ponto de partida do lab. Funciona como um Kanban de desenvolvimento com 8 histórias do e-commerce. Cada card mostra os bugs conhecidos, a prioridade e os módulos de QA para praticar.",
    destaques: [
      { icon: ClipboardList, texto: "3 colunas: Backlog / Em Progresso / Concluído" },
      { icon: Bug,           texto: "Bugs mapeados em cada história" },
      { icon: ArrowRight,    texto: "Links diretos para os módulos de QA relacionados" },
    ],
    cta: { label: "Abrir Board", href: "/ecommerce/board" },
  },
  {
    icon: ShoppingBag,
    iconColor: "text-orange-600",
    iconBg: "bg-orange-100",
    titulo: "A Loja E-commerce",
    descricao:
      "O produto sendo testado. Navegue pela loja, adicione itens ao carrinho, aplique cupons e tente finalizar uma compra. Cada interação tem pelo menos um bug escondido.",
    destaques: [
      { icon: Bug,        texto: "7 bugs propositais no carrinho e checkout" },
      { icon: ShoppingBag, texto: "Busca, filtros, estoque e cálculo de frete quebrados" },
      { icon: Zap,        texto: "Checkout integrado com a API instável" },
    ],
    cta: { label: "Abrir Loja", href: "/ecommerce" },
  },
  {
    icon: Send,
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/10",
    titulo: "API Playground",
    descricao:
      "Teste os 10 endpoints da API diretamente no browser. Ative o Modo Caos para ver como os sistemas falham: 500s aleatórios, dados errados, timeouts e respostas inconsistentes.",
    destaques: [
      { icon: Send,   texto: "10 endpoints com bugs configuráveis" },
      { icon: Zap,    texto: "Modo Caos: ative e veja o caos acontecer" },
      { icon: Bug,    texto: "Cada endpoint falha de uma forma diferente" },
    ],
    cta: { label: "Abrir API Playground", href: "/api-playground" },
  },
  {
    icon: ListChecks,
    iconColor: "text-green-600",
    iconBg: "bg-green-100",
    titulo: "Cenários de Teste",
    descricao:
      "Organize seus testes no estilo Azure DevOps Test Plans. Crie suites, adicione casos de teste manuais ou vincule aos cenários guiados existentes. Marque execuções como Passou, Falhou ou Bloqueado.",
    destaques: [
      { icon: ListChecks, texto: "Suites organizadas por funcionalidade" },
      { icon: ClipboardList, texto: "Casos de teste com passos detalhados" },
      { icon: Zap,          texto: "Status de execução rastreável por caso" },
    ],
    cta: { label: "Abrir Cenários", href: "/cenarios" },
  },
  {
    icon: Calendar,
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/10",
    titulo: "Módulo de Datas",
    descricao:
      "Calendários, timers, fusos horários e cálculos de data — tudo propositalmente bugado. Encontre os 10 bugs escondidos e aprenda a testar um dos tipos mais difíceis de problema em software.",
    destaques: [
      { icon: Bug,      texto: "10 bugs de data e timezone para encontrar" },
      { icon: Calendar, texto: "Calendário interativo, timer e fuso horário" },
      { icon: Zap,      texto: "Problemas reais: anos bissextos, horário de verão" },
    ],
    cta: { label: "Abrir Módulo Datas", href: "/datas" },
  },
  {
    icon: Rocket,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    titulo: "Pronto para começar?",
    descricao:
      "Comece pelo Board de Tarefas para entender o que está sendo desenvolvido, depois explore cada módulo pelos links de QA de cada card. Boa caça aos bugs!",
    destaques: [
      { icon: ClipboardList, texto: "1. Abra o Board e leia as histórias" },
      { icon: Send,          texto: "2. Teste a API com o Playground" },
      { icon: ListChecks,    texto: "3. Registre seus testes nos Cenários" },
    ],
    cta: { label: "Ir para o Board", href: "/ecommerce/board" },
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
