// Severidade como chip com cor própria: "media: 1" solto no meio do texto não
// era escaneável. Tons rebaixados de propósito — a lista tem muitos chips e um
// vermelho cheio faria toda evidência parecer incidente.

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Severity } from "@/lib/product/evaluation";

const tones: Record<Severity, string> = {
  baixa: "border-sky-500/20 bg-sky-500/10 text-sky-300",
  media: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  alta: "border-red-500/25 bg-red-500/10 text-red-300",
  critica: "border-red-500/40 bg-red-500/15 text-red-200",
};

export function SeverityChip({ severity, label, className }: { severity: Severity; label?: string; className?: string }) {
  return <Badge variant="outline" className={cn("font-normal", tones[severity], className)}>{label ?? severity}</Badge>;
}
