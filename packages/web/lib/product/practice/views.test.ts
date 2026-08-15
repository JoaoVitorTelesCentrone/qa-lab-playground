import { describe, expect, test } from "bun:test";
import { activitiesByKind, agendaSummary, bookingsByDate, crmSummary, financeSummary, funnelByStage, goalProgress, isWithinAvailability, knownCategories, pipelineByStage, slotsForDate, valueByCompany, windowsForDate } from "./views";
import type { Booking, Deal, Transaction } from "./rules";

const transactions: Transaction[] = [
  { id: "1", description: "Salário", amount: 6800, kind: "receita", category: "Trabalho", date: "2026-08-05", recurring: true },
  { id: "2", description: "Aluguel", amount: 1850, kind: "despesa", category: "Moradia", date: "2026-08-08", recurring: true },
  { id: "3", description: "Mercado", amount: 430, kind: "despesa", category: "Alimentação", date: "2026-08-10", recurring: false },
];

const budgets = [
  { id: "b1", category: "Moradia", limit_amount: 1000 },
  { id: "b2", category: "Alimentação", limit_amount: 900 },
];

const accounts = [{ id: "a1", name: "Corrente", kind: "corrente", balance: 100 }, { id: "a2", name: "Poupança", kind: "poupanca", balance: 50 }];

describe("finanças", () => {
  test("soma receitas, despesas e saldo sem desvio ativo", () => {
    const { totals } = financeSummary({ transactions, budgets, accounts }, []);
    expect(totals.income).toBe(6800);
    expect(totals.expense).toBe(2280);
    expect(totals.balance).toBe(4520);
  });

  test("o desvio de recorrentes derruba a despesa recorrente do total", () => {
    const { totals } = financeSummary({ transactions, budgets, accounts }, ["financas.total-ignora-recorrente"]);
    expect(totals.expense).toBe(430);
  });

  test("marca o orçamento estourado e mantém o dentro do limite", () => {
    const { budgets: lines } = financeSummary({ transactions, budgets, accounts }, []);
    expect(lines.find((line) => line.category === "Moradia")?.exceeded).toBe(true);
    expect(lines.find((line) => line.category === "Alimentação")?.exceeded).toBe(false);
  });

  test("o desvio do alerta impede o estouro de ser sinalizado", () => {
    const { budgets: lines } = financeSummary({ transactions, budgets, accounts }, ["financas.orcamento-sem-alerta"]);
    expect(lines.every((line) => line.exceeded === false)).toBe(true);
  });

  test("gasto por categoria vem do maior para o menor e ignora receitas", () => {
    const { spendByCategory } = financeSummary({ transactions, budgets, accounts }, []);
    expect(spendByCategory.map((item) => item.category)).toEqual(["Moradia", "Alimentação"]);
  });

  test("soma o saldo das contas", () => {
    expect(financeSummary({ transactions, budgets, accounts }, []).accountsTotal).toBe(150);
  });

  test("progresso da meta satura em 100% e não fica negativo", () => {
    expect(goalProgress({ id: "g", name: "Meta", target_amount: 1000, saved_amount: 1500 })).toEqual({ percent: 100, remaining: 0, reached: true });
    expect(goalProgress({ id: "g", name: "Meta", target_amount: 0, saved_amount: 0 }).percent).toBe(0);
  });

  test("categorias conhecidas juntam orçamentos e lançamentos sem repetir", () => {
    expect(knownCategories(transactions, budgets)).toEqual(["Alimentação", "Moradia", "Trabalho"]);
  });
});

// 2026-08-18 é uma terça-feira; 2026-08-16, um domingo.
const availability = [
  { id: "d1", weekday: 2, start_time: "09:00", end_time: "11:00" },
  { id: "d2", weekday: 6, start_time: "09:00", end_time: "10:00" },
];

const bookings: Booking[] = [
  { id: "1", customer: "Ana", service: "Consulta", date: "2026-08-18", time: "10:00", status: "confirmado" },
  { id: "2", customer: "Bruno", service: "Retorno", date: "2026-08-18", time: "09:30", status: "cancelado" },
];

describe("agendamentos", () => {
  test("faixas do dia vêm do dia da semana da data", () => {
    expect(windowsForDate(availability, "2026-08-18")).toHaveLength(1);
    expect(windowsForDate(availability, "2026-08-16")).toHaveLength(0);
  });

  test("a grade cobre a faixa de 30 em 30 minutos", () => {
    expect(slotsForDate({ availability, bookings }, "2026-08-18", []).map((slot) => slot.time)).toEqual(["09:00", "09:30", "10:00", "10:30"]);
  });

  test("dia sem faixa configurada tem grade vazia", () => {
    expect(slotsForDate({ availability, bookings }, "2026-08-16", [])).toEqual([]);
  });

  test("só o horário confirmado aparece ocupado", () => {
    const slots = slotsForDate({ availability, bookings }, "2026-08-18", []);
    expect(slots.find((slot) => slot.time === "10:00")?.taken?.customer).toBe("Ana");
    expect(slots.find((slot) => slot.time === "09:30")?.taken).toBeNull();
  });

  test("o desvio de cancelado faz o horário liberado parecer ocupado", () => {
    const slots = slotsForDate({ availability, bookings }, "2026-08-18", ["agendamentos.cancelado-ocupa-horario"]);
    expect(slots.find((slot) => slot.time === "09:30")?.taken?.customer).toBe("Bruno");
  });

  test("o desvio de conflito faz a grade mostrar o horário ocupado como livre", () => {
    const slots = slotsForDate({ availability, bookings }, "2026-08-18", ["agendamentos.conflito-permitido"]);
    expect(slots.every((slot) => slot.taken === null)).toBe(true);
  });

  test("horário fora da faixa não está disponível", () => {
    expect(isWithinAvailability(availability, "2026-08-18", "09:00")).toBe(true);
    expect(isWithinAvailability(availability, "2026-08-18", "11:00")).toBe(false);
    expect(isWithinAvailability(availability, "2026-08-16", "09:00")).toBe(false);
  });

  test("agrupa por data e ordena por horário", () => {
    const groups = bookingsByDate([...bookings, { id: "3", customer: "Carla", service: "Consulta", date: "2026-08-17", time: "08:00", status: "confirmado" }]);
    expect(groups.map((group) => group.date)).toEqual(["2026-08-17", "2026-08-18"]);
    expect(groups[1].items.map((item) => item.time)).toEqual(["09:30", "10:00"]);
  });

  test("resumo separa confirmados de cancelados", () => {
    expect(agendaSummary(bookings)).toEqual({ confirmed: 1, cancelled: 1, days: 1 });
  });
});

const deals: Deal[] = [
  { id: "1", title: "A", company: "X", amount: 1000, stage: "novo" },
  { id: "2", title: "B", company: "X", amount: 2000, stage: "ganho" },
  { id: "3", title: "C", company: "Y", amount: 500, stage: "perdido" },
];

describe("crm", () => {
  test("o funil tem uma coluna por estágio, na ordem do processo", () => {
    expect(pipelineByStage(deals).map((column) => column.stage)).toEqual(["novo", "qualificado", "proposta", "ganho", "perdido"]);
    expect(pipelineByStage(deals).find((column) => column.stage === "novo")?.total).toBe(1000);
  });

  test("o pipeline exclui perdidos e a taxa de ganho considera só os fechados", () => {
    const summary = crmSummary(deals, []);
    expect(summary.pipeline).toBe(3000);
    expect(summary.winRate).toBe(50);
    expect(summary.wonValue).toBe(2000);
  });

  test("o desvio do pipeline soma a oportunidade perdida", () => {
    expect(crmSummary(deals, ["crm.pipeline-soma-perdidos"]).pipeline).toBe(3500);
  });

  test("sem negócio fechado a taxa de ganho é zero, não divisão por zero", () => {
    expect(crmSummary([deals[0]], []).winRate).toBe(0);
  });

  test("o funil não inclui perdido: perdido é saída, não etapa", () => {
    expect(funnelByStage(deals).map((item) => item.stage)).toEqual(["novo", "qualificado", "proposta", "ganho"]);
    expect(funnelByStage(deals).reduce((sum, item) => sum + item.count, 0)).toBe(2);
  });

  test("valor por empresa soma as oportunidades vivas, maior primeiro", () => {
    expect(valueByCompany(deals)).toEqual([{ company: "X", total: 3000 }]);
  });

  test("perdidas e ticket médio das abertas entram no resumo", () => {
    const summary = crmSummary(deals, []);
    expect(summary.lost).toBe(1);
    expect(summary.lostValue).toBe(500);
    expect(summary.averageOpen).toBe(1000);
  });

  test("sem oportunidade aberta o ticket médio é zero", () => {
    expect(crmSummary([deals[1]], []).averageOpen).toBe(0);
  });

  test("atividades por tipo contam e ordenam da mais frequente", () => {
    const activities = [
      { id: "1", deal: "A", kind: "email", summary: "" },
      { id: "2", deal: "A", kind: "reuniao", summary: "" },
      { id: "3", deal: "B", kind: "email", summary: "" },
    ];
    expect(activitiesByKind(activities)).toEqual([{ kind: "email", total: 2 }, { kind: "reuniao", total: 1 }]);
  });
});
