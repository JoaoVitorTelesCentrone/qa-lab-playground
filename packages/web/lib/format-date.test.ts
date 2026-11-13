import { describe, expect, test } from "bun:test";
import { formatDate, formatShortDate } from "./format-date";

describe("formatação de datas editoriais", () => {
  test("data longa em pt-BR", () => {
    expect(formatDate("2026-10-28")).toBe("28 de outubro de 2026");
  });

  test("data curta dos cards", () => {
    expect(formatShortDate("2026-10-28")).toBe("28 out 2026");
  });

  test("data fora do formato volta como veio", () => {
    expect(formatShortDate("sem-data")).toBe("sem-data");
  });
});
