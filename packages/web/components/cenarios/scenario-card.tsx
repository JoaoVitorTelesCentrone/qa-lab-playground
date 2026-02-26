"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Send, Bug, Search } from "lucide-react";
import type { Scenario, ScenarioStatus } from "@qa-lab/shared";

const moduleIcons = {
  api: Send,
  form: Bug,
  exploratorio: Search,
};

const difficultyColors = {
  iniciante: "bg-green-100 text-green-600",
  intermediario: "bg-amber-100 text-amber-600",
  avancado: "bg-red-100 text-red-600",
};

const statusLabels: Record<ScenarioStatus, string> = {
  nao_iniciado: "Nao iniciado",
  em_progresso: "Em progresso",
  completo: "Completo",
};

const statusColors: Record<ScenarioStatus, string> = {
  nao_iniciado: "bg-secondary text-muted-foreground",
  em_progresso: "bg-blue-500/20 text-blue-400",
  completo: "bg-green-100 text-green-600",
};

interface ScenarioCardProps {
  scenario: Scenario;
  status: ScenarioStatus;
}

export function ScenarioCard({ scenario, status }: ScenarioCardProps) {
  const Icon = moduleIcons[scenario.modulo];

  return (
    <Link href={`/cenarios/${scenario.id}`}>
      <Card className="transition-colors hover:border-primary/30 cursor-pointer">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="size-4 text-primary" />
              <Badge className={difficultyColors[scenario.dificuldade]}>
                {scenario.dificuldade}
              </Badge>
            </div>
            <Badge className={statusColors[status]}>
              {statusLabels[status]}
            </Badge>
          </div>
          <CardTitle className="text-base">{scenario.titulo}</CardTitle>
          <CardDescription>{scenario.descricao}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>{scenario.objetivos.length} objetivos</span>
            {scenario.endpointsRelacionados && (
              <>
                <span>·</span>
                <span>
                  {scenario.endpointsRelacionados.length} endpoints
                </span>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
