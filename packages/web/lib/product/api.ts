// Helpers da API v1 do produto.
//
// Contrato: sempre JSON, sempre `{ data }` no sucesso e `{ error }` na falha,
// com status HTTP coerente. Validação é feita à mão — a API tem poucos campos
// e a mensagem de erro em português faz parte do produto (o aluno também testa
// esta API).

import { getSessionUser, trackEvent, type SessionUser } from "./store";

export function ok<T>(data: T, status = 200) {
  return Response.json({ data }, { status });
}

export function fail(message: string, status: number, details?: Record<string, string>) {
  return Response.json({ error: { message, details } }, { status });
}

/** Executa `handler` com o usuário da sessão, ou responde 401. */
export async function withUser(handler: (user: SessionUser) => Promise<Response>) {
  const user = await getSessionUser();
  if (!user) return fail("Faça login para acessar seu progresso.", 401);
  try {
    return await handler(user);
  } catch (error) {
    // O 500 vira evento: sem isso, o painel de métricas não teria como mostrar
    // taxa de erro, e o produto descobriria a falha pelo aluno.
    const message = error instanceof Error ? error.message : "Erro inesperado.";
    await trackEvent(user.id, "api_error", { message });
    return fail(message, 500);
  }
}

export async function readJson(request: Request): Promise<Record<string, unknown>> {
  try {
    const body = await request.json();
    return body && typeof body === "object" && !Array.isArray(body) ? (body as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

export class ValidationError extends Error {
  constructor(readonly details: Record<string, string>) {
    super("Corpo da requisição inválido.");
  }
}

/** Acumula os erros de todos os campos antes de responder, em vez de parar no primeiro. */
export class FieldReader {
  private readonly details: Record<string, string> = {};

  constructor(private readonly body: Record<string, unknown>) {}

  text(field: string, { max = 2000, required = true } = {}) {
    const raw = this.body[field];
    const value = typeof raw === "string" ? raw.trim() : "";
    if (!value) {
      if (required) this.details[field] = "Campo obrigatório.";
      return "";
    }
    if (value.length > max) {
      this.details[field] = `Use no máximo ${max} caracteres.`;
      return "";
    }
    return value;
  }

  oneOf<T extends string>(field: string, allowed: readonly T[]): T {
    const raw = this.body[field];
    if (typeof raw === "string" && (allowed as readonly string[]).includes(raw)) return raw as T;
    this.details[field] = `Valor deve ser um de: ${allowed.join(", ")}.`;
    return allowed[0];
  }

  done() {
    if (Object.keys(this.details).length > 0) throw new ValidationError(this.details);
  }
}

/** Converte ValidationError em 422 e mantém o resto no 500 do withUser. */
export async function validated(handler: () => Promise<Response>) {
  try {
    return await handler();
  } catch (error) {
    if (error instanceof ValidationError) return fail(error.message, 422, error.details);
    throw error;
  }
}
