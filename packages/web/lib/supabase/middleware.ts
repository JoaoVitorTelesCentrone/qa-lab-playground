import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "./config";

// Renova a sessão do Supabase a cada request. É aqui (e não nos Server
// Components) que os cookies de auth são reescritos — sem isto o access token
// expira em ~1h e o usuário aparece deslogado mesmo com refresh token válido.
// Ver https://supabase.com/docs/guides/auth/server-side/nextjs
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Sem env de Supabase o app roda em modo anônimo: não há o que renovar.
  if (!isSupabaseConfigured()) return response;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  // IMPORTANTE: getUser() força a validação/refresh do token. Não inserir lógica
  // entre createServerClient e getUser, sob risco de sessões intermitentes.
  await supabase.auth.getUser();

  return response;
}
