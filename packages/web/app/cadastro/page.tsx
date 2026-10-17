import { AuthForm } from "@/components/auth/auth-form";
import { safeAuthDestination } from "@/lib/auth/redirect";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSessionUser } from "@/lib/product/store";
import { redirect } from "next/navigation";

export const metadata = { title: "Criar conta", robots: { index: false, follow: false } };

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const params = await searchParams;
  const next = safeAuthDestination(params.next);
  const user = await getSessionUser();
  if (user) redirect(next);

  return <AuthForm mode="cadastro" next={next} configured={isSupabaseConfigured()} googleEnabled={process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true"} />;
}
