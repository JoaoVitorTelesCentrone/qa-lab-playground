"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Play } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Session = { id: string; status: "started" | "completed" };

export function SessionTracker({ playgroundId }: { playgroundId: string }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return;
    const supabase = createClient();
    void supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      setUserId(data.user.id);
      const { data: latest } = await supabase.from("playground_sessions").select("id,status").eq("user_id", data.user.id).eq("playground_id", playgroundId).order("started_at", { ascending: false }).limit(1).maybeSingle();
      if (latest) setSession(latest as Session);
    }).catch(() => undefined);
  }, [playgroundId]);

  if (!userId) return null;

  async function track() {
    setLoading(true);
    const supabase = createClient();
    if (session?.status === "started") {
      const { error } = await supabase.from("playground_sessions").update({ status: "completed", completed_at: new Date().toISOString() }).eq("id", session.id).eq("user_id", userId);
      if (!error) setSession({ ...session, status: "completed" });
    } else {
      const { data, error } = await supabase.from("playground_sessions").insert({ user_id: userId, playground_id: playgroundId, status: "started" }).select("id,status").single();
      if (!error && data) setSession(data as Session);
    }
    setLoading(false);
  }

  return <button type="button" onClick={track} disabled={loading} className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-neon/25 bg-neon/[0.06] px-3.5 text-xs font-bold text-neon hover:bg-neon/10 disabled:opacity-50">{loading ? <Loader2 className="size-3.5 animate-spin" /> : session?.status === "started" ? <CheckCircle2 className="size-3.5" /> : <Play className="size-3.5" />}{session?.status === "started" ? "Concluir sessão" : session?.status === "completed" ? "Iniciar nova sessão" : "Registrar sessão"}</button>;
}
