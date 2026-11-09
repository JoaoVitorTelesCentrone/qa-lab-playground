"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, CircleUserRound, FolderOpen, LogOut, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type AccountState = { authenticated: boolean; displayName: string };

// Uma única assinatura da sessão para o header inteiro: o botão da conta e o
// menu mobile leem o mesmo estado, então nunca divergem ("Entrar" para quem já
// está logado era o sintoma disso).
export function useAccount(configured: boolean): AccountState {
  const [authenticated, setAuthenticated] = useState(false);
  const [displayName, setDisplayName] = useState("");
  useEffect(() => {
    if (!configured) return;
    const supabase = createClient();
    let currentUserId: string | null = null;
    let active = true;

    const syncUser = (user: { id: string; email?: string; user_metadata?: Record<string, unknown> } | null) => {
      if (user && currentUserId === user.id) return;
      currentUserId = user?.id ?? null;
      setAuthenticated(Boolean(user));
      if (!user) {
        setDisplayName("");
        return;
      }

      const metadataName = [user.user_metadata?.full_name, user.user_metadata?.name]
        .find((value): value is string => typeof value === "string" && value.trim().length > 0)
        ?.trim();
      const emailName = user.email?.split("@")[0]?.trim();
      setDisplayName(metadataName || emailName || "Minha conta");

      window.setTimeout(() => {
        void Promise.resolve(supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle())
          .then(({ data }) => {
            if (!active || currentUserId !== user.id) return;
            const profileName = data?.full_name?.trim();
            if (profileName) setDisplayName(profileName);
          })
          .catch(() => {});
      }, 0);
    };

    void supabase.auth.getUser().then(({ data }) => syncUser(data.user)).catch(() => syncUser(null));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => syncUser(session?.user ?? null));
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [configured]);
  return { authenticated, displayName };
}

export async function signOutAndGoHome() {
  try {
    await createClient().auth.signOut();
  } finally {
    window.location.assign("/");
  }
}

const itemClass = "flex min-h-11 items-center gap-3 rounded-sm px-3 text-sm text-foreground transition-colors hover:bg-accent focus-visible:bg-accent";

export function AccountNav({ account }: { account: AccountState }) {
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  if (!account.authenticated) {
    return <Link href="/login" className="inline-flex h-11 items-center gap-2 rounded-sm px-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
      <CircleUserRound className="size-4 shrink-0" aria-hidden="true" />Entrar
    </Link>;
  }

  const name = account.displayName || "Minha conta";
  return <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger className="inline-flex h-11 max-w-48 items-center gap-2 rounded-sm px-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground data-[state=open]:text-foreground" aria-label={`Conta de ${name}`}>
      <CircleUserRound className="size-4 shrink-0" aria-hidden="true" />
      <span className="hidden truncate sm:inline">{name}</span>
      <ChevronDown className="size-3.5 shrink-0" aria-hidden="true" />
    </PopoverTrigger>
    <PopoverContent align="end" sideOffset={8} className="w-60 rounded-sm border-border bg-popover p-1.5">
      <p className="truncate px-3 pb-2 pt-1.5 text-xs text-muted-foreground">{name}</p>
      <nav aria-label="Sua conta" className="grid">
        <Link href="/perfil" onClick={() => setOpen(false)} className={itemClass}><UserRound className="size-4 text-muted-foreground" aria-hidden="true" />Meu perfil</Link>
        <Link href="/perfil/portfolio" onClick={() => setOpen(false)} className={itemClass}><FolderOpen className="size-4 text-muted-foreground" aria-hidden="true" />Portfólio</Link>
        <span className="my-1 h-px bg-border" aria-hidden="true" />
        <button type="button" disabled={leaving} onClick={() => { setLeaving(true); void signOutAndGoHome(); }} className={`${itemClass} w-full text-left disabled:opacity-60`}>
          <LogOut className="size-4 text-muted-foreground" aria-hidden="true" />{leaving ? "Saindo..." : "Sair"}
        </button>
      </nav>
    </PopoverContent>
  </Popover>;
}
