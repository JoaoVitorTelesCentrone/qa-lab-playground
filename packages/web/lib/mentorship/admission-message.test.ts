import { describe, expect, test } from "bun:test";
import { admissionDecisionMessage } from "./admission-message";

describe("admission decision messages", () => {
  test("gives each decision a clear status and next step", () => {
    expect(admissionDecisionMessage("confirmed").href).toBe("/mentoria/diagnostico");
    expect(admissionDecisionMessage("waitlisted").body).toContain("não há uma vaga confirmada");
    expect(admissionDecisionMessage("rejected").body).toContain("não altera seu acesso ao QA Lab");
  });
});
