import { redirect } from "next/navigation";
import { PortfolioClient } from "@/components/perfil/portfolio-client";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser, listPortfolioProjects, listPortfolioSections, listSubmissions } from "@/lib/product/store";
import { selectWithOptionalColumn } from "@/lib/product/profile-columns";

export const dynamic = "force-dynamic";
export const metadata = { title: "Meu portfólio | QA Lab", robots: { index: false, follow: false } };

type PortfolioProfile = {
  portfolio_appearance?: unknown;
  full_name: string | null;
  username: string | null;
  bio: string | null;
  linkedin_url: string | null;
  github_url?: string | null;
  role: string | null;
  portfolio_public: boolean | null;
  portfolio_headline: string | null;
  portfolio_featured_submission_ids?: string[] | null;
};

export default async function PortfolioPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=%2Fperfil%2Fportfolio");

  const supabase = await createClient();
  const [profile, submissions, sections, projects] = await Promise.all([
    selectWithOptionalColumn<PortfolioProfile>(
      (columns) => supabase.from("profiles").select(columns).eq("id", user.id).maybeSingle() as PromiseLike<{ data: PortfolioProfile | null; error: { code?: string; message?: string } | null }>,
      "full_name,username,bio,linkedin_url,role,portfolio_public,portfolio_headline",
      ["github_url", "portfolio_featured_submission_ids", "portfolio_appearance"],
    ),
    listSubmissions(user.id),
    listPortfolioSections(user.id),
    listPortfolioProjects(user.id),
  ]);

  return <PortfolioClient email={user.email} profile={profile} submissions={submissions} sections={sections} projects={projects} />;
}
