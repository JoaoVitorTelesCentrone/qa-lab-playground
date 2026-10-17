import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { VIEW_ONLY_LAUNCH } from "@/lib/product/launch";
import { safeAuthDestination } from "@/lib/auth/redirect";

export async function GET(request: Request) {
  if (VIEW_ONLY_LAUNCH) {
    return NextResponse.json({ error: "Autenticação indisponível durante o lançamento editorial." }, { status: 404 });
  }

  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeAuthDestination(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  const loginUrl = new URL("/login", origin);
  loginUrl.searchParams.set("error", "auth");
  loginUrl.searchParams.set("next", next);
  return NextResponse.redirect(loginUrl);
}
