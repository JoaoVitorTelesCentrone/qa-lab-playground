# Próximos passos — Labs no Broto

> Atualizado em 9/11/2026. Complementa `docs/PLANO_MENTORIA_LABS_2026-11.md`.
> Este arquivo reúne o que o João decidiu e o que ainda precisa ser criado.

## 1. Decisões do João (valem para tudo abaixo)

| Decisão | Efeito |
| --- | --- |
| O Broto Space é do João | Testes e carga contra `brotospace.com` estão autorizados. Mantemos método: conta de estudo, poucas execuções, janela combinada. |
| Todos os Labs ficam liberados agora | Os 164 Labs estão com status "liberado" em `lib/playground/catalog.ts`. Só 101, 103 e 105 mantêm a numeração 01–03. |
| O caminho da mentoria usa o Broto como sistema testado | Roteiro, dados e critérios dos Labs da mentoria são reescritos sobre o Broto. Os Labs 1–100 (loja) ficam como estão. |
| Cada aluno cria a própria conta de estudo no Broto | Não há conta compartilhada. Credenciais ficam fora do código e das evidências (variáveis de ambiente). |
| Collections de API ainda não existem | O aluno as gera a partir das requisições do navegador (Copy as cURL ou HAR). Veja a seção 3. |
| Não existe repositório do Broto com workflows de CI | Os Labs de CI/CD precisam de um workflow de exemplo criado por nós. Veja a seção 3. |
| `practices` antigas ficam como legado (opção 2) | Dados e endpoint intactos; só a interface do capítulo deixou de usá-las. |

## 2. Estado da conversão para o Broto

| Módulo | Labs | Situação |
| --- | --- | --- |
| 1 · Produto, risco e exploração | 101–110 | Já eram do Broto. |
| 2 · Desenho e comunicação de testes | 111–120, 131 | Convertido. Trilha renomeada para "Desenho de testes no Broto" (`/trilhas/desenho-de-testes-no-broto`). |
| 3 · Automação web | 132–141 | Convertido. Teste executável roda na máquina do aluno (Playwright ou Cypress). |
| 4 · APIs e confiabilidade | 142–149, 122 e reforço 121–130 | Convertido. Trilha "Funil comercial" virou "Dados e API no Broto" (`/trilhas/dados-e-api-no-broto`). |
| 5 · CI/CD e operação | 150–156 | Convertido. Workflows e logs são fictícios e vivem dentro dos Labs (botão de copiar). |
| 6 · Acessibilidade e performance | 157–164 | **Falta converter.** |
| 7 · Projeto de conclusão | — | Sem Lab novo; usa evidências anteriores. |

Os endereços antigos `/trilhas/agenda-sem-conflito` e `/trilhas/funil-comercial` não existem mais.

## 3. O que precisa ser criado

### 3.1 Contrato e collections de API do Broto
- Não há collection nem contrato público. Os Labs 142–146 pedem que o aluno monte a própria.
- **Criar:** uma collection de referência (Postman e Bruno) e um contrato (OpenAPI ou tabela) do fluxo principal: entrar, registrar, buscar de volta. Serve para conferir as entregas dos alunos e para os mentores.
- **Decidir:** publicar a collection de referência para os alunos ou mantê-la só para mentores.

### 3.2 Workflow de CI/CD (módulo 5)
- **Feito:** os Labs 150 e 152 trazem um workflow fictício de GitHub Actions dentro do Lab (botão de copiar): um com as etapas fora de ordem e outro com secrets vazando em log, arquivo e artefato. Os Labs 151 e 153 usam sinais fictícios de pipeline.
- **Ainda não existe:** um repositório real do Broto com workflows. Se um dia existir, trocar o workflow fictício por ele.
- **Decidir:** vale criar um repositório de exemplo para o aluno rodar o workflow de verdade?

### 3.3 Operação, logs e incidente (Labs 154–156)
- **Feito:** dois incidentes fictícios inspirados no Broto (crescimento visível atrasado e sequência zerada à meia-noite), com logs dentro do Lab. Eles avisam que não descrevem a arquitetura real do Broto.
- **Conferir:** se os nomes usados nos logs (fila de crescimento, job de virada de sequência, flag do novo processamento) devem refletir o Broto real ou continuar genéricos.

### 3.4 Performance contra o Broto (Labs 159–164)
- Hoje usam `/mentoria/performance` e uma API local.
- **Definir antes de converter:** janela de execução, perfil máximo (usuários virtuais e duração), conta de teste, e quem acompanha o Broto durante a carga.
- **Criar:** o script k6 de referência e o checklist de execução segura.

### 3.5 Conferir os roteiros contra o produto real
Os roteiros foram escritos a partir do conteúdo da mentoria, sem abrir o Broto. Conferir, Lab a Lab, se o produto tem:
- tela de captura na Mente, campo de texto e botão de salvar (Labs 134–141);
- heatmap e sequência (Labs 113, 114 e 122);
- conexão entre ideia, desafio e ação, e seus estados (Labs 115–118);
- busca, exclusão e registros duplicados (Labs 123–130 e 140).

Onde o roteiro diz "se a sua conta oferecer", ele já se defende. Nos demais pontos, ajustar o texto ao produto.

### 3.6 Remoção de dados de teste
- O Lab 140 pergunta como limpar os registros que o teste cria.
- **Decidir:** o Broto oferece exclusão? Se não, criar uma forma de limpar contas de estudo.

## 4. Pendências do plano original

1. Revisão dos mentores do vínculo critério → campo da entrega. Os Labs reaproveitados ainda usam o padrão por tipo de percurso.
2. Evidências de Labs ligadas ao marco: confirmar com o mentor logado que elas aparecem na revisão, e que o projeto final aceita referências aos Labs anteriores.
3. Revisar o case com entregas novas e antigas (a cobertura não pode parecer aprovação automática).
4. Aposentar de vez as `practices` antigas (opção 1), junto com uma migração de dados.
5. Commit: as mudanças do plano, da liberação geral e da revisão de UX estão misturadas no working tree. Separar em commits.

## 5. Pendências da revisão de UX (de 8/11/2026)

- Política de reembolso do Pro.
- Quem é o mentor (bloco "quem conduz" da mentoria).
- Páginas de termos e privacidade (o rodapé não linka).
- Imagem `public/mentoria/qa-lab-bug-report.webp` ainda mostra a interface antiga.

## 6. Verificação

Rodar a cada módulo convertido:

```bash
bunx tsc --noEmit
bun test lib
bun run build
PLAYWRIGHT_LOCAL_PORT=3105 bunx playwright test tests/e2e/launch-smoke.e2e.ts tests/e2e/onboarding.e2e.ts tests/e2e/mentorship-labs-flow.e2e.ts tests/e2e/content-area.e2e.ts
bun run test:e2e:mentorship   # exige Docker ligado
```

Estado na última rodada (após o módulo 4): type-check e lint limpos, 366 testes unitários, 18 e2e públicos e 9 e2e de mentoria com banco local passando.
Não verificado: o fluxo completo com um mentor real revisando, e os roteiros contra o Broto em produção.

## 7. Labs de automação por ferramenta (9/11/2026)

Os cursos de ferramenta já existiam (Cypress, Playwright, Selenium e Appium, k6, Postman e Bruno), com prática no Broto, entregável, checklist e código de exemplo em cada módulo. Em vez de escrever Labs novos, cada módulo foi transformado em um Lab numerado do catálogo, gerado por `lib/labs/course-labs.ts`:

| Curso | Labs | Números de catálogo |
| --- | ---: | --- |
| Cypress | 12 | 201–212 |
| Playwright | 13 | 221–233 |
| Selenium e Appium | 12 | 241–252 |
| k6 | 12 | 261–272 |
| Postman | 6 | 281–286 |
| Bruno | 6 | 301–306 |

O conteúdo continua morando nos cursos (`lib/*-course.ts`): prática vira o roteiro, entregável vira o resultado esperado, checklist vira os critérios, o código vira o botão de copiar e o Lab linka a aula do curso. Um módulo novo no fim de um curso ganha o próximo número do bloco e não desloca os outros cursos.

Onde aparecem: no bloco "Automação por ferramenta" da lista de Labs e como "Praticar mais" no último capítulo dos módulos 3 (Cypress, Playwright, Selenium e Appium), 4 (Postman e Bruno) e 6 (k6). Não contam no progresso nem no certificado da mentoria.

Pontos abertos:
- O progresso do curso (salvo em `/trilhas/<curso>`) e o do Lab (entrega) são separados: concluir um não marca o outro.
- Os 13 módulos de fundamentos de API (`apiTestingFundamentals`) não viraram Labs; são conteúdo geral, não de ferramenta.
- O k6 do curso usa a API local de treino, não o Broto em produção; os Labs de k6 abrem `/mentoria/performance`. A janela e o perfil de carga contra o Broto continuam pendentes (seção 3.4).
- Os Labs 159–164 antigos (carga em "API local") se sobrepõem aos de k6 novos.

## 8. Bancadas interativas de QA

O hub `/lab/ferramentas` agora reúne dez ferramentas locais: SQL Explorer, Contract Inspector, Visual Diff Bench, Trace Explorer, HTTP Request Runner, Load Profile Bench, Accessibility Inspector, Security Probe, Test Data Factory e State Machine Explorer. A quantidade de Labs segue as capacidades distintas de cada bancada, sem meta fixa de dez. Cada Lab tem briefing e critérios próprios e abre a bancada no cenário correspondente. Elas usam dados sintéticos no navegador; nenhuma consulta SQL sai do conjunto `orders` nem executa escrita, e os demais cenários não chamam serviços externos.

| Bancada | Labs | Cobertura distinta |
| --- | ---: | --- |
| SQL Explorer | 7 | Valor negativo, consistência de estados, pagamento zerado, identidade duplicada, ambiguidade do zero, recorte auditável e valor atípico. |
| Contract Inspector | 7 | Tipos, campo ausente, coleção vazia, validação de todos os itens, faixa de quantidade, contrato de erro 422 e seleção de assertions de release. |
| Visual Diff Bench | 5 | Ação encoberta, corte no mobile, contraste, ausência de regressão e escolha da cobertura visual. |
| Trace Explorer | 6 | Linha do tempo, causa inicial, backlog, isolamento de requisições, resposta 201 com pagamento pendente e comunicação de impacto. |
| HTTP Request Runner | 6 | Listagem, autenticação, 404, validação de criação, idempotência e conflito de transição. |
| Load Profile Bench | 5 | Linha de base, saturação, dependência degradada, pico e gate por SLO. |
| Accessibility Inspector | 5 | Rótulo, foco, contraste, anúncio de erro e controle sem defeito. |
| Security Probe | 5 | Entrada suspeita, texto hostil, autorização por dono, limite de taxa e controle válido. |
| Test Data Factory | 5 | Seed reproduzível, fronteiras, e-mail inválido, duplicidade e campo ausente. |
| State Machine Explorer | 5 | Caminho válido, salto inválido, cancelamento, reembolso e repetição de ação. |

Os IDs publicados foram preservados; há lacunas entre 401 e 439 após remover missões repetidas. O validador agora escolhe o contrato de sucesso ou de erro pelo status, identifica falhas em cada item e diferencia campo ausente de tipo inválido. A bancada visual mostra a sobreposição sobre a ação principal e o corte do valor no mobile.

O catálogo de desafios ganhou doze práticas novas (IDs 31–42) ligadas às ferramentas, levando os desafios guiados de 30 para 42. Os 56 Labs numerados das bancadas entram também no catálogo `/labs`, além dos 61 Labs de curso já listados acima. Os novos IDs de ferramenta ocupam 441–471.
