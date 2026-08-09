import { describe, expect, test } from "bun:test";
import { handleApiLab } from "./handler";

function request(path: string, options: RequestInit = {}) {
  return new Request(`http://localhost${path}`, options);
}

async function payload<T>(response: Response) {
  return response.json() as Promise<T>;
}

describe("Bookings API", () => {
  test("permite CRUD com token e bloqueia alteracao sem auth", async () => {
    await handleApiLab(request("/api/test/reset", { method: "POST" }), "POST", { segments: ["test", "reset"] });

    const createdResponse = await handleApiLab(request("/api/bookings", {
      method: "POST",
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
      body: JSON.stringify({ additionalneeds: "Mesa" }),
    }), "PATCH", { segments: ["bookings", String(created.data.id)] });
    expect(unauthorized.status).toBe(401);

    const login = await handleApiLab(request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username: "standard_user", password: "qa_lab_secret" }),
    }), "POST", { segments: ["auth", "login"] });
    const auth = await payload<{ data: { token: string } }>(login);

    const updated = await handleApiLab(request(`/api/bookings/${created.data.id}`, {
      method: "PATCH",
      headers: { authorization: `Bearer ${auth.data.token}` },
      body: JSON.stringify({ additionalneeds: "Mesa" }),
    }), "PATCH", { segments: ["bookings", String(created.data.id)] });
    expect(updated.status).toBe(200);

    const deleted = await handleApiLab(request(`/api/bookings/${created.data.id}`, {
      method: "DELETE",
      headers: { authorization: `Bearer ${auth.data.token}` },
    }), "DELETE", { segments: ["bookings", String(created.data.id)] });
    expect(deleted.status).toBe(204);
  });
});
