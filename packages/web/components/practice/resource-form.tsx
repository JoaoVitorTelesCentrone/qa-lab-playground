"use client";

// Formulário genérico de um recurso de prática.
//
// Os campos, os rótulos, as opções e os limites saem de
// lib/product/practice/resources.ts — o mesmo registro que a API usa para
// validar. Assim a mensagem de "campo obrigatório" na tela é a mesma que a API
// devolve no 422, que é justamente o que os cenários de validação comparam.
//
// Nada é desabilitado por perfil de propósito: esconder o botão não é controle
// de acesso, e descobrir isso é um dos exercícios. Quem não pode, recebe 403.

import { useEffect, useId, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { emptyRecord, type FieldSpec } from "@/lib/product/practice/resources";
import type { ResourceHandle, Row } from "./use-practice-app";

type Values = Record<string, string | boolean>;

export function ResourceForm({
  handle,
  record,
  fields,
  defaults,
  sync,
  suggestions,
  submitLabel,
  columns = 2,
  onDone,
}: {
  handle: ResourceHandle;
  /** Registro em edição. Ausente, o formulário cria. */
  record?: Row;
  /** Subconjunto de campos, na ordem desejada. Padrão: todos, na ordem do recurso. */
  fields?: string[];
  defaults?: Record<string, string>;
  /** Campos preenchidos por outra parte da tela (escolher um horário na grade). */
  sync?: Record<string, string>;
  /** Valores já usados no ambiente, oferecidos como sugestão (datalist). */
  suggestions?: Record<string, string[]>;
  submitLabel?: string;
  columns?: 1 | 2;
  onDone?: () => void;
}) {
  const { resource } = handle;
  const names = fields ?? Object.keys(resource.fields);
  const initial = () => ({ ...emptyRecord(resource), ...defaults, ...toFormValues(record, names, resource.fields) });
  const [values, setValues] = useState<Values>(initial);
  const formId = useId();

  // Trocar o registro em edição (ou restaurar a massa) recarrega o formulário.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setValues(initial()); }, [record?.id, JSON.stringify(defaults)]);

  // Já o que vem de fora sobrescreve só os campos enviados: escolher um horário
  // na grade não pode apagar o nome que o aluno acabou de digitar.
  const syncKey = JSON.stringify(sync ?? {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (sync) setValues((state) => ({ ...state, ...sync })); }, [syncKey]);

  const busy = handle.pending === (record ? record.id : "new");

  async function submit(event: FormEvent) {
    event.preventDefault();
    const payload = Object.fromEntries(names.map((name) => [name, values[name]]));
    const done = record ? await handle.update(record.id, payload) : await handle.create(payload);
    if (!done) return;
    if (!record) setValues(initial());
    onDone?.();
  }

  return <form onSubmit={submit} noValidate className="grid gap-3.5" aria-describedby={`${formId}-status`}>
    <div className={columns === 2 ? "grid gap-3.5 sm:grid-cols-2" : "grid gap-3.5"}>
      {names.map((name) => {
        const spec = resource.fields[name];
        if (!spec) return null;
        return <Field
          key={name}
          id={`${formId}-${name}`}
          name={name}
          spec={spec}
          value={values[name]}
          error={handle.fieldErrors[name]}
          suggestions={suggestions?.[name]}
          full={columns === 2 && (spec.type === "boolean" || ("multiline" in spec && spec.multiline))}
          onChange={(next) => setValues((state) => ({ ...state, [name]: next }))}
        />;
      })}
    </div>

    <div className="flex flex-wrap items-center gap-3">
      <Button type="submit" disabled={busy} size="sm">
        {busy && <Loader2 className="size-3.5 animate-spin" />}
        {submitLabel ?? (record ? "Salvar alterações" : `Adicionar ${resource.singular}`)}
      </Button>
      {record && onDone && <Button type="button" variant="ghost" size="sm" onClick={() => { handle.reset(); onDone(); }}>Cancelar</Button>}
    </div>

    <div id={`${formId}-status`} className="min-h-0">
      {handle.error && <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">{handle.error}</p>}
      <p aria-live="polite" className="sr-only">{handle.notice}</p>
    </div>
  </form>;
}

function Field({ id, name, spec, value, error, suggestions, full, onChange }: {
  id: string;
  name: string;
  spec: FieldSpec;
  value: string | boolean | undefined;
  error?: string;
  suggestions?: string[];
  full?: boolean;
  onChange: (value: string | boolean) => void;
}) {
  const describedBy = [error ? `${id}-error` : "", spec.hint ? `${id}-hint` : ""].filter(Boolean).join(" ") || undefined;
  const invalid = Boolean(error);
  const listId = suggestions && suggestions.length > 0 ? `${id}-list` : undefined;

  if (spec.type === "boolean") {
    return <div className={full ? "sm:col-span-2" : ""}>
      <label className="flex items-center gap-2 text-sm">
        <input id={id} type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} aria-describedby={describedBy} />
        {spec.label}
      </label>
      {spec.hint && <p id={`${id}-hint`} className="mt-1 text-xs text-muted-foreground">{spec.hint}</p>}
      {error && <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-destructive">{error}</p>}
    </div>;
  }

  const control = (() => {
    const shared = { id, name, "aria-invalid": invalid, "aria-describedby": describedBy, className: `input ${invalid ? "border-destructive focus:border-destructive focus:ring-destructive/20" : ""}` };

    if (spec.type === "enum" || (spec.type === "number" && spec.options)) {
      const options = spec.type === "enum"
        ? spec.values.map((option) => [option, spec.optionLabels?.[option] ?? option] as const)
        : Object.entries(spec.options ?? {});
      return <select {...shared} value={String(value ?? "")} onChange={(event) => onChange(event.target.value)}>
        <option value="">Selecione…</option>
        {options.map(([option, label]) => <option key={option} value={option}>{label}</option>)}
      </select>;
    }

    if (spec.type === "text" && spec.multiline) {
      return <textarea {...shared} className={`field w-full ${invalid ? "border-destructive" : ""}`} rows={3} maxLength={spec.max} placeholder={spec.placeholder} value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} />;
    }

    const type = spec.type === "number" ? "number" : spec.type === "date" ? "date" : spec.type === "time" ? "time" : "text";
    return <input
      {...shared}
      type={type}
      list={listId}
      inputMode={spec.type === "number" ? "decimal" : undefined}
      step={spec.type === "number" && spec.money ? "0.01" : undefined}
      maxLength={spec.type === "text" ? spec.max : undefined}
      placeholder={spec.type === "text" ? spec.placeholder : undefined}
      value={String(value ?? "")}
      onChange={(event) => onChange(event.target.value)}
    />;
  })();

  return <div className={full ? "sm:col-span-2" : ""}>
    <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-muted-foreground">
      {spec.label}{spec.required && <span aria-hidden="true" className="ml-0.5 text-destructive">*</span>}
    </label>
    {control}
    {listId && <datalist id={listId}>{suggestions!.map((option) => <option key={option} value={option} />)}</datalist>}
    {spec.hint && <p id={`${id}-hint`} className="mt-1 text-xs text-muted-foreground">{spec.hint}</p>}
    {error && <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-destructive">{error}</p>}
  </div>;
}

/** Linha do banco → valores de formulário (tudo string, menos os booleanos). */
function toFormValues(record: Row | undefined, names: string[], fields: Record<string, FieldSpec>): Values {
  if (!record) return {};
  return Object.fromEntries(names.map((name) => {
    const raw = record[name];
    if (fields[name]?.type === "boolean") return [name, Boolean(raw)];
    // O input de horário não aceita os segundos que o Postgres devolve.
    if (fields[name]?.type === "time") return [name, String(raw ?? "").slice(0, 5)];
    return [name, raw === null || raw === undefined ? "" : String(raw)];
  }));
}
