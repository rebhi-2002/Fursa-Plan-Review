٨# Fursa — Deployment Guide

## Project Structure Overview

The project is a pnpm monorepo. The main folders you need to deploy are:

```
/
├── artifacts/
│   ├── fursa/          ← React frontend (Vite)
│   └── api-server/     ← Express backend (Node.js)
├── lib/
│   ├── db/             ← Drizzle ORM schema + migrations
│   ├── api-client-react/  ← Generated TanStack Query client
│   ├── api-zod/        ← Generated Zod validators
│   └── api-spec/       ← OpenAPI YAML spec + codegen config
└── pnpm-workspace.yaml
```

**Do NOT upload these folders — they are auto-generated or dev-only:**
```
node_modules/          (all of them — regenerated via pnpm install)
artifacts/fursa/dist/  (built by vite build)
artifacts/api-server/dist/ (built by tsc)
lib/*/dist/            (built by tsc)
lib/*/node_modules/
.git/
.local/
```

---

## Option 1 — Replit (Recommended, already set up)

Everything is already configured. Just click **Deploy** in the Replit toolbar.
Replit handles TLS, health checks, and environment injection automatically.

**Required secrets to set in Replit Deployments → Secrets:**
- `DATABASE_URL` — PostgreSQL connection string
- `CLERK_PUBLISHABLE_KEY` — from Clerk dashboard
- `CLERK_SECRET_KEY` — from Clerk dashboard
- `DEFAULT_OBJECT_STORAGE_BUCKET_ID` — Replit object storage bucket
- `PRIVATE_OBJECT_DIR` — private storage directory
- `PUBLIC_OBJECT_SEARCH_PATHS` — public storage search paths

---

## Option 2 — Railway (Free tier available)

1. Push the repo to GitHub.
2. Create a new Railway project → **Deploy from GitHub repo**.
3. Add two services:
   - **API Server**: Root directory `artifacts/api-server`, build command `pnpm --filter @workspace/api-server run build`, start command `pnpm --filter @workspace/api-server run start`
   - **Frontend**: Root directory `artifacts/fursa`, build command `pnpm --filter @workspace/fursa run build`, serve the `dist/` output via a static site or Nginx.
4. Add a **PostgreSQL** plugin to the project and copy the `DATABASE_URL`.
5. Set all environment variables (see list above) in each service's Variables tab.
6. Set `VITE_API_URL` on the frontend to the Railway API service's public URL.

**File to exclude in `.railwayignore`:**
```
node_modules
**/dist
**/.env
```

---

## Option 3 — Render (Free tier available)

1. Push to GitHub.
2. Create a **Web Service** for the API:
   - Build command: `pnpm install && pnpm --filter @workspace/db run build && pnpm --filter @workspace/api-server run build`
   - Start command: `node artifacts/api-server/dist/index.js`
   - Environment: Node
3. Create a **Static Site** for the frontend:
   - Build command: `pnpm install && pnpm --filter @workspace/fursa run build`
   - Publish directory: `artifacts/fursa/dist`
4. Create a **PostgreSQL** database on Render and copy the external URL.
5. Set all environment variables on the Web Service.

---

## Option 4 — Vercel + Supabase

- **Frontend** → Deploy `artifacts/fursa` as a Vite static site on Vercel.
- **Backend** → Not ideal for Express; use Railway or Render for the API.
- **Database** → Supabase free tier (PostgreSQL-compatible).

---

## Database Migration (all platforms)

After deploying, run migrations once:
```bash
pnpm --filter @workspace/db run migrate
```
Or set up the `DATABASE_URL` and run:
```bash
node -e "require('./lib/db/dist/migrate.js')"
```

---

## Environment Variables Reference

| Variable | Where | Description |
|---|---|---|
| `DATABASE_URL` | API server | PostgreSQL connection string |
| `CLERK_PUBLISHABLE_KEY` | API server + Frontend | Clerk public key |
| `CLERK_SECRET_KEY` | API server only | Clerk secret key |
| `PORT` | API server | Port to listen on (default 8080) |
| `VITE_API_URL` | Frontend build | URL of the API server |
| `DEFAULT_OBJECT_STORAGE_BUCKET_ID` | API server | Replit object storage bucket ID |
| `PRIVATE_OBJECT_DIR` | API server | Path for private file storage |
| `PUBLIC_OBJECT_SEARCH_PATHS` | API server | Paths for public file serving |

---

## Important Notes

- The frontend uses **Clerk** for authentication. You must configure the **Allowed Origins** in your Clerk dashboard to include your production domain.
- For the Google OAuth logo on the consent screen, upload your logo at: **Google Cloud Console → APIs & Services → OAuth consent screen → App logo**.
- The file storage uses Replit Object Storage by default. On other platforms, you'll need to swap `lib/object-storage-web` for an S3-compatible adapter.
