// Public export DTO: intentionally excludes storage paths, signed URLs and owner IDs.
import type { Portfolio } from "./portfolio";

export const LINKEDIN_POST_LIMIT = 2800;

function safeUrl(value: string) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password ? url.href : "";
  } catch { return ""; }
}

export function buildPortfolioExport(portfolio: Portfolio, origin: string) {
  const base = new URL(`/portfolio/${encodeURIComponent(portfolio.username)}`, origin).href;
  const caseUrl = (slug: string) => `${base}/${encodeURIComponent(slug)}`;
  const entries = portfolio.entries.filter((entry) => entry.published).map((entry) => ({
    id: entry.id,
    title: entry.portfolioCase?.title || entry.labTitle,
    url: caseUrl(entry.labSlug),
    area: entry.labArea,
    mode: entry.labMode,
    createdAt: entry.createdAt,
    evidence: entry.evidence,
    narrative: Object.fromEntries((["context", "approach", "findings", "decision", "reflection"] as const).flatMap((key) => {
      const value = entry.portfolioCase?.[key];
      return typeof value === "string" && value.trim() ? [[key, value]] : [];
    })),
    // The case page resolves fresh attachment URLs when opened.
    attachments: entry.attachments.map((file) => ({ name: file.name, type: file.type, url: caseUrl(entry.labSlug) })),
  }));
  const entryIds = new Set(entries.map((entry) => entry.id));
  return {
    schemaVersion: 1,
    profile: { name: portfolio.name, username: portfolio.username, role: portfolio.role, headline: portfolio.headline, bio: portfolio.bio, url: base,
      linkedin: safeUrl(portfolio.linkedin), github: safeUrl(portfolio.github) },
    skills: portfolio.skills,
    featured: portfolio.featuredSubmissionIds.filter((id) => entryIds.has(id)),
    sections: portfolio.sections.filter((section) => section.visible && section.body.trim()).map(({ title, body }) => ({ title, body })),
    projects: portfolio.projects.map((project) => ({
      name: project.name, summary: project.summary, source: project.source, role: project.role || "", period: project.period || "",
      url: `${base}/projeto/${encodeURIComponent(project.id)}`,
      links: (project.links || []).map(safeUrl).filter(Boolean),
      tags: project.tags,
      caseIds: project.entries.map((entry) => entry.id).filter((id) => entryIds.has(id)),
      media: (project.media || []).map((file) => ({ name: file.name, type: file.type })),
    })),
    entries,
    mentorshipCases: portfolio.mentorshipCases.filter((item) => item.published).map((item) => ({
      title: item.title, summary: item.summary, evidence: item.evidence,
      url: `${base}/mentoria/${encodeURIComponent(item.id)}`,
      repositoryUrl: safeUrl(item.repositoryUrl || ""), reportUrl: safeUrl(item.reportUrl || ""),
    })),
  };
}

export type PortfolioExport = ReturnType<typeof buildPortfolioExport>;

function markdownText(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/([\\`*_[\]{}#!|])/g, "\\$1");
}
function link(label: string, url: string) {
  const safe = safeUrl(url);
  return safe ? `[${markdownText(label)}](<${safe.replace(/</g, "%3C").replace(/>/g, "%3E")}>)` : markdownText(label);
}

const sourceLabels = { "qa-lab": "Prática em ambiente simulado do QA Lab", pessoal: "Projeto pessoal", profissional: "Projeto profissional" };
const narrativeLabels: Record<string, string> = { context: "Contexto", approach: "Abordagem", findings: "Achados", decision: "Decisão", reflection: "Aprendizados" };

export function portfolioReadme(data: PortfolioExport) {
  const p = data.profile;
  const lines = [`# ${markdownText(p.name)} — Portfólio de QA`, "", markdownText(p.role), "", markdownText(p.headline), "", markdownText(p.bio), "",
    link("Portfólio completo", p.url), "",
    ...[p.linkedin && link("LinkedIn", p.linkedin), p.github && link("GitHub", p.github)].filter(Boolean), ""];
  if (data.skills.length) lines.push("## Competências demonstradas", "", ...data.skills.map((skill) => `- ${markdownText(skill)}`), "");
  if (data.featured.length) lines.push("## Trabalhos em destaque", "", ...data.featured.flatMap((id) => {
    const entry = data.entries.find((item) => item.id === id);
    return entry ? [`- ${link(entry.title, entry.url)}`] : [];
  }), "");
  if (data.projects.length) lines.push("## Projetos", "");
  for (const project of data.projects) {
    lines.push(`### ${link(project.name, project.url)}`, "", sourceLabels[project.source], "", markdownText(project.summary), "");
    if (project.role) lines.push(`**Minha atuação:** ${markdownText(project.role)}`, "");
    if (project.period) lines.push(`**Período:** ${markdownText(project.period)}`, "");
    if (project.tags.length) lines.push(`**Áreas e testes:** ${project.tags.map(markdownText).join(", ")}`, "");
    lines.push(...project.links.map((url, i) => `- ${link(`Link do projeto ${i + 1}`, url)}`));
    for (const id of project.caseIds) {
      const entry = data.entries.find((item) => item.id === id);
      if (entry) lines.push(`- ${link(entry.title, entry.url)}`);
    }
    if (project.media.length) lines.push("", `Imagens e vídeos: ${link("ver galeria do projeto", project.url)}.`);
    lines.push("");
  }
  if (data.entries.length) lines.push("## Cases e evidências", "");
  for (const entry of data.entries) {
    lines.push(`### ${link(entry.title, entry.url)}`, "", `**Tipo de trabalho:** ${entry.mode === "investigacao" ? "Investigação de defeito" : "Validação de fluxo"}`, "");
    for (const [key, value] of Object.entries(entry.narrative)) lines.push(`#### ${narrativeLabels[key]}`, "", markdownText(value), "");
    if (entry.evidence.trim()) lines.push("#### Evidência registrada", "", markdownText(entry.evidence), "");
    if (entry.attachments.length) lines.push("#### Anexos", "", ...entry.attachments.map((file) => `- ${link(file.name, file.url)} (disponível no case)`), "");
  }
  if (data.mentorshipCases.length) lines.push("## Cases da mentoria", "");
  for (const item of data.mentorshipCases) {
    lines.push(`### ${link(item.title, item.url)}`, "", markdownText(item.summary), "", markdownText(item.evidence), "");
    if (item.repositoryUrl) lines.push(link("Repositório", item.repositoryUrl), "");
    if (item.reportUrl) lines.push(link("Relatório", item.reportUrl), "");
  }
  for (const section of data.sections) lines.push(`## ${markdownText(section.title)}`, "", markdownText(section.body), "");
  lines.push("---", "", "Os anexos e as galerias podem ser consultados nos links públicos dos cases e projetos. A disponibilidade depende da publicação no QA Lab.");
  return lines.join("\n").trim() + "\n";
}

function shorten(value: string, max: number) {
  const chars = Array.from(value.trim().replace(/\s+/g, " "));
  return chars.length <= max ? chars.join("") : `${chars.slice(0, max - 1).join("").trimEnd()}…`;
}

export function portfolioLinkedInPost(data: PortfolioExport) {
  const featured = data.featured.flatMap((id) => {
    const item = data.entries.find((entry) => entry.id === id);
    return item ? [item] : [];
  });
  const work = featured.length ? featured : data.entries.slice(0, 3);
  const lines = ["Reuni meus projetos e cases de Quality Assurance em um portfólio.", "",
    shorten(data.profile.headline || data.profile.bio, 360), ""];
  if (data.projects.length) lines.push("Projetos:", ...data.projects.slice(0, 3).map((project) => `• ${shorten(project.name, 80)} — ${sourceLabels[project.source]}`), "");
  if (work.length) lines.push("Cases que compartilho:", ...work.slice(0, 3).map((entry) => `• ${shorten(entry.title, 100)}${entry.narrative.findings ? `: ${shorten(entry.narrative.findings, 140)}` : ""}`), "");
  if (data.mentorshipCases.length) lines.push(`Também incluí ${data.mentorshipCases.length} case(s) da mentoria.`, "");
  if (data.skills.length) lines.push(`Competências demonstradas: ${data.skills.slice(0, 4).join(", ")}.`, "");
  lines.push(`Conheça o trabalho e as evidências: ${data.profile.url}`, "", "#QA #QualityAssurance #TestesDeSoftware");
  return lines.join("\n").replace(/\n{3,}/g, "\n\n");
}

function htmlText(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/** Standalone, printable document: no scripts, external assets or expiring media. */
export function portfolioHtml(data: PortfolioExport) {
  const h = htmlText;
  const a = (label: string, url: string) => safeUrl(url) ? `<a href="${h(safeUrl(url))}">${h(label)}</a>` : h(label);
  const p = (value: string) => value ? `<p>${h(value)}</p>` : "";
  const entryHtml = (entry: PortfolioExport["entries"][number]) => `<article><h3>${a(entry.title, entry.url)}</h3>${Object.entries(entry.narrative).map(([key, value]) => `<h4>${narrativeLabels[key]}</h4>${p(value)}`).join("")}${p(entry.evidence)}${entry.attachments.length ? `<h4>Anexos</h4><ul>${entry.attachments.map((file) => `<li>${a(file.name, file.url)}</li>`).join("")}</ul>` : ""}</article>`;
  const body = `<h1>${h(data.profile.name)} — Portfólio de QA</h1>${p(data.profile.role)}${p(data.profile.headline)}${p(data.profile.bio)}<p>${a("Portfólio completo", data.profile.url)}</p><p>${[data.profile.linkedin && a("LinkedIn", data.profile.linkedin), data.profile.github && a("GitHub", data.profile.github)].filter(Boolean).join(" · ")}</p>
    ${data.skills.length ? `<h2>Competências demonstradas</h2><ul>${data.skills.map((skill) => `<li>${h(skill)}</li>`).join("")}</ul>` : ""}
    ${data.featured.length ? `<h2>Trabalhos em destaque</h2><ul>${data.featured.flatMap((id) => { const entry = data.entries.find((item) => item.id === id); return entry ? [`<li>${a(entry.title, entry.url)}</li>`] : []; }).join("")}</ul>` : ""}
    ${data.projects.length ? "<h2>Projetos</h2>" : ""}${data.projects.map((project) => `<article><h3>${a(project.name, project.url)}</h3>${p(sourceLabels[project.source])}${p(project.summary)}${p(project.role ? `Minha atuação: ${project.role}` : "")}${p(project.period ? `Período: ${project.period}` : "")}${p(project.tags.join(", "))}<ul>${project.links.map((url, i) => `<li>${a(`Link do projeto ${i + 1}`, url)}</li>`).join("")}${project.caseIds.flatMap((id) => { const entry = data.entries.find((item) => item.id === id); return entry ? [`<li>${a(entry.title, entry.url)}</li>`] : []; }).join("")}</ul>${project.media.length ? `<p>${a("Ver galeria do projeto", project.url)}</p>` : ""}</article>`).join("")}
    ${data.entries.length ? "<h2>Cases e evidências</h2>" : ""}${data.entries.map(entryHtml).join("")}
    ${data.mentorshipCases.length ? "<h2>Cases da mentoria</h2>" : ""}${data.mentorshipCases.map((item) => `<article><h3>${a(item.title, item.url)}</h3>${p(item.summary)}${p(item.evidence)}${item.repositoryUrl ? `<p>${a("Repositório", item.repositoryUrl)}</p>` : ""}${item.reportUrl ? `<p>${a("Relatório", item.reportUrl)}</p>` : ""}</article>`).join("")}
    ${data.sections.map((section) => `<h2>${h(section.title)}</h2>${p(section.body)}`).join("")}`;
  return `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${htmlText(data.profile.name)} — Portfólio de QA</title><style>body{font:16px/1.6 system-ui,sans-serif;max-width:76ch;margin:40px auto;padding:0 24px;color:#18232c;background:#fff}h1,h2,h3,h4{line-height:1.25;break-after:avoid}h2{margin-top:2em}p{margin:.5em 0;overflow-wrap:anywhere;white-space:pre-wrap}a{color:#145b67} @media print{body{margin:0;max-width:none;font-size:11pt}a{color:inherit}h2,h3,h4{break-after:avoid}@page{margin:18mm}}</style><main>${body}</main></html>`;
}
