import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cliente com a chave de serviço: ignora RLS.
//
// Só pode ser usado no servidor. As exceções ao RLS são deliberadas e ficam
// concentradas aqui:
//
//   1. telemetria agregada, onde o número precisa somar o produto inteiro;
//   2. assinar a URL dos anexos de uma evidência PUBLICADA, para o visitante
//      anônimo da página de case (lib/product/evidence-storage.ts) — ali a
//      autorização é do nosso código, que já filtrou `published = true`.
//
//   3. confirmação de pagamento pelo webhook autenticado do Mercado Pago;
//      o navegador nunca escolhe nem altera o plano de uma conta.
//
// Fora isso o caminho continua sendo o cliente com a chave anônima, que
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
