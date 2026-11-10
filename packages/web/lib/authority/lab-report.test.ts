import { describe, expect, test } from "bun:test";
import { SITE_URL } from "@/content/site";
import { emptyDelivery } from "@/lib/product/delivery";
import { labReportMarkdown, playgroundReportMarkdown, reportFileName } from "./lab-report";

const date = new Date("2026-11-09T12:00:00Z");

describe("relatório em Markdown", () => {
  test("Lab numerado: campos da entrega, conclusão com severidade e autoria", () => {
    const md = labReportMarkdown({ label: "01", title: "Captura", path: "/labs/101", date, notes: "anotação",
      fields: { ...emptyDelivery, did: "1. Abri", expected: "Salvar", observed: "Sumiu", conclusion: "falha", severity: "alta" } });
    expect(md).toStartWith("# Lab 01: Captura");
    expect(md).toContain(`- Lab: ${SITE_URL}/labs/101`);
    expect(md).toContain("## What happened\n\nSumiu");
    expect(md).toContain("Encontrei uma falha · severity: Alta");
    expect(md).toContain("## Notes\n\nanotação");
    expect(md).toContain("built by João Centrone");
  });

  test("campos vazios aparecem marcados, não somem", () => {
    const md = labReportMarkdown({ label: "02", title: "X", path: "/labs/102", date, fields: emptyDelivery });
    expect(md).toContain("## What I expected\n\n_(not filled in)_");
    expect(md).not.toContain("## Notes");
  });

  test("playground registra o modo do Lab", () => {
    expect(playgroundReportMarkdown({ title: "Login", url: "/labs/login?bug=1", bug: "locked-message", date })).toContain("Mode: bug mode on (`locked-message`)");
    expect(playgroundReportMarkdown({ title: "Login", url: "/labs/login", bug: null, date })).toContain("Mode: correct mode");
  });

  test("nome de arquivo sem acento nem espaço", () => {
    expect(reportFileName("lab-01", "Investigar a captura e a retomada!")).toBe("lab-01-investigar-a-captura-e-a-retomada.md");
  });
});
