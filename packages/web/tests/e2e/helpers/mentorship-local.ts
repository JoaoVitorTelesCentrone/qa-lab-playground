import { randomUUID } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { test as base, expect, type Page } from "@playwright/test";

export const localEnabled = process.env.MENTORSHIP_E2E_LOCAL === "true";
if (process.env.MENTORSHIP_E2E_REQUIRED === "true" && !localEnabled) throw new Error("The required mentorship suite needs its isolated local runner; tests cannot be skipped.");

type Actor = { id: string; email: string; password: string; username: string; client: SupabaseClient };
type Lab = {
  admin: SupabaseClient;
  actors: Record<"student" | "peer" | "mentor" | "otherMentor" | "operator", Actor>;
  cohortId: string;
  otherCohortId: string;
  enrollmentId: string;
};

export async function checked<T extends { data: unknown; error: { message: string } | null }>(operation: PromiseLike<T>): Promise<NonNullable<T["data"]>> {
  const result = await operation;
  if (result.error) throw new Error(result.error.message);
  return result.data as NonNullable<T["data"]>;
}

export async function signIn(page: Page, actor: Actor, next = "/mentoria/app") {
  await page.goto(`/login?next=${encodeURIComponent(next)}`);
  await page.getByLabel("E-mail", { exact: true }).fill(actor.email);
  await page.getByLabel("Senha", { exact: true }).fill(actor.password);
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page).not.toHaveURL(/\/login(?:\?|$)/);
}

export const test = base.extend<{ lab: Lab }>({
  lab: async ({}, provideLab) => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!localEnabled || !url || !anon || !service || !["127.0.0.1", "localhost"].includes(new URL(url).hostname)) {
      throw new Error("Mutating mentorship tests require loopback Supabase and the local test runner.");
    }
    const admin = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });
    const actors = {} as Lab["actors"];
    const cohortIds: string[] = [];
    try {
      for (const role of ["student", "peer", "mentor", "otherMentor", "operator"] as const) {
        const suffix = randomUUID().replaceAll("-", "");
        const email = `qa-${role}-${suffix}@example.test`;
        const password = `Qa!${suffix}9`;
        const created = await checked(admin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { full_name: `Teste ${role}` } }));
        if (!created.user) throw new Error("Test account was not created");
        const client = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
        actors[role] = { id: created.user.id, email, password, username: `qa-${suffix}`, client };
        await checked(client.auth.signInWithPassword({ email, password }));
        await checked(admin.from("profiles").update({ username: actors[role].username, portfolio_public: role === "student", full_name: `Teste ${role}` }).eq("id", created.user.id));
      }
      await checked(admin.from("mentorship_staff").insert([
        { user_id: actors.operator.id, role: "admin", active: true },
        { user_id: actors.mentor.id, role: "mentor", active: true },
        { user_id: actors.otherMentor.id, role: "mentor", active: true },
      ]));
      for (const name of ["Turma v2 de teste", "Outra turma privada"]) {
        const cohort = await checked(admin.from("mentorship_cohorts").insert({ code: `qa-${randomUUID()}`, name, starts_on: "2026-10-01", ends_on: "2030-01-01", capacity: 10, status: "enrollment", program_version: "v2" }).select("id").single());
        cohortIds.push(cohort.id);
      }
      await checked(admin.from("mentorship_cohort_staff").insert([
        { cohort_id: cohortIds[0], staff_user_id: actors.mentor.id, role: "lead" },
        { cohort_id: cohortIds[1], staff_user_id: actors.otherMentor.id, role: "lead" },
      ]));
      const enrollments = await checked(admin.from("mentorship_enrollments").insert([
        { cohort_id: cohortIds[0], user_id: actors.student.id, status: "active", level: "beginner" },
        { cohort_id: cohortIds[0], user_id: actors.peer.id, status: "active", level: "beginner" },
      ]).select("id,user_id"));
      const enrollment = enrollments.find((row) => row.user_id === actors.student.id);
      if (!enrollment) throw new Error("Test enrollment was not created");
      await provideLab({ admin, actors, cohortId: cohortIds[0], otherCohortId: cohortIds[1], enrollmentId: enrollment.id });
    } finally {
      // These IDs were created by this fixture on loopback; never scan/delete other users.
      if (cohortIds.length) {
        await checked(admin.from("mentorship_applications").delete().in("cohort_id", cohortIds));
        await checked(admin.from("mentorship_orders").delete().in("cohort_id", cohortIds));
        await checked(admin.from("mentorship_offers").delete().in("cohort_id", cohortIds));
        await checked(admin.from("mentorship_cohorts").delete().in("id", cohortIds));
      }
      for (const actor of Object.values(actors)) {
        const { data: folders } = await admin.storage.from("lab-evidence").list(actor.id);
        for (const folder of folders ?? []) {
          const { data: files } = await admin.storage.from("lab-evidence").list(`${actor.id}/${folder.name}`);
          if (files?.length) await checked(admin.storage.from("lab-evidence").remove(files.map((file) => `${actor.id}/${folder.name}/${file.name}`)));
        }
        await checked(admin.auth.admin.deleteUser(actor.id));
      }
    }
  },
});

export { expect };
