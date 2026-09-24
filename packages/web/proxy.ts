import { NextResponse, type NextRequest } from "next/server";
import { VIEW_ONLY_LAUNCH } from "@/lib/product/launch";

// Ambiente de playground: todas as páginas e APIs chegam aos seus handlers.
// Regras de domínio e isolamento de dados continuam nos próprios handlers e
// no banco, mas não existe gate global de lançamento, login, plano ou admin.
export function proxy(request: NextRequest) {
  if (VIEW_ONLY_LAUNCH && request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "API indisponível durante o lançamento editorial." }, { status: 404 });
  }
  return NextResponse.next({ request });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
