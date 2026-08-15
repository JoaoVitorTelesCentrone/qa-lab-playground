import { fail, ok, readJson, withUser } from "@/lib/product/api";
import { createRecord, deleteRecord, loadApp, PracticeError, updateRecord } from "@/lib/product/practice/store";
import { findResource } from "@/lib/product/practice/resources";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ resource: string }> };

// Um endpoint para todas as entidades dos ambientes de prática. O que cada
// recurso aceita vem de lib/product/practice/resources.ts.
//
// GET    /api/v1/practice/<recurso>       lista
// POST   /api/v1/practice/<recurso>       cria
// PATCH  /api/v1/practice/<recurso>?id=   atualiza
// DELETE /api/v1/practice/<recurso>?id=   exclui

export async function GET(_request: Request, context: Context) {
  const { resource: resourceId } = await context.params;
  return withUser(async (user) => {
    const resource = findResource(resourceId);
    if (!resource) return fail("Recurso não encontrado.", 404);
    const data = await loadApp(user.id, resource.appId);
    return ok(data[resource.id] ?? []);
  });
}

export async function POST(request: Request, context: Context) {
  const { resource } = await context.params;
  const body = await readJson(request);
  return withUser((user) => run(() => createRecord(user.id, resource, body), 201));
}

export async function PATCH(request: Request, context: Context) {
  const { resource } = await context.params;
  const id = new URL(request.url).searchParams.get("id");
  const body = await readJson(request);
  return withUser(async (user) => {
    if (!id) return fail("Informe o id do registro.", 400);
    return run(() => updateRecord(user.id, resource, id, body));
  });
}

export async function DELETE(request: Request, context: Context) {
  const { resource } = await context.params;
  const id = new URL(request.url).searchParams.get("id");
  return withUser(async (user) => {
    if (!id) return fail("Informe o id do registro.", 400);
    return run(async () => { await deleteRecord(user.id, resource, id); return { id }; });
  });
}

// PracticeError carrega o status certo (403 de permissão, 422 de validação,
// 404 de registro inexistente); o resto sobe para o 500 do withUser.
async function run<T>(action: () => Promise<T>, status = 200) {
  try {
    return ok(await action(), status);
  } catch (error) {
    if (error instanceof PracticeError) return fail(error.message, error.status, error.details);
    throw error;
  }
}
