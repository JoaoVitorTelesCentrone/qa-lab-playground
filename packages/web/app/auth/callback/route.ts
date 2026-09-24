import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { VIEW_ONLY_LAUNCH } from "@/lib/product/launch";

export async function GET(request: Request) {
  if (VIEW_ONLY_LAUNCH) {
    return NextResponse.json({ error: "Autenticação indisponível durante o lançamento editorial." }, { status: 404 });
  }

  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const requestedNext = searchParams.get("next") ?? "/lab";
  const next = requestedNext.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : "/lab";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
