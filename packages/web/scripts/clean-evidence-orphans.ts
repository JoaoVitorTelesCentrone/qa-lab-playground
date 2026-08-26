// Faxina dos anexos de evidência órfãos.
//
// O upload acontece assim que o aluno escolhe o arquivo, antes de ele entregar
// — é o que dá barra de progresso e remoção antes do envio. O preço é que
// quem sobe um print e fecha a aba deixa o arquivo no bucket sem nenhuma
// submissão apontando para ele. Este script varre e remove esses.
//
// Roda em modo seco por padrão: só lista. Para apagar de verdade, `--apply`.
// Arquivo recém-criado é preservado (`--horas`, 24 por padrão), senão a faxina
// mataria o upload de alguém que ainda está escrevendo a evidência.
//
// Uso:
//   bun run evidence:clean              # relatório, não apaga nada
//   bun run evidence:clean -- --apply   # apaga
//   bun run evidence:clean -- --apply --horas=48

import { createClient } from "@supabase/supabase-js";

const BUCKET = "lab-evidence";
const PAGE = 100;

const args = process.argv.slice(2);
const apply = args.includes("--apply");
const graceHours = Number(args.find((arg) => arg.startsWith("--horas="))?.split("=")[1] ?? 24);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Faltam NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no ambiente.");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

type StoredFile = { path: string; createdAt: string; size: number };

/**
 * O list do Storage é por prefixo e paginado, e o caminho é
 * `{userId}/{labSlug}/{uuid}.ext` — então descemos três níveis. Entrada sem
 * `id` é pasta; com `id` é arquivo.
 */
async function walk(prefix: string): Promise<StoredFile[]> {
  const found: StoredFile[] = [];
  let offset = 0;

  for (;;) {
    const { data, error } = await supabase.storage.from(BUCKET).list(prefix, { limit: PAGE, offset });
    if (error) throw new Error(`Falha ao listar "${prefix}": ${error.message}`);
    if (!data || data.length === 0) break;

    for (const entry of data) {
      const path = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.id) {
        found.push({
          path,
          createdAt: entry.created_at ?? new Date(0).toISOString(),
          size: Number((entry.metadata as { size?: number } | null)?.size ?? 0),
        });
      } else {
        found.push(...await walk(path));
      }
    }

    if (data.length < PAGE) break;
    offset += PAGE;
  }

  return found;
}

/** Todo caminho citado em `attachments`, de qualquer submissão. */
async function referencedPaths(): Promise<Set<string>> {
  const paths = new Set<string>();
  let from = 0;

  for (;;) {
    const { data, error } = await supabase
      .from("lab_submissions")
      .select("attachments")
      .range(from, from + PAGE - 1);
    if (error) throw new Error(`Falha ao ler submissões: ${error.message}`);
    if (!data || data.length === 0) break;

    for (const row of data) {
      if (!Array.isArray(row.attachments)) continue;
      for (const file of row.attachments) {
        const path = (file as { path?: unknown })?.path;
        if (typeof path === "string" && path) paths.add(path);
      }
    }

    if (data.length < PAGE) break;
    from += PAGE;
  }

  return paths;
}

function formatBytes(bytes: number) {
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

async function main() {
  const [stored, referenced] = await Promise.all([walk(""), referencedPaths()]);
  const cutoff = Date.now() - graceHours * 60 * 60 * 1000;

  const orphans = stored.filter((file) => !referenced.has(file.path));
  const stale = orphans.filter((file) => new Date(file.createdAt).getTime() < cutoff);
  const recent = orphans.length - stale.length;

  console.log(`Arquivos no bucket: ${stored.length}`);
  console.log(`Referenciados por alguma entrega: ${referenced.size}`);
  console.log(`Órfãos: ${orphans.length} (${recent} ainda dentro da janela de ${graceHours}h)`);

  if (stale.length === 0) {
    console.log("Nada a remover.");
    return;
  }

  const total = stale.reduce((sum, file) => sum + file.size, 0);
  console.log(`\nRemovíveis: ${stale.length} · ${formatBytes(total)}`);
  for (const file of stale) console.log(`  ${file.path}  (${formatBytes(file.size)}, ${file.createdAt})`);

  if (!apply) {
    console.log("\nModo seco. Rode de novo com --apply para remover.");
    return;
  }

  // Em lotes: o remove aceita uma lista, mas uma lista gigante estoura o
  // tamanho da requisição.
  for (let index = 0; index < stale.length; index += PAGE) {
    const batch = stale.slice(index, index + PAGE).map((file) => file.path);
    const { error } = await supabase.storage.from(BUCKET).remove(batch);
    if (error) throw new Error(`Falha ao remover lote: ${error.message}`);
  }

  console.log(`\n${stale.length} arquivo(s) removido(s).`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
