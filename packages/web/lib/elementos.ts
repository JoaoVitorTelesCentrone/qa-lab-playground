// ── Tabela dinâmica ───────────────────────────────────────────────────────────

export type ResultadoExec = "passou" | "falhou" | "bloqueado" | "pendente";
export type TipoExec      = "smoke" | "funcional" | "regressao" | "seguranca";
export type SistemaExec   = "API" | "E-commerce" | "Form Bugado" | "Datas";

export interface ExecucaoItem {
  id:          number;
  titulo:      string;
  sistema:     SistemaExec;
  resultado:   ResultadoExec;
  tipo:        TipoExec;
  duracaoMs:   number;
  executadoEm: string;
}

export const execucoes: ExecucaoItem[] = [
  { id:  1, titulo: "Login com credenciais válidas",              sistema: "E-commerce",  resultado: "passou",    tipo: "smoke",     duracaoMs: 1204, executadoEm: "2026-04-01" },
  { id:  2, titulo: "Login com senha incorreta",                  sistema: "E-commerce",  resultado: "passou",    tipo: "funcional", duracaoMs:  892, executadoEm: "2026-04-01" },
  { id:  3, titulo: "Adicionar produto ao carrinho",              sistema: "E-commerce",  resultado: "falhou",    tipo: "funcional", duracaoMs: 2310, executadoEm: "2026-04-01" },
  { id:  4, titulo: "Carrinho ultrapassa limite de estoque",      sistema: "E-commerce",  resultado: "falhou",    tipo: "funcional", duracaoMs: 3142, executadoEm: "2026-04-01" },
  { id:  5, titulo: "Checkout — step endereço",                   sistema: "E-commerce",  resultado: "passou",    tipo: "funcional", duracaoMs: 1788, executadoEm: "2026-04-02" },
  { id:  6, titulo: "Checkout — step pagamento PIX",              sistema: "E-commerce",  resultado: "passou",    tipo: "funcional", duracaoMs: 2045, executadoEm: "2026-04-02" },
  { id:  7, titulo: "Busca com palavra acentuada",                sistema: "E-commerce",  resultado: "falhou",    tipo: "funcional", duracaoMs: 1102, executadoEm: "2026-04-02" },
  { id:  8, titulo: "GET /api/health — status code",             sistema: "API",         resultado: "passou",    tipo: "smoke",     duracaoMs:  340, executadoEm: "2026-04-02" },
  { id:  9, titulo: "GET /api/products — paginação",             sistema: "API",         resultado: "falhou",    tipo: "funcional", duracaoMs:  615, executadoEm: "2026-04-02" },
  { id: 10, titulo: "DELETE /api/products/:id — persistência",   sistema: "API",         resultado: "falhou",    tipo: "funcional", duracaoMs:  820, executadoEm: "2026-04-03" },
  { id: 11, titulo: "POST /api/auth/login — rate limiting",      sistema: "API",         resultado: "falhou",    tipo: "seguranca", duracaoMs: 4200, executadoEm: "2026-04-03" },
  { id: 12, titulo: "POST /api/orders — product_id inválido",    sistema: "API",         resultado: "falhou",    tipo: "funcional", duracaoMs:  512, executadoEm: "2026-04-03" },
  { id: 13, titulo: "Smoke suite — 5 endpoints",                  sistema: "API",         resultado: "passou",    tipo: "smoke",     duracaoMs: 2890, executadoEm: "2026-04-03" },
  { id: 14, titulo: "E-mail sem @ aceito como válido",            sistema: "Form Bugado", resultado: "falhou",    tipo: "funcional", duracaoMs:  720, executadoEm: "2026-04-04" },
  { id: 15, titulo: "Submit com campos obrigatórios vazios",      sistema: "Form Bugado", resultado: "falhou",    tipo: "funcional", duracaoMs:  635, executadoEm: "2026-04-04" },
  { id: 16, titulo: "Confirmação de senha — validação",           sistema: "Form Bugado", resultado: "falhou",    tipo: "funcional", duracaoMs:  540, executadoEm: "2026-04-04" },
  { id: 17, titulo: "Telefone — caracteres não numéricos",        sistema: "Form Bugado", resultado: "bloqueado", tipo: "funcional", duracaoMs:    0, executadoEm: "2026-04-04" },
  { id: 18, titulo: "Data inválida 31/02 aceita",                 sistema: "Datas",       resultado: "falhou",    tipo: "funcional", duracaoMs:  430, executadoEm: "2026-04-05" },
  { id: 19, titulo: "Conversão de timezone com offset aleatório", sistema: "Datas",       resultado: "falhou",    tipo: "funcional", duracaoMs:  380, executadoEm: "2026-04-05" },
  { id: 20, titulo: "Timer continua após pausar",                 sistema: "Datas",       resultado: "pendente",  tipo: "funcional", duracaoMs:    0, executadoEm: "2026-04-05" },
];

// ── Configs de display ─────────────────────────────────────────────────────────

export const resultadoConfig: Record<ResultadoExec, { label: string; color: string; bg: string }> = {
  passou:    { label: "Passou",    color: "text-neon",         bg: "bg-neon/10" },
  falhou:    { label: "Falhou",    color: "text-coral",        bg: "bg-coral/10" },
  bloqueado: { label: "Bloqueado", color: "text-[#F4A8A3]",   bg: "bg-[#F4A8A3]/10" },
  pendente:  { label: "Pendente",  color: "text-off-white/50", bg: "bg-off-white/5" },
};

export const sistemaColor: Record<SistemaExec, string> = {
  "API":         "text-mint",
  "E-commerce":  "text-[#F4A8A3]",
  "Form Bugado": "text-neon",
  "Datas":       "text-[#B4D4D1]",
};

export const ITEMS_PER_PAGE = 5;
