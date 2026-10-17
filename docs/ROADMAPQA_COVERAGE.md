# Conferência do RoadMapQA.docx na mentoria

Fonte: `RoadMapQA.docx` na raiz do projeto. A coluna de destino indica onde os temas aparecem na teoria da aula; cada semana também tem um caso resolvido na etapa **Exemplo**. Esta conferência distingue cobertura curricular de domínio prático de uma ferramenta.

| Itens do documento | Destino no conteúdo | Alcance |
| --- | --- | --- |
| Qualidade de produto e processo; métricas de bugs, histórias e testes; tempo de PR; análise de etapas; gargalo | Semana 1, aulas 1 e 2; semana 2, aula 2; semana 9, aula 1 | Conceito, decisão de métrica, exemplo e exercício |
| Tipos de sistema; pensamento de testador; abordagens caixa-preta e caixa-branca; smoke | Semana 1, aulas 2 e 3; semana 5, aula 1 | Conceito, escolha de abordagem e exemplos |
| Triple A; pirâmide; unidade, integração e ponta a ponta; DOR, DOD e priorização | Semana 1, aula 2; semana 5, aulas 1 e 2; semana 7, aula 2 | Conceito, matriz de camadas e aplicação |
| Cascata; ágil; XP, Scrum e Kanban; planning, kick-off, deskcheck, code review e review; fases de entrega | Semana 2, aulas 1 e 2 | Comparação, pontos de decisão e caso de fluxo |
| Compatibilidade de hardware, software, navegador, sistema e ambiente | Semana 2, aula 2; semana 11, aula 2 | Matriz por risco e condições de execução |
| Planejamento manual; cenário e caso; passo a passo e Gherkin; TDD e BDD; verificação e validação | Semana 3, aulas 1 e 2 | Conceito, caso resolvido e exercício |
| Report; ScreenToGif; organização de casos; Canvas, Azure Test Plans, repositório e Qase | Semana 3, aula 2; semana 4, aulas 1 e 2 | Estrutura de artefato e uso orientado; sem tutorial de interface dessas ferramentas |
| Trello, Azure Boards/Wiki e Shortcut | Semana 3, aula 2 | Exemplos de acompanhamento; sem operação guiada da ferramenta |
| Funcional, exploratório, regressão, integração, smoke, usabilidade, unidade, API, ponta a ponta; não funcional, performance, sobrecarga e acessibilidade | Semanas 2 a 8 e 11 | Conceitos distribuídos por risco e técnica; casos nas etapas Exemplo |
| Objetivo da automação; diferenças web, mobile e back-end; xUnit | Semana 5, aula 2; semana 7, aula 1 | Critério de escolha e papel de cada camada |
| Front-end; HTML, CSS e JavaScript; DevTools, Console, Elements e Network; responsividade e adaptabilidade | Semana 6, aulas 1 e 2; semana 11, aula 2 | Diagnóstico guiado no navegador e exercício |
| Cypress, Playwright, Jasmine e Jest; custom commands; Page Objects, Builder e Chain of Responsibility | Semana 6, aula 2; semana 8, aulas 1 e 2 | Critério de uso, limite de abstração e caso de refatoração; sem tutorial completo por framework |
| Bruno e Swagger/OpenAPI; back-end, autenticação, autorização e papéis | Semana 7, aulas 1 e 2 | Contrato, matriz de acesso e caso de API |
| Lighthouse, Locust, carga e sobrecarga; acessibilidade; DevTools | Semana 11, aulas 1 e 2 | Pergunta por ferramenta, limites e caso resolvido; sem execução externa obrigatória |
| Segurança, vulnerabilidade, secrets e normas internas | Semana 9, aula 2; semana 10, aula 2; semana 12, aula 1 | Risco, proteção de evidência e decisão de release; normas de uma organização dependem de documentos próprios |
| Monitoramento, Functions e logs de banco e aplicação, incluindo App Insights | Semana 10, aula 1 | Correlação, sinais de incidente e caso de contenção |
| Git, GitHub e GitLab; CI/CD e Azure DevOps Pipelines | Semana 9, aulas 1 e 2 | PR, pipeline, gates, artefatos e caso resolvido |
| IA, divulgação de código e segurança da informação | Semana 12, aula 1 | Uso permitido conforme política, revisão humana e privacidade do case |
| Carreira em QA | Semana 12, aula 2 | Trilhas de atuação e plano de evolução |

## Pontos que o documento não define o suficiente

- `Loop(?)` aparece como possível ferramenta de gerenciamento, sem objetivo ou versão. Não foi transformado em aula específica.
- A comparação de carreira entre mercado e `ZBRA` exige informações da organização. O conteúdo ensina a comparar descrições reais de vagas e a construir um plano pessoal, sem inventar uma política interna.
- As ferramentas citadas recebem contexto e aplicação. Treinamento operacional completo em cada uma delas exigiria aulas e ambientes próprios; a mentoria atual prioriza raciocínio, evidência e transferência entre ferramentas.

## Conferência após a implementação

- Cada semana possui três aulas com título específico. Nas semanas 2–12, a terceira aula adicionada concentra os temas que antes apareciam dispersos; a semana 1 já tinha três aulas. O total passou de 25 para 36 sem renumerar as aulas existentes.
- Cada aula possui objetivo, blocos teóricos, exemplo, exercício e resposta comentada. A integração do RoadMapQA acrescentou três perguntas semanais sobre interpretação; outras duas perguntas do Megazord também entram no quiz atual. O estudante responde antes de revelar a resposta.
- Cada semana possui caso resolvido, extensão do desafio com evidências e critérios de revisão, além de fontes oficiais nos temas cobertos. Materiais de aprofundamento e exercícios adicionais continuam disponíveis na página de exemplo.
- Os destinos e o alcance listados acima descrevem cobertura pedagógica do conceito. Para ferramentas sem ambiente integrado, como Qase, Trello, Shortcut, Bruno, Azure DevOps e Locust, há critérios de escolha e tarefas de aplicação, sem tutorial operacional nem alegar execução dentro do QA Lab.
