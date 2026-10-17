import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig, isSupabaseConfigured } from "./config";

// Renova a sessão do Supabase a cada request. É aqui (e não nos Server
// Components) que os cookies de auth são reescritos — sem isto o access token
// expira em ~1h e o usuário aparece deslogado mesmo com refresh token válido.
// Ver https://supabase.com/docs/guides/auth/server-side/nextjs
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Sem env de Supabase o app roda em modo anônimo: não há o que renovar.
  if (!isSupabaseConfigured()) return response;

  // Visitante novo não possui sessão para validar ou renovar. Além de evitar
  // uma chamada externa inútil, isso mantém login/cadastro disponíveis mesmo
  // durante uma instabilidade momentânea do projeto Supabase.
  const hasAuthCookie = request.cookies.getAll().some(({ name }) => name.startsWith("sb-") && name.includes("auth-token"));
  if (!hasAuthCookie) return response;

  const { url, key } = getSupabaseConfig();

  const supabase = createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANTE: getClaims() valida e renova o token. Não inserir lógica entre
  // createServerClient e esta chamada, sob risco de sessões intermitentes.
  await supabase.auth.getClaims();

  return response;
}
