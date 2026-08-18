"use client";

// Catálogo de Labs: busca, nível e a lista em acordeão.
// A home mostra a jornada e os ambientes; o catálogo é onde o aluno escolhe.
//
// A lista é um acordeão (Accordion do Watermelon UI, registry `accordion-2`)
// em vez de cards abertos: com o objetivo de todo Lab sempre visível, escolher
// virava leitura de parede de texto. Fechado o aluno compara títulos; aberto,
// lê o resumo daquele Lab e decide.

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowRight, Check, ChevronLeft, ChevronRight, Play, Search } from "lucide-react";
import { LabDetailsPopover } from "./lab-details-popover";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { SelectField, toOptions } from "@/components/ui/select-field";
import { labs as allLabs, labLabel, type Lab, type LabDifficulty } from "@/lib/playground/catalog";
import { systemChallenges } from "@/lib/system-challenges";
import type { LabProgress } from "@/lib/product/journey";

const difficulties: Array<LabDifficulty | "todas"> = ["todas", "iniciante", "intermediario", "avancado"];

// Sete por página: acima disso a coluna da direita passa da altura da tela e a
// explicação fixa da esquerda perde a companhia.
const PER_PAGE = 7;

// Como fazer um Lab. Fica ao lado da lista, e não numa página de ajuda: quem
// chega no catálogo sem saber o que é "evidência" desiste antes de abrir o
// primeiro. São os três passos reais do fluxo — briefing, ambiente, entrega.
const steps = [
  { title: "Leia o briefing", detail: "Objetivo, massa de teste e o comportamento esperado do sistema." },
  { title: "Teste no ambiente real", detail: "O ambiente abre em outra aba, com os dados já preparados." },
  { title: "Entregue a evidência", detail: "Resultado, passos de reprodução e severidade. É o que fecha o Lab e vira case." },
];

// Lançamento enxuto: o catálogo mostra só os Labs liberados. O resto existe no
// código (ver lib/playground/catalog.ts) mas não aparece pra ninguém até o
// time decidir abrir mais. Ver [[qa-lab-lancamento-enxuto]].
const labs = allLabs.filter((lab) => lab.status === "liberado");

export function LabCatalog({ progress = [] }: { progress?: Array<Pick<LabProgress, "status"> & { slug: string }> }) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<LabDifficulty | "todas">("todas");

  const [page, setPage] = useState(1);

  const byLab = new Map(progress.map((item) => [item.slug, item.status]));
  const term = query.trim().toLowerCase();
  const filtered = useMemo(
    () => labs.filter((lab) => (!term || [lab.title, lab.objective, lab.track, ...lab.tags].join(" ").toLowerCase().includes(term)) && (difficulty === "todas" || lab.difficulty === difficulty)),
    [term, difficulty],
  );

  // A página vive presa ao resultado do filtro: sem esse clamp, filtrar estando
  // na página 3 deixaria a lista vazia com resultados existindo.
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  return <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-14">
    {/* Em telas grandes vira duas colunas: a explicação fica parada à esquerda
        enquanto a lista rola à direita. Empilhado, "como fazer" ficava acima da
        lista e sumia no primeiro scroll — que é justamente quando o aluno
        precisa dele. */}
    <div className="grid gap-10 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:items-start lg:gap-24 xl:gap-32">
      <header className="lg:sticky lg:top-28">
        <h1 className="text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">Labs</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">Cada Lab parte de um risco real dentro de um dos ambientes de prática. Escolha pelo que você quer treinar e saia com evidência registrada.</p>

        <ol className="mt-8 grid gap-4 border-t border-border pt-8">
          {steps.map((step, index) => <li key={step.title} className="flex gap-3.5">
            <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-mono text-xs font-bold text-primary">{index + 1}</span>
            <span className="min-w-0">
              <span className="block text-sm font-medium">{step.title}</span>
              <span className="mt-1 block text-sm leading-6 text-muted-foreground">{step.detail}</span>
            </span>
          </li>)}
        </ol>

        <p className="mt-8 flex items-center gap-2 text-sm font-medium text-primary">
          Escolha um Lab ao lado
          {/* A seta aponta para a lista no desktop e para baixo no empilhado. */}
          <ArrowRight className="hidden size-4 lg:inline" aria-hidden="true" />
          <ArrowDown className="size-4 lg:hidden" aria-hidden="true" />
        </p>
      </header>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-[1fr_170px]">
            <label className="relative">
              <span className="sr-only">Buscar Lab</span>
              <Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Buscar Lab por título, objetivo ou tag" className="pl-10" />
            </label>
            <SelectField
              value={difficulty}
              onChange={(next) => { setDifficulty(next as LabDifficulty | "todas"); setPage(1); }}
              options={toOptions(difficulties)}
              groupLabel="Nível"
              aria-label="Nível"
            />
          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">{filtered.length} de {labs.length} Labs</p>

        {filtered.length === 0
          ? <p className="border-b border-border py-14 text-center text-sm text-muted-foreground">Nenhum Lab corresponde a esses filtros. Limpe a busca ou troque o nível.</p>
          : <>
              <Accordion
                // `key` na página: o acordeão é não-controlado, então remontar é
                // o que faz o primeiro item da página nova já vir aberto.
                key={current}
                type="multiple"
                className="mt-3 w-full space-y-2"
                // O primeiro item já abre: acordeão inteiramente fechado não
                // mostra ao aluno o que ele ganha ao clicar.
                defaultValue={[visible[0].slug]}
              >
                {visible.map((lab) => <LabItem key={lab.slug} lab={lab} status={byLab.get(lab.slug)} />)}
              </Accordion>

              {/* Escondida quando cabe tudo em uma página: um controle que não
                  faz nada só ocupa espaço. Aparece sozinha a partir do 8º Lab. */}
              {pages > 1 && <Pagination className="mt-6">
                <PaginationContent className="gap-3 rounded-full border border-border bg-muted/40 p-1 shadow-sm">
                  <PaginationItem>
                    {/* Botão, e não o PaginationLink: ele é uma âncora, e a
                        paginação aqui é estado do cliente, não navegação. */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Página anterior"
                      disabled={current === 1}
                      onClick={() => setPage(current - 1)}
                      className="rounded-full border-none bg-card shadow-sm transition-all hover:scale-110 hover:bg-accent active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                  </PaginationItem>
                  <PaginationItem className="px-3">
                    <p className="text-sm font-bold text-muted-foreground" aria-live="polite">
                      <span className="italic text-foreground">{current}</span>
                      <span className="px-1 opacity-40">/</span>
                      {pages}
                    </p>
                  </PaginationItem>
                  <PaginationItem>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Próxima página"
                      disabled={current === pages}
                      onClick={() => setPage(current + 1)}
                      className="rounded-full border-none bg-card shadow-sm transition-all hover:scale-110 hover:bg-accent active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>}
            </>}
      </div>
    </div>
  </div>;
}

function LabItem({ lab, status }: { lab: Lab; status?: LabProgress["status"] }) {
  const testData = systemChallenges.find((item) => item.id === lab.slug)?.testData;

  return <AccordionItem value={lab.slug} className="rounded-lg border border-border bg-card shadow-sm transition-shadow data-[state=open]:shadow-lg">
    {/* O "?" é irmão do gatilho, não filho: o AccordionTrigger já é um <button>,
        e botão dentro de botão não é HTML válido — o Radix nem registraria o
        clique do popover. */}
    <div className="flex items-center gap-2 pr-4">
      <AccordionTrigger className="min-w-0 flex-1 items-center px-5 hover:no-underline">
        <span className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1.5 pr-3 text-left">
          <span className="font-mono text-xs text-primary">{labLabel(lab)}</span>
          <span className="text-base font-medium">{lab.title}</span>
          {status === "completed" && <Badge variant="secondary" className="gap-1 font-normal"><Check className="size-3" /> concluído</Badge>}
          {status === "started" && <Badge variant="secondary" className="font-normal">em andamento</Badge>}
        </span>
      </AccordionTrigger>
      <LabDetailsPopover lab={lab} testData={testData} />
    </div>

    <AccordionContent className="px-5">
      <p className="max-w-2xl leading-6 text-muted-foreground">{lab.objective}</p>
      <Button asChild size="sm" className="mt-4"><Link href={`/labs/${lab.number}`}>Ir para as instruções <Play className="size-3" /></Link></Button>
    </AccordionContent>
  </AccordionItem>;
}
