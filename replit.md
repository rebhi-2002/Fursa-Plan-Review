# Fursa (فُرصة) — Digital Employment Platform for Gaza

## Overview

Arabic/RTL-first job platform connecting talent in Gaza with employers. English secondary toggle. Three roles: Job Seeker, Employer, Admin. Admin-moderated job postings, CV upload, applications, search/filter, role dashboards. Brand color blue `#2563EB`, Cairo font.

## Architecture

- pnpm workspace monorepo, TypeScript 5.9, Node 24
- **Frontend** (`artifacts/fursa`): React + Vite, Wouter routing, TanStack Query, Zustand, shadcn/ui + Tailwind v4, Clerk for auth
- **Backend** (`artifacts/api-server`): Express 5, Clerk auth (proxy + middleware), Drizzle ORM
- **Database**: PostgreSQL via `lib/db` (users, jobs, applications, savedJobs with role/status/type enums)
- **API contract**: OpenAPI in `lib/api-spec`, generates Zod schemas (`lib/api-zod`) and React Query hooks (`lib/api-client-react`)
- **Object storage**: `lib/object-storage-web` for CV upload (signed URL flow)
- **Auth**: Clerk (`@clerk/express` server, `@clerk/react` client). On first login, server auto-bootstraps user row from Clerk identity.

## Routing

- Frontend artifact at `/`, API at `/api/*` (routed by global proxy via `artifact.toml`).
- Public: `/`, `/jobs`, `/jobs/:id`, `/sign-in`, `/sign-up`
- Onboarding: `/onboarding` (collects role + profile)
- Role-guarded: `/seeker/*`, `/employer/*`, `/admin/*`

## Key files

- `artifacts/fursa/src/App.tsx` — Clerk provider, router, role guards, layout
- `artifacts/fursa/src/lib/i18n.tsx` — Arabic/English translations + RTL store
- `artifacts/api-server/src/middlewares/auth.ts` — `requireAuth`, `loadCurrentUser`, `requireRole`
- `artifacts/api-server/src/routes/` — `publicJobs`, `me`, `seeker`, `employer`, `admin`, `platform`, `storage`
- `lib/db/src/schema/index.ts` — Drizzle tables and enums
- `scripts/src/seedFursa.ts` — seeds 3 seekers, 3 employers, 1 admin, 6 jobs, 3 applications

## Environment

- `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY` — Clerk credentials
- `DATABASE_URL` — Postgres connection
- `DEFAULT_OBJECT_STORAGE_BUCKET_ID`, `PRIVATE_OBJECT_DIR`, `PUBLIC_OBJECT_SEARCH_PATHS` — App Storage
- `SESSION_SECRET` — session signing
- Vite reads `CLERK_PUBLISHABLE_KEY` and exposes it as `import.meta.env.VITE_CLERK_PUBLISHABLE_KEY` via `define` in `artifacts/fursa/vite.config.ts`.

## Key Commands

- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/scripts run seed-fursa` — seed demo data
- `pnpm run typecheck` — full typecheck across all packages

## Notes

- Both build pipelines (`vite build`, custom esbuild for api-server) skip tsc, so latent typecheck warnings in route handlers (Express 5 `req.params` widened to `string | string[]`, missing returns) do not block deployment.
- Real-time notifications and email are deferred (not in scope).

See the `pnpm-workspace` skill for workspace structure and conventions.
