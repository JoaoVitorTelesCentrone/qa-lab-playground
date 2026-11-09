# QA Lab — mentoria como caminho, Labs como prática

> Proposta de produto · novembro de 2026  
> Base: `path-v2`, `system-challenges`, trilhas e o mapa enviado na conversa.

## Objetivo

Cada aula da mentoria termina em um Lab com entrega. A mentoria define a ordem (módulo → capítulo → aula → Labs); as trilhas mostram recortes dos mesmos Labs, com progresso compartilhado. O catálogo informa a qual aula cada Lab pertence.

| Indicador | Situação descrita | Meta |
| --- | ---: | ---: |
| Aulas ligadas a um Lab | 0 | 37 de 40; as 3 do projeto final reutilizam evidências anteriores |
| Práticas apenas em texto | 48 | 0 |
| Labs existentes usados na mentoria | 0 | 16 |
| Destinos de “Abrir ambiente” | 14 | 1: o próprio Lab |
| Caminhos de aprendizagem independentes | 3 | 1, com trilhas como outras formas de entrada |

## 1. Estrutura do produto

### Situação inicial

- **Mentoria:** 7 módulos, 28 capítulos, 40 aulas, 48 práticas em texto, 12 marcos revisados pelo mentor e um link genérico de ambiente por capítulo. A prática pode ser marcada como feita sem evidência.
- **Labs:** 130 no catálogo, dos quais 101, 103 e 105 estão liberados. Cada Lab já tem briefing, roteiro, critérios e entrega, mas nenhuma aula aponta para ele.
- **Trilhas:** 4 percursos por Labs e 15 trilhas de curso. As trilhas de curso também chamam seus exercícios de “Labs”, embora sejam uma unidade diferente.

### Estrutura proposta

1. A mentoria é o caminho principal: módulo → capítulo → aula → 1 a 3 Labs por aula.
2. O Lab é a unidade de prática e de evidência. O marco do capítulo usa as entregas já feitas.
3. “Investigue o Broto” e “Agenda sem conflito” mostram os módulos 1 e 2 por outra entrada, mantendo o mesmo progresso.
4. As trilhas de curso aparecem como **Aprofundar** no capítulo correspondente e continuam disponíveis sozinhas.
5. O catálogo lista todos os Labs e mostra a aula associada a cada um.
6. Os Labs grátis 101, 103 e 105 formam o início real da mentoria.

### Mapa completo — 40 aulas, 50 Labs no caminho principal

**Legenda:** `LAB n` = Lab já existente no catálogo; `NOVO` = briefing a criar para um ambiente existente ou um caso novo. O número 131+ é a numeração prevista para os novos briefings.

#### Módulo 1 — Produto, risco e exploração

4 capítulos · 6 aulas · 8 Labs · mesma sequência da trilha “Investigue o Broto”.

| Capítulo | Aula | Prática |
| --- | --- | --- |
| 01 · Produto, atores e jornada | O que um QA decide · vídeo, 12 min | LAB 101 · Captura e retomada de um pensamento |
| 01 | Leitura do briefing · leitura, 10 min | LAB 103 · Problema, objetivo e organização |
| 02 · Regras, estados e riscos | Como o trabalho de QA percorre a entrega · leitura, 18 min | LAB 105 · Próximo passo e retomada; LAB 102 · Riscos na captura e retomada |
| 03 · Charter e heurísticas | Teste exploratório · vídeo, 20 min | LAB 107 · Exploração móvel e interrupção |
| 03 | Heurísticas úteis · leitura, 15 min | LAB 108 · Investigar a interrupção da captura |
| 04 · Execução e debrief | Exploração guiada · demo, 18 min | LAB 109 · Revisita e histórico; LAB 110 · Investigar a revisita |

Marco: **Dossiê de investigação**. Reforço opcional: Labs 104 e 106. Aprofundar: Testes exploratórios, Mentalidade de QA.

#### Módulo 2 — Desenho e comunicação de testes

5 capítulos · 6 aulas · 8 Labs · mesma sequência da trilha “Agenda sem conflito”.

| Capítulo | Aula | Prática |
| --- | --- | --- |
| 05 · Critérios e oráculos | Do plano de teste ao exemplo executável · leitura, 20 min | LAB 111 · Grade de horários e disponibilidade |
| 06 · Classes e limites | Técnicas que economizam tempo · vídeo, 22 min | LAB 119 · Atendimento fora da faixa; LAB 120 · Quebrar a faixa de atendimento |
| 07 · Estados e tabelas de decisão | Checklist de cenários · leitura, 12 min | LAB 117 · Cancelamento e liberação do horário; LAB 118 · Quebrar o cancelamento |
| 08 · Defeito e evidência | Bug report que resolve · vídeo, 18 min | LAB 114 · Quebrar o conflito de horário |
| 08 | Organizar técnicas e evidências · leitura, 18 min | LAB 116 · Quebrar o reagendamento |
| 09 · Recomendação de release | Template de release · leitura, 10 min | NOVO · Parecer sobre o conflito de horário (131) |

Marcos: **Matriz de cenários**, **Relato de defeito** e **Parecer de release**. Reforço opcional: Labs 112, 113 e 115. Aprofundar: Gherkin, Bug report, Testes de regressão.

#### Módulo 3 — Automação web

5 capítulos · 7 aulas · 10 Labs.

| Capítulo | Aula | Prática |
| --- | --- | --- |
| 10 · Estratégia e camadas | O que vale automatizar · vídeo, 20 min | NOVO · Comparar três jornadas candidatas (132) |
| 10 | Camadas, AAA e estratégia · leitura, 18 min | NOVO · Escolher a camada de cada verificação (133) |
| 11 · Front-end e DevTools | Fundamentos de front-end para QA · leitura, 20 min | `/test-suite` · Ligar ação, elemento e request (134) |
| 11 | DevTools como evidência · leitura, 10 min | `/test-suite` · Rede contra tela depois de recarregar (135) |
| 12 · Primeiro teste executável | Primeiro teste executável · vídeo, 25 min | `/test-suite` · Smoke de criar e reencontrar (136); rodar isolado e com dados novos (137) |
| 13 · Seletores e sincronia | Seletores e massa · demo, 20 min | `/labs/waits` · Seletor pela intenção (138); esperar a condição, não o relógio (139) |
| 14 · Dados e suíte sustentável | Matriz de candidatos · leitura, 12 min | `/test-suite` · Setup e limpeza de dados (140); rodar fora de ordem (141) |

Marcos: **Estratégia de automação** e **Smoke web executável**. Aprofundar: Cypress, Playwright, automação mobile.

#### Módulo 4 — APIs e confiabilidade da suíte

4 capítulos · 6 aulas · 9 Labs. A trilha “Funil comercial” serve como reforço.

| Capítulo | Aula | Prática |
| --- | --- | --- |
| 15 · HTTP, contrato e regra | API como produto · vídeo, 18 min | `/api-docs` · Request válido e inválido (142); LAB 122 · O número do funil contra o dado |
| 16 · Collection e dados | Contrato e dados · demo, 22 min | `/api-docs` · Collection no ambiente local (143); desafio de bug da collection (144) |
| 17 · Autenticação e autorização | API, contrato e controle de acesso · leitura, 20 min | `/api-docs` · Sem sessão e autenticado (145); duas contas, um recurso (146) |
| 18 · Arquitetura e flakiness | Suíte sustentável · vídeo, 24 min | `/labs/waits` · Reproduzir a espera frágil (147) |
| 18 | Como investigar flakiness · leitura, 15 min | `/labs/waits` · Três hipóteses, uma variável (148) |
| 18 | Padrões de automação com propósito · leitura, 18 min | `/labs/waits` · Refatorar e repetir (149) |

Marcos: **Collection Postman ou Bruno** e **Diagnóstico da suíte**. Reforço opcional: Labs 121 e 123–130. Aprofundar: Testes de API, SQL para QA.

#### Módulo 5 — CI/CD e operação

4 capítulos · 6 aulas · 7 Labs.

| Capítulo | Aula | Prática |
| --- | --- | --- |
| 19 · Git, PR e pipeline | Git, CI/CD e gates de qualidade · leitura, 20 min | `/lab/cicd` · Ler um workflow (150) |
| 19 | Pipeline do commit ao feedback · vídeo, 24 min | `/lab/cicd` · Pipeline para mudar uma regra do Broto (151) |
| 20 · Gates, secrets e artefatos | GitHub Actions seguro · demo, 20 min | `/lab/cicd` · Secrets em logs e artefatos (152) |
| 20 | Quality gate não é número mágico · vídeo, 20 min | `/lab/cicd` · O que bloqueia o merge (153) |
| 21 · Logs e triagem | Monitoramento e segurança na operação · leitura, 20 min | `/lab/logs` · Primeira divergência (154); duas hipóteses, uma evidência (155) |
| 22 · Contenção e rollback | Rollback e feature flag · leitura, 12 min | `/lab/logs` · Corrigir, reverter ou abrir exceção (156) |

Marco: **Pipeline e decisão de incidente**. Aprofundar: CI/CD, Métricas para QA.

#### Módulo 6 — Acessibilidade e performance

4 capítulos · 6 aulas · 8 Labs.

| Capítulo | Aula | Prática |
| --- | --- | --- |
| 23 · Acessibilidade por tarefa | Acessibilidade começa pela tarefa · leitura, 10 min | `/labs/acessibilidade` · Tarefa só com teclado (157) |
| 23 | Nome, erro e feedback · leitura, 10 min | `/labs/acessibilidade` · Erro que ajuda a corrigir (158) |
| 24 · Modelo de carga e segurança | Planejar e executar carga com segurança · vídeo, 22 min | `/mentoria/performance` · Modelo de carga (159); checklist de execução segura (160) |
| 25 · Execução com k6 | Teste de carga no pipeline · leitura, 20 min | `/mentoria/performance` · Baseline na API local (161) |
| 25 | Comparações válidas em carga · leitura, 10 min | `/mentoria/performance` · Rampa e pico no mesmo cenário (162) |
| 26 · Métricas e thresholds | Ler métricas e definir thresholds · demo, 18 min | `/mentoria/performance` · Comparar p95, erro e throughput (163); escolher um threshold (164) |

Marcos: **Auditoria por tarefa** e **Relatório de carga**. Aprofundar: Performance com k6.

#### Módulo 7 — Projeto de conclusão

2 capítulos · 3 aulas · nenhum Lab novo.

| Capítulo | Aula | Uso das evidências |
| --- | --- | --- |
| 27 · Case integrado | Como contar seu case · vídeo, 18 min | Escolher evidências de Labs concluídos |
| 27 | Checklist final · leitura, 10 min | Revisar as evidências escolhidas |
| 28 · Apresentação e portfólio | Carreira e uso responsável de informação · leitura, 18 min | Usar os cases publicados no portfólio |

Marco: **Case final**.

## 2. Experiência nas telas

### Capítulo

A seção “Faça” deixa de reunir frases ao fim do capítulo. Cada aula mostra seus Labs logo abaixo, com status derivado da entrega real. O marco aparece no fim, indicando quantos Labs já têm evidências. O link **Aprofundar** leva às trilhas de curso.

Exemplo do capítulo 01: aula 1 “O que um QA decide” → Lab 101 entregue; aula 2 “Leitura do briefing” → Lab 103 em andamento. O cabeçalho mostra 2 aulas, 2 Labs e tempo estimado.

### Lab e contexto de navegação

O conteúdo do Lab é o mesmo para todos. Para quem está na mentoria, o topo mostra módulo, capítulo e aula, e **Voltar** leva à aula. Para quem chega pelo site, mostra a trilha e um convite discreto para conhecer a aula da mentoria. A etapa e o estado do Lab permanecem compartilhados.

### Conclusão

Depois da entrega, **Publicar case** é a ação em destaque. O próximo passo segue a aula: outro Lab da mesma aula, próxima aula ou marco do capítulo. O marco informa quais evidências já estão disponíveis. As outras ações ficam em “Mais opções”.

### Trilha

“Investigue o Broto” apresenta os capítulos do módulo 1, em vez de dez Labs soltos. Exibe 3 de 10 Labs liberados, o progresso compartilhado e a data dos Labs agendados. Os capítulos seguintes indicam o conteúdo disponível na mentoria.

## 3. Fluxo dentro de um Lab

### Redução de passos

| Aspecto | Antes | Proposta |
| --- | ---: | ---: |
| Abas necessárias | 3 | 2: QA Lab e sistema testado |
| Roteiros para a mesma tarefa | 2 | 1 checklist no Lab |
| Etapas do Lab | 4 | 3: Preparar, Testar, Entregar |
| Critérios conferidos na entrega | 0 | 3, ligados ao pedido do Lab |
| Ações em destaque na conclusão | 9 | 1: Publicar case |

O caso de treino deixa de ser uma parada obrigatória. Seu roteiro e dados entram no Lab; `/conteudo/broto` continua como material de estudo. Assim, quem inicia pelo Lab não precisa alternar entre três abas nem lembrar de dois roteiros.

### Regras do fluxo

1. Toda aula termina em prática com entrega.
2. Toda etapa termina em uma ação: preparar a conta e os dados; testar pelo checklist; enviar a evidência.
3. Há um roteiro só: os passos e o “Observe” do caso de treino ficam no checklist do Lab.
4. A entrega mostra, antes do envio, quais critérios do Lab estão cobertos.

### Etapa 1 — Preparar

Mostrar missão, resultado a entregar, três critérios, conta de estudo, dados fictícios com botão de copiar e uma pista recolhida. No Lab 101, a missão é investigar se um pensamento fictício pode ser registrado e encontrado novamente no Broto, distinguindo observação de hipótese. O usuário prepara a conta e copia o pensamento antes de seguir.

### Etapa 2 — Testar

O botão **Abrir o sistema** fica visível e registra o início do Lab. Um checklist apresenta um passo por linha, com a observação correspondente. Anotações rápidas são salvas no navegador e passam para a entrega. A pessoa alterna apenas entre o QA Lab e o sistema.

### Etapa 3 — Entregar

Quatro campos curtos substituem o texto livre: **O que fiz**, **O que esperava**, **O que aconteceu** e **Minha conclusão**. A conclusão pode ser falha, comportamento esperado ou dúvida; severidade aparece apenas para falha. Os passos marcados sugerem um rascunho. Os critérios mudam de estado conforme o preenchimento. O formulário pode ser preenchido sem login; a autenticação ocorre no envio, preservando o rascunho.

## 4. Mudanças no código

| Área | Mudança proposta |
| --- | --- |
| `lib/mentorship/lesson-labs.ts` | Fonte única de aula → números de Labs, com consultas inversas e por capítulo. |
| `lib/mentorship/path-v2.ts` | Substituir práticas em texto na experiência; contar Labs entregues no progresso. |
| `lib/system-challenges.ts` | Adicionar Labs 131+ para os ambientes existentes, com `prepare` e `steps`. |
| `app/conteudo/modulos/[module]/[chapter]` | Exibir Labs por aula, status e evidências disponíveis para o marco. |
| `lib/product/tracks.ts` | Associar trilha a módulo e agrupar a página por capítulo. |
| `components/labs/lab-briefing.tsx` | Três etapas e contexto de retorno conforme a entrada. |
| `components/labs/evidence-field.tsx` e `lib/product/evaluation.ts` | Entrega estruturada e verificação de critérios no cliente e servidor. |
| `app/labs/[number]/conclusao` | Publicar case em destaque e sugerir o próximo passo da aula. |
| Marcos (`pathV2Assignments`) | Oferecer cases dos Labs do capítulo para seleção, evitando reescrever a entrega do zero. |

A proposta prevê uma primeira versão sem migração: o progresso de práticas passa a ser derivado das entregas dos Labs.

## 5. Ordem de execução

| Fase | Entrega | Escopo |
| --- | --- | --- |
| 1 · O mapa | Aulas apontam para Labs; capítulo mostra Labs por aula; progresso vem das entregas | Módulos 1 e 2 e Lab 122; 16 Labs existentes; sem migração |
| 2 · Uma tela | Preparar, Testar e Entregar; contexto por perfil; conclusão volta à aula | Briefing, desafios e conclusão |
| 3 · Entrega que prova | Quatro campos, cobertura ao vivo dos critérios, marco reutiliza cases do capítulo | Primeiro definir o vínculo critério → evidência; depois formulário, avaliação, API e envio do marco |
| 4 · Módulos 3 a 6 | 34 Labs novos e “Aprofundar” para trilhas de curso | 31 briefings para ambientes existentes e 3 casos novos; um módulo por lançamento |

Cada fase deve poder ser publicada de forma independente. As fases 1 e 2 usam Labs que já existiam.

### Contrato da fase 3: critério não é apenas campo preenchido

Os quatro campos (o que fiz, esperado, observado, conclusão) dão estrutura à entrega, mas não provam por si só cada critério específico do Lab. Por exemplo, uma frase preenchida em “O que aconteceu” não demonstra automaticamente que a reprodução tem passos claros. A cobertura precisa ser definida explicitamente por Lab, sem inferir qualidade pelo tamanho ou presença de texto.

Para cada Lab do caminho da mentoria, registrar um vínculo entre cada critério de aceite e uma ou mais partes da entrega. A interface calcula e mostra a cobertura; o servidor recalcula o mesmo resultado a partir dos dados recebidos. A cobertura é informativa: campos ou critérios incompletos não bloqueiam o envio. A regra geral atual da API (evidência textual mínima ou anexo) continua sendo uma validação separada até uma decisão de produto alterá-la.

O formato persistido pode continuar sendo `lab_submissions.evidence`, com os quatro campos serializados. Assim, os status são derivados da própria entrega e não exigem migração. Se não houver mapeamento para um Lab, mostrar os campos estruturados sem afirmar que os critérios específicos foram avaliados.

### Contrato do marco

O marco pertence ao capítulo. Seu total e a seleção de cases devem vir dos Labs daquele capítulo, não dos Labs do módulo inteiro. A evidência anexada ao marco deve referenciar as entregas existentes; não se deve duplicar nem copiar o texto para uma nova entrega independente.

## 6. Decisões de produto recomendadas

| Pergunta | Recomendação |
| --- | --- |
| O Lab mostra aula ou trilha? | Mostrar a aula a quem está matriculado; mostrar a trilha ao público, com uma linha que indica a aula correspondente. |
| O marco exige todos os Labs? | Não bloquear; mostrar quantos têm evidência e deixar o mentor decidir na revisão. |
| Como chamar os “Labs” das trilhas de curso? | “Exercícios” até virarem Labs numerados do catálogo. |
| CRM fica no módulo 4? | Usar apenas o Lab 122 no caminho principal; manter os outros como reforço. |
| Conta do Broto pode ser compartilhada? | Oferecer conta de demonstração no capítulo 01 e conta própria a partir do capítulo 02. |
| Critérios bloqueiam o envio? | Não bloquear; mostrar lacunas e indicar no case os critérios atendidos. |

## 7. Estado encontrado no repositório em 8/11/2026

Esta seção registra a inspeção local feita depois da proposta; **não equivale a validação em produção**. As alterações citadas estavam sem commit.

- O mapa aula → Lab existe em `lib/mentorship/lesson-labs-data.ts` e `lesson-labs.ts`, cobrindo os 50 Labs do caminho principal.
- Os briefings 131–164 foram adicionados em `lib/labs/mentorship-labs.ts`.
- Há mudanças locais nas páginas de capítulo, trilhas, Lab e conclusão para usar esse mapa e o fluxo de três etapas.
- O formulário estruturado usa `lib/product/delivery.ts`. A interface e a API calculam a cobertura estrutural dos critérios a partir da entrega serializada; a API continua aplicando separadamente a regra mínima de evidência ou anexo.
- `acceptanceFields` associa cada critério aos campos relevantes. Os Labs 101, 103, 105 e 131–164 têm associações definidas no conteúdo; os demais Labs reaproveitados usam um padrão por tipo de percurso. O status confirma campos preenchidos, não a qualidade semântica da resposta.
- As `practices` antigas ainda existem nos dados de `path-v2.ts`, embora o progresso novo conte entregas de Labs.
- O contador de progresso do marco na conclusão e na página do capítulo usa os Labs do capítulo (`labsForChapter`), e não os do módulo.
- A página do marco oferece para vincular as entregas dos Labs daquele capítulo. No projeto final, oferece as entregas do caminho inteiro.
- O case apresenta os critérios pedidos e, para entregas estruturadas, informa quais campos associados estão preenchidos. Entregas antigas em texto livre continuam sem esse resumo.
- Nesta etapa não foram executados testes nem validação ponta a ponta. O fluxo no navegador ainda precisa ser verificado.

### Próximas verificações para concluir o plano

1. Revisar com mentores o mapa critério → parte da entrega para os 50 Labs do caminho principal; completar as associações personalizadas que ainda usam o padrão por tipo de percurso.
2. Validar que cliente e API usam os mesmos campos e que o servidor recalcula a cobertura sem confiar em checks enviados pelo cliente.
3. Revisar o case com entregas novas e antigas. O status de cobertura não deve parecer uma aprovação semântica automática.
4. Confirmar que as evidências vinculadas ao marco aparecem para o mentor na revisão, e que o projeto final aceita referências aos Labs anteriores.
5. Validar ponta a ponta: aula → Lab → rascunho → autenticação → entrega → conclusão → volta à aula, para mentorado e público.
6. Revisar disponibilidade e destinos dos Labs 131–164 antes de liberar cada módulo.
