# Exemplo de leitura — dados sintéticos

Estes números existem apenas para praticar cálculo. Não são metas ou resultados de um produto real.

## Fração de defeitos confirmados encontrados em produção

Fórmula do exemplo: defeitos confirmados em produção nos primeiros 14 dias ÷ (defeitos confirmados antes da release + defeitos confirmados em produção na mesma coorte).

| Release | Cálculo | Fração |
| --- | --- | ---: |
| rel-101 | 2 ÷ (8 + 2) | 20% |
| rel-102 | 1 ÷ (5 + 1) | 16,7% |
| rel-103 | 3 ÷ (6 + 3) | 33,3% |

Isso não informa quantos defeitos ainda não foram descobertos. Confira janela, severidade, sessões, mudanças de classificação e atribuição de release antes de interpretar tendência.

## Smoke na primeira tentativa

| Release | Cálculo | Primeira tentativa |
| --- | --- | ---: |
| rel-101 | 93 ÷ 100 | 93% |
| rel-102 | 114 ÷ 120 | 95% |
| rel-103 | 90 ÷ 100 | 90% |

As recuperações por retry continuam visíveis: 5%, 3,3% e 7%, respectivamente. Não some esses resultados ao primeiro passe e chame a suíte de estável.

## Perguntas, não conclusões automáticas

- O aumento em rel-103 coincidiu com mudanças na instrumentação ou no volume de reporte?
- Os defeitos em produção atingiram a mesma jornada e severidade?
- A piora no p95 de feedback veio da fila, execução ou coleta do resultado?
- Qual ação vale testar e qual contramétrica detectaria efeito colateral?
