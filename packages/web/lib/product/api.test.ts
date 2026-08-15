import { describe, expect, test } from "bun:test";
import { FieldReader, ValidationError } from "./api";

const severities = ["baixa", "media", "alta", "critica"] as const;

describe("validação da API v1", () => {
  test("aceita um corpo completo", () => {
    const body = new FieldReader({ labSlug: " desafio-001 ", result: "Total divergente", severity: "alta" });
    expect(body.text("labSlug")).toBe("desafio-001");
    expect(body.oneOf("severity", severities)).toBe("alta");
    expect(() => body.done()).not.toThrow();
  });

  test("reúne todos os campos inválidos em um erro só", () => {
    const body = new FieldReader({ result: "   " });
    body.text("labSlug");
    body.text("result");
    body.oneOf("severity", severities);
    try {
      body.done();
      throw new Error("deveria ter falhado");
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(Object.keys((error as ValidationError).details).sort()).toEqual(["labSlug", "result", "severity"]);
    }
  });

  test("campo opcional vazio não vira erro", () => {
    const body = new FieldReader({});
    expect(body.text("notes", { required: false })).toBe("");
    expect(() => body.done()).not.toThrow();
  });

  test("recusa texto acima do limite em vez de truncar em silêncio", () => {
    const body = new FieldReader({ result: "x".repeat(2001) });
    body.text("result", { max: 2000 });
    expect(() => body.done()).toThrow(ValidationError);
  });

  test("recusa tipo errado sem lançar", () => {
    const body = new FieldReader({ labSlug: 42, severity: ["alta"] });
    body.text("labSlug");
    body.oneOf("severity", severities);
    expect(() => body.done()).toThrow(ValidationError);
  });
});
