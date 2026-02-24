"use client";

import { useState } from "react";
import { BuggyForm } from "@/components/form-bugado/buggy-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Circle, Bug } from "lucide-react";

const bugs = [
  {
    id: 1,
    titulo: "Validacao de email aceita formatos invalidos",
  },
  {
    id: 2,
    titulo: "Campo obrigatorio que nao bloqueia submit",
  },
  {
    id: 3,
    titulo: "Mascara de telefone quebra ao colar",
  },
  {
    id: 4,
    titulo: "Formulario submete com erros visiveis",
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Form Bugado</h1>
        <p className="text-sm text-muted-foreground">
          Este formulario de cadastro tem 5 bugs propositais. Teste cada campo,
          tente inputs inesperados e marque os bugs que encontrar.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cadastro de Usuario</CardTitle>
            <CardDescription>
              Preencha os dados para criar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BuggyForm />
          </CardContent>
        </Card>

        {/* Bug Checklist */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bug className="size-4 text-primary" />
              <CardTitle className="text-base">Bugs Encontrados</CardTitle>
            </div>
            <CardDescription>
              {foundBugs.size}/5 bugs encontrados
            </CardDescription>
            <div className="h-2 rounded-full bg-secondary">
              <div
                className="h-2 rounded-full bg-primary transition-all"
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
                    className="flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-secondary"
                  >
                    {found ? (
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    ) : (
                      <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    )}
                    <span
                      className={
                        found
                          ? "line-through text-muted-foreground"
                          : "text-foreground"
                      }
                    >
                      Bug #{bug.id}: {bug.titulo}
                    </span>
                  </button>
                );
              })}
            </div>

            {foundBugs.size === 5 && (
              <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-3 text-center">
                <p className="text-sm font-medium text-primary">
                  Excelente! Voce encontrou todos os 5 bugs!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
