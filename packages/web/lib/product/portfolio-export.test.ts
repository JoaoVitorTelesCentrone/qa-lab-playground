import { describe, expect, test } from "bun:test";
import type { Portfolio } from "./portfolio";
import type { PortfolioEntry } from "./portfolio-format";
import { buildPortfolioExport, portfolioReadme, portfolioLinkedInPost, portfolioHtml, LINKEDIN_POST_LIMIT } from "./portfolio-export";

const entry: PortfolioEntry = {
  id: "case-1", labSlug: "checkout", evidence: "Comparei o total com a regra de desconto.", published: true, createdAt: "2026-10-24T10:00:00Z",
  labTitle: "Checkout", labNumber: 1, labLabel: "01", labArea: "Checkout", labMode: "investigacao", projectId: "qa-lab",
  portfolioCase: { title: "Desconto no checkout", context: "Compra com cupom", approach: "Comparação com oráculo", findings: "Valor incorreto", decision: "Bloquear a entrega", reflection: "Validar arredondamento" },
  attachments: [{ name: "prova.png", url: "https://storage.test/signed?token=secret", path: "private-owner/checkout/prova.png", size: 42, type: "image/png" }],
};
const stats = { evidences: 1, bugs: 1, labs: 1, documented: 1, domains: 1 };
const portfolio: Portfolio = {
  username: "ana-qa", name: "Ana", role: "QA", headline: "Qualidade em cada entrega", bio: "Trabalho com testes exploratórios.", linkedin: "https://linkedin.com/in/ana", github: "https://github.com/ana",
  entries: [entry, { ...entry, id: "private", published: false, evidence: "PRIVATE DRAFT" }], featuredSubmissionIds: [entry.id, "private"], stats, skills: ["Teste exploratório"],
  sections: [{ id: "s1", title: "Formação", body: "Análise de sistemas", visible: true, position: 0 }, { id: "s2", title: "Oculto", body: "PRIVATE SECTION", visible: false, position: 1 }],
  projects: [{ id: "project-1", name: "Minha loja", source: "pessoal", summary: "Validação do checkout", role: "Analista de QA", period: "2026", route: "", tags: ["Exploração"], entries: [entry], stats, links: ["https://github.com/ana/loja", "javascript:alert(1)"], media: entry.attachments }],
  mentorshipCases: [{ id: "mentoria-1", submissionId: "internal-submission", userId: "private-owner", title: "Projeto final", summary: "Fluxo completo", evidence: "Relatório final", repositoryUrl: "https://github.com/ana/final", reportUrl: null, published: true, createdAt: "", updatedAt: "" }],
};

describe("exportação do portfólio", () => {
  test("exporta apenas conteúdo público e links duráveis, sem caminhos e tokens do Storage", () => {
    const data = buildPortfolioExport(portfolio, "https://qa.test");
    const json = JSON.stringify(data);
    for (const forbidden of ["private-owner", "token=secret", "PRIVATE DRAFT", "PRIVATE SECTION", "internal-submission", "javascript:"]) expect(json).not.toContain(forbidden);
    expect(data.entries).toHaveLength(1);
    expect(data.featured).toEqual([entry.id]);
    expect(data.entries[0].attachments[0].url).toBe("https://qa.test/portfolio/ana-qa/checkout");
    expect(data.projects[0].links).toEqual(["https://github.com/ana/loja"]);
  });

  test("README reúne perfil, projetos, narrativa autoral, formação, destaques e mentoria", () => {
    const readme = portfolioReadme(buildPortfolioExport(portfolio, "https://qa.test"));
    for (const text of ["Ana", "Minha loja", "Projeto pessoal", "Analista de QA", "2026", "Comparação com oráculo", "Bloquear a entrega", "Validar arredondamento", "Formação", "Projeto final", "Trabalhos em destaque", "prova.png"]) expect(readme).toContain(text);
    expect(readme).not.toContain("signed?token");
  });

  test("HTML escapa conteúdo não confiável e preserva links seguros", () => {
    const data = buildPortfolioExport({ ...portfolio, name: '<script>alert("x")</script>', bio: '<img src=x onerror="alert(1)">' }, "https://qa.test");
    const html = portfolioHtml(data);
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain('href="https://qa.test/portfolio/ana-qa/checkout"');
    expect(html).toContain("@media print");
  });

  test("README impede HTML inserido pelo usuário e URLs com protocolo inseguro", () => {
    const data = buildPortfolioExport({ ...portfolio, name: "[Ana](javascript:alert(1)) <script>" }, "https://qa.test");
    expect(portfolioReadme(data)).toContain("\\[Ana\\]");
    expect(portfolioReadme(data)).not.toContain("<script>");
  });

  test("post tem limite conservador mesmo com campos máximos e mantém o link inteiro", () => {
    const data = buildPortfolioExport(portfolio, "https://qa.test");
    data.profile.headline = "Texto extenso ".repeat(500);
    data.projects = Array.from({ length: 12 }, () => ({ ...data.projects[0], name: "Projeto ".repeat(100) }));
    data.entries = Array.from({ length: 12 }, (_, i) => ({ ...data.entries[0], id: String(i), title: "Título ".repeat(100), narrative: { findings: "Achado ".repeat(100) } }));
    data.featured = ["0", "1", "2"];
    const post = portfolioLinkedInPost(data);
    expect(Array.from(post).length).toBeLessThanOrEqual(LINKEDIN_POST_LIMIT);
    expect(post).toContain(data.profile.url);
    expect(post).toContain("#QualityAssurance");
    expect(post).not.toContain("achei");
  });

  test("perfil sem projetos e evidências continua exportável", () => {
    const data = buildPortfolioExport({ ...portfolio, entries: [], projects: [], mentorshipCases: [], skills: [], featuredSubmissionIds: [] }, "https://qa.test");
    expect(portfolioReadme(data)).toContain("Formação");
    expect(portfolioLinkedInPost(data)).not.toContain("Cases que compartilho");
    expect(portfolioHtml(data)).toContain("Ana");
  });
});
