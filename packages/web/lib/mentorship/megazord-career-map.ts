export const megazordCareerLevels = [
  { level: "Entrada / estágio", focus: "Aprender fluxo, vocabulário e ferramentas do time com acompanhamento.", evidence: "Casos simples reproduzíveis, registros objetivos e perguntas bem contextualizadas." },
  { level: "Júnior", focus: "Executar e adaptar testes conhecidos; pedir ajuda quando regra ou risco estiver ambíguo.", evidence: "Cenários manuais e de API, consulta de dados segura, bug report claro e automação pequena revisada." },
  { level: "Pleno / QE", focus: "Planejar cobertura de uma feature, escolher camadas e prevenir risco junto ao time.", evidence: "Estratégia por risco, automação confiável, pipeline útil e diagnóstico de falhas entre componentes." },
  { level: "Sênior", focus: "Guiar qualidade de um domínio ou produto, resolver incerteza e melhorar o sistema de entrega.", evidence: "Decisões explícitas de release, sinais operacionais, redução de custo/flakiness e mentoria técnica." },
  { level: "Staff / Principal", focus: "Influenciar vários times e sistemas sem depender de autoridade formal.", evidence: "Padrões adotáveis, arquitetura de qualidade, melhoria mensurável entre equipes e desenvolvimento de outras lideranças." },
  { level: "QA Lead / Manager", focus: "Desenvolver pessoas e alinhar capacidade, risco e objetivos de produto.", evidence: "Prioridades e responsabilidades claras, evolução da equipe, comunicação com stakeholders e resultados sustentáveis." },
] as const;

export const megazordCompetencies = [
  { name: "Fundamentos e risco", junior: "Aplica técnicas dadas e registra dúvidas.", pleno: "Escolhe técnica e cobertura para uma feature.", senior: "Define estratégia e critérios de risco do domínio.", staff: "Alinha princípios de risco entre produtos." },
  { name: "Exploração e teste funcional", junior: "Segue roteiro e relata observações reproduzíveis.", pleno: "Planeja sessões e amplia cobertura com hipóteses.", senior: "Orienta exploração em áreas ambíguas e críticas.", staff: "Cria práticas que elevam descoberta entre equipes." },
  { name: "Requisitos e comunicação", junior: "Identifica lacunas e escreve casos claros.", pleno: "Facilita exemplos e critérios com o time.", senior: "Resolve conflitos de regra e negociação de release.", staff: "Influencia decisões de produto com evidência." },
  { name: "API, contratos e integração", junior: "Valida requests, respostas e erros comuns.", pleno: "Investiga contratos, estados e integrações.", senior: "Reduz risco em fronteiras distribuídas.", staff: "Define abordagem de contrato e integração entre domínios." },
  { name: "SQL e qualidade de dados", junior: "Consulta dados de teste com segurança.", pleno: "Verifica integridade, migração e preparação de dados.", senior: "Define estratégia de dados e reconciliação.", staff: "Melhora governança e confiança dos dados entre times." },
  { name: "Código e automação", junior: "Mantém testes pequenos com revisão.", pleno: "Projeta suítes estáveis e diagnosticáveis.", senior: "Define arquitetura e reduz custo de manutenção.", staff: "Estabelece padrões e plataformas reutilizáveis." },
  { name: "CI/CD e entrega", junior: "Lê execução e identifica falhas básicas.", pleno: "Configura feedback e gates proporcionais ao risco.", senior: "Melhora fluxo, confiabilidade e recuperação.", staff: "Influencia capacidade de entrega em múltiplos produtos." },
  { name: "Observabilidade e produção", junior: "Usa logs e evidências para investigar.", pleno: "Correlaciona traces, métricas e sintomas.", senior: "Define sinais, alertas e resposta para riscos críticos.", staff: "Conecta confiabilidade e aprendizado operacional entre áreas." },
  { name: "Segurança, acessibilidade e performance", junior: "Executa checagens orientadas e reporta limites.", pleno: "Inclui riscos não funcionais no plano de feature.", senior: "Define avaliação especializada e critérios de release.", staff: "Sustenta capacidades e governança para esses riscos." },
  { name: "Arquitetura e resiliência", junior: "Reconhece dependências e falhas esperadas.", pleno: "Escolhe fronteiras e cenários de recuperação.", senior: "Orienta testabilidade de sistemas e dependências.", staff: "Evolui arquitetura e resiliência em escala organizacional." },
  { name: "Métricas e decisão", junior: "Apresenta resultado e cobertura observada.", pleno: "Usa medidas para recomendar ação com limites.", senior: "Conecta tendências a risco e investimento.", staff: "Evita métricas de vaidade e orienta decisões sistêmicas." },
  { name: "Colaboração e liderança", junior: "Compartilha progresso e pede contexto cedo.", pleno: "Facilita alinhamento e apoia colegas.", senior: "Mentora e influencia sem autoridade formal.", staff: "Desenvolve lideranças e muda práticas entre equipes." },
] as const;

export const megazordSpecializations = [
  { name: "QA funcional e exploratório", focus: "Jornadas, regras complexas, usabilidade, investigação e risco de produto." },
  { name: "SDET / engenharia de qualidade", focus: "Código, frameworks, CI, arquitetura de testes e ferramentas para equipes." },
  { name: "Performance e confiabilidade", focus: "Carga, capacidade, observabilidade, resiliência e resposta a incidentes." },
  { name: "Segurança / AppSec", focus: "Ameaças, autorização, vulnerabilidades e integração de segurança ao ciclo." },
  { name: "Qualidade mobile", focus: "Plataformas, dispositivos, permissões, ciclo de vida e conectividade." },
  { name: "Qualidade de dados", focus: "Pipelines, contratos, reconciliação, linhagem, consistência e privacidade." },
  { name: "Qualidade de IA / LLM", focus: "Datasets, evals, robustez, segurança, grounding e revisão humana." },
] as const;

export const megazordYearPlan = [
  { period: "Meses 1–2", focus: "Fundamentos de teste, risco, exploração e documentação.", artifact: "Plano de teste curto com riscos, cenários e bug reports." },
  { period: "Meses 3–4", focus: "Web, HTTP, API, SQL e dados reproduzíveis.", artifact: "Coleção de API, consultas de validação e dados de teste limpos." },
  { period: "Meses 5–6", focus: "Programação, Git, testes unitários e leitura de código.", artifact: "Pequena suíte revisável no repositório com README." },
  { period: "Meses 7–8", focus: "Automação web/API, isolamento, reports e diagnóstico.", artifact: "Jornada automatizada estável com evidência de falha." },
  { period: "Meses 9–10", focus: "CI/CD, Docker, secrets e confiabilidade.", artifact: "Pipeline reproduzível com gates e artefatos." },
  { period: "Meses 11–12", focus: "Performance, segurança, acessibilidade e observabilidade.", artifact: "Case Megazord com riscos, resultados, limites e próximos passos." },
] as const;

export const megazordCareerCheckpoints = [
  { level: "Júnior", checkpoint: "Consegue explicar o comportamento esperado, executar testes guiados, registrar defeitos e pedir contexto antes de inventar regras." },
  { level: "Pleno", checkpoint: "Planeja cobertura de uma feature, escolhe camada e dados, automatiza com manutenção razoável e recomenda ação com evidência." },
  { level: "Sênior", checkpoint: "Resolve incerteza sistêmica, alinha riscos de release, melhora sinais e práticas do domínio e desenvolve autonomia em outras pessoas." },
  { level: "Staff / Principal", checkpoint: "Muda práticas ou arquitetura de qualidade em vários times, demonstra impacto e cria caminhos que outros conseguem adotar." },
] as const;
