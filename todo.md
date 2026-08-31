# SentinelQA Working Product TODO

- [x] Audit the existing routes, components, and static metrics.
- [x] Upgrade the project to full-stack persistence and user workspaces.
- [x] Define database models for scenarios, steps, runs, assertions, and findings.
- [x] Implement real deterministic test execution against the SentinelQA order domain.
- [x] Add scenario creation, editing, deletion, and execution controls.
- [x] Add saved run history with pass/fail/blocked states and failure details.
- [x] Add structured suggestion validation without exposing provider branding.
- [x] Connect dashboard metrics and case-study evidence to live data.
- [x] Add loading, empty, error, success, and unauthenticated states.
- [x] Verify responsive UX, automated tests, and production build.
- [x] Save a publishable checkpoint and explain remaining deployment steps.
- [x] Add a first-class assertion model for reusable assertion definitions.
- [x] Replace keyword heuristics with real execution against the order-domain implementation.
- [x] Implement true blocked run and blocked-step handling in the backend and UI.
- [x] Complete loading, error, and success feedback for all workspace queries and mutations.
- [x] Add assertion catalog queries and selection so definitions can be reused across scenarios.
- [x] Add explicit run-history loading feedback.
- [x] Add visible scenario deletion with confirmation and success/error feedback.
- [x] Exercise authenticated create, run, delete, and refresh persistence flows.

## GitHub Publishing

- [ ] Inspect the available GitHub connection and current repository state.
- [ ] Confirm the target repository name and visibility before pushing.
- [ ] Prepare a clean commit containing the verified project.
- [ ] Push the project to GitHub after user confirmation.
- [ ] Verify the remote repository and share its URL.

## Manual ZIP Delivery

- [x] Run type checking, automated tests, and the production build on the current source.
- [x] Create a portable source ZIP without dependencies, build output, secrets, or internal metadata.
- [x] Verify the ZIP contains the full application source, database schema, migrations, and run instructions.
- [x] Deliver the ZIP with local run and manual GitHub upload steps.
