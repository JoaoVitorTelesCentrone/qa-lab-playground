import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// --- Lançamento enxuto -------------------------------------------------------
// No lançamento o site público expõe apenas o Blog e a Biblioteca de
// referências científicas (/pesquisa). O LinkedIn é um link externo no header.
//
// Todo o resto do produto (lab, playground, cursos, estudos, login, cadastro,
// home institucional, etc.) continua no código, mas fica bloqueado: qualquer
// rota fora da allowlist é redirecionada para o Blog. Para reabrir uma página
// no futuro, basta adicionar o prefixo em PUBLIC_PREFIXES.
const PUBLIC_PREFIXES = ["/api", "/api-docs", "/blog", "/labs", "/pesquisa", "/playground", "/shop"];

// Rotas que exigem login quando o produto estiver totalmente liberado. Enquanto
// o lançamento estiver enxuto elas ficam bloqueadas pelo gate acima, então esta
// lista só volta a valer quando PUBLIC_PREFIXES for ampliado. /pesquisa é
// pública no lançamento e por isso não aparece aqui.
const protectedRoutes = ["/lab", "/perfil", "/estudos", "/cursos", "/playground/entregas", "/playground/conclusao", "/lab/refinamento", "/lab/triagem", "/lab/logs", "/lab/criterios"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Gate do lançamento: fora da allowlist, tudo vai para o Blog. A home ("/") é
  // pública e tratada à parte porque não tem prefixo.
  const isPublic = pathname === "/" || PUBLIC_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  if (!isPublic) {
    const blog = request.nextUrl.clone();
    blog.pathname = "/blog";
    blog.search = "";
    return NextResponse.redirect(blog);
  }

  // Páginas públicas do lançamento (Blog e /pesquisa) não exigem login, então
  // não tocamos no Supabase aqui — evita bater em auth.getUser() a cada request
  // e não depende do projeto Supabase estar de pé para o site abrir.
  const needsAuth = protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  if (!needsAuth) return NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    if (!needsAuth) return NextResponse.next({ request });
    const login = request.nextUrl.clone();
    login.pathname = "/login";
    login.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(login);
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookies) {
        cookies.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (needsAuth && !user) {
    const login = request.nextUrl.clone();
    login.pathname = "/login";
    login.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(login);
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
