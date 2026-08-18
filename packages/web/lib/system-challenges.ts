export type SystemChallenge = { id: string; number: number; title: string; area: string; mode: "fluxo" | "investigacao"; difficulty: "Basico" | "Intermediario" | "Avancado"; route: string; objective: string; testData: string; expected: string; steps: string[]; acceptance: string[]; plantedBug: string };

const features = [
  ["Catalogo", "Busca com estado vazio", "/shop/products"], ["Catalogo", "Filtros por categoria, status e preco", "/shop/products"], ["Catalogo", "Ordenacao do catalogo", "/shop/products"], ["Catalogo", "Paginacao e itens por pagina", "/shop/products"], ["Catalogo", "Cards de item", "/shop/products"], ["Catalogo", "Detalhe do item", "/shop/products/1"], ["Catalogo", "Favoritos persistentes", "/shop/products"], ["Catalogo", "Comparacao entre itens", "/shop/products"], ["Catalogo", "Avaliacoes", "/shop/products/1"], ["Catalogo", "Estoque e reposicao", "/shop/products/4"],
  ["Checkout", "Adicionar ao carrinho", "/shop/products"], ["Checkout", "Quantidade e remocao", "/shop/cart"], ["Checkout", "Carrinho persistente", "/shop/cart"], ["Checkout", "Cupom de desconto", "/shop/cart"], ["Checkout", "Calculo de frete", "/shop/checkout"], ["Checkout", "Regra de frete gratis", "/shop/checkout"], ["Checkout", "Desconto, imposto e total", "/shop/checkout"], ["Checkout", "Endereco com validacoes", "/shop/checkout"], ["Checkout", "Tipos de entrega", "/shop/checkout"], ["Checkout", "Formas de pagamento", "/shop/checkout"],
  ["Pedidos", "Historico e filtro de pedidos", "/shop/orders/QL-DEMO-001"], ["Pedidos", "Detalhe do pedido", "/shop/orders/QL-DEMO-001"], ["Pedidos", "Linha do tempo de status", "/shop/orders/QL-DEMO-001"], ["Pedidos", "Rastreio", "/shop/orders/QL-DEMO-001"], ["Pedidos", "Cancelamento", "/shop/orders/QL-DEMO-001"], ["Pedidos", "Solicitacao de devolucao", "/shop/orders/QL-DEMO-001"], ["Pedidos", "Reembolso parcial ou total", "/shop/orders/QL-DEMO-001"], ["Pedidos", "Nota fiscal simulada", "/shop/orders/QL-DEMO-001"], ["Pedidos", "Recompra", "/shop/orders/QL-DEMO-001"], ["Pedidos", "Pesquisa pos-entrega", "/shop/orders/QL-DEMO-001"],
  ["Clientes", "Cadastro e e-mail duplicado", "/shop/modules/clientes"], ["Clientes", "Login, logout e sessao expirada", "/shop/modules/clientes"], ["Clientes", "Recuperacao de senha", "/shop/modules/clientes"], ["Clientes", "Edicao de perfil", "/shop/modules/clientes"], ["Clientes", "Enderecos", "/shop/modules/clientes"], ["Clientes", "Preferencias de comunicacao", "/shop/modules/clientes"], ["Clientes", "Preferencias de acessibilidade", "/shop/modules/clientes"], ["Clientes", "MFA simulada", "/shop/modules/clientes"], ["Clientes", "Dispositivos e sessoes", "/shop/modules/clientes"], ["Clientes", "Exclusao e exportacao LGPD", "/shop/modules/clientes"],
  ["Atendimento", "Abertura de ticket", "/shop/modules/suporte"], ["Atendimento", "Fila, filtros e SLA", "/shop/modules/suporte"], ["Atendimento", "Conversa e anexos", "/shop/modules/suporte"], ["Atendimento", "Base de ajuda", "/shop/modules/suporte"], ["Operacao", "Estoque minimo", "/shop/modules/operacao"], ["Operacao", "Fornecedores", "/shop/modules/operacao"], ["Operacao", "Promocoes", "/shop/modules/operacao"], ["Operacao", "Regras e aprovacao de preco", "/shop/modules/operacao"], ["Relatorios", "Dashboard, metricas e datas", "/shop/modules/relatorios"], ["Governanca", "Auditoria, permissoes, flags e alertas", "/shop/modules/automacao"],
] as const;

// Features dos ambientes de pratica que nasceram na Fase 3. Diferente da loja,
// cada uma traz a propria massa de teste: o dado que o aluno usa vem do seed
// daquele ambiente (lib/product/practice/seed.ts), nao do usuario da loja.
const practiceFeatures = [
  ["Financas", "Lancamentos e saldo do periodo", "/financas#lancamentos", "Massa restaurada: salario 6.800, aluguel 1.850 (recorrente), mercado 430,90, internet 129,90 (recorrente), freelance 1.200 e farmacia 87,40."],
  ["Financas", "Orcamento por categoria e alerta de estouro", "/financas#orcamentos", "Orcamentos do seed: Moradia 2.200, Alimentacao 900 e Saude 300."],
  ["Financas", "Metas de reserva", "/financas#metas", "Metas do seed: reserva de emergencia 12.300 de 20.000 e viagem 1.450 de 8.000."],
  ["Financas", "Busca, filtro e ordenacao de lancamentos", "/financas#lancamentos", "Busque por Mercado, filtre por despesa e categoria Moradia, ordene por valor."],
  ["Financas", "Exportacao dos lancamentos em CSV", "/financas#lancamentos", "Aplique um filtro antes de exportar e compare o arquivo com a tela."],
  ["Agendamentos", "Grade de horarios e disponibilidade", "/agendamentos#grade", "Dia 18/08/2026 com 10:00 e 14:00 ocupados; atendimento de segunda a sexta das 09:00 as 18:00 e sabado ate as 13:00."],
  ["Agendamentos", "Conflito de horario", "/agendamentos#nova-reserva", "Tente 10:00 de 18/08/2026, ja ocupado por Ana Costa, e o mesmo horario em 25/08/2026, livre."],
  ["Agendamentos", "Reagendamento", "/agendamentos#agenda", "Mova Bruno Dias de 14:00 para 15:00 no mesmo dia e confira a grade antes e depois."],
  ["Agendamentos", "Cancelamento e liberacao do horario", "/agendamentos#por-dia", "Cancele Ana Costa e tente agendar outro cliente no horario liberado."],
  ["Agendamentos", "Atendimento fora da faixa configurada", "/agendamentos#disponibilidade", "Tente agendar as 20:00 e em um domingo, que nao tem faixa configurada."],
  ["CRM", "Funil e valor do pipeline", "/crm#funil", "Cinco oportunidades no seed, somando 194.000 sem a perdida (consultoria pontual, 12.000)."],
  ["CRM", "Mudanca de estagio de oportunidade", "/crm#funil", "Mova o piloto de automacao (18.000) de Novo ate Ganho e depois marque outra como Perdido."],
  ["CRM", "Busca de contatos", "/crm#contatos", "Contatos do seed: Marina Costa, Antonio Ribeiro (com acento no cadastro) e Pedro Lima."],
  ["CRM", "Duplicidade de contato e empresa", "/crm#contatos", "marina@nortedigital.com e a empresa Orbit SaaS ja existem na massa."],
  ["CRM", "Atividades da oportunidade", "/crm#atividades", "Duas atividades no seed, ligadas ao modulo fiscal e a renovacao anual."],
] as const;

const allFeatures = [
  ...features.map(([area, title, route]) => ({ area, title, route, sample: "" })),
  ...practiceFeatures.map(([area, title, route, sample]) => ({ area, title, route, sample })),
];

export const systemChallenges: SystemChallenge[] = allFeatures.flatMap(({ area, title, route, sample }, index) => {
  const feature = index + 1;
  return (["fluxo", "investigacao"] as const).map((mode, variant) => {
    const number = index * 2 + variant + 1;
    const flow = mode === "fluxo";
    return {
      id: `desafio-${String(number).padStart(3, "0")}`, number, area, mode, route,
      // Sem o índice da feature no título: "Validar 51: Lancamentos" mostrava ao
      // aluno um número de catálogo que não significa nada pra ele.
      title: `${flow ? "Validar" : "Quebrar"} ${title[0].toLowerCase()}${title.slice(1)}`,
      // Os ambientes novos entram por fora da escala da loja: validar o fluxo e
      // basico, investigar o mesmo ponto e um degrau acima.
      difficulty: sample ? (flow ? "Basico" : "Intermediario") : feature <= 15 ? "Basico" : feature <= 35 ? "Intermediario" : "Avancado",
      objective: flow ? `Produzir evidencia de que ${title.toLowerCase()} atende ao comportamento esperado.` : `Investigar um risco real em ${title.toLowerCase()} e registrar um bug reproduzivel ou uma conclusao justificada.`,
      testData: flow
        ? sample || "Usuario: standard_user · senha: qa_lab_secret · CEP: 01310-100 · cupom: QA10."
        : `${sample ? `${sample} ` : ""}Use valor vazio, limite (0 / 999999), caractere especial, recarregamento e navegacao por teclado.`,
      expected: flow ? "O fluxo deve informar o resultado, preservar dados quando aplicavel e manter foco/feedback acessivel." : "A aplicacao deve bloquear entradas invalidas, explicar a falha e nao corromper estado ou calculos.",
      steps: flow ? [
        `Abra ${title.toLowerCase()} pela superficie indicada e registre a pre-condicao.`,
        "Execute o caminho principal usando os dados de teste fornecidos.",
        "Valide valor exibido, persistencia apos recarregar e mensagem para leitor de tela (aria-live).",
        "Colete resultado obtido e anote se ele corresponde ao oraculo.",
      ] : [
        `Mapeie o comportamento normal de ${title.toLowerCase()} antes de tentar falhar.`,
        "Aplique uma variacao invalida e uma variacao de limite; repita usando somente teclado.",
        "Recarregue a pagina no meio do fluxo e compare estado, valor e mensagem.",
        "Registre passos minimos de reproducao, impacto, severidade e evidencia.",
      ],
      acceptance: flow ? ["Passos reproduziveis", "Resultado obtido comparado ao esperado", "Evidencia com valor ou mensagem exibida"] : ["Passos minimos para reproduzir", "Impacto e severidade justificados", "Resultado esperado e real claramente separados"],
      plantedBug: flow
        ? sample
          ? "Ligue um desvio em /lab/instrutor (ou sorteie pela barra do ambiente) antes de validar o calculo."
          : "Ative /shop/checkout?bug=wrong-total ao testar calculos relacionados; para os demais, valide tambem foco e persistencia."
        : `Procure inconsistencias de validacao, estado apos recarregar, feedback acessivel e fronteiras em ${title.toLowerCase()}.`,
    };
  });
});
