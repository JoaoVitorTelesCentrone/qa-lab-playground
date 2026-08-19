import { describe, expect, test } from "bun:test";
import { labs } from "@/lib/playground/catalog";
import { systemChallenges } from "@/lib/system-challenges";
import type { Attachment, Submission } from "./journey";
import { attachmentKind, buildCase, caseSkills, headline, linkedInPost } from "./case";

const lab = labs.find((item) => item.number === 101)!;
const challenge = systemChallenges.find((item) => item.number === 101)!;

const file = (overrides: Partial<Attachment> = {}): Attachment => ({
  name: "print.png",
  url: "https://storage.test/print.png",
  path: "user/lab/print.png",
  size: 1024,
  type: "image/png",
  ...overrides,
});

function submission(overrides: Partial<Submission> = {}): Submission {
  return {
    id: "sub-1",
    labSlug: lab.slug,
    evidence: "O saldo do período exibe 5.502,80 enquanto a soma dos lançamentos listados dá outro valor. Reproduz com o filtro de agosto aplicado.",
    attachments: [],
    published: false,
    createdAt: "2026-08-15T12:00:00.000Z",
    ...overrides,
  };
}

describe("case de QA", () => {
  test("junta evidência e briefing do Lab", () => {
    const item = buildCase(submission(), lab, challenge)!;
    expect(item.labNumber).toBe(101);
    expect(item.title).toBe(lab.title);
    expect(item.objective).toBe(challenge.objective);
    expect(item.expected).toBe(challenge.expected);
  });

  test("Lab fora do catálogo não vira case", () => {
    expect(buildCase(submission(), undefined, challenge)).toBeNull();
    expect(buildCase(submission(), lab, undefined)).toBeNull();
  });

  // O roteiro e os critérios agora vêm do Lab, não de campos que o aluno
  // preencheu — é o que sustenta o case depois que a entrega virou texto livre.
  test("roteiro e critérios vêm do briefing do Lab", () => {
    const item = buildCase(submission(), lab, challenge)!;
    expect(item.labSteps).toEqual(challenge.steps);
    expect(item.criteria).toEqual(challenge.acceptance);
  });

  test("a manchete é a primeira frase, truncada", () => {
    const item = buildCase(submission({ evidence: `${"a".repeat(300)}. Segunda frase.` }), lab, challenge)!;
    expect(headline(item).length).toBeLessThanOrEqual(180);
    expect(headline(item).endsWith("…")).toBe(true);
  });

  test("uma frase curta demais não vira manchete sozinha", () => {
    const item = buildCase(submission({ evidence: "Deu erro. O saldo do período veio 200 reais acima da soma dos lançamentos." }), lab, challenge)!;
    expect(headline(item)).toContain("saldo do período");
  });

  test("entrega só com anexo ainda produz manchete", () => {
    const item = buildCase(submission({ evidence: "", attachments: [file(), file({ path: "b" })] }), lab, challenge)!;
    expect(headline(item)).toContain("2 arquivo(s)");
  });

  test("as competências só listam o que a entrega comprova", () => {
    const comVideo = caseSkills(buildCase(submission({ attachments: [file({ type: "video/mp4" })] }), lab, challenge)!);
    expect(comVideo).toContain("Evidência em vídeo");

    const comImagem = caseSkills(buildCase(submission({ attachments: [file()] }), lab, challenge)!);
    expect(comImagem).toContain("Evidência visual");
    expect(comImagem).not.toContain("Evidência em vídeo");

    const magro = caseSkills(buildCase(submission({ evidence: "Deu ruim." }), lab, challenge)!);
    expect(magro).not.toContain("Evidência visual");
    expect(magro).not.toContain("Relato reproduzível");

    const longo = caseSkills(buildCase(submission({ evidence: "x".repeat(400) }), lab, challenge)!);
    expect(longo).toContain("Relato reproduzível");
  });

  test("classifica o anexo por tipo para decidir como renderizar", () => {
    expect(attachmentKind("image/png")).toBe("image");
    expect(attachmentKind("video/webm")).toBe("video");
    expect(attachmentKind("application/pdf")).toBe("file");
  });

  test("o post traz link, critérios e a contagem de anexos", () => {
    const item = buildCase(submission({ attachments: [file()] }), lab, challenge)!;
    const post = linkedInPost(item, { name: "Ana", url: "https://exemplo.test/case" });
    expect(post).toContain("https://exemplo.test/case");
    expect(post).toContain("1 evidência(s) anexada(s)");
    expect(post).toContain(challenge.acceptance[0]);
  });

  test("o post cabe no limite de caracteres do LinkedIn", () => {
    const item = buildCase(submission({ evidence: "x".repeat(3000) }), lab, challenge)!;
    expect(linkedInPost(item, { name: "Ana", url: "https://exemplo.test/case" }).length).toBeLessThan(3000);
  });
});
