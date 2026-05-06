# Fursa (فُرصة) — Digital Employment Platform for Gaza

## Overview

Arabic/RTL-first job platform connecting talent in Gaza with employers. English secondary toggle. Three roles: Job Seeker, Employer, Admin. Admin-moderated job postings, CV upload, applications, search/filter, role dashboards. Brand color blue `#2563EB`, Cairo font.

## TypeScript Status

All four workspace libs **must be built** before running `tsc --noEmit` in any artifact:

```bash
npx tsc -b lib/db lib/api-client-react lib/object-storage-web lib/api-zod
```

After building: **backend exit 0, frontend exit 0** — zero TypeScript errors across the entire codebase.

## Architecture

- pnpm workspace monorepo, TypeScript 5.9, Node 24
- **Frontend** (`artifacts/fursa`): React + Vite, Wouter routing, TanStack Query, Zustand, shadcn/ui + Tailwind v4, Clerk for auth
- **Backend** (`artifacts/api-server`): Express 5, Clerk auth (proxy + middleware), Drizzle ORM
- **Database**: PostgreSQL via `lib/db` (users, jobs, applications, savedJobs with role/status/type enums)
- **API contract**: OpenAPI in `lib/api-spec`, generates Zod schemas (`lib/api-zod`) and React Query hooks (`lib/api-client-react`)
- **Object storage**: `lib/object-storage-web` for CV upload (signed URL flow)
- **Auth**: Clerk (`@clerk/express` server, `@clerk/react` client). On first login, server auto-bootstraps user row from Clerk identity.
- **Security**: Helmet (HTTP headers), express-rate-limit (generalLimiter 300/15min, writeLimiter 60/15min), Zod validation on all write endpoints, input sanitization middleware (XSS strip)
- **Logging**: pino + pino-http structured logging (strips query params from URLs)
- **Cron**: auto-close expired jobs runs on startup + every 60min

## Routing

- Frontend artifact at `/`, API at `/api/*` (routed by global proxy via `artifact.toml`).
- Auth pages (`/sign-in`, `/sign-up`) render in `AuthLayout` — **no Header/Footer**. All other routes use `AppLayout`.
- Public: `/`, `/jobs`, `/jobs/:id`, `/about`, `/privacy`, `/terms`, `/contact`, `/faq`, `/employers`, `/employers/:id`, `/sign-in`, `/sign-up`
- Notifications: `/notifications` (signed-in only, works for all roles)
- Onboarding: `/onboarding` (collects role + profile)
- Role-guarded: `/seeker/*`, `/employer/*`, `/admin/*`
- Profile pages: `/seeker/profile`, `/employer/profile`, `/admin/profile`
- **IMPORTANT**: `/employer/jobs/:id/applications` MUST come BEFORE `/employer/jobs/:id` in the Switch
- Slides deck artifact at `/fursa-slides/`

## Features Implemented (Improvement Plan — All Complete)

- **H1**: Onboarding check in `requireRole` middleware — blocks non-onboarded users from API
- **H2**: `DELETE /api/me` + delete account UI dialog in seeker + employer profiles
- **H3**: Clerk `openUserProfile()` security card in all three profile pages (seeker, employer, admin)
- **M1**: `GET /api/public/employers` + `/employers` list page with search
- **M2**: Hourly cron in `index.ts` auto-closes expired jobs
- **M3**: `PATCH /api/seeker/me/applications/:id` + inline cover letter edit UI
- **M4**: Client-side search filter in admin/users.tsx
- **M5**: Employer name included in job search `ilike` query
- **M6**: `contactInfo` shown in accepted application cards (seeker)
- **L1**: try/catch on seeker API routes with 500 responses
- **L2**: File type + size validation in storage.ts (PDF/DOC/DOCX/images, max 15MB)
- **L3**: `POST /api/contact` wired to contact form frontend
- **L4**: `express-rate-limit` — 300 req/15min general, 60 for writes; `trust proxy: 1` for X-Forwarded-For
- **L5**: `react-helmet-async` installed; dynamic `<title>`, `og:title`, `og:description` on job detail pages
- **Recommendation Engine**: Seeker dashboard scores jobs by category history (+3) + bio keyword match (+2), excludes already-applied jobs

## T004 Features (18-Item Enhancement Plan — Complete)

### DB Schema (T001)
- `rejectionNote` (text, nullable) added to `applicationsTable`
- `viewsCount` (integer, default 0) added to `jobsTable`
- New `messagesTable` (id, senderId, receiverId, body, createdAt, isRead)

### API Spec & Codegen (T002)
- `GET /jobs/:id/similar` → similar jobs list
- `GET /jobs/:id` auto-increments `viewsCount`
- `PATCH /employer/applications/:id` now accepts `rejectionNote`
- `GET/POST /me/messages/:userId` → messages CRUD
- `GET /public/seekers/:id` → public seeker profile
- `GET /admin/export/users` + `/admin/export/jobs` → CSV download
- New hooks: `useGetSimilarJobs`, `useGetPublicSeekerProfile`, `useListMessageThreads`, `useGetMessages`, `useSendMessage`

### Backend Routes (T003)
- `publicJobs.ts`: similar jobs + views increment
- `employer.ts`: rejection note in status update
- `messages.ts`: full CRUD (new file)
- `admin.ts`: CSV export for users and jobs

### Frontend (T004)
- **Share button** on job detail — Web Share API with clipboard fallback
- **Countdown timer** on job detail — days left / last day / deadline passed
- **Views count** display (Eye icon) on job detail
- **Similar jobs** section at bottom of job detail (2-col grid, top 4)
- **Rejection note** shown in seeker/applications when status = rejected
- **Saved jobs type filter** — pill chips (All / Online / Field / Hybrid) with counts
- **Messages pages** — `/messages` (thread list) + `/messages/:userId` (conversation, Enter to send)
- **Public seeker profile** — `/seekers/:id` page
- **Admin CSV export** buttons on dashboard (uses Clerk token for auth)
- **Dark mode toggle** — Moon/Sun in Header; `src/lib/theme.ts` Zustand store with localStorage + `initTheme()` in `main.tsx`
- **Word counters** on description + requirements textareas in `employer/job-new.tsx` and `employer/job-edit.tsx`
- **CV preview button** in employer/applications (opens in new tab) + download button

### New Routes in App.tsx
- `/messages` → MessagesPage (signed-in, any role)
- `/messages/:userId` → MessageThread
- `/seekers/:id` → PublicSeekerProfile (public)

## Key files

- `artifacts/fursa/src/App.tsx` — Clerk provider, router, role guards, AuthLayout vs AppLayout
- `artifacts/fursa/src/lib/i18n.tsx` — Arabic/English translations + RTL store (all keys for all pages)
- `artifacts/fursa/src/components/layout/Header.tsx` — role-aware nav (employer profile, admin profile links)
- `artifacts/fursa/src/components/layout/Footer.tsx` — 3-column footer with About/Privacy/Terms/FAQ/Contact links
- `artifacts/fursa/src/components/layout/NotificationBell.tsx` — bell popover with "View all" link to /notifications
- `artifacts/fursa/src/pages/about.tsx` — About page (bilingual)
- `artifacts/fursa/src/pages/privacy.tsx` — Privacy Policy page (bilingual)
- `artifacts/fursa/src/pages/terms.tsx` — Terms of Service page (bilingual)
- `artifacts/fursa/src/pages/contact.tsx` — Contact page with form + info card (bilingual)
- `artifacts/fursa/src/pages/faq.tsx` — FAQ page with accordion (8 Q&As, bilingual)
- `artifacts/fursa/src/pages/notifications.tsx` — Full notifications page (mark read, mark all, empty state)
- `artifacts/fursa/src/pages/employers.tsx` — Public employer profile (`/employers/:id`)
- `artifacts/fursa/src/pages/home.tsx` — Home page with live stats section + "How it Works" (3-step) section
- `artifacts/fursa/src/pages/employer/applications.tsx` — Full applications review page with filter tabs, accept/reject, CV download, cover letter accordion
- `artifacts/fursa/src/pages/employer/profile.tsx` — Employer company profile page
- `artifacts/fursa/src/pages/admin/profile.tsx` — Admin personal profile page
- `artifacts/api-server/src/routes/publicJobs.ts` — includes `GET /public/employers/:id` endpoint
- `artifacts/api-server/src/middlewares/auth.ts` — `requireAuth`, `loadCurrentUser`, `requireRole`
- `artifacts/api-server/src/routes/` — `publicJobs`, `me`, `seeker`, `employer`, `admin`, `platform`, `storage`
- `lib/api-client-react/src/generated/api.ts` — includes `useGetPublicEmployerProfile` hook
- `lib/api-client-react/src/generated/api.schemas.ts` — includes `PublicEmployerProfile`, `PublicEmployerJob` types
- `lib/db/src/schema/index.ts` — Drizzle tables and enums
- `artifacts/fursa-slides/src/pages/slides/` — 8 slide components (Slide1Title … Slide8Closing)
- `artifacts/fursa-slides/src/data/slides-manifest.json` — Slide deck manifest
- `FURSA_DOCUMENTATION.md` — Complete A-Z project documentation
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

## Local Windows Development Setup

To run locally:
1. Copy `artifacts/fursa/.env.example` → `artifacts/fursa/.env` and fill in your keys
2. Copy `artifacts/api-server/.env.example` → `artifacts/api-server/.env` and fill in your keys
3. `pnpm install` at workspace root
4. Terminal 1: `pnpm --filter @workspace/api-server dev` (runs on port 3001)
5. Terminal 2: `pnpm --filter @workspace/fursa dev` (runs on port 3000, visit http://localhost:3000)

## Environment / dotenv

- **Critical order**: `artifacts/api-server/src/env.ts` loads dotenv and is imported as the FIRST import in `src/index.ts`. This ensures DATABASE_URL is set before `lib/db` initializes its connection pool (ESM import hoisting issue fix).
- `artifacts/api-server/src/env.ts` loads `./env` (api-server dir) with `override: true`, then `../../.env` (workspace root) with `override: false`. The system PORT is preserved.
- `lib/db/drizzle.config.ts` loads `../../.env` (workspace root) with `override: true` before checking DATABASE_URL.
- **Vite BASE_PATH**: `vite.config.ts` reads `BASE_PATH` first, then falls back to `VITE_BASE_PATH`, then defaults to `/`. So both `BASE_PATH=/` and `VITE_BASE_PATH=/` work in the frontend `.env`.
- **Vite proxy**: `artifacts/fursa/vite.config.ts` proxies `/api` to `VITE_API_URL` (default `http://localhost:3001`) for local development.
- **Replit-only plugins**: `runtimeErrorOverlay`, `cartographer`, `devBanner` only load when `REPL_ID` env var is set (i.e., only on Replit).

## Clerk Configuration

- **Frontend**: `artifacts/fursa/src/App.tsx` uses `import.meta.env.VITE_CLERK_PUBLISHABLE_KEY` directly (NOT `publishableKeyFromHost`). Using `publishableKeyFromHost` on localhost causes Clerk to try loading from `clerk.localhost` which fails.
- **Proxy**: `proxyUrl` is only passed to `ClerkProvider` in production (`import.meta.env.PROD`) when `VITE_CLERK_PROXY_URL` is set.
- **Backend**: `artifacts/api-server/src/app.ts` uses `clerkMiddleware({ publishableKey, secretKey })` directly. The Clerk frontend API proxy (`/api/__clerk`) is only mounted in production.

## Onboarding Flow (Fixed Logic)

1. Sign-up page: user picks role (seeker/employer) → stored in `sessionStorage("fursa_pending_role")` → Clerk form shows
2. After Clerk form, user lands on `/onboarding`
3. `GET /api/me` creates new user with `role: "seeker"` (default), `onboarded: false`
4. `useEffect` in onboarding: checks `sessionStorage` FIRST for pending role, calls `POST /api/me/role` to set correct role (employer/seeker)
5. After role set → profile form shows
6. On profile submit → `PATCH /api/me` auto-sets `onboarded: true` (backend auto-completes onboarding when a user with a role updates their profile)
7. Redirect to `/{role}` dashboard

## Recent Changes (May 2026)

- **Bug fix**: Employer profile — `-mt-12` moved to avatar div only (website URL no longer pushes layout on large screens)
- **Bug fix**: Seeker dashboard — removed duplicate `px-4` padding that caused horizontal scroll
- **i18n**: Duplicate key `employer.applications.message` removed; added `dashboard.seeker.alerts` + `dashboard.seeker.cvBuilder` keys
- **Routes**: `/seeker/alerts` and `/seeker/cv-builder` added to App.tsx + Header.tsx nav links
- **Email Alerts**: When admin approves a job, matching seekers receive in-app notification + bilingual HTML email via Resend (JOIN with usersTable to get emails)
- **Phase 4 SEO**: Job detail pages now include `og:url`, canonical link, and JSON-LD `JobPosting` structured data; home page has full OG/meta tags
- **Sitemap**: `GET /api/sitemap.xml` returns dynamic XML sitemap with all approved jobs + static pages (cache 1h)

## Notes

- Both build pipelines (`vite build`, custom esbuild for api-server) skip tsc, so latent typecheck warnings in route handlers (Express 5 `req.params` widened to `string | string[]`, missing returns) do not block deployment.
- Seeker profile page (`artifacts/fursa/src/pages/seeker/profile.tsx`) uses `useUser()` from Clerk to show avatar, email, member-since date at the top.
- Sign-in page has a branded left panel (hidden on mobile) with platform tagline and feature list.
- Sign-up page is a full role-picker UI (no Clerk form until role is chosen).
- Sitemap is served at `/api/sitemap.xml` — point Google Search Console to this URL.

See the `pnpm-workspace` skill for workspace structure and conventions.
