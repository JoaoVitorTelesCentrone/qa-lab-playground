# Projeto inicial da Trilha Cypress

Este projeto acompanha `/trilhas/cypress`. Os testes usam a loja de treino do QA Lab em `/shop/products`.

## Requisitos

- Node.js 22 ou mais recente
- Uma instância local do QA Lab rodando em `http://localhost:3000`, ou outra URL acessível

## Preparar

```sh
npm install
npm run cy:open
```

Para usar outra instância, configure `CYPRESS_BASE_URL` no ambiente antes de abrir ou executar os testes. Não coloque senhas ou tokens em specs, fixtures ou no repositório.

## Executar

```sh
npm run cy:smoke
npm run cy:run
```

Os testes iniciais cobrem busca, estado vazio, adição ao carrinho e uma gravação simulada da API. Comece alterando as specs de `cypress/e2e` conforme os Labs; cada cenário deve poder rodar sozinho.

O progresso na trilha é uma autoavaliação. O QA Lab não recebe nem executa o código do seu projeto.
