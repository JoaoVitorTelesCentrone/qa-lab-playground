import { createBrowserClient } from "@supabase/ssr";

// Cliente do Supabase no navegador.
//
// O `fetch` é embrulhado de propósito. Quando o projeto está fora do ar (ou o
// navegador está offline), a falha de rede vira um `TypeError: Failed to fetch`
// lançado lá dentro do auth-js — e como parte das chamadas nasce dentro da
// própria lib (`onAuthStateChange`, refresh automático de token), não há
// `.catch()` no nosso código que dê conta delas. O resultado era uma enxurrada
// de erro não tratado a cada navegação.
//
// Aqui a falha de rede é convertida em uma resposta 503. O auth-js sabe lidar
// com resposta de erro: devolve `{ data, error }` em vez de estourar. O app
// segue como deslogado, que é a verdade quando não dá para falar com o servidor.

let unreachableSince = 0;

/** Tempo em que paramos de tentar depois de uma falha de rede. */
const COOLDOWN_MS = 30_000;

function offlineResponse(reason: string) {
  return new Response(JSON.stringify({ error: "service_unavailable", error_description: reason }), {
    status: 503,
    headers: { "content-type": "application/json" },
  });
}

const resilientFetch: typeof fetch = async (input, init) => {
  // Depois de uma falha, segura as próximas por um tempo em vez de repetir a
  // tentativa a cada render — é o que fazia a navegação ficar lenta.
  if (unreachableSince && Date.now() - unreachableSince < COOLDOWN_MS) {
    return offlineResponse("Servidor indisponível — nova tentativa em instantes.");
  }

  try {
    const response = await fetch(input, init);
    unreachableSince = 0;
    return response;
  } catch (error) {
    unreachableSince = Date.now();
    if (process.env.NODE_ENV === "development") {
      console.warn("[supabase] sem resposta do projeto configurado; seguindo como deslogado.", error);
    }
    return offlineResponse("Não foi possível falar com o servidor.");
  }
};

export function createClient() {
  // O cliente pode ser instanciado por módulos client-side durante o build.
  // As telas de conta verificam a configuração antes de executar chamadas.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key";
  return createBrowserClient(url, key, { global: { fetch: resilientFetch } });
}
