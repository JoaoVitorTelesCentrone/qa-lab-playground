import { describe, expect, test } from "bun:test";
import { handleApiLab } from "./handler";

function request(path: string, options: RequestInit = {}) { return new Request(`http://localhost${path}`, options); }
async function payload(response: Response) { return response.json() as Promise<Record<string, unknown>>; }

describe("API Lab", () => {
  test("mantém paginação correta no cenário normal", async () => { const response = await handleApiLab(request("/api/users?page=2&perPage=5"), "GET", { segments: ["users"] }); const result = await payload(response) as { data: { id: number }[] }; expect(result.data[0].id).toBe(6); });
  test("repete registro no bug de paginação de usuários", async () => { const response = await handleApiLab(request("/api/users?page=2&perPage=5&scenario=bug"), "GET", { segments: ["users"] }); const result = await payload(response) as { data: { id: number }[] }; expect(result.data[0].id).toBe(5); expect(response.headers.get("x-qa-lab-scenario")).toBe("bug"); });
  test("distingue 404 correto do status 200 defeituoso", async () => { const normal = await handleApiLab(request("/api/products/999"), "GET", { segments: ["products", "999"] }); const bug = await handleApiLab(request("/api/products/999?scenario=bug"), "GET", { segments: ["products", "999"] }); expect(normal.status).toBe(404); expect(bug.status).toBe(200); });
  test("rejeita produto inexistente em pedido normal", async () => { const response = await handleApiLab(request("/api/orders", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ usuarioId: 1, produtos: [{ produtoId: 999, quantidade: 1 }] }) }), "POST", { segments: ["orders"] }); expect(response.status).toBe(422); });
  test("expõe contrato snake_case apenas no cenário bug", async () => { const response = await handleApiLab(request("/api/orders/1?scenario=bug"), "GET", { segments: ["orders", "1"] }); const result = await payload(response) as { data: Record<string, unknown> }; expect(result.data.order_id).toBe(1); expect(result.data.usuarioId).toBeUndefined(); });
  test("login normal não revela existência do e-mail", async () => { const known = await handleApiLab(request("/api/auth/login", { method: "POST", body: JSON.stringify({ email: "ana.costa@qalab.com", senha: "x" }) }), "POST", { segments: ["auth", "login"] }); const unknown = await handleApiLab(request("/api/auth/login", { method: "POST", body: JSON.stringify({ email: "nobody@example.com", senha: "x" }) }), "POST", { segments: ["auth", "login"] }); expect(await known.text()).toBe(await unknown.text()); });
});

