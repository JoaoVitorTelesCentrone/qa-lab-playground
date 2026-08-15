"use client";

// Estado de um ambiente de prática no cliente.
//
// Duas formas de operar, decididas por `persist`:
// - logado: cada mutação vai para /api/v1/practice/<recurso> e o servidor é
//   quem valida, autoriza e devolve a linha gravada;
// - deslogado: a mesma validação roda localmente e o estado vive só nesta tela
//   (regra do produto: login protege a persistência, não o experimentar).
//
// Em ambos os casos as mensagens saem das mesmas funções puras, então o que o
// aluno vê deslogado é o que ele veria logado — menos o "some ao sair".

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { domainErrors } from "@/lib/product/practice/domain";
import { findResource, parseRecord, type PracticeResource } from "@/lib/product/practice/resources";
import type { PracticeRow, PracticeRows } from "@/lib/product/practice/store";

export type Row = PracticeRow;
export type AppRows = PracticeRows;

type Feedback = { message: string; fields: Record<string, string> };

const noFeedback: Feedback = { message: "", fields: {} };

export type ResourceHandle = {
  resource: PracticeResource;
  rows: Row[];
  /** Id do registro em operação, ou "" quando parado. `new` durante a criação. */
  pending: string;
  error: string;
  fieldErrors: Record<string, string>;
  /** Última operação concluída, para anunciar em aria-live. */
  notice: string;
  create: (values: Record<string, unknown>) => Promise<boolean>;
  update: (id: string, values: Record<string, unknown>) => Promise<boolean>;
  remove: (id: string) => Promise<boolean>;
  reset: () => void;
};

export function usePracticeApp(initial: AppRows, { persist, activeBugs }: { persist: boolean; activeBugs: string[] }) {
  const [rows, setRows] = useState<AppRows>(initial);
  const [feedback, setFeedback] = useState<Record<string, Feedback>>({});
  const [notice, setNotice] = useState<Record<string, string>>({});
  const [pending, setPending] = useState<Record<string, string>>({});
  // As linhas atuais para as regras de domínio, sem recriar os callbacks a cada
  // tecla digitada.
  const current = useRef(rows);
  current.current = rows;

  // "Restaurar massa" e a troca de perfil recarregam o Server Component; quando
  // as linhas novas chegam por props, o estado local acompanha. A comparação é
  // pelo conteúdo, não pela identidade do objeto, para um re-render do pai não
  // descartar o que o aluno acabou de criar.
  const serialized = JSON.stringify(initial);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setRows(initial); }, [serialized]);

  const handle = useCallback((resourceId: string): ResourceHandle => {
    const resource = findResource(resourceId);
    if (!resource) throw new Error(`Recurso desconhecido: ${resourceId}`);

    const setBusy = (id: string) => setPending((state) => ({ ...state, [resourceId]: id }));
    const stop = () => setPending((state) => ({ ...state, [resourceId]: "" }));
    const setError = (value: Feedback) => setFeedback((state) => ({ ...state, [resourceId]: value }));
    const announce = (message: string) => setNotice((state) => ({ ...state, [resourceId]: message }));

    /** Validação local: mesma regra do servidor, só que sem esperar a rede. */
    function check(values: Record<string, unknown>, { partial = false, recordId = "" } = {}) {
      const parsed = parseRecord(resource!, values, { partial });
      const merged = recordId
        ? { ...(current.current[resourceId] ?? []).find((row) => row.id === recordId), ...parsed.values }
        : parsed.values;
      // Os desvios ativos entram aqui também: com um deles ligado, o servidor
      // aceita o que a regra sã recusaria, e o formulário precisa aceitar
      // junto — senão a interface esconderia o bug em vez de expô-lo.
      const fields = { ...parsed.errors, ...domainErrors(resourceId, merged, { rows: current.current, activeBugs, recordId: recordId || undefined }) };
      return { values: parsed.values, fields };
    }

    async function send(method: string, values: Record<string, unknown>, id?: string) {
      const url = `/api/v1/practice/${resourceId}${id ? `?id=${encodeURIComponent(id)}` : ""}`;
      const response = await fetch(url, { method, headers: { "content-type": "application/json" }, body: JSON.stringify(values) });
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        setError({ message: body?.error?.message ?? "Não foi possível concluir a operação.", fields: body?.error?.details ?? {} });
        return null;
      }
      return (body?.data ?? null) as Row | null;
    }

    return {
      resource,
      rows: rows[resourceId] ?? [],
      pending: pending[resourceId] ?? "",
      error: (feedback[resourceId] ?? noFeedback).message,
      fieldErrors: (feedback[resourceId] ?? noFeedback).fields,
      notice: notice[resourceId] ?? "",

      async create(values) {
        setError(noFeedback); announce("");
        const { values: parsed, fields } = check(values);
        if (Object.keys(fields).length > 0) { setError({ message: "Verifique os campos destacados.", fields }); return false; }

        setBusy("new");
        const saved = persist ? await send("POST", values) : ({ ...parsed, id: localId() } as Row);
        stop();
        if (!saved) return false;

        setRows((state) => ({ ...state, [resourceId]: sortRows(resource!, [...(state[resourceId] ?? []), saved]) }));
        announce(`${capitalize(resource!.singular)} criado com sucesso.`);
        return true;
      },

      async update(id, values) {
        setError(noFeedback); announce("");
        const { values: parsed, fields } = check(values, { partial: true, recordId: id });
        if (Object.keys(fields).length > 0) { setError({ message: "Verifique os campos destacados.", fields }); return false; }

        setBusy(id);
        const saved = persist ? await send("PATCH", values, id) : null;
        stop();
        if (persist && !saved) return false;

        setRows((state) => ({
          ...state,
          [resourceId]: sortRows(resource!, (state[resourceId] ?? []).map((row) => (row.id === id ? { ...row, ...(saved ?? parsed) } : row))),
        }));
        announce(`${capitalize(resource!.singular)} atualizado.`);
        return true;
      },

      async remove(id) {
        setError(noFeedback); announce("");
        setBusy(id);
        if (persist) {
          const response = await fetch(`/api/v1/practice/${resourceId}?id=${encodeURIComponent(id)}`, { method: "DELETE" });
          if (!response.ok) {
            const body = await response.json().catch(() => null);
            stop();
            setError({ message: body?.error?.message ?? "Não foi possível excluir.", fields: {} });
            return false;
          }
        }
        stop();
        setRows((state) => ({ ...state, [resourceId]: (state[resourceId] ?? []).filter((row) => row.id !== id) }));
        announce(`${capitalize(resource!.singular)} removido.`);
        return true;
      },

      reset() { setError(noFeedback); announce(""); },
    };
  }, [rows, feedback, notice, pending, persist, activeBugs]);

  return useMemo(() => ({ rows, use: handle }), [rows, handle]);
}

function sortRows(resource: PracticeResource, rows: Row[]) {
  const { column, ascending } = resource.order;
  return [...rows].sort((left, right) => {
    const a = left[column];
    const b = right[column];
    if (a === b) return 0;
    const smaller = typeof a === "number" && typeof b === "number" ? a < b : String(a ?? "") < String(b ?? "");
    return (smaller ? -1 : 1) * (ascending ? 1 : -1);
  });
}

const localId = () => `local-${Math.random().toString(36).slice(2, 10)}`;

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);
