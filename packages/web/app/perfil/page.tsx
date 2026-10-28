import { redirect } from "next/navigation";
import { ProfileClient } from "@/components/perfil/profile-client";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/product/store";

export const dynamic = "force-dynamic";
export const metadata = { title: "Meu perfil | QA Lab", robots: { index: false, follow: false } };

export default async function ProfilePage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=%2Fperfil");

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name,username,bio,role,plan,portfolio_public")
    .eq("id", user.id)
    .maybeSingle();

  return <ProfileClient email={user.email} profile={profile} />;
}
