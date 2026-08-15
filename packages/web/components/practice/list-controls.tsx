"use client";

// Busca, filtros, ordenação e paginação de uma lista.
//
// Existe porque sete dos 35 cenários de todo pack (busca, filtro combinado,
// ordenação, paginação, estado vazio, performance de lista) precisam de uma
// lista de verdade para serem executáveis. Centralizar deixa os três ambientes
// com o mesmo comportamento — e um bug encontrado aqui vale nos três.

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Row } from "./use-practice-app";

export type FilterSpec = { field: string; label: string; options: Array<{ value: string; label: string }> };
export type SortSpec<T> = { id: string; label: string; compare: (left: T, right: T) => number };

export const pageSizes = [5, 10, 25];

export function useListControls<T extends Row>(rows: T[], options: {
  searchLabel?: string;
  searchPlaceholder?: string;
  /** Busca customizada; sem ela, o campo de busca não aparece. */
  search?: (rows: T[], query: string) => T[];
  filters?: FilterSpec[];
  sorts?: Array<SortSpec<T>>;
  defaultPageSize?: number;
}) {
  const { search, filters = [], sorts = [], defaultPageSize = 10 } = options;
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Record<string, string>>({});
  const [sortId, setSortId] = useState(sorts[0]?.id ?? "");
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = rows;
    if (search && query.trim()) result = search(result, query);
    for (const filter of filters) {
      const value = active[filter.field];
      if (value) result = result.filter((row) => String(row[filter.field] ?? "") === value);
    }
    const sort = sorts.find((item) => item.id === sortId);
    return sort ? [...result].sort(sort.compare) : result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, query, active, sortId]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  // Filtrar depois de paginar não pode deixar o aluno preso em uma página vazia.
  useEffect(() => { setPage((current) => Math.min(current, pages)); }, [pages]);

  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const hasFilters = query.trim() !== "" || Object.values(active).some(Boolean);

  function clear() {
    setQuery("");
    setActive({});
    setPage(1);
  }

  const ui: ReactNode = <div className="grid gap-3">
    <div className="flex flex-wrap items-end gap-3">
      {search && <label className="grid gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">{options.searchLabel ?? "Buscar"}</span>
        <span className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder={options.searchPlaceholder} className="input w-56 pl-8" />
        </span>
      </label>}

      {filters.map((filter) => <label key={filter.field} className="grid gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">{filter.label}</span>
        <select value={active[filter.field] ?? ""} onChange={(event) => { setActive((state) => ({ ...state, [filter.field]: event.target.value })); setPage(1); }} className="input w-44">
          <option value="">Todos</option>
          {filter.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </label>)}

      {sorts.length > 1 && <label className="grid gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">Ordenar por</span>
        <select value={sortId} onChange={(event) => setSortId(event.target.value)} className="input w-52">
          {sorts.map((sort) => <option key={sort.id} value={sort.id}>{sort.label}</option>)}
        </select>
      </label>}

      {hasFilters && <Button type="button" variant="ghost" size="sm" onClick={clear}><X className="size-3.5" /> Limpar filtros</Button>}
    </div>

    <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
      <p aria-live="polite">{filtered.length === rows.length ? `${rows.length} registro(s)` : `${filtered.length} de ${rows.length} registro(s)`}</p>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-1.5">
          Itens por página
          <select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }} className="input h-8 w-16 px-2">
            {pageSizes.map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
        </label>
        <div className="flex items-center gap-1.5">
          <Button type="button" size="xs" variant="outline" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>Anterior</Button>
          <span>Página {page} de {pages}</span>
          <Button type="button" size="xs" variant="outline" onClick={() => setPage((current) => Math.min(pages, current + 1))} disabled={page === pages}>Próxima</Button>
        </div>
      </div>
    </div>
  </div>;

  return { visible, filtered, ui, hasFilters, clear };
}
