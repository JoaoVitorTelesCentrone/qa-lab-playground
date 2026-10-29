import type { EditorialSeries } from "./types";

export const labSeries: EditorialSeries[] = [
  {
    id: "fluxos-criticos", title: "Fluxos críticos", href: "/trilhas/fluxos-criticos", section: "Percursos por Labs", color: "#f1b197",
    stories: [
      {
        slug: "compra-de-ponta-a-ponta", title: "Como testar uma compra de ponta a ponta", summary: "Siga a jornada inteira e observe as transições entre etapas.",
        opening: "Um teste de compra não termina quando o botão de pagamento responde. A pessoa precisa encontrar um produto, montar o carrinho, entender preço e frete, confirmar o pedido e conseguir vê-lo depois. Testar a jornada inteira revela falhas nas passagens entre sistemas que casos isolados podem perder.",
        example: "Um pedido recebe mensagem de sucesso, mas não aparece no histórico. O pagamento pode ter sido aceito enquanto o registro do pedido falhou. Sem verificar o estado final, o teste teria aprovado uma experiência quebrada.",
        steps: ["Defina um pedido de treino com produto, endereço e forma de pagamento controlados.", "Registre preço, quantidade e estado em cada passagem da jornada.", "Após concluir, volte ao histórico e confirme que o mesmo pedido persiste."],
        caution: "Evite pedidos reais ou cobranças em ambientes de produção durante uma prática.",
        exercise: "Percorra a compra da QA Lab Shop e marque três pontos em que um sistema poderia confirmar sucesso antes de persistir o resultado."
      },
      {
        slug: "falhas-entre-carrinho-e-pagamento", title: "Falhas que passam entre carrinho e pagamento", summary: "Examine valores e estados nas fronteiras do checkout.",
        opening: "Carrinho e pagamento podem concordar na interface e discordar nos dados. Alterações de quantidade, frete, cupom ou sessão perto da confirmação criam transições perigosas. O objetivo é verificar que a pessoa aprova o mesmo valor que o sistema registra e cobra.",
        example: "Depois de aplicar um cupom, a pessoa volta ao carrinho e altera a quantidade. O total mostrado muda, mas a etapa de pagamento usa o valor antigo. Esse defeito aparece quando o teste compara valores antes e depois da transição.",
        steps: ["Anote total, desconto e frete no carrinho antes de avançar.", "Altere uma condição e confira o resumo na etapa de pagamento.", "Verifique pedido confirmado e registro final com os mesmos valores."],
        caution: "Uma mensagem de ‘pagamento aprovado’ não substitui a conferência do pedido e do valor final.",
        exercise: "Crie um roteiro com uma alteração tardia no carrinho e escreva os valores que precisa comparar em cada etapa."
      },
      {
        slug: "priorizar-cenarios-de-checkout", title: "Como priorizar cenários de checkout", summary: "Comece pelo que interrompe compra ou altera dinheiro.",
        opening: "Há muitas combinações possíveis de item, desconto, endereço e pagamento. Escolher todas sem critério gera uma matriz impossível. Priorize impacto, frequência de uso, novidade da mudança e histórico de falhas. Depois declare o que ficou fora para que a cobertura seja compreendida.",
        example: "Se mudou o cálculo de frete, cenários com endereço e cupom merecem atenção imediata. Trocar a imagem do produto pode ficar em uma verificação visual curta. Ambos importam, mas o risco financeiro e a dependência da mudança são diferentes.",
        steps: ["Liste etapas e variações que afetam preço, acesso ou conclusão do pedido.", "Classifique pelo impacto e pela chance de a mudança atingir cada caminho.", "Monte uma rodada essencial e outra ampliada se houver tempo ou sinal de falha."],
        caution: "Priorizar não é ignorar o restante; é explicitar a ordem e o risco residual.",
        exercise: "Escolha cinco cenários de checkout entre dez possibilidades e justifique por que começaria por eles."
      }
    ]
  },
  {
    id: "broto-na-pratica", title: "Investigue o Broto", href: "/trilhas/broto-na-pratica", section: "Percursos por Labs", color: "#a8d3b0",
    stories: [
      {
        slug: "verificar-dados-apos-recarregar", title: "Como verificar se um dado continua após recarregar", summary: "Persistência exige mais que uma mensagem de sucesso.",
        opening: "Salvar algo sem erro na interface não prova que estará disponível depois. A verificação de persistência inclui sair do contexto, recarregar e recuperar o mesmo registro. Em produtos de escrita, a perda silenciosa corrói confiança porque a pessoa só percebe o problema quando precisa retomar a ideia.",
        example: "No Broto, registre um pensamento fictício com uma frase única. Saia da Mente, recarregue e volte. Compare texto, ordem e contexto; não basta encontrar um card com o mesmo título se o conteúdo mudou.",
        steps: ["Crie um texto de treino identificável e registre o estado inicial.", "Saia da tela, recarregue e volte pelo caminho normal do usuário.", "Compare conteúdo e contexto, inclusive edição e organização, se fizeram parte da ação."],
        caution: "Use texto fictício; a prática não exige colocar informações pessoais no sistema de treino.",
        exercise: "Execute a jornada de salvar, sair e voltar no Broto e anote exatamente o que permanece e o que muda."
      },
      {
        slug: "testes-de-retomada-de-contexto", title: "Testes de retomada de contexto", summary: "Verifique se a pessoa consegue continuar de onde parou.",
        opening: "Retomar uma atividade é mais que recuperar um campo. O produto precisa preservar relação entre item, categoria, estado e posição de trabalho quando isso faz parte da experiência. Testes de retomada investigam o que acontece depois de pausa, navegação, sessão renovada e retorno.",
        example: "Uma nota continua salva, mas reaparece em outra seção sem a etiqueta que a organizava. Os bytes do texto persistiram; o contexto que ajudava a encontrar a ideia se perdeu. Para a pessoa, o trabalho ainda foi prejudicado.",
        steps: ["Registre texto, local, marcadores e estado antes de sair.", "Volte por caminhos diferentes, como menu, busca e página inicial.", "Compare se a tarefa pode continuar sem reconstruir informações manualmente."],
        caution: "Não reduza retomada a ‘o registro existe no banco’. A experiência de encontrá-lo também importa.",
        exercise: "Salve duas notas fictícias em categorias distintas e verifique se a organização continua compreensível após nova sessão."
      },
      {
        slug: "investigar-perda-silenciosa-de-informacao", title: "Investigando perda silenciosa de informações", summary: "Procure falhas que não exibem erro, mas alteram a intenção da pessoa.",
        opening: "Alguns defeitos não lançam exceção. Uma edição parece salva, um item muda de ordem ou um trecho desaparece só depois de navegar. Para investigar perda silenciosa, compare estados antes e depois de cada transição e registre o menor ponto em que a informação diverge.",
        example: "Você edita um pensamento e vê o novo texto. Ao abrir outra área e voltar, a versão antiga reaparece. A mensagem de sucesso indicava uma operação, mas não garantiu que o estado final persistiu.",
        steps: ["Use conteúdo de treino fácil de distinguir em versões diferentes.", "Compare tela, retorno após navegação e retorno após recarga.", "Se houver divergência, isole a transição e registre horário, ação e versão observada."],
        caution: "Uma falha sem alerta pode ser mais difícil de perceber; documente o impacto sobre confiança e retomada.",
        exercise: "Altere uma nota fictícia duas vezes e descubra qual versão aparece em cada caminho de retorno."
      }
    ]
  },
  {
    id: "agenda-sem-conflito", title: "Agenda sem conflito", href: "/trilhas/agenda-sem-conflito", section: "Percursos por Labs", color: "#a9c7e8",
    stories: [
      {
        slug: "testar-horarios-simultaneos", title: "Testando horários simultâneos e conflitos", summary: "Verifique se duas pessoas disputando a mesma vaga recebem um resultado coerente.",
        opening: "Uma agenda pode parecer correta quando uma pessoa marca por vez e falhar sob concorrência. O teste de conflito observa se a disponibilidade mostrada, a reserva efetiva e a resposta para a segunda pessoa permanecem consistentes. Isso inclui duração do serviço e limites entre horários.",
        example: "Duas pessoas veem 15h disponível. A primeira confirma; a segunda tenta confirmar logo depois. O sistema deve aplicar a regra acordada para conflito e explicar o resultado, sem criar dois atendimentos no mesmo recurso.",
        steps: ["Prepare o mesmo profissional, data e horário em duas sessões de treino.", "Tente confirmar as reservas em sequência curta e observe ambas as respostas.", "Confira o estado final da agenda, não apenas as mensagens das telas."],
        caution: "Datas, fuso e duração podem mudar o que significa ‘mesmo horário’. Registre essas condições.",
        exercise: "Monte um caso de concorrência para uma vaga única e escreva o estado final esperado para as duas pessoas."
      },
      {
        slug: "casos-de-borda-em-reagendamento", title: "Casos de borda em reagendamentos", summary: "Reagendar exige cuidar do horário antigo e do novo ao mesmo tempo.",
        opening: "Um reagendamento é uma troca de estado. Se a reserva antiga é liberada cedo demais ou a nova não é confirmada, a pessoa pode ficar sem atendimento. Limites de horário, cancelamento durante a operação e concorrência tornam essa troca especialmente sensível.",
        example: "Uma pessoa tenta mover uma consulta das 14h para as 15h, mas outra ocupa 15h antes da confirmação. O comportamento desejado pode ser manter 14h e informar o conflito. O que não pode acontecer é a tela dizer sucesso enquanto ambos os horários ficam indisponíveis.",
        steps: ["Registre estado inicial e as condições do novo horário.", "Teste destino livre, ocupado e no limite de uma regra de antecedência.", "Confira horário antigo, novo e notificações após cada resultado."],
        caution: "Verifique a regra de negócio antes de assumir que um reagendamento falho preserva automaticamente a reserva anterior.",
        exercise: "Escreva três cenários de reagendamento e uma tabela com o estado esperado dos dois horários."
      },
      {
        slug: "validar-cancelamento-e-disponibilidade", title: "Como validar cancelamentos e disponibilidade", summary: "O cancelamento precisa atualizar a agenda e preservar o histórico correto.",
        opening: "Cancelar não significa apenas esconder um card. A ação pode liberar uma vaga, disparar aviso e alterar métricas, dependendo da regra. Uma verificação completa confere a resposta visível, o novo estado de disponibilidade e o registro histórico necessário para auditoria.",
        example: "Depois de cancelar uma consulta de treino, outra pessoa consegue escolher o mesmo horário. Se a vaga continua bloqueada, o cancelamento não terminou. Se a consulta desaparece sem histórico, o suporte pode perder contexto.",
        steps: ["Confirme a regra de prazo e quem pode cancelar.", "Cancele e tente reservar novamente o horário liberado.", "Confira histórico, aviso e repetição da ação quando aplicável."],
        caution: "Um segundo clique em cancelar não deve produzir um estado impossível ou uma segunda notificação indevida.",
        exercise: "Teste cancelamento antes e depois do limite de prazo definido no Lab e documente o que mudou na disponibilidade."
      }
    ]
  },
  {
    id: "funil-comercial", title: "Funil comercial", href: "/trilhas/funil-comercial", section: "Percursos por Labs", color: "#d5b5e4",
    stories: [
      {
        slug: "mudancas-de-estagio-sem-perder-dados", title: "Testando mudanças de estágio sem perder dados", summary: "Uma oportunidade deve preservar história e campos relevantes ao avançar.",
        opening: "Mover uma oportunidade no funil parece uma ação simples, mas altera visibilidade, métricas e talvez permissões. Um teste útil confere o estágio novo e também o que deve permanecer: valor, responsável, notas e histórico. Essas perdas podem passar despercebidas quando o card só muda de coluna.",
        example: "Uma negociação sai de ‘Contato’ para ‘Proposta’. O valor aparece na nova coluna, mas a nota da última conversa desaparece. A mudança visual funcionou; a continuidade do trabalho comercial, não.",
        steps: ["Registre campos e histórico antes de mover a oportunidade.", "Faça a transição permitida e confira estágio, responsável e dados persistidos.", "Recarregue a página e valide métricas e eventos relacionados à mudança."],
        caution: "Alguns campos podem mudar por regra ao trocar de estágio; confirme a expectativa antes de classificar a diferença como bug.",
        exercise: "Crie uma oportunidade fictícia com notas e valor, mova-a e liste tudo que deve continuar acessível."
      },
      {
        slug: "conferir-metricas-do-funil", title: "Como conferir métricas do funil", summary: "Compare contagens e valores com os registros que lhes deram origem.",
        opening: "Um número no dashboard é uma consequência de dados e regras. Para testá-lo, saiba quais oportunidades entram no cálculo, em que período e em qual estágio. Quando a definição é ambígua, duas fórmulas diferentes podem parecer corretas até uma decisão importante depender delas.",
        example: "Uma oportunidade de R$ 5 mil é marcada como perdida. Ela deve sair do valor previsto para fechamento? Deve continuar na contagem histórica? O teste precisa da definição do indicador antes de validar o número exibido.",
        steps: ["Anote a fórmula, o período e os filtros da métrica.", "Crie um conjunto pequeno de oportunidades com resultados previsíveis.", "Mude um estágio por vez e recalcule manualmente o valor esperado."],
        caution: "Não aprove um dashboard só porque seus números parecem plausíveis. Faça a conta a partir dos registros de origem.",
        exercise: "Monte quatro oportunidades fictícias e calcule a contagem por estágio antes e depois de uma mudança."
      },
      {
        slug: "duplicidade-de-contatos-e-oportunidades", title: "Cenários de duplicidade de contatos e oportunidades", summary: "Investigue como o CRM reconhece pessoas e negociações repetidas.",
        opening: "Duplicidade pode nascer de importação, criação manual ou integrações. O teste não deve assumir que nomes iguais são a mesma pessoa, nem que e-mails diferentes sempre indicam pessoas diferentes. Primeiro descubra a regra de identificação e de mesclagem; depois exercite combinações que a desafiam.",
        example: "Dois contatos com o mesmo e-mail são criados com nomes diferentes. O CRM pode bloquear, sugerir mesclagem ou permitir com aviso, conforme a regra. O problema é tratar a situação de modo inconsistente entre tela e importação.",
        steps: ["Defina quais campos identificam contato e oportunidade.", "Teste criação repetida, importação e edição que gera colisão.", "Confira histórico, responsável e métricas após bloqueio ou mesclagem."],
        caution: "Uma mesclagem incorreta pode apagar contexto comercial. Use dados fictícios e verifique reversibilidade quando houver.",
        exercise: "Escreva uma matriz pequena com e-mail igual/diferente e nome igual/diferente; marque a decisão esperada em cada caso."
      }
    ]
  }
];
