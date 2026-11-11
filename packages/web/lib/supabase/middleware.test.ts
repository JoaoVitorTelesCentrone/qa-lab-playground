import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { NextRequest } from "next/server";
import { ACCOUNTS_ENABLED } from "@/lib/product/features";
import { updateSession } from "./middleware";

const previousUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const previousKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

beforeEach(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://project.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_test";
});

afterEach(() => {
  if (previousUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  else process.env.NEXT_PUBLIC_SUPABASE_URL = previousUrl;

  if (previousKey === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  else process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = previousKey;
});

describe("updateSession", () => {
  test("redireciona visitante da mentoria e preserva o destino", async () => {
    const response = await updateSession(
      new NextRequest("https://qa-lab.test/mentoria/semanas/2?origem=email"),
    );

    expect(response.status).toBe(307);
    const location = new URL(response.headers.get("location")!);
    expect(location.pathname).toBe("/login");
    expect(location.searchParams.get("next")).toBe("/mentoria/semanas/2?origem=email");
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });

  test("mantem o conteudo publico acessivel", async () => {
    const response = await updateSession(
      new NextRequest("https://qa-lab.test/conteudo/modulos/fundamentos"),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });

  test("redireciona visitante de um board privado para o login", async () => {
    const response = await updateSession(new NextRequest("https://qa-lab.test/boards/demo"));

    expect(response.status).toBe(307);
    const location = new URL(response.headers.get("location")!);
    expect(location.pathname).toBe("/login");
    expect(location.searchParams.get("next")).toBe("/boards/demo");
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });

  test.each(["/boards", "/lab/bdd"])(
    "mantem %s publico quando contas estao desativadas",
    async (pathname) => {
      const response = await updateSession(new NextRequest(`https://qa-lab.test${pathname}`));

      expect(response.status).toBe(ACCOUNTS_ENABLED ? 307 : 200);
      if (!ACCOUNTS_ENABLED) expect(response.headers.get("location")).toBeNull();
    },
  );

  test("mantem uma rota publica acessivel", async () => {
    const response = await updateSession(new NextRequest("https://qa-lab.test/login"));

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });
});
