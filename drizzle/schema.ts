import { index, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const testAssertions = mysqlTable("test_assertions", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull().references(() => users.id),
  name: varchar("name", { length: 160 }).notNull(),
  expression: text("expression").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  ownerIdx: index("test_assertions_owner_idx").on(table.ownerId),
}));

export const testScenarios = mysqlTable("test_scenarios", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull().references(() => users.id),
  name: varchar("name", { length: 160 }).notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  ownerIdx: index("test_scenarios_owner_idx").on(table.ownerId),
}));

export const testSteps = mysqlTable("test_steps", {
  id: int("id").autoincrement().primaryKey(),
  scenarioId: int("scenarioId").notNull().references(() => testScenarios.id),
  assertionId: int("assertionId").references(() => testAssertions.id),
  position: int("position").notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  method: mysqlEnum("method", ["GET", "POST", "PUT", "PATCH", "DELETE"]).default("POST").notNull(),
  path: varchar("path", { length: 255 }).notNull(),
  expectedStatus: int("expectedStatus").notNull(),
  requestBody: text("requestBody"),
  assertion: text("assertion").notNull(),
}, (table) => ({
  scenarioIdx: index("test_steps_scenario_idx").on(table.scenarioId),
  assertionIdx: index("test_steps_assertion_idx").on(table.assertionId),
}));

export const testRuns = mysqlTable("test_runs", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull().references(() => users.id),
  scenarioId: int("scenarioId").notNull().references(() => testScenarios.id),
  status: mysqlEnum("status", ["passed", "failed", "blocked"]).notNull(),
  startedAt: timestamp("startedAt").notNull(),
  finishedAt: timestamp("finishedAt").notNull(),
  totalSteps: int("totalSteps").notNull().default(0),
  passedSteps: int("passedSteps").notNull().default(0),
  failedSteps: int("failedSteps").notNull().default(0),
  blockedSteps: int("blockedSteps").notNull().default(0),
  summary: text("summary").notNull(),
}, (table) => ({
  ownerIdx: index("test_runs_owner_idx").on(table.ownerId),
  scenarioIdx: index("test_runs_scenario_idx").on(table.scenarioId),
}));

export const testFindings = mysqlTable("test_findings", {
  id: int("id").autoincrement().primaryKey(),
  runId: int("runId").notNull().references(() => testRuns.id),
  stepId: int("stepId").references(() => testSteps.id),
  severity: mysqlEnum("severity", ["info", "warning", "critical"]).notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  expected: text("expected").notNull(),
  actual: text("actual").notNull(),
  recommendation: text("recommendation").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  runIdx: index("test_findings_run_idx").on(table.runId),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type TestAssertion = typeof testAssertions.$inferSelect;
export type TestScenario = typeof testScenarios.$inferSelect;
export type InsertTestScenario = typeof testScenarios.$inferInsert;
export type TestStep = typeof testSteps.$inferSelect;
export type InsertTestStep = typeof testSteps.$inferInsert;
export type TestRun = typeof testRuns.$inferSelect;
export type TestFinding = typeof testFindings.$inferSelect;
