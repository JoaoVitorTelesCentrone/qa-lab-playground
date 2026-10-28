export type BugReportModule = {
  id: string;
  week: number;
  duration: string;
  title: string;
  objective: string;
  concepts: string[];
  practice: string;
  deliverable: string;
  checklist: string[];
  example: string;
};

export const bugReportCourseModules: BugReportModule[] = [
  {
    id: "observation",
    week: 1,
    duration: "45 min",
    title: "Separe observação de suposição",
    objective: "Reconhecer um possível defeito e registrar fatos antes de explicar a causa.",
    concepts: ["comportamento esperado", "observação", "hipótese", "fonte da regra"],
    practice: "Na loja de treino, tente adicionar um item ao carrinho e anote apenas o que viu. Depois localize a regra ou requisito que confirma o resultado esperado.",
    deliverable: "Notas com comportamento observado, resultado esperado e dúvidas ainda abertas.",
    checklist: ["O resultado esperado tem uma fonte verificável.", "Fatos e hipóteses estão identificados separadamente.", "A investigação não presume causa ou culpa."],
    example: `Observado: após adicionar o Kit Smoke Test, o resumo continua mostrando 0 itens.\nEsperado: o resumo mostra 1 item, conforme a regra do carrinho.\nHipótese ainda não confirmada: a tela talvez não atualize o estado.`,
  },
  {
    id: "report-scope",
    week: 1,
    duration: "45 min",
    title: "Um relato, um problema",
    objective: "Delimitar o defeito para que cada relatório tenha um resultado verificável e um fluxo claro.",
    concepts: ["escopo", "sintoma", "duplicidade", "isolamento"],
    practice: "Separe uma lista de sintomas da loja em relatos independentes. Agrupe somente observações que compartilham a mesma falha e contexto.",
    deliverable: "Um relato por defeito, com a relação entre sintomas anotada quando necessário.",
    checklist: ["O relato não junta falhas sem relação.", "O sintoma principal aparece logo no início.", "Se a relação for incerta, ela é descrita como dúvida."],
    example: `Um relato pode cobrir: “o resumo do carrinho não atualiza após adicionar um item”.\nNão misture com: “o link de ajuda abre uma página vazia”.`,
  },
  {
    id: "titles",
    week: 2,
    duration: "45 min",
    title: "Escreva um título fácil de localizar",
    objective: "Criar títulos curtos que indiquem área, condição e comportamento incorreto sem antecipar a causa.",
    concepts: ["título", "área", "condição", "sintoma", "busca"],
    practice: "Reescreva títulos vagos como “carrinho quebrado” incluindo a condição para reproduzir e o resultado incorreto.",
    deliverable: "Três títulos objetivos, sem julgamento nem explicação causal não verificada.",
    checklist: ["O título diferencia o relato de outros problemas.", "A condição relevante está visível.", "O texto nomeia o sintoma, não uma causa presumida."],
    example: `Vago: Carrinho está bugado\nMelhor: [Carrinho] Resumo permanece vazio após adicionar um produto disponível`,
  },
  {
    id: "preconditions-steps",
    week: 2,
    duration: "60 min",
    title: "Registre contexto e passos reproduzíveis",
    objective: "Descrever pré-condições, dados de teste e ações em sequência suficiente para outra pessoa repetir.",
    concepts: ["pré-condições", "dados", "passos numerados", "estado inicial"],
    practice: "Crie um estado inicial conhecido e escreva cada ação necessária para observar a falha, incluindo o dado usado.",
    deliverable: "Passos numerados e independentes, com estado inicial e valores fictícios seguros.",
    checklist: ["Outra pessoa consegue começar pelo mesmo estado.", "Cada passo descreve uma ação concreta.", "Os dados são fictícios e não contêm credenciais."],
    example: `Pré-condição: sessão de teste ativa e carrinho vazio.\n1. Abra o catálogo.\n2. Localize o Kit Smoke Test.\n3. Selecione “Adicionar ao carrinho”.\n4. Abra o resumo do carrinho.`,
  },
  {
    id: "expected-actual",
    week: 3,
    duration: "45 min",
    title: "Compare esperado e observado",
    objective: "Explicar a diferença entre o resultado real e o esperado com sinais concretos e sem ambiguidade.",
    concepts: ["resultado atual", "resultado esperado", "oráculo", "mensagens e valores"],
    practice: "Substitua expressões como “não funciona” pelo texto, valor, estado ou resposta que apareceu e pelo resultado previsto na regra.",
    deliverable: "Par esperado/observado com evidência específica para a condição investigada.",
    checklist: ["As duas partes são explícitas.", "O resultado observado pode ser conferido.", "A regra sustenta a expectativa descrita."],
    example: `Esperado: o resumo indica 1 item e o nome do produto.\nObservado: o resumo indica 0 itens e não exibe o produto.`,
  },
  {
    id: "environment",
    week: 3,
    duration: "60 min",
    title: "Inclua o ambiente que muda a reprodução",
    objective: "Informar versão, navegador, dispositivo e contexto relevantes sem preencher campos que não ajudam a investigar.",
    concepts: ["ambiente", "versão/build", "navegador", "dispositivo", "contexto"],
    practice: "Compare a falha em dois navegadores ou ambientes de teste. Registre versões e diferenças que afetaram o resultado.",
    deliverable: "Bloco de ambiente conciso e suficiente para repetir o comportamento.",
    checklist: ["Versão ou build está identificada quando disponível.", "Dispositivo e navegador são específicos.", "Detalhes irrelevantes não escondem a informação útil."],
    example: `Ambiente: QA Lab · build qa-2026.10.3 · Firefox 132 · Windows 11 · viewport 1365 × 768\nConta: usuário fictício “comprador-teste-04”`,
  },
  {
    id: "evidence",
    week: 4,
    duration: "60 min",
    title: "Anexe evidências seguras e úteis",
    objective: "Escolher captura, vídeo ou log que demonstre o sintoma e remover informações privadas antes de compartilhar.",
    concepts: ["captura", "gravação", "console", "network", "redação de dados"],
    practice: "Capture o estado antes e depois da ação. Se usar logs ou payloads, remova tokens, cookies, dados pessoais e segredos.",
    deliverable: "Evidência identificada, relacionada ao passo e revisada para não expor dados sensíveis.",
    checklist: ["A evidência mostra o sintoma sem exigir suposições.", "Nome e sequência ajudam a localizar o passo.", "Segredos e dados pessoais foram ocultados."],
    example: `Evidência: carrinho-resumo-vazio.png — capturada após o passo 4.\nConsole: sem erro relevante.\nNão anexar: cookies de sessão, tokens ou dados reais de clientes.`,
  },
  {
    id: "frequency",
    week: 4,
    duration: "45 min",
    title: "Descreva falhas intermitentes com medidas",
    objective: "Registrar frequência, tempo e condições de uma falha que não aparece em todas as tentativas.",
    concepts: ["intermitência", "frequência", "tentativas", "condições", "incerteza"],
    practice: "Repita o fluxo com estado inicial equivalente. Conte tentativas e ocorrências sem esconder tentativas bem-sucedidas.",
    deliverable: "Frequência observada, condições de execução e limites da amostra.",
    checklist: ["O número de ocorrências e tentativas está claro.", "Condições comparáveis foram mantidas.", "A amostra não é apresentada como certeza universal."],
    example: `Em 10 tentativas com carrinho vazio no Firefox 132, o resumo ficou desatualizado em 3.\nAs 7 tentativas restantes atualizaram normalmente. Teste realizado em uma sessão de QA.`,
  },
  {
    id: "impact-severity",
    week: 5,
    duration: "60 min",
    title: "Explique impacto sem confundir severidade e prioridade",
    objective: "Descrever quem é afetado e o dano potencial, distinguindo gravidade técnica da ordem de trabalho definida pelo time.",
    concepts: ["impacto", "alcance", "severidade", "prioridade", "risco"],
    practice: "Avalie cenários de falha para usuários e operações. Sugira impacto com justificativa e deixe a prioridade para o processo do time.",
    deliverable: "Impacto observado, alcance conhecido e severidade sugerida com justificativa.",
    checklist: ["Impacto descreve consequência para a pessoa ou operação.", "Severidade tem motivo, não só um rótulo.", "Prioridade é reconhecida como decisão de triagem do time."],
    example: `Impacto observado: compradores podem acreditar que o item não foi adicionado e repetir a ação.\nAlcance: observado em uma sessão de teste.\nSeveridade sugerida: média; a compra ainda pode continuar.\nPrioridade: definir na triagem conforme alcance e janela de release.`,
  },
  {
    id: "triage",
    week: 6,
    duration: "60 min",
    title: "Prepare o relato para uma boa triagem",
    objective: "Ajudar o time a confirmar, reproduzir, relacionar duplicatas ou pedir contexto adicional com clareza.",
    concepts: ["triagem", "status", "duplicata", "não reproduzido", "pergunta objetiva"],
    practice: "Revise relatos incompletos e escreva uma pergunta de acompanhamento que desbloqueie a investigação sem atribuir culpa.",
    deliverable: "Relato pronto para triagem, com status e informação pendente explícitos.",
    checklist: ["Confirmado, suspeito ou não reproduzido não são tratados como equivalentes.", "Possível duplicata é relacionada, não descartada sem contexto.", "A pergunta pede um dado necessário e específico."],
    example: `Status: suspeito — reprodução observada uma vez.\nPendente: confirmar se ocorre também após limpar os dados do site.\nPergunta: consegue informar o navegador e a build da sessão em que o resumo atualizou?`,
  },
  {
    id: "capstone",
    week: 7,
    duration: "2 h",
    title: "Projeto final: entregue um relato acionável",
    objective: "Produzir um bug report conciso, reproduzível, seguro e útil para investigação e reteste.",
    concepts: ["relato completo", "revisão", "rastreabilidade", "reteste", "aprendizado"],
    practice: "Escolha uma falha fictícia ou autorizada, preencha o modelo, peça uma revisão e refaça o fluxo após a correção.",
    deliverable: "Bug report com passos, ambiente, evidência segura, impacto e resultado do reteste.",
    checklist: ["Uma pessoa independente consegue repetir a falha.", "Esperado e observado têm fontes e sinais concretos.", "Impacto, evidência e privacidade foram revisados.", "O reteste registra versão, resultado e o que ainda não foi verificado."],
    example: `Use o template de bug report e registre: versão testada, passos repetidos, resultado do reteste e qualquer regressão relacionada.`,
  },
  {
    id: "review-retetest",
    week: 8,
    duration: "90 min",
    title: "Revise, reteste e feche o ciclo",
    objective: "Verificar a correção na versão certa, repetir os passos originais e registrar o resultado sem ampliar o que foi comprovado.",
    concepts: ["reteste", "regressão", "versão corrigida", "evidência", "fechamento"],
    practice: "Compare a build corrigida com os passos originais. Repita o caso que falhava e verifique uma condição próxima para identificar regressões.",
    deliverable: "Nota de reteste com versão, passos executados, resultado e limites da verificação.",
    checklist: ["A versão corrigida foi registrada.", "Os passos originais foram repetidos.", "Passou, falhou ou bloqueado está sustentado por observações.", "O fechamento não afirma cobertura além do que foi testado."],
    example: `Reteste: build qa-2026.10.8 · Firefox 132\nResultado: passou nos 10 testes do caso original; resumo atualizou em todas as tentativas.\nRegressão relacionada verificada: remoção do item atualiza o total.\nLimite: não avaliado em dispositivos móveis.`,
  },
];

export const bugReportOutcomes = [
  "Separar fato observado, expectativa e hipótese.",
  "Escrever passos claros com contexto suficiente para reproduzir.",
  "Selecionar evidências seguras e explicar impacto com precisão.",
  "Distinguir severidade, prioridade e status de triagem.",
  "Retestar a correção e registrar o que ainda não foi verificado.",
];

export const bugReportFinalProject = {
  title: "Projeto final: relato pronto para investigação",
  description: "Um único defeito, descrito de forma reproduzível, com expectativa verificável, evidências seguras e reteste documentado.",
  deliverables: [
    "Título objetivo e pré-condições conhecidas.",
    "Passos numerados, resultado observado e resultado esperado.",
    "Ambiente e frequência documentados quando relevantes.",
    "Evidência redigida para remover dados sensíveis.",
    "Impacto e severidade justificados sem impor prioridade.",
    "Resultado do reteste com versão e limites conhecidos.",
  ],
  rubric: [
    { criterion: "Reprodução e clareza", weight: "30%" },
    { criterion: "Esperado, observado e evidência", weight: "25%" },
    { criterion: "Contexto, impacto e triagem", weight: "20%" },
    { criterion: "Privacidade e segurança", weight: "15%" },
    { criterion: "Reteste e limites", weight: "10%" },
  ],
};

export const bugReportResources = [
  { label: "Mozilla Bugzilla · como escrever um bug report", href: "https://bugzilla.mozilla.org/page.cgi?id=bug-writing.html" },
  { label: "PostgreSQL · como relatar um problema", href: "https://www.postgresql.org/docs/17/bug-reporting.html" },
  { label: "GitLab · templates de issues", href: "https://docs.gitlab.com/user/project/description_templates/" },
];

export function findBugReportModule(id: string) {
  return bugReportCourseModules.find((module) => module.id === id);
}
