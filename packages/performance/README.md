# Trilha de carga da Mentoria

Os cenários usam [k6](https://grafana.com/docs/k6/latest/) e só aceitam alvo local.
O runner do pacote e cada script k6 validam o alvo. Não execute carga contra
produção, checkout real ou banco.

## Pré-requisitos

1. Suba a API local com `bun run dev:api` na raiz (por padrão, `http://127.0.0.1:3001`).
2. Instale o k6 na máquina do aluno.
3. Execute sempre com a confirmação explícita do alvo:

```bash
PERF_TARGET_ACK=LOCAL_ONLY node packages/performance/scripts/run-k6.js baseline
```

Para usar outro endereço local:

```bash
PERF_TARGET=http://localhost:3001 PERF_TARGET_ACK=LOCAL_ONLY node packages/performance/scripts/run-k6.js load
```

## Ordem didática

- `baseline.js`: dez iterações com um usuário, para criar referência.
- `load.js`: cinco usuários sustentados por trinta segundos.
- `spike.js`: subida curta para observar recuperação após pico.

Os thresholds iniciais são erro abaixo de 1%, p95 abaixo de 500 ms e p99 abaixo de
1 s. O aluno deve comparar os resultados, explicar o modelo de carga e anexar o
resumo à entrega da semana 11; os valores não são uma promessa universal de SLO.

No PowerShell, configure a confirmação e o alvo antes de chamar o runner:

```powershell
$env:PERF_TARGET_ACK = "LOCAL_ONLY"
$env:PERF_TARGET = "http://127.0.0.1:3001"
node packages/performance/scripts/run-k6.js baseline
```
