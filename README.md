# SentinelQA

SentinelQA is a quality-engineering workspace for defining small, observable test scenarios and keeping the evidence from every run. The product combines a public explanation layer with an authenticated workspace where users can create scenarios, execute deterministic checks against the order domain, inspect pass/fail findings, and review run history.

## What works today

The `/workspace` route is a real authenticated application. A user can create a scenario with a name, description, method, path, expected status, and assertion. The server validates the input, persists the scenario and step, executes the deterministic domain evaluator, saves a run and its findings, and returns the result to the UI. Users can select a scenario, run it again, inspect expected versus observed behavior, and review the last 30 runs.

The `/` route remains the public introduction and `/case-study` explains the architecture. The public navigation now leads into the working workspace rather than stopping at static evidence.

## Architecture

The frontend is React 19 with Wouter routing and tRPC client procedures. The backend is Express with tRPC procedures and Drizzle ORM. Persistent data is stored in MySQL-compatible tables for users, scenarios, steps, runs, and findings. Authentication is required for workspace data; the public landing and case-study routes remain accessible without a session.

The deterministic evaluator is isolated in `server/qualityRunner.ts` and covered by unit tests. It recognizes the order-domain boundary cases represented in the UI, including cancellation after dispatch, quantity limits, role permissions, and request tracing. This keeps the product useful without requiring network credentials or an external provider.

## Development commands

```bash
pnpm install
pnpm db:push
pnpm dev
```

Open the local URL printed by the terminal. Before publishing, run:

```bash
pnpm check
pnpm test
pnpm build
```

## Database setup

The schema is defined in `drizzle/schema.ts`. The first migration is in `drizzle/0000_majestic_nightshade.sql` and has been applied to the project database. Future schema changes should be generated with the Drizzle command and applied through the project database migration workflow.

## Product limitations

The current runner models a focused order domain rather than making arbitrary HTTP requests to third-party systems. That is intentional for safety and reproducibility. The next expansion should add editable multi-step scenarios, imported OpenAPI definitions, scheduled runs, and report export after the core user flow has been observed with real users.
