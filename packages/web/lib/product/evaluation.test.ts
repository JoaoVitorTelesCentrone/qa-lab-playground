import { describe, expect, test } from "bun:test";
import { evaluateEvidence, MIN_LENGTH } from "./evaluation";

const long = "x".repeat(MIN_LENGTH);

describe("avaliação automática da evidência", () => {
  test("aprova texto com substância e nenhum anexo", () => {
    const evaluation = evaluateEvidence({ evidence: long, attachments: 0 });
    expect(evaluation.passed).toBe(true);
    expect(evaluation.issues).toHaveLength(0);
  });

  test("reprova entrega sem texto e sem anexo", () => {
    const evaluation = evaluateEvidence({ evidence: "", attachments: 0 });
    expect(evaluation.passed).toBe(false);
    expect(evaluation.issues[0].field).toBe("evidence");
  });

  test("espaço em branco não conta como texto", () => {
    expect(evaluateEvidence({ evidence: " ".repeat(MIN_LENGTH + 5), attachments: 0 }).passed).toBe(false);
  });

  test("texto curto sozinho não passa", () => {
    expect(evaluateEvidence({ evidence: "x".repeat(MIN_LENGTH - 1), attachments: 0 }).passed).toBe(false);
  });

  // A regra que justifica o campo livre: um vídeo de reprodução é evidência
  // legítima, e exigir redação em cima dele só criaria burocracia.
  test("anexo sozinho vale como entrega", () => {
    expect(evaluateEvidence({ evidence: "", attachments: 1 }).passed).toBe(true);
  });

  test("texto curto passa quando vem acompanhado de anexo", () => {
    expect(evaluateEvidence({ evidence: "Vídeo da repro", attachments: 1 }).passed).toBe(true);
  });
});
