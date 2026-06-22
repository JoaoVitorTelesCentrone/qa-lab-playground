import { AuthForm } from "@/components/auth/auth-form";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata = { title: "Entrar", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = (await searchParams).next;
  const safeNext = next?.startsWith("/") && !next.startsWith("//") ? next : "/lab";
  return <AuthForm mode="login" next={safeNext} configured={isSupabaseConfigured()} />;
}
