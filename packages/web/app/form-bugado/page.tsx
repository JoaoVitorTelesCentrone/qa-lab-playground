"use client";

import { useState } from "react";
import { Bug, Check, Circle, AlertTriangle } from "lucide-react";
import { BuggyForm } from "@/components/form-bugado/buggy-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const bugs = [
  {
    id: 1,
    titulo: "Validação de email aceita formatos inválidos",
  },
  {
    id: 2,
    titulo: "Campo obrigatório que não bloqueia submit",
  },
  {
    id: 3,
    titulo: "Máscara de telefone quebra ao colar",
  },
  {
    id: 4,
    titulo: "Formulário submete com erros visíveis",
  },
  {
    id: 5,
    titulo: "Mensagem de sucesso mostra dados errados",
  },
];

export default function FormBugadoPage() {
  const [foundBugs, setFoundBugs] = useState<Set<number>>(new Set());

  function toggleBug(id: number) {
    const next = new Set(foundBugs);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setFoundBugs(next);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-4 animate-slide-in-up">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-xl bg-coral/20">
            <AlertTriangle className="size-5 text-coral" />
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wider text-coral italic">
              FORM BUGADO
            </h1>
            <p className="text-sm text-coral/50 uppercase tracking-[0.15em]">
              Encontre os 5 bugs
            </p>
          </div>
        </div>
        <p className="text-sm text-off-white/60 max-w-xl">
          Este formulário de cadastro tem 5 bugs propositais. Teste cada campo,
          tente inputs inesperados e marque os bugs que encontrar.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px] stagger">
        {/* Form */}
        <Card className="border-mint/10">
          <CardHeader>
            <CardTitle className="text-base uppercase tracking-wide text-mint">Cadastro de Usuário</CardTitle>
            <CardDescription>
              Preencha os dados para criar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BuggyForm />
          </CardContent>
        </Card>

        {/* Bug Checklist */}
        <Card className="border-coral/20 bg-coral/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bug className="size-4 text-coral" />
              <CardTitle className="text-base uppercase tracking-wide text-coral">Bugs Encontrados</CardTitle>
            </div>
            <CardDescription className="text-coral/60">
              {foundBugs.size}/5 bugs encontrados
            </CardDescription>
            <div className="h-2 rounded-full bg-coral/10">
              <div
                className="h-2 rounded-full bg-coral transition-all"
                style={{ width: `${(foundBugs.size / 5) * 100}%` }}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {bugs.map((bug) => {
                const found = foundBugs.has(bug.id);
                return (
                  <button
                    key={bug.id}
                    onClick={() => toggleBug(bug.id)}
                    className="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left text-sm transition-colors hover:bg-coral/10"
                  >
                    {found ? (
                      <Check className="mt-0.5 size-4 shrink-0 text-coral" />
                    ) : (
                      <Circle className="mt-0.5 size-4 shrink-0 text-coral/40" />
                    )}
                    <span
                      className={
                        found
                          ? "line-through text-coral/50"
                          : "text-off-white/80"
                      }
                    >
                      Bug #{bug.id}: {bug.titulo}
                    </span>
                  </button>
                );
              })}
            </div>

            {foundBugs.size === 5 && (
              <div className="mt-4 rounded-xl border border-neon/30 bg-neon/10 p-4 text-center">
                <p className="text-sm font-bold uppercase tracking-wide text-neon">
                  Excelente! Você encontrou todos os 5 bugs!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Series Badge */}
      <div className="flex justify-end">
        <span className="series-number text-4xl text-off-white/10">
          #07
        </span>
      </div>
    </div>
  );
}
