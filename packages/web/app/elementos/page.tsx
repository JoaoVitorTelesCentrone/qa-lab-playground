"use client";

import { useState, useEffect, useRef } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronUp, ChevronDown, ChevronsUpDown, Search,
  RefreshCw, Loader2, AlertCircle, CheckCircle2, X,
  ChevronRight, SlidersHorizontal, ToggleLeft, ToggleRight,
} from "lucide-react";
import {
  execucoes, resultadoConfig, sistemaColor, ITEMS_PER_PAGE,
  type ExecucaoItem, type ResultadoExec, type SistemaExec,
} from "@/lib/elementos";

// ── helpers ───────────────────────────────────────────────────────────────────

function Sel({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(`[data-testid="${id}"]`); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="font-mono text-[10px] bg-mint/10 text-mint px-1.5 py-0.5 rounded hover:bg-mint/20 transition-colors"
      title="Copiar seletor"
    >
      {copied ? "copiado!" : `[data-testid="${id}"]`}
    </button>
  );
}

// ── Tab: Tabela ───────────────────────────────────────────────────────────────

type SortField = keyof Pick<ExecucaoItem, "id" | "titulo" | "sistema" | "resultado" | "tipo" | "duracaoMs">;
type SortDir = "asc" | "desc";

function TabelaTab() {
  const [busca, setBusca] = useState("");
  const [filtroSistema, setFiltroSistema] = useState<SistemaExec | "all">("all");
  const [filtroResultado, setFiltroResultado] = useState<ResultadoExec | "all">("all");
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);

  const filtered = execucoes
    .filter(e => {
      if (busca && !e.titulo.toLowerCase().includes(busca.toLowerCase())) return false;
      if (filtroSistema !== "all" && e.sistema !== filtroSistema) return false;
      if (filtroResultado !== "all" && e.resultado !== filtroResultado) return false;
      return true;
    })
    .sort((a, b) => {
      const av = a[sortField], bv = b[sortField];
      const diff = typeof av === "number" ? (av as number) - (bv as number) : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? diff : -diff;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
    setPage(1);
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ChevronsUpDown className="size-3 opacity-40" />;
    return sortDir === "asc" ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />;
  }

  return (
    <div className="space-y-4" data-testid="tab-tabela">
      {/* Info */}
      <div className="rounded-lg border border-mint/20 bg-mint/5 p-3 text-xs text-mint/80 space-y-1">
        <p className="font-semibold">Seletores desta seção:</p>
        <div className="flex flex-wrap gap-2">
          <Sel id="tabela-filtro-busca" /><Sel id="tabela-filtro-sistema" /><Sel id="tabela-filtro-resultado" />
          <Sel id="tabela-header" /><Sel id="tabela-body" /><Sel id="tabela-paginacao" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex-1 min-w-[180px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input
            data-testid="tabela-filtro-busca"
            placeholder="Buscar por título..."
            value={busca}
            onChange={e => { setBusca(e.target.value); setPage(1); }}
            className="pl-8 flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <select
          data-testid="tabela-filtro-sistema"
          value={filtroSistema}
          onChange={e => { setFiltroSistema(e.target.value as any); setPage(1); }}
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="all">Todos os sistemas</option>
          {(["API", "E-commerce", "Form Bugado", "Datas"] as SistemaExec[]).map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          data-testid="tabela-filtro-resultado"
          value={filtroResultado}
          onChange={e => { setFiltroResultado(e.target.value as any); setPage(1); }}
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="all">Todos os resultados</option>
          {(["passou", "falhou", "bloqueado", "pendente"] as ResultadoExec[]).map(r => (
            <option key={r} value={r}>{resultadoConfig[r].label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <Table data-testid="tabela-body">
          <TableHeader data-testid="tabela-header">
            <TableRow>
              {([
                { field: "id",        label: "#"        },
                { field: "titulo",    label: "Título"   },
                { field: "sistema",   label: "Sistema"  },
                { field: "resultado", label: "Resultado"},
                { field: "tipo",      label: "Tipo"     },
                { field: "duracaoMs", label: "Duração"  },
              ] as { field: SortField; label: string }[]).map(col => (
                <TableHead
                  key={col.field}
                  data-testid={`sort-${col.field}`}
                  className="cursor-pointer select-none hover:text-foreground transition-colors"
                  onClick={() => toggleSort(col.field)}
                >
                  <div className="flex items-center gap-1">
                    {col.label} <SortIcon field={col.field} />
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-10" data-testid="tabela-vazia">
                  Nenhum resultado encontrado
                </TableCell>
              </TableRow>
            ) : paged.map(e => {
              const rc = resultadoConfig[e.resultado];
              return (
                <TableRow key={e.id} data-testid={`linha-${e.id}`}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{e.id}</TableCell>
                  <TableCell className="text-sm max-w-[200px] truncate" data-testid={`titulo-${e.id}`}>{e.titulo}</TableCell>
                  <TableCell>
                    <span className={`text-xs font-semibold ${sistemaColor[e.sistema]}`} data-testid={`sistema-${e.id}`}>
                      {e.sistema}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${rc.color} ${rc.bg}`} data-testid={`resultado-${e.id}`}>
                      {rc.label}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs" data-testid={`tipo-${e.id}`}>{e.tipo}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground" data-testid={`duracao-${e.id}`}>
                    {e.duracaoMs === 0 ? "—" : `${e.duracaoMs}ms`}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span data-testid="tabela-total">{filtered.length} registro(s)</span>
        {totalPages > 1 && (
          <div className="flex items-center gap-1" data-testid="tabela-paginacao">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="size-7 rounded border border-border flex items-center justify-center hover:bg-accent disabled:opacity-40 transition-colors"
              data-testid="tabela-pagina-anterior">‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`size-7 rounded text-xs font-medium transition-colors ${p === page ? "bg-primary text-primary-foreground" : "border border-border hover:bg-accent"}`}
                data-testid={`tabela-pagina-${p}`}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="size-7 rounded border border-border flex items-center justify-center hover:bg-accent disabled:opacity-40 transition-colors"
              data-testid="tabela-proxima-pagina">›</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tab: Carregamento ─────────────────────────────────────────────────────────

type LoadStatus = "idle" | "loading" | "success" | "error";

function CarregamentoTab() {
  const [autoStatus, setAutoStatus]         = useState<LoadStatus>("loading");
  const [triggerStatus, setTriggerStatus]   = useState<LoadStatus>("idle");
  const [retryStatus, setRetryStatus]       = useState<LoadStatus>("idle");
  const [retryCount, setRetryCount]         = useState(0);
  const [pollingData, setPollingData]       = useState<number | null>(null);
  const [pollingActive, setPollingActive]   = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-load on mount
  useEffect(() => {
    const t = setTimeout(() => setAutoStatus("success"), 2000);
    return () => clearTimeout(t);
  }, []);

  // Polling
  useEffect(() => {
    if (pollingActive) {
      pollingRef.current = setInterval(() => {
        setPollingData(Math.floor(Math.random() * 100));
      }, 2000);
    } else {
      if (pollingRef.current) clearInterval(pollingRef.current);
    }
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [pollingActive]);

  async function triggerLoad() {
    setTriggerStatus("loading");
    await new Promise(r => setTimeout(r, 1500));
    setTriggerStatus("success");
  }

  async function retryLoad() {
    setRetryStatus("loading");
    await new Promise(r => setTimeout(r, 1000));
    if (retryCount < 2) {
      setRetryStatus("error");
      setRetryCount(c => c + 1);
    } else {
      setRetryStatus("success");
      setRetryCount(0);
    }
  }

  function StatusBox({ status, label, testid }: { status: LoadStatus; label: string; testid: string }) {
    return (
      <div className="rounded-xl border border-border p-4 space-y-2" data-testid={testid}>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <div className="flex items-center gap-2" data-testid={`${testid}-status`}>
          {status === "loading" && <><Loader2 className="size-4 text-mint animate-spin" /><span className="text-sm text-mint">Carregando...</span></>}
          {status === "success" && <><CheckCircle2 className="size-4 text-neon" /><span className="text-sm text-neon">Dados carregados</span></>}
          {status === "error"   && <><AlertCircle className="size-4 text-coral" /><span className="text-sm text-coral">Erro ao carregar</span></>}
          {status === "idle"    && <span className="text-sm text-muted-foreground">Aguardando...</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="tab-carregamento">
      <div className="rounded-lg border border-mint/20 bg-mint/5 p-3 text-xs text-mint/80 space-y-1">
        <p className="font-semibold">Seletores desta seção:</p>
        <div className="flex flex-wrap gap-2">
          <Sel id="load-auto" /><Sel id="load-trigger" /><Sel id="load-retry" /><Sel id="load-polling" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* 1. Auto-load */}
        <StatusBox status={autoStatus} label="1. Carregamento automático (2s)" testid="load-auto" />

        {/* 2. Trigger */}
        <div className="rounded-xl border border-border p-4 space-y-3" data-testid="load-trigger">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">2. Trigger manual (1.5s)</p>
          {triggerStatus === "idle" ? (
            <Button size="sm" onClick={triggerLoad} data-testid="load-trigger-btn">Carregar dados</Button>
          ) : (
            <div className="flex items-center gap-2" data-testid="load-trigger-status">
              {triggerStatus === "loading" && <><Loader2 className="size-4 text-mint animate-spin" /><span className="text-sm text-mint">Carregando...</span></>}
              {triggerStatus === "success" && <><CheckCircle2 className="size-4 text-neon" /><span className="text-sm text-neon">Sucesso!</span></>}
            </div>
          )}
        </div>

        {/* 3. Retry */}
        <div className="rounded-xl border border-border p-4 space-y-3" data-testid="load-retry">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            3. Retry após erro {retryCount > 0 && <span className="text-coral">(tentativa {retryCount}/2)</span>}
          </p>
          {(retryStatus === "idle" || retryStatus === "error") && (
            <Button size="sm" variant={retryStatus === "error" ? "destructive" : "default"} onClick={retryLoad} data-testid="load-retry-btn">
              {retryStatus === "error" ? "Tentar novamente" : "Iniciar"}
            </Button>
          )}
          <div className="flex items-center gap-2" data-testid="load-retry-status">
            {retryStatus === "loading" && <><Loader2 className="size-4 text-mint animate-spin" /><span className="text-sm text-mint">Tentando...</span></>}
            {retryStatus === "error"   && <><AlertCircle className="size-4 text-coral" /><span className="text-sm text-coral">Falhou — tente novamente</span></>}
            {retryStatus === "success" && <><CheckCircle2 className="size-4 text-neon" /><span className="text-sm text-neon">Conectado após {retryCount + 1} tentativa(s)</span></>}
          </div>
        </div>

        {/* 4. Polling */}
        <div className="rounded-xl border border-border p-4 space-y-3" data-testid="load-polling">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">4. Polling (2s)</p>
          <div className="flex items-center gap-2">
            <Button size="sm" variant={pollingActive ? "destructive" : "default"}
              onClick={() => setPollingActive(a => !a)} data-testid="load-polling-btn">
              {pollingActive ? "Parar" : "Iniciar polling"}
            </Button>
            {pollingActive && <Loader2 className="size-4 text-mint animate-spin" />}
          </div>
          {pollingData !== null && (
            <p className="text-sm font-mono text-neon" data-testid="load-polling-value">
              valor: {pollingData}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Tab: Interações ───────────────────────────────────────────────────────────

function InteracoesTab() {
  const [slider, setSlider]             = useState(40);
  const [toggles, setToggles]           = useState([false, true, false]);
  const [accordion, setAccordion]       = useState<number | null>(null);
  const [modalOpen, setModalOpen]       = useState(false);
  const [modalResult, setModalResult]   = useState<"confirm" | "cancel" | null>(null);
  const [alertVisible, setAlertVisible] = useState(true);

  const accordionItems = [
    { title: "O que são testes de regressão?", content: "Testes de regressão verificam que funcionalidades existentes continuam funcionando após mudanças no código." },
    { title: "Diferença entre smoke e sanity test", content: "Smoke test valida que o build básico funciona. Sanity test verifica que uma funcionalidade específica está operacional após uma mudança." },
    { title: "Quando usar data-testid?", content: "Use data-testid em elementos que precisam ser selecionados por testes automatizados, especialmente quando classes CSS e textos podem mudar." },
  ];

  return (
    <div className="space-y-6" data-testid="tab-interacoes">
      <div className="rounded-lg border border-mint/20 bg-mint/5 p-3 text-xs text-mint/80 space-y-1">
        <p className="font-semibold">Seletores desta seção:</p>
        <div className="flex flex-wrap gap-2">
          <Sel id="slider-input" /><Sel id="toggle-0" /><Sel id="toggle-1" /><Sel id="toggle-2" />
          <Sel id="accordion-item-0" /><Sel id="modal-btn-abrir" /><Sel id="alert-dismissivel" />
        </div>
      </div>

      {/* Slider */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-mint" />
          <span className="text-sm font-semibold">Slider</span>
          <span className="ml-auto text-sm font-mono text-mint" data-testid="slider-value">{slider}</span>
        </div>
        <input type="range" min={0} max={100} value={slider}
          onChange={e => setSlider(Number(e.target.value))}
          className="w-full accent-mint" data-testid="slider-input" />
      </div>

      {/* Toggles */}
      <div className="space-y-2">
        <p className="text-sm font-semibold flex items-center gap-2"><ToggleLeft className="size-4 text-mint" /> Toggles</p>
        <div className="space-y-2">
          {toggles.map((on, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5" data-testid={`toggle-${i}`}>
              <span className="text-sm">Opção {i + 1}</span>
              <button onClick={() => setToggles(t => t.map((v, idx) => idx === i ? !v : v))}
                className="transition-colors" data-testid={`toggle-${i}-btn`}>
                {on
                  ? <ToggleRight className="size-6 text-neon" />
                  : <ToggleLeft className="size-6 text-muted-foreground" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Accordion */}
      <div className="space-y-2">
        <p className="text-sm font-semibold">Accordion</p>
        <div className="space-y-1.5">
          {accordionItems.map((item, i) => (
            <div key={i} className="rounded-lg border border-border overflow-hidden" data-testid={`accordion-item-${i}`}>
              <button
                onClick={() => setAccordion(accordion === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-left hover:bg-accent transition-colors"
                data-testid={`accordion-trigger-${i}`}
              >
                {item.title}
                <ChevronRight className={`size-4 text-muted-foreground transition-transform ${accordion === i ? "rotate-90" : ""}`} />
              </button>
              {accordion === i && (
                <div className="px-4 py-3 text-sm text-muted-foreground border-t border-border" data-testid={`accordion-content-${i}`}>
                  {item.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <div className="space-y-2">
        <p className="text-sm font-semibold">Modal</p>
        <div className="flex items-center gap-3">
          <Button onClick={() => { setModalOpen(true); setModalResult(null); }} data-testid="modal-btn-abrir">
            Abrir modal
          </Button>
          {modalResult && (
            <span className={`text-sm font-medium ${modalResult === "confirm" ? "text-neon" : "text-coral"}`} data-testid="modal-resultado">
              {modalResult === "confirm" ? "Confirmado" : "Cancelado"}
            </span>
          )}
        </div>
      </div>

      {/* Alert */}
      {alertVisible && (
        <div className="flex items-start gap-3 rounded-xl border border-mint/30 bg-mint/10 px-4 py-3"
          data-testid="alert-dismissivel">
          <CheckCircle2 className="size-4 text-mint shrink-0 mt-0.5" />
          <p className="text-sm text-mint flex-1">Este alerta pode ser dispensado clicando no X.</p>
          <button onClick={() => setAlertVisible(false)} className="text-mint/60 hover:text-mint transition-colors"
            data-testid="alert-fechar">
            <X className="size-4" />
          </button>
        </div>
      )}
      {!alertVisible && (
        <button onClick={() => setAlertVisible(true)} className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          data-testid="alert-restaurar">
          Restaurar alerta
        </button>
      )}

      {/* Modal overlay */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" data-testid="modal-overlay">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setModalOpen(false); setModalResult("cancel"); }} />
          <div className="relative z-10 w-full max-w-sm bg-card rounded-2xl border border-border shadow-2xl p-6 space-y-4 text-center" data-testid="modal-conteudo">
            <p className="font-semibold text-foreground">Confirmar ação?</p>
            <p className="text-sm text-muted-foreground">Esta é uma demonstração de modal com data-testid para automação.</p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => { setModalOpen(false); setModalResult("cancel"); }} data-testid="modal-btn-cancelar">
                Cancelar
              </Button>
              <Button className="flex-1" onClick={() => { setModalOpen(false); setModalResult("confirm"); }} data-testid="modal-btn-confirmar">
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

type Tab = "tabela" | "carregamento" | "interacoes";

const tabs: { key: Tab; label: string }[] = [
  { key: "tabela",       label: "Tabela"       },
  { key: "carregamento", label: "Carregamento" },
  { key: "interacoes",   label: "Interações"   },
];

export default function ElementosPage() {
  const [tab, setTab] = useState<Tab>("tabela");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-1 animate-slide-in-up">
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wider text-mint italic">
          Elementos
        </h1>
        <p className="text-sm text-off-white/50">
          Tabela dinâmica, carregamento assíncrono e interações de UI — todos com <span className="text-mint font-mono text-xs">data-testid</span> para automação.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl border border-border overflow-hidden w-fit" data-testid="tabs">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors ${
              tab === t.key ? "bg-mint/20 text-mint" : "text-muted-foreground hover:bg-accent"
            }`}
            data-testid={`tab-btn-${t.key}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "tabela"       && <TabelaTab />}
      {tab === "carregamento" && <CarregamentoTab />}
      {tab === "interacoes"   && <InteracoesTab />}
    </div>
  );
}
