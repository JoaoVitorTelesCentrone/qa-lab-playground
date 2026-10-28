# Projeto inicial da Trilha Gherkin

Starter da rota `/trilhas/gherkin`. Ele mostra Gherkin em português executado pelo Cucumber.js e verifica, pela API, que o carrinho não é exposto sem autenticação.

## Requisitos

- Node.js 22 ou mais recente.
- QA Lab local em `http://localhost:3000` ou um ambiente de teste autorizado.

## Executar

```sh
npm ci
npm run bdd:smoke
```

Para usar uma URL diferente, configure `BASE_URL` no ambiente. O cenário faz uma consulta GET e não envia nem altera dados:

```sh
BASE_URL=http://localhost:3000 npm run bdd:smoke
```

No PowerShell:

```powershell
$env:BASE_URL = "http://localhost:3000"
npm run bdd:smoke
```

`npm run bdd` executa todos os cenários; `npm run bdd:dry` valida descoberta e vínculo dos steps sem fazer chamadas ao sistema.

## Organização

- `features/carrinho.feature`: exemplos em português, escritos como comportamento.
- `features/step_definitions/cart.steps.js`: integração com o endpoint e asserções.
- `.github/workflows/gherkin-smoke.yml`: execução manual de smoke em CI.

O workflow exige a variável de repositório `BDD_TARGET_URL`, apontando para um ambiente autorizado e acessível pelo runner. A trilha trata Gherkin como especificação colaborativa; Cucumber executa os exemplos, mas não substitui conversa nem decisão de produto.

O progresso na trilha é uma autoavaliação. O QA Lab não hospeda nem executa os testes do aluno.
