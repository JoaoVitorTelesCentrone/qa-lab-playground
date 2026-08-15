// Regras de negócio dos ambientes de prática.
//
// Funções puras compartilhadas entre servidor e interface. Cada uma recebe as
// flags ativas e degrada o próprio comportamento quando o bug correspondente
// está ligado — é assim que o bug plantado vira reproduzível de verdade, em
// vez de um aviso na tela.

import { isBugActive } from "./bugs";

export type Transaction = { id: string; description: string; amount: number; kind: "receita" | "despesa"; category: string; date: string; recurring: boolean };
export type Booking = { id: string; customer: string; service: string; date: string; time: string; status: "confirmado" | "cancelado" };
export type Deal = { id: string; title: string; company: string; amount: number; stage: "novo" | "qualificado" | "proposta" | "ganho" | "perdido" };
export type Contact = { id: string; name: string; email: string; company: string; role?: string | null };

// --- Finanças ---------------------------------------------------------------

export type FinanceTotals = { income: number; expense: number; balance: number };

export function financeTotals(transactions: Transaction[], activeBugs: string[]): FinanceTotals {
  // Bug plantado: o filtro de recorrentes some com parte das despesas do total,
  // então o saldo não bate com a soma da lista exibida.
  const dropsRecurring = isBugActive(activeBugs, "financas.total-ignora-recorrente");
  const income = sum(transactions.filter((item) => item.kind === "receita"));
  const expense = sum(transactions.filter((item) => item.kind === "despesa" && !(dropsRecurring && item.recurring)));
  return { income, expense, balance: income - expense };
}

export function budgetUsage(transactions: Transaction[], category: string, limit: number, activeBugs: string[]) {
  const used = sum(transactions.filter((item) => item.kind === "despesa" && item.category === category));
  const percent = limit === 0 ? 0 : Math.round((used / limit) * 100);
  // Bug plantado: o alerta compara com 0 em vez do limite, então nunca dispara.
  const threshold = isBugActive(activeBugs, "financas.orcamento-sem-alerta") ? Number.POSITIVE_INFINITY : limit;
  return { used, percent, exceeded: used > threshold };
}

const sum = (items: Array<{ amount: number }>) => items.reduce((total, item) => total + Number(item.amount), 0);

// --- Agendamentos -----------------------------------------------------------

/** Agendamento existente que ocupa o mesmo horário, ou null quando está livre. */
export function findConflict(bookings: Booking[], candidate: { date: string; time: string; id?: string }, activeBugs: string[]): Booking | null {
  // Bug plantado 1: a comparação ignora a data, então qualquer horário repetido
  // no calendário inteiro parece conflito — e datas diferentes se bloqueiam.
  const ignoresDate = isBugActive(activeBugs, "agendamentos.conflito-permitido");
  // Bug plantado 2: cancelados continuam ocupando o horário.
  const ignoresStatus = isBugActive(activeBugs, "agendamentos.cancelado-ocupa-horario");

  return bookings.find((booking) =>
    booking.id !== candidate.id
    && (ignoresStatus || booking.status === "confirmado")
    && booking.time === candidate.time
    && (ignoresDate ? true : booking.date === candidate.date),
  ) ?? null;
}

// --- CRM --------------------------------------------------------------------

export const openStages: Deal["stage"][] = ["novo", "qualificado", "proposta"];

export function pipelineValue(deals: Deal[], activeBugs: string[]) {
  // Bug plantado: soma todos os estágios, inclusive os perdidos, então marcar
  // uma oportunidade como perdida não muda o total.
  const countsLost = isBugActive(activeBugs, "crm.pipeline-soma-perdidos");
  return deals.filter((deal) => countsLost || deal.stage !== "perdido").reduce((total, deal) => total + Number(deal.amount), 0);
}

const fold = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function searchContacts(contacts: Contact[], query: string, activeBugs: string[]) {
  const term = query.trim();
  if (!term) return contacts;
  // Bug plantado: compara sem normalizar acentuação, então "Antonio" não acha
  // "Antônio". A busca sã normaliza os dois lados.
  const normalize = isBugActive(activeBugs, "crm.busca-ignora-acentos") ? (value: string) => value.toLowerCase() : fold;
  const needle = normalize(term);
  return contacts.filter((contact) => [contact.name, contact.email, contact.company].some((field) => normalize(field).includes(needle)));
}
