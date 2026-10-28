# Projeto inicial da Trilha Playwright

Este starter acompanha `/trilhas/playwright` e testa a loja de prática do QA Lab.

## Requisitos

- Node.js 22 ou mais recente
- Uma instância local do QA Lab rodando em `http://localhost:3000`, ou outra URL acessível

## Preparar

```sh
npm install
npm run install:browsers
```

Para usar outra instância, configure `PLAYWRIGHT_BASE_URL` no ambiente. Use apenas ambientes de treino; não aponte uma suíte com ações mutáveis para produção.

## Executar

```sh
npm test
npm run test:ui
npm run test:headed
```

As specs iniciais cobrem busca, estado vazio e inclusão no carrinho. Cada teste limpa seu próprio estado local e verifica um resultado visível. Abra o relatório com `npm run test:report`.

Durante os Labs, amplie a configuração para a matriz de navegadores necessária ao produto. Ative traces em retries/falhas no CI e trate um retry como sinal para investigar — não como correção da instabilidade.

Não versione credenciais nem arquivos `storageState`: eles podem conter cookies e tokens reutilizáveis. O progresso na trilha é uma autoavaliação; o QA Lab não recebe nem executa o código do seu projeto.
