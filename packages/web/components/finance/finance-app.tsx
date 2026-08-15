"use client";

// Ambiente de prática Finanças.
//
// Os dados vêm do servidor e voltam para ele: nada aqui é fonte de verdade. Os
// totais, o uso de orçamento e o progresso das metas saem de
// lib/product/practice/views.ts, que é onde os desvios plantados agem — a tela
// só mostra o que o cálculo compartilhado devolveu.

import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EnvironmentShell } from "@/components/practice/environment-shell";
import { ResourceForm } from "@/components/practice/resource-form";
import { RecordTable } from "@/components/practice/record-table";
import { useListControls } from "@/components/practice/list-controls";
import { PracticeSection, ProgressBar, StatGrid } from "@/components/practice/ui";
import { usePracticeApp, type AppRows } from "@/components/practice/use-practice-app";
import { findPracticeApp } from "@/lib/product/apps";
import { fold, money } from "@/lib/product/practice/format";
import { financeSummary, goalProgress, knownCategories, type Account, type Budget, type Goal } from "@/lib/product/practice/views";
import type { Transaction } from "@/lib/product/practice/rules";
import type { PracticeSettings } from "@/lib/product/practice/store";

const app = findPracticeApp("financas")!;

export function FinanceApp({ initial, settings, signedIn }: { initial: AppRows; settings: PracticeSettings; signedIn: boolean }) {
  const practice = usePracticeApp(initial, { persist: signedIn, activeBugs: settings.activeBugs });
  const transactions = practice.use("financas.transactions");
  const budgets = practice.use("financas.budgets");
  const goals = practice.use("financas.goals");
  const accounts = practice.use("financas.accounts");

  const rows = {
    transactions: transactions.rows as unknown as Transaction[],
    budgets: budgets.rows as unknown as Budget[],
    goals: goals.rows as unknown as Goal[],
    accounts: accounts.rows as unknown as Account[],
  };
  const summary = financeSummary(rows, settings.activeBugs);
  const categories = knownCategories(rows.transactions, rows.budgets);

  const list = useListControls(transactions.rows, {
    searchLabel: "Buscar lançamento",
    searchPlaceholder: "Descrição ou categoria",
    search: (items, query) => {
      const needle = fold(query);
      return items.filter((item) => fold(`${item.description} ${item.category}`).includes(needle));
    },
    filters: [
      { field: "kind", label: "Tipo", options: [{ value: "receita", label: "Receita" }, { value: "despesa", label: "Despesa" }] },
      { field: "category", label: "Categoria", options: categories.map((category) => ({ value: category, label: category })) },
    ],
    sorts: [
      { id: "date-desc", label: "Data (mais recente)", compare: (a, b) => String(b.date).localeCompare(String(a.date)) },
      { id: "date-asc", label: "Data (mais antiga)", compare: (a, b) => String(a.date).localeCompare(String(b.date)) },
      { id: "amount-desc", label: "Valor (maior)", compare: (a, b) => Number(b.amount) - Number(a.amount) },
      { id: "amount-asc", label: "Valor (menor)", compare: (a, b) => Number(a.amount) - Number(b.amount) },
    ],
  });

  return <EnvironmentShell app={app} settings={settings} signedIn={signedIn}>
    <div className="mt-8">
      <StatGrid items={[
        { label: "Saldo do período", value: money(summary.totals.balance), tone: summary.totals.balance < 0 ? "negative" : "positive", hint: `${money(summary.accountsTotal)} distribuídos nas contas` },
        { label: "Receitas", value: money(summary.totals.income) },
        { label: "Despesas", value: money(summary.totals.expense) },
      ]} />
    </div>

    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="grid gap-6">
        <PracticeSection id="lancamentos" title="Lançamentos" description="Receitas e despesas do período. Recorrentes se repetem todo mês.">
          <ResourceForm
            handle={transactions}
            defaults={{ date: "2026-08-15", kind: "despesa" }}
            suggestions={{ category: categories }}
          />
          <div className="mt-6 border-t border-border pt-5">{list.ui}</div>
          <div className="mt-4">
            <RecordTable
              handle={transactions}
              rows={list.visible}
              columns={["date", "description", "category", "kind", "amount", "recurring"]}
              suggestions={{ category: categories }}
              empty={list.hasFilters ? "Nenhum lançamento encontrado com esses filtros." : "Nenhum lançamento registrado. Adicione o primeiro acima."}
              renderCell={(row, field) => field === "amount"
                ? <span className={row.kind === "receita" ? "text-primary" : "text-destructive"}>{row.kind === "receita" ? "+" : "−"} {money(Number(row.amount))}</span>
                : undefined}
            />
          </div>
        </PracticeSection>

        <PracticeSection id="contas" title="Contas" description="Onde o dinheiro está hoje.">
          <ResourceForm handle={accounts} columns={2} />
          <div className="mt-5">
            <RecordTable handle={accounts} columns={["name", "kind", "balance"]} empty="Nenhuma conta cadastrada." />
          </div>
        </PracticeSection>
      </div>

      <div className="grid gap-6">
        <PracticeSection id="orcamentos" title="Orçamento por categoria" description="O limite mensal de cada categoria de despesa.">
          <ResourceForm handle={budgets} columns={1} suggestions={{ category: categories }} />
          <ul className="mt-5 grid gap-4">
            {summary.budgets.length === 0 && <li className="rounded-md border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">Nenhum orçamento definido.</li>}
            {summary.budgets.map((line) => <li key={line.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-sm font-medium">{line.category}</span>
                <span className="font-mono text-xs text-muted-foreground">{money(line.used)} de {money(line.limit)}</span>
              </div>
              <ProgressBar percent={line.percent} label={`Uso do orçamento de ${line.category}`} danger={line.exceeded} />
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                {line.exceeded
                  ? <><AlertTriangle className="size-3.5 text-destructive" aria-hidden="true" /><span className="text-destructive">Orçamento estourado em {money(line.used - line.limit)}.</span></>
                  : <>{line.percent}% do limite usado</>}
              </p>
            </li>)}
          </ul>
          <div className="mt-5 border-t border-border pt-5">
            <RecordTable handle={budgets} columns={["category", "limit_amount"]} empty="Nenhum orçamento cadastrado." suggestions={{ category: categories }} />
          </div>
        </PracticeSection>

        <PracticeSection id="metas" title="Metas" description="Quanto falta para cada objetivo.">
          <ResourceForm handle={goals} columns={1} />
          <ul className="mt-5 grid gap-4">
            {rows.goals.length === 0 && <li className="rounded-md border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">Nenhuma meta definida.</li>}
            {rows.goals.map((goal) => {
              const progress = goalProgress(goal);
              return <li key={goal.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-sm font-medium">{goal.name}</span>
                  {progress.reached ? <Badge className="font-normal">Meta alcançada</Badge> : <span className="font-mono text-xs text-muted-foreground">faltam {money(progress.remaining)}</span>}
                </div>
                <ProgressBar percent={progress.percent} label={`Progresso da meta ${goal.name}`} />
                <p className="mt-1.5 text-xs text-muted-foreground">{money(goal.saved_amount)} de {money(goal.target_amount)} · {progress.percent}%</p>
              </li>;
            })}
          </ul>
          <div className="mt-5 border-t border-border pt-5">
            <RecordTable handle={goals} columns={["name", "saved_amount", "target_amount"]} empty="Nenhuma meta cadastrada." />
          </div>
        </PracticeSection>

        <PracticeSection id="gastos" title="Gastos por categoria" description="Para conferir se o total do topo bate com a soma da lista.">
          {summary.spendByCategory.length === 0
            ? <p className="rounded-md border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">Nenhuma despesa registrada.</p>
            : <ul className="grid gap-2.5">{summary.spendByCategory.map((item) => <li key={item.category} className="flex items-baseline justify-between gap-3 text-sm">
                <span>{item.category}</span>
                <span className="font-mono text-muted-foreground">{money(item.total)}</span>
              </li>)}</ul>}
        </PracticeSection>
      </div>
    </div>
  </EnvironmentShell>;
}
