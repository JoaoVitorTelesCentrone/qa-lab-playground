import { normalizePortfolioAppearance, type PortfolioAppearance } from "./portfolio-appearance";
// Portfólio público de evidências.
//
// Regra de produto: publicar é decisão do aluno, em dois níveis — o portfólio
// precisa estar público e a evidência precisa estar marcada como publicada.
// Uma coisa só não expõe nada, e o banco garante isso por RLS; aqui só lemos.

import { createClient } from "@/lib/supabase/server";
import { labLabel, labs } from "@/lib/playground/catalog";
import { systemChallenges } from "@/lib/system-challenges";
import { buildCase, type QaCase } from "./case";
import { toAttachments } from "./journey";
import { signPublicAttachments } from "./evidence-storage";
import { projectIdForArea, toEntries, type PortfolioEntry } from "./portfolio-format";
import { normalizeProfileLink } from "./profile-links";
import { visibleSections, type PortfolioSection } from "./portfolio-sections";
import { listPublicPortfolioSections } from "./store";
import { selectWithOptionalColumn } from "./profile-columns";
import { buildProjects, findProject, normalizePortfolioProjectMedia, portfolioProjectMediaFolder, projectMeta, portfolioSkills, statsFor, type PortfolioProject, type PortfolioStats } from "./portfolio-projects";
import type { MentorshipPortfolioCase } from "@/lib/mentorship/portfolio";

export type Portfolio = {
  appearance?: PortfolioAppearance;
  username: string;
  name: string;
  headline: string;
  bio: string;
  role: string;
  linkedin: string;
  github: string;
  entries: PortfolioEntry[];
  featuredSubmissionIds: string[];
  /** O nível do meio: em que sistemas essa pessoa trabalhou. */
  projects: PortfolioProject[];
  /** Números do topo, somando o portfólio inteiro. */
  stats: PortfolioStats;
  skills: string[];
  /** Texto livre do dono: formação, certificações, o que a evidência não conta. */
  sections: PortfolioSection[];
  mentorshipCases: MentorshipPortfolioCase[];
};

const SUBMISSION_COLUMNS = "id,lab_slug,evidence,attachments,created_at,published_portfolio_case";

// `github_url` nasceu na migração 0010 e as migrações sobem à mão. Enquanto ela
// não é aplicada, pedir a coluna faria o perfil vir nulo e a página pública
// responder 404 — ver lib/product/profile-columns.ts.
type ProfileRow = {
  portfolio_appearance?: unknown;
  id: string;
  full_name: string | null;
  username: string;
  bio?: string | null;
  role: string | null;
  linkedin_url: string | null;
  github_url?: string | null;
  portfolio_headline: string | null;
  portfolio_featured_submission_ids?: string[] | null;
};

function publicProfile(supabase: Awaited<ReturnType<typeof createClient>>, username: string, columns: string, ownerId?: string) {
  return selectWithOptionalColumn<ProfileRow>(
    (selected) => (ownerId ? supabase.from("profiles").select(selected).eq("id", ownerId) : supabase.from("profiles").select(selected).eq("username", username).eq("portfolio_public", true)).maybeSingle() as PromiseLike<{ data: ProfileRow | null; error: { code?: string; message?: string } | null }>,
    columns,
    ["github_url", "portfolio_featured_submission_ids", "portfolio_appearance"],
  );
}

export async function getPortfolio(username: string, options?: { preview: true }): Promise<Portfolio | null> {
  const supabase = await createClient();

  // Private previews are scoped to the verified session, never a caller-supplied owner.
  const owner = options?.preview ? (await supabase.auth.getUser()).data.user : null;
  if (options?.preview && !owner) return null;
  const profile = await publicProfile(supabase, username, "id,full_name,username,bio,role,linkedin_url,portfolio_headline,portfolio_public", owner?.id);
  if (!profile) return null;

  const [{ data }, sections, { data: mentorshipData }, { data: projectPublications }] = await Promise.all([
    supabase
      .from("lab_submissions")
      .select(SUBMISSION_COLUMNS)
      .eq("user_id", profile.id)
      .eq("published", true)
      .order("created_at", { ascending: false }),
    // A RLS já filtra por visível + portfólio público; `visibleSections`
    // completa tirando as que ficaram sem conteúdo.
    listPublicPortfolioSections(profile.id),
    supabase.from("mentorship_portfolio_cases").select("id,submission_id,user_id,title,summary,evidence,repository_url,report_url,published,created_at,updated_at").eq("user_id", profile.id).eq("published", true).order("updated_at", { ascending: false }),
    supabase.from("portfolio_project_publications").select("project_id,source,name,summary,role,period,links,media,case_submission_ids,sort_order,published_at").eq("user_id", profile.id).order("sort_order", { ascending: true }).order("published_at", { ascending: false }),
  ]);

  const entries = toEntries((data ?? []).map((row) => ({
    id: row.id,
    labSlug: row.lab_slug,
    evidence: row.evidence ?? "",
    attachments: toAttachments(row.attachments),
    published: true,
    createdAt: row.created_at,
    portfolioCase: row.published_portfolio_case && typeof row.published_portfolio_case === "object" && !Array.isArray(row.published_portfolio_case) ? row.published_portfolio_case as Record<string, string> : undefined,
  })));

  // Bucket privado: quem abre esta página é anônimo, então a URL do anexo é
  // assinada aqui. Só chega neste ponto o que já passou pelo filtro de
  // publicado, logo a assinatura não vaza rascunho.
  const signedEntries = await Promise.all(
    entries.map(async (entry) => ({ ...entry, attachments: await signPublicAttachments(entry.attachments, profile.id, entry.labSlug) })),
  );
  const linkedSubmissionIds = new Set((projectPublications ?? []).flatMap((row) => Array.isArray(row.case_submission_ids) ? row.case_submission_ids.map(String) : []));
  const customProjects: PortfolioProject[] = await Promise.all((projectPublications ?? []).map(async (row) => {
    const ids = new Set(Array.isArray(row.case_submission_ids) ? row.case_submission_ids.map(String) : []);
    const projectEntries = signedEntries.filter((entry) => ids.has(entry.id));
    const rawMedia = (normalizePortfolioProjectMedia(row.media, profile.id, String(row.project_id)) ?? []).filter((file) => file.visibility === "public");
    const media = (await signPublicAttachments(rawMedia, profile.id, portfolioProjectMediaFolder(String(row.project_id)))).filter((file) => file.url);
    const coverPath = rawMedia.find((file) => file.isCover)?.path;
    return {
      id: String(row.project_id),
      name: String(row.name),
      summary: String(row.summary ?? ""),
      source: row.source === "profissional" ? "profissional" : "pessoal",
      route: "",
      sortOrder: Number.isFinite(Number(row.sort_order)) ? Number(row.sort_order) : 0,
      role: String(row.role ?? ""),
      period: String(row.period ?? ""),
      links: Array.isArray(row.links) ? row.links.filter((link): link is string => typeof link === "string") : [],
      media,
      cover: media.find((file) => file.path === coverPath),
      tags: [],
      entries: projectEntries,
      stats: statsFor(projectEntries),
    };
  }));
  const projects = [
    ...customProjects,
    ...buildProjects(signedEntries.filter((entry) => !linkedSubmissionIds.has(entry.id))),
  ];

  return {
    appearance: normalizePortfolioAppearance(profile.portfolio_appearance),
    username: profile.username ?? "meu-portfolio",
    name: profile.full_name || profile.username || "Meu portfólio",
    headline: profile.portfolio_headline ?? "",
    bio: profile.bio ?? "",
    role: profile.role ?? "",
    linkedin: normalizeProfileLink(profile.linkedin_url ?? "", "linkedin"),
    github: normalizeProfileLink(profile.github_url ?? "", "github"),
    entries: signedEntries,
    featuredSubmissionIds: Array.isArray(profile.portfolio_featured_submission_ids) ? profile.portfolio_featured_submission_ids.map(String).slice(0, 3) : [],
    projects,
    stats: statsFor(signedEntries),
    skills: portfolioSkills(signedEntries),
    sections: visibleSections(sections),
    mentorshipCases: (mentorshipData ?? []).map((row) => ({
      id: String(row.id), submissionId: String(row.submission_id), userId: String(row.user_id), title: String(row.title), summary: String(row.summary ?? ""), evidence: String(row.evidence ?? ""), repositoryUrl: typeof row.repository_url === "string" ? row.repository_url : null, reportUrl: typeof row.report_url === "string" ? row.report_url : null, published: true, createdAt: String(row.created_at), updatedAt: String(row.updated_at),
    })),
  };
}

export type PortfolioProjectPage = { portfolio: Portfolio; project: PortfolioProject };

/** Um projeto do portfólio. Mesma leitura da página do perfil, recortada. */
export async function getPortfolioProject(username: string, projectId: string): Promise<PortfolioProjectPage | null> {
  const portfolio = await getPortfolio(username);
  if (!portfolio) return null;
  const project = findProject(portfolio.projects, projectId);
  return project ? { portfolio, project } : null;
}

export { toEntries, toMarkdown, type PortfolioEntry } from "./portfolio-format";
export { type PortfolioProject, type PortfolioStats } from "./portfolio-projects";

export type PublicCase = {
  case: QaCase;
  /** O projeto a que a evidência pertence, para o caminho de volta. */
  project: { id: string; name: string };
  author: { username: string; name: string; headline: string; role: string; linkedin: string; github: string };
  /** Outros cases publicados da mesma pessoa, para quem chegou pelo link não sair no vazio. */
  more: Array<{ labSlug: string; label: string; title: string }>;
};

/**
 * Um case público: a evidência mais recente que a pessoa publicou naquele Lab.
 * Entregas mais antigas continuam no histórico privado — o portfólio mostra a
 * versão que ela escolheu deixar de pé, não o rascunho.
 */
export async function getPublicCase(username: string, labSlug: string): Promise<PublicCase | null> {
  const supabase = await createClient();

  const profile = await publicProfile(supabase, username, "id,full_name,username,role,linkedin_url,portfolio_headline,portfolio_public");
  if (!profile) return null;

  const { data } = await supabase
    .from("lab_submissions")
    .select(SUBMISSION_COLUMNS)
    .eq("user_id", profile.id)
    .eq("published", true)
    .order("created_at", { ascending: false });

  const rows = data ?? [];
  const row = rows.find((item) => item.lab_slug === labSlug);
  if (!row) return null;

  const built = buildCase(
    {
      id: row.id,
      labSlug: row.lab_slug,
      evidence: row.evidence ?? "",
      attachments: await signPublicAttachments(toAttachments(row.attachments), profile.id, row.lab_slug),
      published: true,
      createdAt: row.created_at,
    },
    labs.find((item) => item.slug === row.lab_slug),
    systemChallenges.find((item) => item.id === row.lab_slug),
    row.published_portfolio_case && typeof row.published_portfolio_case === "object" && !Array.isArray(row.published_portfolio_case) ? row.published_portfolio_case as Record<string, string> : undefined,
  );
  if (!built) return null;

  // Uma entrada por Lab: o mesmo Lab publicado duas vezes viraria dois links
  // para a mesma página.
  const seen = new Set([labSlug]);
  const more = rows.flatMap<PublicCase["more"][number]>((item) => {
    if (seen.has(item.lab_slug)) return [];
    const lab = labs.find((candidate) => candidate.slug === item.lab_slug);
    if (!lab) return [];
    seen.add(item.lab_slug);
    return [{ labSlug: lab.slug, label: labLabel(lab), title: lab.title }];
  });

  const { data: linkedProject } = await supabase.from("portfolio_project_publications").select("project_id,name").eq("user_id", profile.id).contains("case_submission_ids", [row.id]).order("published_at", { ascending: false }).limit(1).maybeSingle();
  const projectId = linkedProject?.project_id ?? projectIdForArea(built.area);

  return {
    case: built,
    project: { id: projectId, name: linkedProject?.name ?? projectMeta(projectId).name },
    author: {
      username: profile.username,
      name: profile.full_name ?? profile.username,
      headline: profile.portfolio_headline ?? "",
      role: profile.role ?? "",
      linkedin: normalizeProfileLink(profile.linkedin_url ?? "", "linkedin"),
      github: normalizeProfileLink(profile.github_url ?? "", "github"),
    },
    more,
  };
}
