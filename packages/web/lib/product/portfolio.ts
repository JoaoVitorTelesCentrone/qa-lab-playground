// Portfólio público de evidências.
//
// Regra de produto: publicar é decisão do aluno, em dois níveis — o portfólio
// precisa estar público e a evidência precisa estar marcada como publicada.
// Uma coisa só não expõe nada, e o banco garante isso por RLS; aqui só lemos.

import { createClient } from "@/lib/supabase/server";
import { labs } from "@/lib/playground/catalog";
import type { Severity } from "./evaluation";
import { countBySeverity, type PortfolioEntry } from "./portfolio-format";

export type Portfolio = {
  username: string;
  name: string;
  headline: string;
  bio: string;
  role: string;
  linkedin: string;
  entries: PortfolioEntry[];
  /** Quantas evidências por severidade, para o resumo do topo. */
  bySeverity: Array<{ severity: Severity; total: number }>;
  labsCovered: number;
};

const SUBMISSION_COLUMNS = "id,lab_slug,result,reproduction,severity,checklist,created_at";

export async function getPortfolio(username: string): Promise<Portfolio | null> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id,full_name,username,bio,role,linkedin_url,portfolio_headline,portfolio_public")
    .eq("username", username)
    .eq("portfolio_public", true)
    .maybeSingle();
  if (!profile) return null;

  const { data } = await supabase
    .from("lab_submissions")
    .select(SUBMISSION_COLUMNS)
    .eq("user_id", profile.id)
    .eq("published", true)
    .order("created_at", { ascending: false });

  const entries = (data ?? []).flatMap<PortfolioEntry>((row) => {
    const lab = labs.find((item) => item.slug === row.lab_slug);
    if (!lab) return [];
    return [{
      id: row.id,
      labSlug: row.lab_slug,
      result: row.result,
      reproduction: row.reproduction,
      severity: row.severity as Severity,
      checklist: Array.isArray(row.checklist) ? (row.checklist as string[]) : [],
      published: true,
      createdAt: row.created_at,
      labTitle: lab.title,
      labNumber: lab.number,
      labArea: lab.requiredFeature,
    }];
  });

  return {
    username: profile.username,
    name: profile.full_name ?? profile.username,
    headline: profile.portfolio_headline ?? "",
    bio: profile.bio ?? "",
    role: profile.role ?? "",
    linkedin: profile.linkedin_url ?? "",
    entries,
    bySeverity: countBySeverity(entries),
    labsCovered: new Set(entries.map((entry) => entry.labSlug)).size,
  };
}

export { countBySeverity, toEntries, toMarkdown, type PortfolioEntry } from "./portfolio-format";
