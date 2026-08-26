import type { BoardSnapshot } from "./types";

const now = "2026-08-25T12:00:00.000Z";

export const demoBoard: BoardSnapshot = {
  board: {
    id: "demo",
    name: "Board de demonstração",
    kind: "kanban",
    project: { id: "demo-project", name: "QA Lab Playground", key: "DEMO" },
  },
  columns: [
    { id: "demo-todo", name: "A fazer", position: 1000, category: "todo", color: "slate", wipLimit: null, isInitial: true, isFinal: false },
    { id: "demo-progress", name: "Em andamento", position: 2000, category: "in_progress", color: "blue", wipLimit: 3, isInitial: false, isFinal: false },
    { id: "demo-review", name: "Em validação", position: 3000, category: "in_progress", color: "amber", wipLimit: 2, isInitial: false, isFinal: false },
    { id: "demo-done", name: "Concluído", position: 4000, category: "done", color: "green", wipLimit: null, isInitial: false, isFinal: true },
  ],
  items: [
    {
      id: "demo-item-1", projectId: "demo-project", boardId: "demo", columnId: "demo-todo", key: "DEMO-1",
      type: "story", title: "Mapear o fluxo crítico de compra", description: "Identificar os caminhos felizes e alternativos do checkout.",
      priority: "high", severity: null, storyPoints: 5, reporterId: "demo-viewer", assigneeId: null, rank: 1000, version: 1,
      inBacklog: false, acceptanceCriteria: ["Fluxos principais documentados", "Riscos priorizados"], dueAt: null, createdAt: now, updatedAt: now,
    },
    {
      id: "demo-item-2", projectId: "demo-project", boardId: "demo", columnId: "demo-progress", key: "DEMO-2",
      type: "test", title: "Automatizar smoke test do login", description: "Cobrir autenticação válida e mensagem para credenciais inválidas.",
      priority: "medium", severity: null, storyPoints: 3, reporterId: "demo-viewer", assigneeId: null, rank: 1000, version: 2,
      inBacklog: false, acceptanceCriteria: ["Cenários executando no CI"], dueAt: null, createdAt: now, updatedAt: now,
    },
    {
      id: "demo-item-3", projectId: "demo-project", boardId: "demo", columnId: "demo-review", key: "DEMO-3",
      type: "bug", title: "Total do carrinho diverge no mobile", description: "O desconto não é aplicado após alterar a quantidade em viewport móvel.",
      priority: "highest", severity: "high", storyPoints: 2, reporterId: "demo-viewer", assigneeId: null, rank: 1000, version: 3,
      inBacklog: false, acceptanceCriteria: ["Total recalculado após cada alteração"], dueAt: null, createdAt: now, updatedAt: now,
    },
    {
      id: "demo-item-4", projectId: "demo-project", boardId: "demo", columnId: "demo-done", key: "DEMO-4",
      type: "task", title: "Configurar relatório de execução", description: "Publicar evidências e resultados da suíte no pipeline.",
      priority: "low", severity: null, storyPoints: 2, reporterId: "demo-viewer", assigneeId: null, rank: 1000, version: 2,
      inBacklog: false, acceptanceCriteria: ["Relatório disponível como artefato"], dueAt: null, createdAt: now, updatedAt: now,
    },
    {
      id: "demo-item-5", projectId: "demo-project", boardId: "demo", columnId: "demo-todo", key: "DEMO-5",
      type: "epic", title: "Melhorar cobertura da jornada de pagamento", description: "Épico aguardando refinamento.",
      priority: "medium", severity: null, storyPoints: null, reporterId: "demo-viewer", assigneeId: null, rank: 2000, version: 1,
      inBacklog: true, acceptanceCriteria: [], dueAt: null, createdAt: now, updatedAt: now,
    },
  ],
  viewerRole: "viewer",
};
