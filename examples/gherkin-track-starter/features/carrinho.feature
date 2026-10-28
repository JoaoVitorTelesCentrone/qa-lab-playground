# language: pt
Funcionalidade: Proteção do carrinho
  Dados pessoais do carrinho só podem ser consultados por uma pessoa autenticada.

  @smoke @api
  Cenário: Visitante sem sessão não consulta o carrinho
    Dado que não existe uma sessão autenticada
    Quando consulto o carrinho da loja
    Então o sistema responde com status 401

  @contract
  Cenário: A resposta de acesso negado usa JSON
    Dado que não existe uma sessão autenticada
    Quando consulto o carrinho da loja
    Então a resposta é JSON
