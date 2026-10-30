import type { EditorialSeries } from "./types";

export const foundationSeries: EditorialSeries[] = [
  {
    id: "qa-do-zero", title: "QA do Zero", href: "/trilhas/qa-do-zero", section: "Fundamentos e investigação", color: "#a9d8a5",
    stories: [
      {
        slug: "qa-antes-de-executar-testes", title: "O que um QA faz antes de executar testes", summary: "Qualidade começa nas perguntas feitas antes da primeira execução.",
        opening: "Abrir o sistema e procurar erros é só uma parte do trabalho. Antes da primeira execução, QA precisa entender para quem a funcionalidade existe, qual comportamento foi prometido e que consequência uma falha teria. Esse contexto ajuda a escolher por onde começar, em vez de gastar o mesmo esforço em cada detalhe da tela. Também revela dúvidas que ainda precisam de uma decisão de produto ou de uma conversa com desenvolvimento.",
        example: "Imagine uma pessoa registrando um pensamento no BrotoSpace. Validar que o botão responde não esclarece se ela consegue reencontrar a ideia depois, se o texto continua disponível ao voltar ou como o contexto de um desafio relacionado aparece quando a pessoa retoma. Cada resposta muda o que vale observar e quais dependências entram na investigação. Antes de testar, QA pode confirmar quais desses comportamentos fazem parte do fluxo atual e quais ainda são perguntas.",
        steps: ["Leia a regra e reescreva o resultado esperado em linguagem de usuário. Se a frase permitir mais de uma interpretação, marque a dúvida em vez de escolher uma silenciosamente.", "Desenhe o caminho principal e pense nas exceções que podem mudar o resultado: dados ausentes, formato inválido, repetição da ação ou interrupção de uma dependência.", "Converse com produto e desenvolvimento sobre as perguntas de maior risco. Registre a decisão e a evidência que permitirá reconhecer se o comportamento combinado foi entregue."],
        caution: "Uma lista extensa de casos não compensa uma regra mal compreendida. Separar fatos confirmados de hipóteses evita que QA valide uma expectativa que ninguém combinou e dá ao time uma chance de resolver a ambiguidade antes de ela virar retrabalho.",
        exercise: "Escolha um fluxo do BrotoSpace e escreva três perguntas que faria no refinamento: uma sobre o caminho comum, uma sobre uma falha e uma sobre o estado final dos dados. Para cada resposta, descreva o que você conseguiria observar no produto."
      },
      {
        slug: "da-regra-ao-caso-de-teste", title: "Como transformar uma regra em casos de teste", summary: "Saia da frase genérica e chegue a exemplos que distinguem comportamentos.",
        opening: "Uma regra como ‘a pessoa pode relacionar um pensamento a um desafio’ ainda não diz quais dados usar nem o que deve acontecer em cada situação. Para chegar a casos úteis, transforme o texto em uma decisão que possa ser observada: dadas certas condições, uma ação deve produzir um resultado específico. O objetivo não é multiplicar combinações sem critério, mas escolher exemplos que revelem se a regra foi entendida. Quando o comportamento real do BrotoSpace ainda não foi confirmado, trate o exemplo como hipótese de investigação, não como requisito.",
        example: "Imagine uma regra de prática: ao relacionar um pensamento fictício a um desafio, a pessoa deve conseguir reencontrar o pensamento e entender esse vínculo ao voltar. Um caso em que o vínculo aparece após a ação confirma um caminho, mas não mostra se o pensamento continua acessível depois de sair da área ou recarregar. Esses passos podem revelar diferenças entre o estado imediato e o que foi realmente salvo. Antes de afirmar que qualquer resultado é esperado no BrotoSpace, confirme a regra na interface, no critério ou no contrato autorizado.",
        steps: ["Reescreva a regra como uma pergunta de decisão: que condições permitem criar ou remover um vínculo, e qual resultado a pessoa deve observar? Marque palavras vagas como ‘relacionar’ ou ‘reencontrar’.", "Escolha exemplos que separem comportamentos: pensamento sem vínculo, pensamento associado a um desafio e retorno posterior para consultar o contexto. Varie uma condição de cada vez para entender o que mudou.", "Defina a evidência para cada exemplo: vínculo visível, pensamento localizável ou estado que persiste após retomar. Assim outra pessoa consegue avaliar o caso sem depender da intenção de quem o escreveu."],
        caution: "Não copie o requisito como resultado esperado. ‘O pensamento deve continuar acessível’ precisa indicar em que fluxo e após qual ação. Se a regra não estiver confirmada, registre a dúvida e não transforme uma suposição sobre o BrotoSpace em critério de aprovação.",
        exercise: "Escreva uma regra de prática sobre capturar um pensamento e relacioná-lo a um desafio no BrotoSpace. Monte quatro exemplos: antes do vínculo, depois de relacionar, após sair e voltar, e uma condição diferente que possa afetar o resultado. Anote o que você espera observar e confirme quais expectativas pertencem ao produto real."
      },
      {
        slug: "primeiro-plano-de-testes-enxuto", title: "Seu primeiro plano de testes sem burocracia", summary: "Um plano curto que deixa claras prioridades, limites e decisões.",
        opening: "Um plano de testes serve para combinar o que será investigado, por que aquilo importa e que risco continuará aberto. Ele não precisa virar um documento longo antes de o time começar: deve ajudar as pessoas a escolher o próximo passo e entender o alcance da evidência reunida. Quando uma mudança acontece ou aparece um resultado inesperado, um plano enxuto também permite revisar prioridades sem perder o motivo das decisões anteriores.",
        example: "Imagine uma mudança no fluxo de captura e retomada de pensamentos do BrotoSpace. O time pode priorizar registrar uma ideia, sair e tentar reencontrá-la, além de verificar como o contexto aparece quando ela se relaciona a um desafio ou a uma ação. Uma área próxima que compartilha o mesmo registro talvez mereça uma checagem; telas sem relação com a mudança podem receber menos atenção nesta rodada. A escolha deve vir do impacto possível e das conexões entre os fluxos, não de uma promessa vaga de ‘testar tudo’.",
        steps: ["Registre o objetivo da rodada, a mudança que será avaliada e quais fluxos precisam funcionar para a entrega cumprir seu propósito.", "Anote os riscos mais relevantes, os dados e ambientes necessários e as dependências que podem limitar a investigação. Dê prioridade com uma razão clara.", "Declare o que não será exercitado agora, que evidência permitirá encerrar a rodada e quais sinais fariam o time ampliar o escopo."],
        caution: "‘Testar tudo’ não é um escopo verificável, e uma lista enorme não garante cobertura. Quando o prazo ou a mudança se alterar, revise o plano e comunique o risco residual para que a decisão de entrega não dependa de uma falsa sensação de certeza.",
        exercise: "Escreva um plano curto para uma alteração na captura ou retomada de pensamentos do BrotoSpace. Escolha três verificações prioritárias, explique por que cada uma entrou e cite uma área que ficará fora desta rodada. Defina também qual evidência faria você parar, continuar ou pedir uma nova investigação."
      }
    ]
  },
  {
    id: "testes-exploratorios", title: "Testes exploratórios", href: "/trilhas/testes-exploratorios", section: "Fundamentos e investigação", color: "#c9d28e",
    stories: [
      {
        slug: "charter-para-sessao-exploratoria", title: "Como criar um charter para uma sessão exploratória", summary: "Dê direção à exploração sem transformá-la num roteiro rígido.",
        opening: "Explorar não é clicar ao acaso, mas também não é seguir um roteiro fechado. Um charter define uma missão, um alvo, uma preocupação e um tempo para a sessão. Isso dá um ponto de partida e preserva a liberdade de acompanhar uma pista inesperada. Sem foco, é fácil terminar depois de visitar várias telas sem saber que risco foi investigado; com passos rígidos demais, descobertas novas podem ser ignoradas só porque não estavam previstas.",
        example: "Em vez de ‘testar o BrotoSpace’, experimente investigar se um pensamento fictício pode ser reencontrado depois de sair da área de captura e voltar, em uma sessão de 30 minutos. A missão delimita o comportamento e o risco de perder contexto, mas ainda permite variar o conteúdo, relacionar a ideia a um desafio ou ação e recarregar para observar o que muda. O charter orienta a exploração sem antecipar todos os cliques nem presumir qual será o resultado correto; confirme as regras do fluxo antes de classificar uma observação como defeito.",
        steps: ["Escolha um comportamento observável e um risco que justifique a sessão. Uma missão específica ajuda a escolher o que experimentar primeiro e a reconhecer quando surgiu uma descoberta relevante.", "Defina os dados, as condições e o tempo disponíveis. Se a investigação depende de uma conta ou configuração preparada, registre isso para que o resultado possa ser entendido e retomado.", "Reserve espaço para anotar observações, hipóteses e novas perguntas. Se mudar de rota, registre o que motivou a mudança e como ela se relaciona à missão original."],
        caution: "O charter orienta a investigação; não é uma promessa de cobertura completa. Ao final, explique o que foi tentado e o que ficou de fora. Um timebox encerra aquela rodada, não transforma o produto em ‘aprovado’.",
        exercise: "Crie um charter de 30 minutos para capturar e retomar um pensamento fictício no BrotoSpace. Escreva a missão, o risco que pretende investigar e os dados necessários. Ao praticar, anote uma observação e diga que evidência faria você pausar a exploração para registrar um bug ou abrir outra investigação."
      },
      {
        slug: "notas-de-teste-que-permitem-retomar", title: "Notas que permitem retomar uma investigação", summary: "Registre o raciocínio, não apenas uma sequência de cliques.",
        opening: "Uma sessão exploratória produz observações, hipóteses e decisões. Se as notas contêm somente ‘testado’ e capturas de tela, ninguém sabe o que foi investigado nem por onde continuar. O registro útil preserva o contexto da descoberta sem obrigar você a escrever um relatório longo enquanto testa.",
        example: "Você percebe que o total do carrinho muda depois de voltar da página de pagamento. Uma nota útil guarda os itens, a sequência aproximada, o total antes e depois, o navegador, a hipótese de arredondamento e o que ainda falta verificar.",
        steps: ["Anote a missão e os dados usados no começo da sessão.", "Separe fatos observados de interpretações e perguntas abertas.", "Marque os passos mínimos para reproduzir descobertas que merecem investigação posterior."],
        caution: "Não deixe a documentação interromper toda tentativa. Uma marca temporal e frases curtas bastam durante a sessão; organize depois.",
        exercise: "Faça uma exploração de 15 minutos e entregue notas que outra pessoa consiga usar para continuar de onde você parou."
      },
      {
        slug: "debrief-e-cobertura-exploratoria", title: "Como fazer o debrief e explicar o que foi coberto", summary: "Termine a sessão com aprendizado, riscos e próximos passos explícitos.",
        opening: "O fim do timebox não transforma uma exploração em ‘aprovada’. O debrief é a conversa que distingue áreas visitadas, riscos investigados e dúvidas ainda abertas. Isso ajuda o time a decidir se precisa de outra sessão, um teste automatizado ou uma correção.",
        example: "Depois de investigar uma agenda, você pode dizer: ‘validei conflitos na criação e no reagendamento para o mesmo profissional; não verifiquei horários em fusos diferentes; encontrei uma inconsistência ao cancelar dois agendamentos seguidos’. É mais útil que ‘agenda testada’.",
        steps: ["Resuma missão, dados, áreas cobertas e variações tentadas.", "Mostre descobertas com evidência e destaque o que ainda não foi verificado.", "Combine uma ação para cada dúvida importante: investigar, automatizar, corrigir ou aceitar o risco."],
        caution: "Cobertura exploratória é relato do que aconteceu, não porcentagem inventada de todo o produto.",
        exercise: "Escreva um debrief de cinco linhas para uma sessão no Lab de agenda, incluindo ao menos um risco residual."
      }
    ]
  },
  {
    id: "testes-regressao", title: "Testes de regressão", href: "/trilhas/testes-regressao", section: "Fundamentos e investigação", color: "#f1c38f",
    stories: [
      {
        slug: "o-que-retestar-apos-uma-mudanca", title: "Como escolher o que retestar após uma mudança", summary: "Use análise de impacto para construir uma regressão proporcional ao risco.",
        opening: "Uma mudança pequena no código pode atravessar vários comportamentos; uma mudança grande pode ficar isolada. Por isso, regressão não é repetir todos os casos a cada entrega. Primeiro entenda quais regras, dados e integrações foram tocados e onde uma falha causaria maior dano.",
        example: "Se o cálculo de frete mudou, não basta conferir a etiqueta de entrega. Total do pedido, cupom, seleção de endereço e confirmação podem depender do mesmo valor. Já a busca de produtos pode ficar fora dessa rodada se não compartilha a lógica alterada.",
        steps: ["Peça o mapa da mudança: componentes, contratos e dados afetados.", "Trace dependências até os fluxos do usuário e marque impacto e probabilidade.", "Execute primeiro uma verificação curta nos caminhos críticos; amplie se houver sinais de falha."],
        caution: "O escopo deve ser reavaliado quando a execução revelar um efeito inesperado da mudança.",
        exercise: "Escolha uma alteração fictícia no carrinho e desenhe três círculos: comportamento alterado, dependências próximas e áreas fora do escopo."
      },
      {
        slug: "smoke-sanity-regressao-na-pratica", title: "Smoke, sanity e regressão na prática", summary: "Três recortes de teste que respondem a perguntas diferentes.",
        opening: "Os nomes variam entre equipes, mas a decisão prática é simples. Um smoke verifica se os caminhos essenciais permitem continuar. Uma checagem focada após uma correção confirma a área mexida. A regressão procura efeitos colaterais em comportamentos que já funcionavam. Defina o propósito antes de discutir o rótulo.",
        example: "Após implantar uma correção de cupom: primeiro confirme que a Shop abre, permite comprar e gera pedido. Depois exercite o cupom corrigido em suas condições principais. Por fim, confira frete, total e outros descontos que compartilham o cálculo.",
        steps: ["Escreva a pergunta da rodada: sistema utilizável, correção eficaz ou ausência de impacto?", "Selecione poucos cenários que respondam à pergunta com rapidez.", "Registre o resultado e o que ficou para a rodada seguinte."],
        caution: "Chamar qualquer suíte de ‘regressão’ pode esconder que só o caminho feliz foi exercitado.",
        exercise: "Monte três listas de até cinco verificações para uma correção no checkout: smoke, checagem focada e regressão."
      },
      {
        slug: "quando-remover-testes-antigos", title: "Quando remover testes de uma suíte antiga", summary: "Uma suíte útil muda junto com o produto e com os riscos.",
        opening: "Mais testes não significam automaticamente mais confiança. Casos duplicados, regras extintas e verificações sem objetivo aumentam o custo de manutenção e dificultam encontrar o sinal de uma falha real. Remover um teste exige entender qual proteção ele oferecia e quem a assumirá depois.",
        example: "Um teste verifica o mesmo campo obrigatório em cinco telas que usam o mesmo componente. Talvez baste uma verificação detalhada do componente e alguns fluxos integrados. Mas se uma tela adiciona regra própria, ela ainda merece um cenário específico.",
        steps: ["Descubra a regra protegida e se ela continua válida.", "Compare testes repetidos e identifique a camada mais barata que fornece o mesmo sinal.", "Remova ou una casos com justificativa registrada e observe a próxima execução."],
        caution: "Falhar com frequência não é motivo suficiente para apagar um teste; primeiro descubra se a instabilidade revela um problema real.",
        exercise: "Revise uma lista de dez casos e proponha dois que podem ser unidos, um que deve ficar e um que perdeu a função."
      }
    ]
  },
  {
    id: "bug-report", title: "Bug report", href: "/trilhas/bug-report", section: "Fundamentos e investigação", color: "#f0a798",
    stories: [
      {
        slug: "bug-report-reproduzivel", title: "Como escrever um bug report reproduzível", summary: "Um relato que explica o impacto e permite investigar a mesma falha.",
        opening: "Um bom bug report economiza perguntas. Quem o lê deve entender o que falhou, em quais condições, qual resultado era esperado e por que vale agir. O título não precisa dramatizar; precisa distinguir o defeito dos demais. Evidência reforça o relato, mas não substitui os passos.",
        example: "‘Carrinho quebra’ é vago. ‘Total do carrinho ignora o desconto após alterar a quantidade de 1 para 2’ aponta a condição e o efeito. Com dados do item, cupom e ambiente, outra pessoa consegue testar a hipótese.",
        steps: ["Comece pelo efeito sobre usuário ou negócio e dê um título específico.", "Liste pré-condições e os menores passos que reproduzem o comportamento.", "Separe resultado atual, esperado e evidência; repita seus próprios passos antes de enviar."],
        caution: "Se o comportamento esperado ainda não está acordado, registre a dúvida em vez de apresentá-la como defeito confirmado.",
        exercise: "Encontre uma falha em um Lab e escreva um relato que outra pessoa consiga reproduzir sem pedir contexto extra."
      },
      {
        slug: "investigando-bugs-intermitentes", title: "Investigando bugs intermitentes", summary: "Quando a falha não se repete sempre, o contexto vira a principal evidência.",
        opening: "Uma falha que aparece uma vez em dez tentativas continua merecendo atenção, mas exige honestidade. Marcar ‘não reproduzível’ cedo demais faz o time perder pistas; afirmar certeza sem dados também atrapalha. O objetivo inicial é identificar condições que mudam entre sucesso e falha.",
        example: "Um botão de salvar às vezes não persiste a edição. Compare conexão, tempo entre cliques, sessão, resposta da rede e presença de mensagens. Se a falha ocorre só após renovar o login, essa condição vale mais que dez capturas iguais.",
        steps: ["Registre frequência observada e número de tentativas, sem inventar uma taxa global.", "Mude uma variável por vez: dados, ordem das ações, navegador, rede ou sessão.", "Anexe logs e marcas de tempo que permitam correlacionar interface e servidor."],
        caution: "Um vídeo longo pode provar que algo ocorreu, mas ainda não explica sob quais condições ocorre.",
        exercise: "Simule cinco tentativas de um fluxo instável e registre o que mudou em cada uma. Escreva uma hipótese verificável."
      },
      {
        slug: "evidencia-util-em-bug-report", title: "Evidências úteis sem excesso de capturas de tela", summary: "Mostre o que a descrição não consegue mostrar sozinha.",
        opening: "Evidência não é coleção de arquivos. Cada anexo precisa responder a uma pergunta: o estado anterior era qual, o que a ação produziu, houve erro de rede, qual dado foi salvo? Uma captura isolada pode esconder a sequência e um vídeo enorme pode tornar a análise mais lenta.",
        example: "Para um total incorreto, uma captura com itens e valores, outra com o total final e um registro da resposta da API podem ser suficientes. O relatório deve dizer qual parte de cada anexo comprova a diferença.",
        steps: ["Escolha o formato pela falha: imagem para estado, vídeo curto para sequência, log para detalhe técnico.", "Recorte o material sem remover contexto essencial, como horário e ambiente.", "Remova senhas, tokens e dados pessoais antes de compartilhar."],
        caution: "Evidência sensível publicada em um ticket pode ampliar o incidente em vez de ajudar a resolvê-lo.",
        exercise: "Pegue um bug fictício e escolha no máximo três evidências. Justifique a pergunta que cada uma responde."
      }
    ]
  },
  {
    id: "gherkin", title: "Gherkin", href: "/trilhas/gherkin", section: "Fundamentos e investigação", color: "#d9b6e5",
    stories: [
      {
        slug: "bdd-comeca-na-conversa", title: "BDD começa na conversa, antes do Dado/Quando/Então", summary: "Exemplos compartilhados ajudam o time a descobrir regras antes de automatizar.",
        opening: "Gherkin dá forma a exemplos, mas não cria alinhamento sozinho. Se QA escreve cenários depois da implementação e ninguém discute as regras, o arquivo pode estar impecável e ainda documentar a interpretação errada. O ganho vem de conversar sobre comportamentos observáveis antes de construir a solução.",
        example: "Em uma regra de cupom, produto diz ‘não acumula’; desenvolvimento pensa em desconto de frete; QA pensa em desconto por item. Um exemplo com dois cupons e um frete promocional expõe a ambiguidade antes de virar defeito.",
        steps: ["Convide as pessoas que conhecem regra, implementação e risco para uma conversa curta.", "Peça um exemplo que deve funcionar e outro que deve ser rejeitado.", "Escreva o cenário depois de concordar sobre o resultado observável."],
        caution: "Uma frase em Gherkin que repete o requisito não substitui um exemplo com dados e resultado concreto.",
        exercise: "Reúna três interpretações possíveis de uma regra de desconto e escreva um cenário que elimine a dúvida mais perigosa."
      },
      {
        slug: "gherkin-descreve-comportamento", title: "Cenários Gherkin que descrevem comportamento", summary: "Escreva a regra do negócio sem amarrá-la aos cliques de uma tela.",
        opening: "Um cenário é mais legível quando descreve o que uma pessoa pretende fazer e o resultado relevante. ‘Clicar no botão azul’ muda quando a interface muda; ‘confirmar pedido’ permanece ligado ao negócio. Detalhes de UI podem aparecer quando são a própria regra, mas não devem dominar toda a especificação.",
        example: "Dado um carrinho com um item elegível, quando a pessoa aplica um cupom válido, então o total reflete o desconto. Esse cenário comunica a regra melhor que uma sequência de seletores e espera de dois segundos.",
        steps: ["No Dado, coloque só o contexto necessário para a decisão.", "No Quando, descreva uma ação de negócio, de preferência uma por cenário.", "No Então, registre um efeito que possa ser observado e discutido pelo time."],
        caution: "Cenários excessivamente genéricos também falham: ‘então funciona corretamente’ não permite verificar nada.",
        exercise: "Reescreva um roteiro de cliques como comportamento e peça a alguém de produto que explique o resultado sem olhar a interface."
      },
      {
        slug: "scenario-outline-sem-tabelas-enormes", title: "Quando usar Scenario Outline sem criar tabelas enormes", summary: "Parametrize exemplos equivalentes e separe decisões diferentes.",
        opening: "Scenario Outline ajuda quando o mesmo comportamento deve ser verificado com dados variados. Ele atrapalha quando a tabela mistura regras diferentes e cada linha exige uma explicação própria. A pergunta não é ‘posso economizar linhas?’, mas ‘estes exemplos respondem à mesma pergunta?’.",
        example: "Uma tabela com valores 99,99, 100 e 100,01 para o limite de frete faz sentido. Misturar nessa mesma tabela usuário bloqueado, endereço internacional e cupom expirado torna o cenário difícil de ler: são decisões independentes.",
        steps: ["Agrupe exemplos que compartilham contexto, ação e tipo de resultado.", "Dê nomes claros às colunas e use dados que revelam limites ou classes diferentes.", "Separe cenários quando a explicação do resultado mudar de regra."],
        caution: "A tabela é uma ferramenta de leitura. Se alguém precisa decifrar cada linha, a economia de código não compensou.",
        exercise: "Crie um outline de três linhas para um limite de valor e um cenário separado para uma exceção de negócio."
      }
    ]
  }
];
