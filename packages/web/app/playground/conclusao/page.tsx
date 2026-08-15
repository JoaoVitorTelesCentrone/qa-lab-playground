import { redirect } from "next/navigation";
import { CompletionClient } from "./completion-client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Conclusao do ExpenseFlow Challenge" };

export default async function Page() {
  if (!isSupabaseConfigured()) redirect("/login?next=/playground/conclusao");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/playground/conclusao");

  return <CompletionClient />;
}