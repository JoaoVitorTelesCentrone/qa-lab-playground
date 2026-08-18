"use client";

// Detalhe do Lab, sob demanda.
//
// Base: Popover 1 do Watermelon UI (registry `popover-1`) — a estrutura de
// "número grande + régua de barras" é dele; o conteúdo é o do Lab, e as cores
// saem dos tokens do tema em vez de `neutral-*` fixo.
//
// Existe para o resumo do acordeão poder ser curto. Critério de aceite e massa
// de teste importam na hora de decidir se vale abrir o Lab, mas empilhados na
// lista viravam a parede de texto que o acordeão tinha acabado de resolver.

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import type { Lab, LabDifficulty } from "@/lib/playground/catalog";

// Cor por nível, e não uma cor só: a escala verde → âmbar → vermelho comunica
// o esforço antes da pessoa ler a palavra.
const difficultyStyles: Record<LabDifficulty, string> = {
  iniciante: "border-primary/40 bg-primary/10 text-primary",
  intermediario: "border-amber-500/40 bg-amber-500/10 text-amber-400",
  avancado: "border-red-500/40 bg-red-500/10 text-red-400",
};

export function LabDetailsPopover({ lab, testData }: { lab: Lab; testData?: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {/* "?" como texto, e não o ícone CircleHelp: o botão já é redondo, então
            o ícone (que desenha o próprio círculo) virava círculo dentro de
            círculo e a interrogação sumia no meio. */}
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Detalhes do ${lab.title}`}
          className="size-10 shrink-0 rounded-full border border-primary/40 bg-primary/10 text-xl font-bold leading-none text-primary transition hover:bg-primary/20 hover:text-primary"
        >
          <span aria-hidden="true">?</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        // Abre para o lado: dentro do acordeão, um popover embaixo cobriria o
        // conteúdo do próprio Lab que a pessoa acabou de abrir.
        side="right"
        align="start"
        sideOffset={12}
        collisionPadding={12}
        className="max-h-[var(--radix-popover-content-available-height)] w-[calc(100vw-32px)] max-w-[420px] overflow-y-auto rounded-2xl p-5"
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-end justify-between px-1">
            <div className="flex flex-col gap-1">
              <span className="text-5xl font-bold tracking-tight">{lab.minutes}</span>
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">minutos estimados</span>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant="outline" className={`border text-sm font-medium capitalize ${difficultyStyles[lab.difficulty]}`}>{lab.difficulty}</Badge>
              <span className="text-sm font-medium text-muted-foreground">{lab.requiredFeature}</span>
            </div>
          </div>

          <Separator className="opacity-50" />

          <Section title="O que você entrega">
            <p className="text-sm leading-6 text-muted-foreground">{lab.delivery}</p>
          </Section>

          {testData && <Section title="Massa de teste">
            <p className="text-sm leading-6 text-muted-foreground">{testData}</p>
          </Section>}

          {lab.acceptanceCriteria.length > 0 && <Section title={`Critérios de aceite (${lab.acceptanceCriteria.length})`}>
            {/* Os mesmos critérios que a entrega vai cobrar: quem lê aqui já sabe
                o que precisa marcar para o Lab fechar. */}
            <ul className="grid gap-2">
              {lab.acceptanceCriteria.map((criterion) => (
                <li key={criterion} className="flex gap-2.5 text-sm leading-6 text-muted-foreground">
                  <span aria-hidden="true" className="text-primary">✓</span>
                  <span>{criterion}</span>
                </li>
              ))}
            </ul>
          </Section>}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-1">
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{title}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}
