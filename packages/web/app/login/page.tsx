import { AuthForm } from "@/components/auth/auth-form";
import { safeAuthDestination } from "@/lib/auth/redirect";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSessionUser } from "@/lib/product/store";
import { redirect } from "next/navigation";

export const metadata = { title: "Entrar", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const params = await searchParams;
  const next = safeAuthDestination(params.next);
  const user = await getSessionUser();
  if (user) redirect(next);

  return <AuthForm mode="login" next={next} signupHref={params.next ? `/cadastro?next=${encodeURIComponent(next)}` : "/cadastro"} configured={isSupabaseConfigured()} googleEnabled={process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true"} initialError={params.error === "auth" ? "O link de acesso expirou ou já foi utilizado. Entre novamente." : undefined} />;
}
