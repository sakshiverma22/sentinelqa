import { COOKIE_NAME } from "@shared/const";
import { and, count, desc, eq, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { testAssertions, testFindings, testRuns, testScenarios, testSteps } from "../drizzle/schema";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { evaluateStep } from "./qualityRunner";
import { validateDraft } from "./qualityValidation";

const stepInput = z.object({
  name: z.string().min(2).max(160),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  path: z.string().min(1).max(255),
  expectedStatus: z.number().int().min(100).max(599),
  requestBody: z.string().max(4000).optional(),
  assertion: z.string().min(3).max(1000),
});

const scenarioInput = z.object({
  name: z.string().min(2).max(160),
  description: z.string().min(3).max(4000),
  assertionId: z.number().int().positive().optional(),
  steps: z.array(stepInput).min(1).max(30),
});

function requireDatabase() {
  return getDb().then((db) => {
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database is not available." });
    return db;
  });
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  workspace: router({
    publicOverview: publicProcedure.query(async () => {
      const db = await requireDatabase();
      const [scenarioCount, runCount, findingCount] = await Promise.all([
        db.select({ value: count() }).from(testScenarios),
        db.select({ value: count() }).from(testRuns),
        db.select({ value: count() }).from(testFindings),
      ]);
      return { scenarios: Number(scenarioCount[0]?.value ?? 0), runs: Number(runCount[0]?.value ?? 0), findings: Number(findingCount[0]?.value ?? 0) };
    }),
    validateDraft: protectedProcedure.input(stepInput).mutation(({ input }) => validateDraft(input)),
    listAssertions: protectedProcedure.query(async ({ ctx }) => {
      const db = await requireDatabase();
      return db.select().from(testAssertions).where(eq(testAssertions.ownerId, ctx.user.id)).orderBy(desc(testAssertions.createdAt));
    }),
    listScenarios: protectedProcedure.query(async ({ ctx }) => {
      const db = await requireDatabase();
      const scenarios = await db.select().from(testScenarios).where(eq(testScenarios.ownerId, ctx.user.id)).orderBy(desc(testScenarios.updatedAt));
      const allSteps = await db.select().from(testSteps);
      return scenarios.map((scenario) => ({ ...scenario, steps: allSteps.filter((step) => step.scenarioId === scenario.id).sort((a, b) => a.position - b.position) }));
    }),
    createScenario: protectedProcedure.input(scenarioInput).mutation(async ({ ctx, input }) => {
      const db = await requireDatabase();
      const result = await db.insert(testScenarios).values({ ownerId: ctx.user.id, name: input.name, description: input.description });
      const scenarioId = Number(result[0].insertId);
      for (let position = 0; position < input.steps.length; position += 1) {
        const step = input.steps[position]!;
        let assertionId = input.assertionId;
        if (assertionId) {
          const existing = await db.select({ id: testAssertions.id }).from(testAssertions).where(and(eq(testAssertions.id, assertionId), eq(testAssertions.ownerId, ctx.user.id))).limit(1);
          if (!existing[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Assertion definition not found." });
        } else {
          const assertionInsert = await db.insert(testAssertions).values({ ownerId: ctx.user.id, name: `${step.name} assertion`, expression: step.assertion });
          assertionId = Number(assertionInsert[0].insertId);
        }
        await db.insert(testSteps).values({ ...step, scenarioId, assertionId, position, requestBody: step.requestBody ?? null });
      }
      return { id: scenarioId };
    }),
    updateScenario: protectedProcedure.input(scenarioInput.extend({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const db = await requireDatabase();
      const scenario = await db.select().from(testScenarios).where(and(eq(testScenarios.id, input.id), eq(testScenarios.ownerId, ctx.user.id))).limit(1);
      if (!scenario[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Scenario not found." });
      await db.update(testScenarios).set({ name: input.name, description: input.description }).where(eq(testScenarios.id, input.id));
      const existingSteps = await db.select().from(testSteps).where(eq(testSteps.scenarioId, input.id)).orderBy(testSteps.position);
      const firstStep = input.steps[0]!;
      if (existingSteps[0]) {
        await db.update(testSteps).set({ ...firstStep, assertionId: input.assertionId ?? existingSteps[0].assertionId ?? null, requestBody: firstStep.requestBody ?? null }).where(eq(testSteps.id, existingSteps[0].id));
      }
      return { success: true } as const;
    }),
    deleteScenario: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const db = await requireDatabase();
      const scenario = await db.select({ id: testScenarios.id }).from(testScenarios).where(and(eq(testScenarios.id, input.id), eq(testScenarios.ownerId, ctx.user.id))).limit(1);
      if (!scenario[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Scenario not found." });
      const runs = await db.select({ id: testRuns.id }).from(testRuns).where(eq(testRuns.scenarioId, input.id));
      if (runs.length > 0) {
        await db.delete(testFindings).where(inArray(testFindings.runId, runs.map((run) => run.id)));
        await db.delete(testRuns).where(eq(testRuns.scenarioId, input.id));
      }
      await db.delete(testSteps).where(eq(testSteps.scenarioId, input.id));
      await db.delete(testScenarios).where(eq(testScenarios.id, input.id));
      return { success: true } as const;
    }),
    runScenario: protectedProcedure.input(z.object({ scenarioId: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const db = await requireDatabase();
      const scenario = await db.select().from(testScenarios).where(and(eq(testScenarios.id, input.scenarioId), eq(testScenarios.ownerId, ctx.user.id))).limit(1);
      if (!scenario[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Scenario not found." });
      const steps = await db.select().from(testSteps).where(eq(testSteps.scenarioId, input.scenarioId)).orderBy(testSteps.position);
      const startedAt = new Date();
      const evaluations = steps.map(evaluateStep);
      const failedSteps = evaluations.filter((item) => !item.passed && !item.blocked).length;
      const blockedSteps = evaluations.filter((item) => item.blocked).length;
      const passedSteps = evaluations.filter((item) => item.passed).length;
      const finishedAt = new Date();
      const status = failedSteps > 0 ? "failed" as const : blockedSteps > 0 ? "blocked" as const : "passed" as const;
      const summary = status === "failed" ? `${failedSteps} of ${steps.length} checks need investigation.` : status === "blocked" ? `${blockedSteps} of ${steps.length} checks were blocked by unsupported routes.` : `${steps.length} of ${steps.length} checks passed.`;
      const runInsert = await db.insert(testRuns).values({ ownerId: ctx.user.id, scenarioId: input.scenarioId, status, startedAt, finishedAt, totalSteps: steps.length, passedSteps, failedSteps, blockedSteps, summary });
      const runId = Number(runInsert[0].insertId);
      await db.insert(testFindings).values(evaluations.map((evaluation, index) => ({ runId, stepId: steps[index]?.id ?? null, severity: evaluation.severity, title: evaluation.title, expected: evaluation.expected, actual: `HTTP ${evaluation.actualStatus} · ${evaluation.actual}`, recommendation: evaluation.recommendation })));
      return { runId, status, totalSteps: steps.length, passedSteps, failedSteps, blockedSteps, summary };
    }),
    listRuns: protectedProcedure.input(z.object({ scenarioId: z.number().int().positive().optional() }).optional()).query(async ({ ctx, input }) => {
      const db = await requireDatabase();
      const runs = input?.scenarioId ? await db.select().from(testRuns).where(and(eq(testRuns.ownerId, ctx.user.id), eq(testRuns.scenarioId, input.scenarioId))).orderBy(desc(testRuns.finishedAt)) : await db.select().from(testRuns).where(eq(testRuns.ownerId, ctx.user.id)).orderBy(desc(testRuns.finishedAt));
      return runs.slice(0, 30);
    }),
    getRun: protectedProcedure.input(z.object({ runId: z.number().int().positive() })).query(async ({ ctx, input }) => {
      const db = await requireDatabase();
      const run = await db.select().from(testRuns).where(and(eq(testRuns.id, input.runId), eq(testRuns.ownerId, ctx.user.id))).limit(1);
      if (!run[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Run not found." });
      const findings = await db.select().from(testFindings).where(eq(testFindings.runId, input.runId));
      return { ...run[0], findings };
    }),
  }),
});

export type AppRouter = typeof appRouter;
