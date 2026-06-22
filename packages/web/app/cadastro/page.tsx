import { AuthForm } from "@/components/auth/auth-form";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata = { title: "Criar conta", robots: { index: false, follow: false } };

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = (await searchParams).next;
  const safeNext = next?.startsWith("/") && !next.startsWith("//") ? next : "/lab";
  return <AuthForm mode="cadastro" next={safeNext} configured={isSupabaseConfigured()} />;
}
