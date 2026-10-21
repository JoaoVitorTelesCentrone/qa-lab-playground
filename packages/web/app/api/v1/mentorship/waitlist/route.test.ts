import { expect, mock, test } from "bun:test";

let allowed = true;
let rateError = false;
let inserted = 0;
const rpc = mock(async () => ({ data: { allowed, retry_after_seconds: 120 }, error: rateError ? { code: "RPC_UNAVAILABLE" } : null }));

mock.module("@/lib/supabase/admin", () => ({
  hasServiceRole: () => false,
  createAdminClient: () => ({
    rpc,
    from: () => ({ insert: async () => { inserted += 1; return { error: null }; } }),
  }),
}));

const { POST } = await import("./route");

function request() {
  return new Request("http://localhost/api/v1/mentorship/waitlist", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ fullName: "Ana Silva", email: "ana@example.com", acceptedContact: true }),
  });
}

test("returns 429 without writing a lead after the shared limit", async () => {
  allowed = false;
  rateError = false;
  inserted = 0;
  const response = await POST(request());
  expect(response.status).toBe(429);
  expect(response.headers.get("Retry-After")).toBe("120");
  expect(inserted).toBe(0);
});

test("accepts a valid lead when the shared limit allows it", async () => {
  allowed = true;
  rateError = false;
  inserted = 0;
  const response = await POST(request());
  expect(response.status).toBe(201);
  expect(inserted).toBe(1);
  expect(rpc).toHaveBeenCalled();
});

test("fails closed if the shared limit cannot be checked", async () => {
  rateError = true;
  inserted = 0;
  expect((await POST(request())).status).toBe(503);
  expect(inserted).toBe(0);
});
