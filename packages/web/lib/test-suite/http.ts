import { fail, ok } from "@/lib/product/api";
import { TestSuiteError } from "./store";

export async function runTestSuite<T>(operation: () => Promise<T>, successStatus = 200) {
  try {
    return ok(await operation(), successStatus);
  } catch (error) {
    if (error instanceof TestSuiteError) return fail(error.message, error.status, { code: error.code });
    throw error;
  }
}
