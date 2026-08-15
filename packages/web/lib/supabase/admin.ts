import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cliente com a chave de serviço: ignora RLS.
//
// Só pode ser usado no servidor e só para leitura agregada de telemetria, onde
// o número precisa somar o produto inteiro. Nenhuma rota do aluno passa por
// aqui — o caminho normal continua sendo o cliente com a chave anônima, que
// respeita RLS.

export function hasServiceRole() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Chave de serviço do Supabase não configurada.");
  return createSupabaseClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
