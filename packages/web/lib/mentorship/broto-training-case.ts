/** Um único caso fictício acompanha as missões sem exigir dados pessoais do aluno. */
export const brotoTrainingCase = {
  title: "Do pensamento ao próximo passo",
  label: "QA LAB · estudo de QA",
  account: "Crie uma conta de estudo no Broto com seu próprio acesso. Use apenas os textos fictícios abaixo; a conta e a senha ficam no Broto.",
  seed: [
    { label: "Pensamento para a Mente", text: "Quero estudar QA com constância, mas abro várias coisas ao mesmo tempo e termino o dia sem saber o que avancei." },
    { label: "Problema", text: "Adio a revisão porque não escolho um assunto pequeno antes de começar." },
    { label: "Objetivo", text: "Revisar um fundamento de QA por 20 minutos em três dias desta semana." },
    { label: "Próximo passo", text: "Na próxima sessão de estudo, escolher um risco de um produto e escrever três perguntas de teste." },
  ],
  stages: [
    {
      title: "Descarregue",
      action: "Registre o pensamento fictício na Mente. Saia da tela e volte ao registro.",
      observe: "O texto continua disponível? Você consegue encontrá-lo sem depender da memória?",
      evidence: "Anote o caminho percorrido, o estado após voltar e uma dúvida que surgiu.",
    },
    {
      title: "Enxergue",
      action: "Use os recursos disponíveis na sua conta para organizar o problema e o objetivo do caso.",
      observe: "O Broto deixa claro o que é pensamento, problema, objetivo e próximo passo?",
      evidence: "Registre o que a interface permitiu fazer e o que você apenas esperava encontrar.",
    },
    {
      title: "Escolha a ação",
      action: "Registre o próximo passo do caso e retome a jornada a partir dele.",
      observe: "A ação permanece ligada ao contexto do problema ou do objetivo?",
      evidence: "Guarde o estado visível antes e depois, sem mostrar seu e-mail ou dados pessoais.",
    },
    {
      title: "Retorne",
      action: "Em outra sessão, volte ao mesmo caso e observe o histórico ou a revisita disponível.",
      observe: "Você entende o que mudou e qual ação continua pendente?",
      evidence: "Compare o estado inicial com o atual e diga qual risco merece investigação.",
    },
  ],
  noteTemplate: "Ação: [o que fiz]\nObservado: [o que a interface mostrou]\nEsperado ou dúvida: [regra confirmada ou pergunta aberta]\nEvidência: [captura ou passo reproduzível sem dados pessoais]",
} as const;

/** Cada aula termina em uma ação curta, usando o caso acima como fio condutor. */
export const brotoLessonActions: Record<number, readonly [string, string, string]> = {
  1: [
    "Abra o Broto e identifique onde um pensamento vira um próximo passo no caso de treino.",
    "Separe uma regra observada de uma suposição sobre a captura do caso.",
    "Percorra o caso uma vez e registre um risco com o estado observado.",
  ],
  2: [
    "Investigue se você consegue sair da Mente e encontrar o pensamento ao voltar.",
    "Escolha uma variação: tela pequena, interrupção ou retorno em outra sessão.",
    "Registre dispositivo, ação, resultado e a próxima pergunta de investigação.",
  ],
  3: [
    "Escolha um campo ou estado do caso e derive um caminho normal, um inválido e um limite.",
    "Confira se os cenários cobrem uma regra observada ou uma hipótese ainda aberta.",
    "Transforme uma regra do Broto em passos e resultados verificáveis.",
  ],
  4: [
    "Compare o que foi registrado com o que aparece ao revisitar o caso.",
    "Se encontrar divergência, descreva passos, resultado atual, esperado e impacto.",
    "Separe barreiras de compreensão, apresentação e funcionamento na mesma jornada.",
  ],
  5: [
    "Escolha uma parte repetível da jornada e explique o risco que a automação protegeria.",
    "Compare uma checagem de regra com um smoke de interface para o mesmo caso.",
    "Monte a estratégia mínima: o que automatizar, o que explorar e por quê.",
  ],
  6: [
    "Descreva um smoke para reencontrar o pensamento do caso após salvá-lo.",
    "Prefira rótulos e estados observáveis ao desenhar seletores e esperas.",
    "Use uma conta de estudo e dados fictícios para repetir o fluxo sem conflito.",
  ],
  7: [
    "Liste a regra de privacidade do caso que uma API do Broto precisaria preservar; pratique o contrato na API Lab.",
    "Use a coleção local para encadear criação, leitura, autorização e limpeza de dados.",
    "Compare o contrato observado na API Lab com a hipótese que você tem sobre o Broto.",
  ],
  8: [
    "Revise se o smoke do caso depende de outros testes ou de dados compartilhados.",
    "Escreva duas hipóteses para uma falha intermitente ao retomar um registro.",
    "Escolha uma abstração que preserve visível o resultado de negócio protegido.",
  ],
  9: [
    "Desenhe o caminho de uma mudança na captura até o feedback do pipeline.",
    "Defina qual evidência guardar se o smoke da jornada falhar no CI.",
    "Separe secrets, dados fictícios e artefatos no desenho do workflow.",
  ],
  10: [
    "Imagine que o histórico do caso mudou após uma release: qual sinal bloquearia a entrega?",
    "Separe uma regressão observada de uma hipótese sobre persistência.",
    "Defina que informação pode entrar no diagnóstico sem expor o pensamento do usuário.",
  ],
  11: [
    "Modele quantas revisitas ao caso seriam relevantes, sem executar carga no Broto.",
    "Leia p95, erros e throughput do lab local como sinais de uma jornada de retomada.",
    "Desenhe um smoke curto de performance para o CI e declare seus limites.",
  ],
  12: [
    "Conte o case do mesmo pensamento: risco, experimento, evidência e decisão.",
    "Revise o case para remover dados pessoais e marcar o que veio de labs locais.",
    "Defina sua próxima competência com uma evidência que possa produzir.",
  ],
};
