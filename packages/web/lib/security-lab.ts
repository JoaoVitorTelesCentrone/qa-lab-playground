export type SecurityMission = {
  id: string;
  module: string;
  title: string;
  level: "Iniciante" | "Intermediário" | "Avançado";
  context: string;
  question: string;
  options: Array<{ id: string; label: string }>;
  correctOption: string;
  feedback: string;
  principle: string;
};

export const securityMissions: SecurityMission[] = [
  {
    id: "risk-first",
    module: "Risco e ameaça",
    title: "Comece pelo impacto",
    level: "Iniciante",
    context: "Uma tela de perfil mostra um erro ao atualizar o telefone. O time quer priorizar o defeito pela dificuldade técnica, mas a falha também permite ver dados de outros clientes.",
    question: "Qual próximo passo de QA ajuda o time a decidir com base no risco?",
    options: [
      { id: "a", label: "Classificar pela quantidade de linhas alteradas na correção." },
      { id: "b", label: "Documentar dado exposto, usuários afetados, condições de acesso e evidência mínima." },
      { id: "c", label: "Repetir a tentativa com mais contas reais até obter uma amostra maior." },
      { id: "d", label: "Aguardar a próxima release para ver se alguém reporta o problema." },
    ],
    correctOption: "b",
    feedback: "O risco depende do ativo, da exposição, da probabilidade e do impacto. Registre o que foi observado e use apenas contas sintéticas autorizadas.",
    principle: "Descreva risco pelo dano possível e pela evidência, não pelo tamanho da mudança.",
  },
  {
    id: "authn-authz",
    module: "Autenticação e autorização",
    title: "Sessão válida, ação proibida",
    level: "Iniciante",
    context: "Uma pessoa autenticada com papel de suporte consegue abrir a rota administrativa ao colar o endereço direto, embora o menu não mostre o link.",
    question: "O que o teste deve validar primeiro?",
    options: [
      { id: "a", label: "Que o link administrativo continue escondido no menu." },
      { id: "b", label: "Que a API verifique a permissão no servidor para cada ação administrativa." },
      { id: "c", label: "Que a sessão expire imediatamente após abrir a rota." },
      { id: "d", label: "Que o endereço seja difícil de adivinhar." },
    ],
    correctOption: "b",
    feedback: "Esconder controles na interface não protege a operação. A autorização precisa ser aplicada no servidor e coberta também nas APIs.",
    principle: "Autenticação identifica a sessão; autorização valida a ação e o recurso.",
  },
  {
    id: "object-scope",
    module: "Controle de acesso a dados",
    title: "O pedido de outra conta",
    level: "Intermediário",
    context: "Em um ambiente de teste, duas contas sintéticas possuem pedidos distintos. A rota recebe o identificador do pedido na URL.",
    question: "Qual verificação cobre acesso horizontal sem acessar dados reais?",
    options: [
      { id: "a", label: "Com a conta A, solicitar o pedido sintético da conta B e confirmar negação sem dados no corpo." },
      { id: "b", label: "Alterar identificadores até encontrar um pedido válido." },
      { id: "c", label: "Usar uma conta de produção para comparar respostas." },
      { id: "d", label: "Validar apenas que um pedido da própria conta retorna 200." },
    ],
    correctOption: "a",
    feedback: "Use identidades e registros artificiais preparados para o exercício. Confirme status, corpo e ausência de efeitos colaterais.",
    principle: "Teste isolamento entre usuários com massa sintética conhecida e autorização explícita.",
  },
  {
    id: "input-boundary",
    module: "Validação de entrada",
    title: "Entrada fora do contrato",
    level: "Intermediário",
    context: "Uma API de reserva espera uma data ISO e um identificador numérico. O contrato não descreve o comportamento para campos extras ou formato inválido.",
    question: "Qual abordagem segura produz boa evidência?",
    options: [
      { id: "a", label: "Enviar uma carga executável para observar se o servidor a interpreta." },
      { id: "b", label: "Variar tipos, limites e campos extras com valores inertes e confirmar rejeição consistente." },
      { id: "c", label: "Enviar milhares de requisições para encontrar um caso raro." },
      { id: "d", label: "Ignorar validação porque a interface bloqueia os valores inválidos." },
    ],
    correctOption: "b",
    feedback: "Valores inertes e limites controlados cobrem o contrato sem executar payloads. O servidor precisa validar independentemente do cliente.",
    principle: "Prefira testes de contrato e classes de equivalência com dados inofensivos.",
  },
  {
    id: "mass-assignment",
    module: "Segurança de API",
    title: "Campo que o cliente não controla",
    level: "Avançado",
    context: "O endpoint de edição de perfil aceita um objeto JSON. O modelo interno também contém `role`, mas esse campo não aparece no formulário.",
    question: "Que teste de contrato é adequado no sandbox?",
    options: [
      { id: "a", label: "Enviar `role: admin` com uma conta sintética e conferir que o campo é rejeitado ou ignorado sem alteração de privilégio." },
      { id: "b", label: "Tentar o mesmo corpo no ambiente de produção para validar o impacto real." },
      { id: "c", label: "Remover autenticação e enviar o corpo até a API aceitar." },
      { id: "d", label: "Assumir que o campo está seguro porque não existe no formulário." },
    ],
    correctOption: "a",
    feedback: "A API deve aceitar uma lista explícita de campos editáveis e proteger atributos privilegiados. Faça o exercício apenas contra o sandbox preparado.",
    principle: "Não confiar em campos ocultos ou omitidos pela interface.",
  },
  {
    id: "sensitive-data",
    module: "Privacidade e segredos",
    title: "Log com informação sensível",
    level: "Intermediário",
    context: "Um log de falha registra o cabeçalho de autorização completo para facilitar o diagnóstico de uma integração.",
    question: "Qual resposta combina contenção e prevenção?",
    options: [
      { id: "a", label: "Manter o log porque ele só é visto pela equipe técnica." },
      { id: "b", label: "Remover ou mascarar o segredo, avaliar exposição e rotacioná-lo se necessário." },
      { id: "c", label: "Copiar o log para um canal público para acelerar a correção." },
      { id: "d", label: "Apagar todos os logs sem registrar o incidente." },
    ],
    correctOption: "b",
    feedback: "Segredos em logs podem ser reutilizados. Preserve evidência não sensível, limite acesso e siga o processo de rotação e resposta.",
    principle: "Reduza exposição primeiro e mantenha trilha de resposta sem replicar o segredo.",
  },
  {
    id: "dependency-review",
    module: "Dependências e supply chain",
    title: "Atualização urgente de pacote",
    level: "Avançado",
    context: "Uma dependência anuncia uma correção de segurança. A atualização muda uma versão principal e não há evidência de compatibilidade com o produto.",
    question: "Como QA contribui para uma atualização responsável?",
    options: [
      { id: "a", label: "Instalar direto em produção porque a correção é urgente." },
      { id: "b", label: "Verificar origem e versão, revisar impacto, executar testes focados e acompanhar o rollout." },
      { id: "c", label: "Desativar toda a análise de dependências para evitar falsos positivos." },
      { id: "d", label: "Manter a versão vulnerável indefinidamente para evitar mudanças." },
    ],
    correctOption: "b",
    feedback: "Equilibre urgência de segurança com compatibilidade: valide origem, lockfile, comportamento afetado e plano de reversão.",
    principle: "Mudança de dependência também precisa de proveniência, teste e rollback.",
  },
  {
    id: "error-disclosure",
    module: "Erros e observabilidade",
    title: "Erro detalhado para o usuário",
    level: "Iniciante",
    context: "Uma falha no login mostra caminho interno do servidor, nome da tabela e detalhes da consulta ao usuário final.",
    question: "O que validar na correção?",
    options: [
      { id: "a", label: "Mensagem externa genérica e útil, com detalhe técnico restrito aos logs protegidos." },
      { id: "b", label: "Ocultar qualquer mensagem, inclusive a confirmação de sucesso." },
      { id: "c", label: "Exibir mais detalhes para que a pessoa reproduza a falha." },
      { id: "d", label: "Remover logs internos e perder a capacidade de diagnosticar." },
    ],
    correctOption: "a",
    feedback: "A mensagem deve ajudar a pessoa sem revelar internals. O diagnóstico técnico fica em logs com acesso e retenção controlados.",
    principle: "Mensagens externas e registros internos têm públicos e níveis de detalhe diferentes.",
  },
  {
    id: "abuse-case",
    module: "Abuse cases e modelagem de ameaças",
    title: "Fluxo legítimo usado em excesso",
    level: "Intermediário",
    context: "Um endpoint de convite funciona corretamente para uso normal, mas não possui limite e pode enviar grande volume de notificações.",
    question: "Qual caso de abuso deve entrar na estratégia de teste?",
    options: [
      { id: "a", label: "Repetição limitada no sandbox, observando rate limit, resposta e proteção contra efeitos duplicados." },
      { id: "b", label: "Disparar convites para endereços reais até o serviço bloquear." },
      { id: "c", label: "Testar apenas um convite válido e concluir que o fluxo está seguro." },
      { id: "d", label: "Tentar contornar controles em um sistema de terceiros." },
    ],
    correctOption: "a",
    feedback: "Abuse cases devem ser limitados a ambiente autorizado e massa sintética, medindo controles sem gerar impacto real.",
    principle: "Inclua uso abusivo plausível e limites claros de execução nos testes.",
  },
  {
    id: "responsible-report",
    module: "Reporte e validação de correção",
    title: "Falha sensível encontrada",
    level: "Avançado",
    context: "No sandbox, você confirma que uma conta de teste consegue acessar um recurso de outra conta de teste. O produto está em piloto fechado.",
    question: "Qual reporte permite correção responsável?",
    options: [
      { id: "a", label: "Publicar a reprodução completa em um fórum aberto para pressionar o time." },
      { id: "b", label: "Registrar impacto, condições e evidência sintética no canal restrito; depois retestar a correção e os casos vizinhos." },
      { id: "c", label: "Continuar explorando identificadores para descobrir quantas contas estão expostas." },
      { id: "d", label: "Apagar a evidência e encerrar o assunto porque o piloto é pequeno." },
    ],
    correctOption: "b",
    feedback: "Compartilhe o mínimo necessário pelo canal apropriado, limite a exploração e valide a correção junto com regressões próximas.",
    principle: "Relate com responsabilidade, minimize exposição e confirme a correção sem ampliar o dano.",
  },
];

export function isSecurityAnswerCorrect(mission: SecurityMission, optionId: string) {
  return mission.correctOption === optionId;
}

export function securityProgress(solvedIds: string[]) {
  const solved = new Set(solvedIds.filter((id) => securityMissions.some((mission) => mission.id === id)));
  return { solved: solved.size, total: securityMissions.length, percent: Math.round((solved.size / securityMissions.length) * 100) };
}
