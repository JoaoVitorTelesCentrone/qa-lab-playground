# Análise de preparação para a primeira turma

Data da análise: 24/10/2026.

**Acompanhamento da implementação:** I1–I5 foram implementados e validados localmente. Veja `VALIDACAO_PRIORIDADES_ALTAS_PRIMEIRA_TURMA.md` para resultados e limites, e `MENTORIA_RUNBOOK.md` para os novos comandos, migrações e configuração de e-mails. As constatações abaixo preservam a fotografia inicial; os resultados locais não comprovam a publicação remota.

## Parecer

O projeto já contém o núcleo necessário para operar uma mentoria. A prioridade é fechar lacunas da experiência v2, preparar a oferta e comprovar o funcionamento da jornada com contas de teste. A evidência disponível ainda não sustenta abrir uma turma paga com toda a operação automatizada.

Esta análise considera o estado atual do workspace, inclusive alterações locais ainda não commitadas. Não comprova qual versão está publicada, quais migrações estão aplicadas ou quais vídeos estão cadastrados no banco remoto. Não foram alterados código da aplicação, banco, pagamentos ou configurações de produção.

## Base existente

| Área | Implementação encontrada | Limite da evidência |
| --- | --- | --- |
| Conteúdo v2 | 7 módulos, 28 capítulos, 40 aulas, 48 práticas autodeclaradas e 12 entregas avaliadas | Estrutura e regras locais; qualidade pedagógica precisa de execução observada |
| Entrada | Lista de interesse, inscrição, oferta, reserva, confirmação administrativa e bolsas | Configuração e percurso real ainda dependem da operação |
| Pagamento | Checkout próprio da mentoria, webhook, conciliação e matrícula separados do Pro | Compra sandbox e operação publicada não verificadas nesta análise |
| Aluno | Diagnóstico, painel, próxima ação, progresso, entregas, anexos, tentativas e feedback | Jornada autenticada v2 não executada |
| Mentor e admin | Turmas, vínculos, fila, rubricas, revisão, sessões, presença e métricas | Permissões entre contas/turmas precisam de validação integrada |
| Resultado | Portfólio voluntário, cases e certificado com requisitos por versão | Banco, Storage e publicação com contas separadas ainda precisam de validação |
| Comunicação | Notificações internas, outbox, retentativas, envio de e-mail e cron | Frequência e capacidade atuais são insuficientes para prometer comunicação imediata |

Fontes: `packages/web/lib/mentorship/path-v2.ts`, `path-v2.test.ts`, `store.ts`, `access.ts`, `portfolio.ts`, `email.ts`; rotas `packages/web/app/api/v1/mentorship`; `docs/TRILHA_MENTORIA_V2.md`.

## Implementações prioritárias

### I1 — Disponibilizar encontros e gravações na experiência v2

**Constatação:** `packages/web/components/mentorship/path-v2-dashboard.tsx:19` seleciona o próximo encontro, e a renderização da linha 26 oferece apenas essa sessão futura. Não há apresentação das gravações anteriores nesse componente ou nos capítulos v2. `packages/web/app/mentoria/semanas/[week]/page.tsx:36` redireciona alunos v2 antes da seção antiga que exibe gravação e compromisso semanal, na linha 115.

**Implementar:** área da turma com calendário, pauta, sessões anteriores e gravações disponíveis, separada dos capítulos. Recuperar a interação de compromisso semanal se ela permanecer na proposta pedagógica. Apontar lembretes de encontro para essa área: hoje `email.ts` os envia para as antigas páginas de semana, que redirecionam para conteúdo.

**Aceite:** aluno v2 encontra o próximo encontro e um replay anterior; gravações vencidas não aparecem; aluno de outra turma não recebe o link; lembrete abre a sessão correta. Compromissos, quando mantidos, podem ser registrados e consultados pelo mentor.

### I2 — Exibir materiais de apoio cadastrados no admin

**Constatação:** `store.ts:125` consulta `material_url`, e `saveLessonContentAdmin` permite gravá-lo. A página `packages/web/app/conteudo/modulos/[module]/[chapter]/page.tsx:45` usa o vídeo publicado, mas não renderiza `material_url`.

**Implementar:** acesso aos materiais junto de cada aula, respeitando as mesmas regras de publicação e acesso do vídeo.

**Aceite:** material publicado aparece na aula certa para o aluno autorizado; rascunho e publicação futura permanecem indisponíveis antes da liberação; leitura continua funcionando sem vídeo ou material.

### I3 — Ajustar processamento e acompanhamento de e-mails

**Constatação:** `packages/web/vercel.json` agenda o processamento uma vez por dia. `packages/web/app/api/cron/mentorship-emails/route.ts:12` processa até 30 mensagens por execução. Os eventos apenas enfileiram mensagens em `store.ts:22`; as retentativas de `email.ts:102` não provocam uma nova execução por conta própria.

**Consequência:** uma confirmação pode esperar quase um dia mesmo sem falha. Vinte alunos recebendo dois avisos geram 40 mensagens, acima do lote diário configurado. Falhas e avisos do mentor competem pela mesma capacidade.

**Implementar:** processamento frequente ou acionado por evento, lotes compatíveis com a turma, acompanhamento da idade da fila e alertas de falha. Validar remetente e recebimento. Se a primeira turma usar atendimento manual temporário, registrar responsável e prazo de comunicação.

**Aceite:** confirmação e feedback chegam dentro do prazo publicado; fila escoa em cenário de pico; repetição não duplica envio; falha gera retentativa e sinal operacional verificável.

### I4 — Atualizar os testes da jornada para a v2

**Constatação:** `packages/web/tests/e2e/mentorship-journey.e2e.ts` ainda navega por `/mentoria/semanas/[week]`, espera elementos antigos como “Entrega do aluno” e cobre checkout Pro em um cenário separado. A v2 redireciona as semanas para capítulos e a página atual de revisão usa o título da entrega. Os testes autenticados são condicionais a credenciais e flags. O CI de `.github/workflows/quality.yml` executa apenas o smoke público de navegador.

**Implementar:** jornada v2 com diagnóstico, capítulo, aula, prática, anexo, envio, pedido de ajuste, reenvio e aprovação; cobertura de case final e certificado; fluxo do checkout da mentoria. Preservar verificações v1 como compatibilidade quando necessário.

**Aceite:** execução registrada com aluno, mentor e admin; testes obrigatórios do lançamento não passam silenciosamente como ignorados; pagamento Pro não conta como evidência de compra da mentoria.

### I5 — Ampliar os testes de isolamento e regras de conclusão

**Constatação:** `packages/web/supabase/tests/mentorship_hardening.test.sql` contém nove verificações de políticas e privilégios de notificações/outbox. Isso é útil, mas não demonstra o isolamento completo de entregas e arquivos entre dois alunos e dois mentores de turmas diferentes. Os testes locais da v2 validam o catálogo e a agregação de progresso; não substituem a execução das operações autenticadas.

**Implementar:** testes de integração/RLS com papéis reais no banco local, incluindo acesso cruzado, troca indevida de identificadores, anexos, matrícula convidada/pausada/concluída e certificado. Provar que o case final exige as 11 entregas anteriores e que o certificado exige as 40 aulas, 48 práticas e 12 entregas aprovadas.

**Aceite:** aluno B não lê nem altera entregas, rascunhos e anexos de A; mentor de outra turma não revisa A; estados de matrícula respeitam leitura e escrita; conclusão incompleta não emite certificado.

### I6 — Fechar ajustes menores e a documentação de operação

- Na página de capítulo, `canTrack` aceita matrícula v2 em estado `completed`, pois só exclui `paused`; a API de escrita exige `active`. Ajustar os controles para o concluinte consultar seu histórico sem oferecer operações que serão recusadas.
- Atualizar links de feedback v2 para a entrega correta; hoje o fallback da notificação vai ao painel geral.
- Unificar o canal de suporte nas mensagens, telas e oferta. Há tela de pausa apontando para o LinkedIn da empresa.
- Alinhar runbook e planos antigos ao ambiente confirmado: um remoto e ensaio local. O runbook antigo ainda pede outro projeto de staging; o gate mais recente registra que ele não existe.
- Atualizar checklist de migrações do portfólio para contemplar também `20261025020450_portfolio_appearance.sql` quando essa funcionalidade fizer parte do deploy candidato.
- Definir rotina e responsável para a limpeza de arquivos órfãos. O script existe; não há agendamento dele no `vercel.json` ou nos workflows inspecionados.

## Configuração, conteúdo e operação necessários

| Entrega | O que falta comprovar ou concluir | Pronto quando |
| --- | --- | --- |
| Oferta da turma | Preço, parcelamento, datas, capacidade, mentor, inscrições, suporte e condições | Dados aprovados e iguais na página, checkout e comunicação |
| Conteúdo inicial | Revisão pedagógica e disponibilidade dos vídeos prometidos | Início da turma pode ser cursado sem conteúdo provisório; restante tem escopo e publicação definidos |
| Agenda | Doze encontros, horários, fuso, pauta, links e regra de replay | Aluno entende quando participar e como recuperar um encontro |
| Feedback e suporte | Responsável, prazo, carga máxima, ausência do mentor e contingência | Equipe consegue revisar e responder dentro do compromisso publicado |
| Backend publicado | Projeto correto, histórico das duas árvores de migrações, Auth, RLS, Storage e variáveis | Ensaio local aprovado e smoke controlado no remoto registrados |
| Pagamento | Aprovação, pendência, recusa, repetição, reembolso, expiração e última vaga | Cada estado tem resultado correto e tratamento operacional; sem matrícula ou vaga duplicada |
| Arquivos e portfólio | Upload, quotas, falha, reenvio, privacidade, publicação e despublicação | Jornada com contas separadas e visitante aprovada, sem exposição de rascunhos/arquivos privados |
| Recuperação e monitoramento | Backup, ensaio de restauração, rollback, falhas de pagamento/e-mail/upload | Responsável consegue detectar e tratar incidente com procedimento verificável |
| Uso dos dados | Informações ao aluno, gravação, publicação voluntária e canal para solicitações | Regras publicadas e procedimento operacional definido; não exige construir um painel completo para o piloto |
| Exercícios no Broto | Escopo de uso e preparação do ambiente externo | Instruções funcionam para alguém de fora; API/carga continuam no alvo educacional local enquanto não houver outro alvo autorizado |

`docs/PLANO_ENTRADA_ALUNOS_MENTORIA.md:14` ainda registra decisões comerciais pendentes. `docs/VIDEOAULAS_MENTORIA.md:3` registra gravações e hospedagem pendentes; isso não comprova a inexistência de vídeos cadastrados fora do workspace. O player e a publicação já existem: a produção dos vídeos é uma entrega de conteúdo.

`docs/BROTO_API_INTEGRATION.md` esclarece que a API educacional local está disponível e que contrato/staging de API do Broto não estão disponíveis no workspace. A turma pode usar o alvo local, com essa diferença explícita na oferta e nas atividades.

## Riscos que determinam a ordem

As probabilidades abaixo são estimativas derivadas do código e do estado de validação, não incidentes observados em produção. A classificação usa impacto × probabilidade da skill de QA.

| Risco | Impacto | Probabilidade | Nível | Ação |
| --- | --- | --- | --- | --- |
| Venda ou acesso falha por integração/configuração não validada | Alto | Média | Alto | Ensaio de matrícula e pagamento, incluindo exceções |
| Dados e anexos acessíveis entre contas/turmas | Alto | Média | Alto | Testes reais de papéis, APIs e Storage |
| Aluno v2 não encontra materiais e replay publicados | Médio | Alta | Alto | I1 e I2 antes de prometer essas entregas |
| Comunicação atrasa por frequência/lote da fila | Médio | Alta | Alto | I3 ou atendimento manual com prazo definido |
| CI público verde é interpretado como jornada paga validada | Alto | Média | Alto | I4, I5 e registro de execução por perfil |
| Conteúdo/agenda não acompanha o que foi vendido | Alto | Média | Alto | Oferta, produção inicial e ensaio pedagógico |

## Sequência recomendada

1. **Fechar a promessa:** confirmar v2, formato, preço, datas, capacidade, feedback, vídeos e suporte; marcar documentos antigos como históricos.
2. **Concluir a experiência v2:** encontros/replays, materiais, links de notificação e estados da matrícula; ajustar a comunicação.
3. **Atualizar a validação:** E2E v2, isolamento e conclusão; preparar contas descartáveis e dados locais.
4. **Ensaiar a publicação:** fixar commit candidato, comparar e ensaiar migrações no Supabase local, validar backup e registrar smoke controlado no único remoto.
5. **Ensaiar a operação:** uma pessoa de fora completa diagnóstico → prática → entrega → ajustes → aprovação; testar uma compra sandbox e o resultado publicável com dados de teste.
6. **Abrir piloto pequeno:** acompanhar erros, dúvidas e tempo real de feedback diariamente; só aumentar a turma após medir a capacidade de revisão.

A admissão manual controlada já está prevista e implementada. Ela pode reduzir a dependência do checkout automático para um piloto, desde que confirmação financeira, capacidade, condições aceitas e acesso sejam conferidos. Não substitui a validação da plataforma nem permite apresentar o pagamento automático como concluído.

## Critério de liberação

- Oferta, agenda e responsáveis definidos.
- Conteúdo inicial revisado e disponibilidade de vídeos comunicada com precisão.
- Pendências I1/I2 resolvidas quando materiais e replay fizerem parte da oferta.
- Aluno v2 completa envio e correção; mentor aprova; resultado aparece no painel.
- Acesso indevido entre contas/turmas negado, incluindo arquivos.
- Compra sandbox validada se o lançamento incluir checkout automático; alternativa manual documentada quando adotada.
- Portfólio e certificado validados com dados de teste e consentimento explícito de publicação.
- Comunicação entregue dentro do prazo, falhas visíveis e recuperação ensaiada.
- Mobile, teclado e mensagens de erro verificados na jornada autenticada.
- Evidências registradas em `docs/STAGING_GATE_QA_LAB.md`, com URL, commit, migrações e perfis.

## Verificações executadas nesta análise

| Comando | Resultado |
| --- | --- |
| `bun test packages/web` | 304 testes passaram; zero falhas; 48 arquivos; 5.493 assertions |
| `bun run lint` | Sucesso; zero erros e oito avisos |
| `bun run build` | Sucesso; compilação, TypeScript e geração de páginas concluídos |
| `bun run test:e2e:smoke` em `packages/web` | Seis testes públicos passaram em Chromium; inclui inscrição mobile e rejeição de escrita anônima |

Não foram executados: jornada autenticada, compra sandbox, pgTAP, ensaio de restauração, carga, revisão visual autenticada ou validação do deploy remoto. O smoke aprovado não demonstra funcionamento de matrícula, feedback, arquivos, checkout ou certificado. Os achados de código foram relidos em uma segunda passagem estruturada; não houve revisão independente.

## Escopo a deixar para depois

Novos Labs, novas trilhas, aplicativo nativo, videoconferência própria, comunidade própria, correção geral por IA, CMS completo, analytics de marketing avançado e novas variações visuais do portfólio. O código de portfólio existente precisa ser validado, mas ampliar personalização agora não resolve os bloqueios identificados.

O próximo trabalho de engenharia mais útil é fechar a experiência v2 de encontros/gravações e materiais, junto de uma jornada automatizada v2 que proteja esses caminhos.
