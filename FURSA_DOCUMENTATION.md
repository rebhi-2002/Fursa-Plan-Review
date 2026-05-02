# Fursa (فُرصة) — Complete Project Documentation

> Arabic/RTL-first digital employment platform for Gaza. Connecting talent with opportunity.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Monorepo Structure](#3-monorepo-structure)
4. [Environment Variables & Secrets](#4-environment-variables--secrets)
5. [Database Schema](#5-database-schema)
6. [API Reference](#6-api-reference)
7. [Frontend Architecture](#7-frontend-architecture)
8. [Authentication & Authorization](#8-authentication--authorization)
9. [Internationalization (i18n)](#9-internationalization-i18n)
10. [Roles & Permissions](#10-roles--permissions)
11. [Pages & Routes](#11-pages--routes)
12. [Components](#12-components)
13. [Running Locally](#13-running-locally)
14. [Deployment](#14-deployment)
15. [Slide Deck](#15-slide-deck)
16. [Known Limitations & Future Work](#16-known-limitations--future-work)

---

## 1. Project Overview

**Fursa** (Arabic: فُرصة, meaning "opportunity") is a bilingual (Arabic/English) digital employment platform built for Gaza. It supports three user roles — job seekers, employers, and admins — each with their own dashboard, profile, and set of CRUD capabilities.

### Goals

- Provide a centralized, trustworthy job board for Gaza
- Full RTL (right-to-left) support for Arabic-speaking users
- Instant AR ↔ EN language toggle without page reload
- Role-based access control enforced on both frontend and backend
- Production-grade auth via Clerk (Google sign-in, email/password)

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS v4 |
| Routing | Wouter |
| State / Data | TanStack Query v5 |
| UI Components | shadcn/ui (Radix UI primitives) |
| Icons | Lucide React |
| Authentication | Clerk (with Clerk React SDK) |
| Backend | Express.js + TypeScript |
| ORM | Drizzle ORM |
| Database | Supabase PostgreSQL |
| Monorepo | pnpm workspaces |
| API Codegen | OpenAPI + custom codegen (`@workspace/api-client-react`) |

---

## 3. Monorepo Structure

```
/workspace
├── artifacts/
│   ├── fursa/                    # React + Vite frontend
│   │   ├── src/
│   │   │   ├── App.tsx           # Root router — auth layout + all routes
│   │   │   ├── components/
│   │   │   │   ├── layout/
│   │   │   │   │   ├── AppLayout.tsx
│   │   │   │   │   ├── Header.tsx
│   │   │   │   │   ├── Footer.tsx
│   │   │   │   │   ├── RoleGuard.tsx
│   │   │   │   │   └── NotificationBell.tsx
│   │   │   │   └── ui/           # shadcn components
│   │   │   ├── pages/
│   │   │   │   ├── home.tsx
│   │   │   │   ├── jobs/         # Public job listings + detail
│   │   │   │   ├── seeker/       # dashboard, applications, saved, profile
│   │   │   │   ├── employer/     # dashboard, jobs, job-new, job-edit, profile
│   │   │   │   ├── admin/        # dashboard, jobs, users, profile
│   │   │   │   ├── auth/         # sign-in, sign-up (no header/footer)
│   │   │   │   ├── about.tsx
│   │   │   │   ├── privacy.tsx
│   │   │   │   ├── terms.tsx
│   │   │   │   ├── onboarding.tsx
│   │   │   │   └── not-found.tsx
│   │   │   └── lib/
│   │   │       ├── i18n.tsx      # AR + EN translation dictionaries
│   │   │       └── queryClient.ts
│   │   ├── vite.config.ts
│   │   └── package.json          # @workspace/fursa
│   │
│   ├── api-server/               # Express API server
│   │   ├── src/
│   │   │   ├── index.ts          # Server entry point
│   │   │   ├── db/
│   │   │   │   ├── schema.ts     # Drizzle schema
│   │   │   │   └── index.ts      # Drizzle client
│   │   │   ├── routes/           # Express route handlers
│   │   │   └── middleware/       # Auth middleware (Clerk verification)
│   │   └── package.json          # @workspace/api-server
│   │
│   └── fursa-slides/             # Presentation slide deck (React)
│       ├── src/
│       │   ├── pages/slides/     # 8 slide components
│       │   ├── data/slides-manifest.json
│       │   └── index.css         # CSS variables (palette, fonts)
│       └── public/               # Static assets for slides
│
├── lib/
│   ├── api-spec/                 # OpenAPI spec + codegen output
│   └── api-client-react/         # Generated React Query hooks
│
├── pnpm-workspace.yaml
├── package.json
└── FURSA_DOCUMENTATION.md        # This file
```

---

## 4. Environment Variables & Secrets

### Frontend (`artifacts/fursa/.env`)

| Variable | Description |
|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (starts with `pk_`) |
| `VITE_API_URL` | Base URL of the API server (e.g. `http://localhost:3001`) |
| `VITE_BASE_PATH` | App base path (usually `/`) |
| `PORT` | Vite dev server port (default: `3000`) |
| `VITE_CLERK_PROXY_URL` | (Production only) Clerk proxy URL for deployed environments |

### API Server (`artifacts/api-server/.env`)

| Variable | Description |
|---|---|
| `PORT` | API server port (default: `3001`, Replit: `8080`) |
| `DATABASE_URL` | PostgreSQL connection string (Supabase) |
| `CLERK_SECRET_KEY` | Clerk secret key (starts with `sk_`) |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key (same as frontend) |

> **Never commit `.env` files.** All secrets are managed via Replit Secrets.

---

## 5. Database Schema

All tables use Drizzle ORM with Supabase PostgreSQL. Schema file: `artifacts/api-server/src/db/schema.ts`.

### `users`

| Column | Type | Notes |
|---|---|---|
| `id` | `text` PRIMARY KEY | Clerk user ID (`user_xxx`) |
| `email` | `text` NOT NULL UNIQUE | |
| `name` | `text` | Display name |
| `role` | `text` | `seeker` \| `employer` \| `admin` |
| `phone` | `text` | |
| `location` | `text` | |
| `bio` | `text` | |
| `createdAt` | `timestamp` | |
| `updatedAt` | `timestamp` | |

### `jobs`

| Column | Type | Notes |
|---|---|---|
| `id` | `serial` PRIMARY KEY | |
| `title` | `text` NOT NULL | |
| `description` | `text` NOT NULL | |
| `location` | `text` | |
| `type` | `text` | `full-time` \| `part-time` \| `remote` \| `contract` |
| `salary` | `text` | Optional salary range text |
| `status` | `text` | `draft` \| `active` \| `closed` |
| `employerId` | `text` FK → `users.id` | |
| `createdAt` | `timestamp` | |
| `updatedAt` | `timestamp` | |

### `applications`

| Column | Type | Notes |
|---|---|---|
| `id` | `serial` PRIMARY KEY | |
| `jobId` | `integer` FK → `jobs.id` | |
| `seekerId` | `text` FK → `users.id` | |
| `coverLetter` | `text` | Optional |
| `status` | `text` | `pending` \| `reviewed` \| `accepted` \| `rejected` |
| `createdAt` | `timestamp` | |

### `savedJobs`

| Column | Type | Notes |
|---|---|---|
| `id` | `serial` PRIMARY KEY | |
| `jobId` | `integer` FK → `jobs.id` | |
| `seekerId` | `text` FK → `users.id` | |
| `createdAt` | `timestamp` | |

---

## 6. API Reference

Base URL (local): `http://localhost:3001`
Base URL (production): via Replit deploy proxy

All protected endpoints require a valid Clerk session token sent as `Authorization: Bearer <token>`.

### Auth / Me

| Method | Path | Description | Auth |
|---|---|---|---|
| `GET` | `/me` | Get current user profile | Required |
| `PATCH` | `/me` | Update current user profile | Required |
| `POST` | `/me/onboard` | Set user role (seeker/employer) | Required |

### Jobs (Public)

| Method | Path | Description | Auth |
|---|---|---|---|
| `GET` | `/jobs` | List active jobs (supports `?q=`, `?location=`, `?type=`) | Optional |
| `GET` | `/jobs/:id` | Get job detail | Optional |

### Jobs (Employer)

| Method | Path | Description | Auth |
|---|---|---|---|
| `GET` | `/employer/jobs` | List employer's own jobs | Required (employer) |
| `POST` | `/employer/jobs` | Create a new job listing | Required (employer) |
| `PATCH` | `/employer/jobs/:id` | Update a job listing | Required (employer) |
| `DELETE` | `/employer/jobs/:id` | Delete a job listing | Required (employer) |

### Applications

| Method | Path | Description | Auth |
|---|---|---|---|
| `GET` | `/applications` | Get seeker's applications | Required (seeker) |
| `POST` | `/applications` | Apply to a job | Required (seeker) |
| `DELETE` | `/applications/:id` | Withdraw application | Required (seeker) |
| `GET` | `/employer/applications/:jobId` | List applicants for a job | Required (employer) |
| `PATCH` | `/employer/applications/:id` | Update application status | Required (employer) |

### Saved Jobs

| Method | Path | Description | Auth |
|---|---|---|---|
| `GET` | `/saved-jobs` | Get seeker's saved jobs | Required (seeker) |
| `POST` | `/saved-jobs` | Save a job | Required (seeker) |
| `DELETE` | `/saved-jobs/:jobId` | Unsave a job | Required (seeker) |

### Admin

| Method | Path | Description | Auth |
|---|---|---|---|
| `GET` | `/admin/jobs` | List all jobs (any status) | Required (admin) |
| `PATCH` | `/admin/jobs/:id` | Moderate/update any job | Required (admin) |
| `DELETE` | `/admin/jobs/:id` | Delete any job | Required (admin) |
| `GET` | `/admin/users` | List all users | Required (admin) |
| `PATCH` | `/admin/users/:id` | Update any user | Required (admin) |
| `DELETE` | `/admin/users/:id` | Delete a user | Required (admin) |

---

## 7. Frontend Architecture

### Routing Strategy

The app uses **Wouter** for client-side routing. There are two distinct layout contexts:

1. **AuthLayout** — Used for `/sign-in` and `/sign-up`. No Header or Footer. Clean centered layout that shows only the Clerk auth component.

2. **AppLayout** — Used for every other route. Includes `<Header>` and `<Footer>`. All role-protected routes are wrapped in `<RoleGuard role="...">`.

```
App.tsx
├── /sign-in    → AuthLayout → <SignInPage>
├── /sign-up    → AuthLayout → <SignUpPage>
└── *           → AppLayout
    ├── /                   → <Home>
    ├── /jobs               → <JobsPage>
    ├── /jobs/:id           → <JobDetail>
    ├── /about              → <AboutPage>
    ├── /privacy            → <PrivacyPage>
    ├── /terms              → <TermsPage>
    ├── /onboarding         → <Onboarding> (signed-in only)
    ├── /seeker/*           → RoleGuard(role="seeker")
    ├── /employer/*         → RoleGuard(role="employer")
    └── /admin/*            → RoleGuard(role="admin")
```

### Data Fetching

All API calls use **TanStack Query v5** via generated React Query hooks from `@workspace/api-client-react`. The query client is configured with reasonable stale times and a global error handler.

### State Management

- **Server state**: TanStack Query
- **Language/locale**: Zustand store in `lib/i18n.tsx`
- **Auth state**: Clerk React SDK (`useUser`, `useClerk`, `useAuth`)

---

## 8. Authentication & Authorization

### Clerk Setup

Fursa uses [Clerk](https://clerk.com) for authentication:

- Social login: Google OAuth
- Email/password
- Session management via Clerk's JWT tokens
- The frontend reads `VITE_CLERK_PUBLISHABLE_KEY`
- The API server verifies tokens using `CLERK_SECRET_KEY`

### Auth Flow

1. User visits `/sign-in` or `/sign-up` (rendered without Header/Footer in `AuthLayout`)
2. Clerk handles the auth flow (Google OAuth or email/password)
3. On success, Clerk creates a session and the user is redirected
4. If no DB record exists for this Clerk user, they are sent to `/onboarding` to choose their role
5. After onboarding, a user record is created in PostgreSQL with the chosen role

### Role Guard

`RoleGuard` (`src/components/layout/RoleGuard.tsx`) wraps protected pages. It:
- Checks if the user is signed in (via `useUser`)
- Fetches the user's DB record (`/me`)
- Checks the `role` field matches the required role
- Redirects to home if not authorized

---

## 9. Internationalization (i18n)

### How It Works

The i18n system is a custom, lightweight implementation in `lib/i18n.tsx`:

- A Zustand store holds the current language: `"ar"` (Arabic) or `"en"` (English)
- `useT()` hook returns a translation function `t(key)` that looks up the current language dictionary
- Language is persisted to `localStorage` as `"fursa_lang"`
- The HTML `dir` attribute and `lang` attribute are updated reactively on language change

### Usage

```tsx
import { useT } from "@/lib/i18n";

function MyComponent() {
  const t = useT();
  return <h1>{t("app.name")}</h1>;
}
```

### Translation Keys (Selected)

| Key | Arabic | English |
|---|---|---|
| `app.name` | فُرصة | Fursa |
| `app.description` | منصة التوظيف الرقمية في غزة | Gaza's Digital Employment Platform |
| `nav.home` | الرئيسية | Home |
| `nav.jobs` | الوظائف | Jobs |
| `auth.signIn` | تسجيل الدخول | Sign In |
| `auth.signUp` | إنشاء حساب | Sign Up |
| `dashboard.seeker.profile` | ملفي الشخصي | My Profile |
| `dashboard.employer.profile` | ملف الشركة | Company Profile |
| `footer.about` | عن فُرصة | About Fursa |
| `footer.privacy` | سياسة الخصوصية | Privacy Policy |
| `footer.terms` | الشروط والأحكام | Terms of Service |

---

## 10. Roles & Permissions

| Action | Guest | Seeker | Employer | Admin |
|---|---|---|---|---|
| Browse jobs | ✓ | ✓ | ✓ | ✓ |
| View job detail | ✓ | ✓ | ✓ | ✓ |
| Apply to a job | — | ✓ | — | — |
| Save a job | — | ✓ | — | — |
| View my applications | — | ✓ | — | — |
| Post a job | — | — | ✓ | — |
| Edit/delete own jobs | — | — | ✓ | — |
| View job applicants | — | — | ✓ | — |
| Update applicant status | — | — | ✓ | — |
| Moderate any job | — | — | — | ✓ |
| Manage all users | — | — | — | ✓ |
| Delete any content | — | — | — | ✓ |

---

## 11. Pages & Routes

### Public Pages

| Path | Component | Description |
|---|---|---|
| `/` | `pages/home.tsx` | Hero + job search + featured listings |
| `/jobs` | `pages/jobs/index.tsx` | Job listing with search + filters |
| `/jobs/:id` | `pages/jobs/detail.tsx` | Job detail with apply button |
| `/about` | `pages/about.tsx` | Platform mission, values, CTA |
| `/privacy` | `pages/privacy.tsx` | Privacy policy (AR + EN) |
| `/terms` | `pages/terms.tsx` | Terms of service (AR + EN) |

### Auth Pages (No Header/Footer)

| Path | Component | Description |
|---|---|---|
| `/sign-in` | `pages/auth/sign-in.tsx` | Clerk sign-in UI (split panel layout) |
| `/sign-up` | `pages/auth/sign-up.tsx` | Clerk sign-up UI (split panel layout) |

### Protected: Seeker

| Path | Component | Description |
|---|---|---|
| `/seeker` | `pages/seeker/dashboard.tsx` | Seeker dashboard |
| `/seeker/applications` | `pages/seeker/applications.tsx` | My applications list |
| `/seeker/saved` | `pages/seeker/saved.tsx` | Saved jobs list |
| `/seeker/profile` | `pages/seeker/profile.tsx` | Edit seeker profile |

### Protected: Employer

| Path | Component | Description |
|---|---|---|
| `/employer` | `pages/employer/dashboard.tsx` | Employer dashboard |
| `/employer/jobs` | `pages/employer/jobs.tsx` | Manage job listings |
| `/employer/jobs/new` | `pages/employer/job-new.tsx` | Create a new job |
| `/employer/jobs/:id` | `pages/employer/job-edit.tsx` | Edit a job |
| `/employer/profile` | `pages/employer/profile.tsx` | Edit company profile |

### Protected: Admin

| Path | Component | Description |
|---|---|---|
| `/admin` | `pages/admin/dashboard.tsx` | Admin dashboard |
| `/admin/jobs` | `pages/admin/jobs.tsx` | Moderate all jobs |
| `/admin/users` | `pages/admin/users.tsx` | Manage all users |
| `/admin/profile` | `pages/admin/profile.tsx` | Edit admin profile |

---

## 12. Components

### Layout

| Component | Path | Description |
|---|---|---|
| `AppLayout` | `components/layout/AppLayout.tsx` | Wrapper with Header + Footer |
| `Header` | `components/layout/Header.tsx` | Nav, role-aware dropdown, language toggle, mobile sheet |
| `Footer` | `components/layout/Footer.tsx` | 3-column: brand, platform links, legal links |
| `RoleGuard` | `components/layout/RoleGuard.tsx` | Role-based route protection |
| `NotificationBell` | `components/layout/NotificationBell.tsx` | Notification icon in header |

### UI (shadcn/ui)

All shadcn components live in `src/components/ui/`. Standard components used throughout: `Button`, `Card`, `Badge`, `Input`, `Textarea`, `Select`, `Dialog`, `Sheet`, `Avatar`, `DropdownMenu`, `Tooltip`, `Sonner` (toasts), `Skeleton`.

---

## 13. Running Locally

### Prerequisites

- Node.js 20+
- pnpm 9+
- A Supabase project (or any PostgreSQL)
- A Clerk application

### Steps

```bash
# 1. Install dependencies
pnpm install

# 2. Set environment variables (see Section 4)
# Create artifacts/fursa/.env and artifacts/api-server/.env

# 3. Push database schema
cd artifacts/api-server
pnpm run db:push

# 4. Start the API server (port 3001)
pnpm --filter @workspace/api-server run dev

# 5. Start the frontend (port 3000)
pnpm --filter @workspace/fursa run dev

# 6. (Optional) Start the slides deck
pnpm --filter @workspace/fursa-slides run dev
```

### On Replit

Start both workflows from the Replit UI:
- `artifacts/fursa: web` — starts the frontend
- `artifacts/api-server: API Server` — starts the backend

---

## 14. Deployment

The app is deployed via Replit's deployment system. Each artifact maps to a unique path:

| Artifact | Preview Path |
|---|---|
| Fursa frontend | `/` |
| API Server | Internal (not public-facing) |
| Fursa Slides | `/fursa-slides/` |

### Important Production Notes

- `VITE_CLERK_PROXY_URL` must be set in production to route Clerk requests through the Replit domain
- `DATABASE_URL` should point to the production Supabase instance
- All secrets must be set as Replit Secrets (not `.env` files)
- API server uses `PORT=8080` in Replit production

---

## 15. Slide Deck

A professional 8-slide presentation deck is available at `/fursa-slides/`.

### Slides

| # | Title | Layout |
|---|---|---|
| 1 | فُرصة · Fursa | Title — hero image, deep blue, gold accents |
| 2 | The Challenge | Three problem cards on white |
| 3 | The Platform | Three role columns on deep blue |
| 4 | How It Works | Four numbered steps on white |
| 5 | Key Features | Two-column feature list on dark |
| 6 | Technology Stack | Split panel — blue left + tech tiles right |
| 7 | Impact | Quote slide on deep blue |
| 8 | Closing | Brand lockup with network hero image |

### Aesthetic Direction

- **Palette**: Deep blue (#1E3A8A) primary, amber/gold (#F59E0B) accent, near-white (#F8FAFC) background
- **Typography**: Playfair Display (display/headlines) + Plus Jakarta Sans (body)
- **Direction**: Bold Editorial meets Warm Storytelling — authoritative but human

### Exporting

To export as PPTX or PDF, use the export controls in the Replit slides preview pane.

---

## 16. Known Limitations & Future Work

### Current Limitations

- No email notification system (application status changes are not emailed)
- No CV/file upload (seekers describe experience in bio text)
- No real-time features (no websockets — applications list requires manual refresh)
- No payment/premium tier
- Admin approval workflow for new job listings is not yet implemented end-to-end

### Suggested Future Features

- Email notifications for application status changes (using Resend or similar)
- CV/resume file upload (using Supabase Storage)
- Real-time notifications via Server-Sent Events or WebSockets
- Job categories and advanced filtering (by category, salary range)
- Employer verification system
- Analytics dashboard for admins (applications over time, top jobs)
- Mobile app (Expo/React Native)

---

*Documentation last updated: May 2026*
*Platform: Fursa (فُرصة) — Gaza's Digital Employment Platform*
