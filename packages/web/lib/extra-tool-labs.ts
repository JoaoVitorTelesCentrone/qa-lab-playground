import type { QaToolLabSpec } from "./qa-tool-labs";
import type { QaToolId } from "./qa-tools";

type Row = [number, string, string, string, string, string, string];
function create(toolId: QaToolId, rows: Row[]): QaToolLabSpec[] {
  return rows.map(([number, title, objective, starter, action, observation, expected]) => ({
    number, toolId, title, objective, starter, expected,
    steps: [action, observation, "Registre requisição ou configuração, resultado e conclusão no Lab."],
    acceptance: ["Condição de execução reproduzível", `Evidência: ${observation}`, `Conclusão: ${expected}`],
  }));
}

export const extraToolLabSpecs: QaToolLabSpec[] = [
  ...create("http", [
    [441, "Leia uma coleção de pedidos", "Examine estrutura, status e cabeçalhos de uma listagem.", "list", "Envie GET /orders com token válido.", "Compare total declarado com itens retornados.", "Listagem 200 coerente e identificador de requisição registrado."],
    [442, "Reprove acesso sem credencial", "Confirme a barreira de autenticação antes de ver dados de pedidos.", "unauthorized", "Envie GET /orders sem token.", "Compare 401 e corpo com a resposta autorizada.", "Nenhum pedido exposto sem credencial."],
    [443, "Diferencie recurso ausente", "Separe 404 de falha de autenticação e de rota inválida.", "missing", "Consulte um ID inexistente com token válido.", "Leia o código de erro e contraste com GET /orders/ord_1042.", "404 indica pedido ausente com autenticação válida."],
    [444, "Valide o corpo da criação", "Encontre a rejeição de quantidade fora da regra.", "invalid", "Envie POST /orders com quantidade zero e depois positiva.", "Compare 422 com 201 e seus corpos.", "A criação só aceita produto preenchido e quantidade inteira positiva."],
    [445, "Investigue idempotência", "Compare a primeira criação com o replay da mesma chave.", "replay", "Envie POST duas vezes com used-key; depois use new-key.", "Compare IDs, status e sinal replay.", "Repetir a chave não cria outro pedido na simulação."],
    [446, "Reprove transição via API", "Confira o conflito ao tentar entregar pedido pendente diretamente.", "conflict", "Envie PATCH /orders/ord_1042.", "Leia status 409 e o código de erro.", "A API recusa a transição fora do fluxo."],
  ]),
  ...create("carga", [
    [447, "Estabeleça uma linha de base", "Meça latência e erros em carga baixa.", "normal", "Execute 20 usuários por 30 segundos.", "Registre p50, p95, vazão e erros.", "Linha de base atende às duas metas declaradas."],
    [448, "Encontre o ponto de saturação", "Aumente usuários até o p95 ultrapassar a meta.", "normal", "Repita o perfil normal com 20, 70 e 120 usuários.", "Compare p95 e vazão entre execuções.", "O ponto de degradação tem configuração e métrica reproduzíveis."],
    [449, "Avalie dependência degradada", "Isole o efeito de uma dependência mais lenta com a mesma carga.", "degraded", "Compare normal e dependência degradada com 60 usuários.", "Observe p95 e taxa de erro sem alterar a duração.", "A hipótese de dependência usa diferença de métricas sob condições iguais."],
    [450, "Simule um pico repentino", "Confira o impacto de 120 usuários no perfil de pico.", "spike", "Execute o perfil de pico e reduza a carga pela metade.", "Observe a mudança em erros e vazão.", "A recuperação ou persistência da violação está demonstrada."],
    [451, "Decida o gate de performance", "Use p95 e erros juntos para uma decisão de release.", "degraded", "Execute ao menos dois perfis com a mesma duração.", "Compare cada métrica às metas de 300 ms e 1%.", "A decisão cita o perfil e todas as metas violadas."],
  ]),
  ...create("acessibilidade", [
    [452, "Encontre o campo sem rótulo", "Inspecione a relação entre texto visível e nome do campo.", "label", "Preencha o e-mail e execute a inspeção.", "Compare a variante com rótulo e a sem rótulo.", "O campo tem nome acessível associado antes da liberação."],
    [453, "Siga o foco pelo teclado", "Observe se o botão mostra foco ao percorrer o formulário.", "focus", "Use Simular Tab e foque o botão real pelo teclado.", "Compare indicação visual e sequência de foco.", "O foco no controle acionável é visível."],
    [454, "Investigue baixo contraste", "Detecte a perda de leitura do texto de ajuda.", "contrast", "Compare a variante de contraste com a limpa.", "Identifique o texto afetado e a condição de leitura.", "Texto essencial deve permanecer legível na tarefa."],
    [455, "Confira anúncio de erro", "Avalie o feedback quando o e-mail é inválido.", "feedback", "Clique Continuar com campo vazio.", "Compare a mensagem visual com a variante que usa role alert.", "O erro precisa ser anunciado além de aparecer visualmente."],
    [456, "Revise o formulário sem defeitos", "Use uma referência limpa para evitar falso positivo.", "clean", "Preencha e inspecione a variante limpa.", "Compare as quatro checagens com as variantes defeituosas.", "A conclusão distingue ausência de falha plantada de cobertura total."],
  ]),
  ...create("seguranca", [
    [457, "Reprove entrada de busca suspeita", "Compare uma busca comum com uma entrada de injeção sintética.", "injection", "Execute a sonda com termo comum e com ' OR 1=1 --.", "Compare status e evidência de validação.", "Entrada suspeita é recusada sem executar comando."],
    [458, "Inspecione texto hostil", "Confirme que marcação recebida é exibida como texto.", "xss", "Envie uma string com tags na sonda de texto.", "Compare entrada e saída escapada.", "A marcação não vira código executável."],
    [459, "Teste acesso entre usuários", "Compare dono e outro usuário no mesmo pedido.", "idor", "Execute o recurso como user_108 e user_221.", "Compare 200, 403 e owner informado.", "A autorização depende do dono do pedido."],
    [460, "Encontre o limite de tentativas", "Observe a fronteira entre aceitação e bloqueio por taxa.", "rate", "Execute cinco e depois seis tentativas na janela.", "Compare status e retry-after.", "Acima de cinco tentativas a resposta é 429."],
    [461, "Estabeleça resposta normal", "Use uma requisição sem ataque como controle para a triagem.", "normal", "Execute o controle e depois uma sonda de risco.", "Compare códigos e evidências sem inferir vulnerabilidade pela rejeição.", "O controle válido funciona e a defesa específica pode ser avaliada."],
  ]),
  ...create("massa", [
    [462, "Gere dados reproduzíveis", "Comprove que seed e parâmetros fixos repetem a mesma massa.", "valid", "Gere duas vezes com seed 42 e quatro registros.", "Compare IDs, e-mails e idades.", "A mesma configuração gera a mesma saída."],
    [463, "Explore limites de idade", "Cubra abaixo, dentro e acima da faixa aceita.", "boundary", "Gere a massa de limites.", "Classifique 17, 18, 120 e 121 pela regra.", "Somente 18 e 120 passam o limite inclusivo."],
    [464, "Detecte e-mail inválido", "Inclua um registro sem formato de e-mail.", "invalid-email", "Gere a variante de e-mail inválido.", "Localize o ID e a regra que falhou.", "O validador identifica a linha exata."],
    [465, "Ache identidade duplicada", "Verifique unicidade de e-mail entre registros.", "duplicate", "Gere ao menos dois registros duplicados.", "Compare e-mails e IDs nas linhas.", "O segundo uso do e-mail é apontado."],
    [466, "Separe ausência de invalidez", "Observe campos ausentes em vez de apenas formato incorreto.", "missing", "Gere a variante com campo ausente.", "Compare avisos de e-mail e idade com o caso inválido.", "Ausência é descrita separadamente da regra de formato."],
  ]),
  ...create("estados", [
    [467, "Percorra o caminho válido", "Monte o ciclo completo de um pedido.", "created", "Acione Pagar, Despachar e Entregar.", "Confira estado e histórico após cada ação.", "O histórico preserva a sequência created → delivered."],
    [468, "Reprove salto de etapa", "Tente entregar antes de pagar e despachar.", "created", "Acione Entregar imediatamente.", "Compare mensagem e estado antes e depois.", "A transição inválida não muda o pedido."],
    [469, "Teste cancelamento permitido", "Confirme a regra de cancelamento antes do pagamento.", "created", "Acione Cancelar e depois Pagar.", "Observe o estado terminal e a rejeição seguinte.", "Pedido cancelado não volta ao fluxo de pagamento."],
    [470, "Teste reembolso permitido", "Avalie reembolso após pagamento e antes do envio.", "paid", "Acione Reembolsar e depois Despachar.", "Confira histórico e bloqueio do envio.", "Reembolso encerra o fluxo antes de shipped."],
    [471, "Investigue repetição de ação", "Confira que repetir pagamento não duplica a transição.", "created", "Acione Pagar e depois Repetir última ação.", "Compare estado e eventos no histórico.", "A segunda tentativa é rejeitada e o estado permanece paid."],
  ]),
];
