import { describe, expect, test } from "bun:test";
import { domainErrors, type DomainContext } from "./domain";

// 2026-08-18 é terça-feira.
const rows = {
  "agendamentos.availability": [{ id: "d1", weekday: 2, start_time: "09:00", end_time: "18:00" }],
  "agendamentos.bookings": [
    { id: "1", customer: "Ana Costa", service: "Consulta inicial", date: "2026-08-18", time: "10:00", status: "confirmado" },
    { id: "2", customer: "Bruno Dias", service: "Retorno", date: "2026-08-18", time: "11:00", status: "cancelado" },
  ],
  "financas.budgets": [{ id: "b1", category: "Moradia", limit_amount: 2200 }],
  "crm.contacts": [{ id: "c1", name: "Marina", email: "marina@nortedigital.com", company: "Norte Digital" }],
};

const context = (extra: Partial<DomainContext> = {}): DomainContext => ({ rows, activeBugs: [], ...extra });

const booking = (values: Record<string, unknown>) => ({ customer: "Novo", service: "Consulta inicial", date: "2026-08-18", time: "10:00", status: "confirmado", ...values });

describe("regras de domínio no servidor", () => {
  test("recusa agendamento em horário já ocupado", () => {
    expect(domainErrors("agendamentos.bookings", booking({}), context()).time).toContain("Ana Costa");
  });

  test("aceita o mesmo horário em outro dia", () => {
    expect(domainErrors("agendamentos.bookings", booking({ date: "2026-08-25" }), context())).toEqual({});
  });

  test("o desvio de conflito deixa outro cliente ocupar o mesmo horário", () => {
    expect(domainErrors("agendamentos.bookings", booking({}), context({ activeBugs: ["agendamentos.conflito-permitido"] })).time).toBeUndefined();
  });

  test("com o desvio ativo, repetir o mesmo cliente ainda é barrado", () => {
    expect(domainErrors("agendamentos.bookings", booking({ customer: "Ana Costa" }), context({ activeBugs: ["agendamentos.conflito-permitido"] })).time).toContain("já ocupado");
  });

  test("horário liberado por cancelamento volta a ser agendável", () => {
    expect(domainErrors("agendamentos.bookings", booking({ time: "11:00" }), context())).toEqual({});
  });

  test("o desvio de cancelado mantém o horário bloqueado", () => {
    expect(domainErrors("agendamentos.bookings", booking({ time: "11:00" }), context({ activeBugs: ["agendamentos.cancelado-ocupa-horario"] })).time).toContain("Bruno Dias");
  });

  test("recusa horário fora da faixa de atendimento", () => {
    expect(domainErrors("agendamentos.bookings", booking({ time: "20:00" }), context()).time).toContain("fora das faixas");
  });

  test("recusa dia sem atendimento configurado", () => {
    expect(domainErrors("agendamentos.bookings", booking({ date: "2026-08-16", time: "10:00" }), context()).time).toContain("fora das faixas");
  });

  test("cancelar não dispara conflito nem faixa de atendimento", () => {
    expect(domainErrors("agendamentos.bookings", booking({ status: "cancelado", time: "20:00" }), context())).toEqual({});
  });

  test("editar o próprio agendamento não conflita consigo mesmo", () => {
    expect(domainErrors("agendamentos.bookings", booking({ customer: "Ana Costa" }), context({ recordId: "1" }))).toEqual({});
  });

  test("recusa orçamento duplicado, ignorando caixa e espaços", () => {
    expect(domainErrors("financas.budgets", { category: " moradia " }, context()).category).toContain("Já existe");
    expect(domainErrors("financas.budgets", { category: "Lazer" }, context())).toEqual({});
  });

  test("recusa contato com e-mail repetido", () => {
    expect(domainErrors("crm.contacts", { email: "MARINA@nortedigital.com" }, context()).email).toContain("Já existe");
  });

  test("recurso sem regra própria não inventa erro", () => {
    expect(domainErrors("financas.transactions", { description: "Qualquer" }, context())).toEqual({});
  });
});
