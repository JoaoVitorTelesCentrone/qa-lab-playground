import { fail, readJson, withUser } from "@/lib/product/api";
import { asWorkItemPriority, asWorkItemType, normalizeAcceptanceCriteria, normalizeDescription, normalizeItemTitle, optionalSeverity, optionalStoryPoints } from "@/lib/board/domain";
import { runBoard } from "@/lib/board/http";
import { archiveWorkItem, getWorkItemDetail, updateWorkItem } from "@/lib/board/store";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ itemId: string }> };

function versionOf(value: unknown) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function dueDate(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(`${value}T12:00:00Z`))) return undefined;
  return value;
}

export async function GET(_request: Request, context: Context) {
  const { itemId } = await context.params;
  return withUser(() => runBoard(() => getWorkItemDetail(itemId)));
}

export async function PATCH(request: Request, context: Context) {
  const { itemId } = await context.params;
  const body = await readJson(request);
  return withUser(async () => {
    const expectedVersion = versionOf(body.expectedVersion);
    const title = normalizeItemTitle(body.title);
    const dueAt = dueDate(body.dueAt);
    if (!expectedVersion) return fail("A versão do item é inválida.", 422, { expectedVersion: "Informe um inteiro positivo." });
    if (!title) return fail("Informe o título do item.", 422, { title: "Campo obrigatório." });
    if (dueAt === undefined) return fail("A data de vencimento é inválida.", 422, { dueAt: "Use uma data válida." });
    return runBoard(() => updateWorkItem(itemId, {
      expectedVersion,
      title,
      description: normalizeDescription(body.description),
      type: asWorkItemType(body.type),
      priority: asWorkItemPriority(body.priority),
      severity: optionalSeverity(body.severity),
      storyPoints: optionalStoryPoints(body.storyPoints),
      dueAt,
      acceptanceCriteria: normalizeAcceptanceCriteria(body.acceptanceCriteria),
    }));
  });
}

export async function DELETE(request: Request, context: Context) {
  const { itemId } = await context.params;
  const body = await readJson(request);
  return withUser(async () => {
    const expectedVersion = versionOf(body.expectedVersion);
    if (!expectedVersion) return fail("A versão do item é inválida.", 422);
    return runBoard(() => archiveWorkItem(itemId, expectedVersion));
  });
}

