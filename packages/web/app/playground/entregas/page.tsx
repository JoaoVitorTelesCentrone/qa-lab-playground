import { redirect } from "next/navigation";
import { DeliverablesWorkbench } from "./workbench";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Entregas do ExpenseFlow Challenge" };

export default async function Page() {
  if (!isSupabaseConfigured()) redirect("/login?next=/playground/entregas");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/playground/entregas");

  return <DeliverablesWorkbench />;
}