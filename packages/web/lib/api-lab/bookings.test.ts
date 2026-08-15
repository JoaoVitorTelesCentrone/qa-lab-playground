import { describe, expect, test } from "bun:test";
import { createToken, validateToken } from "./auth-token";
import { handleApiLab } from "./handler";
import { resetApiRateLimitForTests } from "./rate-limit";

function request(path: string, options: RequestInit = {}) {
  return new Request(`http://localhost${path}`, options);
}

async function payload<T>(response: Response) {
  return response.json() as Promise<T>;
}

function session(response: Response) {
  const id = response.headers.get("x-qalab-session");
  expect(id).toBeTruthy();
  return id as string;
}

describe("Bookings API", () => {
  test("assina token com HMAC e rejeita token adulterado ou expirado", async () => {
    const token = createToken("standard_user", 1);
    const parts = token.split(".");
    const tampered = `qalab.${parts[1].slice(0, -1)}x.${parts[2]}`;
    expect(validateToken(`Bearer ${token}`)).toBe("standard_user");
    expect(validateToken(`Bearer ${tampered}`)).toBeNull();
    await new Promise((resolve) => setTimeout(resolve, 1500));
    expect(validateToken(`Bearer ${token}`)).toBeNull();
  });

  test("permite CRUD com token e bloqueia alteracao sem auth", async () => {
    const reset = await handleApiLab(request("/api/test/reset", { method: "POST" }), "POST", { segments: ["test", "reset"] });
    const sessionId = session(reset);

    const createdResponse = await handleApiLab(request("/api/bookings", {
      method: "POST",
      headers: { "x-qalab-session": sessionId },
      body: JSON.stringify({
        firstname: "Lia",
        lastname: "Teste",
        totalprice: 123,
        depositpaid: true,
        bookingdates: { checkin: "2026-12-01", checkout: "2026-12-02" },
        additionalneeds: "",
      }),
    }), "POST", { segments: ["bookings"] });
    expect(createdResponse.status).toBe(201);
    const created = await payload<{ data: { id: number } }>(createdResponse);

    const unauthorized = await handleApiLab(request(`/api/bookings/${created.data.id}`, {
      method: "PATCH",
      headers: { "x-qalab-session": sessionId },
      body: JSON.stringify({ additionalneeds: "Mesa" }),
    }), "PATCH", { segments: ["bookings", String(created.data.id)] });
    expect(unauthorized.status).toBe(401);

    const login = await handleApiLab(request("/api/auth/login", {
      method: "POST",
      headers: { "x-qalab-session": sessionId },
      body: JSON.stringify({ username: "standard_user", password: "qa_lab_secret" }),
    }), "POST", { segments: ["auth", "login"] });
    const auth = await payload<{ data: { token: string } }>(login);

    const updated = await handleApiLab(request(`/api/bookings/${created.data.id}`, {
      method: "PATCH",
      headers: { authorization: `Bearer ${auth.data.token}`, "x-qalab-session": sessionId },
      body: JSON.stringify({ additionalneeds: "Mesa" }),
    }), "PATCH", { segments: ["bookings", String(created.data.id)] });
    expect(updated.status).toBe(200);

    const deleted = await handleApiLab(request(`/api/bookings/${created.data.id}`, {
      method: "DELETE",
      headers: { authorization: `Bearer ${auth.data.token}`, "x-qalab-session": sessionId },
    }), "DELETE", { segments: ["bookings", String(created.data.id)] });
    expect(deleted.status).toBe(204);
  });

  test("isola reservas por x-qalab-session", async () => {
    const resetA = await handleApiLab(request("/api/test/reset", { method: "POST", headers: { "x-qalab-session": "suite-a" } }), "POST", { segments: ["test", "reset"] });
    const resetB = await handleApiLab(request("/api/test/reset", { method: "POST", headers: { "x-qalab-session": "suite-b" } }), "POST", { segments: ["test", "reset"] });
    expect(resetA.headers.get("x-qalab-session")).toBe("suite-a");
    expect(resetB.headers.get("x-qalab-session")).toBe("suite-b");

    await handleApiLab(request("/api/bookings", {
      method: "POST",
      headers: { "x-qalab-session": "suite-a" },
      body: JSON.stringify({
        firstname: "Sessao",
        lastname: "A",
        totalprice: 450,
        depositpaid: true,
        bookingdates: { checkin: "2026-12-20", checkout: "2026-12-21" },
        additionalneeds: "",
      }),
    }), "POST", { segments: ["bookings"] });

    const listA = await payload<{ meta: { total: number } }>(await handleApiLab(request("/api/bookings", { headers: { "x-qalab-session": "suite-a" } }), "GET", { segments: ["bookings"] }));
    const listB = await payload<{ meta: { total: number } }>(await handleApiLab(request("/api/bookings", { headers: { "x-qalab-session": "suite-b" } }), "GET", { segments: ["bookings"] }));
    expect(listA.meta.total).toBe(4);
    expect(listB.meta.total).toBe(3);
  });

  test("aplica rate limit por IP em escrita publica", async () => {
    resetApiRateLimitForTests();
    let response = new Response();
    for (let index = 0; index < 121; index += 1) {
      response = await handleApiLab(request("/api/auth/login", {
        method: "POST",
        headers: { "x-forwarded-for": "203.0.113.77" },
        body: JSON.stringify({ username: "standard_user", password: "qa_lab_secret" }),
      }), "POST", { segments: ["auth", "login"] });
    }
    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBeTruthy();
  });
});
