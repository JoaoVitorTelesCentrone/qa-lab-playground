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
  stock: number;
  createdAt: string;
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

const rawProducts: Array<[number, string, ShopProduct["category"], number, number, string, string, number]> = [
  [1, "Kit Smoke Test", "Ferramentas", 89.9, 4.8, "KST", "Checklist fisico para fluxos criticos.", 18],
  [2, "Caderno Bug Report", "Acessorios", 39.9, 4.6, "CBR", "Template de investigacao e evidencia.", 4],
  [3, "Curso API Pratica", "Cursos", 249.9, 4.9, "API", "CRUD, contrato, auth e status codes.", 999],
  [4, "Livro Testes Exploratorios", "Livros", 74.9, 4.7, "LTE", "Charters, heuristicas e bug advocacy.", 0],
  [5, "Baralho de Riscos", "Ferramentas", 59.9, 4.5, "RISK", "Cartas para refinamento e discovery.", 7],
  [6, "Mousepad Atalhos QA", "Acessorios", 49.9, 4.4, "TAB", "Atalhos de browser, DevTools e Playwright.", 12],
  [7, "Curso Playwright", "Cursos", 299.9, 4.9, "PW", "Automacao robusta de UI e API.", 999],
  [8, "Livro Acessibilidade", "Livros", 82.9, 4.8, "A11Y", "Checklist WCAG para times de produto.", 3],
  [9, "Poster Piramide de Testes", "Acessorios", 29.9, 4.2, "PYR", "Referencia visual para estrategia.", 0],
  [10, "Workshop Flakiness", "Cursos", 199.9, 4.7, "WAIT", "Diagnostico de waits ruins e retries.", 999],
  [11, "Template PR Testavel", "Ferramentas", 24.9, 4.3, "PR", "Checklist de risco para pull requests.", 9],
  [12, "Guia CI de QA", "Livros", 69.9, 4.6, "CI", "Guia de pipeline minimo, evidencias e tags.", 15],
];

export const shopProducts: ShopProduct[] = rawProducts.map(([id, name, category, price, rating, image, description, stock], index) => ({ id, name, category, price, rating, image, description, stock, createdAt: `2026-0${(index % 6) + 1}-${String(index + 2).padStart(2, "0")}` }));

export const initialBookings: Booking[] = [
  { id: 1, firstname: "Ana", lastname: "Costa", totalprice: 320, depositpaid: true, bookingdates: { checkin: "2026-09-01", checkout: "2026-09-04" }, additionalneeds: "Breakfast" },
  { id: 2, firstname: "Bruno", lastname: "Souza", totalprice: 450, depositpaid: false, bookingdates: { checkin: "2026-09-10", checkout: "2026-09-12" }, additionalneeds: "Late checkout" },
  { id: 3, firstname: "Carla", lastname: "Mendes", totalprice: 210, depositpaid: true, bookingdates: { checkin: "2026-10-02", checkout: "2026-10-03" }, additionalneeds: "" },
];
