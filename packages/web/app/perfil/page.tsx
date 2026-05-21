import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileClient } from "@/components/perfil/profile-client";

export const metadata = { title: "Perfil — QA Lab Playground" };

export default async function PerfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/perfil");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: missions } = await supabase
    .from("mission_progress")
    .select("mission_id, completed_at")
    .eq("user_id", user.id)
    .eq("status", "completed")
    .order("completed_at", { ascending: false });

  return (
    <ProfileClient
      user={user}
      profile={profile}
      completedMissions={missions ?? []}
    />
  );
}
