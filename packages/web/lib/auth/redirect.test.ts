import { describe, expect, test } from "bun:test";
import { safeAuthDestination } from "./redirect";

describe("retorno da autenticação", () => {
  test("preserva um caminho interno com query", () => {
    expect(safeAuthDestination("/mentoria/app?semana=2")).toBe("/mentoria/app?semana=2");
  });

  test("bloqueia redirecionamentos externos e protocol-relative", () => {
    expect(safeAuthDestination("https://example.com")).toBe("/lab");
    expect(safeAuthDestination("//example.com")).toBe("/lab");
  });

  test("bloqueia barras invertidas e caracteres de controle", () => {
    expect(safeAuthDestination("/\\example.com")).toBe("/lab");
    expect(safeAuthDestination("/lab\nLocation: https://example.com")).toBe("/lab");
  });
});

