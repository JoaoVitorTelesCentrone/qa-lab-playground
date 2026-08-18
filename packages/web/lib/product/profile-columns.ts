// Leitura e escrita de `profiles` tolerantes a coluna nova.
//
// As migrações deste projeto sobem à mão pelo SQL Editor, então existe uma
// janela em que o código já pede uma coluna que o banco ainda não tem —
// `github_url`, criada na 0010. Nesse caso o Postgres devolve erro 42703, o
// perfil vem nulo e a página pública responde 404: um campo novo derrubaria o
// portfólio de todo mundo até alguém lembrar de rodar a migração.
//
// Aqui a regra é a mesma do resto do produto (ver "Pendências" no
// PRODUCTIZATION_PLAN): sem a migração o produto abre, só não persiste aquilo.
// A leitura repete sem a coluna e o campo fica vazio.

type QueryResult<T> = { data: T | null; error: { code?: string; message?: string } | null };

/** Erro de coluna inexistente (42703), e não uma falha real de rede ou RLS. */
export function isMissingColumn(error: { code?: string; message?: string } | null, column: string) {
  if (!error) return false;
  return error.code === "42703" || Boolean(error.message?.includes(column));
}

/**
 * Roda a consulta com a coluna opcional e, se ela ainda não existir no banco,
 * repete sem. Devolve null só quando a consulta falha de verdade.
 */
export async function selectWithOptionalColumn<T>(
  run: (columns: string) => PromiseLike<QueryResult<T>>,
  columns: string,
  optional: string,
): Promise<T | null> {
  const first = await run(`${columns},${optional}`);
  if (!first.error) return first.data;
  if (!isMissingColumn(first.error, optional)) return null;
  const retry = await run(columns);
  return retry.error ? null : retry.data;
}
