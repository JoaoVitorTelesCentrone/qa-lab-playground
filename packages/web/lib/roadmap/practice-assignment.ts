import type { RoadmapChallenge } from "./qa-do-zero";

export type PracticeAssignment = {
  environment: string;
  route: string;
  setup: string[];
  actions: string[];
  evidence: string;
};

type EnvironmentConfig = Pick<PracticeAssignment, "environment" | "route" | "setup">;

const byModule: Array<[RegExp, EnvironmentConfig]> = [
  [/^1\.7/, { environment: "Web Playground", route: "/playground/elements", setup: ["Abra DevTools (Console e Network).", "Teste em desktop e em viewport mobile."] }],
  [/^1\.8/, { environment: "API Playground", route: "/api-playground", setup: ["Escolha um endpoint do catálogo.", "Prepare um cenário válido e outro inválido."] }],
  [/^1\.9/, { environment: "Finanças — persistência", route: "/financas/transactions", setup: ["Crie ou identifique um lançamento de teste.", "Registre o estado antes da operação."] }],
  [/^1\.10/, { environment: "Trilha CI/CD", route: "/trilhas/cicd", setup: ["Escolha um Lab ligado a versionamento.", "Use o repositório local como evidência quando o desafio pedir diff ou histórico."] }],
  [/^1\.11/, { environment: "Playground de automação", route: "/playground/elements", setup: ["Escolha um componente ou fluxo estável.", "Defina seletores, dados e oráculo antes de automatizar."] }],
  [/^1\.12/, { environment: "Trilha CI/CD", route: "/trilhas/cicd", setup: ["Abra o Lab relacionado ao pipeline.", "Identifique stages e quality gates atuais."] }],
  [/^1\.13/, { environment: "Waits Lab", route: "/labs/waits", setup: ["Execute primeiro o cenário normal.", "Repita com o desvio de carregamento quando fizer sentido."] }],
  [/^1\.14/, { environment: "API Playground", route: "/api-playground", setup: ["Use somente dados fictícios.", "Não registre tokens ou segredos na evidência."] }],
  [/^1\.15/, { environment: "Lab de acessibilidade", route: "/labs/acessibilidade", setup: ["Inicie usando somente teclado.", "Ative o cenário de desvio apenas depois de observar o fluxo normal."] }],
  [/^1\.16/, { environment: "ExpenseFlow Mobile", route: "/playground/expenseflow", setup: ["Use viewport de 320 px e depois 768 px.", "Teste orientação, teclado e interrupção do fluxo."] }],
  [/^1\.17/, { environment: "Finanças — indicadores", route: "/financas", setup: ["Crie uma linha de base com os dados visíveis.", "Defina a decisão que a métrica deve apoiar."] }],
  [/^1\.[1-6]/, { environment: "QA Lab Shop", route: "/shop/products", setup: ["Escolha um fluxo entre catálogo, carrinho e checkout.", "Use dados controlados e registre a pré-condição."] }],
  [/^2\.1/, { environment: "QA Lab People", route: "/lab/pessoas", setup: ["Selecione uma situação de trabalho em time.", "Separe fatos, interesses e decisão necessária."] }],
  [/^2\.2/, { environment: "Refinement Lab", route: "/lab/refinamento", setup: ["Escolha uma história ainda não refinada.", "Anote ambiguidades antes de abrir as sugestões."] }],
  [/^2\.3/, { environment: "Critérios Lab", route: "/lab/criterios", setup: ["Escolha um requisito e registre sua versão inicial.", "Simule uma mudança relevante de regra."] }],
  [/^2\.4/, { environment: "Bug Triage Lab", route: "/lab/triagem", setup: ["Escolha ao menos três achados.", "Defina os critérios de prioridade antes de ordenar."] }],
  [/^2\.5/, { environment: "Logs Investigation Lab", route: "/lab/logs", setup: ["Escolha um incidente e capture a linha do tempo.", "Não leia a conclusão antes de formular hipóteses."] }],
  [/^2\.6/, { environment: "Ambientes de prática", route: "/financas", setup: ["Compare o estado normal com uma rota ou cenário alternativo.", "Registre configuração, dados e versão observados."] }],
  [/^2\.7/, { environment: "Agendamentos", route: "/agendamentos/schedule", setup: ["Crie uma massa de cliente, serviço e horário.", "Planeje como restaurar o estado após o teste."] }],
  [/^2\.8/, { environment: "Pack de regressão", route: "/labs/regressao", setup: ["Selecione um cenário estável e um instável.", "Registre tempo, repetição e causa provável de falha."] }],
  [/^2\.9/, { environment: "QA Lab Shop — operações", route: "/shop/operations", setup: ["Observe primeiro o comportamento existente.", "Mapeie dependências antes de propor mudança."] }],
  [/^2\.10/, { environment: "Trilha CI/CD", route: "/trilhas/cicd", setup: ["Escolha um Lab de release.", "Defina evidência mínima para go/no-go."] }],
  [/^2\.11/, { environment: "Logs Investigation Lab", route: "/lab/logs", setup: ["Escolha uma situação real do catálogo.", "Registre fatos e hipóteses separadamente."] }],
  [/^3\./, { environment: "QA Lab People", route: "/lab/pessoas", setup: ["Selecione uma situação compatível com o tema.", "Defina público, contexto e objetivo da conversa."] }],
  [/^4\.[1-3]/, { environment: "Bug Triage Lab", route: "/lab/triagem", setup: ["Escolha um caso com informação incompleta.", "Liste riscos e hipóteses antes de decidir."] }],
  [/^4\.[4-6]/, { environment: "Logs Investigation Lab", route: "/lab/logs", setup: ["Escolha um incidente com múltiplas pistas.", "Construa um mapa de dependências ou hipóteses."] }],
  [/^4\.[7-9]/, { environment: "Execution Hub", route: "/lab/execution", setup: ["Escolha um projeto ou crie um recorte de prática.", "Defina risco, estratégia e evidência antes de executar."] }],
  [/^5\.3 .*CI\/CD/i, { environment: "Trilha CI/CD", route: "/trilhas/cicd", setup: ["Comece pelo primeiro Lab ainda não concluído.", "Use o relatório de confiabilidade como evidência da trilha."] }],
  [/^5\.[1-5]/, { environment: "Mapa de competências", route: "/lab/competencias", setup: ["Escolha a competência profissional correspondente.", "Reúna uma evidência real ou produzida no QA Lab."] }],
  [/^5\.[6-9]/, { environment: "Portfólio", route: "/perfil", setup: ["Abra seu perfil e selecione uma evidência existente.", "Não use curso concluído como única prova de competência."] }],
];

const baseEnvironments: EnvironmentConfig[] = [
  { environment: "QA Lab Shop", route: "/shop/products", setup: ["Escolha um fluxo crítico da loja.", "Observe usuário, negócio e comportamento técnico."] },
  { environment: "Finanças", route: "/financas", setup: ["Escolha um lançamento, orçamento ou indicador.", "Registre o estado inicial."] },
  { environment: "Agendamentos", route: "/agendamentos/schedule", setup: ["Escolha um serviço e horário.", "Considere conflito, cancelamento e confirmação."] },
  { environment: "CRM", route: "/crm/funnel", setup: ["Escolha uma oportunidade e um estágio.", "Compare informação visual e dados do funil."] },
];

function configFor(challenge: RoadmapChallenge): EnvironmentConfig {
  const matched = byModule.find(([pattern]) => pattern.test(challenge.module));
  if (matched) return matched[1];
  if (challenge.order <= 20) return baseEnvironments[(challenge.order - 1) % baseEnvironments.length];
  return { environment: "QA Lab Playground", route: "/playground", setup: ["Escolha um fluxo relacionado ao tema.", "Registre pré-condição e dados antes de começar."] };
}

export function getPracticeAssignment(challenge: RoadmapChallenge): PracticeAssignment {
  const config = configFor(challenge);
  return {
    ...config,
    actions: [
      `Execute no ambiente uma observação ou experimento ligado à missão: ${challenge.prompt}`,
      "Registre o comportamento observado antes de interpretar a causa.",
      "Produza a entrega pedida usando dados do ambiente, não apenas uma resposta teórica.",
    ],
    evidence: challenge.type === "COMMUNICATE"
      ? "Salve a mensagem final e os fatos do ambiente que sustentam sua comunicação."
      : challenge.type === "BUILD"
        ? "Salve o artefato produzido e uma captura ou resultado de execução no ambiente."
        : "Salve passos, dados, resultado observado e a evidência principal da sua conclusão.",
  };
}
