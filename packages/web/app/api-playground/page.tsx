import Link from "next/link";
import { BookOpen, FlaskConical } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { ApiPlaygroundClient } from "./playground-client";

export const metadata = { title: "API Playground", description: "Execute requisições contra uma API educacional com falhas reproduzíveis." };

export default async function ApiPlaygroundPage() {
  let userId: string | null = null; let plan = "free"; let projects: { id: string; title: string }[] = [];
  if (isSupabaseConfigured()) { const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (user) { userId = user.id; const [profile, projectResult] = await Promise.all([supabase.from("profiles").select("plan").eq("id", user.id).maybeSingle(), supabase.from("projects").select("id,title").eq("user_id", user.id).eq("status", "active").order("updated_at", { ascending: false })]); plan = profile.data?.plan ?? "free"; projects = projectResult.data ?? []; } }
  return <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14"><header className="flex flex-col gap-5 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between"><div className="max-w-3xl"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-mint"><FlaskConical className="size-4" /> API Lab</div><h1 className="mt-4 text-4xl font-black tracking-tight text-off-white sm:text-5xl">Investigue contratos, não adivinhe bugs.</h1><p className="mt-4 leading-7 text-[#8B949E]">Alterne entre o comportamento correto e uma falha determinística. A mesma requisição produz o mesmo problema no navegador, Postman ou teste automatizado.</p></div><Link href="/api-docs" className="inline-flex h-10 items-center gap-2 self-start rounded-lg border border-mint/25 px-4 text-xs font-bold text-mint hover:bg-mint/10"><BookOpen className="size-4" /> Documentação</Link></header><ApiPlaygroundClient userId={userId} plan={plan} projects={projects} /></div>;
}
