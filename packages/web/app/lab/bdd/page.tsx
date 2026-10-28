import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/product/store";
import { ensurePersonalBoard } from "@/lib/board/store";
import { BddGenerator } from "./bdd-generator";

export const metadata = { title: "Gerador de BDD | QA Lab", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function BddPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=%2Flab%2Fbdd");

  const supabase = await createClient();
  const [draftResult, boardResult] = await Promise.all([
    supabase.from("drafts").select("id,title,content,updated_at").eq("user_id", user.id).eq("kind", "gherkin").order("updated_at", { ascending: false }).limit(30),
    ensurePersonalBoard().catch(() => null),
  ]);

  return <BddGenerator initialDrafts={draftResult.data ?? []} boardId={boardResult?.boardId ?? null} signedIn />;
}
