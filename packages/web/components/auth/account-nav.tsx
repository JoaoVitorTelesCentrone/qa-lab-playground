"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CircleUserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function AccountNav({ configured }: { configured: boolean }) {
  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    if (!configured) return;
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => setAuthenticated(Boolean(data.user)));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setAuthenticated(Boolean(session?.user)));
    return () => data.subscription.unsubscribe();
  }, [configured]);
  return <Link href={authenticated ? "/lab" : "/login"} className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 px-3 text-xs font-bold text-[#AAB2BC] transition hover:border-mint/30 hover:text-mint"><CircleUserRound className="size-4" /><span className="hidden sm:inline">{authenticated ? "Meu Lab" : "Entrar"}</span></Link>;
}
