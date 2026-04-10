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
  iniciante: "bg-neon/10 text-neon",
  intermediario: "bg-[#F4A8A3]/10 text-[#F4A8A3]",
  avancado: "bg-coral/10 text-coral",
};

const statusLabels: Record<ScenarioStatus, string> = {
  nao_iniciado: "Nao iniciado",
  em_progresso: "Em progresso",
  completo: "Completo",
};

const statusColors: Record<ScenarioStatus, string> = {
  nao_iniciado: "bg-off-white/10 text-off-white/50",
  em_progresso: "bg-mint/20 text-mint",
  completo: "bg-neon/10 text-neon",
};

interface ScenarioCardProps {
  scenario: Scenario;
  status: ScenarioStatus;
}

export function ScenarioCard({ scenario, status }: ScenarioCardProps) {
  const Icon = moduleIcons[scenario.modulo];

  return (
    <Link href={`/cenarios/${scenario.id}`}>
      <Card className="transition-colors hover:border-mint/30 cursor-pointer">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="size-4 text-mint" />
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
          <div className="flex items-center gap-1 text-xs text-off-white/50">
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
