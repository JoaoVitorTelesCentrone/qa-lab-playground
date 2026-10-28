# Projeto inicial da Trilha k6

Starter da rota `/trilhas/k6`. Os exemplos usam somente `GET /shop/products` e não criam nem alteram dados.

## Requisitos

- k6 2.2.0 ou compatível; para o teste de browser, Chromium instalado.
- QA Lab local em `http://localhost:3000` ou outro ambiente de teste autorizado.

## Smoke seguro

O comando smoke envia uma única requisição por padrão:

```sh
k6 run tests/smoke.js
```

Para escolher outro alvo explicitamente:

```sh
k6 run -e BASE_URL=http://localhost:3000 tests/smoke.js
```

O smoke verifica status, conteúdo, falhas e p95. Ajuste os thresholds com base em um SLO acordado; os valores iniciais são apenas um exercício.

## Perfis de prática

`tests/baseline.js` envia uma chegada por segundo durante dez segundos. Rode-o somente depois do smoke e apenas contra ambiente local/staging controlado:

```sh
k6 run -e BASE_URL=http://localhost:3000 tests/baseline.js
```

`tests/browser.js` faz uma navegação com uma única iteração. Ele exige k6 com módulo browser e Chromium:

```sh
k6 run -e BASE_URL=http://localhost:3000 tests/browser.js
```

Browser serve para experiência e Web Vitals, não para gerar milhares de usuários. Para carga maior, combine autorização, janela, plano de parada e observabilidade do sistema e do gerador.

## GitHub Actions

O workflow `.github/workflows/k6-smoke.yml` só roda manualmente. Antes, configure a variável de repositório `K6_TARGET_URL` apontando para ambiente autorizado e acessível pelo runner. O workflow executa apenas o smoke de uma requisição; não publique URL de produção sem autorização explícita.

O progresso na trilha é uma autoavaliação. O QA Lab não hospeda nem executa os testes do aluno.
