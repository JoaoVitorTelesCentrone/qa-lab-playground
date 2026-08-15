# Plano de Produto — QA Lab

## Visão

O QA Lab é um produto educacional único para aprender qualidade de software pela prática. O aluno recebe contexto, toma decisões, executa atividades, recebe feedback e constrói evidências de evolução.

O produto não deve parecer uma coleção de ferramentas corporativas. Cada recurso precisa responder a quatro perguntas:

1. O que o aluno aprenderá?
2. Qual situação real ele enfrentará?
3. Como o produto dará feedback?
4. Qual evidência demonstrará a competência adquirida?

## Modelo de aprendizagem compartilhado

Cada trilha usa o mesmo ciclo:

`Contexto → missão → decisão/execução → feedback → reflexão → evidência → progressão`

Componentes comuns:

- diagnóstico inicial por competência;
- missões guiadas e livres;
- níveis iniciante, intermediário e avançado;
- feedback imediato baseado em critérios explícitos;
- tentativas e histórico de evolução;
- mapa de competências;
- portfólio exportável;
- desafios integradores entre trilhas;
- progressão baseada em domínio, não apenas pontos.

## Trilhas práticas

### 1. Playground — fundamentos e investigação

Objetivo: aprender teste exploratório, análise de risco, modelagem de testes e documentação de defeitos usando sistemas propositalmente quebrados.

Experiências:

- briefing e regras de negócio;
- exploração orientada por missões;
- sistemas web, API e dados com falhas intencionais;
- bug reports com evidência;
- casos positivos, negativos e de limite;
- estratégia e cobertura;
- entrega final para portfólio.

Critério de conclusão: demonstrar que consegue investigar um produto, explicar riscos e produzir artefatos úteis.

### 2. CI/CD Lab — qualidade na entrega

Objetivo: ensinar como qualidade participa do pipeline, da estratégia de branches ao monitoramento pós-release.

Módulos:

1. Anatomia de um pipeline.
2. Build, lint, testes e quality gates.
3. Pirâmide de testes no pipeline.
4. Testes instáveis e quarentena.
5. Ambientes, dados e segredos.
6. Versionamento e artefatos.
7. Estratégias de deploy.
8. Rollback e feature flags.
9. Observabilidade e validação pós-release.
10. Métricas de fluxo e confiabilidade.

Simulações previstas:

- ordenar etapas de um pipeline;
- diagnosticar logs de falha;
- escolher quality gates por risco;
- corrigir YAML de GitHub Actions;
- decidir entre bloquear, colocar em quarentena ou aceitar uma falha;
- montar estratégia de rollback;
- investigar um deploy que falhou;
- reduzir tempo de pipeline sem perder confiança.

Entrega final: pipeline funcional, decisão arquitetural documentada e relatório de confiabilidade.

### 3. Gestão da Qualidade — estratégia e governança

Objetivo: ensinar o aluno a transformar contexto de negócio em estratégia, risco, cobertura, métricas e decisões de qualidade.

Módulos:

1. Contexto, objetivos e stakeholders.
2. Estratégia de qualidade.
3. Gestão de riscos.
4. Planejamento e estimativa.
5. Rastreabilidade e cobertura.
6. Gestão de defeitos.
7. Critérios de entrada e saída.
8. Métricas úteis e métricas de vaidade.
9. Qualidade em times ágeis.
10. Melhoria contínua e análise de causa.

Simulações previstas:

- priorizar testes com tempo limitado;
- negociar escopo;
- construir matriz de riscos;
- escolher métricas para um contexto;
- conduzir triagem de bugs;
- definir critérios de release;
- analisar causa sem procurar culpados;
- apresentar risco para liderança.

Entrega final: estratégia de qualidade completa, matriz de riscos, plano, cobertura e relatório executivo.

### 4. Security Lab — segurança para profissionais de qualidade

Objetivo: desenvolver pensamento de segurança aplicado ao cotidiano de QA, sem transformar a trilha em treinamento exclusivo de pentest.

Módulos:

1. Ameaça, vulnerabilidade, risco e impacto.
2. Autenticação e autorização.
3. Sessão e controle de acesso.
4. Validação de entrada.
5. Segurança de APIs.
6. Dados pessoais e segredos.
7. Dependências e supply chain.
8. Logs, erros e exposição de informação.
9. Abuse cases e threat modeling.
10. Comunicação e resposta a vulnerabilidades.

Simulações previstas:

- encontrar falhas de autorização em APIs;
- testar IDOR/BOLA em ambiente seguro;
- identificar segredo exposto;
- revisar logs com dados sensíveis;
- construir abuse cases;
- priorizar vulnerabilidades por contexto;
- decidir como reportar uma falha crítica;
- validar correção sem divulgar exploração perigosa.

Entrega final: modelo de ameaças básico, relatório responsável e suíte de verificações de segurança.

### 5. People Lab — decisões e relações humanas

Objetivo: treinar comunicação, negociação, ética, liderança, conflito e tomada de decisão sob pressão.

Formato principal:

1. O sistema apresenta uma situação do cotidiano.
2. O aluno responde livremente o que faria, como comunicaria e por quê.
3. O produto avalia dimensões da resposta, sem impor uma frase correta.
4. O aluno compara sua decisão com critérios e consequências.
5. O histórico mostra padrões e competências a desenvolver.

Dimensões de feedback:

- clareza e comunicação;
- uso de evidência;
- empatia e segurança psicológica;
- percepção de risco;
- pragmatismo;
- ética;
- colaboração;
- responsabilidade e acompanhamento.

O catálogo inicial planejado possui 200 situações em 20 temas, documentadas em `PEOPLE_LAB_200_SITUATIONS.md`.

## Desafios integradores

As trilhas convergem em projetos completos:

### Release crítica

- investigar a funcionalidade no Playground;
- definir estratégia e riscos em Gestão;
- implementar gates no CI/CD Lab;
- executar verificações no Security Lab;
- negociar a decisão de release no People Lab.

### Incidente em produção

- interpretar sinais e reproduzir o problema;
- avaliar impacto e priorização;
- investigar pipeline e rollback;
- verificar exposição de dados;
- comunicar sob pressão e conduzir retrospectiva.

## Progressão

Níveis:

- Fundamentos: segue orientação e reconhece conceitos.
- Praticante: escolhe técnicas adequadas e justifica decisões.
- Profissional: trabalha com ambiguidade, restrições e trade-offs.
- Referência: influencia outras pessoas e melhora o sistema de trabalho.

Competências não sobem apenas por completar telas. Cada nível exige evidências mínimas e diversidade de contextos.

## Roadmap de implementação

### Fase 1 — fundação educacional

- unificar linguagem e navegação do QA Lab;
- criar mapa de competências;
- separar missão, tentativa, feedback e evidência no modelo de dados;
- conectar progresso local e conta autenticada;
- definir analytics educacionais.

### Fase 2 — People Lab completo

- importar as 200 situações;
- adicionar filtros por tema e nível;
- implementar seleção adaptativa e repetição espaçada;
- criar rubricas por situação;
- permitir revisão do histórico;
- gerar relatório de competências humanas.

### Fase 3 — CI/CD Lab

- ambiente simulado de pipeline;
- missões de diagnóstico;
- editor seguro de YAML;
- logs e falhas determinísticas;
- primeira missão integradora com Playground.

### Fase 4 — Gestão da Qualidade

- transformar o Test Design Studio em experiência guiada;
- adicionar estudos de caso e feedback;
- criar simulador de priorização e triagem;
- conectar plano, execução e resultado de aprendizagem.

### Fase 5 — Security Lab

- criar aplicações-alvo isoladas;
- definir limites claros de uso seguro;
- implementar missões de autorização, dados e APIs;
- adicionar threat modeling e reporte responsável.

### Fase 6 — desafios integradores

- releases completas;
- incidentes simulados;
- avaliação multidimensional;
- portfólio consolidado.

## Métricas de produto

Métricas principais:

- primeira missão concluída;
- tempo até a primeira evidência útil;
- retorno em 7 e 30 dias;
- diversidade de competências praticadas;
- evolução entre primeira e última tentativa;
- conclusão de desafios integradores;
- exportações de portfólio.

Evitar usar apenas quantidade de cliques, páginas visitadas ou pontos acumulados como prova de aprendizagem.

## Ordem recomendada

1. Consolidar People Lab e modelo educacional compartilhado.
2. Construir CI/CD Lab por ser técnico, visual e altamente demonstrável.
3. Converter Gestão da Qualidade de ferramenta para aprendizagem guiada.
4. Construir Security Lab com ambientes seguros.
5. Conectar tudo em desafios integradores.

