import { describe, expect, test } from "bun:test";
import { financeTotals, type Transaction } from "./rules";
import { findResource, parseRecord } from "./resources";
import { localSeed } from "./seed";

describe("massa do Lab 101", () => {
  const transactions = localSeed("financas")["financas.transactions"] as unknown as Transaction[];

  test("carrega os 12 lançamentos e reproduz o saldo exibido", () => {
    expect(transactions).toHaveLength(12);
    expect(transactions.map((item) => item.description)).toContain("#004 · Consultoria");
    expect(transactions.map((item) => item.description)).toContain("#012 · Reembolso");
    expect(financeTotals(transactions, []).balance).toBe(1530);
  });

  test("a correção dos quatro achados produz o saldo esperado de R$ 1.730", () => {
    const corrected = transactions
      .filter((item) => !item.description.startsWith("#011") && !item.description.startsWith("#009") && !item.description.startsWith("#012"))
      .map((item) => item.description.startsWith("#007") ? { ...item, kind: "despesa" as const } : item);
    expect(financeTotals(corrected, []).balance).toBe(1730);
  });

  test("a receita negativa só passa pela validação quando o desvio está ativo", () => {
    const resource = findResource("financas.transactions")!;
    const body = { description: "Reembolso", amount: -50, kind: "receita", category: "Outros", date: "2024-01-29" };
    expect(parseRecord(resource, body).errors.amount).toContain("mínimo");
    expect(parseRecord(resource, body, { allowNegativeFinanceAmount: true }).errors.amount).toBeUndefined();
  });
});
