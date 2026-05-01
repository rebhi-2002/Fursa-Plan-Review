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

## Internationalization

- `lib/i18n.tsx` exports `useT`, `useLanguageStore`, `LangProvider`. The `t(key, vars?, default?)` signature supports `{var}` interpolation.
- ~290 dictionary keys cover every page (home, jobs list/detail, seeker/employer/admin dashboards & sub-pages, onboarding, header/footer, status/role labels, validation messages).
- All user-facing pages render via `t()`; no hard-coded Arabic strings remain in pages or components.
- `App.tsx` wraps Clerk in a `ClerkAndRouter` component subscribed to the language store, so `localization` (sign-in/sign-up titles) updates when the user toggles language.
- `LangProvider` mutates `<html lang dir>` reactively — index.html only seeds the initial Arabic+RTL state.
- Toaster (sonner) does not hard-code `dir="rtl"`; it inherits from the document.

## UI Conventions

- Radix `<SelectItem>` cannot have `value=""`. Filter pages use a sentinel `const ALL = "all"` and translate to `undefined` in the API call.
- All icons use both `mr-2 ms-2` so spacing works in LTR and RTL.
- ChevronLeft + similar directional icons get `rtl:rotate-180`.
- Logo: `public/logo.svg` and `public/favicon.svg` are blue brand SVGs; `clerkAppearance.logoImageUrl` points to `/logo.svg`.

## Auth / Signup Flow

- **Role selection BEFORE Clerk form**: `/sign-up` shows a role-picker card page first. Chosen role is stored in `sessionStorage` under key `fursa_pending_role`. After Clerk form is filled, user is sent to `/onboarding` where the role is auto-applied and the picker step is skipped.
- **Post-signup redirect**: `<SignUp forceRedirectUrl="/onboarding">` and `<SignIn forceRedirectUrl="/onboarding">` ensure all new logins go through onboarding check.
- **Post-onboarding redirect**: After role + profile are set, user is redirected to `/${role}` (e.g. `/seeker`, `/employer`), not `/`.
- **Login blur fix**: `ClerkQueryClientCacheInvalidator` in App.tsx — on sign-IN (null→userId) uses `setTimeout(() => qc.invalidateQueries(), 200)` to let JWT settle; on sign-out uses `qc.clear()`; on user-switch uses `qc.clear()`.

## Environment / dotenv

- `dotenv` installed at workspace root and in `api-server`, `lib/db`.
- `artifacts/api-server/src/app.ts` loads `../../.env` with `override: true` at startup.
- `lib/db/drizzle.config.ts` loads `../../.env` with `override: true` before checking DATABASE_URL.
- Create a root `.env` file locally (see `.env.example`) with DATABASE_URL pointing to Supabase pooler URL for Windows dev, or direct URL for Linux.

## Notes

- Both build pipelines (`vite build`, custom esbuild for api-server) skip tsc, so latent typecheck warnings in route handlers (Express 5 `req.params` widened to `string | string[]`, missing returns) do not block deployment.
- Real-time notifications and email are deferred (not in scope).
- Seeker profile page (`artifacts/fursa/src/pages/seeker/profile.tsx`) uses `useUser()` from Clerk to show avatar, email, member-since date at the top.
- Sign-in page has a branded left panel (hidden on mobile) with platform tagline and feature list.
- Sign-up page is a full role-picker UI (no Clerk form until role is chosen).

See the `pnpm-workspace` skill for workspace structure and conventions.
