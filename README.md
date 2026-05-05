<div align="center">

<img src="https://img.shields.io/badge/فرصة-منصة_التوظيف_الرقمية-6366f1?style=for-the-badge" alt="Fursa"/>

# فُرصة — Fursa

**منصة توظيف رقمية ثنائية اللغة مخصصة لقطاع غزة**  
**A bilingual digital employment platform built for Gaza**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk&logoColor=white)](https://clerk.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

</div>

---

## 🇵🇸 بالعربية

### ما هي فُرصة؟

**فُرصة** منصة توظيف رقمية مفتوحة المصدر مبنية خصيصاً لسوق العمل في قطاع غزة. تربط المنصة بين الباحثين عن عمل وأصحاب العمل بواجهة عربية وإنجليزية كاملة، مع نظام إدارة متكامل.

### المزايا الرئيسية

| المزايا | التفاصيل |
|---------|----------|
| 🌐 ثنائية اللغة | عربي (RTL) وإنجليزي (LTR) بشكل كامل |
| 👔 لوحة صاحب العمل | نشر الوظائف، مراجعة الطلبات، التواصل مع المتقدمين |
| 🎓 لوحة الباحث | تصفح الوظائف، التقديم، تتبع الحالة، الرسائل |
| 🛡️ لوحة الإدارة | إدارة المستخدمين والوظائف مع إحصائيات فورية (SSE) |
| 💬 نظام الرسائل | محادثات مباشرة بين صاحب العمل والمتقدمين |
| 📊 اكتمال البروفايل | مؤشر تقدم مرمّز بالألوان لتحسين الملف الشخصي |
| 🔔 الإشعارات | إشعارات فورية داخل التطبيق |
| 📎 رفع السيرة الذاتية | تحميل ومعاينة وتنزيل ملفات CV |
| 🔒 أمان كامل | Rate limiting، Helmet، Zod validation |

### البنية التقنية

```
📁 artifacts/
├── fursa/          ← واجهة React + Vite + Wouter + TailwindCSS
└── api-server/     ← Express 5 + Drizzle ORM + PostgreSQL

📁 lib/
├── db/             ← مخطط قاعدة البيانات (Drizzle)
├── api-client-react/ ← Client مُولَّد تلقائياً (Orval + TanStack Query)
└── api-zod/        ← مخطط Zod مشترك
```

### التقنيات المستخدمة

| الطبقة | التقنيات |
|--------|----------|
| Frontend | React 19, Vite, Wouter, TailwindCSS, shadcn/ui |
| Backend | Node.js, Express 5, TypeScript |
| قاعدة البيانات | PostgreSQL 17, Drizzle ORM |
| المصادقة | Clerk (OAuth + Email) |
| الأمان | Helmet, express-rate-limit, Zod |
| السجلات | Pino (structured logging) |
| البريد | Resend |
| التخزين | Google Cloud Storage |

### التشغيل المحلي

#### المتطلبات
- Node.js 20+
- pnpm 9+
- PostgreSQL 17+
- حساب Clerk

#### الخطوات

```bash
# 1. استنساخ المشروع
git clone https://github.com/your-username/fursa.git
cd fursa

# 2. تثبيت الاعتماديات
pnpm install

# 3. إعداد متغيرات البيئة
cp .env.example .env
# أضف: DATABASE_URL, CLERK_SECRET_KEY, CLERK_PUBLISHABLE_KEY

# 4. تهيئة قاعدة البيانات
pnpm --filter @workspace/db run migrate

# 5. تشغيل المشروع
pnpm --filter @workspace/fursa run dev        # الواجهة على PORT
pnpm --filter @workspace/api-server run dev   # السيرفر على PORT
```

### البيئات والأدوار

| الدور | الصلاحيات |
|-------|-----------|
| `seeker` | تصفح الوظائف، التقديم، الرسائل، رفع CV |
| `employer` | نشر الوظائف، مراجعة الطلبات، التواصل |
| `admin` | إدارة كاملة للمنصة، إحصائيات، تصدير |

### المراحل المخططة

- **المرحلة 1 (الأمان والاستقرار)** — ✅ معظمها مكتمل
- **المرحلة 2 (تجربة المستخدم)** — تنبيهات الوظائف، جولة تعريفية
- **المرحلة 3 (التمييز)** — بناء CV، تقييمات الشركات، رؤى الرواتب
- **المرحلة 4 (النمو والـ SEO)** — sitemap ديناميكي، بيانات منظمة
- **المرحلة 5 (المحتوى والثقة)** — مدونة، مركز مساعدة

---

## 🇬🇧 In English

### What is Fursa?

**Fursa** (Arabic for "Opportunity") is an open-source bilingual digital employment platform built specifically for the Gaza Strip job market. It connects job seekers with employers through a fully Arabic and English interface with a comprehensive admin system.

### Key Features

| Feature | Details |
|---------|---------|
| 🌐 Bilingual | Full Arabic (RTL) and English (LTR) support |
| 👔 Employer Dashboard | Post jobs, review applications, message applicants |
| 🎓 Seeker Dashboard | Browse jobs, apply, track status, manage messages |
| 🛡️ Admin Dashboard | Manage users/jobs with real-time stats via SSE |
| 💬 Messaging System | Direct conversations between employers and applicants |
| 📊 Profile Completion | Color-coded progress indicator for profile quality |
| 🔔 Notifications | Real-time in-app notifications |
| 📎 CV Upload | Upload, preview, and download resume files |
| 🔒 Security | Rate limiting, Helmet, Zod validation, pino logging |

### Architecture

```
📁 artifacts/
├── fursa/          ← React + Vite + Wouter + TailwindCSS frontend
└── api-server/     ← Express 5 + Drizzle ORM + PostgreSQL backend

📁 lib/
├── db/             ← Database schema (Drizzle)
├── api-client-react/ ← Auto-generated client (Orval + TanStack Query)
└── api-zod/        ← Shared Zod schemas
```

### Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, Vite, Wouter, TailwindCSS, shadcn/ui |
| Backend | Node.js, Express 5, TypeScript |
| Database | PostgreSQL 17, Drizzle ORM |
| Auth | Clerk (OAuth + Email) |
| Security | Helmet, express-rate-limit, Zod |
| Logging | Pino (structured logging) |
| Email | Resend |
| Storage | Google Cloud Storage |

### Local Setup

#### Prerequisites
- Node.js 20+
- pnpm 9+
- PostgreSQL 17+
- Clerk account

#### Steps

```bash
# 1. Clone the repo
git clone https://github.com/your-username/fursa.git
cd fursa

# 2. Install dependencies
pnpm install

# 3. Set environment variables
cp .env.example .env
# Fill in: DATABASE_URL, CLERK_SECRET_KEY, CLERK_PUBLISHABLE_KEY

# 4. Run database migrations
pnpm --filter @workspace/db run migrate

# 5. Start development servers
pnpm --filter @workspace/fursa run dev        # Frontend on PORT
pnpm --filter @workspace/api-server run dev   # Backend on PORT
```

### User Roles

| Role | Capabilities |
|------|-------------|
| `seeker` | Browse jobs, apply, messages, upload CV |
| `employer` | Post jobs, review applications, communicate |
| `admin` | Full platform management, stats, exports |

### Roadmap

- **Phase 1 (Security & Stability)** — ✅ Mostly complete
- **Phase 2 (Core UX)** — Job alerts, onboarding tour
- **Phase 3 (Differentiation)** — CV builder, company reviews, salary insights
- **Phase 4 (Growth & SEO)** — Dynamic sitemap, structured data
- **Phase 5 (Content & Trust)** — Blog, help center, success stories

### Project Structure

```
fursa/
├── artifacts/
│   ├── fursa/              # React frontend
│   │   └── src/
│   │       ├── components/ # Reusable UI components
│   │       ├── pages/      # Route-level pages (admin/, employer/, seeker/)
│   │       ├── hooks/      # Custom React hooks (SSE, auth, etc.)
│   │       └── lib/        # i18n, utils, API client
│   └── api-server/
│       └── src/
│           ├── routes/     # Express route handlers
│           ├── middlewares/ # Auth, rate limiting, sanitization
│           └── lib/        # Logger, helpers
├── lib/
│   ├── db/                 # Drizzle schema & migrations
│   ├── api-client-react/   # Auto-generated TanStack Query hooks
│   └── api-zod/            # Shared Zod schemas
└── pnpm-workspace.yaml
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `CLERK_SECRET_KEY` | Clerk backend secret key |
| `CLERK_PUBLISHABLE_KEY` | Clerk frontend publishable key |
| `RESEND_API_KEY` | Resend email API key |
| `GCS_BUCKET_NAME` | Google Cloud Storage bucket |
| `PORT` | Server port (auto-assigned in Replit) |

### Contributing

Contributions are welcome. Please open an issue first to discuss changes, then submit a pull request against `main`.

### License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

**صُنع بـ ❤️ من أجل غزة — Made with ❤️ for Gaza**

</div>
