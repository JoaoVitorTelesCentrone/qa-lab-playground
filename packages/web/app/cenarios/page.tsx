"use client";

import { useState } from "react";
import Link from "next/link";
import { scenarios } from "@qa-lab/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FolderOpen,
  Folder,
  FileText,
  Plus,
  Trash2,
  Play,
  Pencil,
  X,
  ChevronRight,
  ChevronDown,
  ListChecks,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Circle,
  Search,
} from "lucide-react";

// ==============================
// Types
// ==============================

type CaseStatus = "nao_executado" | "passou" | "falhou" | "bloqueado";
type CasePriority = "alta" | "media" | "baixa";

interface TestCase {
  id: string;
  titulo: string;
  descricao: string;
  status: CaseStatus;
  prioridade: CasePriority;
  scenarioId?: string; // link para /cenarios/[id]
  passos: string[];
}

interface TestSuite {
  id: string;
  nome: string;
  casos: TestCase[];
  expanded: boolean;
}

interface TestPlan {
  id: string;
  nome: string;
  suites: TestSuite[];
  expanded: boolean;
}

// ==============================
// Initial Data
// ==============================

function makeId() {
  return Math.random().toString(36).slice(2, 8);
}

const initialPlans: TestPlan[] = [
  {
    id: "plan-1",
    nome: "E-commerce QA Plan",
    expanded: true,
    suites: [
      {
        id: "suite-1",
        nome: "Smoke — API",
        expanded: false,
        casos: [
          {
            id: "tc-001",
            titulo: "Validar listagem de usuários",
            descricao: "Verificar se GET /api/users retorna dados paginados e consistentes.",
            status: "nao_executado",
            prioridade: "alta",
            scenarioId: "validar-listagem-usuarios",
            passos: ["Fazer GET /api/users", "Verificar campos id, nome, email", "Testar paginação"],
          },
          {
            id: "tc-002",
            titulo: "Testar busca de produtos com edge cases",
            descricao: "Explorar os limites da API de produtos com inputs inesperados.",
            status: "nao_executado",
            prioridade: "alta",
            scenarioId: "testar-busca-produtos",
            passos: ["GET /api/products com page=0", "GET /api/products/:id com id inválido", "Ativar Chaos Mode"],
          },
          {
            id: "tc-003",
            titulo: "Saúde da API — GET /api/health",
            descricao: "Verificar se o health check reporta o status real dos serviços.",
            status: "nao_executado",
            prioridade: "media",
            passos: ["Fazer GET /api/health com serviços normais", "Ativar Chaos Mode e refazer request", "Comparar respostas"],
          },
        ],
      },
      {
        id: "suite-2",
        nome: "Regressão — Pedidos",
        expanded: false,
        casos: [
          {
            id: "tc-004",
            titulo: "Identificar resposta inconsistente",
            descricao: "Verificar se GET /api/orders/:id retorna formatos diferentes a cada request.",
            status: "nao_executado",
            prioridade: "alta",
            scenarioId: "resposta-inconsistente",
            passos: ["Fazer 5 requests para GET /api/orders/1", "Comparar campos retornados", "Contar formatos diferentes"],
          },
          {
            id: "tc-005",
            titulo: "Validar tratamento de erros no pedido",
            descricao: "Enviar dados inválidos e verificar se a API responde com erros descritivos.",
            status: "nao_executado",
            prioridade: "alta",
            scenarioId: "validar-erros-pedido",
            passos: ["POST /api/orders com body vazio", "POST /api/orders com produtoId inexistente", "Ativar Chaos e tentar criar pedido"],
          },
        ],
      },
      {
        id: "suite-3",
        nome: "E-commerce — Checkout",
        expanded: false,
        casos: [
          {
            id: "tc-006",
            titulo: "Fluxo de compra completo",
            descricao: "Adicionar produto ao carrinho, calcular frete e finalizar pedido.",
            status: "nao_executado",
            prioridade: "alta",
            passos: [
              "Adicionar produto com estoque > 0 ao carrinho",
              "Tentar adicionar mais que o estoque",
              "Informar CEP e calcular frete",
              "Aplicar cupom BUGADO10",
              "Clicar em Finalizar Compra",
            ],
          },
        ],
      },
    ],
  },
];

// ==============================
// Config maps
// ==============================

const statusConfig: Record<CaseStatus, { label: string; icon: React.ElementType; className: string; next: CaseStatus }> = {
  nao_executado: { label: "Não executado", icon: Circle,       className: "text-off-white/60 bg-off-white/10",   next: "passou" },
  passou:        { label: "Passou",         icon: CheckCircle2, className: "text-neon bg-neon/20",               next: "falhou" },
  falhou:        { label: "Falhou",         icon: XCircle,      className: "text-coral bg-coral/20",             next: "bloqueado" },
  bloqueado:     { label: "Bloqueado",      icon: MinusCircle,  className: "text-[#F4A8A3] bg-[#F4A8A3]/20",    next: "nao_executado" },
};

const priorityConfig: Record<CasePriority, { label: string; className: string }> = {
  alta:  { label: "Alta",  className: "bg-coral/20 text-coral border-coral/30" },
  media: { label: "Média", className: "bg-[#F4A8A3]/20 text-[#F4A8A3] border-[#F4A8A3]/30" },
  baixa: { label: "Baixa", className: "bg-off-white/10 text-off-white/60 border-off-white/20" },
};

// ==============================
// Modals
// ==============================

interface NewSuiteModalProps {
  onClose: () => void;
  onConfirm: (nome: string) => void;
}

function NewSuiteModal({ onClose, onConfirm }: NewSuiteModalProps) {
  const [nome, setNome] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-dark-green/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-mint/20 bg-[#405555] shadow-2xl mx-4">
        <div className="flex items-center justify-between border-b border-mint/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <Folder className="size-4 text-mint" />
            <h2 className="font-bold text-sm uppercase tracking-wide text-off-white">Nova Suite</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-off-white/10"><X className="size-4 text-off-white/50" /></button>
        </div>
        <div className="p-5 space-y-3">
          <label className="text-xs font-bold text-off-white/50 uppercase tracking-wide">Nome da suite</label>
          <Input
            autoFocus
            value={nome}
            onChange={e => setNome(e.target.value)}
            onKeyDown={e => e.key === "Enter" && nome.trim() && onConfirm(nome.trim())}
            placeholder="Ex: Regressão — Login"
          />
        </div>
        <div className="flex justify-end gap-2 border-t border-mint/10 px-5 py-4">
          <Button variant="outline" size="sm" onClick={onClose}>Cancelar</Button>
          <Button size="sm" disabled={!nome.trim()} onClick={() => onConfirm(nome.trim())}>Criar</Button>
        </div>
      </div>
    </div>
  );
}

interface NewCaseModalProps {
  onClose: () => void;
  onConfirm: (tc: Omit<TestCase, "id">) => void;
  existingScenarioIds: string[];
}

function NewCaseModal({ onClose, onConfirm, existingScenarioIds }: NewCaseModalProps) {
  const [tab, setTab] = useState<"manual" | "cenario">("cenario");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [prioridade, setPrioridade] = useState<CasePriority>("media");
  const [passoInput, setPassoInput] = useState("");
  const [passos, setPassos] = useState<string[]>([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState("");
  const [search, setSearch] = useState("");

  const availableScenarios = scenarios.filter(
    s => !existingScenarioIds.includes(s.id) &&
         s.titulo.toLowerCase().includes(search.toLowerCase())
  );

  function addPasso() {
    const p = passoInput.trim();
    if (!p) return;
    setPassos(prev => [...prev, p]);
    setPassoInput("");
  }

  function handleConfirm() {
    if (tab === "cenario" && selectedScenarioId) {
      const s = scenarios.find(sc => sc.id === selectedScenarioId)!;
      onConfirm({
        titulo: s.titulo,
        descricao: s.descricao,
        status: "nao_executado",
        prioridade,
        scenarioId: s.id,
        passos: s.objetivos.map(o => o.descricao),
      });
    } else if (tab === "manual" && titulo.trim()) {
      onConfirm({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        status: "nao_executado",
        prioridade,
        passos,
      });
    }
  }

  const canConfirm = tab === "cenario" ? !!selectedScenarioId : !!titulo.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-dark-green/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-mint/20 bg-[#405555] shadow-2xl mx-4">
        <div className="flex items-center justify-between border-b border-mint/10 px-5 py-4 sticky top-0 bg-[#405555]">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-mint" />
            <h2 className="font-bold text-sm uppercase tracking-wide text-off-white">Novo Caso de Teste</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-off-white/10"><X className="size-4 text-off-white/50" /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-mint/10">
          <button
            className={`flex-1 px-4 py-2.5 text-xs font-bold uppercase tracking-wide transition-colors ${tab === "cenario" ? "border-b-2 border-mint text-mint bg-mint/5" : "text-off-white/40 hover:text-off-white"}`}
            onClick={() => setTab("cenario")}
          >
            Vincular cenário existente
          </button>
          <button
            className={`flex-1 px-4 py-2.5 text-xs font-bold uppercase tracking-wide transition-colors ${tab === "manual" ? "border-b-2 border-mint text-mint bg-mint/5" : "text-off-white/40 hover:text-off-white"}`}
            onClick={() => setTab("manual")}
          >
            Criar manualmente
          </button>
        </div>

        <div className="p-5 space-y-4">
          {tab === "cenario" ? (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-off-white/40" />
                <Input
                  placeholder="Buscar cenário..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-8 text-xs"
                />
              </div>
              {availableScenarios.length === 0 ? (
                <p className="text-xs text-off-white/40 text-center py-4">
                  {existingScenarioIds.length >= scenarios.length ? "Todos os cenários já estão nesta suite." : "Nenhum cenário encontrado."}
                </p>
              ) : (
                <div className="space-y-2">
                  {availableScenarios.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedScenarioId(s.id)}
                      className={`w-full text-left rounded-xl border px-4 py-3 transition-colors ${selectedScenarioId === s.id ? "border-mint/40 bg-mint/10" : "border-mint/10 hover:border-mint/30 hover:bg-off-white/5"}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-off-white">{s.titulo}</p>
                          <p className="text-xs text-off-white/50 mt-0.5">{s.descricao}</p>
                          <p className="text-xs text-off-white/40 mt-1">{s.objetivos.length} objetivos</p>
                        </div>
                        {selectedScenarioId === s.id && (
                          <CheckCircle2 className="size-4 text-mint shrink-0 mt-0.5" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-off-white/50 uppercase tracking-wide">Prioridade</label>
                <select
                  className="flex h-9 w-full rounded-xl border border-mint/20 bg-dark-green/40 text-off-white px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-mint/30"
                  value={prioridade}
                  onChange={e => setPrioridade(e.target.value as CasePriority)}
                >
                  <option value="alta">Alta</option>
                  <option value="media">Média</option>
                  <option value="baixa">Baixa</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-off-white/50 uppercase tracking-wide">Título *</label>
                <Input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ex: Verificar validação de e-mail" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-off-white/50 uppercase tracking-wide">Descrição</label>
                <Textarea value={descricao} onChange={e => setDescricao(e.target.value)} rows={2} placeholder="Objetivo do teste..." />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-off-white/50 uppercase tracking-wide">Prioridade</label>
                <select
                  className="flex h-9 w-full rounded-xl border border-mint/20 bg-dark-green/40 text-off-white px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-mint/30"
                  value={prioridade}
                  onChange={e => setPrioridade(e.target.value as CasePriority)}
                >
                  <option value="alta">Alta</option>
                  <option value="media">Média</option>
                  <option value="baixa">Baixa</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-off-white/50 uppercase tracking-wide">Passos</label>
                <div className="space-y-1.5">
                  {passos.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-xl bg-off-white/5 px-3 py-1.5">
                      <span className="shrink-0 font-mono text-xs text-off-white/40 w-4">{i + 1}.</span>
                      <span className="flex-1 text-xs text-off-white/80">{p}</span>
                      <button onClick={() => setPassos(prev => prev.filter((_, idx) => idx !== i))}>
                        <X className="size-3 text-off-white/40 hover:text-coral" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={passoInput}
                    onChange={e => setPassoInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addPasso()}
                    placeholder="Descrever passo e pressionar Enter"
                    className="text-xs"
                  />
                  <Button variant="outline" size="sm" onClick={addPasso} className="shrink-0">
                    <Plus className="size-3.5" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-mint/10 px-5 py-4 sticky bottom-0 bg-[#405555]">
          <Button variant="outline" size="sm" onClick={onClose}>Cancelar</Button>
          <Button size="sm" disabled={!canConfirm} onClick={handleConfirm}>Adicionar caso</Button>
        </div>
      </div>
    </div>
  );
}

// ==============================
// Test Case Table
// ==============================

interface TestCaseTableProps {
  suite: TestSuite;
  planId: string;
  onStatusChange: (planId: string, suiteId: string, caseId: string, next: CaseStatus) => void;
  onDelete: (planId: string, suiteId: string, caseId: string) => void;
  onAddCase: () => void;
}

function TestCaseTable({ suite, planId, onStatusChange, onDelete, onAddCase }: TestCaseTableProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggleExpand(id: string) {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const passou = suite.casos.filter(c => c.status === "passou").length;
  const falhou = suite.casos.filter(c => c.status === "falhou").length;
  const total = suite.casos.length;

  return (
    <div className="flex flex-col gap-4">
      {/* Suite header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderOpen className="size-4 text-mint" />
          <h2 className="font-bold text-off-white">{suite.nome}</h2>
          <span className="text-xs text-off-white/40">{total} caso{total !== 1 ? "s" : ""}</span>
        </div>
        <div className="flex items-center gap-3">
          {total > 0 && (
            <div className="flex items-center gap-2 text-xs text-off-white/50">
              <span className="text-neon font-bold">{passou} passou</span>
              <span>·</span>
              <span className="text-coral font-bold">{falhou} falhou</span>
              <span>·</span>
              <span>{total - passou - falhou} pendente</span>
            </div>
          )}
          <Button size="sm" onClick={onAddCase} className="gap-1.5">
            <Plus className="size-3.5" />
            Novo Caso
          </Button>
        </div>
      </div>

      {total === 0 ? (
        <div className="rounded-2xl border border-dashed border-mint/20 p-10 text-center">
          <FileText className="size-8 text-off-white/20 mx-auto mb-2" />
          <p className="text-sm text-off-white/50">Nenhum caso de teste nesta suite.</p>
          <Button variant="outline" size="sm" className="mt-3 gap-1.5" onClick={onAddCase}>
            <Plus className="size-3.5" />
            Adicionar primeiro caso
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-mint/10 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[32px_60px_1fr_90px_130px_80px] gap-x-3 items-center border-b border-mint/10 bg-dark-green/60 px-3 py-2">
            <span />
            <span className="text-xs font-bold uppercase tracking-wide text-off-white/40">ID</span>
            <span className="text-xs font-bold uppercase tracking-wide text-off-white/40">Título</span>
            <span className="text-xs font-bold uppercase tracking-wide text-off-white/40">Prioridade</span>
            <span className="text-xs font-bold uppercase tracking-wide text-off-white/40">Status</span>
            <span className="text-xs font-bold uppercase tracking-wide text-off-white/40">Ações</span>
          </div>

          {/* Rows */}
          {suite.casos.map((tc, idx) => {
            const status = statusConfig[tc.status];
            const priority = priorityConfig[tc.prioridade];
            const StatusIcon = status.icon;
            const isExpanded = expanded.has(tc.id);

            return (
              <div key={tc.id} className="border-b border-mint/10 last:border-0">
                <div className="grid grid-cols-[32px_60px_1fr_90px_130px_80px] gap-x-3 items-center px-3 py-2.5 hover:bg-off-white/5 transition-colors">
                  {/* Expand */}
                  <button
                    onClick={() => toggleExpand(tc.id)}
                    className="flex items-center justify-center rounded-lg p-0.5 hover:bg-off-white/10"
                  >
                    {isExpanded
                      ? <ChevronDown className="size-3.5 text-off-white/40" />
                      : <ChevronRight className="size-3.5 text-off-white/40" />
                    }
                  </button>

                  {/* ID */}
                  <span className="font-mono text-xs text-off-white/40">
                    TC-{String(idx + 1).padStart(3, "0")}
                  </span>

                  {/* Title */}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-off-white truncate">{tc.titulo}</p>
                    {tc.descricao && (
                      <p className="text-xs text-off-white/50 truncate">{tc.descricao}</p>
                    )}
                  </div>

                  {/* Priority */}
                  <Badge className={`text-xs w-fit ${priority.className}`}>
                    {priority.label}
                  </Badge>

                  {/* Status — clicável para ciclar */}
                  <button
                    onClick={() => onStatusChange(planId, suite.id, tc.id, status.next)}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-bold uppercase tracking-wide transition-colors hover:opacity-80 ${status.className}`}
                    title="Clique para alterar status"
                  >
                    <StatusIcon className="size-3 shrink-0" />
                    {status.label}
                  </button>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {tc.scenarioId ? (
                      <Link href={`/cenarios/${tc.scenarioId}`}>
                        <Button variant="ghost" size="xs" className="h-7 gap-1 text-xs text-mint">
                          <Play className="size-3" />
                          Executar
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="ghost" size="xs" className="h-7 gap-1 text-xs" disabled>
                        <Play className="size-3" />
                        Executar
                      </Button>
                    )}
                    <button
                      onClick={() => onDelete(planId, suite.id, tc.id)}
                      className="rounded-lg p-1 hover:bg-coral/10 transition-colors"
                    >
                      <Trash2 className="size-3.5 text-off-white/40 hover:text-coral" />
                    </button>
                  </div>
                </div>

                {/* Expanded — passos */}
                {isExpanded && tc.passos.length > 0 && (
                  <div className="px-12 pb-3 pt-1 bg-off-white/5">
                    <p className="text-xs font-bold uppercase tracking-wide text-off-white/40 mb-2">Passos</p>
                    <ol className="space-y-1">
                      {tc.passos.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-off-white/60">
                          <span className="font-mono shrink-0 w-4">{i + 1}.</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ==============================
// Suite Tree Item
// ==============================

interface SuiteItemProps {
  suite: TestSuite;
  planId: string;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onToggle: () => void;
}

function SuiteItem({ suite, planId, isSelected, onSelect, onDelete, onToggle }: SuiteItemProps) {
  const [hovered, setHovered] = useState(false);
  const passou = suite.casos.filter(c => c.status === "passou").length;
  const falhou = suite.casos.filter(c => c.status === "falhou").length;

  return (
    <div
      className={`group flex items-center gap-1.5 rounded-xl px-2 py-1.5 cursor-pointer transition-colors ${isSelected ? "bg-mint/20 text-mint" : "hover:bg-off-white/5 text-off-white/70"}`}
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Folder className={`size-3.5 shrink-0 ${isSelected ? "text-mint" : "text-off-white/40"}`} />
      <span className="flex-1 text-xs font-medium truncate">{suite.nome}</span>
      <span className="text-xs text-off-white/40 shrink-0">{suite.casos.length}</span>
      {(hovered || isSelected) && (
        <button
          onClick={e => { e.stopPropagation(); onDelete(); }}
          className="rounded-lg p-0.5 hover:bg-coral/20 transition-colors shrink-0"
        >
          <Trash2 className="size-3 text-off-white/40 hover:text-coral" />
        </button>
      )}
    </div>
  );
}

// ==============================
// Plan Tree Item
// ==============================

interface PlanItemProps {
  plan: TestPlan;
  selectedSuiteId: string | null;
  onSelectSuite: (suiteId: string) => void;
  onTogglePlan: () => void;
  onDeleteSuite: (suiteId: string) => void;
  onAddSuite: () => void;
}

function PlanItem({ plan, selectedSuiteId, onSelectSuite, onTogglePlan, onDeleteSuite, onAddSuite }: PlanItemProps) {
  const totalCases = plan.suites.reduce((acc, s) => acc + s.casos.length, 0);

  return (
    <div className="space-y-0.5">
      <button
        onClick={onTogglePlan}
        className="w-full flex items-center gap-1.5 rounded-xl px-2 py-1.5 hover:bg-off-white/5 transition-colors"
      >
        {plan.expanded
          ? <ChevronDown className="size-3.5 shrink-0 text-off-white/40" />
          : <ChevronRight className="size-3.5 shrink-0 text-off-white/40" />
        }
        <ListChecks className="size-3.5 shrink-0 text-mint" />
        <span className="flex-1 text-left text-xs font-bold uppercase tracking-wide text-off-white/80 truncate">{plan.nome}</span>
        <span className="text-xs text-off-white/40 shrink-0">{totalCases}</span>
      </button>

      {plan.expanded && (
        <div className="ml-4 space-y-0.5 border-l border-mint/10 pl-2">
          {plan.suites.map(suite => (
            <SuiteItem
              key={suite.id}
              suite={suite}
              planId={plan.id}
              isSelected={selectedSuiteId === suite.id}
              onSelect={() => onSelectSuite(suite.id)}
              onDelete={() => onDeleteSuite(suite.id)}
              onToggle={() => {}}
            />
          ))}
          <button
            onClick={e => { e.stopPropagation(); onAddSuite(); }}
            className="flex w-full items-center gap-1.5 rounded-xl px-2 py-1 text-xs text-off-white/40 hover:text-mint hover:bg-mint/5 transition-colors"
          >
            <Plus className="size-3" />
            Nova Suite
          </button>
        </div>
      )}
    </div>
  );
}

// ==============================
// Page
// ==============================

export default function CenariosPage() {
  const [plans, setPlans] = useState<TestPlan[]>(initialPlans);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("plan-1");
  const [selectedSuiteId, setSelectedSuiteId] = useState<string>("suite-1");
  const [showNewSuite, setShowNewSuite] = useState(false);
  const [showNewCase, setShowNewCase] = useState(false);
  const [targetPlanForSuite, setTargetPlanForSuite] = useState<string>("");

  // ---- helpers ----

  const selectedPlan = plans.find(p => p.id === selectedPlanId);
  const selectedSuite = selectedPlan?.suites.find(s => s.id === selectedSuiteId) ?? null;

  function togglePlan(planId: string) {
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, expanded: !p.expanded } : p));
  }

  function selectSuite(planId: string, suiteId: string) {
    setSelectedPlanId(planId);
    setSelectedSuiteId(suiteId);
  }

  function openNewSuite(planId: string) {
    setTargetPlanForSuite(planId);
    setShowNewSuite(true);
  }

  function addSuite(nome: string) {
    const newSuite: TestSuite = { id: makeId(), nome, casos: [], expanded: false };
    setPlans(prev => prev.map(p =>
      p.id === targetPlanForSuite ? { ...p, suites: [...p.suites, newSuite] } : p
    ));
    setSelectedPlanId(targetPlanForSuite);
    setSelectedSuiteId(newSuite.id);
    setShowNewSuite(false);
  }

  function deleteSuite(planId: string, suiteId: string) {
    setPlans(prev => prev.map(p =>
      p.id === planId ? { ...p, suites: p.suites.filter(s => s.id !== suiteId) } : p
    ));
    if (selectedSuiteId === suiteId) {
      const plan = plans.find(p => p.id === planId);
      const remaining = plan?.suites.filter(s => s.id !== suiteId) ?? [];
      setSelectedSuiteId(remaining[0]?.id ?? "");
    }
  }

  function addCase(tc: Omit<TestCase, "id">) {
    const newCase: TestCase = { ...tc, id: makeId() };
    setPlans(prev => prev.map(p =>
      p.id === selectedPlanId
        ? { ...p, suites: p.suites.map(s => s.id === selectedSuiteId ? { ...s, casos: [...s.casos, newCase] } : s) }
        : p
    ));
    setShowNewCase(false);
  }

  function deleteCase(planId: string, suiteId: string, caseId: string) {
    setPlans(prev => prev.map(p =>
      p.id === planId
        ? { ...p, suites: p.suites.map(s => s.id === suiteId ? { ...s, casos: s.casos.filter(c => c.id !== caseId) } : s) }
        : p
    ));
  }

  function changeStatus(planId: string, suiteId: string, caseId: string, next: CaseStatus) {
    setPlans(prev => prev.map(p =>
      p.id === planId
        ? { ...p, suites: p.suites.map(s =>
            s.id === suiteId
              ? { ...s, casos: s.casos.map(c => c.id === caseId ? { ...c, status: next } : c) }
              : s
          )}
        : p
    ));
  }

  const existingScenarioIds = selectedSuite?.casos.map(c => c.scenarioId).filter(Boolean) as string[] ?? [];

  // Global stats
  const allCases = plans.flatMap(p => p.suites.flatMap(s => s.casos));
  const totalPassed = allCases.filter(c => c.status === "passou").length;
  const totalFailed = allCases.filter(c => c.status === "falhou").length;
  const totalBlocked = allCases.filter(c => c.status === "bloqueado").length;
  const totalPending = allCases.length - totalPassed - totalFailed - totalBlocked;

  return (
    <div className="flex flex-col gap-4 h-full animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 animate-slide-in-up">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-xl bg-mint/20">
              <ListChecks className="size-5 text-mint" />
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wider text-mint italic">
                CENÁRIOS
              </h1>
              <p className="text-sm text-mint/50 uppercase tracking-[0.15em]">
                Organize seus testes em suites
              </p>
            </div>
          </div>
        </div>
        {/* Global stats */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="size-2 rounded-full bg-neon" />
            <span className="text-off-white/50">{totalPassed} passou</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="size-2 rounded-full bg-coral" />
            <span className="text-off-white/50">{totalFailed} falhou</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="size-2 rounded-full bg-[#F4A8A3]" />
            <span className="text-off-white/50">{totalBlocked} bloqueado</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="size-2 rounded-full bg-off-white/30" />
            <span className="text-off-white/50">{totalPending} pendente</span>
          </div>
        </div>
      </div>

      {/* Layout: tree + content */}
      <div className="flex gap-4 min-h-0 flex-1">
        {/* Left — Test Suite Tree */}
        <div className="w-64 shrink-0 flex flex-col gap-2 rounded-2xl border border-mint/10 bg-dark-green/40 p-3">
          <p className="text-xs font-bold text-off-white/50 uppercase tracking-wider px-1">Test Plans</p>
          <div className="flex-1 space-y-1 overflow-y-auto">
            {plans.map(plan => (
              <PlanItem
                key={plan.id}
                plan={plan}
                selectedSuiteId={selectedSuiteId}
                onSelectSuite={(suiteId) => selectSuite(plan.id, suiteId)}
                onTogglePlan={() => togglePlan(plan.id)}
                onDeleteSuite={(suiteId) => deleteSuite(plan.id, suiteId)}
                onAddSuite={() => openNewSuite(plan.id)}
              />
            ))}
          </div>
        </div>

        {/* Right — Test Case Table */}
        <div className="flex-1 min-w-0 rounded-2xl border border-mint/10 bg-dark-green/30 p-5 overflow-y-auto">
          {selectedSuite ? (
            <TestCaseTable
              suite={selectedSuite}
              planId={selectedPlanId}
              onStatusChange={changeStatus}
              onDelete={deleteCase}
              onAddCase={() => setShowNewCase(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <Folder className="size-10 text-off-white/20 mx-auto mb-2" />
                <p className="text-sm text-off-white/40">Selecione uma suite no painel esquerdo.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showNewSuite && (
        <NewSuiteModal
          onClose={() => setShowNewSuite(false)}
          onConfirm={addSuite}
        />
      )}
      {showNewCase && selectedSuite && (
        <NewCaseModal
          onClose={() => setShowNewCase(false)}
          onConfirm={addCase}
          existingScenarioIds={existingScenarioIds}
        />
      )}

    </div>
  );
}
