export type ShopUser = {
  username: string;
  password: string;
  role: "customer" | "support" | "admin";
  state: "active" | "locked" | "problem" | "slow" | "error" | "visual" | "keyboard";
};

export type ShopProduct = {
  id: number;
  name: string;
  category: "Livros" | "Ferramentas" | "Cursos" | "Acessorios";
  price: number;
  rating: number;
  image: string;
  description: string;
};

export type Booking = {
  id: number;
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
  additionalneeds: string;
};

export const shopUsers: ShopUser[] = [
  { username: "standard_user", password: "qa_lab_secret", role: "customer", state: "active" },
  { username: "locked_out_user", password: "qa_lab_secret", role: "customer", state: "locked" },
  { username: "problem_user", password: "qa_lab_secret", role: "customer", state: "problem" },
  { username: "performance_user", password: "qa_lab_secret", role: "customer", state: "slow" },
  { username: "error_user", password: "qa_lab_secret", role: "support", state: "error" },
  { username: "visual_user", password: "qa_lab_secret", role: "customer", state: "visual" },
  { username: "keyboard_user", password: "qa_lab_secret", role: "customer", state: "keyboard" },
];

export const shopProducts: ShopProduct[] = [
  { id: 1, name: "Kit Smoke Test", category: "Ferramentas", price: 89.9, rating: 4.8, image: "KST", description: "Checklist fisico para fluxos criticos." },
  { id: 2, name: "Caderno Bug Report", category: "Acessorios", price: 39.9, rating: 4.6, image: "CBR", description: "Template de investigacao e evidencia." },
  { id: 3, name: "Curso API Pratica", category: "Cursos", price: 249.9, rating: 4.9, image: "API", description: "CRUD, contrato, auth e status codes." },
  { id: 4, name: "Livro Testes Exploratorios", category: "Livros", price: 74.9, rating: 4.7, image: "LTE", description: "Charters, heuristicas e bug advocacy." },
  { id: 5, name: "Baralho de Riscos", category: "Ferramentas", price: 59.9, rating: 4.5, image: "RISK", description: "Cartas para refinamento e discovery." },
  { id: 6, name: "Mousepad Atalhos QA", category: "Acessorios", price: 49.9, rating: 4.4, image: "TAB", description: "Atalhos de browser, DevTools e Playwright." },
  { id: 7, name: "Curso Playwright", category: "Cursos", price: 299.9, rating: 4.9, image: "PW", description: "Automacao robusta de UI e API." },
  { id: 8, name: "Livro Acessibilidade", category: "Livros", price: 82.9, rating: 4.8, image: "A11Y", description: "Checklist WCAG para times de produto." },
  { id: 9, name: "Poster Piramide de Testes", category: "Acessorios", price: 29.9, rating: 4.2, image: "PYR", description: "Referencia visual para estrategia." },
  { id: 10, name: "Workshop Flakiness", category: "Cursos", price: 199.9, rating: 4.7, image: "WAIT", description: "Diagnostico de waits ruins e retries." },
  { id: 11, name: "Template PR Testavel", category: "Ferramentas", price: 24.9, rating: 4.3, image: "PR", description: "Checklist de risco para pull requests." },
  { id: 12, name: "Guia CI de QA", category: "Livros", price: 69.9, rating: 4.6, image: "CI", description: "Pipeline minimo, evidencias e tags." },
];

export const initialBookings: Booking[] = [
  { id: 1, firstname: "Ana", lastname: "Costa", totalprice: 320, depositpaid: true, bookingdates: { checkin: "2026-09-01", checkout: "2026-09-04" }, additionalneeds: "Breakfast" },
  { id: 2, firstname: "Bruno", lastname: "Souza", totalprice: 450, depositpaid: false, bookingdates: { checkin: "2026-09-10", checkout: "2026-09-12" }, additionalneeds: "Late checkout" },
  { id: 3, firstname: "Carla", lastname: "Mendes", totalprice: 210, depositpaid: true, bookingdates: { checkin: "2026-10-02", checkout: "2026-10-03" }, additionalneeds: "" },
];

export function createToken(username: string) {
  return `qa-lab-token-${username}`;
}

export function validateToken(auth: string | null) {
  if (!auth?.startsWith("Bearer qa-lab-token-")) return null;
  return auth.replace("Bearer qa-lab-token-", "");
}
