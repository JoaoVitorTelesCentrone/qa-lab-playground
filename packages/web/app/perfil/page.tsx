import { redirect } from "next/navigation";
import { ProfileClient } from "@/components/perfil/profile-client";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/product/store";
import { selectWithOptionalColumn } from "@/lib/product/profile-columns";

export const dynamic = "force-dynamic";
export const metadata = { title: "Meu perfil | QA Lab", robots: { index: false, follow: false } };

type Profile = {
  full_name: string | null;
  username: string | null;
  bio: string | null;
  linkedin_url: string | null;
  github_url?: string | null;
  role: string | null;
  plan: string | null;
  portfolio_public: boolean | null;
};

export default async function ProfilePage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=%2Fperfil");

  const supabase = await createClient();
  const profile = await selectWithOptionalColumn<Profile>(
    (columns) => supabase.from("profiles").select(columns).eq("id", user.id).maybeSingle() as PromiseLike<{ data: Profile | null; error: { code?: string; message?: string } | null }>,
    "full_name,username,bio,linkedin_url,role,plan,portfolio_public",
    ["github_url"],
  );

  return <ProfileClient email={user.email} profile={profile} />;
}
