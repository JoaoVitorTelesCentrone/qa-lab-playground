import { redirect } from "next/navigation";
import { ProfileClient } from "@/components/perfil/profile-client";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getJourney, listSubmissions } from "@/lib/product/store";
import { buildTrackProgress, learningTracks } from "@/lib/product/tracks";

export const metadata = { title: "Perfil", robots: { index: false, follow: false } };

export default async function ProfilePage() {
  if (!isSupabaseConfigured()) redirect("/login");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/perfil");
  const [{ data: profile }, journey, submissions] = await Promise.all([
    supabase.from("profiles").select("full_name,username,bio,linkedin_url,role,plan").eq("id", user.id).maybeSingle(),
    getJourney(user.id),
    listSubmissions(user.id),
  ]);
  const tracks = learningTracks.map((track) => buildTrackProgress(track, journey.labs));
  return <ProfileClient email={user.email ?? ""} profile={profile} journey={journey} tracks={tracks} submissions={submissions.slice(0, 20)} />;
}
