import type { Lab } from "@/lib/playground/catalog";

/**
 * As 6 trilhas públicas do /labs. Não confundir com `lib/product/tracks.ts`, que
 * são as trilhas de certificado (desligadas por TRACKS_ENABLED).
 */
export const LAB_TRACKS = [
  { id: "ui", label: "UI", description: "Web flows, forms, checkout and automation with Cypress, Playwright and Selenium." },
  { id: "api", label: "API", description: "Contracts, status codes, data and backend investigation." },
  { id: "exploratory", label: "Exploratory", description: "Investigate a real product with charters, oracles and evidence." },
  { id: "product", label: "Product", description: "Business rules, states, operations and reports." },
  { id: "ci", label: "CI", description: "Pipelines, quality gates and suites running in CI." },
  { id: "non-functional", label: "Non-functional", description: "Performance, load, accessibility and security." },
] as const;

export type LabTrackId = (typeof LAB_TRACKS)[number]["id"];

export const isLabTrackId = (value: string | undefined | null): value is LabTrackId => LAB_TRACKS.some((track) => track.id === value);

/** Área do Lab (`requiredFeature`) → trilha. Toda área nova precisa entrar aqui (há teste). */
const TRACK_BY_AREA: Record<string, LabTrackId> = {
  Catalogo: "ui", Checkout: "ui", Pedidos: "ui", Clientes: "ui",
  Cypress: "ui", Playwright: "ui", "Selenium e Appium": "ui", "Visual Diff Bench": "ui",
  Postman: "api", Bruno: "api", "Contract Inspector": "api", "HTTP Request Runner": "api",
  "SQL Explorer": "api", "Test Data Factory": "api", "Trace Explorer": "api",
  Broto: "exploratory",
  Operacao: "product", Relatorios: "product", Governanca: "product", Atendimento: "product", "State Machine Explorer": "product",
  Performance: "non-functional", k6: "non-functional", Acessibilidade: "non-functional",
  "Accessibility Inspector": "non-functional", "Load Profile Bench": "non-functional", "Security Probe": "non-functional",
};

/**
 * Labs cujo assunto é o pipeline, mesmo morando numa área de ferramenta: o
 * módulo de CI/CD do Broto (150–156) e os Labs "leve a suíte para o CI".
 */
const CI_LABS = new Set([150, 151, 152, 153, 154, 155, 156, 211, 232, 286, 306]);

export function labTrackOf(lab: Pick<Lab, "number" | "requiredFeature">): LabTrackId | undefined {
  if (CI_LABS.has(lab.number)) return "ci";
  return TRACK_BY_AREA[lab.requiredFeature];
}

/**
 * Labs do playground com modo bugado (`?bug=1`). Ficam no topo da trilha: são a
 * forma mais rápida de ver um bug real ligado e desligado.
 */
export const PLAYGROUND_LABS: Array<{ href: string; title: string; summary: string; track: LabTrackId; hasBugMode: boolean }> = [
  { href: "/labs/login", title: "A login that lies about locked accounts", summary: "Required fields, credentials, lockout and focus.", track: "ui", hasBugMode: true },
  { href: "/labs/waits", title: "Waits, spinners and infinite loading", summary: "Observable UI state instead of fixed sleeps.", track: "ui", hasBugMode: true },
  { href: "/labs/api-crud", title: "Bookings REST API", summary: "CRUD, auth, pagination and contract checks.", track: "api", hasBugMode: true },
  { href: "/labs/exploratorio", title: "Exploratory charter session", summary: "Charter, typed notes, bug report and Markdown export.", track: "exploratory", hasBugMode: false },
  { href: "/labs/acessibilidade", title: "Keyboard-only accessibility", summary: "Focus order, labels, aria-live and modals.", track: "non-functional", hasBugMode: true },
];
