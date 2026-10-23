import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return Response.json({ error: "Cron nao configurado." }, { status: 503 });
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Nao autorizado." }, { status: 401 });
  }

  try {
    const { error } = await createAdminClient().from("profiles").select("id").limit(1);
    if (error) throw error;
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Supabase health cron failed", error);
    return Response.json({ ok: false }, { status: 503 });
  }
}
