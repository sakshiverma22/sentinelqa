# Run SentinelQA Locally

## Requirements

Install Node.js 20 or newer, pnpm 10, and a MySQL-compatible database. The application uses a server process, a React frontend, authenticated user workspaces, and persistent scenario/run data.

## Install dependencies

From the project root:

```bash
corepack enable
corepack prepare pnpm@10.4.1 --activate
pnpm install
```

## Environment variables

Create a `.env` file in the project root. Do not commit it. Configure the database connection and the authentication values supplied by your deployment environment:

```env
DATABASE_URL=mysql://USER:PASSWORD@HOST:3306/DATABASE
JWT_SECRET=replace-with-a-long-random-secret
VITE_APP_ID=your-application-id
OAUTH_SERVER_URL=https://your-oauth-server.example
VITE_OAUTH_PORTAL_URL=https://your-oauth-portal.example
```

The public landing page can be built without a database, but the authenticated workspace requires a working database and authentication configuration.

## Database setup

Generate and apply the Drizzle migrations using the project’s migration workflow. The SQL files are included under `drizzle/` and should be applied in filename order:

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

The schema includes users, scenarios, executable steps, reusable assertions, runs, and findings.

## Start the application

```bash
pnpm dev
```

Open the local URL printed in the terminal, normally `http://localhost:3000/`. The public site is available at `/`, the authenticated workspace at `/workspace`, and the case study at `/case-study`.

## Validate before sharing

```bash
pnpm check
pnpm test
pnpm build
```

The current validation suite covers authentication, deterministic order-domain execution, blocked routes, and draft validation. Keep `.env`, database credentials, and generated build output out of version control.
