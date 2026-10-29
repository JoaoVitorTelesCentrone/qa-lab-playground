import type { EditorialSeries } from "./types";

export const collaborationSeries: EditorialSeries[] = [
  {
    id: "comunicacao-agil", title: "Comunicação e desenvolvimento ágil", href: "/trilhas/comunicacao-agil", section: "Colaboração e carreira", color: "#f1c391",
    stories: [
      {
        slug: "perguntas-de-qa-no-refinamento", title: "Perguntas de QA que melhoram um refinamento", summary: "Encontre ambiguidades enquanto ainda é barato decidir.",
        opening: "QA contribui no refinamento ao tornar riscos e exceções visíveis, não ao transformar a reunião em uma revisão de checklist. Perguntas úteis exploram quem usa a função, que estado muda e como o time saberá que a entrega funcionou. A melhor pergunta muitas vezes revela uma decisão ainda não tomada.",
        example: "Produto pede ‘permitir reagendar’. Pergunte se o horário antigo fica livre imediatamente, o que acontece se outra pessoa escolher o novo horário ao mesmo tempo e quem recebe aviso. Cada resposta muda implementação e teste.",
        steps: ["Pergunte qual problema da pessoa a história resolve e qual resultado será observável.", "Investigue limites, concorrência, permissões e falhas de dependências.", "Registre decisões e dúvidas com responsável e prazo antes de começar o desenvolvimento."],
        caution: "Não transforme toda possibilidade remota em requisito. Priorize perguntas pelo risco da decisão não tomada.",
        exercise: "Escolha uma história de agenda e leve cinco perguntas ao refinamento; marque as duas que mais mudariam o comportamento."
      },
      {
        slug: "comunicar-bloqueio-sem-ruido", title: "Como comunicar um bloqueio sem gerar ruído", summary: "Mostre impacto, evidência e próximo passo em uma atualização curta.",
        opening: "‘Estou bloqueado’ informa estado, mas deixa a equipe sem ação. Uma atualização útil explica qual entrega está afetada, o que foi tentado, qual evidência existe e de quem você precisa. A conversa fica mais rápida quando a mensagem também propõe uma alternativa temporária.",
        example: "‘Não consigo validar o cancelamento porque a API retorna 503 no ambiente de teste desde 14h. Reproduzi com dois usuários e anexei a resposta. Preciso de alguém do serviço de agenda; enquanto isso, valido o fluxo de criação.’ Essa mensagem permite coordenação.",
        steps: ["Nomeie a tarefa e o impacto imediato do bloqueio.", "Inclua tentativas, evidência e a pessoa ou decisão necessária.", "Diga o que fará enquanto espera e quando atualizará o time."],
        caution: "Evite atribuir culpa antes da investigação; descreva o comportamento observado.",
        exercise: "Reescreva uma mensagem vaga de bloqueio em quatro frases: impacto, evidência, pedido e plano provisório."
      },
      {
        slug: "qualidade-em-scrum-e-kanban", title: "O papel da qualidade em Scrum e Kanban", summary: "Faça qualidade aparecer no fluxo de trabalho, não só no fim da coluna.",
        opening: "Scrum e Kanban organizam trabalho de formas diferentes, mas nenhum método torna uma entrega boa por si só. QA pode ajudar a explicitar critérios, tornar riscos visíveis e observar onde o fluxo acumula espera. O ponto é melhorar decisões do time, não assumir sozinho a responsabilidade pela qualidade.",
        example: "Em uma sprint, uma história chega para teste no último dia. Em um fluxo Kanban, tarefas ficam dias esperando ambiente. São sintomas diferentes de uma mesma necessidade: discutir qualidade cedo e limitar trabalho em andamento.",
        steps: ["Inclua exemplos e critérios de aceite antes de implementar.", "Observe filas, retrabalho e impedimentos que atrasam feedback.", "Use retrospectiva ou revisão de fluxo para ajustar acordos e verificar o efeito."],
        caution: "Adicionar uma coluna ‘QA’ sem mudar a colaboração pode apenas mover o gargalo de lugar.",
        exercise: "Desenhe o fluxo da sua equipe e marque onde a primeira conversa sobre risco acontece. Proponha uma mudança pequena."
      }
    ]
  },
  {
    id: "mentalidade-qa", title: "Mentalidade de QA", href: "/trilhas/mentalidade-qa", section: "Colaboração e carreira", color: "#b5d7bd",
    stories: [
      {
        slug: "hipotese-antes-de-bug", title: "Investigue hipóteses antes de afirmar que há um bug", summary: "Separe observação, expectativa e interpretação.",
        opening: "Encontrar um comportamento estranho é o começo da investigação. Antes de abrir um defeito, procure a regra, reproduza a condição e compare alternativas. Isso não é desconfiança da pessoa que testou; é cuidado para entregar ao time uma descoberta que ele consiga entender e decidir.",
        example: "Um desconto não aparece no carrinho. Talvez o cupom esteja expirado, talvez o item não participe da promoção, talvez haja um defeito no cálculo. Consultar a regra e testar outro item ajuda a separar essas hipóteses.",
        steps: ["Descreva o fato observado sem já nomear a causa.", "Liste duas ou três explicações possíveis e qual evidência diferenciaria cada uma.", "Confirme a expectativa com a fonte da regra e registre o que permaneceu incerto."],
        caution: "Investigar não significa atrasar indefinidamente um relato de impacto alto. Abra a ocorrência com incerteza explícita quando necessário.",
        exercise: "Escolha uma surpresa em um Lab e escreva três hipóteses, com um teste curto para cada uma."
      },
      {
        slug: "falar-sobre-risco-e-incerteza", title: "Como falar sobre risco e incerteza", summary: "Troque promessas absolutas por evidências e limites claros.",
        opening: "‘Está tudo testado’ soa tranquilizador, mas raramente descreve o que foi feito. Uma comunicação responsável mostra escopo, resultados e o que não foi observado. Isso permite que produto e engenharia decidam com consciência, especialmente quando tempo e ambiente são limitados.",
        example: "‘Validamos compra com cartão e cupom em desktop; não conseguimos exercitar estorno porque o sandbox estava indisponível; o risco é um pedido não voltar ao estado correto.’ Essa frase é mais acionável que ‘sem bugs’.",
        steps: ["Diga quais cenários e ambientes foram cobertos.", "Separe defeitos encontrados de riscos ainda não verificados.", "Explique impacto possível e proponha mitigação ou próximo teste."],
        caution: "Não converta ‘não encontrei defeito’ em ‘não existe defeito’. São afirmações diferentes.",
        exercise: "Escreva uma atualização de release com dois testes concluídos, uma limitação e uma recomendação."
      },
      {
        slug: "qualidade-e-responsabilidade-do-time", title: "Qualidade é responsabilidade do time inteiro", summary: "QA amplia a informação disponível; não é uma barreira solitária antes do deploy.",
        opening: "Quando qualidade é entregue a uma única pessoa no fim do trabalho, os defeitos chegam tarde e as decisões ficam pressionadas. Desenvolvimento, produto, design, operação e QA enxergam riscos diferentes. Juntar essas perspectivas desde o começo reduz suposições e permite corrigir o rumo antes de acumular retrabalho.",
        example: "Uma mudança de cadastro envolve regra de produto, estados de interface, validação no serviço e recuperação de conta. QA pode propor cenários; desenvolvimento pode proteger regras em testes de serviço; design pode revisar mensagens; produto pode resolver ambiguidades.",
        steps: ["Defina exemplos de comportamento esperado com diferentes funções do time.", "Distribua verificações na camada em que o feedback é mais útil.", "Revise incidentes sem buscar culpado e mude o processo que permitiu a falha."],
        caution: "Responsabilidade compartilhada não significa que ninguém é responsável por ações concretas. Acordos precisam de donos e prazo.",
        exercise: "Pegue um defeito fictício e liste uma ação preventiva possível para produto, engenharia, design e QA."
      }
    ]
  }
];
