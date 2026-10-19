import { describe, expect, test } from "bun:test";
import { isOwnEvidencePath, validateEvidenceAttachments } from "./evidence-attachments";

const owner = "11111111-1111-4111-8111-111111111111";
const other = "22222222-2222-4222-8222-222222222222";
const lab = "desafio-101";
const file = "33333333-3333-4333-8333-333333333333.pdf";
const attachment = (path: string) => ({ name: "prova.pdf", path, url: "https://untrusted.example/file", size: 123, type: "application/pdf" });

describe("anexos de evidência", () => {
  test("aceita só o caminho gerado para o usuário e o Lab, sem guardar URL do cliente", () => {
    expect(validateEvidenceAttachments([attachment(`${owner}/${lab}/${file}`)], owner, lab)).toEqual([
      { ...attachment(`${owner}/${lab}/${file}`), url: "" },
    ]);
  });

  test("recusa caminho de outro usuário, de outro Lab e caminho forjado", () => {
    for (const path of [`${other}/${lab}/${file}`, `${owner}/outro-lab/${file}`, `${owner}/${lab}/../${file}`]) {
      expect(isOwnEvidencePath(path, owner, lab)).toBe(false);
      expect(validateEvidenceAttachments([attachment(path)], owner, lab)).toBeNull();
    }
  });

  test("recusa item malformado sem descartá-lo silenciosamente", () => {
    expect(validateEvidenceAttachments([{}], owner, lab)).toBeNull();
    expect(validateEvidenceAttachments("invalido", owner, lab)).toBeNull();
  });
});
