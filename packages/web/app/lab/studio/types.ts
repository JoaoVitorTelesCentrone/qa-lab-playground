export type StudioProject = { id: string; project_id: string; objective: string; status: string; updated_at: string; project: { title: string; description: string; color: string } };
export type Requirement = { id: string; title: string; description: string; acceptance_criteria: string; business_rules: string; open_questions: string; status: string; updated_at: string };
export type Risk = { id: string; requirement_id: string | null; title: string; category: string; probability: number; impact: number; score: number; mitigation: string; status: string };
export type TestCase = { id: string; title: string; objective: string; preconditions: string; test_data: string; expected_result: string; case_type: string; priority: string; layer: string; status: string; updated_at: string };
export type TestStep = { id: string; test_case_id: string; position: number; action: string; expected_result: string };
export type CoverageLink = { id: string; requirement_id: string | null; risk_id: string | null; test_case_id: string };
export type TestPlan = { objective: string; scope: string; out_of_scope: string; strategy: string; environments: string; tools: string; entry_criteria: string; exit_criteria: string; dependencies: string; responsibilities: string; schedule: string };
