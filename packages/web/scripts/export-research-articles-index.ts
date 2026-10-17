import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

type ResearchWork = {
  id?: string;
  title: string;
  abstract?: string;
  authors?: string[];
  year?: number;
  publishedAt?: string;
  discoveredAt?: string;
  query?: string;
  source?: string;
  venue?: string;
  doi?: string;
  url?: string;
  topics?: string[];
};

type ResearchLibrary = { updatedAt?: string; items: ResearchWork[] };

const root = resolve(process.cwd(), "../..");
const inputPath = resolve(process.cwd(), "data/research-library.generated.json");
const outputPath = resolve(root, "docs/INDICE_ARTIGOS_CIENTIFICOS_QA.md");
const topicsDirectory = resolve(root, "docs/referencias-qa");
const globalSummaryPath = resolve(root, "docs/RESUMO_GERAL_ARTIGOS_QA.md");
const library = JSON.parse(await readFile(inputPath, "utf8")) as ResearchLibrary;

const topicRules: Array<[RegExp, string]> = [
  [/defect prediction|software fault prediction|bug prediction|defect detection|fault localization/i, "Predição e localização de defeitos"],
  [/test automation|automated testing|automated software testing|test case generation|testing tools|test prioritization/i, "Automação e geração/priorização de testes"],
  [/software reliability|reliability growth|availability testing|resilien|kubernetes cluster/i, "Confiabilidade e resiliência"],
  [/security|secure|cyber|deepfake|uav|wearable vision/i, "Segurança e validação de sistemas"],
  [/accessibility|accessible|screen reader/i, "Acessibilidade"],
  [/performance|load testing|stress testing|scalability|capacity/i, "Performance e capacidade"],
  [/large language model|\bllm\b|agentic ai|artificial intelligence|\bai[- ]|machine learning|deep learning|neural|quantum|generative|transformer|graph neural/i, "IA/ML aplicada à qualidade"],
  [/data quality|data contract|etl|\bdbt\b|data pipeline/i, "Qualidade e engenharia de dados"],
  [/requirement|agile|scrum|software process|curriculum|education|teaching/i, "Processos, requisitos e formação em QA"],
  [/quality model|quality measurement|quality metric|quality assessment|quality attribute|iso\/iec 25010|iso 25010|iso\/iec 9126|software quality in use/i, "Modelos e métricas de qualidade"],
  [/software testing|software test|\btesting\b|test method|test management|verification and validation|black.box/i, "Fundamentos e métodos de teste"],
  [/software quality assurance|\bsqa\b|quality engineering|software quality|software assurance/i, "Garantia e engenharia de qualidade"],
  [/dataset|replication package|benchmark dataset/i, "Datasets e pacotes de replicação"],
];

function classifyTopic(work: ResearchWork) {
  // Classifique pelo título primeiro: abstracts e palavras-chave amplas como
  // “dataset” ou “reliability” aparecem em estudos sem serem seu tema central.
  const titleMatches = topicRules.filter(([pattern]) => pattern.test(work.title)).map(([, topic]) => topic);
  if (titleMatches.length) return [...new Set(titleMatches)].join("; ");

  const tags = (work.topics ?? []).join(" ");
  const tagMatches = topicRules.slice(0, 12).filter(([pattern]) => pattern.test(tags)).map(([, topic]) => topic);
  return [...new Set(tagMatches)].join("; ") || "Engenharia de software (relevância para QA a confirmar)";
}

function classifyWorkType(work: ResearchWork) {
  const title = work.title.toLowerCase();
  const venue = (work.venue ?? "").toLowerCase();
  if (/dataset|replication package|benchmark package/.test(title)) return "Dataset / pacote de replicação";
  if (/\barxiv\b|research square|ssrn/.test(venue) || work.source === "arXiv") return "Preprint / manuscrito em repositório (status editorial não inferido)";
  if (/zenodo|repository|repository report|technical report|status of /.test(venue) || /technical report|status of /.test(title)) return "Relatório ou depósito em repositório";
  if (work.source === "Curated" && (/iso\/iec|swebok|guide to the software engineering body|tmap|quality engineering for agile/.test(title))) return "Norma, corpo de conhecimento ou referência técnica";
  if (work.source === "Curated") return "Referência acadêmica curada (verificar tipo)";
  return "Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)";
}

function escapeCell(value: string) {
  return value.replaceAll("|", "\\|").replaceAll("\r", " ").replaceAll("\n", " ").trim();
}

function topicSlug(topic: string) {
  return topic.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function renderRows(works: ResearchWork[]) {
  return [...works]
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || a.title.localeCompare(b.title, "pt-BR"))
    .map((work) => {
      const href = work.doi || work.url;
      const title = escapeCell(work.title || "Título não informado");
      const linkedTitle = href ? `[${title}](${href})` : title;
      const authors = escapeCell((work.authors ?? []).join(", ") || "Autoria não informada");
      const origin = escapeCell(work.venue || "Não informado nos metadados");
      const provider = escapeCell(work.source || "Não informado");
      const year = work.year ?? (work.publishedAt ? work.publishedAt.slice(0, 4) : "—");
      return `| ${linkedTitle}<br><sub>${authors}</sub> | ${year} | ${origin} | ${provider} | ${escapeCell(classifyTopic(work))} | ${classifyWorkType(work)} |`;
    });
}

function markdownLink(label: string, href?: string) {
  return href ? `[${label}](${href})` : label;
}

function recordSynthesis(markdown: string, title: string) {
  const lines = markdown.split(/\r?\n/);
  const normalizeTitle = (value: string) => value.normalize("NFKC").replace(/\s+/g, " ").trim().toLocaleLowerCase("pt-BR");
  const targetTitle = normalizeTitle(title);
  const headingIndex = lines.findIndex((line) => line.startsWith("## ") && normalizeTitle(line.slice(3)) === targetTitle);
  if (headingIndex < 0) return undefined;
  let end = lines.findIndex((line, index) => index > headingIndex && line.startsWith("## "));
  if (end < 0) end = lines.length;
  return lines.slice(headingIndex + 1, end).join("\n").trim();
}

function renderDossierWork(work: ResearchWork, synthesis?: string) {
  const topics = classifyTopic(work);
  const publishedAt = work.publishedAt || "Não informado";
  const abstract = work.abstract?.trim();
  const abstractText = abstract && abstract !== "Resumo nao disponivel na fonte indexada."
    ? abstract
    : "Resumo não disponível no registro local.";
  return [
    `## ${work.title || "Título não informado"}`,
    "",
    `- **Autores:** ${(work.authors ?? []).join(", ") || "não informado"}`,
    `- **Ano / data de publicação:** ${work.year ?? "não informado"} / ${publishedAt}`,
    `- **Origem ou publicação:** ${work.venue || "não informado"}`,
    `- **Base de origem do registro:** ${work.source || "não informado"}`,
    `- **Tipo de registro:** ${classifyWorkType(work)}`,
    `- **Tópicos atribuídos:** ${topics}`,
    `- **Identificador:** ${work.id || "não informado"}`,
    `- **DOI:** ${markdownLink(work.doi || "não informado", work.doi)}`,
    `- **URL registrada:** ${markdownLink(work.url || "não informado", work.url)}`,
    `- **Consulta que encontrou o registro:** ${work.query || "não informado"}`,
    `- **Data de descoberta:** ${work.discoveredAt || "não informado"}`,
    "",
    "### Resumo registrado",
    "",
    abstractText,
    "",
    "### Pontos importantes para leitura",
    "",
    synthesis || "Não há síntese editorial disponível para este registro; consultar a fonte primária antes de atribuir método, achados ou limitações.",
    "",
    "---",
    "",
  ].join("\n");
}

const globalTopicGuidance: Record<string, string> = {
  "Automação e geração/priorização de testes": "A automação aparece como forma de ampliar cobertura e acelerar feedback. Para julgar uma técnica, acompanhar manutenção dos testes, qualidade dos oráculos, custo de execução e comparação com uma linha de base realista.",
  "Confiabilidade e resiliência": "Os trabalhos tratam comportamento ao longo do tempo, disponibilidade e tolerância a falhas. Métricas de confiabilidade dependem de hipóteses sobre operação e carga; planejar testes de falha e observar recuperação complementa a taxa de sucesso nominal.",
  "Fundamentos e métodos de teste": "Os registros abrangem técnicas de desenho, execução e avaliação. Escolher método pelo risco e pela pergunta de teste, explicitar dados e critérios de cobertura, e distinguir proposta de método validado são práticas recorrentes.",
  "Garantia e engenharia de qualidade": "Qualidade é construída ao longo do ciclo de desenvolvimento, com evidências, critérios e feedback. Os casos aplicados mostram a utilidade de modelos estruturados, mas suas pontuações dependem de amostra, instrumento, contexto e regra de aprovação.",
  "IA/ML aplicada à qualidade": "IA/ML pode apoiar geração, análise, predição e priorização, mas depende de dados representativos, validação sem vazamento, explicabilidade apropriada e supervisão humana. Resultados em benchmarks não garantem desempenho no produto real.",
  "Modelos e métricas de qualidade": "Modelos ajudam a organizar atributos, não substituem critérios contextualizados. Validar a métrica, registrar pesos e pressupostos, e combinar qualidade do produto com qualidade em uso evita números precisos sem significado operacional.",
  "Predição e localização de defeitos": "Esta é a maior pasta. A literatura enfatiza desbalanceamento, mudança entre projetos/versões, qualidade dos rótulos, seleção de métricas e prevenção de vazamento. Medir recall, custo de inspeção, calibração e estabilidade junto à acurácia ajuda a avaliar utilidade real.",
  "Processos, requisitos e formação em QA": "Requisitos claros, trabalho integrado ao fluxo ágil e capacitação apoiam prevenção de defeitos. Métricas de processo são sinais contextuais e não devem ser confundidas com qualidade do produto ou usadas isoladamente para avaliar pessoas.",
  "Segurança e validação de sistemas": "A evidência desta pasta é pequena e inclui um registro sem resumo. O tema exige evidências rastreáveis, validação reproduzível e avaliação proporcional ao risco; confirmar o artigo integral antes de adotar recomendações técnicas.",
};

const groups = new Map<string, ResearchWork[]>();
for (const work of library.items) {
  const topic = classifyTopic(work).split("; ")[0];
  groups.set(topic, [...(groups.get(topic) ?? []), work]);
}

const providers = new Map<string, number>();
for (const work of library.items) providers.set(work.source || "Não informado", (providers.get(work.source || "Não informado") ?? 0) + 1);

const lines = [
  "# Índice de artigos e referências acadêmicas de QA",
  "",
  `Inventário dos **${library.items.length} registros** da biblioteca acadêmica do QA Lab (\`packages/web/data/research-library.generated.json\`). Snapshot dos metadados: **${library.updatedAt ?? "data não informada"}**. Gere novamente com \`bun run research:index\` dentro de \`packages/web\`.`,
  "",
  "## Como ler este índice",
  "",
  "- **Origem/publicação** é o periódico, conferência, editora, repositório ou veículo declarado nos metadados. **Indexado por** é a base que forneceu o registro (OpenAlex, Crossref, Semantic Scholar, arXiv ou curadoria QA Lab).",
  "- **Tópico** é uma classificação editorial inferida principalmente do título e, quando necessário, das tags disponíveis; serve para navegação e não substitui leitura crítica do artigo. Quando a relevância para QA não fica clara, isso é sinalizado.",
  "- **Tipo** evita tratar datasets, relatórios, normas e preprints como artigos revisados por pares. O status de revisão por pares não foi auditado individualmente; confira o veículo e a página do trabalho antes de citá-lo como evidência científica.",
  "- Os links apontam para DOI ou URL registrada na biblioteca. Metadados ausentes aparecem como “não informado”.",
  "",
  "## Resumo por tópico",
  "",
  "| Tópico | Registros |",
  "| --- | ---: |",
  ...[...groups.entries()].sort(([a], [b]) => a.localeCompare(b, "pt-BR")).map(([topic, works]) => `| [${topic}](referencias-qa/${topicSlug(topic)}/README.md) | ${works.length} |`),
  "| **Total** | **" + library.items.length + "** |",
  "",
  "### Registros por base de origem",
  "",
  "| Base | Registros |",
  "| --- | ---: |",
  ...[...providers.entries()].sort(([a], [b]) => a.localeCompare(b, "pt-BR")).map(([provider, count]) => `| ${provider} | ${count} |`),
  "",
  "## Inventário completo",
];

for (const [topic, works] of [...groups.entries()].sort(([a], [b]) => a.localeCompare(b, "pt-BR"))) {
  lines.push("", `### ${topic}`, "", "| Trabalho e autores | Ano | Origem/publicação | Indexado por | Tópico(s) abordado(s) | Tipo |", "| --- | ---: | --- | --- | --- | --- |");
  lines.push(...renderRows(works));
}

const sortedGroups = [...groups.entries()].sort(([a], [b]) => a.localeCompare(b, "pt-BR"));
const directoryIndex = [
  "# Referências acadêmicas por tópico",
  "",
  `Coleção temática dos **${library.items.length} registros** da biblioteca QA Lab. Os links de cada título apontam para DOI ou página pública do trabalho. Metadados extraídos em ${library.updatedAt ?? "data não informada"}.`,
  "",
  "A classificação ajuda a encontrar os trabalhos; verifique tipo de publicação e revisão por pares na origem antes de usar um registro como evidência científica.",
  "",
  "| Pasta | Registros | Referências | Síntese | Dossiê completo |",
  "| --- | ---: | --- | --- | --- |",
  ...sortedGroups.map(([topic, works]) => `| \`${topicSlug(topic)}/\` | ${works.length} | [${topic}](./${topicSlug(topic)}/README.md) | [Artigos](./${topicSlug(topic)}/sintese-artigos.md) | [Dossiê](./${topicSlug(topic)}/dossie-completo.md) |`),
  "",
  `Resumo geral: [RESUMO_GERAL_ARTIGOS_QA.md](../RESUMO_GERAL_ARTIGOS_QA.md).`,
  "",
  "Índice completo: [INDICE_ARTIGOS_CIENTIFICOS_QA.md](../INDICE_ARTIGOS_CIENTIFICOS_QA.md).",
];
await mkdir(topicsDirectory, { recursive: true });
await writeFile(resolve(topicsDirectory, "README.md"), `${directoryIndex.join("\n")}\n`, "utf8");

for (const [topic, works] of sortedGroups) {
  const topicDirectory = resolve(topicsDirectory, topicSlug(topic));
  await mkdir(topicDirectory, { recursive: true });
  const synthesisPath = resolve(topicDirectory, "sintese-artigos.md");
  const synthesisMarkdown = await readFile(synthesisPath, "utf8").catch(() => "");
  const topicIndex = [
    `# ${topic}`,
    "",
    `**${works.length} registros.** Classificação editorial por assunto principal; alguns trabalhos também abordam os tópicos secundários indicados na tabela.`,
    "",
    "| Trabalho e autores | Ano | Origem/publicação | Indexado por | Tópico(s) abordado(s) | Tipo |",
    "| --- | ---: | --- | --- | --- | --- |",
    ...renderRows(works),
    "",
    "[Ler síntese: o que importa em cada artigo](./sintese-artigos.md).",
    "",
    "[Abrir dossiê completo: metadados e resumos registrados](./dossie-completo.md).",
    "",
    "Voltar para [todas as pastas](../README.md) ou para o [índice completo](../../INDICE_ARTIGOS_CIENTIFICOS_QA.md).",
  ];
  await writeFile(resolve(topicDirectory, "README.md"), `${topicIndex.join("\n")}\n`, "utf8");

  const sortedWorks = [...works].sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || a.title.localeCompare(b.title, "pt-BR"));
  const dossier = [
    `# Dossiê completo: ${topic}`,
    "",
    `**${works.length} registros.** Este arquivo reúne os metadados disponíveis na biblioteca local, o resumo/abstract registrado e os pontos importantes da síntese editorial de cada trabalho. Os resumos permanecem na língua e na forma em que foram indexados; ausência de resumo ou de metadados é indicada explicitamente.`,
    "",
    `Snapshot dos metadados: **${library.updatedAt ?? "data não informada"}**. Classificação do tópico e tipo de registro são editoriais; confira a fonte primária antes de citar ou aplicar resultados.`,
    "",
    `[Voltar às referências da pasta](./README.md) · [Resumo geral de toda a biblioteca](../../RESUMO_GERAL_ARTIGOS_QA.md) · [Síntese dos pontos importantes](./sintese-artigos.md)`,
    "",
    ...sortedWorks.map((work) => renderDossierWork(work, recordSynthesis(synthesisMarkdown, work.title))),
  ].join("\n");
  await writeFile(resolve(topicDirectory, "dossie-completo.md"), `${dossier}\n`, "utf8");
}

const globalSummary = [
  "# Resumo geral da biblioteca de artigos e referências de QA",
  "",
  `Este documento reúne a leitura transversal e as sínteses artigo por artigo dos **${library.items.length} registros** catalogados no QA Lab. Snapshot dos metadados: **${library.updatedAt ?? "data não informada"}**.`,
  "",
  "A biblioteca mistura artigos de periódicos e conferências, preprints, estudos depositados em repositórios, datasets, pacotes de replicação, normas e guias profissionais. O status de revisão por pares não foi auditado individualmente. As conclusões resumidas abaixo refletem o que os registros e resumos disponíveis reportam; não são uma revisão sistemática independente nem validação dos resultados.",
  "",
  "## Visão geral do acervo",
  "",
  `O acervo tem **${library.items.length} itens distribuídos em ${sortedGroups.length} pastas**. A pasta de predição/localização de defeitos reúne 67 registros e concentra quase metade do material; portanto, a distribuição não representa um equilíbrio entre áreas de QA.`,
  "",
  "| Área | Registros | Dossiê |",
  "| --- | ---: | --- |",
  ...sortedGroups.map(([topic, works]) => `| ${topic} | ${works.length} | [Abrir dossiê](./referencias-qa/${topicSlug(topic)}/dossie-completo.md) |`),
  "",
  "## Síntese transversal",
  "",
  "### 1. Qualidade depende de contexto e evidência",
  "",
  "Modelos e normas oferecem vocabulário comum para atributos como adequação funcional, confiabilidade, usabilidade, eficiência, segurança e manutenibilidade. A aplicação prática exige escolher atributos relevantes ao domínio, convertê-los em critérios observáveis e registrar instrumento, amostra, pesos e limites. Uma pontuação agregada sem esses detalhes pode esconder diferenças importantes.",
  "",
  "### 2. Dados e desenho experimental determinam a confiança nos resultados",
  "",
  "Nos estudos de IA/ML e previsão de defeitos, reaparecem desbalanceamento, ruído de rótulo, atributos redundantes, datasets envelhecidos, mudança entre projetos/versões e risco de vazamento entre treino e teste. Acurácia isolada é insuficiente; recall, F1, MCC, calibração, esforço de inspeção, estabilidade e validação externa respondem a perguntas distintas. Comparações devem manter divisões e pré-processamento justos.",
  "",
  "### 3. Automação e IA são apoio ao trabalho de qualidade",
  "",
  "Geração/priorização de testes, embeddings, modelos generativos, redes em grafo e explicações podem acelerar análise e orientar atenção. A utilidade depende de oráculos confiáveis, manutenção, custo, integração ao fluxo e revisão humana. Propostas de arquitetura e resultados de benchmark devem ser distinguidos de evidência de uso em produção.",
  "",
  "### 4. Prevenção envolve requisitos, processo e aprendizagem",
  "",
  "A clareza de requisitos, a validação contínua, os critérios de aceite e o feedback ao longo do ciclo reduzem ambiguidades que chegam aos testes. Práticas ágeis e DevOps ajudam a aproximar qualidade do desenvolvimento, mas métricas de processo precisam ser interpretadas como sinais do sistema, não como medida isolada de qualidade ou desempenho individual.",
  "",
  "### 5. Sistemas críticos pedem validação proporcional ao risco",
  "",
  "Segurança, confiabilidade e resiliência requerem rastreabilidade, cenários de falha, verificação independente e evidências reproduzíveis. O número de registros na pasta de segurança é pequeno e parte deles não tem resumo disponível; as recomendações dessa área precisam ser confirmadas nas fontes integrais.",
  "",
  "## Leitura por área e síntese de cada registro",
  "",
  "As seções seguintes preservam a síntese individual de cada trabalho. Abra os títulos para ir à fonte registrada; o dossiê da pasta inclui metadados completos e o abstract disponível.",
];

for (const [topic, works] of sortedGroups) {
  const topicDirectory = resolve(topicsDirectory, topicSlug(topic));
  const synthesisMarkdown = await readFile(resolve(topicDirectory, "sintese-artigos.md"), "utf8").catch(() => "");
  globalSummary.push(
    "",
    `### ${topic} (${works.length})`,
    "",
    globalTopicGuidance[topic] || "Consulte as sínteses individuais e verifique o contexto, método e tipo de evidência de cada registro.",
    "",
    `[Dossiê completo da pasta](./referencias-qa/${topicSlug(topic)}/dossie-completo.md) · [Índice de referências](./referencias-qa/${topicSlug(topic)}/README.md)`,
    "",
  );
  const sortedWorks = [...works].sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || a.title.localeCompare(b.title, "pt-BR"));
  for (const work of sortedWorks) {
    const synthesis = recordSynthesis(synthesisMarkdown, work.title);
    globalSummary.push(
      `#### ${markdownLink(work.title, work.doi || work.url)}`,
      "",
      `**${work.year ?? "Ano não informado"} · ${work.venue || "Origem não informada"} · ${classifyWorkType(work)}**`,
      "",
      synthesis || "Síntese não disponível no índice editorial; consulte o dossiê e a fonte primária.",
      "",
    );
  }
}

globalSummary.push(
  "## Como usar este resumo",
  "",
  "Use a síntese transversal para navegar pelos temas e as seções individuais para localizar a contribuição ou limitação de um registro. Para detalhes bibliográficos e resumo original, abra o dossiê da pasta. Para uma citação acadêmica, confirme título, autoria, venue, DOI, versão e status editorial na fonte primária.",
  "",
  "[Índice bibliográfico completo](./INDICE_ARTIGOS_CIENTIFICOS_QA.md) · [Índice de pastas](./referencias-qa/README.md)",
);
await writeFile(globalSummaryPath, `${globalSummary.join("\n")}\n`, "utf8");

await writeFile(outputPath, `${lines.join("\n")}\n`, "utf8");
console.log(`Exportados ${library.items.length} registros, ${sortedGroups.length} dossiês temáticos e o resumo geral em ${globalSummaryPath}`);
