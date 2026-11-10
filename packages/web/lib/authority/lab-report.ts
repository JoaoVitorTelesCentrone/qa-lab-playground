import { author } from "@/content/site";
import { conclusionLabels, severityLabels, type DeliveryFields } from "@/lib/product/delivery";
import { absoluteUrl } from "./share";

const section = (title: string, body: string) => `## ${title}\n\n${body.trim() || "_(not filled in)_"}`;
const footer = () => `---\n_Generated with QA Lab, hands-on QA labs built by ${author.name} (${absoluteUrl(author.aboutHref)})._\n`;

/** Nome de arquivo seguro: `lab-101-investigar-a-captura.md`. */
export function reportFileName(prefix: string, title: string) {
  const slug = title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
  return `${prefix}-${slug || "report"}.md`;
}

/** Relatório do Lab numerado, a partir dos campos da entrega. */
export function labReportMarkdown({ label, title, path, fields, notes, date = new Date() }: {
  label: string; title: string; path: string; fields: DeliveryFields; notes?: string; date?: Date;
}) {
  const conclusion = fields.conclusion
    ? `${conclusionLabels[fields.conclusion]}${fields.conclusion === "falha" && fields.severity ? ` · severity: ${severityLabels[fields.severity]}` : ""}`
    : "";
  return [
    `# Lab ${label}: ${title}`,
    `- Lab: ${absoluteUrl(path)}\n- Date: ${date.toISOString().slice(0, 10)}`,
    section("What I did", fields.did),
    section("What I expected", fields.expected),
    section("What happened", fields.observed),
    section("Conclusion", conclusion),
    ...(notes?.trim() ? [section("Notes", notes)] : []),
    footer(),
  ].join("\n\n");
}

/** Bug report pré-preenchido para os Labs do playground (login, waits, API...). */
export function playgroundReportMarkdown({ title, url, bug, date = new Date() }: { title: string; url: string; bug: string | null | undefined; date?: Date }) {
  const mode = bug === undefined ? "n/a" : bug ? `bug mode on (\`${bug}\`)` : "correct mode";
  return [
    `# Bug report: ${title}`,
    `- Lab: ${absoluteUrl(url)}\n- Mode: ${mode}\n- Date: ${date.toISOString().slice(0, 10)}`,
    section("Summary", ""),
    section("Steps to reproduce", "1. \n2. \n3. "),
    section("Expected result", ""),
    section("Actual result", ""),
    section("Evidence", "Screenshot, response body or log."),
    section("Severity and impact", ""),
    footer(),
  ].join("\n\n");
}
