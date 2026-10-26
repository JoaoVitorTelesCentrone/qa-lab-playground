import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { ensurePersonalBoard } from "@/lib/board/store";
import { BddGenerator } from "./bdd-generator";

export const metadata = { title: "Gerador de BDD | QA Lab", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function BddPage() {
  let signedIn = false;
  let boardId: string | null = null;
  let drafts: { id: string; title: string; content: string; updated_at: string }[] = [];
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      signedIn = true;
      const [draftResult, boardResult] = await Promise.all([
        supabase.from("drafts").select("id,title,content,updated_at").eq("user_id", user.id).eq("kind", "gherkin").order("updated_at", { ascending: false }).limit(30),
        ensurePersonalBoard().catch(() => null),
      ]);
      drafts = draftResult.data ?? [];
      boardId = boardResult?.boardId ?? null;
    }
  }
  return <BddGenerator initialDrafts={drafts} boardId={boardId} signedIn={signedIn} />;
}
