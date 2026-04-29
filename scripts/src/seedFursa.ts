import {
  db,
  usersTable,
  jobsTable,
  applicationsTable,
} from "@workspace/db";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Clearing existing seed data...");
  await db.execute(sql`truncate table applications, saved_jobs, jobs, users restart identity cascade`);

  console.log("Seeding users...");
  const seekers = await db
    .insert(usersTable)
    .values([
      {
        id: "seed_seeker_layla",
        name: "ليلى عبد الرحمن",
        email: "layla@example.com",
        role: "seeker",
        phone: "+970599000001",
        location: "غزة - الرمال",
        bio: "مصممة جرافيك وواجهات استخدام بخبرة 4 سنوات.",
        onboarded: true,
      },
      {
        id: "seed_seeker_yousef",
        name: "يوسف الخالدي",
        email: "yousef@example.com",
        role: "seeker",
        phone: "+970599000002",
        location: "خان يونس",
        bio: "مطوّر ويب فول-ستاك متخصص بـ React و Node.",
        onboarded: true,
      },
      {
        id: "seed_seeker_noor",
        name: "نور أبو سرحان",
        email: "noor@example.com",
        role: "seeker",
        phone: "+970599000003",
        location: "غزة - الزيتون",
        bio: "مترجمة إنجليزي ⇄ عربي مع خبرة في الترجمة الطبية.",
        onboarded: true,
      },
    ])
    .returning();

  const employers = await db
    .insert(usersTable)
    .values([
      {
        id: "seed_employer_techgaza",
        name: "شركة تك غزة للحلول الرقمية",
        email: "hr@techgaza.ps",
        role: "employer",
        phone: "+97082600000",
        location: "غزة - الرمال",
        bio: "شركة تطوير برمجيات تخدم عملاء محليين وعرب.",
        onboarded: true,
      },
      {
        id: "seed_employer_souqna",
        name: "متجر سوقنا",
        email: "jobs@souqna.ps",
        role: "employer",
        phone: "+97082600001",
        location: "غزة - النصر",
        bio: "منصة تجارة إلكترونية فلسطينية.",
        onboarded: true,
      },
      {
        id: "seed_employer_school",
        name: "مدرسة الأمل الأهلية",
        email: "admin@alamal-school.ps",
        role: "employer",
        phone: "+97082600002",
        location: "دير البلح",
        bio: "مؤسسة تعليمية أهلية للمراحل الأساسية والثانوية.",
        onboarded: true,
      },
    ])
    .returning();

  await db.insert(usersTable).values({
    id: "seed_admin_root",
    name: "مدير المنصة",
    email: "admin@fursa.ps",
    role: "admin",
    onboarded: true,
  });

  console.log("Seeding jobs...");
  const techgaza = employers.find((e) => e.id === "seed_employer_techgaza")!;
  const souqna = employers.find((e) => e.id === "seed_employer_souqna")!;
  const school = employers.find((e) => e.id === "seed_employer_school")!;

  const jobs = await db
    .insert(jobsTable)
    .values([
      {
        employerId: techgaza.id,
        title: "مطوّر واجهات أمامية React",
        description:
          "نبحث عن مطوّر واجهات أمامية بخبرة لا تقل عن سنتين في React وTypeScript للعمل على منتجات تخدم السوق العربي. العمل ضمن فريق تطوير صغير ونشيط.",
        requirements:
          "خبرة بـ React, TypeScript, Tailwind, Git. يفضّل من له خبرة بـ TanStack Query.",
        type: "online",
        category: "تطوير برمجيات",
        contactInfo: "hr@techgaza.ps - WhatsApp: +97082600000",
        status: "approved",
        isOpen: true,
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      },
      {
        employerId: souqna.id,
        title: "مصمم/ة جرافيك للسوشال ميديا",
        description:
          "تصميم منشورات يومية لحساباتنا على إنستغرام وفيسبوك، إعداد إعلانات للحملات الموسمية، وتصميم صور غلاف للمنتجات.",
        requirements: "إتقان Adobe Illustrator وPhotoshop. حس فني عربي قوي.",
        type: "hybrid",
        category: "تصميم جرافيك",
        contactInfo: "jobs@souqna.ps",
        status: "approved",
        isOpen: true,
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      },
      {
        employerId: school.id,
        title: "مدرّس/ة لغة إنجليزية للمرحلة الثانوية",
        description:
          "تدريس مادة اللغة الإنجليزية لطلاب الصفوف 10-12، إعداد الخطط الدرسية، والمشاركة في الأنشطة المدرسية.",
        requirements: "بكالوريوس في اللغة الإنجليزية أو ما يعادلها. خبرة لا تقل عن سنة.",
        type: "field",
        category: "تعليم وتدريب",
        contactInfo: "admin@alamal-school.ps - دير البلح",
        status: "approved",
        isOpen: true,
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21),
      },
      {
        employerId: techgaza.id,
        title: "كاتب محتوى تقني عربي",
        description:
          "كتابة مقالات ودراسات حالة تقنية باللغة العربية لمدوّنة الشركة بمعدّل 4 مقالات شهرياً.",
        requirements: "إتقان الكتابة بالعربية الفصحى. خلفية تقنية أو خبرة بالكتابة التقنية.",
        type: "online",
        category: "كتابة محتوى",
        contactInfo: "content@techgaza.ps",
        status: "approved",
        isOpen: true,
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45),
      },
      {
        employerId: souqna.id,
        title: "مندوب/ة خدمة عملاء",
        description:
          "الردّ على استفسارات العملاء عبر واتساب والهاتف، حلّ المشاكل المتعلقة بالطلبات والشحن.",
        requirements: "مهارات تواصل ممتازة. سرعة في الكتابة على الكمبيوتر.",
        type: "field",
        category: "خدمة عملاء",
        contactInfo: "hr@souqna.ps",
        status: "pending",
        isOpen: true,
      },
      {
        employerId: techgaza.id,
        title: "مطوّر Backend Node.js",
        description:
          "بناء وصيانة واجهات API لخدمة تطبيقات الويب والموبايل باستخدام Node.js وPostgreSQL.",
        requirements: "خبرة سنتين على الأقل بـ Node.js, Express, PostgreSQL.",
        type: "hybrid",
        category: "تطوير برمجيات",
        contactInfo: "hr@techgaza.ps",
        status: "approved",
        isOpen: true,
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 28),
      },
    ])
    .returning();

  console.log("Seeding applications...");
  await db.insert(applicationsTable).values([
    {
      jobId: jobs[0]!.id,
      applicantId: "seed_seeker_yousef",
      coverLetter:
        "أملك خبرة 3 سنوات في React وTypeScript، عملت على عدة مشاريع لعملاء عرب وأجانب.",
      status: "pending",
    },
    {
      jobId: jobs[1]!.id,
      applicantId: "seed_seeker_layla",
      coverLetter:
        "خبرتي في التصميم للسوشال ميديا تتجاوز 4 سنوات مع علامات تجارية محلية.",
      status: "accepted",
    },
    {
      jobId: jobs[3]!.id,
      applicantId: "seed_seeker_noor",
      coverLetter: "متخصصة في الترجمة والكتابة بالعربية الفصحى.",
      status: "pending",
    },
  ]);

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
