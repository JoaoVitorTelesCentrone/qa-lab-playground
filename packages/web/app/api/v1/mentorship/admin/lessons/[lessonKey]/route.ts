import { MentorshipAccessError } from "@/lib/mentorship/access";
import { saveLessonContentAdmin } from "@/lib/mentorship/store";
import { fail, FieldReader, ok, readJson, ValidationError } from "@/lib/product/api";

export const dynamic = "force-dynamic";

export async function PUT(request: Request, context: { params: Promise<{ lessonKey: string }> }) {
  try {
    const { lessonKey } = await context.params;
    const body = await readJson(request);
    const reader = new FieldReader(body);
    const status = reader.oneOf("status", ["draft", "published", "scheduled"] as const);
    const videoUrl = typeof body.videoUrl === "string" ? body.videoUrl : undefined;
    const materialUrl = typeof body.materialUrl === "string" ? body.materialUrl : undefined;
    const availableAt = typeof body.availableAt === "string" ? body.availableAt : undefined;
    reader.done();
    return ok(await saveLessonContentAdmin(lessonKey, { status, videoUrl, materialUrl, availableAt }));
  } catch (error) {
    if (error instanceof ValidationError) return fail(error.message, 422, error.details);
    if (error instanceof MentorshipAccessError) return fail(error.message, error.status);
    return fail(error instanceof Error ? error.message : "Erro inesperado.", 500);
  }
}
