import { fail, ok } from "@/lib/product/api";
import { BoardError } from "./store";

export async function runBoard<T>(action: () => Promise<T>, successStatus = 200) {
  try {
    return ok(await action(), successStatus);
  } catch (error) {
    if (error instanceof BoardError) return fail(error.message, error.status, { code: error.code });
    throw error;
  }
}

