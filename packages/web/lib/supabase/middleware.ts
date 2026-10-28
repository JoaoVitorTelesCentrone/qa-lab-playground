import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { requestedPath, requiresAuthentication } from "@/lib/auth/protected-routes";
import { getSupabaseConfig, isSupabaseConfigured } from "./config";

function redirectToLogin(request: NextRequest, sessionResponse: NextResponse) {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.search = "";
  loginUrl.searchParams.set(
    "next",
    requestedPath(request.nextUrl.pathname, request.nextUrl.search),
  );

  const redirectResponse = NextResponse.redirect(loginUrl);
  sessionResponse.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));
  redirectResponse.headers.set("Cache-Control", "private, no-store");
  return redirectResponse;
}

// Renova a sessão do Supabase a cada request. É aqui (e não nos Server
// Components) que os cookies de auth são reescritos — sem isto o access token
// expira em ~1h e o usuário aparece deslogado mesmo com refresh token válido.
// Ver https://supabase.com/docs/guides/auth/server-side/nextjs
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const protectedRoute = requiresAuthentication(request.nextUrl.pathname);

  // Em uma rota privada, configuração ausente nunca pode liberar conteúdo.
  if (!isSupabaseConfigured()) {
    return protectedRoute ? redirectToLogin(request, response) : response;
  }

  // Visitante novo não possui sessão para validar ou renovar. Além de evitar
  // uma chamada externa inútil, isso mantém login/cadastro disponíveis mesmo
  // durante uma instabilidade momentânea do projeto Supabase.
  const hasAuthCookie = request.cookies.getAll().some(({ name }) => name.startsWith("sb-") && name.includes("auth-token"));
  if (!hasAuthCookie) {
    return protectedRoute ? redirectToLogin(request, response) : response;
  }

  const { url, key } = getSupabaseConfig();

  const supabase = createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([name, value]) => response.headers.set(name, value));
        },
      },
    },
  );

  // IMPORTANTE: getClaims() valida e renova o token. Não inserir lógica entre
  // createServerClient e esta chamada, sob risco de sessões intermitentes.
  const { data } = await supabase.auth.getClaims();

  if (protectedRoute && !data?.claims?.sub) {
    return redirectToLogin(request, response);
  }

  if (protectedRoute) response.headers.set("Cache-Control", "private, no-store");

  return response;
}
