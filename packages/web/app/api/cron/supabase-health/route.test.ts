import { afterAll, expect, mock, test } from "bun:test";

const previousSecret = process.env.CRON_SECRET;
let databaseError: { message: string } | null = null;
let queries = 0;

mock.module("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({
    from: (table: string) => {
      expect(table).toBe("profiles");
      return {
        select: (columns: string) => {
          expect(columns).toBe("id");
          return {
            limit: async (limit: number) => {
              expect(limit).toBe(1);
              queries += 1;
              return { error: databaseError };
            },
          };
        },
      };
    },
  }),
}));

const { GET } = await import("./route");

afterAll(() => {
  if (previousSecret === undefined) delete process.env.CRON_SECRET;
  else process.env.CRON_SECRET = previousSecret;
});

test("rejects an unauthorized request without querying the database", async () => {
  process.env.CRON_SECRET = "test-secret";
  queries = 0;
  const response = await GET(new Request("http://localhost/api/cron/supabase-health"));
  expect(response.status).toBe(401);
  expect(queries).toBe(0);
});

test("queries Supabase for an authorized cron request", async () => {
  process.env.CRON_SECRET = "test-secret";
  databaseError = null;
  queries = 0;
  const response = await GET(new Request("http://localhost/api/cron/supabase-health", {
    headers: { authorization: "Bearer test-secret" },
  }));
  expect(response.status).toBe(200);
  expect(queries).toBe(1);
});

test("reports a database failure", async () => {
  process.env.CRON_SECRET = "test-secret";
  databaseError = { message: "database unavailable" };
  const response = await GET(new Request("http://localhost/api/cron/supabase-health", {
    headers: { authorization: "Bearer test-secret" },
  }));
  expect(response.status).toBe(503);
  databaseError = null;
});
