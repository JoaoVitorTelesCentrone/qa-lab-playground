// Nome de usuário do portfólio.
//
// Módulo próprio, e não dentro de store.ts, porque o formulário de conclusão do
// Lab normaliza enquanto o aluno digita — importar do store arrastaria o
// cliente do Supabase para o bundle do navegador.

/** Minúsculas, números e hífen. Acento vira a letra sem acento. */
export function normalizeUsername(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);
}
