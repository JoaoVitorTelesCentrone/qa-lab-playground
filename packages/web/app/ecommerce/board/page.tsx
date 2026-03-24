"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  ShoppingBag,
  Calendar,
  LogIn,
  ExternalLink,
  ChevronRight,
  ClipboardList,
  Pencil,
  X,
  Plus,
  Trash2,
  ListChecks,
  Bug,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { scenarios } from "@qa-lab/shared";

// ==============================
// Types
// ==============================

type TaskStatus = "backlog" | "em_progresso" | "concluido";
type TaskPriority = "critica" | "alta" | "media" | "baixa";
type QaModule = "api" | "ecommerce" | "cenarios" | "datas" | "login";

interface QaLink {
  label: string;
  href: string;
}

interface BoardTask {
  id: string;
  titulo: string;
  descricao: string;
  status: TaskStatus;
  prioridade: TaskPriority;
  qaModulo: QaModule;
  bugsConhecidos: string[];
  qaLinks: QaLink[];
  objetivos: number;
}

// ==============================
// Initial Data
// ==============================

const initialTasks: BoardTask[] = [
  {
    id: "QA-001",
    titulo: "Catálogo de Produtos",
    descricao:
      "Listagem de produtos com busca por nome, filtros por categoria e paginação de resultados.",
    status: "concluido",
    prioridade: "alta",
    qaModulo: "api",
    bugsConhecidos: [
      "Paginação pula itens entre páginas",
      "GET /products/:id retorna 200 com body de erro",
      "DELETE /products/:id retorna 204 mas não remove",
    ],
    qaLinks: [
      { label: "API Playground", href: "/api-playground" },
      { label: "Cenário: Busca de produtos", href: "/cenarios/testar-busca-produtos" },
    ],
    objetivos: 3,
  },
  {
    id: "QA-002",
    titulo: "Carrinho de Compras",
    descricao:
      "Adicionar/remover itens, ajustar quantidades, wishlist e cálculo de subtotal em tempo real.",
    status: "em_progresso",
    prioridade: "alta",
    qaModulo: "ecommerce",
    bugsConhecidos: [
      "Permite adicionar mais itens do que o estoque disponível",
      "Preço total não atualiza ao remover item",
      "Produto esgotado ainda aparece disponível no carrinho",
      "Busca não retorna resultados com palavras acentuadas",
    ],
    qaLinks: [
      { label: "E-commerce (loja)", href: "/ecommerce" },
    ],
    objetivos: 4,
  },
  {
    id: "QA-003",
    titulo: "Checkout e Pedidos",
    descricao:
      "Finalização de compra com cálculo de frete por CEP, cupom de desconto e criação de pedido via API.",
    status: "em_progresso",
    prioridade: "critica",
    qaModulo: "api",
    bugsConhecidos: [
      "POST /api/orders tem timeout intermitente com Chaos ativo",
      "Produto com ID inexistente é aceito no pedido",
      "Cupom de desconto pode ser aplicado múltiplas vezes",
      "Cálculo de frete não valida CEP inválido",
    ],
    qaLinks: [
      { label: "API Playground", href: "/api-playground" },
      { label: "Cenário: Validar erros no pedido", href: "/cenarios/validar-erros-pedido" },
      { label: "E-commerce (loja)", href: "/ecommerce" },
    ],
    objetivos: 3,
  },
  {
    id: "QA-004",
    titulo: "Login e Autenticação",
    descricao:
      "Página de login com JWT, sessão persistente e proteção de rotas do e-commerce.",
    status: "backlog",
    prioridade: "critica",
    qaModulo: "login",
    bugsConhecidos: [
      "Mensagem de erro revela se o e-mail existe (information disclosure)",
      "Sem rate limiting — permite brute force ilimitado",
      "Token JWT não expira",
      "Botão 'Lembrar de mim' não tem efeito",
    ],
    qaLinks: [
      { label: "Cenário: Listagem de usuários", href: "/cenarios/validar-listagem-usuarios" },
    ],
    objetivos: 4,
  },
  {
    id: "QA-005",
    titulo: "Cadastro de Usuários",
    descricao:
      "Registro de novos usuários com validação de campos e integração com a API.",
    status: "backlog",
    prioridade: "alta",
    qaModulo: "cenarios",
    bugsConhecidos: [
      "POST /api/users descarta campos silenciosamente",
      "Sem validação de e-mail duplicado",
      "PUT /api/users/:id retorna sucesso mas não persiste",
    ],
    qaLinks: [
      { label: "Cenários de Teste", href: "/cenarios" },
      { label: "Cenário: Listagem de usuários", href: "/cenarios/validar-listagem-usuarios" },
      { label: "API Playground", href: "/api-playground" },
    ],
    objetivos: 3,
  },
  {
    id: "QA-006",
    titulo: "Histórico de Pedidos",
    descricao:
      "Listagem e detalhamento de pedidos do usuário autenticado com status e itens comprados.",
    status: "backlog",
    prioridade: "media",
    qaModulo: "cenarios",
    bugsConhecidos: [
      "GET /api/orders/:id retorna formato diferente a cada request",
      "Alternância entre camelCase, snake_case e formato flat",
    ],
    qaLinks: [
      { label: "Cenários de Teste", href: "/cenarios" },
      { label: "Cenário: Resposta inconsistente", href: "/cenarios/resposta-inconsistente" },
      { label: "API Playground", href: "/api-playground" },
    ],
    objetivos: 3,
  },
  {
    id: "QA-007",
    titulo: "Datas e Prazo de Entrega",
    descricao:
      "Cálculo de prazo de entrega, seleção de data de agendamento e exibição em diferentes fusos horários.",
    status: "backlog",
    prioridade: "media",
    qaModulo: "datas",
    bugsConhecidos: [
      "Permite selecionar datas no passado para agendamento",
      "Cálculo de diferença entre datas ignora anos bissextos",
      "Fuso horário não é considerado na conversão",
      "Timer continua rodando mesmo quando pausado",
      "Relógio digital e analógico mostram horas diferentes",
    ],
    qaLinks: [
      { label: "Módulo de Datas", href: "/datas" },
    ],
    objetivos: 5,
  },
  {
    id: "QA-008",
    titulo: "Saúde da API e Monitoramento",
    descricao:
      "Endpoint de health check que reporta o status de todos os serviços da plataforma.",
    status: "concluido",
    prioridade: "baixa",
    qaModulo: "api",
    bugsConhecidos: [
      "GET /api/health reporta serviços como 'healthy' mesmo quando falhando",
      "Chaos Mode ativo não é refletido no health check",
    ],
    qaLinks: [
      { label: "API Playground", href: "/api-playground" },
    ],
    objetivos: 2,
  },
];

// ==============================
// Config
// ==============================

const statusConfig: Record<TaskStatus, { label: string; dot: string }> = {
  backlog:       { label: "Backlog",       dot: "bg-muted-foreground" },
  em_progresso:  { label: "Em Progresso",  dot: "bg-blue-400" },
  concluido:     { label: "Concluído",     dot: "bg-green-500" },
};

const priorityDot: Record<TaskPriority, string> = {
  critica: "bg-red-500",
  alta:    "bg-amber-500",
  media:   "bg-blue-400",
  baixa:   "bg-gray-300",
};

const moduleConfig: Record<QaModule, { label: string; icon: React.ElementType }> = {
  api:       { label: "API",       icon: Send },
  ecommerce: { label: "E-commerce", icon: ShoppingBag },
  cenarios:  { label: "Cenários",   icon: ListChecks },
  datas:     { label: "Datas",      icon: Calendar },
  login:     { label: "Auth",       icon: LogIn },
};

const columns: TaskStatus[] = ["backlog", "em_progresso", "concluido"];

// ==============================
// Edit Modal (compacto)
// ==============================

function EditModal({ task, onClose, onSave }: { task: BoardTask; onClose: () => void; onSave: (t: BoardTask) => void }) {
  const [form, setForm] = useState<BoardTask>({ ...task, bugsConhecidos: [...task.bugsConhecidos], qaLinks: task.qaLinks.map(l => ({ ...l })) });
  const [newBug, setNewBug] = useState("");
  const [showScenarios, setShowScenarios] = useState(false);

  function addBug() {
    const t = newBug.trim();
    if (!t) return;
    setForm(f => ({ ...f, bugsConhecidos: [...f.bugsConhecidos, t] }));
    setNewBug("");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-800/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-xl border border-border bg-card shadow-2xl mx-4 animate-scale-in">
        <div className="flex items-center justify-between border-b border-border px-5 py-3 sticky top-0 bg-card z-10">
          <span className="text-sm font-semibold">Editar {task.id}</span>
          <button onClick={onClose} className="rounded p-1 hover:bg-secondary transition-colors">
            <X className="size-4 text-muted-foreground" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <Input value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} placeholder="Título" />
          <Textarea value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} rows={2} placeholder="Descrição" />

          <div className="grid grid-cols-3 gap-3">
            <select className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as TaskStatus }))}>
              <option value="backlog">Backlog</option>
              <option value="em_progresso">Em Progresso</option>
              <option value="concluido">Concluído</option>
            </select>
            <select className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm" value={form.prioridade} onChange={e => setForm(f => ({ ...f, prioridade: e.target.value as TaskPriority }))}>
              <option value="critica">Crítica</option>
              <option value="alta">Alta</option>
              <option value="media">Média</option>
              <option value="baixa">Baixa</option>
            </select>
            <select className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm" value={form.qaModulo} onChange={e => setForm(f => ({ ...f, qaModulo: e.target.value as QaModule }))}>
              {Object.entries(moduleConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>

          {/* Bugs */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-muted-foreground">Bugs ({form.bugsConhecidos.length})</span>
            {form.bugsConhecidos.map((b, i) => (
              <div key={i} className="flex items-center gap-2 rounded-md bg-secondary/50 px-3 py-1.5">
                <span className="flex-1 text-xs">{b}</span>
                <button onClick={() => setForm(f => ({ ...f, bugsConhecidos: f.bugsConhecidos.filter((_, idx) => idx !== i) }))} className="shrink-0">
                  <X className="size-3 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <Input value={newBug} onChange={e => setNewBug(e.target.value)} onKeyDown={e => e.key === "Enter" && addBug()} placeholder="Novo bug..." className="text-xs" />
              <Button variant="outline" size="sm" onClick={addBug} className="shrink-0"><Plus className="size-3.5" /></Button>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Links de QA</span>
              <button onClick={() => setShowScenarios(!showScenarios)} className="text-xs text-primary hover:underline">
                {showScenarios ? "Fechar" : "Vincular cenário"}
              </button>
            </div>
            {form.qaLinks.map((link, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <ExternalLink className="size-3 text-primary shrink-0" />
                <span className="flex-1 text-primary truncate">{link.label}</span>
                <button onClick={() => setForm(f => ({ ...f, qaLinks: f.qaLinks.filter((_, idx) => idx !== i) }))}>
                  <X className="size-3 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            ))}
            {showScenarios && (
              <div className="rounded-lg border border-border p-2 space-y-1 max-h-36 overflow-y-auto">
                {scenarios.map(s => {
                  const linked = form.qaLinks.some(l => l.href === `/cenarios/${s.id}`);
                  return (
                    <button
                      key={s.id}
                      onClick={() => !linked && setForm(f => ({ ...f, qaLinks: [...f.qaLinks, { label: s.titulo, href: `/cenarios/${s.id}` }] }))}
                      disabled={linked}
                      className={`w-full text-left rounded px-2 py-1.5 text-xs transition-colors ${linked ? "text-muted-foreground" : "hover:bg-secondary/60"}`}
                    >
                      {s.titulo} {linked && <span className="text-primary ml-1">+</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-border px-5 py-3 sticky bottom-0 bg-card">
          <Button variant="outline" size="sm" onClick={onClose}>Cancelar</Button>
          <Button size="sm" onClick={() => onSave(form)}>Salvar</Button>
        </div>
      </div>
    </div>
  );
}

// ==============================
// Task Card (minimalista)
// ==============================

function TaskCard({ task, onEdit }: { task: BoardTask; onEdit: (t: BoardTask) => void }) {
  const ModuleIcon = moduleConfig[task.qaModulo].icon;

  return (
    <div className="group rounded-lg border border-border bg-card p-3.5 space-y-2.5 transition-all duration-200 hover:border-primary/25 hover:shadow-sm">
      {/* Header: id + priority + edit */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-muted-foreground">{task.id}</span>
        <div className="flex items-center gap-2">
          <span className={`size-2 rounded-full ${priorityDot[task.prioridade]}`} title={task.prioridade} />
          <button
            onClick={() => onEdit(task)}
            className="rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-secondary"
          >
            <Pencil className="size-3 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Title */}
      <p className="text-sm font-medium leading-snug">{task.titulo}</p>

      {/* Meta row */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <ModuleIcon className="size-3" />
            {moduleConfig[task.qaModulo].label}
          </span>
          {task.bugsConhecidos.length > 0 && (
            <span className="flex items-center gap-1">
              <Bug className="size-3" />
              {task.bugsConhecidos.length}
            </span>
          )}
        </div>
        {task.qaLinks[0] && (
          <Link href={task.qaLinks[0].href} className="text-primary hover:underline flex items-center gap-0.5">
            Testar <ChevronRight className="size-3" />
          </Link>
        )}
      </div>
    </div>
  );
}

// ==============================
// Column
// ==============================

function Column({ status, tasks, onEdit }: { status: TaskStatus; tasks: BoardTask[]; onEdit: (t: BoardTask) => void }) {
  const cfg = statusConfig[status];

  return (
    <div className="flex flex-col gap-2.5 min-w-0">
      <div className="flex items-center gap-2 px-0.5 pb-1">
        <span className={`size-1.5 rounded-full ${cfg.dot}`} />
        <span className="text-xs font-medium text-muted-foreground">{cfg.label}</span>
        <span className="text-xs text-muted-foreground/60">{tasks.length}</span>
      </div>
      <div className="flex flex-col gap-2">
        {tasks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-8 text-center">
            <p className="text-xs text-muted-foreground">Vazio</p>
          </div>
        ) : (
          tasks.map(t => <TaskCard key={t.id} task={t} onEdit={onEdit} />)
        )}
      </div>
    </div>
  );
}

// ==============================
// Page
// ==============================

export default function EcommerceBoardPage() {
  const [tasks, setTasks] = useState<BoardTask[]>(initialTasks);
  const [editingTask, setEditingTask] = useState<BoardTask | null>(null);

  function handleSave(updated: BoardTask) {
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    setEditingTask(null);
  }

  const tasksByStatus = (s: TaskStatus) => tasks.filter(t => t.status === s);
  const total = tasks.length;
  const done = tasks.filter(t => t.status === "concluido").length;
  const pct = Math.round((done / total) * 100);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-3 animate-slide-in-up">
        <Link href="/ecommerce" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit">
          <ArrowLeft className="size-3.5" /> Voltar
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ClipboardList className="size-5 text-primary" />
            <h1 className="text-xl font-bold tracking-tight">Board</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Progress inline */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <span>{done}/{total}</span>
              <div className="h-1 w-20 rounded-full bg-secondary">
                <div className="h-1 rounded-full bg-primary transition-all duration-300" style={{ width: `${pct}%` }} />
              </div>
              <span className="font-medium text-foreground">{pct}%</span>
            </div>

            <div className="flex gap-1.5">
              <Link href="/api-playground">
                <Button variant="outline" size="xs" className="gap-1"><Send className="size-3" /> API</Button>
              </Link>
              <Link href="/cenarios">
                <Button variant="outline" size="xs" className="gap-1"><ListChecks className="size-3" /> Cenários</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 stagger">
        {columns.map(status => (
          <Column key={status} status={status} tasks={tasksByStatus(status)} onEdit={setEditingTask} />
        ))}
      </div>

      {/* Edit Modal */}
      {editingTask && (
        <EditModal task={editingTask} onClose={() => setEditingTask(null)} onSave={handleSave} />
      )}
    </div>
  );
}
