import { AlertTriangle, Database } from "lucide-react";
import { getSessionUser } from "@/lib/product/store";
import { getPersonalTestSuite, TestSuiteError } from "@/lib/test-suite/store";
import { TestSuiteClient } from "./test-suite-client";
import { demoTestSuite } from "@/lib/test-suite/demo";

export const metadata = {
  title: "Test Suite | QA Lab",
  description: "Workspace pessoal para organizar pastas e arquivos de automação de testes.",
  robots: { index: false, follow: false },
};

export default async function TestSuitePage() {
  const user = await getSessionUser();
  if (!user) return <TestSuiteClient initialSnapshot={demoTestSuite} />;

  let snapshot;
  try {
    snapshot = await getPersonalTestSuite();
  } catch (error) {
    if (!(error instanceof TestSuiteError) || error.code !== "TEST_SUITE_UNAVAILABLE") throw error;
    return <main className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
      <section className="rounded-2xl border border-amber-400/30 bg-amber-400/[.04] p-7">
        <AlertTriangle className="size-6 text-amber-400" />
        <h1 className="mt-4 text-2xl font-black text-off-white">A Test Suite precisa da migration 0022</h1>
        <p className="mt-3 text-sm leading-7 text-[#AAB2BC]">A interface já está instalada, mas as tabelas privadas ainda não existem neste banco. Aplique a migration para criar uma suíte exclusiva por usuário.</p>
        <p className="mt-5 flex items-center gap-2 rounded-lg border border-white/10 bg-[#101319] p-3 font-mono text-xs text-mint"><Database className="size-4" />0022_personal_test_suite.sql</p>
      </section>
    </main>;
  }

  return <TestSuiteClient initialSnapshot={snapshot} />;
}
