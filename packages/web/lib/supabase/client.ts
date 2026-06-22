import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // O cliente pode ser instanciado por módulos client-side durante o build.
  // As telas de conta verificam a configuração antes de executar chamadas.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key";
  return createBrowserClient(url, key);
}
