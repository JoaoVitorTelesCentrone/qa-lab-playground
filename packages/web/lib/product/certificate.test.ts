import { describe, expect, test } from "bun:test";
import { labs } from "@/lib/playground/catalog";
import type { LabProgress, Submission } from "./journey";
import { buildTrackProgress, findTrack } from "./tracks";
import { certificateCode, certificateLinkedInPost, certificateStats, eligibility, isCertificateCode, linkedInCredentialFields, type Certificate } from "./certificate";

// financas-do-zero é a única trilha com Labs liberados (101, 103 e 105) no
// lançamento enxuto — ver [[qa-lab-lancamento-enxuto]].
const track = findTrack("financas-do-zero")!;
const releasedNumbers = track.labNumbers.filter((number) => labs.find((lab) => lab.number === number)?.status === "liberado");

function progress(numbers: number[]): LabProgress[] {
  return numbers.map((number) => ({
    lab: labs.find((item) => item.number === number)!,
    status: "completed" as const,
    submissions: 1,
    updatedAt: "2026-08-15T10:00:00.000Z",
  }));
}

function submission(number: number, media?: string): Submission {
  return {
    id: `sub-${number}-${media ?? "texto"}`,
    labSlug: labs.find((item) => item.number === number)!.slug,
    evidence: "resultado observado na tela",
    attachments: media
      ? [{ name: "prova", url: "https://storage.test/prova", path: `p-${number}-${media}`, size: 10, type: media }]
      : [],
    published: false,
    createdAt: "2026-08-15T10:00:00.000Z",
  };
}

describe("elegibilidade do certificado", () => {
  test("Labs agendados não travam a emissão", () => {
    const complete = buildTrackProgress(track, progress(releasedNumbers));
    const result = eligibility(complete);
    expect(result.required).toBe(releasedNumbers.length);
    expect(result.required).toBeLessThan(track.labNumbers.length);
    expect(result.eligible).toBe(true);
    expect(result.missing).toBe(0);
  });

  test("faltando um Lab liberado, não emite", () => {
    const partial = buildTrackProgress(track, progress(releasedNumbers.slice(0, -1)));
    const result = eligibility(partial);
    expect(result.eligible).toBe(false);
    expect(result.missing).toBe(1);
  });

  test("trilha sem nenhum Lab liberado nunca é elegível", () => {
    const outra = findTrack("funil-comercial")!;
    expect(eligibility(buildTrackProgress(outra, [])).eligible).toBe(false);
  });
});

describe("estatísticas do certificado", () => {
  test("só conta evidências dos Labs da trilha", () => {
    const complete = buildTrackProgress(track, progress(releasedNumbers));
    const stats = certificateStats(track, complete, [
      submission(releasedNumbers[0], "video/mp4"),
      submission(releasedNumbers[0]),
      submission(releasedNumbers[1], "image/png"),
      submission(1, "image/png"), // Lab de outra trilha
    ]);
    expect(stats.evidence).toBe(3);
    expect(stats.labs).toBe(releasedNumbers.length);
    expect(stats.attachments).toBe(2);
    // Dois Labs da trilha têm mídia; o terceiro anexo é de outra trilha e não conta.
    expect(stats.withMedia).toBe(2);
  });
});

describe("código verificável", () => {
  test("o formato é estável e sem caracteres ambíguos", () => {
    const code = certificateCode(() => 0.5);
    expect(isCertificateCode(code)).toBe(true);
    expect(code).toMatch(/^QAL-\w{4}-\w{4}$/);
    expect(code).not.toMatch(/[IO01]/);
  });

  test("códigos diferentes para sorteios diferentes", () => {
    const codes = new Set(Array.from({ length: 200 }, () => certificateCode()));
    expect(codes.size).toBeGreaterThan(190);
  });

  test("recusa entrada que não é código", () => {
    expect(isCertificateCode("QAL-0000-0000")).toBe(false);
    expect(isCertificateCode("qualquer coisa")).toBe(false);
  });
});

describe("texto para o LinkedIn", () => {
  const certificate: Certificate = {
    code: "QAL-ABCD-2345",
    trackSlug: track.slug,
    trackName: track.name,
    holderName: "Ana Ribeiro",
    objective: track.objective,
    outcome: track.outcome,
    labs: 3,
    evidence: 4,
    issuedAt: "2026-08-18T10:00:00.000Z",
  };

  test("o post cita o código, o link e o que a trilha treina", () => {
    const post = certificateLinkedInPost(certificate, "https://exemplo.test/certificado/QAL-ABCD-2345");
    expect(post).toContain("QAL-ABCD-2345");
    expect(post).toContain("https://exemplo.test/certificado/QAL-ABCD-2345");
    expect(post).toContain(track.outcome);
    expect(post.length).toBeLessThan(3000);
  });

  test("os campos da credencial saem prontos para o formulário do LinkedIn", () => {
    const fields = linkedInCredentialFields(certificate, "https://exemplo.test/c");
    expect(fields.credentialId).toBe("QAL-ABCD-2345");
    expect(fields.name).toContain(track.name);
    expect(fields.organization).toBe("QA Lab Playground");
  });
});
