"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Plus, Search, Download, Trash2, Edit2,
  TrendingDown, TrendingUp, Wallet, BarChart2,
  List, X, Tag, AlertTriangle, CheckCircle2, Info,
} from "lucide-react";

// ── Toast ──────────────────────────────────────────────────────────────────────

type ToastType = "success" | "error" | "info";
interface Toast { id: number; message: string; type: ToastType; }

function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  let counter = 0;

  const add = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now() + counter++;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, add, remove };
}

const TOAST_STYLES: Record<ToastType, string> = {
  success: "bg-neon/20 border-neon/40 text-neon",
  error:   "bg-coral/20 border-coral/40 text-coral",
  info:    "bg-mint/20 border-mint/40 text-mint",
};

const TOAST_ICON: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="size-4 shrink-0" />,
  error:   <AlertTriangle className="size-4 shrink-0" />,
  info:    <Info className="size-4 shrink-0" />,
};

function ToastContainer({ toasts, remove }: { toasts: Toast[]; remove: (id: number) => void }) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed top-5 right-5 z-[60] flex flex-col gap-2 w-72">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium animate-slide-in-right ${TOAST_STYLES[t.type]}`}
        >
          {TOAST_ICON[t.type]}
          <span className="flex-1">{t.message}</span>
          <button onClick={() => remove(t.id)} className="opacity-60 hover:opacity-100 transition-opacity">
            <X className="size-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Types ──────────────────────────────────────────────────────────────────────

interface Despesa {
  id: number;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  tipo: "despesa" | "receita";
}

interface Categoria {
  id: string;
  label: string;
  cor: string;
}

type SortField = "data" | "valor" | "descricao";
type SortDir   = "asc" | "desc";
type FiltroTipo = "all" | "despesa" | "receita";

const ITEMS_PER_PAGE = 8;

// ── Seed data ──────────────────────────────────────────────────────────────────

const CORES_EXTRA = ["#9BB5DE", "#F4C87E", "#C5A8DE", "#8DD5D0", "#F7D733", "#A8D5A2"];

const CATS_PADRAO: Categoria[] = [
  { id: "Moradia",     label: "Moradia",     cor: "#B4D4D1" },
  { id: "Alimentação", label: "Alimentação", cor: "#D4F56E" },
  { id: "Transporte",  label: "Transporte",  cor: "#E8A5A0" },
  { id: "Lazer",       label: "Lazer",       cor: "#9BB5DE" },
  { id: "Saúde",       label: "Saúde",       cor: "#A8D5A2" },
  { id: "Educação",    label: "Educação",    cor: "#F4C87E" },
  { id: "Receita",     label: "Receita",     cor: "#6EC8A5" },
];

const SEED: Despesa[] = [
  { id: 1,  descricao: "Aluguel",           valor: 1500.00, categoria: "Moradia",     data: "2026-04-01", tipo: "despesa" },
  { id: 2,  descricao: "Supermercado",      valor: 450.00,  categoria: "Alimentação", data: "2026-04-03", tipo: "despesa" },
  { id: 3,  descricao: "Salário",           valor: 5000.00, categoria: "Receita",     data: "2026-04-05", tipo: "receita" },
  { id: 4,  descricao: "Netflix",           valor: 45.90,   categoria: "Lazer",       data: "2026-04-05", tipo: "despesa" },
  { id: 5,  descricao: "Gasolina",          valor: 200.00,  categoria: "Transporte",  data: "2026-04-07", tipo: "despesa" },
  { id: 6,  descricao: "Farmácia",          valor: 85.50,   categoria: "Saúde",       data: "2026-04-08", tipo: "despesa" },
  { id: 7,  descricao: "Restaurante",       valor: 120.00,  categoria: "Alimentação", data: "2026-04-09", tipo: "despesa" },
  { id: 8,  descricao: "Conta de Luz",      valor: 180.00,  categoria: "Moradia",     data: "2026-04-10", tipo: "despesa" },
  { id: 9,  descricao: "Freelance Design",  valor: 1200.00, categoria: "Receita",     data: "2026-04-10", tipo: "receita" },
  { id: 10, descricao: "Curso de QA",       valor: 297.00,  categoria: "Educação",    data: "2026-04-06", tipo: "despesa" },
];

type FormDraft = {
  descricao: string;
  valor: string;
  categoria: string;
  data: string;
  tipo: "despesa" | "receita";
};

const EMPTY_FORM: FormDraft = {
  descricao: "",
  valor: "",
  categoria: "Moradia",
  data: new Date().toISOString().slice(0, 10),
  tipo: "despesa",
};

// ── Inline UI components ───────────────────────────────────────────────────────

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-card rounded-xl border border-border shadow-sm ${className}`}>{children}</div>
);

const Input = ({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Btn = ({
  children, onClick, variant = "default", size = "default",
  className = "", disabled = false, type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "destructive" | "outline" | "ghost";
  size?: "default" | "sm" | "icon";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}) => {
  const base = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default:     "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline:     "border border-border bg-card text-foreground hover:bg-accent",
    ghost:       "text-foreground hover:bg-accent",
  };
  const sizes = { default: "h-9 px-4 text-sm", sm: "h-7 px-3 text-xs", icon: "size-8 p-0" };
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  );
};

// ── Page ───────────────────────────────────────────────────────────────────────

export default function DespesasPage() {
  const toast = useToast();
  const [despesas,    setDespesas]    = useState<Despesa[]>(SEED);
  const [categorias,  setCategorias]  = useState<Categoria[]>(CATS_PADRAO);
  // Moradia gasto=1680 > 1600, Alimentação gasto=570 > 500 → alertas visíveis desde o início
  const [orcamentos,  setOrcamentos]  = useState<Record<string, number>>({ Moradia: 1600, Alimentação: 500 });

  // view
  const [view, setView] = useState<"lista" | "dashboard">("lista");

  // filters & sort
  const [busca,           setBusca]           = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("all");
  const [filtroTipo,      setFiltroTipo]      = useState<FiltroTipo>("all");
  const [filtroInicio,    setFiltroInicio]    = useState("");
  const [filtroFim,       setFiltroFim]       = useState("");
  const [sortField,       setSortField]       = useState<SortField>("data");
  const [sortDir,         setSortDir]         = useState<SortDir>("desc");

  // selection & pagination
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [page,     setPage]     = useState(1);

  // modal: add/edit
  const [modalDespesa, setModalDespesa] = useState<{ open: boolean; editing?: Despesa }>({ open: false });
  const [form,         setForm]         = useState(EMPTY_FORM);
  const [formErro,     setFormErro]     = useState("");

  // modal: delete
  const [modalDelete, setModalDelete] = useState<{ open: boolean; id?: number }>({ open: false });

  // modal: categoria
  const [modalCat, setModalCat] = useState(false);
  const [novaCat,  setNovaCat]  = useState("");

  // modal: orçamento
  const [modalOrc,  setModalOrc]  = useState<{ open: boolean; categoria?: string }>({ open: false });
  const [limiteOrc, setLimiteOrc] = useState("");
  const [limiteErro, setLimiteErro] = useState("");

  // ── Derived ─────────────────────────────────────────────────────────────────

  const nextId = useMemo(() => Math.max(0, ...despesas.map(d => d.id)) + 1, [despesas]);

  const despesasFiltradas = useMemo(() => {
    return despesas
      .filter(d => {
        if (busca && !d.descricao.toLowerCase().includes(busca.toLowerCase()) && !d.categoria.toLowerCase().includes(busca.toLowerCase())) return false;
        if (filtroCategoria !== "all" && d.categoria !== filtroCategoria) return false;
        if (filtroTipo      !== "all" && d.tipo      !== filtroTipo)      return false;
        if (filtroInicio && d.data < filtroInicio) return false;
        if (filtroFim    && d.data > filtroFim)    return false;
        return true;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortField === "data")      diff = a.data.localeCompare(b.data);
        if (sortField === "valor")     diff = a.valor - b.valor;
        if (sortField === "descricao") diff = a.descricao.localeCompare(b.descricao);
        return sortDir === "asc" ? diff : -diff;
      });
  }, [despesas, busca, filtroCategoria, filtroTipo, filtroInicio, filtroFim, sortField, sortDir]);

  const totalPaginas       = Math.max(1, Math.ceil(despesasFiltradas.length / ITEMS_PER_PAGE));
  const despesasPaginadas  = despesasFiltradas.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const todosNaPagSelec    = despesasPaginadas.length > 0 && despesasPaginadas.every(d => selected.has(d.id));
  const algunsNaPagSelec   = despesasPaginadas.some(d => selected.has(d.id));

  const totalReceitas = despesas.filter(d => d.tipo === "receita").reduce((s, d) => s + d.valor, 0);
  const totalDespesas = despesas.filter(d => d.tipo === "despesa").reduce((s, d) => s + d.valor, 0);
  const saldo         = totalReceitas - totalDespesas;

  const gastosPorCategoria = useMemo(() => {
    const map: Record<string, number> = {};
    despesas.filter(d => d.tipo === "despesa").forEach(d => {
      map[d.categoria] = (map[d.categoria] ?? 0) + d.valor;
    });
    return map;
  }, [despesas]);

  const maxGasto = Math.max(1, ...Object.values(gastosPorCategoria));

  const alertasOrcamento = Object.entries(orcamentos).filter(
    ([cat, limite]) => (gastosPorCategoria[cat] ?? 0) > limite
  );

  // ── Handlers ────────────────────────────────────────────────────────────────

  function abrirNova() {
    setForm(EMPTY_FORM);
    setFormErro("");
    setModalDespesa({ open: true });
  }

  function abrirEditar(d: Despesa) {
    setForm({ descricao: d.descricao, valor: String(d.valor), categoria: d.categoria, data: d.data, tipo: d.tipo });
    setFormErro("");
    setModalDespesa({ open: true, editing: d });
  }

  function salvar() {
    if (!form.descricao.trim()) { setFormErro("Descrição obrigatória"); toast.add("Preencha a descrição", "error"); return; }
    const valor = parseFloat(form.valor.replace(",", "."));
    if (!valor || valor <= 0)   { setFormErro("Valor inválido"); toast.add("Informe um valor válido", "error"); return; }
    if (!form.data)             { setFormErro("Data obrigatória"); toast.add("Selecione uma data", "error"); return; }

    const entry: Despesa = {
      id:        modalDespesa.editing?.id ?? nextId,
      descricao: form.descricao.trim(),
      valor,
      categoria: form.categoria,
      data:      form.data,
      tipo:      form.tipo,
    };

    if (modalDespesa.editing) {
      setDespesas(prev => prev.map(d => d.id === entry.id ? entry : d));
      toast.add("Lançamento atualizado", "success");
    } else {
      setDespesas(prev => [...prev, entry]);
      toast.add(`${entry.tipo === "receita" ? "Receita" : "Despesa"} adicionada`, "success");
    }
    setModalDespesa({ open: false });
  }

  function confirmarDelete() {
    setDespesas(prev => prev.filter(d => d.id !== modalDelete.id));
    setModalDelete({ open: false });
    toast.add("Lançamento excluído", "info");
  }

  function adicionarCategoria() {
    const id = novaCat.trim();
    if (!id) { toast.add("Informe um nome para a categoria", "error"); return; }
    if (categorias.find(c => c.id === id)) { toast.add("Categoria já existe", "error"); return; }
    const cor = CORES_EXTRA[categorias.length % CORES_EXTRA.length];
    setCategorias(prev => [...prev, { id, label: id, cor }]);
    setNovaCat("");
    setModalCat(false);
    toast.add(`Categoria "${id}" criada`, "success");
  }

  function salvarOrcamento() {
    const valor = parseFloat(limiteOrc.replace(",", "."));
    if (!limiteOrc.trim()) { setLimiteErro("Informe um valor"); toast.add("Informe o valor do limite", "error"); return; }
    if (isNaN(valor) || valor <= 0) { setLimiteErro("Valor inválido"); toast.add("Valor inválido", "error"); return; }
    if (!modalOrc.categoria) return;
    const gasto = gastosPorCategoria[modalOrc.categoria] ?? 0;
    setOrcamentos(prev => ({ ...prev, [modalOrc.categoria!]: valor }));
    setModalOrc({ open: false });
    setLimiteErro("");
    if (gasto > valor) {
      toast.add(`Limite salvo — ${modalOrc.categoria} já está excedido!`, "error");
    } else {
      toast.add(`Limite de R$ ${valor.toFixed(2)} salvo para ${modalOrc.categoria}`, "success");
    }
  }

  function removerOrcamento(categoria: string) {
    setOrcamentos(prev => {
      const next = { ...prev };
      delete next[categoria];
      return next;
    });
    setModalOrc({ open: false });
    setLimiteErro("");
    toast.add(`Limite de ${categoria} removido`, "info");
  }

  function exportarCSV() {
    if (despesasFiltradas.length === 0) { toast.add("Nenhum registro para exportar", "error"); return; }
    const header = "Data,Descrição,Categoria,Tipo,Valor";
    const rows   = despesasFiltradas.map(d =>
      `${d.data},"${d.descricao}",${d.categoria},${d.tipo},${d.valor.toFixed(2)}`
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "despesas.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.add(`${despesasFiltradas.length} registro(s) exportados`, "success");
  }

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  }

  const sortIcon = (field: SortField) =>
    sortField === field ? (sortDir === "asc" ? " ↑" : " ↓") : "";

  function resetarFiltros() {
    setBusca(""); setFiltroCategoria("all"); setFiltroTipo("all");
    setFiltroInicio(""); setFiltroFim("");
    setPage(1); setSelected(new Set());
  }

  function resetarDados() {
    setDespesas(SEED);
    resetarFiltros();
    toast.add("Dados restaurados para o estado inicial", "info");
  }

  function toggleSelect(id: number) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (todosNaPagSelec) {
      setSelected(prev => {
        const next = new Set(prev);
        despesasPaginadas.forEach(d => next.delete(d.id));
        return next;
      });
    } else {
      setSelected(prev => {
        const next = new Set(prev);
        despesasPaginadas.forEach(d => next.add(d.id));
        return next;
      });
    }
  }

  function deletarSelecionados() {
    const count = selected.size;
    setDespesas(prev => prev.filter(d => !selected.has(d.id)));
    setSelected(new Set());
    setPage(1);
    toast.add(`${count} lançamento(s) excluído(s)`, "info");
  }

  function irPagina(p: number) {
    setPage(Math.max(1, Math.min(totalPaginas, p)));
    setSelected(new Set());
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap animate-slide-in-up">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-wider text-mint italic">
            FLUX
          </h1>
          <p className="text-xs text-muted-foreground">
            Controle de despesas · <span className="text-coral">dados em memória</span>, sem persistência
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Toggle lista/dashboard */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            {(["lista", "dashboard"] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                  view === v ? "bg-mint/20 text-mint" : "text-muted-foreground hover:bg-accent"
                }`}
              >
                {v === "lista" ? <List className="size-3.5" /> : <BarChart2 className="size-3.5" />}
                {v === "lista" ? "Lista" : "Dashboard"}
              </button>
            ))}
          </div>

          <Btn variant="outline" size="sm" onClick={exportarCSV} className="gap-1.5" data-testid="btn-exportar-csv">
            <Download className="size-3.5" /> CSV
          </Btn>
          <Btn variant="ghost" size="sm" onClick={resetarDados} className="gap-1.5 text-muted-foreground" data-testid="btn-resetar-dados">
            Resetar dados
          </Btn>
          <Btn size="sm" onClick={abrirNova} className="gap-1.5" data-testid="btn-novo-lancamento">
            <Plus className="size-3.5" /> Nova
          </Btn>
        </div>
      </div>

      {/* ── Budget Alerts ────────────────────────────────────────────────────── */}
      {alertasOrcamento.length > 0 && (
        <div className="space-y-2">
          {alertasOrcamento.map(([cat, limite]) => (
            <div key={cat} className="flex items-center gap-2 p-3 bg-coral/10 border border-coral/30 rounded-xl text-sm text-coral">
              <AlertTriangle className="size-4 shrink-0" />
              <span>
                <strong>{cat}</strong>: gastou{" "}
                <strong>R$ {(gastosPorCategoria[cat] ?? 0).toFixed(2)}</strong> de R$ {limite.toFixed(2)} definido como limite
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">

        {/* ── Main ────────────────────────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Filters */}
          <Card>
            <div className="p-4 space-y-3">
              {/* Row 1: search + category + tipo */}
              <div className="flex gap-2 flex-wrap">
                <div className="flex-1 min-w-[160px] relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por descrição ou categoria..."
                    value={busca}
                    onChange={e => { setBusca(e.target.value); setPage(1); }}
                    className="pl-8"
                    data-testid="filtro-busca"
                  />
                </div>
                <select
                  value={filtroCategoria}
                  onChange={e => { setFiltroCategoria(e.target.value); setPage(1); setSelected(new Set()); }}
                  className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  data-testid="filtro-categoria"
                >
                  <option value="all">Todas as categorias</option>
                  {categorias.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
                <select
                  value={filtroTipo}
                  onChange={e => { setFiltroTipo(e.target.value as FiltroTipo); setPage(1); setSelected(new Set()); }}
                  className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  data-testid="filtro-tipo"
                >
                  <option value="all">Todos os tipos</option>
                  <option value="despesa">Despesas</option>
                  <option value="receita">Receitas</option>
                </select>
              </div>

              {/* Row 2: date range */}
              <div className="flex gap-2 items-center">
                <span className="text-xs text-muted-foreground whitespace-nowrap">Período:</span>
                <Input type="date" value={filtroInicio} onChange={e => { setFiltroInicio(e.target.value); setPage(1); }} className="flex-1" data-testid="filtro-data-inicio" />
                <span className="text-xs text-muted-foreground">até</span>
                <Input type="date" value={filtroFim}    onChange={e => { setFiltroFim(e.target.value); setPage(1); }}    className="flex-1" data-testid="filtro-data-fim" />
                {(filtroInicio || filtroFim || filtroCategoria !== "all" || filtroTipo !== "all" || busca) && (
                  <button
                    onClick={resetarFiltros}
                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 text-xs whitespace-nowrap"
                    data-testid="btn-limpar-filtros"
                  >
                    <X className="size-3.5" /> Limpar
                  </button>
                )}
              </div>
            </div>
          </Card>

          {/* ── Lista View ──────────────────────────────────────────────────── */}
          {view === "lista" && (
            <Card>
              {/* Bulk action bar */}
              {selected.size > 0 && (
                <div className="px-4 py-2.5 border-b border-coral/30 bg-coral/5 flex items-center justify-between gap-2" data-testid="bulk-action-bar">
                  <span className="text-xs font-semibold text-coral" data-testid="bulk-count">
                    {selected.size} selecionado(s)
                  </span>
                  <Btn variant="destructive" size="sm" onClick={deletarSelecionados} className="gap-1.5" data-testid="btn-bulk-delete">
                    <Trash2 className="size-3.5" /> Excluir selecionados
                  </Btn>
                </div>
              )}

              {/* Column headers */}
              <div className="grid grid-cols-[32px_1fr_110px_120px_110px_64px] gap-2 px-4 py-2.5 border-b border-border" data-testid="tabela-header">
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={todosNaPagSelec}
                    ref={el => { if (el) el.indeterminate = algunsNaPagSelec && !todosNaPagSelec; }}
                    onChange={toggleSelectAll}
                    className="size-3.5 cursor-pointer accent-primary"
                    data-testid="checkbox-selecionar-todos"
                  />
                </div>
                <button onClick={() => toggleSort("descricao")} className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors" data-testid="sort-descricao">
                  Descrição{sortIcon("descricao")}
                </button>
                <button onClick={() => toggleSort("data")} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors" data-testid="sort-data">
                  Data{sortIcon("data")}
                </button>
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Categoria</span>
                <button onClick={() => toggleSort("valor")} className="text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors" data-testid="sort-valor">
                  Valor{sortIcon("valor")}
                </button>
                <span />
              </div>

              {/* Rows */}
              <div className="divide-y divide-border" data-testid="tabela-body">
                {despesasFiltradas.length === 0 ? (
                  <div className="py-14 text-center text-sm text-muted-foreground" data-testid="tabela-vazia">
                    <Search className="size-8 mx-auto mb-2 opacity-30" />
                    Nenhum lançamento encontrado
                  </div>
                ) : despesasPaginadas.map(d => {
                  const cat = categorias.find(c => c.id === d.categoria);
                  const isSel = selected.has(d.id);
                  return (
                    <div
                      key={d.id}
                      className={`grid grid-cols-[32px_1fr_110px_120px_110px_64px] gap-2 px-4 py-3 items-center transition-colors ${isSel ? "bg-primary/5" : "hover:bg-accent/30"}`}
                      data-testid={`linha-lancamento-${d.id}`}
                    >
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={isSel}
                          onChange={() => toggleSelect(d.id)}
                          className="size-3.5 cursor-pointer accent-primary"
                          data-testid={`checkbox-lancamento-${d.id}`}
                        />
                      </div>
                      <p className="text-sm font-medium text-foreground truncate" data-testid={`descricao-${d.id}`}>{d.descricao}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap" data-testid={`data-${d.id}`}>
                        {new Date(d.data + "T12:00:00").toLocaleDateString("pt-BR")}
                      </span>
                      <span
                        className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium w-fit"
                        style={{ backgroundColor: (cat?.cor ?? "#888") + "25", color: cat?.cor ?? "#888" }}
                        data-testid={`categoria-${d.id}`}
                      >
                        {d.categoria}
                      </span>
                      <span
                        className={`text-sm font-semibold text-right whitespace-nowrap ${d.tipo === "receita" ? "text-neon" : "text-foreground"}`}
                        data-testid={`valor-${d.id}`}
                      >
                        {d.tipo === "receita" ? "+" : "−"}R$ {d.valor.toFixed(2)}
                      </span>
                      <div className="flex items-center justify-end gap-0.5">
                        <button onClick={() => abrirEditar(d)}
                          className="size-7 flex items-center justify-center rounded text-muted-foreground hover:text-mint hover:bg-mint/10 transition-colors"
                          data-testid={`btn-editar-${d.id}`}>
                          <Edit2 className="size-3.5" />
                        </button>
                        <button onClick={() => setModalDelete({ open: true, id: d.id })}
                          className="size-7 flex items-center justify-center rounded text-muted-foreground hover:text-coral hover:bg-coral/10 transition-colors"
                          data-testid={`btn-excluir-${d.id}`}>
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer: totals + pagination */}
              {despesasFiltradas.length > 0 && (
                <div className="px-4 py-3 border-t border-border flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span data-testid="total-registros">{despesasFiltradas.length} registro(s)</span>
                    <span>
                      Despesas: <span className="text-coral font-semibold">−R$ {despesasFiltradas.filter(d => d.tipo === "despesa").reduce((s, d) => s + d.valor, 0).toFixed(2)}</span>
                    </span>
                    <span>
                      Receitas: <span className="text-neon font-semibold">+R$ {despesasFiltradas.filter(d => d.tipo === "receita").reduce((s, d) => s + d.valor, 0).toFixed(2)}</span>
                    </span>
                  </div>

                  {/* Pagination */}
                  {totalPaginas > 1 && (
                    <div className="flex items-center gap-1.5" data-testid="paginacao">
                      <button
                        onClick={() => irPagina(page - 1)}
                        disabled={page === 1}
                        className="size-7 flex items-center justify-center rounded border border-border text-xs text-foreground hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        data-testid="btn-pagina-anterior"
                      >
                        ‹
                      </button>
                      {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(p => (
                        <button
                          key={p}
                          onClick={() => irPagina(p)}
                          className={`size-7 flex items-center justify-center rounded text-xs font-medium transition-colors ${
                            p === page ? "bg-primary text-primary-foreground" : "border border-border text-foreground hover:bg-accent"
                          }`}
                          data-testid={`btn-pagina-${p}`}
                        >
                          {p}
                        </button>
                      ))}
                      <button
                        onClick={() => irPagina(page + 1)}
                        disabled={page === totalPaginas}
                        className="size-7 flex items-center justify-center rounded border border-border text-xs text-foreground hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        data-testid="btn-proxima-pagina"
                      >
                        ›
                      </button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          )}

          {/* ── Dashboard View ────────────────────────────────────────────── */}
          {view === "dashboard" && (
            <div className="space-y-4">
              {/* KPI cards */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Receitas",  value: totalReceitas, pos: true,       icon: TrendingUp   },
                  { label: "Despesas",  value: totalDespesas, pos: false,      icon: TrendingDown },
                  { label: "Saldo",     value: saldo,         pos: saldo >= 0, icon: Wallet       },
                ].map(({ label, value, pos, icon: Icon }) => (
                  <Card key={label} className="p-4">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Icon className={`size-3.5 ${pos ? "text-neon" : "text-coral"}`} />
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
                    </div>
                    <p className={`text-xl font-[family-name:var(--font-display)] tracking-wide ${pos ? "text-neon" : "text-coral"}`}>
                      R$ {Math.abs(value).toFixed(2)}
                    </p>
                  </Card>
                ))}
              </div>

              {/* Bar chart: spending by category */}
              <Card>
                <div className="p-4 space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                    <BarChart2 className="size-3.5" /> Gastos por categoria
                  </p>
                  {categorias
                    .filter(cat => cat.id !== "Receita" && (gastosPorCategoria[cat.id] ?? 0) > 0)
                    .sort((a, b) => (gastosPorCategoria[b.id] ?? 0) - (gastosPorCategoria[a.id] ?? 0))
                    .map(cat => {
                      const gasto  = gastosPorCategoria[cat.id] ?? 0;
                      const pct    = (gasto / maxGasto) * 100;
                      const limite = orcamentos[cat.id];
                      const isOver = !!limite && gasto > limite;
                      return (
                        <div key={cat.id} className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-off-white/80 font-medium">{cat.label}</span>
                            <div className="flex items-center gap-1.5">
                              {isOver && <AlertTriangle className="size-3 text-coral" />}
                              <span className={isOver ? "text-coral font-semibold" : "text-muted-foreground"}>
                                R$ {gasto.toFixed(2)}
                                {limite && <span className="text-muted-foreground font-normal opacity-60"> / {limite.toFixed(0)}</span>}
                              </span>
                            </div>
                          </div>
                          <div className="h-2.5 rounded-full bg-mint/10 overflow-hidden">
                            <div
                              className="h-2.5 rounded-full transition-all duration-700"
                              style={{ width: `${pct}%`, backgroundColor: isOver ? "#E8A5A0" : cat.cor }}
                            />
                          </div>
                          {/* budget progress bar */}
                          {limite && (
                            <div className="h-1 rounded-full bg-mint/5 overflow-hidden">
                              <div
                                className="h-1 rounded-full transition-all duration-700 opacity-40"
                                style={{ width: `${Math.min((gasto / limite) * 100, 100)}%`, backgroundColor: isOver ? "#E8A5A0" : "#D4F56E" }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  {Object.keys(gastosPorCategoria).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-6">Nenhuma despesa registrada</p>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Balance */}
          <Card>
            <div className="p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                <Wallet className="size-3.5" /> Resumo geral
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Receitas</span>
                  <span className="text-neon font-semibold">+R$ {totalReceitas.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Despesas</span>
                  <span className="text-coral font-semibold">−R$ {totalDespesas.toFixed(2)}</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-foreground">Saldo</span>
                  <span className={saldo >= 0 ? "text-neon" : "text-coral"}>
                    {saldo >= 0 ? "+" : "−"}R$ {Math.abs(saldo).toFixed(2)}
                  </span>
                </div>
              </div>
              {/* Visual balance bar */}
              {totalReceitas > 0 && (
                <div className="space-y-1">
                  <div className="h-2 rounded-full bg-mint/10 overflow-hidden flex">
                    <div
                      className="h-2 bg-coral/70 transition-all duration-700"
                      style={{ width: `${Math.min((totalDespesas / totalReceitas) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground text-right">
                    {Math.round((totalDespesas / totalReceitas) * 100)}% da receita comprometida
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Categories + Budgets */}
          <Card>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                  <Tag className="size-3.5" /> Categorias
                </p>
                <button onClick={() => setModalCat(true)}
                  className="text-xs text-mint hover:underline flex items-center gap-0.5 transition-colors">
                  <Plus className="size-3" /> Nova
                </button>
              </div>
              <div className="space-y-2.5">
                {categorias.filter(c => c.id !== "Receita").map(cat => {
                  const gasto  = gastosPorCategoria[cat.id] ?? 0;
                  const limite = orcamentos[cat.id];
                  const isOver = !!limite && gasto > limite;
                  return (
                    <div key={cat.id} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="size-2 rounded-full shrink-0" style={{ backgroundColor: cat.cor }} />
                        <span className="text-xs text-foreground truncate">{cat.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[11px] ${isOver ? "text-coral font-semibold" : "text-muted-foreground"}`}>
                          R$ {gasto.toFixed(0)}
                          {limite && <span className="opacity-60">/{limite.toFixed(0)}</span>}
                        </span>
                        <button
                          onClick={() => { setLimiteOrc(""); setLimiteErro(""); setModalOrc({ open: true, categoria: cat.id }); }}
                          className="text-[10px] text-muted-foreground hover:text-mint border border-border rounded px-1.5 py-0.5 transition-colors"
                        >
                          {limite ? "editar" : "limite"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Watermark */}
          <div className="flex justify-end">
            <span className="font-[family-name:var(--font-display)] text-5xl text-mint/5 italic tracking-wider select-none">
              FLUX
            </span>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          Modals
      ════════════════════════════════════════════════════════════════════════ */}

      {/* Modal: Nova / Editar Despesa */}
      {modalDespesa.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalDespesa({ open: false })} />
          <div className="relative z-10 w-full max-w-md bg-card rounded-2xl border border-border shadow-2xl animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-semibold text-foreground">
                {modalDespesa.editing ? "Editar lançamento" : "Novo lançamento"}
              </h2>
              <button onClick={() => setModalDespesa({ open: false })} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Error */}
              {formErro && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-xs text-destructive">
                  <AlertTriangle className="size-3.5 shrink-0" /> {formErro}
                </div>
              )}

              {/* Tipo toggle */}
              <div className="flex rounded-lg border border-border overflow-hidden">
                {(["despesa", "receita"] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => {
                      const novaCategoria = t === "receita" ? "Receita" : (form.categoria === "Receita" ? "Moradia" : form.categoria);
                      setForm(f => ({ ...f, tipo: t, categoria: novaCategoria }));
                    }}
                    className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
                      form.tipo === t
                        ? t === "despesa" ? "bg-coral/20 text-coral" : "bg-neon/20 text-neon"
                        : "text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {t === "despesa" ? "Despesa" : "Receita"}
                  </button>
                ))}
              </div>

              {/* Descrição */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Descrição</label>
                <Input
                  placeholder="Ex: Supermercado, Salário..."
                  value={form.descricao}
                  onChange={e => { setForm(f => ({ ...f, descricao: e.target.value })); setFormErro(""); }}
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Valor */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Valor (R$)</label>
                  <Input
                    placeholder="0,00"
                    value={form.valor}
                    onChange={e => { setForm(f => ({ ...f, valor: e.target.value })); setFormErro(""); }}
                  />
                </div>
                {/* Data */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Data</label>
                  <Input
                    type="date"
                    value={form.data}
                    onChange={e => setForm(f => ({ ...f, data: e.target.value }))}
                  />
                </div>
              </div>

              {/* Categoria */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Categoria</label>
                <select
                  value={form.categoria}
                  onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
                  className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {categorias
                    .filter(c => form.tipo === "receita" ? c.id === "Receita" : c.id !== "Receita")
                    .map(c => <option key={c.id} value={c.id}>{c.label}</option>)
                  }
                </select>
              </div>
            </div>

            <div className="flex gap-2 p-5 pt-0">
              <Btn variant="outline" className="flex-1" onClick={() => setModalDespesa({ open: false })}>Cancelar</Btn>
              <Btn className="flex-1" onClick={salvar}>
                {modalDespesa.editing ? "Salvar alterações" : "Adicionar"}
              </Btn>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirmar exclusão */}
      {modalDelete.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalDelete({ open: false })} />
          <div className="relative z-10 w-full max-w-sm bg-card rounded-2xl border border-border shadow-2xl p-6 space-y-4 text-center animate-scale-in">
            <div className="flex items-center justify-center size-12 rounded-full bg-coral/10 mx-auto">
              <Trash2 className="size-5 text-coral" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Excluir lançamento?</h2>
              <p className="text-sm text-muted-foreground mt-1">Esta ação não pode ser desfeita.</p>
            </div>
            <div className="flex gap-2">
              <Btn variant="outline" className="flex-1" onClick={() => setModalDelete({ open: false })}>Cancelar</Btn>
              <Btn variant="destructive" className="flex-1" onClick={confirmarDelete}>Excluir</Btn>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Nova categoria */}
      {modalCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalCat(false)} />
          <div className="relative z-10 w-full max-w-sm bg-card rounded-2xl border border-border shadow-2xl p-6 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Nova categoria</h2>
              <button onClick={() => setModalCat(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="size-4" />
              </button>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Nome</label>
              <Input
                placeholder="Ex: Pets, Viagens, Streaming..."
                value={novaCat}
                onChange={e => setNovaCat(e.target.value)}
                onKeyDown={e => e.key === "Enter" && adicionarCategoria()}
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <Btn variant="outline" className="flex-1" onClick={() => setModalCat(false)}>Cancelar</Btn>
              <Btn className="flex-1" disabled={!novaCat.trim()} onClick={adicionarCategoria}>Criar</Btn>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Definir orçamento */}
      {modalOrc.open && (() => {
        const cat     = modalOrc.categoria!;
        const gasto   = gastosPorCategoria[cat] ?? 0;
        const jaTemLimite = orcamentos[cat] !== undefined;
        const pctUsado = jaTemLimite ? Math.min((gasto / orcamentos[cat]) * 100, 100) : 0;
        const isOver   = jaTemLimite && gasto > orcamentos[cat];
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setModalOrc({ open: false }); setLimiteErro(""); }} />
            <div className="relative z-10 w-full max-w-sm bg-card rounded-2xl border border-border shadow-2xl p-6 space-y-4 animate-scale-in">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Limite de orçamento</h2>
                <button onClick={() => { setModalOrc({ open: false }); setLimiteErro(""); }} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="size-4" />
                </button>
              </div>

              {/* Gasto atual */}
              <div className="rounded-lg bg-accent/50 p-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Gasto atual em <strong className="text-foreground">{cat}</strong></span>
                  <span className={isOver ? "text-coral font-semibold" : "text-foreground font-semibold"}>
                    R$ {gasto.toFixed(2)}
                  </span>
                </div>
                {jaTemLimite && (
                  <>
                    <div className="h-2 rounded-full bg-mint/10 overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{ width: `${pctUsado}%`, backgroundColor: isOver ? "#E8A5A0" : "#D4F56E" }}
                      />
                    </div>
                    <p className={`text-[10px] text-right ${isOver ? "text-coral" : "text-muted-foreground"}`}>
                      {pctUsado.toFixed(0)}% do limite atual de R$ {orcamentos[cat].toFixed(2)}
                      {isOver && " — EXCEDIDO"}
                    </p>
                  </>
                )}
              </div>

              {/* Erro */}
              {limiteErro && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-xs text-destructive">
                  <AlertTriangle className="size-3.5 shrink-0" /> {limiteErro}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Novo limite mensal (R$)</label>
                <Input
                  placeholder="Ex: 500,00"
                  value={limiteOrc}
                  onChange={e => { setLimiteOrc(e.target.value); setLimiteErro(""); }}
                  onKeyDown={e => e.key === "Enter" && salvarOrcamento()}
                  autoFocus
                />
                <p className="text-[10px] text-muted-foreground">
                  Um alerta aparece no topo quando o gasto ultrapassar este valor.
                </p>
              </div>

              <div className="flex gap-2">
                {jaTemLimite && (
                  <Btn variant="ghost" size="sm" className="text-coral hover:text-coral hover:bg-coral/10 px-3"
                    onClick={() => removerOrcamento(cat)}>
                    Remover
                  </Btn>
                )}
                <Btn variant="outline" className="flex-1" onClick={() => { setModalOrc({ open: false }); setLimiteErro(""); }}>Cancelar</Btn>
                <Btn className="flex-1" onClick={salvarOrcamento}>Salvar limite</Btn>
              </div>
            </div>
          </div>
        );
      })()}

      <ToastContainer toasts={toast.toasts} remove={toast.remove} />
    </div>
  );
}
