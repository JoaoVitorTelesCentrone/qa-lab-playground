import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { VIEW_ONLY_LAUNCH } from "@/lib/product/launch";
import { safeAuthDestination } from "@/lib/auth/redirect";
import { normalizeAttribution } from "@/lib/product/attribution";

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
      const { data: { user } } = await supabase.auth.getUser();
      const attribution = {
        acquisition_source: normalizeAttribution(searchParams.get("utm_source")) ?? null,
        acquisition_medium: normalizeAttribution(searchParams.get("utm_medium")) ?? null,
        acquisition_campaign: normalizeAttribution(searchParams.get("utm_campaign")) ?? null,
      };
      if (user && Object.values(attribution).some(Boolean)) {
        await supabase.from("profiles").update(attribution).eq("id", user.id).is("acquisition_source", null);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  const loginUrl = new URL("/login", origin);
  loginUrl.searchParams.set("error", "auth");
  loginUrl.searchParams.set("next", next);
  return NextResponse.redirect(loginUrl);
}
