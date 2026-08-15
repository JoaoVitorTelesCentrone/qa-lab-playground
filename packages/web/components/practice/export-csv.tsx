"use client";

// Exportação em CSV de uma lista do ambiente.
//
// Existe para o cenário 32 de todo pack ("exportar dados e validar conteúdo do
// arquivo") ser executável: o arquivo sai com os mesmos rótulos e a mesma
// formatação da tela, então dá para conferir divergência entre o que foi
// exibido e o que foi exportado — inclusive quando um desvio plantado está
// mexendo no cálculo.

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatField } from "@/lib/product/practice/format";
import type { PracticeResource } from "@/lib/product/practice/resources";
import type { Row } from "./use-practice-app";

export function ExportCsv({ resource, rows, columns, filename }: {
  resource: PracticeResource;
  rows: Row[];
  columns?: string[];
  filename?: string;
}) {
  const names = columns ?? Object.keys(resource.fields);

  function download() {
    const header = names.map((name) => resource.fields[name]?.label ?? name);
    const body = rows.map((row) => names.map((name) => formatField(resource.fields[name]!, row[name])));
    // Ponto e vírgula porque o separador decimal do pt-BR é a vírgula — abrir
    // no Excel brasileiro sem embaralhar coluna faz parte do resultado esperado.
    const csv = [header, ...body].map((line) => line.map(escapeCell).join(";")).join("\r\n");
    const url = URL.createObjectURL(new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename ?? resource.id}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return <Button type="button" variant="outline" size="sm" onClick={download} disabled={rows.length === 0}>
    <Download className="size-3.5" /> Exportar CSV
  </Button>;
}

const escapeCell = (value: string) => (/[";\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value);
