"use client";

// Ambiente de prática Finanças.
//
// Duas colunas espelhadas: despesas à esquerda, receitas à direita. As duas
// saem do mesmo recurso (`financas.transactions`) e diferem só pelo campo
// `kind` — o que também é o exercício, porque um lançamento criado com o tipo
// errado aparece na coluna oposta em vez de sumir.
//
// Contas, orçamentos e metas continuam em código (ver histórico), só não
// aparecem por enquanto.
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
import { usePracticeApp, type AppRows, type ResourceHandle, type Row } from "@/components/practice/use-practice-app";
import { findPracticeApp } from "@/lib/product/apps";
import { money } from "@/lib/product/practice/format";
import { financeSummary, type Account, type Budget } from "@/lib/product/practice/views";
import type { Transaction } from "@/lib/product/practice/rules";
import type { PracticeSettings } from "@/lib/product/practice/store";

const app = findPracticeApp("financas")!;

const FIELDS = ["date", "description", "category", "amount"];

/**
 * Uma das duas colunas do extrato. Cada uma cuida do próprio formulário e dos
 * próprios diálogos: com o estado no pai, abrir "editar" numa coluna piscava a
 * outra, porque as duas liam o mesmo registro em edição.
 */
function LedgerColumn({
  kind,
  title,
  singular,
  rows,
  handle,
  sign,
  amountClassName,
}: {
  kind: Transaction["kind"];
  title: string;
  singular: string;
  rows: Transaction[];
  handle: ResourceHandle;
  sign: string;
  amountClassName: string;
}) {
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState<Row | null>(null);

  return (
    <section className="flex flex-col rounded-xl border border-border">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex gap-2">
          <ExportCsv resource={handle.resource} rows={rows} columns={FIELDS} filename={title.toLowerCase()} />
          <Button type="button" size="sm" onClick={() => setCreating((current) => !current)}>
            <Plus className="size-3.5" /> Nova {singular}
          </Button>
        </div>
      </header>

      {creating && (
        <div className="border-b border-border p-5">
          <ResourceForm
            handle={handle}
            fields={FIELDS}
            defaults={{ date: "2026-08-15", kind }}
            submitLabel={`Adicionar ${singular}`}
            onDone={() => setCreating(false)}
          />
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                Nenhuma {singular} registrada. Adicione a primeira acima.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="whitespace-nowrap text-muted-foreground">{item.date}</TableCell>
                {/* Categoria entra sob a descrição em vez de virar coluna: em
                    meia largura, cinco colunas espremem o valor. */}
                <TableCell>
                  <span className="font-medium">{item.description}</span>
                  <span className="block text-xs text-muted-foreground">{item.category}</span>
                </TableCell>
                <TableCell className={`whitespace-nowrap text-right tabular-nums ${amountClassName}`}>
                  {sign} {money(Number(item.amount))}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button type="button" variant="ghost" size="icon-sm" aria-label={`Editar ${item.description}`} onClick={() => setEditing(item)}>
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon-sm" aria-label={`Apagar ${item.description}`} onClick={() => setDeleting(item)}>
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {editing && (
        <div role="dialog" aria-modal="true" aria-labelledby={`edit-${kind}`} className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-5">
            <h2 id={`edit-${kind}`} className="text-lg font-semibold">Editar {singular}</h2>
            <div className="mt-4">
              <ResourceForm handle={handle} record={editing} fields={FIELDS} onDone={() => setEditing(null)} />
            </div>
          </div>
        </div>
      )}

      {deleting && (
        <div role="dialog" aria-modal="true" aria-labelledby={`delete-${kind}`} className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-5">
            <h2 id={`delete-${kind}`} className="text-lg font-semibold">Apagar {singular}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Apagar &quot;{String(deleting.description)}&quot;? Essa ação não pode ser desfeita.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setDeleting(null)}>Cancelar</Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={handle.pending === deleting.id}
                onClick={async () => { const done = await handle.remove(deleting.id); if (done) setDeleting(null); }}
              >
                {handle.pending === deleting.id && <Loader2 className="size-3.5 animate-spin" />} Apagar
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export function FinanceApp({ initial, settings, signedIn }: { initial: AppRows; settings: PracticeSettings; signedIn: boolean }) {
  // Sem desvios ativos: o painel que ligava/desligava isso saiu de tela, então
  // o saldo sempre bate com a soma real dos lançamentos — é o que dá pra
  // validar criando, editando e apagando aqui.
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
  const recentFirst = (kind: Transaction["kind"]) =>
    rows.transactions.filter((item) => item.kind === kind).sort((a, b) => b.date.localeCompare(a.date));

  return <EnvironmentShell app={app} settings={settings} signedIn={signedIn}>
    {/* Extrato, não dashboard: o saldo é o número que importa, então ele é o
        maior da tela — os lançamentos ficam nas duas colunas abaixo. */}
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

    {/* `items-start` para uma coluna com mais lançamentos não esticar a outra. */}
    <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
      <LedgerColumn
        kind="despesa"
        title="Despesas"
        singular="despesa"
        rows={recentFirst("despesa")}
        handle={transactions}
        sign="−"
        amountClassName="text-destructive"
      />
      <LedgerColumn
        kind="receita"
        title="Receitas"
        singular="receita"
        rows={recentFirst("receita")}
        handle={transactions}
        sign="+"
        amountClassName="text-primary"
      />
    </div>
  </EnvironmentShell>;
}
