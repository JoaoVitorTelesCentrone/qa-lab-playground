"use client";

// Cabeçalho do dashboard: quem é a pessoa, em que nível ela está e os dois
// atalhos que ela mais usa (ver a página pública, editar os dados).

export function ProfileHero({ name, email, plan, role, bio, username }: {
  name: string;
  email: string;
  plan: string;
  role: string;
  bio: string;
  username: string;
}) {
  const display = name.trim() || username || email.split("@")[0] || "Seu perfil";
  const initial = display.trim().charAt(0).toUpperCase();

  return (
    <header className="border-b border-border pb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
        <span
          aria-hidden="true"
          className="flex size-14 shrink-0 items-center justify-center border border-primary/40 bg-primary/10 text-xl font-semibold text-primary sm:size-16 sm:text-2xl"
        >
          {initial}
        </span>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-3xl leading-tight font-extrabold tracking-[-0.04em] sm:text-4xl">{display}</h1>
          <p className="mt-1 truncate text-sm text-muted-foreground">{email}</p>
          <p className="mt-1 text-sm text-muted-foreground">{role || "Perfil profissional não informado"} · Plano {plan}</p>

          {bio.trim() && <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{bio}</p>}
        </div>
      </div>
    </header>
  );
}
