// Regras de domínio conferidas no servidor.
//
// `parseRecord` cuida do formato de cada campo; aqui ficam as regras que
// dependem do que já existe no ambiente — conflito de horário, duplicidade,
// atendimento fora da agenda. Elas rodam em `store.ts` antes de gravar, então
// não adianta o aluno burlar a interface: a API devolve 422 do mesmo jeito.
//
// Módulo puro: recebe as linhas já lidas e devolve erros por campo.

import { findConflict, type Booking } from "./rules";
import { isWithinAvailability, type Availability } from "./views";

export type DomainContext = {
  /** Linhas atuais do ambiente, indexadas pelo id do recurso. */
  rows: Record<string, Array<Record<string, unknown>>>;
  activeBugs: string[];
  /** Id do registro em edição, para ele não conflitar consigo mesmo. */
  recordId?: string;
};

export function domainErrors(resourceId: string, values: Record<string, unknown>, context: DomainContext): Record<string, string> {
  switch (resourceId) {
    case "agendamentos.bookings":
      return bookingErrors(values, context);
    case "financas.budgets":
      return unique(context, "financas.budgets", "category", values, "Já existe um orçamento para esta categoria.");
    case "financas.accounts":
      return unique(context, "financas.accounts", "name", values, "Já existe uma conta com este nome.");
    case "agendamentos.services":
      return unique(context, "agendamentos.services", "name", values, "Já existe um serviço com este nome.");
    case "crm.contacts":
      return unique(context, "crm.contacts", "email", values, "Já existe um contato com este e-mail.");
    case "crm.companies":
      return unique(context, "crm.companies", "name", values, "Já existe uma empresa com este nome.");
    default:
      return {};
  }
}

function bookingErrors(values: Record<string, unknown>, context: DomainContext): Record<string, string> {
  const date = String(values.date ?? "");
  const time = String(values.time ?? "").slice(0, 5);
  if (!date || !time) return {};

  // Um agendamento cancelado não disputa horário — cancelar é justamente como
  // o aluno libera a agenda.
  if (values.status === "cancelado") return {};

  const availability = (context.rows["agendamentos.availability"] ?? []) as unknown as Availability[];
  if (availability.length > 0 && !isWithinAvailability(availability, date, time)) {
    return { time: "Horário fora das faixas de atendimento configuradas para este dia." };
  }

  const bookings = (context.rows["agendamentos.bookings"] ?? []) as unknown as Booking[];
  const conflict = findConflict(bookings, { date, time, id: context.recordId, customer: String(values.customer ?? "") }, context.activeBugs);
  return conflict ? { time: `Horário já ocupado por ${conflict.customer} (${conflict.service}).` } : {};
}

/** Erro de duplicidade em um campo que deveria ser único dentro do ambiente. */
function unique(context: DomainContext, resourceId: string, field: string, values: Record<string, unknown>, message: string): Record<string, string> {
  const candidate = normalize(values[field]);
  if (!candidate) return {};
  const taken = (context.rows[resourceId] ?? []).some((row) => String(row.id) !== context.recordId && normalize(row[field]) === candidate);
  return taken ? { [field]: message } : {};
}

const normalize = (value: unknown) => String(value ?? "").trim().toLowerCase();
