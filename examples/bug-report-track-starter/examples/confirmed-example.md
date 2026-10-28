# [Carrinho] Resumo permanece vazio após adicionar um produto disponível

**Status:** confirmado  
**Ambiente:** QA Shop, build qa-2026.10.3, Firefox 132, Windows 11, viewport 1365 × 768  
**Frequência:** 5 de 5 tentativas em sessão de teste nova

## Pré-condições

- Sessão de teste ativa.
- Carrinho vazio.
- Produto fictício “Kit Smoke Test” disponível.

## Passos para reproduzir

1. Abra o catálogo da QA Shop.
2. Localize “Kit Smoke Test”.
3. Selecione “Adicionar ao carrinho”.
4. Abra o resumo do carrinho.

## Resultado observado

O resumo mostra 0 itens e não lista o produto.

## Resultado esperado

O resumo mostra 1 item e lista “Kit Smoke Test”, conforme a regra do carrinho.

## Impacto observado

Uma pessoa pode acreditar que o item não foi adicionado e repetir a ação. O alcance fora desta sessão ainda não foi medido.

## Evidências

- `cart-summary-empty.png`, capturada após o passo 4.
- A imagem usa apenas conta e dados fictícios; não há tokens ou dados pessoais.

## Severidade sugerida

Média: o resumo induz a pessoa a repetir a ação, mas o restante da compra segue acessível. Prioridade a definir na triagem.

## Reteste

Pendente de versão corrigida.
