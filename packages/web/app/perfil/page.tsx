import { redirect } from "next/navigation";
import { ProfileClient } from "@/components/perfil/profile-client";
import { createClient } from "@/lib/supabase/server";
import { getJourney, getSessionUser, listPortfolioProjects, listPortfolioSections, listSubmissions } from "@/lib/product/store";
import { buildTrackProgress, learningTracks, trackHasReleasedLab } from "@/lib/product/tracks";
import { selectWithOptionalColumn } from "@/lib/product/profile-columns";

export const dynamic = "force-dynamic";
export const metadata = { title: "Meu portfólio | QA Lab", robots: { index: false, follow: false } };

type Profile = {
  portfolio_appearance?: unknown;
  full_name: string | null;
  username: string | null;
  bio: string | null;
  linkedin_url: string | null;
  github_url?: string | null;
  role: string | null;
  plan: string | null;
  portfolio_public: boolean | null;
  portfolio_headline: string | null;
  portfolio_featured_submission_ids?: string[] | null;
};

export default async function ProfilePage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=%2Fperfil");

  const supabase = await createClient();
  const [profile, journey, submissions, sections, projects] = await Promise.all([
    selectWithOptionalColumn<Profile>(
      (columns) => supabase.from("profiles").select(columns).eq("id", user.id).maybeSingle() as PromiseLike<{ data: Profile | null; error: { code?: string; message?: string } | null }>,
      "full_name,username,bio,linkedin_url,role,plan,portfolio_public,portfolio_headline",
      ["github_url", "portfolio_featured_submission_ids", "portfolio_appearance"],
    ),
    getJourney(user.id),
    listSubmissions(user.id),
    listPortfolioSections(user.id),
    listPortfolioProjects(user.id),
  ]);

  const tracks = learningTracks
    .filter(trackHasReleasedLab)
    .map((track) => buildTrackProgress(track, journey.labs));

  return <ProfileClient email={user.email} profile={profile} journey={journey} tracks={tracks} submissions={submissions} sections={sections} projects={projects} />;
}
