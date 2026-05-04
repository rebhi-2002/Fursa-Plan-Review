# توثيق منصة فُرصة — Fursa Platform Documentation

> **منصة توظيف رقمية** تربط بين الباحثين عن عمل وأصحاب العمل، مع لوحة إدارة كاملة.  
> A digital employment platform connecting job seekers with employers, featuring a full admin panel.

---

## 📋 فهرس المحتويات / Table of Contents

1. [هيكل المشروع](#1-هيكل-المشروع)
2. [صفحات الموقع حسب دور المستخدم](#2-صفحات-الموقع-حسب-دور-المستخدم)
3. [تفاصيل الـ Header والـ Footer](#3-تفاصيل-الـ-header-والـ-footer)
4. [مسارات الباكيند (API Routes)](#4-مسارات-الباكيند-api-routes)
5. [قاعدة البيانات](#5-قاعدة-البيانات)
6. [المتغيرات البيئية (Environment Variables)](#6-المتغيرات-البيئية)
7. [تدفق المصادقة](#7-تدفق-المصادقة)

---

## 1. هيكل المشروع

```
workspace/
├── artifacts/
│   ├── fursa/                        # التطبيق الرئيسي (React + Vite)
│   │   └── src/
│   │       ├── App.tsx               # نقطة الدخول، الـ routing، Clerk provider
│   │       ├── main.tsx              # تهيئة React
│   │       ├── index.css             # التصميم العام (Tailwind)
│   │       ├── components/
│   │       │   ├── layout/
│   │       │   │   ├── AppLayout.tsx       # الغلاف الرئيسي (Header + Footer)
│   │       │   │   ├── Header.tsx          # شريط التنقل العلوي
│   │       │   │   ├── Footer.tsx          # تذييل الصفحة
│   │       │   │   ├── RoleGuard.tsx       # حماية المسارات حسب الدور
│   │       │   │   └── NotificationBell.tsx # أيقونة الإشعارات
│   │       │   ├── ErrorBoundary.tsx       # معالجة أخطاء React
│   │       │   └── ui/                     # مكونات shadcn/ui
│   │       ├── pages/
│   │       │   ├── home.tsx               # الصفحة الرئيسية
│   │       │   ├── about.tsx              # صفحة عن المنصة
│   │       │   ├── contact.tsx            # صفحة التواصل
│   │       │   ├── faq.tsx                # الأسئلة الشائعة
│   │       │   ├── privacy.tsx            # سياسة الخصوصية
│   │       │   ├── terms.tsx              # شروط الاستخدام
│   │       │   ├── not-found.tsx          # صفحة 404 (توجيه ذكي حسب الدور)
│   │       │   ├── onboarding.tsx         # استكمال الملف الشخصي
│   │       │   ├── notifications.tsx      # صفحة الإشعارات
│   │       │   ├── employers.tsx          # ملف صاحب العمل العام
│   │       │   ├── employers-list.tsx     # قائمة أصحاب العمل
│   │       │   ├── auth/
│   │       │   │   ├── sign-in.tsx        # تسجيل الدخول (Clerk)
│   │       │   │   └── sign-up.tsx        # إنشاء حساب (Clerk)
│   │       │   ├── jobs/
│   │       │   │   ├── index.tsx          # قائمة الوظائف مع فلاتر البحث
│   │       │   │   └── detail.tsx         # تفاصيل وظيفة واحدة
│   │       │   ├── messages/
│   │       │   │   ├── index.tsx          # قائمة المحادثات
│   │       │   │   └── thread.tsx         # محادثة فردية
│   │       │   ├── seeker/
│   │       │   │   ├── dashboard.tsx      # لوحة تحكم الباحث
│   │       │   │   ├── applications.tsx   # طلبات التقديم
│   │       │   │   ├── saved.tsx          # الوظائف المحفوظة
│   │       │   │   └── profile.tsx        # الملف الشخصي
│   │       │   ├── employer/
│   │       │   │   ├── dashboard.tsx      # لوحة تحكم صاحب العمل
│   │       │   │   ├── jobs.tsx           # إدارة الوظائف
│   │       │   │   ├── job-new.tsx        # نشر وظيفة جديدة
│   │       │   │   ├── job-edit.tsx       # تعديل وظيفة موجودة
│   │       │   │   ├── applications.tsx   # طلبات التوظيف الواردة
│   │       │   │   └── profile.tsx        # ملف الشركة
│   │       │   ├── admin/
│   │       │   │   ├── dashboard.tsx      # لوحة إدارة المنصة
│   │       │   │   ├── jobs.tsx           # مراجعة وإدارة الوظائف
│   │       │   │   ├── users.tsx          # إدارة المستخدمين
│   │       │   │   └── profile.tsx        # ملف الأدمن
│   │       │   └── seekers/
│   │       │       └── profile.tsx        # ملف الباحث العام
│   │       ├── hooks/                     # Custom React Hooks
│   │       └── lib/
│   │           ├── i18n.tsx              # نظام الترجمة (AR/EN)
│   │           ├── theme.ts              # إدارة الثيم (Dark/Light)
│   │           ├── queryClient.ts        # إعداد React Query
│   │           └── utils.ts             # دوال مساعدة
│   │
│   ├── api-server/                       # الباكيند (Express.js + TypeScript)
│   │   └── src/
│   │       ├── index.ts                  # نقطة الدخول، تشغيل السيرفر
│   │       ├── app.ts                    # إعداد Express، middleware، rate limiting
│   │       ├── routes/
│   │       │   ├── index.ts             # تجميع جميع المسارات
│   │       │   ├── health.ts            # فحص صحة السيرفر
│   │       │   ├── me.ts                # بيانات المستخدم الحالي
│   │       │   ├── publicJobs.ts        # الوظائف العامة (بدون تسجيل)
│   │       │   ├── seeker.ts            # مسارات الباحث عن عمل
│   │       │   ├── employer.ts          # مسارات صاحب العمل
│   │       │   ├── admin.ts             # مسارات الأدمن
│   │       │   ├── notifications.ts     # الإشعارات
│   │       │   ├── messages.ts          # الرسائل
│   │       │   ├── platform.ts          # إحصاءات المنصة
│   │       │   ├── storage.ts           # رفع وإدارة الملفات
│   │       │   └── contact.ts           # نموذج التواصل + إرسال بريد (Resend)
│   │       ├── middlewares/
│   │       │   ├── auth.ts              # requireAuth, loadCurrentUser, requireRole
│   │       │   └── clerkProxyMiddleware.ts # Proxy لـ Clerk في الإنتاج
│   │       └── lib/
│   │           ├── logger.ts            # Pino logger
│   │           ├── notifications.ts     # إنشاء الإشعارات + إرسال البريد (Resend)
│   │           ├── objectStorage.ts     # إدارة رفع الملفات
│   │           ├── objectAcl.ts         # صلاحيات الملفات
│   │           └── sseClients.ts        # Server-Sent Events للإشعارات الفورية
│   │
│   ├── fursa-slides/                     # عرض تقديمي (Slides)
│   ├── fursa-video/                      # فيديو تعريفي (Remotion/Vite)
│   └── mockup-sandbox/                   # بيئة تصميم المكونات (Vite)
│
└── lib/
    ├── db/                               # قاعدة البيانات (Drizzle ORM + PostgreSQL)
    │   └── src/
    │       ├── index.ts                  # تصدير الجداول والـ client
    │       └── schema/
    │           ├── index.ts              # تصدير جميع الجداول
    │           ├── users.ts              # جدول المستخدمين
    │           ├── jobs.ts               # جدول الوظائف
    │           ├── applications.ts       # جدول طلبات التوظيف
    │           ├── savedJobs.ts          # جدول الوظائف المحفوظة
    │           ├── notifications.ts      # جدول الإشعارات
    │           └── messages.ts           # جدول الرسائل
    ├── api-client-react/                 # Client تلقائي للـ API (Orval)
    ├── api-spec/                         # مواصفات OpenAPI
    ├── api-zod/                          # Zod schemas
    └── object-storage-web/               # أدوات رفع الملفات للفرونتيند
```

---

## 2. صفحات الموقع حسب دور المستخدم

### 👤 الزائر (Guest) — غير مسجل

| الصفحة | المسار | الوصف |
|--------|--------|-------|
| الصفحة الرئيسية | `/` | الوظائف المميزة، الإحصاءات، التصنيفات، طريقة العمل |
| تصفح الوظائف | `/jobs` | قائمة الوظائف مع فلاتر (نوع، تصنيف، بحث) |
| تفاصيل وظيفة | `/jobs/:id` | تفاصيل وظيفة واحدة (التقديم يتطلب تسجيل) |
| قائمة أصحاب العمل | `/employers` | الشركات والمؤسسات المسجلة |
| ملف صاحب عمل | `/employers/:id` | ملف شركة مع وظائفها النشطة |
| عن المنصة | `/about` | معلومات عن فُرصة |
| الأسئلة الشائعة | `/faq` | إجابات على الأسئلة المتكررة |
| التواصل | `/contact` | نموذج التواصل مع الفريق |
| سياسة الخصوصية | `/privacy` | سياسة خصوصية البيانات |
| شروط الاستخدام | `/terms` | شروط وأحكام الاستخدام |
| تسجيل الدخول | `/sign-in` | نموذج Clerk لتسجيل الدخول |
| إنشاء حساب | `/sign-up` | نموذج Clerk لإنشاء حساب جديد |
| صفحة 404 | `/*` | أي مسار غير معروف — زر العودة للرئيسية |

---

### 🔄 مستخدم جديد — بعد التسجيل مباشرةً

| الصفحة | المسار | الوصف |
|--------|--------|-------|
| استكمال الملف | `/onboarding` | اختيار الدور (باحث/صاحب عمل) وإدخال البيانات الأساسية |

> يُعاد التوجيه تلقائياً لهذه الصفحة حتى يكمل المستخدم ملفه الشخصي.

---

### 🔍 الباحث عن عمل (Seeker) — بعد إكمال Onboarding

| الصفحة | المسار | الوصف |
|--------|--------|-------|
| لوحة التحكم | `/seeker` | إحصاءات، أحدث الطلبات، وظائف مقترحة |
| طلبات التقديم | `/seeker/applications` | جميع الوظائف التي تقدم عليها مع حالتها |
| الوظائف المحفوظة | `/seeker/saved` | الوظائف التي حفظها للمراجعة لاحقاً |
| الملف الشخصي | `/seeker/profile` | البيانات الشخصية، السيرة الذاتية، الموقع |
| الإشعارات | `/notifications` | قبول/رفض الطلبات، رسائل جديدة |
| الرسائل | `/messages` | قائمة المحادثات مع أصحاب العمل |
| محادثة | `/messages/:userId` | محادثة مباشرة مع صاحب عمل |
| تفاصيل وظيفة | `/jobs/:id` | عرض التفاصيل والتقديم مباشرةً |
| ملف باحث عام | `/seekers/:id` | عرض ملف باحث آخر للعموم |

---

### 🏢 صاحب العمل (Employer) — بعد إكمال Onboarding

| الصفحة | المسار | الوصف |
|--------|--------|-------|
| لوحة التحكم | `/employer` | إحصاءات الوظائف والطلبات الواردة |
| إدارة الوظائف | `/employer/jobs` | قائمة وظائفه مع حالة كل وظيفة |
| نشر وظيفة جديدة | `/employer/jobs/new` | نموذج إنشاء وظيفة جديدة |
| تعديل وظيفة | `/employer/jobs/:id` | تعديل تفاصيل وظيفة موجودة |
| طلبات وظيفة | `/employer/jobs/:id/applications` | المتقدمون مع إمكانية القبول/الرفض |
| ملف الشركة | `/employer/profile` | بيانات الشركة والموقع والموقع الإلكتروني |
| الإشعارات | `/notifications` | موافقة الأدمن على الوظائف، رسائل جديدة |
| الرسائل | `/messages` | التواصل مع الباحثين |
| محادثة | `/messages/:userId` | محادثة مباشرة مع باحث |

---

### 🛡️ المدير (Admin) — دور مخصص لا يحتاج Onboarding

| الصفحة | المسار | الوصف |
|--------|--------|-------|
| لوحة الإدارة | `/admin` | إحصاءات المنصة، الوظائف المعلقة، تصدير CSV |
| إدارة الوظائف | `/admin/jobs` | مراجعة وظائف جديدة، قبولها أو رفضها مع السبب |
| إدارة المستخدمين | `/admin/users` | جميع المستخدمين، تفعيل/تعطيل الحسابات |
| الملف الشخصي | `/admin/profile` | بيانات حساب الأدمن |
| الإشعارات | `/notifications` | إشعارات النظام |

---

### 📌 صفحات مشتركة لجميع المستخدمين المسجلين

| الصفحة | المسار | الوصف |
|--------|--------|-------|
| الإشعارات | `/notifications` | مركز الإشعارات الشخصي |
| الرسائل | `/messages` | قائمة المحادثات |
| محادثة | `/messages/:userId` | محادثة فردية |

---

## 3. تفاصيل الـ Header والـ Footer

### 🔝 الـ Header (شريط التنقل العلوي)

الشريط يُظهر محتوى مختلف حسب حالة المستخدم، ويُمييز الصفحة النشطة تلقائياً على جميع الأجهزة.

#### للزائر (غير مسجل):
- شعار فُرصة (رابط للرئيسية)
- روابط: الرئيسية، الوظائف
- زر تغيير اللغة (عربي / English)
- زر تبديل الثيم (مضيء / مظلم)
- زر "تسجيل الدخول" + زر "إنشاء حساب"

#### للمستخدم المسجل:
- شعار فُرصة
- روابط التنقل مع تمييز الصفحة النشطة
- أيقونة تبديل اللغة
- أيقونة تبديل الثيم
- 🔔 جرس الإشعارات مع عداد الإشعارات غير المقروءة
- للأدمن فقط: زر "لوحة الإدارة" بلون ذهبي مميز
- أيقونة الصورة الشخصية — تفتح قائمة منسدلة بـ:
  - الاسم والبريد الإلكتروني
  - روابط خاصة بالدور (Dashboard, Profile, إلخ)
  - زر تسجيل الخروج (يعيد التوجيه للرئيسية تلقائياً)

#### القائمة الجانبية للجوال (Mobile Sheet):
- تفتح من اليمين (للعربية) أو اليسار (للإنجليزية)
- نفس روابط سطح المكتب مع تمييز الصفحة النشطة بخلفية ملونة `bg-primary/10`
- زر تغيير اللغة + زر تبديل الثيم
- زر تسجيل الخروج (يُعيد التوجيه للرئيسية وتحديث الصفحة كاملاً)

**آلية تمييز الصفحة النشطة:**
- الكمبيوتر: خط تحتي بلون أساسي (`underline-offset-4 decoration-primary`)
- الجوال: خلفية `bg-primary/10` مع حدود `border-primary/20` ولون نص أساسي
- زر الأدمن: يزداد تأثيراً (`bg-amber-500/25`) عند التواجد في صفحة الإدارة

---

### 🔻 الـ Footer (تذييل الصفحة)

يظهر في جميع الصفحات (عدا `/sign-in` و `/sign-up`)

| القسم | الروابط |
|-------|---------|
| **المنصة** | تصفح الوظائف `/jobs`، عن فُرصة `/about`، الأسئلة الشائعة `/faq`، التواصل `/contact` |
| **القانونية** | سياسة الخصوصية `/privacy`، شروط الاستخدام `/terms` |
| **معلومات** | حقوق النشر مع السنة الحالية |

---

## 4. مسارات الباكيند (API Routes)

**Base URL:** `/api`

---

### 🌐 عامة — Public (بدون تسجيل دخول)

| الطريقة | المسار | الوصف |
|---------|--------|-------|
| `GET` | `/health` | فحص حالة السيرفر |
| `GET` | `/jobs/featured` | أحدث 6 وظائف للصفحة الرئيسية |
| `GET` | `/jobs` | قائمة الوظائف مع فلاتر (search, type, category, limit, offset) |
| `GET` | `/jobs/:id` | تفاصيل وظيفة + يزيد عداد المشاهدات |
| `GET` | `/jobs/:id/similar` | وظائف مشابهة من نفس التصنيف |
| `GET` | `/public/employers` | قائمة أصحاب العمل |
| `GET` | `/public/employers/:id` | ملف صاحب عمل مع وظائفه |
| `GET` | `/public/seekers/:id` | ملف باحث عن عمل عام |
| `GET` | `/platform/stats` | إحصاءات المنصة (مع fallback لـ 0 عند خطأ DB) |
| `GET` | `/platform/categories` | تصنيفات الوظائف (مع fallback لـ [] عند خطأ DB) |
| `POST` | `/contact` | إرسال رسالة تواصل (يُرسل بريد لصاحب الموقع + تأكيد للمرسل) |

---

### 🔐 مستخدم حالي — Me

| الطريقة | المسار | الوصف |
|---------|--------|-------|
| `GET` | `/me` | بيانات المستخدم الحالي (يُنشئ تلقائياً عند أول دخول) |
| `PATCH` | `/me` | تعديل الملف الشخصي |
| `POST` | `/me/role` | تغيير الدور (seeker/employer) |
| `DELETE` | `/me` | حذف الحساب نهائياً من DB و Clerk |

---

### 🔍 الباحث — Seeker

| الطريقة | المسار | الوصف |
|---------|--------|-------|
| `GET` | `/seeker/dashboard` | إحصاءات وبيانات لوحة التحكم |
| `GET` | `/me/applications` | قائمة الطلبات المقدَّمة |
| `POST` | `/jobs/:id/apply` | التقديم على وظيفة |
| `PATCH` | `/me/applications/:id` | تعديل خطاب التقديم / السيرة الذاتية |
| `DELETE` | `/me/applications/:id` | سحب طلب التقديم |
| `GET` | `/me/saved` | قائمة الوظائف المحفوظة |
| `POST` | `/me/saved/:jobId` | حفظ وظيفة |
| `DELETE` | `/me/saved/:jobId` | إزالة وظيفة من المحفوظات |

---

### 🏢 صاحب العمل — Employer

| الطريقة | المسار | الوصف |
|---------|--------|-------|
| `GET` | `/employer/dashboard` | إحصاءات وبيانات لوحة التحكم |
| `GET` | `/employer/jobs` | قائمة وظائفه |
| `POST` | `/employer/jobs` | نشر وظيفة جديدة (حالة: معلق) |
| `GET` | `/employer/jobs/:id` | تفاصيل وظيفة |
| `PATCH` | `/employer/jobs/:id` | تعديل وظيفة |
| `DELETE` | `/employer/jobs/:id` | حذف وظيفة |
| `POST` | `/employer/jobs/:id/toggle-open` | فتح/إغلاق باب التقديم |
| `GET` | `/employer/jobs/:id/applications` | المتقدمون لوظيفة معينة |
| `PATCH` | `/employer/applications/:id` | قبول/رفض طلب مع ملاحظة |
| `POST` | `/employer/applications/:id/seen` | تعليم الطلب كمشاهَد |

---

### 🛡️ الأدمن — Admin

| الطريقة | المسار | الوصف |
|---------|--------|-------|
| `GET` | `/admin/dashboard` | إحصاءات شاملة + أحدث الوظائف المعلقة |
| `GET` | `/admin/jobs` | جميع الوظائف (فلتر: status=pending/approved/rejected) |
| `POST` | `/admin/jobs/:id/approve` | قبول وظيفة ونشرها |
| `POST` | `/admin/jobs/:id/reject` | رفض وظيفة (مطلوب: reason) |
| `DELETE` | `/admin/jobs/:id` | حذف وظيفة |
| `GET` | `/admin/users` | جميع المستخدمين (فلتر: role=seeker/employer/admin) |
| `POST` | `/admin/users/:id/toggle-active` | تفعيل/تعطيل حساب |
| `GET` | `/admin/export/csv?type=users` | تصدير المستخدمين CSV |
| `GET` | `/admin/export/csv?type=jobs` | تصدير الوظائف CSV |

---

### 🔔 الإشعارات — Notifications

| الطريقة | المسار | الوصف |
|---------|--------|-------|
| `GET` | `/notifications` | قائمة إشعارات المستخدم |
| `GET` | `/notifications/stream` | Server-Sent Events للإشعارات الفورية |
| `GET` | `/notifications/unread-count` | عدد الإشعارات غير المقروءة |
| `POST` | `/notifications/:id/read` | تعليم إشعار كمقروء |
| `POST` | `/notifications/read-all` | تعليم الكل كمقروء |

---

### 💬 الرسائل — Messages

| الطريقة | المسار | الوصف |
|---------|--------|-------|
| `GET` | `/messages` | قائمة المحادثات |
| `GET` | `/messages/:userId` | سجل المحادثة مع مستخدم معين |
| `POST` | `/messages/:userId` | إرسال رسالة |

---

### 📁 الملفات — Storage

| الطريقة | المسار | الوصف |
|---------|--------|-------|
| `POST` | `/storage/uploads/request-url` | طلب Presigned URL لرفع مباشر |
| `GET` | `/storage/public-objects/*` | الوصول لملف عام |
| `GET` | `/storage/objects/*` | الوصول لملف خاص (يتحقق من الصلاحيات) |

---

## 5. قاعدة البيانات

**نوع قاعدة البيانات:** PostgreSQL  
**ORM:** Drizzle ORM

---

### جدول `users` — المستخدمون

| العمود | النوع | الوصف |
|--------|-------|-------|
| `id` | `text` PK | معرف Clerk للمستخدم |
| `name` | `text` | الاسم الكامل |
| `email` | `text` | البريد الإلكتروني |
| `role` | `enum` | `seeker` / `employer` / `admin` |
| `phone` | `text?` | رقم الهاتف |
| `location` | `text?` | الموقع الجغرافي |
| `bio` | `text?` | نبذة تعريفية |
| `cv_object_path` | `text?` | مسار السيرة الذاتية في التخزين |
| `website` | `text?` | الموقع الإلكتروني |
| `is_active` | `boolean` | هل الحساب مفعل؟ |
| `onboarded` | `boolean` | هل أكمل ملفه الشخصي؟ |
| `created_at` | `timestamp` | تاريخ الإنشاء |

---

### جدول `jobs` — الوظائف

| العمود | النوع | الوصف |
|--------|-------|-------|
| `id` | `serial` PK | رقم تلقائي |
| `employer_id` | `text` FK | معرف صاحب العمل |
| `title` | `text` | عنوان الوظيفة |
| `description` | `text` | وصف الوظيفة |
| `requirements` | `text?` | المتطلبات |
| `type` | `enum` | `online` / `field` / `hybrid` |
| `category` | `text` | التصنيف |
| `contact_info` | `text` | معلومات التواصل |
| `status` | `enum` | `pending` / `approved` / `rejected` |
| `rejection_reason` | `text?` | سبب الرفض |
| `is_open` | `boolean` | باب التقديم مفتوح؟ |
| `deadline` | `timestamp?` | آخر موعد للتقديم |
| `views_count` | `integer` | عدد المشاهدات |
| `created_at` | `timestamp` | تاريخ النشر |

---

### جدول `applications` — طلبات التوظيف

| العمود | النوع | الوصف |
|--------|-------|-------|
| `id` | `serial` PK | رقم الطلب |
| `job_id` | `integer` FK | الوظيفة المتقدَّم عليها |
| `applicant_id` | `text` FK | الباحث المتقدم |
| `status` | `enum` | `pending` / `accepted` / `rejected` |
| `rejection_note` | `text?` | ملاحظة الرفض |
| `cover_letter` | `text?` | خطاب التقديم |
| `cv_object_path` | `text?` | مسار السيرة الذاتية |
| `seen_by_employer` | `boolean` | شاهده صاحب العمل؟ |
| `created_at` | `timestamp` | تاريخ التقديم |

---

### جدول `saved_jobs` — الوظائف المحفوظة

| العمود | النوع | الوصف |
|--------|-------|-------|
| `user_id` | `text` FK | الباحث |
| `job_id` | `integer` FK | الوظيفة |
| `created_at` | `timestamp` | تاريخ الحفظ |

---

### جدول `notifications` — الإشعارات

| العمود | النوع | الوصف |
|--------|-------|-------|
| `id` | `serial` PK | رقم الإشعار |
| `user_id` | `text` FK | المستخدم المستهدف |
| `type` | `enum` | نوع الإشعار |
| `title` | `text` | عنوان الإشعار (JSON ثنائي اللغة) |
| `body` | `text` | نص الإشعار (JSON ثنائي اللغة) |
| `link` | `text?` | رابط ذو صلة |
| `read` | `boolean` | هل قرأه المستخدم؟ |
| `created_at` | `timestamp` | وقت الإشعار |

**أنواع الإشعارات:** `job_approved` · `job_rejected` · `new_application` · `application_accepted` · `application_rejected` · `new_message`

---

### جدول `messages` — الرسائل

| العمود | النوع | الوصف |
|--------|-------|-------|
| `id` | `serial` PK | رقم الرسالة |
| `sender_id` | `text` FK | المرسِل |
| `receiver_id` | `text` FK | المستقبِل |
| `content` | `text` | نص الرسالة |
| `read` | `boolean` | قرأها المستقبل؟ |
| `created_at` | `timestamp` | وقت الإرسال |

---

## 6. المتغيرات البيئية

### الفرونتيند (`artifacts/fursa/.env`)

| المتغير | الوصف | مطلوب؟ |
|---------|-------|---------|
| `VITE_CLERK_PUBLISHABLE_KEY` | مفتاح Clerk العام | ✅ |
| `VITE_CLERK_PROXY_URL` | Proxy لـ Clerk في الإنتاج | للإنتاج فقط |

### الباكيند (`artifacts/api-server/.env`)

| المتغير | الوصف | مطلوب؟ |
|---------|-------|---------|
| `CLERK_PUBLISHABLE_KEY` | مفتاح Clerk العام | ✅ |
| `CLERK_SECRET_KEY` | مفتاح Clerk السري | ✅ |
| `DATABASE_URL` | رابط قاعدة PostgreSQL | ✅ |
| `PORT` | منفذ السيرفر (يُعيَّن تلقائياً) | تلقائي |
| `RESEND_API_KEY` | مفتاح Resend لإرسال البريد | للبريد فقط |
| `RESEND_FROM_EMAIL` | بريد المرسل (افتراضي: `onboarding@resend.dev`) | اختياري |
| `RESEND_FROM_NAME` | اسم المرسل (افتراضي: `Fursa`) | اختياري |
| `CONTACT_RECIPIENT_EMAIL` | البريد الذي تصله رسائل نموذج التواصل | اختياري |

---

## 7. تدفق المصادقة

```
المستخدم يفتح الموقع
        │
        ▼
هل لديه جلسة Clerk نشطة؟
        │               │
       لا              نعم
        │               │
        ▼               ▼
  /sign-in أو     هل موجود في DB?
  /sign-up              │          │
                       لا         نعم
                        │          │
                        ▼          ▼
               إنشاء تلقائي  هل onboarded = true?
               من بيانات Clerk     │           │
                                  لا          نعم
                                   │           │
                                   ▼           ▼
                              /onboarding  هل الدور صحيح؟
                             (اختيار دور       │          │
                              + بيانات)        لا         نعم
                                              │           │
                                              ▼           ▼
                                        redirect       الصفحة المطلوبة
                                        لصفحته           تُعرض ✅
```

**عند تسجيل الخروج:**
- يتم استدعاء `signOut({ redirectUrl: "/" })` من Clerk
- يتم مسح جميع bيانات React Query cache
- يتم إعادة توجيه المستخدم تلقائياً للصفحة الرئيسية مع إعادة تحميل كاملة

---

*آخر تحديث: مايو 2026*
