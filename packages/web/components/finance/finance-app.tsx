"use client";

// Ambiente de prática Finanças.
//
// Versão enxuta do lançamento: saldo do período e a tabela de despesas, com
// um botão para lançar uma nova. Contas, orçamentos, metas e o restante do
// ambiente continuam em código (ver histórico), só não aparecem por enquanto.
//
// Os totais saem de lib/product/practice/views.ts, que é onde os desvios
// plantados agem — a tela só mostra o que o cálculo compartilhado devolveu.

import { useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EnvironmentShell } from "@/components/practice/environment-shell";
import { ExportCsv } from "@/components/practice/export-csv";
import { ResourceForm } from "@/components/practice/resource-form";
import { usePracticeApp, type AppRows, type Row } from "@/components/practice/use-practice-app";
import { findPracticeApp } from "@/lib/product/apps";
import { money } from "@/lib/product/practice/format";
import { financeSummary, type Account, type Budget } from "@/lib/product/practice/views";
import type { Transaction } from "@/lib/product/practice/rules";
import type { PracticeSettings } from "@/lib/product/practice/store";

const app = findPracticeApp("financas")!;

export function FinanceApp({ initial, settings, signedIn }: { initial: AppRows; settings: PracticeSettings; signedIn: boolean }) {
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState<Row | null>(null);
  // Sem desvios ativos: o painel que ligava/desligava isso saiu de tela, então
  // o saldo sempre bate com a soma real das despesas — é o que dá pra validar
  // criando, editando e apagando aqui.
  const practice = usePracticeApp(initial, { persist: signedIn, activeBugs: [] });
  const transactions = practice.use("financas.transactions");
  const budgets = practice.use("financas.budgets");
  const accounts = practice.use("financas.accounts");

  const rows = {
    transactions: transactions.rows as unknown as Transaction[],
    budgets: budgets.rows as unknown as Budget[],
    accounts: accounts.rows as unknown as Account[],
  };
  const summary = financeSummary(rows, []);
  const despesas = rows.transactions.filter((item) => item.kind === "despesa").sort((a, b) => b.date.localeCompare(a.date));

  return <EnvironmentShell app={app} settings={settings} signedIn={signedIn}>
    {/* Extrato, não dashboard: o saldo é o número que importa, então ele é o
        maior da tela — receitas e despesas ficam como lançamentos ao lado. */}
    <div className="mt-8 rounded-xl border border-border bg-card p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
        <div>
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Saldo do período</p>
          <p className={`mt-2 font-mono text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl ${summary.totals.balance < 0 ? "text-destructive" : "text-primary"}`}>{money(summary.totals.balance)}</p>
          <p className="mt-2 text-xs text-muted-foreground">{money(summary.accountsTotal)} distribuídos nas contas</p>
        </div>
        <dl className="flex gap-8">
          <div>
            <dt className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Receitas</dt>
            <dd className="mt-1.5 font-mono text-xl tabular-nums text-foreground">{money(summary.totals.income)}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Despesas</dt>
            <dd className="mt-1.5 font-mono text-xl tabular-nums text-foreground">{money(summary.totals.expense)}</dd>
          </div>
        </dl>
      </div>
      <div className="mt-6 h-px w-full bg-gradient-to-r from-primary/50 via-border to-transparent" aria-hidden="true" />
    </div>

    <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
      <h2 className="text-lg font-semibold">Despesas</h2>
      <div className="flex gap-2">
        <ExportCsv resource={transactions.resource} rows={despesas} columns={["date", "description", "category", "amount"]} filename="despesas" />
        <Button type="button" size="sm" onClick={() => setCreating((current) => !current)}>
          <Plus className="size-3.5" /> Nova despesa
        </Button>
      </div>
    </div>

    {creating && <div className="mt-4 rounded-xl border border-border bg-card p-5">
      <ResourceForm
        handle={transactions}
        fields={["date", "description", "category", "amount"]}
        defaults={{ date: "2026-08-15", kind: "despesa" }}
        submitLabel="Adicionar despesa"
        onDone={() => setCreating(false)}
      />
    </div>}

    <div className="mt-4 overflow-hidden rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {despesas.length === 0
            ? <TableRow><TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">Nenhuma despesa registrada. Adicione a primeira acima.</TableCell></TableRow>
            : despesas.map((item) => <TableRow key={item.id}>
                <TableCell className="text-muted-foreground">{item.date}</TableCell>
                <TableCell className="font-medium">{item.description}</TableCell>
                <TableCell className="text-muted-foreground">{item.category}</TableCell>
                <TableCell className="text-right text-destructive">− {money(Number(item.amount))}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button type="button" variant="ghost" size="icon-sm" aria-label={`Editar ${item.description}`} onClick={() => setEditing(item)}><Pencil className="size-3.5" /></Button>
                    <Button type="button" variant="ghost" size="icon-sm" aria-label={`Apagar ${item.description}`} onClick={() => setDeleting(item)}><Trash2 className="size-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>)}
        </TableBody>
      </Table>
    </div>

    {editing && <div role="dialog" aria-modal="true" aria-labelledby="edit-title" className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-5">
        <h2 id="edit-title" className="text-lg font-semibold">Editar despesa</h2>
        <div className="mt-4">
          <ResourceForm
            handle={transactions}
            record={editing}
            fields={["date", "description", "category", "amount"]}
            onDone={() => setEditing(null)}
          />
        </div>
      </div>
    </div>}

    {deleting && <div role="dialog" aria-modal="true" aria-labelledby="delete-title" className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-5">
        <h2 id="delete-title" className="text-lg font-semibold">Apagar despesa</h2>
        <p className="mt-2 text-sm text-muted-foreground">Apagar "{String(deleting.description)}"? Essa ação não pode ser desfeita.</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => setDeleting(null)}>Cancelar</Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={transactions.pending === deleting.id}
            onClick={async () => { const done = await transactions.remove(deleting.id); if (done) setDeleting(null); }}
          >
            {transactions.pending === deleting.id && <Loader2 className="size-3.5 animate-spin" />} Apagar
          </Button>
        </div>
      </div>
    </div>}
  </EnvironmentShell>;
}
