"use client";

import { useParams } from "next/navigation";
import { scenarios } from "@qa-lab/shared";
import { ScenarioRunner } from "@/components/cenarios/scenario-runner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ScenarioPage() {
  const params = useParams<{ id: string }>();
  const scenario = scenarios.find((s) => s.id === params.id);

  if (!scenario) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">Cenario nao encontrado.</p>
        <Link
          href="/cenarios"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="size-4" />
          Voltar aos cenarios
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Link
        href="/cenarios"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Voltar aos cenarios
      </Link>
      <ScenarioRunner scenario={scenario} />
    </div>
  );
}
