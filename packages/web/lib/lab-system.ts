export type SystemModule = { slug: string; name: string; description: string; features: string[]; route?: string };

export const systemModules: SystemModule[] = [
  { slug: "catalogo", name: "Catalogo", description: "Descoberta e decisao de compra.", route: "/shop/products", features: ["Busca e estado vazio", "Filtros", "Ordenacao e paginacao", "Cards e detalhe", "Favoritos e comparacao", "Avaliacoes e estoque"] },
  { slug: "checkout", name: "Carrinho e checkout", description: "Itens, entrega, descontos e pagamento.", route: "/shop/cart", features: ["Carrinho persistente", "Quantidade e remocao", "Cupom", "Frete por CEP", "Endereco validado", "Entrega e pagamento"] },
  { slug: "pedidos", name: "Pedidos", description: "Da confirmacao ao pos-venda.", route: "/shop/orders/QL-DEMO-001", features: ["Historico e detalhe", "Linha do tempo", "Rastreio", "Cancelamento", "Devolucao e reembolso", "Nota fiscal e pesquisa"] },
  { slug: "clientes", name: "Clientes", description: "Conta, sessao e preferencias.", features: ["Cadastro e login", "Recuperacao de senha", "Perfil e enderecos", "Comunicacao", "Acessibilidade", "MFA, sessoes e LGPD"] },
  { slug: "suporte", name: "Atendimento", description: "Relacao com cliente e incidentes.", features: ["Abertura de ticket", "Fila, filtros e SLA", "Conversa e anexos", "Base de ajuda"] },
  { slug: "operacao", name: "Operacao", description: "Rotinas internas do negocio.", features: ["Estoque minimo", "Fornecedores", "Promocoes", "Regras de preco", "Aprovacoes", "Alertas"] },
  { slug: "relatorios", name: "Relatorios", description: "Informacao para tomada de decisao.", features: ["Metricas", "Graficos", "Intervalo de datas", "Exportacao"] },
  { slug: "automacao", name: "Governanca", description: "Auditoria, flags e permissoes.", features: ["Auditoria", "Feature flags", "Permissoes", "Alertas"] },
];
