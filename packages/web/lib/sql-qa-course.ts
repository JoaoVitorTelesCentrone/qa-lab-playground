export type SQLQAModule = {
  id: string;
  week: number;
  duration: string;
  title: string;
  objective: string;
  concepts: string[];
  practice: string;
  deliverable: string;
  checklist: string[];
  code: string;
};

export const sqlQAModules: SQLQAModule[] = [
  {
    id: "select-and-columns", week: 1, duration: "35 min",
    title: "Leia uma tabela com SELECT",
    objective: "Buscar apenas as colunas necessárias e interpretar linhas e valores sem alterar dados.",
    concepts: ["SELECT", "FROM", "alias", "LIMIT"],
    practice: "Liste pedidos de treino com identificador, status, total e data. Compare cada coluna com seu significado no cenário.",
    deliverable: "Consulta de leitura com colunas explícitas e quantidade de resultados limitada.",
    checklist: ["Selecionou só os campos necessários.", "Usou alias para deixar o resultado legível.", "Limitou a amostra enquanto investigava."],
    code: `SELECT\n  order_id,\n  status,\n  total_amount AS total,\n  created_at\nFROM pg_temp.qa_orders\nORDER BY order_id\nLIMIT 10;`,
  },
  {
    id: "filters-and-null", week: 1, duration: "40 min",
    title: "Filtre com WHERE e trate NULL corretamente",
    objective: "Encontrar registros por condição, combinar filtros com clareza e reconhecer que NULL não é igual a um valor comum.",
    concepts: ["WHERE", "AND / OR", "IS NULL", "parênteses"],
    practice: "Encontre pedidos pendentes acima de R$ 20 e clientes sem e-mail. Acrescente parênteses quando combinar alternativas.",
    deliverable: "Duas consultas com filtros que correspondem à pergunta investigada.",
    checklist: ["Condições usam os operadores esperados.", "NULL é verificado com IS NULL ou IS NOT NULL.", "Combinações AND/OR não dependem de precedência implícita."],
    code: `SELECT order_id, status, total_amount\nFROM pg_temp.qa_orders\nWHERE status = 'pending'\n  AND total_amount > 20;\n\nSELECT customer_id, email\nFROM pg_temp.qa_customers\nWHERE email IS NULL;`,
  },
  {
    id: "sort-and-search", week: 2, duration: "35 min",
    title: "Ordene resultados e procure padrões",
    objective: "Organizar uma amostra previsível e buscar texto ou intervalos de data sem varrer resultados irrelevantes.",
    concepts: ["ORDER BY", "ASC / DESC", "LIKE", "intervalo de datas"],
    practice: "Procure pedidos mais recentes e e-mails de um domínio fictício. Compare o resultado antes e depois da ordenação.",
    deliverable: "Consulta ordenada e uma busca de padrão com limite claro.",
    checklist: ["Ordenou usando coluna e direção explícitas.", "Datas estão em formato ISO.", "O padrão de texto não amplia a busca sem intenção."],
    code: `SELECT order_id, created_at, status\nFROM pg_temp.qa_orders\nWHERE created_at >= DATE '2026-01-01'\n  AND created_at < DATE '2026-02-01'\nORDER BY created_at DESC, order_id DESC\nLIMIT 20;\n\nSELECT customer_id, email\nFROM pg_temp.qa_customers\nWHERE email ILIKE '%@example.test';`,
  },
  {
    id: "counts-and-groups", week: 2, duration: "45 min",
    title: "Conte e agrupe para achar padrões",
    objective: "Resumir muitos registros por categoria e localizar grupos suspeitos sem confundir WHERE com HAVING.",
    concepts: ["COUNT", "SUM", "GROUP BY", "HAVING"],
    practice: "Conte pedidos por status e procure e-mails repetidos. Explique o que cada linha agrupada representa.",
    deliverable: "Resumo por status e consulta de duplicidade com total de ocorrências.",
    checklist: ["Colunas não agregadas aparecem no GROUP BY.", "HAVING filtra grupos após a agregação.", "Duplicidade é um sinal para investigar, não uma causa comprovada."],
    code: `SELECT status, COUNT(*) AS orders_count\nFROM pg_temp.qa_orders\nGROUP BY status\nORDER BY orders_count DESC;\n\nSELECT email, COUNT(*) AS occurrences\nFROM pg_temp.qa_customers\nWHERE email IS NOT NULL\nGROUP BY email\nHAVING COUNT(*) > 1;`,
  },
  {
    id: "joins-and-orphans", week: 3, duration: "50 min",
    title: "Relacione tabelas com JOIN",
    objective: "Combinar tabelas usando chaves e usar LEFT JOIN para localizar registros sem correspondência.",
    concepts: ["INNER JOIN", "LEFT JOIN", "ON", "chave"],
    practice: "Relacione pedidos a clientes. Depois procure itens sem pedido correspondente no conjunto fictício.",
    deliverable: "Consulta de pedidos com dados de cliente e detecção de um órfão.",
    checklist: ["A condição ON usa as chaves relacionadas.", "Alias tornam a origem de cada coluna visível.", "LEFT JOIN mantém o registro sem correspondência para investigação."],
    code: `SELECT o.order_id, o.status, c.email\nFROM pg_temp.qa_orders AS o\nLEFT JOIN pg_temp.qa_customers AS c\n  ON c.customer_id = o.customer_id\nORDER BY o.order_id;\n\nSELECT i.item_id, i.order_id\nFROM pg_temp.qa_order_items AS i\nLEFT JOIN pg_temp.qa_orders AS o\n  ON o.order_id = i.order_id\nWHERE o.order_id IS NULL;`,
  },
  {
    id: "compare-related-values", week: 3, duration: "50 min",
    title: "Compare valores relacionados",
    objective: "Reconciliar o total do pedido com a soma de seus itens e retornar apenas diferenças que exigem investigação.",
    concepts: ["CTE", "SUM", "COALESCE", "reconciliação"],
    practice: "Calcule subtotal por pedido a partir de quantidade e preço unitário. Compare com o total gravado no cabeçalho.",
    deliverable: "Consulta de divergência com valor registrado, valor calculado e diferença.",
    checklist: ["Agregou itens antes de comparar com o pedido.", "Tratou ausência de itens explicitamente.", "Não arredondou ou converteu valores sem entender a precisão."],
    code: `WITH item_totals AS (\n  SELECT\n    order_id,\n    SUM(quantity * unit_price) AS items_total\n  FROM pg_temp.qa_order_items\n  GROUP BY order_id\n)\nSELECT\n  o.order_id,\n  o.total_amount AS recorded_total,\n  COALESCE(i.items_total, 0) AS calculated_total,\n  o.total_amount - COALESCE(i.items_total, 0) AS difference\nFROM pg_temp.qa_orders AS o\nLEFT JOIN item_totals AS i ON i.order_id = o.order_id\nWHERE o.total_amount <> COALESCE(i.items_total, 0);`,
  },
  {
    id: "safe-test-data", week: 4, duration: "45 min",
    title: "Prepare uma alteração sem deixar sujeira",
    objective: "Entender o limite de uma transação e validar uma mudança reversível somente nas tabelas temporárias do exercício.",
    concepts: ["BEGIN", "UPDATE", "ROLLBACK", "escopo"],
    practice: "Altere temporariamente um pedido pendente, confira a mudança e reverta a transação. Não execute exemplos de escrita em banco real ou compartilhado.",
    deliverable: "Registro da condição inicial, resultado dentro da transação e confirmação após rollback.",
    checklist: ["A tabela está qualificada como pg_temp.", "WHERE restringe exatamente o registro de treino.", "A transação termina em ROLLBACK, não COMMIT."],
    code: `BEGIN;\n\nUPDATE pg_temp.qa_orders\nSET status = 'cancelled'\nWHERE order_id = 5002\n  AND status = 'pending';\n\nSELECT order_id, status\nFROM pg_temp.qa_orders\nWHERE order_id = 5002;\n\nROLLBACK;\n\n-- Rode novamente o SELECT: o status original foi restaurado.`,
  },
  {
    id: "final-data-check", week: 4, duration: "55 min",
    title: "Monte uma investigação de dados",
    objective: "Combinar filtros, grupos e relacionamentos para entregar um sinal de qualidade de dados que possa ser verificado.",
    concepts: ["investigação", "resultado esperado", "reprodução", "limites"],
    practice: "Investigue pedidos de treino procurando totais divergentes, registros órfãos e possíveis e-mails repetidos. Confirme cada achado com uma consulta menor.",
    deliverable: "Três verificações com a pergunta, a consulta, o achado e uma limitação declarada.",
    checklist: ["Cada consulta responde uma pergunta específica.", "Resultados foram conferidos com uma segunda consulta ou amostra.", "Achados não afirmam causa sem evidência."],
    code: `-- Escreva uma consulta por regra:\n-- 1. Total do pedido versus soma dos itens\n-- 2. Item sem pedido correspondente\n-- 3. Cliente com e-mail compartilhado\n-- Registre também: o que este conjunto de treino não permite concluir?`,
  },
];

export const sqlQAOutcomes = [
  "Consultar dados sem alterar registros.",
  "Filtrar, ordenar e resumir resultados.",
  "Relacionar tabelas e detectar dados sem correspondência.",
  "Conferir regras de integridade com evidência e segurança.",
];

export const sqlQAResources = [
  { label: "Tutorial oficial do PostgreSQL", href: "https://www.postgresql.org/docs/current/tutorial.html" },
  { label: "SELECT e consultas", href: "https://www.postgresql.org/docs/current/queries.html" },
  { label: "Transações", href: "https://www.postgresql.org/docs/current/tutorial-transactions.html" },
];

export const sqlQAFinalProject = {
  title: "Auditoria de dados de pedidos fictícios",
  description: "Use o conjunto temporário para verificar e explicar inconsistências sem alterar dados. Ele não está conectado ao banco real da QA Lab Shop.",
  deliverables: ["Consulta de totais divergentes", "Consulta de registros sem correspondência", "Consulta de valores duplicados ou ausentes", "Resumo do achado, evidência e limite da conclusão"],
};

export const sqlQACourseFlow = [
  ["Pergunta", "qual regra quero conferir?"],
  ["Consulta", "quais dados respondem?"],
  ["Evidência", "o que o resultado mostra?"],
  ["Cuidado", "o que não devo alterar ou concluir?"],
] as const;
