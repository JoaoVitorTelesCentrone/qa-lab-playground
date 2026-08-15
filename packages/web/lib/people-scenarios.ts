import type { PeopleScenarioCategory } from "./people-scenario-catalog";

export type PeopleScenario = {
  id: string;
  category: PeopleScenarioCategory;
  level: "Iniciante" | "Intermediário" | "Avançado";
  title: string;
  context: string;
  situation: string;
  pressure: string;
  question: string;
  considerations: string[];
  mentorNote: string;
  competencies: string[];
};

export type PeopleAttempt = { scenarioId: string; response: string; createdAt: string };
export type PeopleScenarioFilter = { category?: PeopleScenario["category"]; level?: PeopleScenario["level"] };

export const PEOPLE_ATTEMPTS_KEY = "qa-lab-people-attempts-v1";

export const peopleScenarios: PeopleScenario[] = [
  {
    id: "daily-qa-001",
    category: "Comunicação de bugs e riscos",
    level: "Iniciante",
    title: "Bug importante sem reprodução estável",
    context: "Você está testando uma alteração no fluxo de reembolso no fim da tarde. Em uma tentativa, o saldo do relatório ficou diferente da listagem. Na segunda tentativa, com dados parecidos, o problema não apareceu.",
    situation: "O PO pergunta no chat se pode considerar a história aprovada, porque a review é amanhã cedo. Você tem um print, o horário aproximado, o usuário usado e uma hipótese de que o erro aparece quando há despesa reprovada no período, mas ainda não conseguiu isolar o passo exato. O desenvolvedor responsável está online por mais 20 minutos e quer saber se isso é bloqueador ou só uma observação.",
    pressure: "Se você comunicar como certeza, pode travar a entrega sem evidência suficiente. Se suavizar demais, o time pode publicar uma inconsistência financeira real.",
    question: "Como você comunicaria o achado agora, o que pediria para o time e qual seria seu próximo passo de investigação?",
    considerations: ["Separar fato observado, evidência disponível e hipótese ainda não provada", "Explicar impacto potencial sem inflar a severidade", "Propor uma ação curta: parear, revisar logs/dados ou criar um teste focado antes da decisão de release"],
    mentorNote: "Uma resposta madura não esconde incerteza. Ela deixa claro o que foi visto, por que importa, o que falta confirmar e qual é o menor próximo passo para transformar suspeita em decisão.",
    competencies: ["Comunicação de risco", "Investigação", "Evidência"],
  },
  {
    id: "daily-qa-002",
    category: "Conflitos com desenvolvimento",
    level: "Intermediário",
    title: "O dev respondeu: 'isso não é bug'",
    context: "Durante a validação de uma história, você abre um defeito porque o sistema permite que um gestor aprove a própria despesa. O desenvolvedor responde no ticket que o backend não bloqueia isso porque a regra não estava explícita no card.",
    situation: "O PO está em outra reunião, a sprint termina hoje e o desenvolvedor pede para fechar o bug como 'comportamento esperado'. Você lembra que no refinamento foi comentado que aprovação própria não faria sentido, mas isso não ficou escrito no critério de aceite. A regra tem impacto de auditoria e pode virar problema para clientes corporativos.",
    pressure: "A conversa pode virar uma disputa sobre quem deveria ter documentado a regra. Ao mesmo tempo, aceitar o comportamento sem decisão formal cria risco de negócio.",
    question: "Como você conduziria a conversa sem personalizar o problema e sem deixar a regra passar informalmente?",
    considerations: ["Voltar para o comportamento e para o risco, não para culpa ou memória da reunião", "Pedir decisão explícita de Produto sobre a regra de negócio", "Sugerir atualizar critério de aceite e caso de regressão depois da decisão"],
    mentorNote: "Quando requisito e implementação divergem, QA ajuda transformando ambiguidade em decisão registrada. O foco não é provar quem está certo, é impedir que uma regra crítica fique implícita.",
    competencies: ["Gestão de conflito", "Requisitos", "Colaboração"],
  },
  {
    id: "daily-qa-003",
    category: "Prazos, releases e negociação",
    level: "Avançado",
    title: "Release com regressão conhecida",
    context: "O time quer liberar uma versão que corrige um bug crítico de login, mas sua regressão encontrou uma falha no filtro de relatórios. O problema não impede todos os usuários, mas afeta gestores que fecham prestação de contas no fim do mês.",
    situation: "A liderança pergunta se 'dá para subir mesmo assim'. O suporte informa que há clientes aguardando a correção do login. Produto argumenta que o filtro pode ser corrigido amanhã. Você sabe que não existe feature flag para desligar só a parte afetada e que o rollback reabriria o problema de login.",
    pressure: "Não existe opção perfeita: segurar o release mantém um bug crítico vivo; publicar leva uma regressão conhecida para produção.",
    question: "Que recomendação você daria e como documentaria o risco residual?",
    considerations: ["Comparar impacto dos dois riscos com usuários afetados, frequência e alternativa disponível", "Propor mitigação concreta: comunicação, monitoramento, hotfix, suporte orientado ou limitação temporária", "Registrar quem aceita o risco e qual sinal fará o time reavaliar a decisão"],
    mentorNote: "QA não precisa 'autorizar' ou 'proibir' sozinho. O papel é tornar o trade-off visível, sugerir mitigação e garantir que a decisão seja consciente e rastreável.",
    competencies: ["Decisão de release", "Análise de risco", "Negociação"],
  },
  {
    id: "daily-qa-004",
    category: "Produto, requisitos e escopo",
    level: "Intermediário",
    title: "Critério de aceite bonito, mas impossível de testar",
    context: "No refinamento, aparece um critério dizendo: 'o sistema deve ser rápido e intuitivo para todos os usuários'. O time quer estimar a história e seguir.",
    situation: "Você percebe que ninguém definiu tempo aceitável, público afetado, métrica de usabilidade, dispositivos suportados ou cenário principal. Quando você pergunta, alguém responde que 'é só bom senso' e que detalhar demais vai travar a sprint. Mesmo assim, a mesma área já gerou reclamações de performance antes.",
    pressure: "Se você insistir demais, pode parecer burocracia. Se deixar passar, a validação vira opinião e o aceite fica frágil.",
    question: "Como você transformaria esse critério em algo verificável sem alongar demais a reunião?",
    considerations: ["Propor 2 ou 3 exemplos objetivos em vez de uma discussão aberta infinita", "Separar métrica mínima de aceite e observações desejáveis", "Registrar perguntas que bloqueiam teste e decisões que podem ficar para descoberta"],
    mentorNote: "O bom QA não pede detalhe por formalidade. Pede detalhe quando a falta dele impede uma decisão verificável ou esconde risco relevante.",
    competencies: ["Análise de requisitos", "Facilitação", "Pensamento crítico"],
  },
  {
    id: "daily-qa-005",
    category: "CI/CD e confiabilidade do pipeline",
    level: "Intermediário",
    title: "Pipeline vermelho virou paisagem",
    context: "Nos últimos dias, a suíte automatizada falhou várias vezes por timeout e dados instáveis. O time começou a ignorar o alerta e fazer merge depois de rodar só testes locais.",
    situation: "Hoje, uma falha real passou porque o teste que pegaria o problema estava marcado como flaky. Na daily, o gerente pergunta por que QA não avisou antes. O desenvolvedor diz que 'todo mundo sabia que esse pipeline não prestava'. Você precisa ajudar o time a sair da normalização do desvio.",
    pressure: "Apontar o problema de forma dura pode soar acusatório, mas tratar como detalhe técnico mantém uma falha sistêmica no fluxo de entrega.",
    question: "Como você proporia recuperar confiança no pipeline sem transformar a conversa em caça aos culpados?",
    considerations: ["Mostrar custo e frequência do problema com exemplos concretos", "Separar contenção imediata de correção estrutural", "Definir dono, prazo e indicador: taxa de flaky, tempo de execução, bloqueio de merge ou quarentena formal"],
    mentorNote: "Pipeline instável é problema de produto interno. Quando o sinal perde credibilidade, o time deixa de tomar decisões baseadas em evidência.",
    competencies: ["CI/CD", "Confiabilidade", "Melhoria de processo"],
  },
  {
    id: "daily-qa-006",
    category: "Feedback e liderança",
    level: "Iniciante",
    title: "Bug report que ninguém consegue reproduzir",
    context: "Uma pessoa nova no QA abriu três bugs na semana, mas todos vieram com passos vagos, sem massa de dados e sem ambiente. O time de desenvolvimento começou a reclamar no canal público.",
    situation: "Você revisou os tickets e concorda que faltam informações, mas também percebe que a pessoa está tentando contribuir e ainda não conhece o padrão esperado. O time de desenvolvimento já começou a responder com impaciência nos comentários, e seu líder está ocupado e pede para você 'dar um toque nela' antes que isso vire atrito maior.",
    pressure: "Você precisa corrigir o padrão sem constranger a pessoa e sem reforçar a ideia de que QA júnior atrapalha.",
    question: "Como você daria esse feedback e que apoio prático ofereceria?",
    considerations: ["Usar exemplos específicos dos tickets, sem julgamento pessoal", "Explicar impacto da falta de dados para reprodução e tempo do time", "Oferecer template, revisão em par ou checklist antes dos próximos reports"],
    mentorNote: "Feedback bom protege a relação e aumenta o padrão. Ele mostra o comportamento, o impacto e o caminho de melhoria.",
    competencies: ["Feedback", "Mentoria", "Comunicação"],
  },
  {
    id: "daily-qa-007",
    category: "Incidentes e crise",
    level: "Avançado",
    title: "Produção caiu depois de uma validação apressada",
    context: "Uma alteração emergencial foi validada em ambiente de homologação com dados limitados. Duas horas após o deploy, clientes começam a reportar erro ao finalizar pedidos.",
    situation: "No canal de incidente, alguém escreve: 'isso passou pelo QA?'. Você participou da validação, mas sabe que o escopo testado foi reduzido por decisão do time para liberar rápido. Ainda não há causa raiz confirmada e o suporte pede uma mensagem para clientes.",
    pressure: "A conversa pode virar defesa pessoal. Ao mesmo tempo, o incidente precisa de contenção, fatos e próximos passos.",
    question: "Como você responderia no canal e que postura tomaria durante a investigação?",
    considerations: ["Evitar defesa ou culpa antes de restaurar o serviço e confirmar fatos", "Declarar o que foi validado, o que não foi coberto e por quê", "Ajudar a preservar evidências e depois puxar aprendizado sobre processo de emergência"],
    mentorNote: "Em crise, maturidade é trocar autoproteção por clareza operacional. Responsabilidade não é assumir culpa no escuro; é ajudar o time a entender e corrigir o sistema.",
    competencies: ["Resposta a incidentes", "Comunicação sob pressão", "Cultura sem culpa"],
  },
  {
    id: "daily-qa-008",
    category: "Ética, privacidade e dados",
    level: "Avançado",
    title: "Teste com dados reais de cliente",
    context: "Para reproduzir um bug difícil, alguém sugere copiar dados reais de produção para homologação. A prática já aconteceu antes, mas nunca foi formalizada.",
    situation: "O bug afeta cálculo de limite de crédito e só aparece em perfis muito específicos. O time está cansado de tentar simular massa. Um desenvolvedor diz que vai mascarar 'depois', porque primeiro precisa descobrir a causa. Você percebe que a base contém CPF, e-mail e histórico financeiro.",
    pressure: "A solução mais rápida pode expor dados sensíveis. Bloquear sem alternativa pode atrasar uma correção importante.",
    question: "Como você impediria o risco sem simplesmente travar a investigação?",
    considerations: ["Nomear claramente o risco de privacidade e compliance", "Propor alternativas: massa sintética, recorte anonimizado antes da cópia, ambiente controlado ou apoio de dados/security", "Registrar decisão e impedir ações irreversíveis sem autorização"],
    mentorNote: "QA também protege pessoas. Dados reais não viram ferramenta de debug só porque o bug é urgente.",
    competencies: ["Privacidade", "Ética", "Gestão de risco"],
  },
  {
    id: "daily-qa-009",
    category: "Acessibilidade e inclusão",
    level: "Intermediário",
    title: "A correção visual que quebrou teclado",
    context: "Uma melhoria visual deixou o modal de aprovação mais bonito, mas durante o teste você percebe que não consegue fechar nem navegar corretamente usando apenas teclado.",
    situation: "O designer diz que o público principal usa mouse e que isso pode ficar para uma melhoria futura. O PO está preocupado com prazo e pergunta se isso precisa mesmo bloquear a entrega. Você sabe que parte dos clientes usa notebooks em campo, que alguns usuários operam sistemas internos quase só por teclado e que acessibilidade também melhora robustez geral da interface.",
    pressure: "A falha não parece tão visível quanto um erro funcional, mas pode bloquear usuários e gerar risco contratual em contas maiores.",
    question: "Como você defenderia a correção dentro do escopo atual?",
    considerations: ["Descrever a barreira de uso em termos práticos, não apenas como regra abstrata", "Mostrar o fluxo bloqueado e quem pode ser afetado", "Propor critério mínimo: foco visível, navegação por Tab/Esc e leitura correta do estado"],
    mentorNote: "Acessibilidade não é acabamento. Quando uma pessoa não consegue concluir uma tarefa, é qualidade funcional.",
    competencies: ["Acessibilidade", "Influência", "Critérios de aceite"],
  },
  {
    id: "daily-qa-010",
    category: "Inteligência artificial e uso responsável",
    level: "Intermediário",
    title: "IA gerou casos convincentes, mas errados",
    context: "O time começou a usar IA para acelerar criação de casos de teste. A lista gerada parece completa, mas você nota cenários que contradizem regras do produto.",
    situation: "Na planning, alguém sugere anexar a saída da IA direto na história para ganhar tempo e usar aquilo como base da regressão. Alguns casos falam de permissões que não existem, outros ignoram uma regra fiscal importante e dois cenários parecem plausíveis, mas contradizem o comportamento atual do produto. A equipe está animada porque a IA reduziu bastante o trabalho manual.",
    pressure: "Criticar a saída pode soar resistência à ferramenta. Aceitar sem revisão cria falsa cobertura.",
    question: "Como você usaria a IA de forma produtiva sem deixar ela virar fonte de verdade?",
    considerations: ["Tratar a IA como geradora de hipóteses, não como autoridade", "Validar casos contra requisitos, dados reais e riscos do domínio", "Definir regra de uso: revisão humana, rastreabilidade e proteção de dados"],
    mentorNote: "Velocidade sem verificação aumenta ruído. IA ajuda QA quando amplia perguntas boas, não quando substitui entendimento do produto.",
    competencies: ["IA responsável", "Pensamento crítico", "Governança"],
  },
  {
    id: "daily-qa-011",
    category: "Automação e estratégia técnica",
    level: "Intermediário",
    title: "Automatizar tudo virou meta da liderança",
    context: "A liderança definiu como meta do trimestre 'automatizar 100% dos testes' e passou a cobrar cobertura alta de testes de interface como prova de qualidade.",
    situation: "Você percebe que boa parte da suíte de ponta a ponta é lenta, instável e duplica verificações que poderiam viver em camadas mais baratas. A meta de '100% automatizado' está empurrando o time a criar testes de tela para regras que um teste de unidade cobriria em segundos, e o tempo de pipeline já dobrou. Na próxima reunião de planejamento, alguém vai apresentar o número de cenários automatizados como prova de qualidade, e você sabe que esse número esconde fragilidade e custo de manutenção crescente.",
    pressure: "Questionar a meta pode soar como resistência à automação. Aceitá-la sem crítica cria uma suíte cara que ninguém confia.",
    question: "Como você redirecionaria a estratégia de automação sem parecer contra a meta da liderança?",
    considerations: ["Trocar a métrica de quantidade de testes por confiança, custo e velocidade de feedback", "Mostrar a pirâmide: o que pertence a unidade, integração e UI e por quê", "Propor um critério do que automatizar primeiro com base em risco e estabilidade"],
    mentorNote: "Automação é meio, não troféu. Cobertura alta na camada errada compra lentidão e falsa segurança; estratégia boa coloca cada verificação no nível mais barato que ainda protege o risco.",
    competencies: ["Estratégia de testes", "Automação", "Comunicação técnica"],
  },
  {
    id: "daily-qa-012",
    category: "Cultura de segurança",
    level: "Intermediário",
    title: "O endpoint que devolve mais do que deveria",
    context: "Testando a tela de perfil, você abre as ferramentas de desenvolvedor e percebe que a API de usuário devolve, além do nome e e-mail mostrados na tela, o CPF e o telefone de outros usuários no mesmo retorno.",
    situation: "A informação não aparece na interface, mas trafega aberta para qualquer pessoa que olhe a resposta da requisição. O time está focado em entregar a tela nova e ninguém tratou isso como problema porque 'na tela não mostra'. O desenvolvedor sugere abrir um card de melhoria para o próximo trimestre. Você sabe que isso é exposição de dado pessoal e que não é difícil alguém de fora perceber o mesmo que você percebeu em segundos.",
    pressure: "Tratar como bug comum subestima o risco. Soar alarmista demais pode travar a entrega e gerar atrito com quem priorizou a tela.",
    question: "Como você classificaria e encaminharia esse achado para que ele seja tratado com a urgência certa?",
    considerations: ["Descrever o risco em termos de exposição e impacto, não só como detalhe técnico", "Separar correção imediata, parar de vazar o dado, de melhoria futura", "Envolver quem decide sobre privacidade e segurança e registrar a decisão"],
    mentorNote: "Segurança costuma falhar pelo que não aparece na tela. Quem testa é muitas vezes a primeira pessoa a ver o vazamento; transformar isso em prioridade clara é parte do trabalho.",
    competencies: ["Cultura de segurança", "Privacidade", "Comunicação de risco"],
  },
  {
    id: "daily-qa-013",
    category: "Fornecedores, integrações e dependências",
    level: "Avançado",
    title: "A falha mora no parceiro, a culpa chega em você",
    context: "O fluxo de pagamento depende de um gateway externo. Nos últimos dias, alguns pagamentos ficam presos em 'processando' e só resolvem horas depois. Os logs do seu sistema mostram que a chamada ao parceiro às vezes não responde no tempo esperado.",
    situation: "O suporte está recebendo reclamações de clientes, a liderança quer uma resposta agora e o desenvolvimento diz que 'o problema é do parceiro, não tem o que fazer'. Você não tem acesso à infraestrutura do fornecedor, o contrato não deixa claro o tempo de resposta acordado, e o seu sistema não trata bem o caso de o parceiro demorar. A pergunta que chega até você é direta: isso é bug nosso ou deles?",
    pressure: "Empurrar a culpa para o fornecedor encerra a conversa sem proteger o cliente. Assumir como bug interno sem evidência distorce a causa real.",
    question: "Como você conduziria a investigação e o que recomendaria mesmo sem controlar o sistema do parceiro?",
    considerations: ["Separar a causa, instabilidade do parceiro, do nosso comportamento diante dela", "Reunir evidência: tempos de resposta, taxa de falha, janelas e correlação", "Propor resiliência do nosso lado: timeout, retry, estado claro ao usuário e acionamento contratual do fornecedor"],
    mentorNote: "Depender de terceiros não terceiriza a responsabilidade pela experiência. Mesmo quando a causa é externa, o sistema precisa falhar de forma previsível e o cliente precisa de uma resposta honesta.",
    competencies: ["Integrações", "Análise de causa", "Resiliência"],
  },
  {
    id: "daily-qa-014",
    category: "Gestão da qualidade e métricas",
    level: "Intermediário",
    title: "O número de bugs encontrados virou meta",
    context: "A gestão começou a acompanhar a quantidade de bugs que o QA encontra por sprint e a usar isso como indicador de produtividade da área.",
    situation: "Em uma sprint, o time entregou um trabalho mais maduro e você encontrou poucos defeitos. Na revisão de métricas, alguém interpreta o número baixo como QA 'produzindo menos' e sugere cobrar mais bugs. Ao mesmo tempo, você percebe colegas tentados a abrir defeitos triviais só para engordar o número. Você sabe que encontrar muitos bugs tarde é pior do que prevenir cedo, mas a métrica atual premia exatamente o contrário.",
    pressure: "Defender-se direto pode soar como desculpa. Aceitar a métrica incentiva comportamento que piora a qualidade real.",
    question: "Como você reposicionaria a conversa sobre métricas sem parecer que está fugindo da cobrança?",
    considerations: ["Mostrar o que a métrica de quantidade de bugs incentiva e o que ela esconde", "Propor indicadores ligados a resultado: defeitos que chegam ao cliente, retrabalho, tempo de feedback", "Reforçar o valor da prevenção, que reduz justamente os bugs encontrados tarde"],
    mentorNote: "Métrica de vaidade mede movimento, não valor. Contar bugs encontrados premia o conserto tardio; boa gestão de qualidade olha para o que escapa e para o que foi evitado.",
    competencies: ["Gestão da qualidade", "Métricas", "Influência"],
  },
  {
    id: "daily-qa-015",
    category: "Mentoria, carreira e aprendizagem",
    level: "Iniciante",
    title: "Você não sabe e perguntaram na frente de todo mundo",
    context: "Você entrou há pouco tempo no time. Numa reunião com Produto e desenvolvimento, alguém pergunta diretamente a você se um fluxo foi testado e qual o comportamento esperado de uma regra que você ainda não conhece bem.",
    situation: "Todos estão olhando para você e há uma pressão implícita de dar uma resposta firme para parecer competente. Você tem uma ideia parcial, mas não tem certeza, e sabe que afirmar algo errado pode levar o time a uma decisão equivocada. Ao mesmo tempo, dizer apenas 'não sei' não ajuda a reunião a avançar e mexe com a sua insegurança de pessoa nova no time.",
    pressure: "Fingir certeza protege seu ego, mas arrisca a decisão. Travar em 'não sei' pode reforçar a sensação de que você ainda não contribui.",
    question: "Como você responderia de forma honesta e ainda assim útil para a reunião?",
    considerations: ["Separar com clareza o que você sabe do que precisa confirmar", "Assumir a dúvida com um próximo passo concreto e um prazo", "Pedir a informação que falta a quem domina a regra, sem se diminuir"],
    mentorNote: "Maturidade no começo de carreira não é saber tudo, é lidar bem com o que ainda não se sabe. Um 'vou confirmar e te respondo até X' vale mais que um palpite confiante e errado.",
    competencies: ["Aprendizagem", "Honestidade intelectual", "Comunicação"],
  },
  {
    id: "daily-qa-016",
    category: "Performance, confiabilidade e operações",
    level: "Avançado",
    title: "Rápido no teste, lento com gente de verdade",
    context: "A nova listagem de despesas passou em todos os testes funcionais e está aprovada. Em homologação, com poucos registros, tudo responde de forma instantânea.",
    situation: "Você desconfia e cria um cenário com volume parecido com o de um cliente grande: milhares de despesas e vários filtros aplicados ao mesmo tempo. A tela passa a demorar vários segundos e, em alguns casos, expira. Produto argumenta que 'a maioria dos clientes não tem esse volume' e quer liberar assim mesmo, deixando otimização para depois. Você sabe que justamente os clientes grandes são os mais importantes e os que mais usam relatórios no fim do mês.",
    pressure: "Bloquear pode ser visto como exagero diante de um cenário 'raro'. Liberar pode degradar a experiência exatamente dos clientes que mais pesam.",
    question: "Como você defenderia tratar a performance agora e o que proporia para a decisão?",
    considerations: ["Mostrar o problema com dados realistas, não com a base pequena de homologação", "Mapear quem é afetado e com que frequência, ligando volume a clientes reais", "Propor alternativa: limite, paginação, índice, monitoramento ou critério de aceite de performance"],
    mentorNote: "Performance que só existe em ambiente vazio é ilusão. Confiabilidade se prova sob carga parecida com a real, e o cenário 'raro' costuma ser justamente o cliente que mais importa.",
    competencies: ["Performance", "Análise de risco", "Operações"],
  },
  {
    id: "daily-qa-017",
    category: "Política organizacional e influência",
    level: "Avançado",
    title: "Qualidade vira slogan na parede",
    context: "A diretoria lançou a frase 'qualidade é responsabilidade de todos' em uma reunião geral, mas na prática nada mudou: prazos seguem apertados, testes continuam espremidos no fim e ninguém é cobrado por qualidade fora do QA.",
    situation: "Você é chamado para 'ajudar a fortalecer a cultura de qualidade', mas sem mandato, sem mudança de processo e sem apoio para dizer não a entregas apressadas. Há o risco de você virar o rosto de uma iniciativa vazia: se der errado, a culpa cai em QA; se você apenas reclamar, é visto como negativo. Você precisa transformar um slogan em comportamento real sem ter autoridade formal para isso.",
    pressure: "Abraçar a missão sem poder real pode te transformar em bode expiatório. Recusá-la deixa a cultura como discurso vazio.",
    question: "Como você transformaria esse slogan em comportamentos observáveis a partir da influência que você tem?",
    considerations: ["Traduzir 'qualidade de todos' em práticas concretas e donos claros", "Buscar um patrocínio com poder de decisão e fechar acordos pequenos e verificáveis", "Tornar resultados visíveis com narrativa, ligando prevenção a impacto de negócio"],
    mentorNote: "Cultura não muda por frase, muda por comportamento que tem dono, exemplo e consequência. Sem mandato, a alavanca do QA é influência: começar pequeno, mostrar resultado e construir patrocínio.",
    competencies: ["Influência", "Política organizacional", "Liderança sem autoridade"],
  },
  {
    id: "daily-qa-018",
    category: "Priorização e estimativa",
    level: "Intermediário",
    title: "Tempo de teste pela metade",
    context: "A história entrou maior do que o previsto e o desenvolvimento consumiu quase toda a sprint. Sobrou um dia para testar algo que envolve cálculo financeiro, integração com outro módulo e mudança em uma regra existente.",
    situation: "O PO pede para você 'dar uma olhada rápida' e aprovar para fechar a sprint no prazo. Não dá tempo de cobrir tudo com profundidade. Você precisa decidir o que testar primeiro, o que aceitar com risco consciente e o que deixar de fora, sabendo que um erro no cálculo financeiro tem impacto grande e que a regra alterada pode ter quebrado comportamento antigo sem ninguém perceber.",
    pressure: "Tentar testar tudo superficialmente espalha o esforço e não protege nada. Recusar testar sem priorizar trava a entrega.",
    question: "Como você priorizaria o pouco tempo disponível e comunicaria o risco do que não será coberto?",
    considerations: ["Ordenar por risco e impacto: cálculo financeiro e regressão da regra antes do resto", "Tornar explícito o que ficou de fora e o risco residual assumido", "Negociar com fatos: o que dá para cobrir bem em um dia e o que precisaria de mais"],
    mentorNote: "Sob tempo curto, qualidade é escolha consciente, não cobertura uniforme. O valor do QA aparece em priorizar pelo risco e deixar visível o que ficou descoberto.",
    competencies: ["Priorização", "Análise de risco", "Negociação"],
  },
  {
    id: "daily-qa-019",
    category: "Trabalho ágil e cerimônias",
    level: "Iniciante",
    title: "A daily virou relatório para o gestor",
    context: "Na sua daily, cada pessoa fala olhando para o gestor, listando tarefas concluídas como prestação de contas. Bloqueios quase não aparecem e a reunião não ajuda o time a se coordenar.",
    situation: "Você tem um impedimento real: está esperando uma definição de regra para terminar um teste e isso já parou seu trabalho há um dia. Mas ninguém costuma levantar bloqueios ali, e você teme parecer que está 'enrolando' ou expor um colega que deveria ter respondido. A daily termina, todo mundo volta para o trabalho e o seu impedimento continua sem solução, atrasando a entrega em silêncio.",
    pressure: "Ficar quieto preserva a aparência, mas mantém você travado. Levantar o bloqueio pode soar como reclamação ou cobrança a alguém.",
    question: "Como você usaria a daily para destravar seu trabalho sem transformar o momento em cobrança pessoal?",
    considerations: ["Trazer o impedimento focado no trabalho parado, não na pessoa", "Pedir uma ação concreta com responsável e prazo logo após a reunião", "Ajudar a recolocar a daily como coordenação do time, não relatório para o gestor"],
    mentorNote: "A daily existe para o time se coordenar, não para impressionar quem lidera. Levantar bloqueio cedo, sem culpa, é o comportamento que mantém o fluxo saudável.",
    competencies: ["Trabalho ágil", "Comunicação", "Colaboração"],
  },
  {
    id: "daily-qa-020",
    category: "Trabalho remoto e diversidade cultural",
    level: "Intermediário",
    title: "O silêncio no chat que não era concordância",
    context: "Seu time é distribuído entre fusos e culturas diferentes. Você abriu uma decisão de teste em texto no canal: propôs uma abordagem e pediu opiniões. Alguns reagiram com emoji, ninguém discordou abertamente e você seguiu em frente.",
    situation: "Dias depois, você descobre que duas pessoas tinham preocupações sérias com a abordagem, mas não se sentiram à vontade de contestar publicamente um colega no chat, em parte por diferença de fuso, em parte por uma cultura em que discordar em público soa rude. O trabalho avançou na direção errada e agora exige retrabalho. Você percebe que 'ninguém discordou' não significava acordo, significava apenas silêncio.",
    pressure: "Insistir que 'estava tudo no chat, era só falar' ignora barreiras reais. Refazer tudo sozinho não corrige o padrão de comunicação.",
    question: "Como você ajustaria a forma de tomar decisões em um time remoto e diverso para que o silêncio não seja confundido com acordo?",
    considerations: ["Não tratar ausência de objeção como concordância, especialmente entre fusos e culturas", "Criar formas seguras e assíncronas de discordar, inclusive em privado", "Dar tempo e contexto para que todos consigam responder antes de fechar a decisão"],
    mentorNote: "Em time remoto e diverso, comunicação precisa ser desenhada, não presumida. Concordância de verdade exige espaço seguro e tempo; silêncio costuma ser barreira, não acordo.",
    competencies: ["Comunicação assíncrona", "Diversidade cultural", "Colaboração remota"],
  },
];

export function getDailyPeopleScenario(date = new Date()) {
  const start = Date.UTC(2026, 0, 1);
  const today = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const dayIndex = Math.floor((today - start) / 86_400_000);
  const index = ((dayIndex % peopleScenarios.length) + peopleScenarios.length) % peopleScenarios.length;
  return peopleScenarios[index];
}

export function nextPeopleScenario(currentId: string | null, seenIds: string[], random = Math.random, filter: PeopleScenarioFilter = {}) {
  const pool = peopleScenarios.filter((item) => (!filter.category || item.category === filter.category) && (!filter.level || item.level === filter.level));
  const available = pool.length ? pool : peopleScenarios;
  const unseen = available.filter((item) => item.id !== currentId && !seenIds.includes(item.id));
  const candidates = unseen.length ? unseen : available.filter((item) => item.id !== currentId);
  return candidates[Math.floor(random() * candidates.length)] ?? peopleScenarios[0];
}

export function parsePeopleAttempts(value: string | null): PeopleAttempt[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item?.scenarioId === "string" && typeof item?.response === "string" && typeof item?.createdAt === "string") : [];
  } catch { return []; }
}
