// Acesso ao estado dos ambientes de prática.
//
// Server-side apenas. A permissão é conferida aqui, não no componente: quem
// chama a API com um perfil sem direito recebe 403 mesmo que a interface
// tivesse mostrado o botão.

import { createClient } from "@/lib/supabase/server";
import { sanitizeBugIds } from "./bugs";
import { domainErrors } from "./domain";
import { can, defaultPersonaId, findPersona, type PracticeAction } from "./personas";
import { findResource, parseRecord, practiceResources, resourcesForApp, type PracticeResource } from "./resources";
import { seedRows } from "./seed";
import type { PracticeAppId } from "../apps";

/** Linha de qualquer recurso de prática. O id vem do banco (ou do seed local). */
export type PracticeRow = Record<string, unknown> & { id: string };
export type PracticeRows = Record<string, PracticeRow[]>;

export type PracticeSettings = { personaId: string; activeBugs: string[]; instructor: boolean; seededAt: string | null };

export const defaultSettings: PracticeSettings = { personaId: defaultPersonaId, activeBugs: [], instructor: false, seededAt: null };

export class PracticeError extends Error {
  constructor(message: string, readonly status: number, readonly details?: Record<string, string>) {
    super(message);
  }
}

export async function getSettings(userId: string): Promise<PracticeSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("practice_settings").select("persona_id,active_bugs,instructor,seeded_at").eq("user_id", userId).maybeSingle();
  // Migração 0006 ainda não aplicada: o ambiente abre com o padrão em vez de quebrar.
  if (error || !data) return defaultSettings;
  return { personaId: data.persona_id, activeBugs: sanitizeBugIds(data.active_bugs), instructor: Boolean(data.instructor), seededAt: data.seeded_at };
}

export async function saveSettings(userId: string, patch: Partial<Pick<PracticeSettings, "personaId" | "activeBugs" | "instructor">>) {
  const supabase = await createClient();
  const current = await getSettings(userId);
  const next: PracticeSettings = {
    ...current,
    personaId: patch.personaId ? findPersona(patch.personaId).id : current.personaId,
    activeBugs: patch.activeBugs ? sanitizeBugIds(patch.activeBugs) : current.activeBugs,
    instructor: patch.instructor ?? current.instructor,
  };
  const { error } = await supabase.from("practice_settings").upsert({ user_id: userId, persona_id: next.personaId, active_bugs: next.activeBugs, instructor: next.instructor }, { onConflict: "user_id" });
  if (error) throw new PracticeError(error.message, 500);
  return next;
}

/** Todas as linhas de um ambiente, indexadas pelo id do recurso. */
export async function loadApp(userId: string, appId: PracticeAppId) {
  const supabase = await createClient();
  const resources = resourcesForApp(appId);
  const results = await Promise.all(resources.map((resource) => supabase.from(resource.table).select("*").eq("user_id", userId).order(resource.order.column, { ascending: resource.order.ascending })));
  return Object.fromEntries(resources.map((resource, index) => [resource.id, results[index].error ? [] : (results[index].data ?? [])])) as PracticeRows;
}

async function authorize(userId: string, resource: PracticeResource, action: PracticeAction) {
  const settings = await getSettings(userId);
  const persona = findPersona(settings.personaId);
  if (!can(persona, resource.id, action)) {
    throw new PracticeError(`O perfil "${persona.name}" não pode ${actionLabel(action)} em ${resource.label}.`, 403);
  }
  return settings;
}

const actionLabel = (action: PracticeAction) => ({ read: "consultar", create: "criar", update: "editar", delete: "excluir" })[action];

export async function createRecord(userId: string, resourceId: string, body: Record<string, unknown>) {
  const resource = requireResource(resourceId);
  const settings = await authorize(userId, resource, "create");
  const { values, errors } = parseRecord(resource, body);
  if (Object.keys(errors).length > 0) throw new PracticeError("Verifique os campos destacados.", 422, errors);

  const rows = await loadApp(userId, resource.appId);
  const conflicts = domainErrors(resource.id, values, { rows, activeBugs: settings.activeBugs });
  if (Object.keys(conflicts).length > 0) throw new PracticeError("Verifique os campos destacados.", 422, conflicts);

  const supabase = await createClient();
  const { data, error } = await supabase.from(resource.table).insert({ ...values, user_id: userId }).select("*").single();
  if (error) throw new PracticeError(error.message, 500);
  return data;
}

export async function updateRecord(userId: string, resourceId: string, id: string, body: Record<string, unknown>) {
  const resource = requireResource(resourceId);
  const settings = await authorize(userId, resource, "update");
  const { values, errors } = parseRecord(resource, body, { partial: true });
  if (Object.keys(errors).length > 0) throw new PracticeError("Verifique os campos destacados.", 422, errors);
  if (Object.keys(values).length === 0) throw new PracticeError("Nenhum campo para atualizar.", 422);

  // As regras de domínio valem sobre o registro depois da edição, não só sobre
  // os campos que vieram no PATCH.
  const rows = await loadApp(userId, resource.appId);
  const current = (rows[resource.id] ?? []).find((row) => String(row.id) === id);
  if (!current) throw new PracticeError("Registro não encontrado.", 404);
  const conflicts = domainErrors(resource.id, { ...current, ...values }, { rows, activeBugs: settings.activeBugs, recordId: id });
  if (Object.keys(conflicts).length > 0) throw new PracticeError("Verifique os campos destacados.", 422, conflicts);

  const supabase = await createClient();
  const { data, error } = await supabase.from(resource.table).update(values).eq("user_id", userId).eq("id", id).select("*").maybeSingle();
  if (error) throw new PracticeError(error.message, 500);
  if (!data) throw new PracticeError("Registro não encontrado.", 404);
  return data;
}

export async function deleteRecord(userId: string, resourceId: string, id: string) {
  const resource = requireResource(resourceId);
  await authorize(userId, resource, "delete");
  const supabase = await createClient();
  const { error } = await supabase.from(resource.table).delete().eq("user_id", userId).eq("id", id);
  if (error) throw new PracticeError(error.message, 500);
}

function requireResource(resourceId: string) {
  const resource = findResource(resourceId);
  if (!resource) throw new PracticeError("Recurso não encontrado.", 404);
  return resource;
}

/**
 * Restaura a massa de teste ao estado conhecido de `seed.ts`. Apaga o que
 * existe antes de inserir, para a repetibilidade valer também depois que o
 * aluno bagunçou os dados. Só recria os ambientes pedidos.
 */
export async function seedApps(userId: string, appIds: PracticeAppId[]) {
  const supabase = await createClient();
  const resources = practiceResources.filter((resource) => appIds.includes(resource.appId));

  for (const resource of resources) {
    const { error } = await supabase.from(resource.table).delete().eq("user_id", userId);
    if (error) throw new PracticeError(error.message, 500);
  }
  for (const resource of resources) {
    const rows = (seedRows[resource.id] ?? []).map((row) => ({ ...row, user_id: userId }));
    if (rows.length === 0) continue;
    const { error } = await supabase.from(resource.table).insert(rows);
    if (error) throw new PracticeError(error.message, 500);
  }

  // O QA Lab não tem massa autoral para recriar: restaurar ali significa
  // esvaziar carrinho e pedidos, que é o estado conhecido de quem chega na loja.
  if (appIds.includes("qa-lab")) {
    await supabase.from("practice_carts").delete().eq("user_id", userId);
    await supabase.from("practice_orders").delete().eq("user_id", userId);
  }

  await supabase.from("practice_settings").upsert({ user_id: userId, seeded_at: new Date().toISOString() }, { onConflict: "user_id" });
}

/** Cria a massa inicial na primeira visita; depois disso não mexe mais nos dados. */
export async function ensureSeeded(userId: string, appIds: PracticeAppId[]) {
  const settings = await getSettings(userId);
  if (settings.seededAt) return settings;
  try {
    await seedApps(userId, appIds);
  } catch {
    // Sem as tabelas (migração pendente) o ambiente ainda abre, só vazio.
    return settings;
  }
  return getSettings(userId);
}
