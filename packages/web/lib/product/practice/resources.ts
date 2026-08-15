// Registro dos recursos de prática.
//
// Um recurso descreve uma entidade de um dos ambientes: onde ela mora, quais
// campos aceita e como validá-los. A API `/api/v1/practice/[resource]` atende
// todos a partir daqui, em vez de um endpoint escrito à mão por entidade.
//
// Módulo puro: sem React e sem Supabase, para poder ser testado direto.

import type { PracticeAppId } from "../apps";

export type FieldSpec =
  | { type: "text"; required?: boolean; max?: number }
  | { type: "number"; required?: boolean; min?: number; max?: number }
  | { type: "date"; required?: boolean }
  | { type: "time"; required?: boolean }
  | { type: "boolean"; required?: boolean }
  | { type: "enum"; values: readonly string[]; required?: boolean };

export type PracticeResource = {
  id: string;
  appId: PracticeAppId;
  table: string;
  label: string;
  fields: Record<string, FieldSpec>;
  order: { column: string; ascending: boolean };
};

const money = { type: "number", required: true, min: 0, max: 9_999_999 } as const;

export const practiceResources: PracticeResource[] = [
  {
    id: "financas.accounts",
    appId: "financas",
    table: "practice_finance_accounts",
    label: "Contas",
    fields: { name: { type: "text", required: true, max: 60 }, kind: { type: "enum", values: ["corrente", "poupanca", "carteira"], required: true }, balance: money },
    order: { column: "name", ascending: true },
  },
  {
    id: "financas.transactions",
    appId: "financas",
    table: "practice_finance_transactions",
    label: "Lançamentos",
    fields: {
      description: { type: "text", required: true, max: 80 },
      amount: money,
      kind: { type: "enum", values: ["receita", "despesa"], required: true },
      category: { type: "text", required: true, max: 40 },
      date: { type: "date", required: true },
      recurring: { type: "boolean" },
    },
    order: { column: "date", ascending: false },
  },
  {
    id: "financas.budgets",
    appId: "financas",
    table: "practice_finance_budgets",
    label: "Orçamentos",
    fields: { category: { type: "text", required: true, max: 40 }, limit_amount: money },
    order: { column: "category", ascending: true },
  },
  {
    id: "financas.goals",
    appId: "financas",
    table: "practice_finance_goals",
    label: "Metas",
    fields: { name: { type: "text", required: true, max: 60 }, target_amount: money, saved_amount: { type: "number", required: true, min: 0, max: 9_999_999 } },
    order: { column: "name", ascending: true },
  },
  {
    id: "agendamentos.services",
    appId: "agendamentos",
    table: "practice_booking_services",
    label: "Serviços",
    fields: { name: { type: "text", required: true, max: 60 }, duration_minutes: { type: "number", required: true, min: 15, max: 480 }, price: money },
    order: { column: "name", ascending: true },
  },
  {
    id: "agendamentos.availability",
    appId: "agendamentos",
    table: "practice_booking_availability",
    label: "Disponibilidade",
    fields: { weekday: { type: "number", required: true, min: 0, max: 6 }, start_time: { type: "time", required: true }, end_time: { type: "time", required: true } },
    order: { column: "weekday", ascending: true },
  },
  {
    id: "agendamentos.bookings",
    appId: "agendamentos",
    table: "practice_bookings",
    label: "Agendamentos",
    fields: {
      customer: { type: "text", required: true, max: 60 },
      service: { type: "text", required: true, max: 60 },
      date: { type: "date", required: true },
      time: { type: "time", required: true },
      status: { type: "enum", values: ["confirmado", "cancelado"], required: true },
    },
    order: { column: "date", ascending: true },
  },
  {
    id: "crm.companies",
    appId: "crm",
    table: "practice_crm_companies",
    label: "Empresas",
    fields: { name: { type: "text", required: true, max: 80 }, segment: { type: "text", required: true, max: 40 }, size: { type: "enum", values: ["pequena", "media", "grande"], required: true } },
    order: { column: "name", ascending: true },
  },
  {
    id: "crm.contacts",
    appId: "crm",
    table: "practice_crm_contacts",
    label: "Contatos",
    fields: { name: { type: "text", required: true, max: 80 }, email: { type: "text", required: true, max: 120 }, company: { type: "text", required: true, max: 80 }, role: { type: "text", max: 60 } },
    order: { column: "name", ascending: true },
  },
  {
    id: "crm.deals",
    appId: "crm",
    table: "practice_crm_deals",
    label: "Oportunidades",
    fields: {
      title: { type: "text", required: true, max: 80 },
      company: { type: "text", required: true, max: 80 },
      amount: money,
      stage: { type: "enum", values: ["novo", "qualificado", "proposta", "ganho", "perdido"], required: true },
    },
    order: { column: "amount", ascending: false },
  },
  {
    id: "crm.activities",
    appId: "crm",
    table: "practice_crm_activities",
    label: "Atividades",
    fields: { deal: { type: "text", required: true, max: 80 }, kind: { type: "enum", values: ["ligacao", "email", "reuniao"], required: true }, summary: { type: "text", required: true, max: 200 } },
    order: { column: "created_at", ascending: false },
  },
];

export function findResource(id: string) {
  return practiceResources.find((resource) => resource.id === id);
}

export function resourcesForApp(appId: PracticeAppId) {
  return practiceResources.filter((resource) => resource.appId === appId);
}

export type ParseResult = { values: Record<string, unknown>; errors: Record<string, string> };

const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
const timeFormat = /^\d{2}:\d{2}$/;

/**
 * Valida um corpo contra os campos do recurso. Em `partial` (PATCH) só valida
 * o que veio; fora dele, campo obrigatório ausente é erro. Campos fora do
 * registro são ignorados — o cliente não escolhe o que grava.
 */
export function parseRecord(resource: PracticeResource, body: Record<string, unknown>, { partial = false } = {}): ParseResult {
  const values: Record<string, unknown> = {};
  const errors: Record<string, string> = {};

  for (const [name, spec] of Object.entries(resource.fields)) {
    const raw = body[name];
    const absent = raw === undefined || raw === null || raw === "";

    if (absent) {
      if (partial) continue;
      if ("required" in spec && spec.required) errors[name] = "Campo obrigatório.";
      else if (spec.type === "boolean") values[name] = false;
      continue;
    }

    switch (spec.type) {
      case "text": {
        const value = String(raw).trim();
        if (!value) errors[name] = "Campo obrigatório.";
        else if (spec.max && value.length > spec.max) errors[name] = `Use no máximo ${spec.max} caracteres.`;
        else values[name] = value;
        break;
      }
      case "number": {
        const value = typeof raw === "number" ? raw : Number(String(raw).replace(",", "."));
        if (!Number.isFinite(value)) errors[name] = "Informe um número válido.";
        else if (spec.min !== undefined && value < spec.min) errors[name] = `Valor mínimo: ${spec.min}.`;
        else if (spec.max !== undefined && value > spec.max) errors[name] = `Valor máximo: ${spec.max}.`;
        else values[name] = value;
        break;
      }
      case "date":
        if (!dateFormat.test(String(raw)) || Number.isNaN(Date.parse(String(raw)))) errors[name] = "Use uma data no formato AAAA-MM-DD.";
        else values[name] = String(raw);
        break;
      case "time":
        if (!timeFormat.test(String(raw))) errors[name] = "Use um horário no formato HH:MM.";
        else values[name] = String(raw);
        break;
      case "boolean":
        values[name] = raw === true || raw === "true";
        break;
      case "enum":
        if (!spec.values.includes(String(raw))) errors[name] = `Valor deve ser um de: ${spec.values.join(", ")}.`;
        else values[name] = String(raw);
        break;
    }
  }

  return { values, errors };
}
