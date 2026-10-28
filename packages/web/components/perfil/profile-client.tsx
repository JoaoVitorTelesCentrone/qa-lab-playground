import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProfileHero } from "./profile-hero";

type Profile = {
  full_name?: string | null;
  username?: string | null;
  bio?: string | null;
  role?: string | null;
  plan?: string | null;
  portfolio_public?: boolean | null;
} | null;

export function ProfileClient({ email, profile }: { email: string; profile: Profile }) {
  return (
    <main className="qa-profile mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 lg:py-10">
      <ProfileHero
        name={profile?.full_name ?? ""}
        email={email}
        plan={profile?.plan ?? "free"}
        role={profile?.role ?? "QA Iniciante"}
        bio={profile?.bio ?? ""}
        username={profile?.username ?? ""}
      />

      <Link
        href="/perfil/portfolio"
        className="group mt-7 flex items-center justify-between gap-5 border-y border-border py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span>
          <span className="block text-base font-semibold transition-colors group-hover:text-primary">Meu portfólio</span>
          <span className="mt-1 block text-sm text-muted-foreground">
            {profile?.portfolio_public ? "Página pública ativa" : "Publique seus cases e projetos em uma página separada"}
          </span>
        </span>
        <ArrowRight className="size-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </Link>
    </main>
  );
}
