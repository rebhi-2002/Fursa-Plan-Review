import { Helmet } from "react-helmet-async";
import { useLanguageStore } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Bell,
  MessageSquare,
  ScrollText,
  BellRing,
  BarChart2,
  Users,
  Shield,
  Star,
  Rocket,
  Globe,
  CheckCircle2,
} from "lucide-react";

type Release = {
  date: string;
  version: string;
  tag: "new" | "improvement" | "fix";
  tagColor: string;
  icon: React.ElementType;
  iconBg: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  featuresAr: string[];
  featuresEn: string[];
};

const releases: Release[] = [
  {
    date: "2026-05-01",
    version: "v2.5",
    tag: "new",
    tagColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    icon: Users,
    iconBg: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
    titleAr: "نظام دعوة المرشحين",
    titleEn: "Candidate Invitation System",
    descAr: "يمكن لأصحاب العمل الآن دعوة باحثين محددين للتقدم على وظائفهم مباشرة.",
    descEn: "Employers can now proactively invite specific job seekers to apply to their open positions.",
    featuresAr: [
      "إرسال دعوات شخصية مع رسالة مخصصة",
      "إشعار فوري للباحث عند وصول الدعوة",
      "قبول أو رفض الدعوة من لوحة التحكم",
      "تتبع حالة الدعوات في صفحة التطبيقات",
    ],
    featuresEn: [
      "Send personalized invitations with a custom message",
      "Instant notification when the seeker receives the invite",
      "Accept or decline invitations from the dashboard",
      "Track invitation status in the applications page",
    ],
  },
  {
    date: "2026-04-15",
    version: "v2.4",
    tag: "new",
    tagColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    icon: BarChart2,
    iconBg: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
    titleAr: "تحليلات متقدمة لأصحاب العمل",
    titleEn: "Advanced Employer Analytics",
    descAr: "لوحة تحليلات شاملة تساعد أصحاب العمل على فهم أداء وظائفهم ومقارنة الرواتب.",
    descEn: "A comprehensive analytics dashboard helps employers understand job performance and benchmark salaries.",
    featuresAr: [
      "اتجاهات الطلبات الأسبوعية بمخططات بيانية",
      "مقارنة الرواتب بمتوسط السوق",
      "معدلات القبول والرفض لكل وظيفة",
      "أفضل الوظائف من حيث المشاهدات والطلبات",
    ],
    featuresEn: [
      "Weekly application trends with visual charts",
      "Salary benchmarking against market average",
      "Acceptance and rejection rates per job",
      "Top performing jobs by views and applications",
    ],
  },
  {
    date: "2026-04-01",
    version: "v2.3",
    tag: "new",
    tagColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    icon: ScrollText,
    iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    titleAr: "منشئ السيرة الذاتية",
    titleEn: "CV Builder",
    descAr: "أداة مدمجة لإنشاء سيرة ذاتية احترافية داخل المنصة دون الحاجة لبرامج خارجية.",
    descEn: "A built-in tool to create professional CVs directly on the platform without external software.",
    featuresAr: [
      "قوالب احترافية جاهزة للاستخدام",
      "إضافة الخبرات والمهارات والتعليم بسهولة",
      "رفع مباشر عند التقديم على الوظائف",
      "تصدير السيرة كملف PDF",
    ],
    featuresEn: [
      "Ready-to-use professional templates",
      "Easily add experience, skills, and education",
      "Direct upload when applying for jobs",
      "Export CV as a PDF file",
    ],
  },
  {
    date: "2026-03-15",
    version: "v2.2",
    tag: "new",
    tagColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    icon: BellRing,
    iconBg: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    titleAr: "تنبيهات الوظائف الذكية",
    titleEn: "Smart Job Alerts",
    descAr: "احصل على إشعار فوري عند نشر وظيفة تناسب تفضيلاتك دون الحاجة للبحث يدوياً.",
    descEn: "Get instant notifications when a matching job is posted without manual searching.",
    featuresAr: [
      "ضبط تنبيهات حسب الصنف والنوع",
      "إشعارات داخل التطبيق بالوقت الفعلي",
      "تفعيل أو تعطيل التنبيهات بسهولة",
      "عرض كل وظائف التنبيه في صفحة مخصصة",
    ],
    featuresEn: [
      "Set alerts by category and job type",
      "Real-time in-app notifications",
      "Easily enable or disable any alert",
      "View all matched jobs in a dedicated page",
    ],
  },
  {
    date: "2026-03-01",
    version: "v2.1",
    tag: "new",
    tagColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    icon: MessageSquare,
    iconBg: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
    titleAr: "نظام الرسائل المباشرة",
    titleEn: "Direct Messaging System",
    descAr: "تواصل مباشر بين الباحثين وأصحاب العمل داخل المنصة دون الحاجة لوسيط.",
    descEn: "Direct communication between seekers and employers inside the platform without any middleman.",
    featuresAr: [
      "محادثات فورية بين الباحث وصاحب العمل",
      "إشعار عند وصول رسالة جديدة",
      "عداد الرسائل غير المقروءة في الهيدر",
      "تنظيم المحادثات حسب الأحدث",
    ],
    featuresEn: [
      "Instant conversations between seeker and employer",
      "Notification on new message arrival",
      "Unread message counter in the header",
      "Conversations organized by most recent",
    ],
  },
  {
    date: "2026-02-01",
    version: "v2.0",
    tag: "improvement",
    tagColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    icon: Bell,
    iconBg: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    titleAr: "إشعارات الوقت الفعلي (SSE)",
    titleEn: "Real-time Notifications (SSE)",
    descAr: "تحديث تقني كبير: الإشعارات تصل الآن فورياً بدون إعادة تحميل الصفحة عبر تقنية SSE.",
    descEn: "Major technical upgrade: notifications now arrive instantly without page reload via SSE technology.",
    featuresAr: [
      "إشعارات قبول/رفض الطلب بشكل فوري",
      "إشعارات الرسائل الجديدة في الوقت الحقيقي",
      "لوحة إدارة تستقبل الأحداث لحظياً",
      "لا حاجة لتحديث الصفحة يدوياً",
    ],
    featuresEn: [
      "Instant application accept/reject notifications",
      "New message notifications in real-time",
      "Admin dashboard receives live events",
      "No need to manually refresh the page",
    ],
  },
  {
    date: "2026-01-01",
    version: "v1.0",
    tag: "new",
    tagColor: "bg-primary/10 text-primary",
    icon: Rocket,
    iconBg: "bg-primary/10 text-primary",
    titleAr: "إطلاق منصة فُرصة 🎉",
    titleEn: "Fursa Platform Launch 🎉",
    descAr: "الإطلاق الرسمي لمنصة فُرصة — منصة التوظيف الرقمية لغزة.",
    descEn: "Official launch of Fursa — Gaza's digital employment platform.",
    featuresAr: [
      "نشر الوظائف ومراجعتها من قبل الإدارة",
      "التقديم المباشر مع السيرة الذاتية",
      "دعم كامل للغتين العربية والإنجليزية",
      "لوحات تحكم للباحثين وأصحاب العمل والمسؤولين",
    ],
    featuresEn: [
      "Job posting with admin review workflow",
      "Direct application with CV upload",
      "Full bilingual Arabic and English support",
      "Dashboards for seekers, employers, and admins",
    ],
  },
];

const tagLabel = (tag: Release["tag"], isAr: boolean) => {
  if (tag === "new") return isAr ? "جديد" : "New";
  if (tag === "improvement") return isAr ? "تحسين" : "Improvement";
  return isAr ? "إصلاح" : "Fix";
};

export default function ChangelogPage() {
  const { lang } = useLanguageStore();
  const isAr = lang === "ar";
  const dir = isAr ? "rtl" : "ltr";

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(isAr ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div dir={dir} className="flex flex-col">
      <Helmet>
        <title>{isAr ? "ما الجديد؟ | فُرصة" : "What's New | Fursa"}</title>
        <meta
          name="description"
          content={isAr ? "آخر التحديثات والميزات الجديدة في منصة فُرصة" : "Latest updates and new features on the Fursa platform"}
        />
      </Helmet>

      {/* Full-width hero */}
      <div className="relative overflow-hidden h-56 md:h-72">
        <img
          src="/img/changelog-hero.png"
          alt={isAr ? "ما الجديد في فُرصة" : "What's New in Fursa"}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/60 to-transparent flex flex-col justify-center px-8 md:px-16">
          <div className="max-w-3xl mx-auto w-full">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-4 w-fit text-white">
              <Sparkles className="h-4 w-4" />
              {isAr ? "آخر التحديثات" : "Latest Updates"}
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
              {isAr ? "ما الجديد في فُرصة؟" : "What's New in Fursa?"}
            </h1>
            <p className="text-white/80 text-sm md:text-base max-w-md">
              {isAr
                ? "نتابع تطوير المنصة باستمرار. هنا آخر ما أضفناه وحسّنّاه."
                : "We continuously improve the platform. Here's what we've added and improved lately."}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="container max-w-3xl py-14 px-4">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute start-[19px] top-0 bottom-0 w-px bg-border/60" />

          <div className="space-y-12">
            {releases.map((rel, idx) => {
              const Icon = rel.icon;
              return (
                <div key={idx} className="relative flex gap-5">
                  {/* Icon dot */}
                  <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 border-background shadow-sm ${rel.iconBg}`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-2">
                    {/* Header row */}
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs font-mono text-muted-foreground border-border/60">
                        {rel.version}
                      </Badge>
                      <Badge className={`text-xs border-0 ${rel.tagColor}`}>
                        {tagLabel(rel.tag, isAr)}
                      </Badge>
                      <span className="text-xs text-muted-foreground ms-auto">
                        {formatDate(rel.date)}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-foreground mb-1">
                      {isAr ? rel.titleAr : rel.titleEn}
                    </h2>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {isAr ? rel.descAr : rel.descEn}
                    </p>

                    {/* Feature list */}
                    <ul className="space-y-1.5">
                      {(isAr ? rel.featuresAr : rel.featuresEn).map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-16 rounded-2xl bg-gradient-to-br from-primary/5 to-indigo-50/50 dark:to-indigo-950/20 border border-primary/10 p-8 text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/10 mb-4">
            <Globe className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">
            {isAr ? "هل لديك اقتراح؟" : "Have a suggestion?"}
          </h3>
          <p className="text-muted-foreground mb-6 text-sm max-w-sm mx-auto">
            {isAr
              ? "نسمع لمجتمعنا — أرسل لنا اقتراحاتك وسنعمل على تطويرها."
              : "We listen to our community — share your suggestions and we'll work on them."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link href="/contact">
                {isAr ? "تواصل معنا" : "Contact Us"}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/docs">
                {isAr ? "دليل الاستخدام" : "User Guide"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
