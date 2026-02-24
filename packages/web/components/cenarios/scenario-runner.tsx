"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Check, Circle } from "lucide-react";
import type { Scenario } from "@qa-lab/shared";

interface ScenarioRunnerProps {
  scenario: Scenario;
}

export function ScenarioRunner({ scenario }: ScenarioRunnerProps) {
  const [completedObjectives, setCompletedObjectives] = useState<Set<string>>(
    new Set()
  );
  const [revealedHints, setRevealedHints] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState("");

  function toggleObjective(id: string) {
    const next = new Set(completedObjectives);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setCompletedObjectives(next);
  }

  function toggleHint(id: string) {
    const next = new Set(revealedHints);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setRevealedHints(next);
  }

  const progress = scenario.objetivos.length > 0
    ? Math.round((completedObjectives.size / scenario.objetivos.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {scenario.titulo}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {scenario.descricaoCompleta}
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 rounded-full bg-secondary">
          <div
            className="h-2 rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm font-medium text-muted-foreground">
          {completedObjectives.size}/{scenario.objetivos.length}
        </span>
      </div>

      {/* Related Endpoints */}
      {scenario.endpointsRelacionados &&
        scenario.endpointsRelacionados.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground">Endpoints:</span>
            {scenario.endpointsRelacionados.map((ep) => (
              <Badge key={ep} variant="secondary" className="font-mono text-xs">
                {ep}
              </Badge>
            ))}
          </div>
        )}

      {/* Objectives */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold">Objetivos</h2>
        {scenario.objetivos.map((obj) => {
          const isComplete = completedObjectives.has(obj.id);
          const hintRevealed = revealedHints.has(obj.id);

          return (
            <Card key={obj.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleObjective(obj.id)}
                    className="mt-0.5 shrink-0"
                  >
                    {isComplete ? (
                      <Check className="size-5 text-primary" />
                    ) : (
                      <Circle className="size-5 text-muted-foreground" />
                    )}
                  </button>
                  <CardTitle
                    className={`text-sm ${isComplete ? "line-through text-muted-foreground" : ""}`}
                  >
                    {obj.descricao}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pl-11">
                <Button
                  variant="ghost"
                  size="xs"
                  className="text-xs"
                  onClick={() => toggleHint(obj.id)}
                >
                  {hintRevealed ? (
                    <EyeOff className="mr-1 size-3" />
                  ) : (
                    <Eye className="mr-1 size-3" />
                  )}
                  {hintRevealed ? "Esconder dica" : "Ver dica"}
                </Button>
                {hintRevealed && (
                  <p className="mt-2 rounded-md bg-secondary/50 p-2 text-xs text-muted-foreground">
                    {obj.dica}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold">Suas anotacoes</h2>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Registre aqui o que voce encontrou..."
          className="min-h-[120px] font-mono text-xs"
        />
      </div>

      {progress === 100 && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-center">
          <p className="text-sm font-medium text-primary">
            Parabens! Voce completou todos os objetivos deste cenario.
          </p>
        </div>
      )}
    </div>
  );
}
