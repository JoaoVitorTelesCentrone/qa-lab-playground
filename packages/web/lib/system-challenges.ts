export type SystemChallenge = { id: string; number: number; title: string; area: string; mode: "fluxo" | "investigacao"; difficulty: "Basico" | "Intermediario" | "Avancado"; route: string; objective: string; testData: string; expected: string; steps: string[]; acceptance: string[]; plantedBug: string };

const features = [
  ["Catalogo", "Busca com estado vazio", "/shop/products"], ["Catalogo", "Filtros por categoria, status e preco", "/shop/products"], ["Catalogo", "Ordenacao do catalogo", "/shop/products"], ["Catalogo", "Paginacao e itens por pagina", "/shop/products"], ["Catalogo", "Cards de item", "/shop/products"], ["Catalogo", "Detalhe do item", "/shop/products/1"], ["Catalogo", "Favoritos persistentes", "/shop/products"], ["Catalogo", "Comparacao entre itens", "/shop/products"], ["Catalogo", "Avaliacoes", "/shop/products/1"], ["Catalogo", "Estoque e reposicao", "/shop/products/4"],
  ["Checkout", "Adicionar ao carrinho", "/shop/products"], ["Checkout", "Quantidade e remocao", "/shop/cart"], ["Checkout", "Carrinho persistente", "/shop/cart"], ["Checkout", "Cupom de desconto", "/shop/cart"], ["Checkout", "Calculo de frete", "/shop/checkout"], ["Checkout", "Regra de frete gratis", "/shop/checkout"], ["Checkout", "Desconto, imposto e total", "/shop/checkout"], ["Checkout", "Endereco com validacoes", "/shop/checkout"], ["Checkout", "Tipos de entrega", "/shop/checkout"], ["Checkout", "Formas de pagamento", "/shop/checkout"],
  ["Pedidos", "Historico e filtro de pedidos", "/shop/orders/QL-DEMO-001"], ["Pedidos", "Detalhe do pedido", "/shop/orders/QL-DEMO-001"], ["Pedidos", "Linha do tempo de status", "/shop/orders/QL-DEMO-001"], ["Pedidos", "Rastreio", "/shop/orders/QL-DEMO-001"], ["Pedidos", "Cancelamento", "/shop/orders/QL-DEMO-001"], ["Pedidos", "Solicitacao de devolucao", "/shop/orders/QL-DEMO-001"], ["Pedidos", "Reembolso parcial ou total", "/shop/orders/QL-DEMO-001"], ["Pedidos", "Nota fiscal simulada", "/shop/orders/QL-DEMO-001"], ["Pedidos", "Recompra", "/shop/orders/QL-DEMO-001"], ["Pedidos", "Pesquisa pos-entrega", "/shop/orders/QL-DEMO-001"],
  ["Clientes", "Cadastro e e-mail duplicado", "/shop/modules/clientes"], ["Clientes", "Login, logout e sessao expirada", "/shop/modules/clientes"], ["Clientes", "Recuperacao de senha", "/shop/modules/clientes"], ["Clientes", "Edicao de perfil", "/shop/modules/clientes"], ["Clientes", "Enderecos", "/shop/modules/clientes"], ["Clientes", "Preferencias de comunicacao", "/shop/modules/clientes"], ["Clientes", "Preferencias de acessibilidade", "/shop/modules/clientes"], ["Clientes", "MFA simulada", "/shop/modules/clientes"], ["Clientes", "Dispositivos e sessoes", "/shop/modules/clientes"], ["Clientes", "Exclusao e exportacao LGPD", "/shop/modules/clientes"],
  ["Atendimento", "Abertura de ticket", "/shop/modules/suporte"], ["Atendimento", "Fila, filtros e SLA", "/shop/modules/suporte"], ["Atendimento", "Conversa e anexos", "/shop/modules/suporte"], ["Atendimento", "Base de ajuda", "/shop/modules/suporte"], ["Operacao", "Estoque minimo", "/shop/modules/operacao"], ["Operacao", "Fornecedores", "/shop/modules/operacao"], ["Operacao", "Promocoes", "/shop/modules/operacao"], ["Operacao", "Regras e aprovacao de preco", "/shop/modules/operacao"], ["Relatorios", "Dashboard, metricas e datas", "/shop/modules/relatorios"], ["Governanca", "Auditoria, permissoes, flags e alertas", "/shop/modules/automacao"],
] as const;

export const systemChallenges: SystemChallenge[] = features.flatMap(([area, title, route], index) => {
  const feature = index + 1;
  return (["fluxo", "investigacao"] as const).map((mode, variant) => {
    const number = index * 2 + variant + 1;
    const flow = mode === "fluxo";
    return {
      id: `desafio-${String(number).padStart(3, "0")}`, number, area, mode, route,
      title: `${flow ? "Validar" : "Quebrar"} ${String(feature).padStart(2, "0")}: ${title}`,
      difficulty: feature <= 15 ? "Basico" : feature <= 35 ? "Intermediario" : "Avancado",
      objective: flow ? `Produzir evidencia de que ${title.toLowerCase()} atende ao comportamento esperado.` : `Investigar um risco real em ${title.toLowerCase()} e registrar um bug reproduzivel ou uma conclusao justificada.`,
      testData: flow ? "Usuario: standard_user · senha: qa_lab_secret · CEP: 01310-100 · cupom: QA10." : "Use valor vazio, limite (0 / 999999), caractere especial, recarregamento e navegacao por teclado.",
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
      plantedBug: flow ? `Ative /shop/checkout?bug=wrong-total ao testar calculos relacionados; para os demais, valide tambem foco e persistencia.` : `Procure inconsistencias de validacao, estado apos recarregar, feedback acessivel e fronteiras em ${title.toLowerCase()}.`,
    };
  });
});
