# [Carrinho] Resumo às vezes não atualiza após adicionar um produto

**Status:** suspeito — observar uma vez não confirma causa  
**Ambiente:** QA Shop, build qa-2026.10.3, Firefox 132, Windows 11  
**Frequência:** 3 ocorrências em 10 tentativas com carrinho vazio

## Pré-condições

- Sessão de teste ativa.
- Antes de cada tentativa, carrinho limpo e página recarregada.
- Produto fictício “Kit Smoke Test” disponível.

## Passos para reproduzir

1. Abra o catálogo.
2. Selecione “Adicionar ao carrinho” no Kit Smoke Test.
3. Abra o resumo do carrinho.
4. Registre se o total mostra 0 ou 1 item; repita com o mesmo estado inicial.

## Resultado observado

Em 3 tentativas o resumo mostrou 0 itens. Nas outras 7 mostrou 1. O teste foi feito em uma sessão e não confirma a frequência para outras pessoas ou navegadores.

## Resultado esperado

Após adicionar o produto, o resumo mostra 1 item.

## Evidências

- Gravação curta de uma ocorrência e notas das 10 tentativas.
- Nenhum dado real ou informação de autenticação foi incluído.

## Próxima verificação

Repetir em outra sessão e registrar o tempo entre adicionar o item e abrir o resumo. A causa ainda não foi investigada.
