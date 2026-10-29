"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CircleUserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function AccountNav({ configured }: { configured: boolean }) {
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
  const label = authenticated ? displayName || "Minha conta" : "Entrar";
  const accessibleLabel = authenticated ? `Perfil de ${label}` : label;
  return <Link href={authenticated ? "/perfil" : "/login"} aria-label={accessibleLabel} title={label} className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-xs font-bold text-muted-foreground transition hover:border-primary hover:text-primary"><CircleUserRound className="size-4 shrink-0" aria-hidden="true" /><span className="hidden max-w-32 truncate sm:inline">{label}</span></Link>;
}
