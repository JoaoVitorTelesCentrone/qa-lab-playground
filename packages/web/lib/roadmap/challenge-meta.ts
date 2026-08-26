export function getChallengeMeta(module: string, type: string) {
  const prefix = module.match(/^(\d(?:\.\d+)?)/)?.[1] ?? "0";
  const tools: Record<string, string> = { "1.7": "Navegador, DevTools e leitor de tela", "1.8": "Postman, curl ou documentação OpenAPI", "1.9": "Cliente SQL e massa isolada", "1.10": "Git e diff da mudança", "1.11": "Framework de automação e relatório", "1.12": "CI, YAML e logs de pipeline", "1.13": "Ferramenta de carga e métricas", "1.14": "Proxy, DevTools e dados fictícios", "1.15": "Teclado, zoom e tecnologia assistiva", "1.16": "Dispositivo/emulador e rede controlada", "1.17": "Planilha ou dashboard" };
  const prerequisites: Record<string, string> = { "0": "Nenhum: comece separando fatos, hipóteses e impacto.", "1.1": "Risco, comportamento esperado e observação.", "1.2": "Regras, limites e classes de entrada.", "1.3": "Pré-condição, dados, passos e oráculo.", "1.4": "Leitura crítica de histórias e regras.", "1.5": "Exemplos de negócio e comportamento.", "1.6": "Reprodução, impacto e evidência.", "2": "Comunicação de risco e decisão contextual.", "3": "Fatos, hipóteses e escuta ativa.", "4": "Raciocínio baseado em evidência.", "5": "Uma experiência ou artefato para analisar." };
  const time = type === "BUILD" ? "35–50 min" : type === "INVESTIGATE" ? "30–45 min" : "20–30 min";
  const key = prerequisites[prefix] ? prefix : prefix.split(".")[0];
  return { time, prerequisite: prerequisites[key] ?? "Leia o contexto e identifique o risco principal.", tools: tools[prefix] ?? "Editor de texto, navegador e ferramenta de registro de evidência" };
}
