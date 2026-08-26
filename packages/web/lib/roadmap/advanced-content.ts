import type { EnrichedChallengeContent } from "./base-content";

function topic(module: string) { return module.split(" — ").slice(1).join(" — ") || module; }

const specifics: Record<string, { concept: string; example: string }> = {
  "3.1": { concept: "Comunicação de QA transforma observação técnica em informação útil para decisão.", example: "Em vez de ‘a API está ruim’, descreva endpoint, comportamento observado, impacto e a decisão que precisa ser tomada." },
  "3.2": { concept: "Fazer perguntas é uma ferramenta de investigação e prevenção: a pergunta certa reduz ambiguidade sem acusar.", example: "Perguntar ‘qual deve ser o comportamento quando o cupom expira durante o pagamento?’ revela uma regra ausente." },
  "3.3": { concept: "Feedback eficaz descreve comportamento e impacto, oferece contexto e abre espaço para ajuste.", example: "Troque ‘seu teste está errado’ por ‘este caso cobre sucesso, mas não mostra o que acontece quando a sessão expira’." },
  "3.4": { concept: "Conflito profissional pode ser tratado separando pessoa, fato, interesse e decisão necessária.", example: "Duas pessoas discordam sobre severidade; compare impacto, alcance e evidência antes de discutir opinião." },
  "3.5": { concept: "Negociação de qualidade explicita trade-offs e busca uma decisão aceitável, não uma vitória retórica.", example: "Se não há tempo para regressão completa, proteja o fluxo de maior risco e registre o residual." },
  "3.6": { concept: "Influência sem autoridade acontece quando a recomendação conecta evidência a uma consequência que o time valoriza.", example: "Um gráfico de falhas de pagamento influencia mais que uma lista de dez casos sem impacto." },
  "3.7": { concept: "Ownership é acompanhar o risco até uma decisão ou handoff claro, sem assumir tudo sozinho.", example: "Quem encontrou o incidente mantém a linha do tempo atualizada mesmo quando a correção é de outro time." },
  "3.8": { concept: "Organização de QA torna trabalho, prioridade, dependência e risco visíveis.", example: "Uma fila com status, dono e próximo passo evita que oito investigações pareçam igualmente urgentes." },
  "3.9": { concept: "Colaboração é construir entendimento e artefatos com outras disciplinas, não apenas enviar tickets.", example: "QA, dev e produto definem juntos um exemplo de regra antes de implementar o fluxo." },
  "3.10": { concept: "Liderança em QA cria contexto, direção e segurança para decisões de qualidade, mesmo sem cargo formal.", example: "Uma liderança madura apresenta risco e opções para o time decidir, em vez de apenas bloquear a release." },
  "4.1": { concept: "Pensamento crítico testa premissas, distingue evidência de opinião e procura explicações alternativas.", example: "‘Usuários não usam a funcionalidade’ pode significar falta de valor, descoberta ruim ou erro de medição." },
  "4.2": { concept: "Pensamento de risco prioriza incerteza pelo dano possível e pela capacidade de detecção ou recuperação.", example: "Uma falha rara que corrompe dados merece atenção antes de uma falha frequente mas reversível." },
  "4.3": { concept: "Edge cases exploram fronteiras, combinações improváveis e estados de transição onde suposições quebram.", example: "Testar valor vazio não basta: considere limite, Unicode, concorrência e interrupção durante o salvamento." },
  "4.4": { concept: "Pensamento sistêmico observa efeitos indiretos entre serviço, dados, pessoas, operação e experiência.", example: "Alterar o prazo de cancelamento pode afetar app, API, relatório, suporte e política de reembolso." },
  "4.5": { concept: "Investigação reduz incerteza por hipóteses e experimentos pequenos, preservando uma trilha de evidências.", example: "Antes de culpar cache, compare request, response, armazenamento local e comportamento em sessão limpa." },
  "4.6": { concept: "Testabilidade é o quanto um comportamento pode ser observado, controlado, isolado e reproduzido.", example: "Uma regra sem identificador, relógio controlável ou resposta observável custa mais para validar." },
  "4.7": { concept: "Estratégia de teste conecta risco, cobertura, camadas, dados, ambiente e tempo disponível.", example: "Uma release de pagamento precisa proteger contrato e cálculo antes de ampliar cobertura visual." },
  "4.8": { concept: "Exploratory Thinking combina aprendizado, desenho e execução de testes sem seguir apenas uma lista fixa.", example: "Durante uma sessão, uma pista de inconsistência de estado muda a próxima investigação de forma justificada." },
  "4.9": { concept: "Conteúdos interativos treinam decisão e aplicação: a resposta precisa explicar escolha, evidência e consequência.", example: "Em um cenário ramificado, cada decisão deve alterar risco, informação disponível ou próximo passo." },
  "5.1": { concept: "Entrar em QA exige demonstrar fundamentos, curiosidade, comunicação e capacidade de produzir evidências.", example: "Um pequeno caso investigado e bem documentado comunica mais que uma lista de ferramentas no currículo." },
  "5.2": { concept: "QA júnior cresce dominando fluxo, observação, reprodução, registro e perguntas claras.", example: "Uma boa entrega júnior mostra passos mínimos, esperado, atual, ambiente e impacto sem inventar causa." },
  "5.3": { concept: "QA pleno conecta risco técnico e negócio, escolhe estratégia e conduz investigação com autonomia.", example: "Além de encontrar falha, explica prioridade, cobertura faltante e recomendação para a release." },
  "5.4": { concept: "QA sênior amplia influência para arquitetura, processo, métricas e decisões sistêmicas.", example: "Em vez de absorver mais execução, reduz uma classe inteira de falhas com prevenção e feedback." },
  "5.5": { concept: "Especialização deve aprofundar um risco ou domínio mantendo fundamentos de qualidade e comunicação.", example: "Performance, segurança ou automação exigem técnica específica, mas ainda dependem de hipótese e evidência." },
  "5.6": { concept: "Emprego em QA envolve traduzir experiência em evidências, contexto e decisões compreensíveis para a vaga.", example: "Conte o problema, sua investigação, a decisão tomada e o resultado — não apenas a ferramenta usada." },
  "5.7": { concept: "Mercado muda ferramentas e nomes, mas valor continua ligado a reduzir risco e acelerar aprendizado confiável.", example: "Uma tendência só merece adoção quando resolve uma dor real com custo e limitações explícitos." },
  "5.8": { concept: "Certificação organiza vocabulário e estudo, mas não substitui prática, julgamento e evidência de aplicação.", example: "Uma definição decorada precisa virar uma decisão concreta em um cenário de teste." },
  "5.9": { concept: "IA em QA deve ampliar análise e geração com revisão humana, rastreabilidade, privacidade e validação do resultado.", example: "Um caso gerado por IA é rascunho: QA precisa conferir regra, dados, lacunas e risco de alucinação." },
};

export function getAdvancedContent(module: string): EnrichedChallengeContent | null {
  const match = module.match(/^(3|4|5)\.\d+/);
  if (!match) return null;
  const area = match[1];
  const name = topic(module);
  const detail = specifics[module.match(/^(3|4|5)\.\d+/)?.[0] ?? ""];
  if (area === "3") return { concept: detail?.concept ?? `${name} em QA transforma uma situação ambígua em entendimento, decisão e ação compartilhada.`, example: detail?.example ?? `Durante ${name.toLowerCase()}, deixe claro o risco, impacto e próximo passo.`, steps: ["Separe fatos, interpretação e pedido.", "Considere o público e o momento.", "Escolha uma mensagem ou atitude objetiva.", "Confirme entendimento e combine acompanhamento."], evidence: ["Mensagem ou roteiro de conversa", "Contexto, impacto e pedido explícitos", "Próximo passo acordado"], commonMistakes: ["Usar técnica para evitar conversa difícil", "Falar em absolutos", "Terminar sem dono ou ação"] };
  if (area === "4") return { concept: detail?.concept ?? `${name} é uma prática de raciocínio baseada em evidência.`, example: detail?.example ?? `Em ${name.toLowerCase()}, reduza incerteza passo a passo.`, steps: ["Descreva fatos e suposições.", "Mapeie impacto e dependências.", "Formule hipóteses concorrentes.", "Escolha o experimento mais informativo."], evidence: ["Mapa de hipóteses", "Evidência por hipótese", "Conclusão com limitações"], commonMistakes: ["Pular da pista para a causa", "Investigar sem critério", "Ignorar risco sistêmico"] };
  return { concept: detail?.concept ?? `${name} conecta competência técnica e decisão profissional.`, example: detail?.example ?? `Ao analisar ${name.toLowerCase()}, explique contexto, resultado e limitações.`, steps: ["Defina o objetivo.", "Liste evidências observáveis.", "Identifique lacunas e próximo experimento.", "Comunique com honestidade e contexto."], evidence: ["Plano ou artefato profissional", "Exemplo de resultado", "Próximo passo mensurável"], commonMistakes: ["Confundir cargo com competência", "Listar cursos sem evidência", "Prometer certeza onde há hipótese"] };
}
