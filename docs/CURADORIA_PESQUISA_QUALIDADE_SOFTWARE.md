# Curadoria da biblioteca de qualidade de software

Revisão temática em 13/11/2026 do catálogo `packages/web/data/research-library.generated.json` (snapshot de 12/11/2026). Foram examinados os títulos, resumos disponíveis e metadados dos **213 registros**. A decisão individual de cada ID está em `packages/web/data/research-curation.json`: **202 incluídos** e **11 excluídos**.

## Critério

Um trabalho entra na biblioteca pública quando seu objeto principal é a qualidade do produto ou do processo de software: garantia da qualidade, testes, verificação, validação, confiabilidade, manutenibilidade, métricas, modelos de qualidade, análise de código ou defeitos. Estudos aplicados a um domínio específico entram quando investigam uma dessas questões no software. Dados e pacotes de replicação diretamente ligados a esses temas também entram, embora não sejam artigos.

Foram excluídas menções incidentais a “software”, publicidade, notas de correção sem pesquisa própria e estudos de vagas ou ensino que não avaliam qualidade de software. Consulta de busca, tópico atribuído pela API e presença isolada de palavras-chave não bastam para inclusão.

| Consulta de descoberta | Incluídos | Excluídos |
| --- | ---: | ---: |
| Predição de defeitos | 87 | 4 |
| Garantia da qualidade | 43 | 5 |
| Qualidade de produto | 14 | 0 |
| Manutenibilidade e confiabilidade | 21 | 0 |
| Modelos de qualidade | 27 | 2 |
| Medição de qualidade | 8 | 0 |
| Consultas históricas adicionais | 2 | 0 |
| **Total** | **202** | **11** |

## Exclusões

O arquivo de curadoria registra o título, ID e motivo específico dos 11 registros excluídos. Os casos encontrados foram:

- 2 registros sobre qualidade de fabricação ou reparo físico, com “defeito de software” apenas como menção lateral;
- 1 anúncio de curso de automação;
- 1 estudo sobre governança de modelos conceituais ontológicos, sem avaliação da qualidade de software;
- 1 nota de correção editorial sem estudo próprio;
- 1 trabalho de governança de deepfakes, cujo foco é integridade de dados de IA;
- 2 levantamentos de vagas e competências de profissionais de teste;
- 1 arquitetura de dispositivo vestível sem resumo que sustente contribuição sobre qualidade de software;
- 1 classificação de erros factuais em saídas de LLMs, indevidamente descritos como defeitos de software;
- 1 estudo de currículo e ensino de QA.

## Limites e manutenção

Esta é uma **triagem de pertinência temática**, feita com os metadados e resumos disponíveis; não é uma avaliação de qualidade metodológica, verificação de revisão por pares nem leitura integral de todos os textos. O registro pode tratar de qualidade de software e ainda ter evidência fraca. Alguns itens não têm resumo indexado e foram mantidos quando o título apontava diretamente para um tema de qualidade de software.

Novos registros capturados pelo atualizador ficam fora da biblioteca pública até receberem uma decisão em `research-curation.json`. A suíte de testes exige que cada ID do catálogo tenha exatamente uma decisão, para que a atualização da fonte sinalize registros pendentes de revisão.
