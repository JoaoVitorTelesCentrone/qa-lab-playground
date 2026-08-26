import { NextResponse, type NextRequest } from "next/server";

// Ambiente de playground: todas as páginas e APIs chegam aos seus handlers.
// Regras de domínio e isolamento de dados continuam nos próprios handlers e
// no banco, mas não existe gate global de lançamento, login, plano ou admin.
export function proxy(request: NextRequest) {
  return NextResponse.next({ request });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
