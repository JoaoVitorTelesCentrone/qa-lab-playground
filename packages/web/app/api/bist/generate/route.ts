import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 300;

const BIST_API = process.env.BIST_API_URL ?? "http://127.0.0.1:8000/api";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ detail: "Entre para gerar artefatos." }, { status: 401 });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ detail: "Entre para gerar artefatos." }, { status: 401 });

  try {
    const response = await fetch(`${BIST_API}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-BIST-Guest-ID": request.headers.get("X-BIST-Guest-ID") ?? crypto.randomUUID(),
      },
      body: await request.text(),
      signal: AbortSignal.timeout(300_000),
    });
    const body = await response.text();
    return new NextResponse(body, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" },
    });
  } catch {
    return NextResponse.json(
      { detail: "O motor BIST não iniciou. Reinicie o app com `bun run dev:web` na raiz do projeto." },
      { status: 503 },
    );
  }
}
