import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { findLabByNumber, isLabReleased } from "./lib/playground/catalog";

// --- Superfície pública ------------------------------------------------------
// A home é o produto: jornada do aluno, os quatro ambientes de prática e o
// catálogo de Labs. Conta (login, cadastro, recuperação, perfil) está aberta
// porque sem ela não há progresso salvo — o backend é a fonte de verdade.
//
// Rotas fora desta allowlist continuam bloqueadas e redirecionam para o Blog.
// Para reabrir uma página, basta acrescentar o prefixo aqui.
const PUBLIC_PREFIXES = [
  "/api", "/api-docs", "/blog", "/pesquisa",
  // Labs e desafios
  "/labs", "/playground",
  // Ambientes de prática (lib/product/apps.ts)
  "/shop", "/financas", "/agendamentos", "/crm",
  // Conta
  "/auth", "/login", "/cadastro", "/recuperar", "/perfil", "/waitlist",
  // Portfólio público do aluno: precisa abrir para quem não tem conta, senão o
  // link que ele compartilha cai no Blog.
  "/portfolio",
];

const labRouteNumbers: Record<string, number> = {
  "/labs/login": 4,
  "/labs/waits": 5,
  "/labs/api-crud": 21,
};

// Rotas que exigem login. A home, o catálogo e os ambientes de prática são
// abertos de propósito: dá para experimentar antes de criar conta. O que
// depende de estado do aluno (perfil, entregas, conclusão) exige sessão.
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

  if (pathname.startsWith("/labs/")) {
    const explicitNumber = Number(pathname.split("/")[2]);
    const labNumber = Number.isInteger(explicitNumber) ? explicitNumber : labRouteNumbers[pathname];
    const lab = labNumber ? findLabByNumber(labNumber) : null;
    if (lab && !isLabReleased(lab)) {
      const waitlist = request.nextUrl.clone();
      waitlist.pathname = "/waitlist";
      waitlist.search = "";
      waitlist.searchParams.set("lab", String(lab.number));
      return NextResponse.redirect(waitlist);
    }
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
