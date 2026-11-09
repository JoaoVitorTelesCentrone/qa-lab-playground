import { Activity, Braces, Database, ScanEye, Send, Gauge, Accessibility, Shield, Rows3, Workflow, type LucideIcon } from "lucide-react";

export type QaToolId = "sql" | "contrato" | "visual" | "observabilidade" | "http" | "carga" | "acessibilidade" | "seguranca" | "massa" | "estados";

export const qaTools: Array<{
  id: QaToolId;
  title: string;
  shortTitle: string;
  description: string;
  task: string;
  icon: LucideIcon;
  accent: string;
}> = [
  { id: "sql", title: "SQL Explorer", shortTitle: "SQL e dados", description: "Consulte uma base sintética, encontre inconsistências e veja como filtros mudam o resultado.", task: "Investigue pedidos suspeitos com consultas SELECT seguras.", icon: Database, accent: "text-sky-300" },
  { id: "contrato", title: "Contract Inspector", shortTitle: "Contrato de API", description: "Compare respostas JSON com um contrato e localize regressões de tipo, campo e regra.", task: "Execute assertions sobre respostas de uma API de treino.", icon: Braces, accent: "text-violet-300" },
  { id: "visual", title: "Visual Diff Bench", shortTitle: "Regressão visual", description: "Compare duas versões de uma tela em diferentes larguras e identifique mudanças visuais relevantes.", task: "Inspecione uma tela de checkout antes e depois de uma release.", icon: ScanEye, accent: "text-amber-300" },
  { id: "observabilidade", title: "Trace Explorer", shortTitle: "Logs e traces", description: "Filtre eventos sintéticos por serviço, severidade e trace para reconstruir uma falha.", task: "Siga uma requisição do gateway até o worker e encontre onde ela parou.", icon: Activity, accent: "text-emerald-300" },
  { id: "http", title: "HTTP Request Runner", shortTitle: "Requisições HTTP", description: "Monte requisições, varie autenticação e corpo e examine status, cabeçalhos e resposta.", task: "Investigue o comportamento de uma API de pedidos simulada.", icon: Send, accent: "text-cyan-300" },
  { id: "carga", title: "Load Profile Bench", shortTitle: "Carga e SLO", description: "Ajuste usuários virtuais e duração para observar latência, vazão e erros em perfis determinísticos.", task: "Compare carga normal, degradação e pico contra metas de serviço.", icon: Gauge, accent: "text-orange-300" },
  { id: "acessibilidade", title: "Accessibility Inspector", shortTitle: "Acessibilidade", description: "Inspecione um formulário com defeitos plantados de rótulo, foco, contraste e feedback.", task: "Avalie uma tarefa com teclado e sinais acessíveis.", icon: Accessibility, accent: "text-fuchsia-300" },
  { id: "seguranca", title: "Security Probe", shortTitle: "Segurança de API", description: "Envie entradas sintéticas e verifique autorização, escape, limitação de taxa e validação.", task: "Analise respostas defensivas sem atingir sistemas externos.", icon: Shield, accent: "text-rose-300" },
  { id: "massa", title: "Test Data Factory", shortTitle: "Massa de teste", description: "Gere registros reproduzíveis com seed, limites e duplicidade e confira regras de qualidade.", task: "Construa dados válidos e inválidos para um cadastro.", icon: Rows3, accent: "text-lime-300" },
  { id: "estados", title: "State Machine Explorer", shortTitle: "Estados e regras", description: "Acione transições de pedido e observe permissões, rejeições e histórico de eventos.", task: "Explore o ciclo de vida de um pedido sem pular etapas.", icon: Workflow, accent: "text-indigo-300" },
];

export function findQaTool(id: string) {
  return qaTools.find((tool) => tool.id === id);
}
