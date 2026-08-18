"use client";

// Cabeçalho do dashboard: quem é a pessoa, em que nível ela está e os dois
// atalhos que ela mais usa (ver a página pública, editar os dados).

import Link from "next/link";
import { Bug, CheckCircle2, ExternalLink, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ProfileHero({ name, email, plan, role, bio, username, isPublic }: {
  name: string;
  email: string;
  plan: string;
  role: string;
  bio: string;
  username: string;
  isPublic: boolean;
}) {
  const display = name.trim() || username || email.split("@")[0] || "Seu perfil";
  const initial = display.trim().charAt(0).toUpperCase();
  const publicUrl = isPublic && username.length >= 3 ? `/portfolio/${username}` : null;

  function editProfile(event: React.MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById("dados-da-conta");
    if (!target) return; // sem JS ou sem alvo, o href âncora resolve sozinho
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    target.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true });
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8">
      <HeroGraphic />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-7">
        <span
          aria-hidden="true"
          className="flex size-[88px] shrink-0 items-center justify-center rounded-full border border-primary/40 bg-background text-4xl font-semibold text-primary shadow-[0_0_0_6px_rgba(76,175,114,0.05)] sm:size-[110px] sm:text-5xl"
        >
          {initial}
        </span>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[32px] leading-tight font-bold tracking-[-0.03em]">{display}</h1>
          <p className="mt-1 truncate text-sm text-muted-foreground">{email} · plano {plan}</p>

          {role && <Badge className="mt-3 font-medium">{role}</Badge>}

          {bio.trim() && <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">{bio}</p>}

          <div className="mt-6 flex flex-wrap gap-2">
            {publicUrl && (
              <Button asChild size="sm" className="rounded-full px-5">
                <Link href={publicUrl}><ExternalLink className="size-4" /> Ver página pública</Link>
              </Button>
            )}
            <Button asChild size="sm" variant="outline" className="rounded-full px-5">
              <a href="#dados-da-conta" onClick={editProfile}><Pencil className="size-4" /> Editar perfil</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Marca d'água do hero: ícones de QA sobre uma malha de pontos. Decorativa. */
function HeroGraphic() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute -top-6 right-0 hidden h-full w-72 select-none lg:block">
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(76,175,114,0.35) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
          maskImage: "radial-gradient(120px 120px at 70% 45%, #000, transparent)",
          WebkitMaskImage: "radial-gradient(120px 120px at 70% 45%, #000, transparent)",
        }}
      />
      <CheckCircle2 className="absolute top-16 right-24 size-9 text-primary/25" strokeWidth={1.2} />
      <Bug className="absolute top-32 right-10 size-6 text-primary/15" strokeWidth={1.2} />
      <span className="absolute top-24 right-40 h-px w-16 bg-primary/15" />
      <span className="absolute top-40 right-28 h-px w-24 bg-primary/10" />
    </div>
  );
}
