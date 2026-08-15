# People Lab — Catálogo de 200 situações

Cada situação deve ganhar contexto, pressão, pergunta aberta, rubrica, consequências, nota do mentor, competências e nível antes de entrar em produção. Este catálogo define a cobertura pedagógica; não é um banco de respostas corretas.

## 1. Comunicação de bugs e riscos

001. **Bug sem reprodução** — você observou uma falha grave uma única vez e precisa comunicá-la sem afirmar o que ainda não provou.
002. **Título alarmista** — uma pessoa do time abre bugs como “sistema quebrado” e gera conflito; como orientar?
003. **Evidência insuficiente** — o bug chegou apenas com uma captura de tela; como pedir detalhes sem bloquear a colaboração?
004. **Risco técnico para negócio** — explique perda de consistência de dados para uma liderança sem conhecimento técnico.
005. **Relatório extenso ignorado** — seus documentos são completos, mas ninguém os lê; como mudar a comunicação?
006. **Bug em canal público** — um defeito crítico é discutido com clientes presentes; como reorganizar a conversa?
007. **Termos ambíguos** — “às vezes fica lento” virou requisito; como transformar isso em algo verificável?
008. **Impacto desconhecido** — há erro no log, mas nenhum relato de usuário; como classificar e comunicar?
009. **Más notícias no fim da sprint** — você encontra um bloqueador horas antes da review; o que dizer e fazer?
010. **Discordância de severidade** — QA chama de crítico e Produto chama de baixo; como construir uma decisão comum?

## 2. Conflitos com desenvolvimento

011. **“Na minha máquina funciona”** — a falha só ocorre no seu ambiente; como investigar sem acusar?
012. **“Não é bug”** — requisito e expectativa do usuário divergem; como conduzir a análise?
013. **Correção apressada** — uma pessoa desenvolvedora pede que você valide sem informar o que mudou.
014. **Bug reaberto três vezes** — a mesma falha retorna; como tratar a causa sem personalizar o problema?
015. **Comentário defensivo** — seu bug recebe resposta agressiva; como reduzir a tensão e preservar o objetivo?
016. **Teste questionado** — desenvolvimento afirma que seu cenário é impossível; como demonstrar relevância?
017. **Acesso negado ao código** — dizem que QA não precisa participar da revisão; como argumentar?
018. **Atalho silencioso** — uma validação foi removida para cumprir prazo sem avisar QA.
019. **Pareamento recusado** — a pessoa responsável evita investigar uma falha intermitente em conjunto.
020. **Crédito pela descoberta** — outra pessoa apresenta seu diagnóstico como próprio; como reagir profissionalmente?

## 3. Produto, requisitos e escopo

021. **Requisito contraditório** — duas histórias descrevem regras incompatíveis e ambas estão em desenvolvimento.
022. **Critério ausente** — a funcionalidade chegou para teste sem comportamento esperado definido.
023. **Mudança verbal** — Produto altera a regra em uma chamada, mas não atualiza os artefatos.
024. **Usuário não consultado** — a equipe assume necessidades sem pesquisa; como levantar o risco?
025. **Caminho feliz suficiente** — Produto considera casos negativos “coisa de QA”.
026. **Escopo crescendo** — pequenas mudanças entram continuamente sem revisão da estratégia de teste.
027. **MVP sem qualidade** — a expressão MVP é usada para justificar qualquer falha.
028. **Regra comercial sensível** — você discorda da decisão, mas ela é intencional e legal.
029. **Aceite por silêncio** — ninguém responde suas perguntas e a data de entrega se aproxima.
030. **Protótipo divergente** — design, requisito e implementação mostram três comportamentos diferentes.

## 4. Prazos, releases e negociação

031. **Release na sexta-feira** — há risco financeiro intermitente e forte pressão comercial.
032. **Quatro horas para testar** — dois dias foram perdidos e a data permaneceu igual.
033. **Go/no-go dividido** — áreas técnicas recomendam adiar, mas negócio aceita o impacto.
034. **Correção sem regressão** — pedem publicação imediata de um hotfix crítico.
035. **Feature flag incompleta** — a funcionalidade pode ser desligada, mas a migração de dados não.
036. **Rollback não testado** — a equipe confia em um procedimento nunca executado.
037. **Janela de deploy fechando** — um teste bloqueado ainda não foi resolvido.
038. **Cliente estratégico esperando** — somente um cliente precisa da mudança hoje.
039. **Risco aceito informalmente** — liderança diz “pode subir” em conversa privada.
040. **Múltiplas entregas simultâneas** — você precisa escolher onde concentrar a validação.

## 5. Incidentes e crise

041. **Produção indisponível** — durante o incidente, a primeira pergunta é quem deixou o bug passar.
042. **Dados duplicados** — o serviço voltou, mas a extensão da corrupção é desconhecida.
043. **Comunicação divergente** — suporte, engenharia e liderança publicam causas diferentes.
044. **Rollback piorou o cenário** — a tentativa de recuperação criou uma segunda falha.
045. **Sem acesso aos logs** — você precisa ajudar, mas permissões impedem a investigação.
046. **Cliente pede prazo** — ainda não existe diagnóstico, mas exigem estimativa de correção.
047. **Evidência sendo apagada** — reiniciar serviços pode restaurar o sistema e perder dados úteis.
048. **Incidente recorrente** — o mesmo problema retorna após uma ação “definitiva”.
049. **Post-mortem acusatório** — a reunião começa listando erros individuais.
050. **Impacto fora do horário** — você percebe o incidente, mas não existe escala definida.

## 6. Feedback e liderança

051. **Erro de uma pessoa júnior** — a liderança pede uma revisão pública do que ela fez errado.
052. **Profissional experiente resistente** — alguém rejeita feedback por ter mais tempo de carreira.
053. **Desempenho inconsistente** — uma pessoa entrega bem, mas frequentemente não comunica bloqueios.
054. **Feedback sem exemplo** — seu gestor diz que você precisa ser “mais estratégico”.
055. **Elogio invisível** — o trabalho preventivo do time nunca aparece porque problemas não ocorreram.
056. **Delegação incompleta** — você delegou uma missão, mas continua controlando cada decisão.
057. **Pessoa sobrecarregada** — a melhor profissional recebe todas as tarefas críticas.
058. **Reunião dominada** — uma voz experiente impede contribuições do restante do time.
059. **Plano de desenvolvimento genérico** — metas não se conectam ao trabalho real.
060. **Promoção disputada** — duas pessoas esperavam a mesma oportunidade e uma foi escolhida.

## 7. Ética, privacidade e dados

061. **Base de produção em homologação** — copiar dados reais parece a forma mais rápida de testar.
062. **Captura com dados pessoais** — a evidência do bug expõe informações de um cliente.
063. **Conta compartilhada** — o time usa um único usuário administrador para ganhar tempo.
064. **Monitoramento excessivo** — uma funcionalidade coleta mais dados do que o objetivo exige.
065. **Consentimento obscuro** — o fluxo induz o usuário a aceitar uma opção invasiva.
066. **Bug favorável à empresa** — um erro cobra valor maior e existe pressão para tratá-lo discretamente.
067. **Acesso após desligamento** — uma pessoa que saiu ainda consegue entrar nos sistemas.
068. **Planilha externa** — dados sensíveis são enviados para uma ferramenta não aprovada.
069. **Teste em usuário real** — querem validar diretamente em produção sem informar participantes.
070. **Pedido para omitir** — solicitam remover uma descoberta importante do relatório executivo.

## 8. Cultura de segurança

071. **Senha no chat** — uma credencial de produção foi publicada no canal do time.
072. **Vulnerabilidade crítica** — você encontra acesso indevido e não sabe quem deve receber o relato.
073. **Prova de conceito perigosa** — pedem uma exploração completa em dados reais.
074. **Segurança bloqueadora** — o time trata qualquer revisão de segurança como burocracia.
075. **Correção parcial** — a vulnerabilidade foi mascarada na interface, mas a API permanece exposta.
076. **Dependência vulnerável** — a atualização quebra compatibilidade perto da release.
077. **Falso positivo recorrente** — alertas demais fizeram a equipe ignorar o scanner.
078. **Ambiente “interno”** — controles são dispensados porque o sistema não é público.
079. **Relato externo** — uma pesquisadora comunica uma falha de forma pouco detalhada.
080. **Segredo no histórico Git** — remover o arquivo atual não elimina a exposição anterior.

## 9. CI/CD e confiabilidade do pipeline

081. **Pipeline instável** — o time executa novamente até ficar verde.
082. **Teste lento removido** — uma verificação crítica foi excluída para reduzir duração.
083. **Gate ignorado** — alguém com permissão administrativa publica apesar da falha.
084. **Cobertura caiu** — a métrica piorou, mas os testes removidos eram pouco úteis.
085. **Ambientes divergentes** — homologação e produção usam configurações diferentes.
086. **Execução paralela interfere** — testes compartilham dados e falham aleatoriamente.
087. **Cache esconde falha** — build passa com dependências antigas e falha do zero.
088. **Pipeline verde, produto quebrado** — todos os testes passaram antes de um incidente.
089. **Segredo em variável** — um log do job imprime parte de uma credencial.
090. **Responsabilidade difusa** — ninguém assume a manutenção do pipeline.

## 10. Automação e estratégia técnica

091. **Automatizar tudo** — liderança define 100% de automação como meta.
092. **Teste frágil de interface** — pequenas mudanças visuais quebram dezenas de casos.
093. **Duplicação de cobertura** — UI, API e unidade verificam exatamente a mesma regra.
094. **Código de teste sem revisão** — automação é tratada como script descartável.
095. **Retorno baixo** — um cenário raro custa dias de manutenção automatizada.
096. **Ferramenta da moda** — querem trocar o framework sem problema concreto.
097. **Sem dados controlados** — a suíte depende de registros criados manualmente.
098. **Asserção superficial** — o teste verifica status 200, mas ignora o resultado do negócio.
099. **Teste passa pelo motivo errado** — uma exceção é engolida e produz falso sucesso.
100. **Equipe sem domínio** — só uma pessoa entende a arquitetura da automação.

## 11. Trabalho ágil e cerimônias

101. **QA apenas no final** — histórias chegam para validação no último dia.
102. **Planning sem qualidade** — riscos e testabilidade nunca entram na estimativa.
103. **Daily como cobrança** — pessoas escondem problemas para evitar exposição.
104. **Retrospectiva repetida** — os mesmos pontos aparecem sem ações efetivas.
105. **Definition of Done ignorada** — exceções viraram o comportamento normal.
106. **Bug fora da sprint** — defeitos não entram na capacidade do time.
107. **História grande demais** — a entrega não pode ser validada incrementalmente.
108. **Review ensaiada** — somente o caminho preparado é demonstrado.
109. **Refinamento sem engenharia** — decisões são tomadas sem avaliar viabilidade.
110. **Velocidade como objetivo** — qualidade é sacrificada para proteger pontos da sprint.

## 12. Gestão da qualidade e métricas

111. **Meta de zero bugs** — pessoas deixam de registrar problemas para proteger o indicador.
112. **Quantidade de casos** — produtividade de QA é medida pelo número de testes escritos.
113. **Cobertura sem contexto** — 90% de cobertura é apresentada como garantia de qualidade.
114. **Defeitos escapados** — a liderança usa a métrica para culpar QA.
115. **Severidade inflada** — tudo vira crítico para conseguir prioridade.
116. **Dashboard sem decisão** — dezenas de métricas não mudam nenhuma ação.
117. **Qualidade por fase** — o plano coloca QA somente depois do desenvolvimento.
118. **Auditoria próxima** — documentos são produzidos retroativamente apenas para conformidade.
119. **Critério de saída vago** — “quando estiver bom” define o fim dos testes.
120. **Tendência piorando** — indicadores degradam lentamente sem um evento isolado.

## 13. Priorização e estimativa

121. **Tudo é prioridade** — cinco stakeholders classificam suas demandas como urgentes.
122. **Estimativa sem contexto** — pedem prazo de teste antes de apresentar a mudança.
123. **Risco raro e catastrófico** — baixa probabilidade compete com alto impacto.
124. **Fluxo popular e simples** — grande uso, mas pouca complexidade técnica.
125. **Dívida invisível** — manutenção consome capacidade sem aparecer no planejamento.
126. **Interrupções constantes** — demandas pequenas destroem o foco da regressão.
127. **Capacidade reduzida** — metade da equipe está indisponível antes de uma release.
128. **Teste manual caro** — uma validação importante exige horas a cada mudança.
129. **Prioridade política** — um pedido executivo supera riscos melhor fundamentados.
130. **Estimativa contestada** — sua previsão é chamada de conservadora sem análise.

## 14. Acessibilidade e inclusão

131. **Teclado fora do escopo** — Produto diz não ter usuários com deficiência.
132. **Contraste aprovado pelo branding** — identidade visual e legibilidade entram em conflito.
133. **Leitor de tela tardio** — a falha estrutural aparece perto da publicação.
134. **Legenda automática ruim** — conteúdo educacional exclui parte do público.
135. **Formulário hostil** — mensagens de erro dependem apenas de cor.
136. **Prazo versus inclusão** — correções de acessibilidade ameaçam a data.
137. **Pesquisa não representativa** — somente usuários sem limitações participaram.
138. **Nome social ausente** — o modelo de dados força identificação inadequada.
139. **Fuso e idioma** — a experiência funciona apenas para uma região.
140. **Comentário capacitista** — uma piada surge durante discussão de acessibilidade.

## 15. Trabalho remoto e diversidade cultural

141. **Fuso desfavorável** — a mesma região sempre participa fora do horário.
142. **Silêncio interpretado** — uma pessoa reservada é considerada desinteressada.
143. **Mensagem ambígua** — texto curto gera conflito entre culturas diferentes.
144. **Reunião sem registro** — decisões excluem quem não pôde participar.
145. **Câmera obrigatória** — política ignora contexto pessoal e infraestrutura.
146. **Idioma dominante** — pessoas fluentes controlam a discussão técnica.
147. **Interrupções invisíveis** — trabalho remoto é confundido com disponibilidade integral.
148. **Feedback escrito duro** — uma revisão correta soa hostil sem contexto.
149. **Contratação semelhante** — o time busca sempre perfis com a mesma trajetória.
150. **Feriado ignorado** — planejamento global desconsidera calendários locais.

## 16. Fornecedores, integrações e dependências

151. **API externa instável** — o fornecedor nega o problema observado.
152. **SLA ambíguo** — contrato e expectativa operacional não combinam.
153. **Sandbox irreal** — ambiente do parceiro não reproduz limites de produção.
154. **Mudança sem aviso** — uma dependência altera o contrato da API.
155. **Falha compartilhada** — cada empresa atribui o incidente à outra.
156. **Dados enviados ao terceiro** — integração exige mais informação do que deveria.
157. **Fornecedor estratégico** — liderança evita pressionar por correções.
158. **Sem alternativa técnica** — uma dependência crítica não possui fallback.
159. **Certificação superficial** — o parceiro apresenta selo, mas não evidências.
160. **Teste destrutivo proibido** — limitações contratuais impedem cenários importantes.

## 17. Mentoria, carreira e aprendizagem

161. **Pessoa júnior dependente** — ela pede aprovação para cada pequena decisão.
162. **Mentoria sem tempo** — apoio é prometido, mas sempre perde prioridade.
163. **Comparação injusta** — duas pessoas são avaliadas com oportunidades diferentes.
164. **Especialista que não compartilha** — conhecimento crítico fica concentrado.
165. **Erro durante aprendizado** — uma tentativa segura falha e gera cobrança por produtividade.
166. **Objetivo imposto** — a pessoa quer carreira técnica, mas empurram liderança.
167. **Síndrome do impostor** — bom desempenho não muda a percepção de incapacidade.
168. **Curso sem aplicação** — treinamento é concluído, mas não existe prática real.
169. **Feedback só negativo** — conversas ocorrem apenas quando algo dá errado.
170. **Saída de referência** — conhecimento precisa ser transferido em poucos dias.

## 18. Performance, confiabilidade e operações

171. **Lentidão sem erro** — usuários abandonam o fluxo, mas o sistema permanece disponível.
172. **Pico não testado** — campanha pode multiplicar o tráfego amanhã.
173. **SLA versus percepção** — métrica atende contrato, mas experiência é ruim.
174. **Alerta ruidoso** — notificações frequentes não representam impacto real.
175. **Capacidade cara** — resolver performance apenas com infraestrutura aumenta muito o custo.
176. **Degradação silenciosa** — tempo de resposta piora pouco a pouco.
177. **Dependência lenta** — seu sistema recebe a culpa por uma integração externa.
178. **Teste de carga em produção** — não há ambiente representativo disponível.
179. **Observabilidade incompleta** — métricas mostram o sintoma, mas não a jornada.
180. **Objetivo impossível** — liderança exige 100% de disponibilidade.

## 19. Inteligência artificial e uso responsável

181. **Bug report gerado por IA** — o texto parece ótimo, mas contém passos inventados.
182. **Código de teste copiado** — automação gerada inclui dependência insegura.
183. **Dados sensíveis no prompt** — alguém envia informações de cliente para uma ferramenta pública.
184. **Avaliação automatizada injusta** — IA classifica desempenho sem transparência.
185. **Confiança excessiva** — o time deixa de revisar cenários produzidos pelo modelo.
186. **Viés nos casos de teste** — dados gerados representam apenas um perfil de usuário.
187. **Ferramenta não aprovada** — produtividade aumenta, mas governança não existe.
188. **Explicação convincente e errada** — o diagnóstico da IA conflita com evidências.
189. **Autoria e crédito** — entregas geradas não deixam claro o processo utilizado.
190. **Automação de decisão humana** — querem usar IA para aprovar releases sozinha.

## 20. Política organizacional e influência

191. **Projeto executivo** — problemas não podem ser mencionados na apresentação oficial.
192. **Qualidade sem autoridade formal** — você precisa influenciar vários times autônomos.
193. **Metas conflitantes** — bônus de velocidade compete com confiabilidade.
194. **Reorganização frequente** — responsabilidades mudam antes de processos amadurecerem.
195. **Decisão em corredor** — acordos informais substituem fóruns transparentes.
196. **Time usado como bode expiatório** — QA recebe culpa por falhas sistêmicas.
197. **Patrocínio perdido** — a liderança que apoiava melhorias saiu da empresa.
198. **Sucesso sem narrativa** — prevenção não recebe investimento por ser invisível.
199. **Mudança impopular** — uma prática necessária encontra resistência generalizada.
200. **Qualidade como cultura** — você precisa transformar o slogan em comportamentos observáveis.

## Distribuição recomendada

- 60 situações iniciantes: comunicação clara, colaboração e fundamentos.
- 90 intermediárias: ambiguidade, negociação e decisões com restrições.
- 50 avançadas: crises, ética, influência organizacional e trade-offs sistêmicos.

Cada sessão deve misturar novidade, repetição espaçada e competências menos praticadas. O aluno pode pular uma situação, mas deve informar o motivo; isso também é dado de aprendizagem.

