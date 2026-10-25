import { fail, ok, readJson, withUser } from "@/lib/product/api";
import { savePortfolioCaseDraft } from "@/lib/product/store";

export const dynamic = "force-dynamic";

const limits = { title: 120, context: 3000, approach: 5000, findings: 5000, decision: 3000, reflection: 3000 } as const;

// PATCH /api/v1/portfolio/case { submissionId, customization }
export async function PATCH(request: Request) {
  const body = await readJson(request);
  return withUser(async (user) => {
    if (typeof body.submissionId !== "string" || !body.submissionId) return fail("Informe a evidência do case.", 422);
    if (!body.customization || typeof body.customization !== "object" || Array.isArray(body.customization)) return fail("Os campos do case são inválidos.", 422);

    const raw = body.customization as Record<string, unknown>;
    const customization: Record<string, string> = {};
    for (const [field, max] of Object.entries(limits)) {
      const value = raw[field];
      if (typeof value !== "string" || value.length > max) {
        return fail("Revise os campos do case.", 422, { [field]: `Use até ${max} caracteres.` });
      }
      customization[field] = value.trim();
    }

    try {
      await savePortfolioCaseDraft(user.id, body.submissionId, customization);
      return ok({ saved: true });
    } catch {
      return fail("Não foi possível salvar seu case. Aplique a migração do editor de portfólio.", 500);
    }
  });
}
