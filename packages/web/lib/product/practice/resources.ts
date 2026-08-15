// Registro dos recursos de prática.
//
// Um recurso descreve uma entidade de um dos ambientes: onde ela mora, quais
// campos aceita, como validá-los e como rotulá-los. A API
// `/api/v1/practice/[resource]` valida a partir daqui e os formulários da
// interface são gerados daqui — o rótulo e a lista de opções não são
// redeclarados em componente nenhum.
//
// Módulo puro: sem React e sem Supabase, para poder ser testado direto.

import type { PracticeAppId } from "../apps";

type BaseField = {
  /** Rótulo do campo na interface. Também usado nas mensagens de erro. */
  label: string;
  required?: boolean;
  /** Texto de apoio abaixo do campo. */
  hint?: string;
};

export type FieldSpec =
  | (BaseField & { type: "text"; max?: number; multiline?: boolean; placeholder?: string })
  // `options` transforma o número em uma lista fechada (dia da semana), sem
  // deixar de ser um número na validação e na coluna.
  | (BaseField & { type: "number"; min?: number; max?: number; money?: boolean; options?: Record<string, string> })
  | (BaseField & { type: "date" })
  | (BaseField & { type: "time" })
  | (BaseField & { type: "boolean" })
  | (BaseField & { type: "enum"; values: readonly string[]; optionLabels?: Record<string, string> });

export type PracticeResource = {
  id: string;
  appId: PracticeAppId;
  table: string;
  label: string;
  /** Nome no singular, usado nos botões e confirmações ("Excluir lançamento"). */
  singular: string;
  fields: Record<string, FieldSpec>;
  order: { column: string; ascending: boolean };
};

const money = (label: string) => ({ type: "number", label, required: true, min: 0, max: 9_999_999, money: true }) as const;

export const practiceResources: PracticeResource[] = [
  {
    id: "financas.accounts",
    appId: "financas",
    table: "practice_finance_accounts",
    label: "Contas",
    singular: "conta",
    fields: {
      name: { type: "text", label: "Nome", required: true, max: 60, placeholder: "Conta corrente" },
      kind: { type: "enum", label: "Tipo", values: ["corrente", "poupanca", "carteira"], required: true, optionLabels: { corrente: "Conta corrente", poupanca: "Poupança", carteira: "Carteira" } },
      balance: money("Saldo"),
    },
    order: { column: "name", ascending: true },
  },
  {
    id: "financas.transactions",
    appId: "financas",
    table: "practice_finance_transactions",
    label: "Lançamentos",
    singular: "lançamento",
    fields: {
      description: { type: "text", label: "Descrição", required: true, max: 80, placeholder: "Mercado" },
      amount: money("Valor"),
      kind: { type: "enum", label: "Tipo", values: ["receita", "despesa"], required: true, optionLabels: { receita: "Receita", despesa: "Despesa" } },
      category: { type: "text", label: "Categoria", required: true, max: 40, placeholder: "Alimentação" },
      date: { type: "date", label: "Data", required: true },
      recurring: { type: "boolean", label: "Lançamento recorrente", hint: "Repete todo mês." },
    },
    order: { column: "date", ascending: false },
  },
  {
    id: "financas.budgets",
    appId: "financas",
    table: "practice_finance_budgets",
    label: "Orçamentos",
    singular: "orçamento",
    fields: {
      category: { type: "text", label: "Categoria", required: true, max: 40, placeholder: "Moradia" },
      limit_amount: money("Limite mensal"),
    },
    order: { column: "category", ascending: true },
  },
  {
    id: "financas.goals",
    appId: "financas",
    table: "practice_finance_goals",
    label: "Metas",
    singular: "meta",
    fields: {
      name: { type: "text", label: "Nome", required: true, max: 60, placeholder: "Reserva de emergência" },
      target_amount: money("Valor alvo"),
      saved_amount: { type: "number", label: "Já guardado", required: true, min: 0, max: 9_999_999, money: true },
    },
    order: { column: "name", ascending: true },
  },
  {
    id: "agendamentos.services",
    appId: "agendamentos",
    table: "practice_booking_services",
    label: "Serviços",
    singular: "serviço",
    fields: {
      name: { type: "text", label: "Nome", required: true, max: 60, placeholder: "Consulta inicial" },
      duration_minutes: { type: "number", label: "Duração (minutos)", required: true, min: 15, max: 480 },
      price: money("Preço"),
    },
    order: { column: "name", ascending: true },
  },
  {
    id: "agendamentos.availability",
    appId: "agendamentos",
    table: "practice_booking_availability",
    label: "Disponibilidade",
    singular: "faixa de disponibilidade",
    fields: {
      weekday: { type: "number", label: "Dia da semana", required: true, min: 0, max: 6, options: { "0": "Domingo", "1": "Segunda-feira", "2": "Terça-feira", "3": "Quarta-feira", "4": "Quinta-feira", "5": "Sexta-feira", "6": "Sábado" } },
      start_time: { type: "time", label: "Abre às", required: true },
      end_time: { type: "time", label: "Fecha às", required: true },
    },
    order: { column: "weekday", ascending: true },
  },
  {
    id: "agendamentos.bookings",
    appId: "agendamentos",
    table: "practice_bookings",
    label: "Agendamentos",
    singular: "agendamento",
    fields: {
      customer: { type: "text", label: "Cliente", required: true, max: 60, placeholder: "Ana Costa" },
      service: { type: "text", label: "Serviço", required: true, max: 60 },
      date: { type: "date", label: "Data", required: true },
      time: { type: "time", label: "Horário", required: true },
      status: { type: "enum", label: "Situação", values: ["confirmado", "cancelado"], required: true, optionLabels: { confirmado: "Confirmado", cancelado: "Cancelado" } },
    },
    order: { column: "date", ascending: true },
  },
  {
    id: "crm.companies",
    appId: "crm",
    table: "practice_crm_companies",
    label: "Empresas",
    singular: "empresa",
    fields: {
      name: { type: "text", label: "Nome", required: true, max: 80, placeholder: "Norte Digital" },
      segment: { type: "text", label: "Segmento", required: true, max: 40, placeholder: "Tecnologia" },
      size: { type: "enum", label: "Porte", values: ["pequena", "media", "grande"], required: true, optionLabels: { pequena: "Pequena", media: "Média", grande: "Grande" } },
    },
    order: { column: "name", ascending: true },
  },
  {
    id: "crm.contacts",
    appId: "crm",
    table: "practice_crm_contacts",
    label: "Contatos",
    singular: "contato",
    fields: {
      name: { type: "text", label: "Nome", required: true, max: 80, placeholder: "Marina Costa" },
      email: { type: "text", label: "E-mail", required: true, max: 120, placeholder: "marina@empresa.com" },
      company: { type: "text", label: "Empresa", required: true, max: 80 },
      role: { type: "text", label: "Cargo", max: 60, placeholder: "Head de Produto" },
    },
    order: { column: "name", ascending: true },
  },
  {
    id: "crm.deals",
    appId: "crm",
    table: "practice_crm_deals",
    label: "Oportunidades",
    singular: "oportunidade",
    fields: {
      title: { type: "text", label: "Título", required: true, max: 80, placeholder: "Implantação do módulo fiscal" },
      company: { type: "text", label: "Empresa", required: true, max: 80 },
      amount: money("Valor"),
      stage: { type: "enum", label: "Estágio", values: ["novo", "qualificado", "proposta", "ganho", "perdido"], required: true, optionLabels: { novo: "Novo", qualificado: "Qualificado", proposta: "Proposta", ganho: "Ganho", perdido: "Perdido" } },
    },
    order: { column: "amount", ascending: false },
  },
  {
    id: "crm.activities",
    appId: "crm",
    table: "practice_crm_activities",
    label: "Atividades",
    singular: "atividade",
    fields: {
      deal: { type: "text", label: "Oportunidade", required: true, max: 80 },
      kind: { type: "enum", label: "Tipo", values: ["ligacao", "email", "reuniao"], required: true, optionLabels: { ligacao: "Ligação", email: "E-mail", reuniao: "Reunião" } },
      summary: { type: "text", label: "Resumo", required: true, max: 200, multiline: true, placeholder: "O que aconteceu nesse contato?" },
    },
    order: { column: "created_at", ascending: false },
  },
];

export function findResource(id: string) {
  return practiceResources.find((resource) => resource.id === id);
}

export function resourcesForApp(appId: PracticeAppId) {
  return practiceResources.filter((resource) => resource.appId === appId);
}

/** Valor inicial de um formulário de criação, a partir dos campos do recurso. */
export function emptyRecord(resource: PracticeResource): Record<string, string | boolean> {
  return Object.fromEntries(Object.entries(resource.fields).map(([name, spec]) => [name, spec.type === "boolean" ? false : ""]));
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
      if (spec.required) errors[name] = "Campo obrigatório.";
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
        // O input nativo devolve HH:MM:SS quando o passo inclui segundos, e o
        // Postgres devolve a mesma coisa ao ler de volta — normalizamos os dois.
        if (!timeFormat.test(String(raw).slice(0, 5))) errors[name] = "Use um horário no formato HH:MM.";
        else values[name] = String(raw).slice(0, 5);
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
