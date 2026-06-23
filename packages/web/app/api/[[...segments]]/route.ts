import { apiLabOptions, handleApiLab } from "@/lib/api-lab/handler";

type Context = { params: Promise<{ segments?: string[] }> };
async function run(request: Request, context: Context) { return handleApiLab(request, request.method, await context.params); }
export const GET = run;
export const POST = run;
export const PUT = run;
export const DELETE = run;
export const OPTIONS = apiLabOptions;

