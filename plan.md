# QA Lab System — Plano de 50 funcionalidades

Objetivo: transformar o **Lab** em um produto único, rico e testável. Cada funcionalidade deve gerar cenários de UI, API, acessibilidade, performance, segurança e teste exploratório.

## 1. Catálogo e descoberta

1. Busca por texto com estado vazio.
2. Filtros por categoria, status e faixa de preço.
3. Ordenação por nome, preço, avaliação e data.
4. Paginação e alteração de itens por página.
5. Cards de item com informação resumida.
6. Página de detalhe do item.
7. Favoritos persistentes por sessão.
8. Comparação entre itens.
9. Avaliações com nota e comentário.
10. Estoque, indisponibilidade e aviso de reposição.

## 2. Carrinho e checkout

11. Adicionar item ao carrinho.
12. Alterar quantidade e remover item.
13. Persistir carrinho no navegador.
14. Aplicar e remover cupom.
15. Cálculo de frete por CEP.
16. Frete grátis por regra de valor.
17. Cálculo de desconto, imposto e total.
18. Formulário de endereço com validações.
19. Seleção de entrega padrão ou expressa.
20. Seleção de pagamento por cartão, PIX ou boleto.

## 3. Pedidos e pós-venda

21. Histórico de pedidos com busca e filtro.
22. Detalhe de pedido e itens comprados.
23. Linha do tempo de status do pedido.
24. Código e página de rastreio.
25. Cancelamento com motivo e confirmação.
26. Solicitação de devolução.
27. Reembolso parcial ou total.
28. Emissão e download de nota fiscal simulada.
29. Recompra de pedido anterior.
30. Pesquisa de satisfação após entrega.

## 4. Conta e clientes

31. Cadastro com validação e duplicidade de e-mail.
32. Login, logout e sessão expirada.
33. Recuperação e redefinição de senha.
34. Perfil com edição de dados.
35. Lista e edição de endereços.
36. Preferências de comunicação.
37. Preferências de acessibilidade.
38. Autenticação em dois fatores simulada.
39. Dispositivos e sessões ativas.
40. Exclusão e exportação de dados pessoais.

## 5. Atendimento e operação

41. Abertura de ticket com categoria e prioridade.
42. Lista de tickets com filtros, paginação e SLA.
43. Conversa de atendimento com anexos.
44. Base de ajuda e busca por artigo.
45. Gestão de estoque com alerta de mínimo.
46. Cadastro e edição de fornecedor.
47. Criação de promoção com início e término.
48. Regras de preço e aprovação de alteração.
49. Dashboard com métricas, gráficos e intervalo de datas.
50. Auditoria de ações, permissões, feature flags e alertas.

## Regras de implementação

- Cada funcionalidade terá rota, estado vazio, carregamento, erro e sucesso quando aplicável.
- Cada módulo deve expor elementos acessíveis: labels, foco visível, feedback por `aria-live` e navegação por teclado.
- As funcionalidades críticas terão modo com bug plantado para investigação.
- Fluxos devem preservar dados no navegador ou em API local para permitir testes repetíveis.
- Cada desafio deve apontar para uma funcionalidade ou combinação de funcionalidades deste plano.

## Ordem de entrega

1. Catálogo, carrinho, checkout e pedidos.
2. Conta e autenticação.
3. Atendimento e operação.
4. Relatórios, auditoria, feature flags e cenários não funcionais.
