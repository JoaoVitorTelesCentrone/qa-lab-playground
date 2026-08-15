// Dados derivados dos ambientes de prática.
//
// Tudo que a tela mostra além da lista crua nasce aqui: totais, uso de
// orçamento, grade de horários e funil. São funções puras que recebem as flags
// ativas, então o mesmo cálculo que a interface exibe é o que o teste do aluno
// pode conferir — e o que os desvios plantados corrompem.

import { budgetUsage, financeTotals, findConflict, openStages, pipelineValue, type Booking, type Deal, type Transaction } from "./rules";
import { weekdayOf } from "./format";

// --- Finanças ---------------------------------------------------------------

export type Budget = { id: string; category: string; limit_amount: number };
export type Goal = { id: string; name: string; target_amount: number; saved_amount: number };
export type Account = { id: string; name: string; kind: string; balance: number };

export type BudgetLine = { id: string; category: string; limit: number; used: number; percent: number; exceeded: boolean };

export type FinanceSummary = {
  totals: ReturnType<typeof financeTotals>;
  budgets: BudgetLine[];
  /** Gastos por categoria, maior primeiro — inclusive categorias sem orçamento. */
  spendByCategory: Array<{ category: string; total: number }>;
  accountsTotal: number;
};

export function financeSummary(
  { transactions, budgets, accounts }: { transactions: Transaction[]; budgets: Budget[]; accounts: Account[] },
  activeBugs: string[],
): FinanceSummary {
  const lines = budgets.map((budget) => {
    const usage = budgetUsage(transactions, budget.category, Number(budget.limit_amount), activeBugs);
    return { id: budget.id, category: budget.category, limit: Number(budget.limit_amount), ...usage };
  });

  const spend = new Map<string, number>();
  for (const item of transactions) {
    if (item.kind !== "despesa") continue;
    spend.set(item.category, (spend.get(item.category) ?? 0) + Number(item.amount));
  }

  return {
    totals: financeTotals(transactions, activeBugs),
    budgets: lines,
    spendByCategory: [...spend.entries()].map(([category, total]) => ({ category, total })).sort((a, b) => b.total - a.total),
    accountsTotal: accounts.reduce((total, account) => total + Number(account.balance), 0),
  };
}

export function goalProgress(goal: Goal) {
  const target = Number(goal.target_amount);
  const saved = Number(goal.saved_amount);
  const percent = target <= 0 ? 0 : Math.min(100, Math.round((saved / target) * 100));
  return { percent, remaining: Math.max(0, target - saved), reached: saved >= target && target > 0 };
}

/** Categorias já usadas, para o formulário sugerir em vez de exigir digitação exata. */
export function knownCategories(transactions: Transaction[], budgets: Budget[]) {
  return [...new Set([...budgets.map((budget) => budget.category), ...transactions.map((item) => item.category)])].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

// --- Agendamentos -----------------------------------------------------------

export type Availability = { id: string; weekday: number; start_time: string; end_time: string };
export type Service = { id: string; name: string; duration_minutes: number; price: number };

export const slotStep = 30;

const toMinutes = (time: string) => {
  const [hour, minute] = time.slice(0, 5).split(":").map(Number);
  return hour * 60 + minute;
};

const toTime = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

/** Faixas de atendimento configuradas para o dia da semana daquela data. */
export function windowsForDate(availability: Availability[], date: string) {
  if (!date) return [];
  const weekday = weekdayOf(date);
  return availability.filter((item) => Number(item.weekday) === weekday);
}

export type Slot = { time: string; taken: Booking | null };

/**
 * Grade de horários de um dia: a cada 30 minutos dentro das faixas de
 * atendimento, marcando quais já estão ocupados. Sem faixa configurada para o
 * dia, a grade é vazia — é o estado que o cenário "estado vazio" cobra.
 */
export function slotsForDate(
  { availability, bookings }: { availability: Availability[]; bookings: Booking[] },
  date: string,
  activeBugs: string[],
): Slot[] {
  const slots: Slot[] = [];
  for (const window of windowsForDate(availability, date)) {
    for (let minute = toMinutes(window.start_time); minute < toMinutes(window.end_time); minute += slotStep) {
      const time = toTime(minute);
      slots.push({ time, taken: findConflict(bookings, { date, time }, activeBugs) });
    }
  }
  return slots.sort((a, b) => a.time.localeCompare(b.time));
}

/** Horário dentro de alguma faixa de atendimento do dia. */
export function isWithinAvailability(availability: Availability[], date: string, time: string) {
  const minute = toMinutes(time);
  return windowsForDate(availability, date).some((window) => minute >= toMinutes(window.start_time) && minute < toMinutes(window.end_time));
}

export function bookingsByDate(bookings: Booking[]) {
  const groups = new Map<string, Booking[]>();
  for (const booking of bookings) {
    groups.set(booking.date, [...(groups.get(booking.date) ?? []), booking]);
  }
  return [...groups.entries()]
    .map(([date, items]) => ({ date, items: items.sort((a, b) => a.time.localeCompare(b.time)) }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function agendaSummary(bookings: Booking[]) {
  const confirmed = bookings.filter((booking) => booking.status === "confirmado");
  return { confirmed: confirmed.length, cancelled: bookings.length - confirmed.length, days: new Set(confirmed.map((booking) => booking.date)).size };
}

// --- CRM --------------------------------------------------------------------

export const stageOrder: Deal["stage"][] = ["novo", "qualificado", "proposta", "ganho", "perdido"];

export type StageColumn = { stage: Deal["stage"]; deals: Deal[]; total: number };

export function pipelineByStage(deals: Deal[]): StageColumn[] {
  return stageOrder.map((stage) => {
    const items = deals.filter((deal) => deal.stage === stage);
    return { stage, deals: items, total: items.reduce((sum, deal) => sum + Number(deal.amount), 0) };
  });
}

export function crmSummary(deals: Deal[], activeBugs: string[]) {
  const won = deals.filter((deal) => deal.stage === "ganho");
  const lost = deals.filter((deal) => deal.stage === "perdido");
  const closed = won.length + lost.length;
  return {
    pipeline: pipelineValue(deals, activeBugs),
    open: deals.filter((deal) => openStages.includes(deal.stage)).length,
    won: won.length,
    wonValue: won.reduce((sum, deal) => sum + Number(deal.amount), 0),
    /** Percentual de negócios fechados que foram ganhos. Sem fechados, 0. */
    winRate: closed === 0 ? 0 : Math.round((won.length / closed) * 100),
  };
}
