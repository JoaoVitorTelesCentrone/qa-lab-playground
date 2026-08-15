"use client";

// Tabela genérica de um recurso de prática, com edição e exclusão.
//
// As colunas e a formatação saem do registro do recurso, então a tabela mostra
// exatamente o que a API guardou. A exclusão é em dois passos (pedir e
// confirmar) porque o cenário 15 de todo pack exige confirmação — e o cenário
// 13 exige poder cancelar no meio do caminho.

import { Fragment, useState, type ReactNode } from "react";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatField } from "@/lib/product/practice/format";
import { ResourceForm } from "./resource-form";
import type { ResourceHandle, Row } from "./use-practice-app";

export function RecordTable({
  handle,
  columns,
  rows,
  empty,
  editable = true,
  removable = true,
  suggestions,
  renderCell,
}: {
  handle: ResourceHandle;
  /** Campos exibidos, na ordem. Padrão: todos os campos do recurso. */
  columns?: string[];
  /** Linhas a mostrar — permite filtrar/ordenar antes sem duplicar a tabela. */
  rows?: Row[];
  empty: string;
  editable?: boolean;
  removable?: boolean;
  suggestions?: Record<string, string[]>;
  /** Célula customizada; devolva undefined para cair no formato padrão. */
  renderCell?: (row: Row, field: string) => ReactNode | undefined;
}) {
  const { resource } = handle;
  const names = columns ?? Object.keys(resource.fields);
  const data = rows ?? handle.rows;
  const [editing, setEditing] = useState("");
  const [confirming, setConfirming] = useState("");
  const actions = editable || removable;

  if (data.length === 0) {
    return <p className="rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">{empty}</p>;
  }

  return <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          {names.map((name) => <TableHead key={name}>{resource.fields[name]?.label ?? name}</TableHead>)}
          {actions && <TableHead className="text-right">Ações</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => {
          const busy = handle.pending === row.id;
          return <Fragment key={row.id}>
            <TableRow>
              {names.map((name) => <TableCell key={name}>{renderCell?.(row, name) ?? formatField(resource.fields[name]!, row[name])}</TableCell>)}
              {actions && <TableCell className="text-right whitespace-nowrap">
                {confirming === row.id
                  ? <span className="inline-flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Excluir {resource.singular}?</span>
                      <Button size="xs" variant="destructive" onClick={async () => { await handle.remove(row.id); setConfirming(""); }} disabled={busy}>
                        {busy && <Loader2 className="animate-spin" />} Confirmar
                      </Button>
                      <Button size="xs" variant="ghost" onClick={() => setConfirming("")}>Cancelar</Button>
                    </span>
                  : <span className="inline-flex gap-1">
                      {editable && <Button size="icon-xs" variant="ghost" aria-label={`Editar ${labelOf(resource.fields, row, names)}`} onClick={() => { handle.reset(); setEditing(editing === row.id ? "" : row.id); }}><Pencil /></Button>}
                      {removable && <Button size="icon-xs" variant="ghost" aria-label={`Excluir ${labelOf(resource.fields, row, names)}`} onClick={() => { handle.reset(); setConfirming(row.id); }}><Trash2 /></Button>}
                    </span>}
              </TableCell>}
            </TableRow>
            {editing === row.id && <TableRow>
              <TableCell colSpan={names.length + (actions ? 1 : 0)} className="bg-muted/30">
                <ResourceForm handle={handle} record={row} suggestions={suggestions} onDone={() => setEditing("")} />
              </TableCell>
            </TableRow>}
          </Fragment>;
        })}
      </TableBody>
    </Table>
  </div>;
}

/** Primeiro campo de texto do registro, para nomear o botão no leitor de tela. */
function labelOf(fields: ResourceHandle["resource"]["fields"], row: Row, names: string[]) {
  const first = names.find((name) => fields[name]?.type === "text");
  return first ? String(row[first] ?? "") : "registro";
}
