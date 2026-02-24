// ==============================
// Domain Models
// ==============================

export interface User {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  ativo: boolean;
  criadoEm: string;
}

export interface Product {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  categoria: string;
  ativo: boolean;
}

export interface Order {
  id: number;
  usuarioId: number;
  produtos: OrderItem[];
  status: "pendente" | "processando" | "enviado" | "entregue" | "cancelado";
  total: number;
  criadoEm: string;
}

export interface OrderItem {
  produtoId: number;
  quantidade: number;
  precoUnitario: number;
}

// ==============================
// API Response Wrappers
// ==============================

export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

// ==============================
// Chaos Configuration
// ==============================

export interface ChaosEndpointConfig {
  enabled: boolean;
  errorRate: number; // 0-100, percentage chance of triggering chaos
  delayMs: number; // artificial delay in ms
  wrongData: boolean; // return incorrect data
}

export interface ChaosConfig {
  [endpointKey: string]: ChaosEndpointConfig;
}

// ==============================
// Scenarios
// ==============================

export type ScenarioDifficulty = "iniciante" | "intermediario" | "avancado";
export type ScenarioStatus = "nao_iniciado" | "em_progresso" | "completo";
export type ScenarioModule = "api" | "form" | "exploratorio";

export interface ScenarioObjective {
  id: string;
  descricao: string;
  dica: string;
  respostaEsperada: string;
}

export interface Scenario {
  id: string;
  titulo: string;
  descricao: string;
  descricaoCompleta: string;
  modulo: ScenarioModule;
  dificuldade: ScenarioDifficulty;
  objetivos: ScenarioObjective[];
  endpointsRelacionados?: string[];
}

// ==============================
// API Endpoint Catalog
// ==============================

export interface EndpointInfo {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  descricao: string;
  bugDescricao: string;
  bodyExemplo?: Record<string, unknown>;
}
