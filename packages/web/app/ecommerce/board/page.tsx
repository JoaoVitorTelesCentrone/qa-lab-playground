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
  Activity,
  Pencil,
  X,
  Plus,
  Trash2,
  ListChecks,
  Bug,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
// Initial Data (sem Form Bugado)
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
// Config maps
// ==============================

const statusConfig: Record<TaskStatus, { label: string; color: string; dotColor: string; barColor: string }> = {
  backlog: {
    label: "Backlog",
    color: "text-muted-foreground",
    dotColor: "bg-muted-foreground",
    barColor: "bg-secondary",
  },
  em_progresso: {
    label: "Em Progresso",
    color: "text-blue-400",
    dotColor: "bg-blue-400",
    barColor: "bg-blue-500",
  },
  concluido: {
    label: "Concluído",
    color: "text-green-600",
    dotColor: "bg-green-600",
    barColor: "bg-emerald-500",
  },
};

const priorityConfig: Record<TaskPriority, { label: string; className: string; barColor: string }> = {
  critica: { label: "Crítica", className: "bg-red-100 text-red-600 border-red-200", barColor: "bg-red-500" },
  alta: { label: "Alta", className: "bg-amber-100 text-amber-600 border-amber-200", barColor: "bg-amber-500" },
  media: { label: "Média", className: "bg-blue-500/20 text-blue-400 border-blue-500/20", barColor: "bg-blue-500" },
  baixa: { label: "Baixa", className: "bg-secondary text-muted-foreground", barColor: "bg-border" },
};

const moduleConfig: Record<QaModule, { label: string; icon: React.ElementType; color: string }> = {
  api: { label: "API Playground", icon: Send, color: "text-violet-400" },
  ecommerce: { label: "E-commerce", icon: ShoppingBag, color: "text-orange-600" },
  cenarios: { label: "Cenários de Teste", icon: ListChecks, color: "text-sky-400" },
  datas: { label: "Módulo Datas", icon: Calendar, color: "text-cyan-400" },
  login: { label: "Login / Auth", icon: LogIn, color: "text-green-600" },
};

const columns: TaskStatus[] = ["backlog", "em_progresso", "concluido"];

// ==============================
// Edit Modal
// ==============================

interface EditModalProps {
  task: BoardTask;
  onClose: () => void;
  onSave: (updated: BoardTask) => void;
}

function EditModal({ task, onClose, onSave }: EditModalProps) {
  const [form, setForm] = useState<BoardTask>({ ...task, bugsConhecidos: [...task.bugsConhecidos], qaLinks: task.qaLinks.map(l => ({ ...l })) });
  const [newBug, setNewBug] = useState("");
  const [newLinkLabel, setNewLinkLabel] = useState("");
  const [newLinkHref, setNewLinkHref] = useState("");
  const [scenarioTab, setScenarioTab] = useState(false);

  function addBug() {
    const trimmed = newBug.trim();
    if (!trimmed) return;
    setForm(f => ({ ...f, bugsConhecidos: [...f.bugsConhecidos, trimmed] }));
    setNewBug("");
  }

  function removeBug(index: number) {
    setForm(f => ({ ...f, bugsConhecidos: f.bugsConhecidos.filter((_, i) => i !== index) }));
  }

  function addLink() {
    const label = newLinkLabel.trim();
    const href = newLinkHref.trim();
    if (!label || !href) return;
    setForm(f => ({ ...f, qaLinks: [...f.qaLinks, { label, href }] }));
    setNewLinkLabel("");
    setNewLinkHref("");
  }

  function addScenarioLink(scenarioId: string, titulo: string) {
    const href = `/cenarios/${scenarioId}`;
    if (form.qaLinks.some(l => l.href === href)) return;
    setForm(f => ({ ...f, qaLinks: [...f.qaLinks, { label: `Cenário: ${titulo}`, href }] }));
  }

  function removeLink(index: number) {
    setForm(f => ({ ...f, qaLinks: f.qaLinks.filter((_, i) => i !== index) }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-800/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-card shadow-2xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 sticky top-0 bg-card z-10">
          <div className="flex items-center gap-2">
            <Pencil className="size-4 text-primary" />
            <h2 className="font-semibold">Editar tarefa <span className="font-mono text-sm text-muted-foreground">{task.id}</span></h2>
          </div>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-secondary transition-colors">
            <X className="size-4 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Título */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Título</label>
            <Input
              value={form.titulo}
              onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
              placeholder="Título da tarefa"
            />
          </div>

          {/* Descrição */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Descrição</label>
            <Textarea
              value={form.descricao}
              onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
              placeholder="Descrição da tarefa"
              rows={3}
            />
          </div>

          {/* Status + Prioridade */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as TaskStatus }))}
              >
                <option value="backlog">Backlog</option>
                <option value="em_progresso">Em Progresso</option>
                <option value="concluido">Concluído</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Prioridade</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={form.prioridade}
                onChange={e => setForm(f => ({ ...f, prioridade: e.target.value as TaskPriority }))}
              >
                <option value="critica">Crítica</option>
                <option value="alta">Alta</option>
                <option value="media">Média</option>
                <option value="baixa">Baixa</option>
              </select>
            </div>
          </div>

          {/* Módulo QA */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Módulo de QA</label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={form.qaModulo}
              onChange={e => setForm(f => ({ ...f, qaModulo: e.target.value as QaModule }))}
            >
              {Object.entries(moduleConfig).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>
          </div>

          {/* Bugs conhecidos */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
              <Bug className="size-3.5" />
              Bugs Conhecidos ({form.bugsConhecidos.length})
            </label>
            <div className="space-y-1.5">
              {form.bugsConhecidos.map((bug, i) => (
                <div key={i} className="flex items-center gap-2 rounded-md bg-secondary/60 px-3 py-1.5">
                  <span className="flex-1 text-xs text-foreground">{bug}</span>
                  <button onClick={() => removeBug(i)} className="shrink-0 rounded p-0.5 hover:bg-destructive/20 transition-colors">
                    <Trash2 className="size-3 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newBug}
                onChange={e => setNewBug(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addBug()}
                placeholder="Descrever bug e pressionar Enter"
                className="text-xs"
              />
              <Button variant="outline" size="sm" onClick={addBug} className="shrink-0">
                <Plus className="size-3.5" />
              </Button>
            </div>
          </div>

          {/* Links de QA */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
              <ExternalLink className="size-3.5" />
              Links de QA
            </label>
            <div className="space-y-1.5">
              {form.qaLinks.map((link, i) => (
                <div key={i} className="flex items-center gap-2 rounded-md bg-secondary/60 px-3 py-1.5">
                  <span className="flex-1 text-xs text-primary truncate">{link.label}</span>
                  <span className="text-xs text-muted-foreground truncate max-w-35">{link.href}</span>
                  <button onClick={() => removeLink(i)} className="shrink-0 rounded p-0.5 hover:bg-destructive/20 transition-colors">
                    <Trash2 className="size-3 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              ))}
            </div>

            {/* Tabs: Manual / Cenários */}
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="flex border-b border-border">
                <button
                  className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${!scenarioTab ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setScenarioTab(false)}
                >
                  Link manual
                </button>
                <button
                  className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${scenarioTab ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setScenarioTab(true)}
                >
                  Cenários de Teste
                </button>
              </div>

              {!scenarioTab ? (
                <div className="p-3 flex gap-2">
                  <Input
                    value={newLinkLabel}
                    onChange={e => setNewLinkLabel(e.target.value)}
                    placeholder="Rótulo do link"
                    className="text-xs"
                  />
                  <Input
                    value={newLinkHref}
                    onChange={e => setNewLinkHref(e.target.value)}
                    placeholder="/caminho"
                    className="text-xs"
                  />
                  <Button variant="outline" size="sm" onClick={addLink} className="shrink-0">
                    <Plus className="size-3.5" />
                  </Button>
                </div>
              ) : (
                <div className="p-3 space-y-1.5 max-h-48 overflow-y-auto">
                  {scenarios.map(s => {
                    const linked = form.qaLinks.some(l => l.href === `/cenarios/${s.id}`);
                    return (
                      <div key={s.id} className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 hover:bg-secondary/60 transition-colors">
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">{s.titulo}</p>
                          <p className="text-xs text-muted-foreground truncate">{s.descricao}</p>
                        </div>
                        <button
                          onClick={() => addScenarioLink(s.id, s.titulo)}
                          disabled={linked}
                          className={`shrink-0 rounded-md px-2 py-1 text-xs font-medium transition-colors ${linked ? "text-green-600 bg-green-100 cursor-default" : "text-primary bg-primary/10 hover:bg-primary/20"}`}
                        >
                          {linked ? "Adicionado" : "Adicionar"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4 sticky bottom-0 bg-card">
          <Button variant="outline" size="sm" onClick={onClose}>Cancelar</Button>
          <Button size="sm" onClick={() => onSave(form)}>Salvar alterações</Button>
        </div>
      </div>
    </div>
  );
}

// ==============================
// Task Card
// ==============================

function TaskCard({ task, onEdit }: { task: BoardTask; onEdit: (task: BoardTask) => void }) {
  const priority = priorityConfig[task.prioridade];
  const module = moduleConfig[task.qaModulo];
  const ModuleIcon = module.icon;

  return (
    <Card className="group flex flex-col gap-0 p-0 overflow-hidden transition-colors hover:border-primary/30">
      <div className={`h-0.5 w-full ${priority.barColor}`} />

      <CardHeader className="px-4 pt-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <span className="font-mono text-xs text-muted-foreground">{task.id}</span>
          <div className="flex items-center gap-1.5">
            <Badge className={`text-xs shrink-0 ${priority.className}`}>
              {priority.label}
            </Badge>
            <button
              onClick={() => onEdit(task)}
              className="rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-secondary"
              title="Editar tarefa"
            >
              <Pencil className="size-3 text-muted-foreground" />
            </button>
          </div>
        </div>
        <CardTitle className="text-sm font-semibold leading-snug mt-1">
          {task.titulo}
        </CardTitle>
        <p className="text-xs text-muted-foreground leading-relaxed mt-1">
          {task.descricao}
        </p>
      </CardHeader>

      <CardContent className="px-4 pb-4 flex flex-col gap-3 mt-auto">
        {/* Módulo QA */}
        <div className="flex items-center gap-1.5">
          <ModuleIcon className={`size-3.5 shrink-0 ${module.color}`} />
          <span className={`text-xs font-medium ${module.color}`}>{module.label}</span>
        </div>

        {/* Bugs conhecidos */}
        {task.bugsConhecidos.length > 0 && (
          <div className="rounded-md bg-secondary/60 px-3 py-2 space-y-1">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Bug className="size-3" />
              {task.bugsConhecidos.length} bug{task.bugsConhecidos.length > 1 ? "s" : ""} conhecidos
            </p>
            <ul className="space-y-0.5">
              {task.bugsConhecidos.slice(0, 2).map((bug, i) => (
                <li key={i} className="text-xs text-muted-foreground truncate">· {bug}</li>
              ))}
              {task.bugsConhecidos.length > 2 && (
                <li className="text-xs text-muted-foreground">
                  · +{task.bugsConhecidos.length - 2} mais...
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Links de QA */}
        {task.qaLinks.length > 0 && (
          <div className="flex flex-col gap-1">
            {task.qaLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
              >
                <ExternalLink className="size-3 shrink-0" />
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-border">
          <span className="text-xs text-muted-foreground">
            {task.objetivos} objetivo{task.objetivos > 1 ? "s" : ""}
          </span>
          {task.qaLinks[0] && (
            <Link href={task.qaLinks[0].href}>
              <Button variant="ghost" size="xs" className="h-6 gap-1 text-xs">
                Testar
                <ChevronRight className="size-3" />
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ==============================
// Column
// ==============================

function Column({ status, tasks, onEdit }: { status: TaskStatus; tasks: BoardTask[]; onEdit: (task: BoardTask) => void }) {
  const config = statusConfig[status];

  return (
    <div className="flex flex-col gap-3 min-w-0">
      <div className="flex items-center gap-2 px-1">
        <span className={`size-2 rounded-full shrink-0 ${config.dotColor}`} />
        <h3 className={`text-sm font-semibold ${config.color}`}>{config.label}</h3>
        <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-secondary text-xs font-medium text-muted-foreground">
          {tasks.length}
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {tasks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-6 text-center">
            <p className="text-xs text-muted-foreground">Nenhuma tarefa</p>
          </div>
        ) : (
          tasks.map(task => <TaskCard key={task.id} task={task} onEdit={onEdit} />)
        )}
      </div>
    </div>
  );
}

// ==============================
// Stats bar
// ==============================

function StatsBar({ tasks }: { tasks: BoardTask[] }) {
  const total = tasks.length;
  const concluidas = tasks.filter(t => t.status === "concluido").length;
  const emProgresso = tasks.filter(t => t.status === "em_progresso").length;
  const backlog = tasks.filter(t => t.status === "backlog").length;
  const totalBugs = tasks.reduce((acc, t) => acc + t.bugsConhecidos.length, 0);
  const progressPercent = Math.round((concluidas / total) * 100);

  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-8">
            <span className="text-xs text-muted-foreground">Progresso geral</span>
            <span className="text-xs font-bold text-foreground">{progressPercent}%</span>
          </div>
          <div className="h-1.5 w-40 rounded-full bg-secondary">
            <div
              className="h-1.5 rounded-full bg-primary transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
      <div className="h-6 w-px bg-border" />
      <div className="flex items-center gap-5 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-muted-foreground" />
          <span className="text-muted-foreground">Backlog</span>
          <span className="font-bold text-foreground">{backlog}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-blue-400" />
          <span className="text-muted-foreground">Em progresso</span>
          <span className="font-bold text-foreground">{emProgresso}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-green-600" />
          <span className="text-muted-foreground">Concluído</span>
          <span className="font-bold text-foreground">{concluidas}</span>
        </div>
      </div>
      <div className="h-6 w-px bg-border" />
      <div className="flex items-center gap-1.5 text-xs">
        <Bug className="size-3.5 text-rose-400" />
        <span className="text-muted-foreground">Bugs mapeados</span>
        <span className="font-bold text-foreground">{totalBugs}</span>
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

  const tasksByStatus = (status: TaskStatus) => tasks.filter(t => t.status === status);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 animate-slide-in-up">
        <Link
          href="/ecommerce"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="size-4" />
          Voltar à loja
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ClipboardList className="size-5 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight">Board de Tarefas</h1>
            </div>
            <p className="text-sm text-muted-foreground max-w-xl">
              Histórias de desenvolvimento do e-commerce. Clique em{" "}
              <Pencil className="size-3 inline" /> para editar qualquer tarefa e vincular cenários de teste.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/api-playground">
              <Button variant="outline" size="sm" className="gap-2">
                <Activity className="size-4" />
                API Playground
              </Button>
            </Link>
            <Link href="/cenarios">
              <Button variant="outline" size="sm" className="gap-2">
                <ListChecks className="size-4" />
                Cenários
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="rounded-lg border border-border bg-card px-4 py-3">
          <StatsBar tasks={tasks} />
        </div>
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 stagger">
        {columns.map(status => (
          <Column
            key={status}
            status={status}
            tasks={tasksByStatus(status)}
            onEdit={setEditingTask}
          />
        ))}
      </div>

      {/* Legenda de módulos */}
      <div className="rounded-lg border border-border bg-card px-4 py-3">
        <p className="text-xs font-medium text-muted-foreground mb-3">Módulos de QA disponíveis</p>
        <div className="flex flex-wrap gap-4">
          {Object.entries(moduleConfig).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <div key={key} className="flex items-center gap-1.5">
                <Icon className={`size-3.5 ${config.color}`} />
                <span className="text-xs text-muted-foreground">{config.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Modal */}
      {editingTask && (
        <EditModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
