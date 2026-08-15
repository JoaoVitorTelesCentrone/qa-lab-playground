"use client";

// Gráfico de barras horizontais.
//
// Barra horizontal porque as categorias têm nome longo (empresa, estágio) e
// porque a comparação é de magnitude — o comprimento resolve sozinho, sem
// gastar cor com identidade.
//
// Especificação seguida: barra fina com ponta arredondada de 4px e base reta,
// trilho um passo acima da superfície, valor direto na ponta, texto sempre em
// token de texto (nunca na cor da série) e tooltip por marca no hover e no
// foco. A tabela embaixo é a via sem hover — o tooltip enriquece, nunca é o
// único caminho para o número.

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { money } from "@/lib/product/practice/format";

export type BarDatum = {
  label: string;
  value: number;
  /** Cor da barra. Sem ela, todas usam o mesmo tom — o caso nominal. */
  color?: string;
  /** Segunda informação da linha, exibida no tooltip e na tabela. */
  note?: string;
};

/** Tom único das barras nominais. Validado contra a superfície #181B1F. */
export const nominalHue = "#41A16A";

/**
 * Rampa ordinal do funil, do estágio inicial ao final. Um tom só, com passos
 * de luminosidade monótonos — a ordem das etapas se lê na própria cor.
 * Validada com `--ordinal` na superfície escura.
 */
export const funnelRamp = ["#2C7049", "#41A16A", "#5CBB86", "#85CFA4"];

export function BarList({ title, description, data, format, total, emptyMessage }: {
  title: string;
  description?: string;
  data: BarDatum[];
  /**
   * Como formatar o valor. É um nome, não uma função: quem monta o painel é
   * Server Component, e função não atravessa a fronteira para o cliente.
   */
  format?: "money" | "number";
  /** Base do percentual no tooltip. Padrão: a soma das barras. */
  total?: number;
  emptyMessage: string;
}) {
  const [hovered, setHovered] = useState("");
  const id = useId();
  const show = format === "money" ? money : (value: number) => String(value);
  const sum = total ?? data.reduce((acc, item) => acc + item.value, 0);
  const peak = Math.max(1, ...data.map((item) => item.value));

  return <section aria-labelledby={`${id}-title`} className="rounded-xl border border-border bg-card p-5 sm:p-6">
    <h3 id={`${id}-title`} className="text-sm font-medium">{title}</h3>
    {description && <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>}

    {data.length === 0
      ? <p className="mt-5 rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">{emptyMessage}</p>
      : <ul className="mt-5 grid gap-3.5">{data.map((item) => {
          const share = sum === 0 ? 0 : Math.round((item.value / sum) * 100);
          const active = hovered === item.label;

          return <li key={item.label} className="relative">
            <div
              tabIndex={0}
              onMouseEnter={() => setHovered(item.label)}
              onMouseLeave={() => setHovered("")}
              onFocus={() => setHovered(item.label)}
              onBlur={() => setHovered("")}
              aria-label={`${item.label}: ${show(item.value)}${item.note ? `, ${item.note}` : ""}`}
              className="grid cursor-default gap-1.5 rounded-md py-1 outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              <div className="flex items-baseline justify-between gap-3 text-xs">
                <span className="min-w-0 truncate text-muted-foreground">{item.label}</span>
                <span className="shrink-0 font-mono tabular-nums text-foreground">{show(item.value)}</span>
              </div>
              {/* Trilho um passo acima da superfície; a barra cresce da esquerda,
                  reta na base e arredondada só na ponta. */}
              <div className="h-2.5 w-full overflow-hidden rounded-sm bg-muted">
                <div
                  className="h-full rounded-r-[4px] transition-[width,filter] duration-200"
                  style={{
                    width: `${Math.max(2, Math.round((item.value / peak) * 100))}%`,
                    background: item.color ?? nominalHue,
                    filter: active ? "brightness(1.15)" : undefined,
                  }}
                />
              </div>
            </div>

            {active && <p role="status" className="pointer-events-none absolute right-0 top-full z-10 mt-1 rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs shadow-lg">
              <span className="font-mono tabular-nums font-medium text-popover-foreground">{show(item.value)}</span>
              <span className="ml-1.5 text-muted-foreground">{share}% do total{item.note ? ` · ${item.note}` : ""}</span>
            </p>}
          </li>;
        })}</ul>}

    {data.length > 0 && <details className="group mt-5 border-t border-border pt-3">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-xs text-muted-foreground transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40">
        Ver dados em tabela
        <ChevronDown className="size-3.5 transition group-open:rotate-180" aria-hidden="true" />
      </summary>
      <table className="mt-3 w-full text-left text-xs">
        <caption className="sr-only">{title}</caption>
        <thead className="text-muted-foreground">
          <tr><th scope="col" className="py-1 font-medium">Item</th><th scope="col" className="py-1 text-right font-medium">Valor</th><th scope="col" className="py-1 text-right font-medium">Participação</th></tr>
        </thead>
        <tbody>{data.map((item) => <tr key={item.label} className="border-t border-border">
          <td className="py-1.5">{item.label}{item.note && <span className="text-muted-foreground"> · {item.note}</span>}</td>
          <td className="py-1.5 text-right font-mono tabular-nums">{show(item.value)}</td>
          <td className="py-1.5 text-right font-mono tabular-nums text-muted-foreground">{sum === 0 ? "0" : Math.round((item.value / sum) * 100)}%</td>
        </tr>)}</tbody>
      </table>
    </details>}
  </section>;
}
