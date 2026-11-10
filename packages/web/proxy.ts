import { NextResponse, type NextRequest } from "next/server";
import { isMentorshipPath, MENTORSHIP_ENABLED } from "@/lib/product/features";
import { VIEW_ONLY_LAUNCH } from "@/lib/product/launch";
import { updateSession } from "@/lib/supabase/middleware";

// Rota interna que não existe: reescrever para ela renderiza o not-found do
// app com status 404, sem expor que a página existe atrás de uma flag.
const NOT_FOUND_PATH = "/__feature-disabled";

// Ambiente de playground: todas as páginas e APIs chegam aos seus handlers.
// Regras de domínio e isolamento de dados continuam nos próprios handlers e
// no banco. As exceções são a mentoria com a flag desligada e o lançamento
// somente leitura.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!MENTORSHIP_ENABLED && isMentorshipPath(pathname)) {
    if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.rewrite(new URL(NOT_FOUND_PATH, request.url), { status: 404 });
  }
  if (VIEW_ONLY_LAUNCH && pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "API indisponível durante o lançamento editorial." }, { status: 404 });
  }
  return updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
