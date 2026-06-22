import { redirect } from "next/navigation";
import { ProfileClient } from "@/components/perfil/profile-client";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata = { title: "Perfil", robots: { index: false, follow: false } };

export default async function ProfilePage() {
  if (!isSupabaseConfigured()) redirect("/login");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/perfil");
  const { data: profile } = await supabase.from("profiles").select("full_name,username,bio,linkedin_url,role,plan").eq("id", user.id).maybeSingle();
  return <ProfileClient email={user.email ?? ""} profile={profile} />;
}
