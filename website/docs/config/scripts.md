---
sidebar_position: 2
title: Scripts
description: Every npm script in the project, what it does, and when to run it.
---

# Scripts

Every script lives in `package.json` and is callable as `npm run <name>`. The table below is the complete reference.

| Command | What it does | When to run |
| ------- | ------------ | ----------- |
| `npm run dev` | Starts the Next.js dev server with HMR on port 3000. | Daily development. |
| `npm run build` | Production build (`next build`). Compiles the app to `.next/`. | CI; deploy. |
| `npm start` | Starts the production server (after `build`). | Self-hosting. |
| `npm run lint` | ESLint on the whole codebase. | Before pushing. |
| `npm test` | Vitest unit suites (one-shot). | CI; pre-commit. |
| `npm run test:watch` | Vitest in watch mode. | While iterating on tests. |
| `npm run test:coverage` | Vitest with V8 coverage. Outputs `coverage/`. | Before a release. |
| `npm run test:e2e` | Playwright E2E suite. Requires `npm run dev` running. | Before a release. |
| `npm run typecheck` | `tsc --noEmit`. | CI; before pushing. |
| `npm run db:generate` | Generates the Prisma client into `src/generated/prisma`. | After cloning, after schema change. |
| `npm run db:push` | Pushes the schema to the database without creating a migration. | Quick local iteration. |
| `npm run db:migrate` | Creates and runs a migration. | When schema changes are merged. |
| `npm run db:seed` | Seeds demo users, listings, conversations. | Fresh staging environment. |
| `npm run db:studio` | Opens Prisma Studio at `http://localhost:5555`. | Inspecting data. |

## Recommended local loop

```bash
npm run dev          # terminal 1
npm run test:watch   # terminal 2 — keep tests green
npm run typecheck    # ad-hoc before pushing
```

## Recommended CI pipeline

```yaml
# .github/workflows/ci.yml (sketch)
- run: npm ci
- run: npm run lint
- run: npm run typecheck
- run: npm test
- run: npm run build
```

E2E (Playwright) is best run as a separate workflow on a staging deploy to avoid flaky CI on slow runners.
