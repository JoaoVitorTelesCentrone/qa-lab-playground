# Plano de migração: de semanas para temas

**Estado atual:** estrutura principal implementada localmente. O catálogo e o painel navegam por seis temas, cada página de tema reúne duas unidades e apresenta uma missão integradora. As chaves de aulas, entregas e calendário semanal continuam compatíveis com os dados existentes. A revisão de conta autenticada e publicação gradual ainda depende de ambiente com matrícula de staging.

## 1. Decisão recomendada

Transformar os seis agrupadores que hoje aparecem como fases em seis **temas principais de aprendizagem**. Cada tema reúne duas unidades atuais e passa a ser a principal forma de navegar, entender o conteúdo e acompanhar o progresso.

As semanas não devem ser removidas do domínio operacional no primeiro momento. Elas continuam existindo internamente para agenda de turmas, encontros ao vivo, compromissos e compatibilidade com dados antigos, mas deixam de organizar o catálogo público e a experiência de estudo.

Essa abordagem resolve a sensação de pouco conteúdo sem inflar artificialmente as aulas e evita uma migração arriscada de progresso, entregas e agenda.

## 2. Nova estrutura proposta

| Tema | Unidades atuais | Conteúdo reunido | Resultado principal |
| --- | --- | --- | --- |
| 1. Fundamentos, produto e risco | Semanas 1–2 | Mentalidade QA, contexto, risco, exploração e priorização | Mapa de risco e sessão exploratória com evidências |
| 2. Estratégia e comunicação de testes | Semanas 3–4 | Técnicas, cobertura, cenários, bug report e decisão de release | Plano de testes, cenários e relatório de release |
| 3. Automação web com critério | Semanas 5–6 | Pirâmide, seleção de candidatos, web, seletores e assertions | Estratégia de automação e smoke confiável |
| 4. APIs e arquitetura de testes | Semanas 7–8 | Contratos, dados, autenticação, padrões e flakiness | Suíte de API e revisão de arquitetura da automação |
| 5. CI/CD, segurança e operação | Semanas 9–10 | Git, pipeline, gates, artefatos, logs, rollback e segurança | Pipeline observável e diagnóstico de release |
| 6. Qualidade avançada e carreira | Semanas 11–12 | Performance, acessibilidade, IA, portfólio e projeto integrado | Relatório de performance e case profissional final |

Cada tema deve apresentar:

- uma promessa clara de transformação;
- competências que serão desenvolvidas;
- uma sequência de aulas curtas, sem rótulo de semana;
- duas missões práticas, hoje equivalentes às duas entregas semanais;
- quiz e exemplos aplicados próximos da aula relacionada;
- um checkpoint do tema;
- materiais complementares e aprofundamentos;
- estimativa total de esforço, sem impor prazo fixo ao aluno.

## 3. Princípios de produto

1. **Tema é conteúdo; semana é calendário.** O aluno navega por assuntos. A equipe ainda pode organizar encontros por semana em uma turma de 12 semanas.
2. **Não esconder volume.** A capa de cada tema deve mostrar quantidade de aulas, práticas, exemplos, quizzes e tempo estimado.
3. **Progresso granular.** Exibir progresso por aula, missão e tema; não apenas uma contagem de semanas aprovadas.
4. **Ritmo flexível.** Usar “próxima unidade” e “continuar estudando” no catálogo. Usar datas e semanas somente nas áreas da turma e dos encontros.
5. **Compatibilidade antes de limpeza.** Preservar chaves como `mentoria.w01.*`, `assignment_key` e `week_number` até que a nova experiência esteja validada.

## 4. Modelo de conteúdo

Criar um nível acima do catálogo atual:

```ts
type MentorshipTheme = {
  id: string;
  slug: string;
  order: number;
  title: string;
  summary: string;
  promise: string;
  competencies: string[];
  unitNumbers: number[];
  checkpoint: {
    title: string;
    criteria: string[];
  };
};
```

No primeiro ciclo, `unitNumbers` aponta para os números atuais de 1 a 12. `MentorshipWeek` pode ser renomeado internamente para `MentorshipUnit` em uma etapa posterior; fazer as duas mudanças juntas aumentaria o risco sem melhorar imediatamente a experiência.

Derivações necessárias:

- tema atual a partir da primeira unidade ainda incompleta;
- percentual do tema a partir de aulas concluídas e missões aprovadas;
- percentual geral a partir das 12 missões existentes;
- próxima ação, independentemente de estar na primeira ou segunda unidade do tema;
- estado do tema: não iniciado, em andamento ou concluído.

## 5. Nova experiência de navegação

### Catálogo `/mentoria/conteudo`

Substituir a lista de 12 semanas por seis cards ou seções de tema. Cada item deve mostrar:

- número e nome do tema;
- promessa e competências;
- volume real: aulas, práticas, quizzes e exemplos;
- duração estimada total;
- progresso e próxima ação;
- CTA “Explorar tema” ou “Continuar tema”.

### Página de tema

Nova rota canônica: `/mentoria/conteudo/temas/[slug]`.

A página deve ter uma sequência única, agrupada em blocos:

1. entender;
2. aplicar;
3. aprofundar;
4. demonstrar domínio.

Os blocos podem usar o conteúdo das duas semanas atuais, mas a interface não deve destacar essa origem. As duas entregas tornam-se **Missão 1** e **Missão 2** do tema.

### Página de estudo

Usar URLs estáveis baseadas no tema e na chave da etapa quando possível. Durante a transição, as rotas numéricas atuais continuam funcionando e redirecionam para o destino correspondente.

### Dashboard do aluno

Trocar:

- “semana atual” por “tema atual”;
- “X de 12 semanas aprovadas” por “X de 6 temas concluídos” e “Y de 12 missões aprovadas”;
- lista semanal por uma lista de temas expansíveis;
- “missão da semana” por “próxima missão”.

### Área de turma, mentor e administração

Manter a semana quando ela representar calendário:

- encontro da semana;
- presença;
- compromisso semanal;
- período da turma;
- lembrete de encontro.

Adicionar o tema relacionado como contexto: “Semana 3 · Tema 2 — Estratégia e comunicação de testes”.

## 6. Estratégia de URLs e compatibilidade

Rotas novas:

- `/mentoria/conteudo/temas/[slug]`;
- `/mentoria/conteudo/temas/[slug]/[step]`, se a navegação detalhada precisar de URL própria.

Rotas existentes:

- `/mentoria/conteudo/[week]` deve redirecionar para o tema e posicionar a unidade correspondente;
- `/mentoria/conteudo/[week]/[step]` deve redirecionar para a etapa equivalente;
- `/mentoria/semanas/[week]` deve continuar existindo enquanto for a tela operacional da turma e da entrega.

Não alterar inicialmente:

- `mentorship_submissions.assignment_key`;
- chaves de aula `mentoria.wXX.lN`;
- `mentorship_live_sessions.week_number`;
- `mentorship_weekly_commitments.week_number`;
- regras de certificado e projeto final.

## 7. Plano de execução

### Fase 0 — Inventário e decisão editorial

- Confirmar os seis temas e seus nomes finais.
- Mapear cada aula, quiz, exemplo, prática, lab e aprofundamento para tema e bloco.
- Identificar repetições, lacunas e conteúdos hoje escondidos em seções recolhidas.
- Definir a promessa e o checkpoint de cada tema.

**Saída:** matriz editorial completa e aprovada.

### Fase 1 — Camada de domínio compatível

- Criar `MentorshipTheme` e o catálogo de temas.
- Adicionar funções `findTheme`, `themeForUnit`, `themeProgress` e `nextThemeAction`.
- Manter o catálogo atual como fonte das aulas e entregas.
- Criar testes para mapeamento, ordem, unicidade de slugs e cobertura das 12 unidades.

**Saída:** seis temas cobrindo todas as unidades sem alterar dados persistidos.

### Fase 2 — Catálogo e página de tema

- Redesenhar `/mentoria/conteudo` com temas como nível principal.
- Construir a página de tema com aulas e missões em uma sequência única.
- Exibir volume, duração, competências e checkpoint.
- Adaptar navegação anterior/próximo para etapas e temas.

**Saída:** todo o conteúdo pode ser descoberto e estudado sem navegar por semanas.

### Fase 3 — Dashboard e linguagem

- Atualizar dashboard, CTAs, barras de progresso e estados vazios.
- Substituir “semana” por “tema”, “unidade” ou “missão” quando o termo representar conteúdo.
- Manter “semana” apenas onde representar calendário real.
- Atualizar metadados, acessibilidade, e-mails de progresso e textos de certificado quando necessário.

**Saída:** experiência do aluno coerente de ponta a ponta.

### Fase 4 — Redirecionamentos e integrações

- Redirecionar URLs antigas de conteúdo.
- Atualizar links de labs, carreira, performance e notificações.
- Preservar deep links e âncoras de entrega.
- Validar analytics antes e depois da mudança.

**Saída:** nenhum link interno ou salvo pelo aluno termina em 404.

### Fase 5 — QA e lançamento gradual

- Testar aluno anônimo, iniciante, intermediário, concluinte, mentor e administrador.
- Testar progresso parcial nas duas unidades de um tema.
- Testar entregas existentes, feedback, certificado, agenda e compromissos.
- Validar navegação mobile, teclado, leitores de tela e estados de carregamento.
- Liberar primeiro atrás de feature flag ou para uma turma piloto.

**Saída:** migração validada sem perda de progresso ou quebra operacional.

### Fase 6 — Limpeza posterior

- Avaliar dados de uso e feedback da turma piloto.
- Somente depois, decidir se tipos e nomes internos `Week` devem virar `Unit`.
- Migrar banco apenas se houver benefício operacional comprovado.
- Remover redirecionamentos somente após uma janela longa de compatibilidade.

## 8. Ordem recomendada de implementação

1. Catálogo de temas e testes.
2. Catálogo público por temas.
3. Página de tema.
4. Dashboard e progresso.
5. Links cruzados e redirecionamentos.
6. Textos das áreas autenticadas.
7. Testes E2E e piloto.
8. Limpeza técnica opcional.

## 9. Critérios de aceite

- O catálogo mostra seis temas, não uma grade principal de 12 semanas.
- Todo conteúdo atual aparece em exatamente um tema.
- Cada tema comunica claramente volume, resultado e próxima ação.
- Um aluno com progresso antigo vê as mesmas aulas e entregas concluídas.
- As 12 chaves de entrega e todas as chaves de aula continuam válidas.
- Links antigos abrem o conteúdo equivalente.
- Encontros, presença e compromissos continuam associados às semanas da turma.
- Mentor e administrador conseguem identificar tema e semana de calendário.
- Certificado e projeto final continuam funcionando.
- Testes unitários, integração e jornada E2E passam sem regressão.

## 10. Métricas para validar a mudança

Comparar antes e depois:

- abertura de um item após visitar o catálogo;
- início da primeira prática;
- conclusão da primeira missão;
- avanço entre os dois blocos de um tema;
- retorno ao estudo em 7 e 14 dias;
- percentual de pessoas que encontram labs e aprofundamentos;
- respostas qualitativas para “o conteúdo parece completo?” e “sei o que estudar agora?”.

## 11. Riscos e mitigação

| Risco | Mitigação |
| --- | --- |
| Tema ficar grande e cansativo | Dividir em blocos curtos, mostrar progresso interno e permitir retomada precisa |
| Confusão entre tema e calendário | Separar visualmente “conteúdo” de “agenda da turma” |
| Perda de progresso | Preservar chaves atuais e derivar progresso do histórico existente |
| Links externos quebrados | Redirecionamentos permanentes e teste automatizado de rotas antigas |
| Métricas históricas incomparáveis | Manter IDs de eventos e adicionar `theme_id` sem apagar `week` |
| Renomeação virar apenas maquiagem | Mostrar o volume real, reorganizar a sequência e criar checkpoint temático |

## 12. Escopo que não deve entrar no primeiro lançamento

- reescrever todas as aulas;
- substituir todas as tabelas e colunas semanais do banco;
- mudar as regras de aprovação das 12 entregas;
- alterar o cronograma de 12 semanas das turmas;
- remover imediatamente URLs antigas;
- juntar as duas entregas de cada tema em uma única entrega grande.

O primeiro lançamento deve mudar a arquitetura de informação e a percepção de densidade. Ampliação ou reescrita do conteúdo pode acontecer depois, guiada por lacunas reais observadas na nova estrutura.
