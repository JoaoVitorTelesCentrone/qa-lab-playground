import { ProfileClient } from "@/components/perfil/profile-client";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getJourney, listPortfolioSections, listSubmissions } from "@/lib/product/store";
import { buildTrackProgress, learningTracks } from "@/lib/product/tracks";
import { selectWithOptionalColumn } from "@/lib/product/profile-columns";
import { emptyJourney } from "@/lib/product/journey";

type Profile = NonNullable<React.ComponentProps<typeof ProfileClient>["profile"]>;

export const metadata = { title: "Perfil", robots: { index: false, follow: false } };

export default async function ProfilePage() {
  if (!isSupabaseConfigured()) return <GuestProfile />;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <GuestProfile />;
  // `github_url` só existe depois da migração 0010; sem o fallback o perfil
  // inteiro viria vazio. Ver lib/product/profile-columns.ts.
  const [profile, journey, submissions, sections] = await Promise.all([
    selectWithOptionalColumn<Profile>(
      (columns) => supabase.from("profiles").select(columns).eq("id", user.id).maybeSingle() as PromiseLike<{ data: Profile | null; error: { code?: string; message?: string } | null }>,
      "full_name,username,bio,linkedin_url,role,plan,portfolio_public,portfolio_headline",
      "github_url",
    ),
    getJourney(user.id),
    listSubmissions(user.id),
    listPortfolioSections(user.id),
  ]);
  const tracks = learningTracks.map((track) => buildTrackProgress(track, journey.labs));
  return <ProfileClient email={user.email ?? ""} profile={profile} journey={journey} tracks={tracks} submissions={submissions.slice(0, 20)} sections={sections} />;
}

function GuestProfile() {
  const tracks = learningTracks.map((track) => buildTrackProgress(track, emptyJourney.labs));
  return <ProfileClient email="visitante@qa-lab.local" profile={{ full_name: "Visitante", role: "QA Explorer", plan: "pro" }} journey={emptyJourney} tracks={tracks} submissions={[]} sections={{ sections: [], available: false }} />;
}
