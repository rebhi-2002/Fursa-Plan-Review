import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { useT, useLanguageStore } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  UserPlus, Search, FileText, CheckCircle2, Bell, Building2,
  Briefcase, Star, Shield, ArrowRight, Users, Eye, MessageSquare,
  BarChart2, Settings, Award,
} from "lucide-react";

interface Step {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  title: string;
  desc: string;
}

export default function HowItWorksPage() {
  const t = useT();
  const { lang } = useLanguageStore();
  const [tab, setTab] = useState<"seeker" | "employer" | "admin">("seeker");

  const seekerSteps: Step[] = [
    { icon: UserPlus, color: "text-blue-600", bg: "bg-blue-100",
      title: lang === "ar" ? "أنشئ حسابك" : "Create Your Account",
      desc: lang === "ar" ? "سجّل بالبريد الإلكتروني أو حسابك الاجتماعي في دقيقة واحدة" : "Sign up with email or social account in under a minute" },
    { icon: FileText, color: "text-violet-600", bg: "bg-violet-100",
      title: lang === "ar" ? "أكمل ملفك الشخصي" : "Complete Your Profile",
      desc: lang === "ar" ? "أضف مهاراتك وخبرتك وسيرتك الذاتية لتحسين فرص القبول" : "Add your skills, experience, and CV to improve acceptance chances" },
    { icon: Search, color: "text-emerald-600", bg: "bg-emerald-100",
      title: lang === "ar" ? "ابحث عن وظائف" : "Search for Jobs",
      desc: lang === "ar" ? "فلتر حسب الفئة والنوع والموقع وابحث بالكلمات المفتاحية" : "Filter by category, type, location and search by keywords" },
    { icon: Bell, color: "text-orange-600", bg: "bg-orange-100",
      title: lang === "ar" ? "فعّل تنبيهات الوظائف" : "Enable Job Alerts",
      desc: lang === "ar" ? "احصل على إشعار فوري بكل وظيفة جديدة تناسب اهتماماتك" : "Get instant notifications for every new job matching your interests" },
    { icon: Briefcase, color: "text-primary", bg: "bg-primary/10",
      title: lang === "ar" ? "تقدّم للوظائف" : "Apply to Jobs",
      desc: lang === "ar" ? "أرفق خطاب تقديم وسيرة ذاتية — كل ذلك داخل المنصة" : "Attach a cover letter and resume — all within the platform" },
    { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100",
      title: lang === "ar" ? "تابع طلباتك" : "Track Your Applications",
      desc: lang === "ar" ? "راقب حالة كل طلب وتلقَّ إشعاراً فور تحديثه" : "Monitor the status of each application and get notified on updates" },
    { icon: Award, color: "text-amber-600", bg: "bg-amber-100",
      title: lang === "ar" ? "ابنِ سيرتك الذاتية" : "Build Your Resume",
      desc: lang === "ar" ? "استخدم محرر السيرة الذاتية المدمج لإنشاء CV احترافي يُطبع بنقرة" : "Use the built-in CV editor to create a professional resume — print with one click" },
  ];

  const employerSteps: Step[] = [
    { icon: Building2, color: "text-blue-600", bg: "bg-blue-100",
      title: lang === "ar" ? "سجّل كصاحب عمل" : "Register as Employer",
      desc: lang === "ar" ? "أنشئ حساب الشركة وأضف معلوماتها بشكل احترافي" : "Create a company account and add your business information professionally" },
    { icon: Settings, color: "text-slate-600", bg: "bg-slate-100",
      title: lang === "ar" ? "اكتمل ملفك الشخصي" : "Complete Your Profile",
      desc: lang === "ar" ? "أضف شعار الشركة وموقعها ومجال عملها لجذب الكفاءات" : "Add logo, location, and industry to attract talent" },
    { icon: FileText, color: "text-emerald-600", bg: "bg-emerald-100",
      title: lang === "ar" ? "انشر وظائفك" : "Post Your Jobs",
      desc: lang === "ar" ? "أضف تفاصيل كاملة للوظيفة — المتطلبات والمزايا والموعد النهائي" : "Add full job details — requirements, benefits, and deadline" },
    { icon: Eye, color: "text-violet-600", bg: "bg-violet-100",
      title: lang === "ar" ? "انتظر الموافقة" : "Await Approval",
      desc: lang === "ar" ? "يراجع المشرف الوظيفة لضمان الجودة قبل نشرها للعموم" : "Admin reviews the job to ensure quality before public listing" },
    { icon: Users, color: "text-orange-600", bg: "bg-orange-100",
      title: lang === "ar" ? "راجع الطلبات" : "Review Applications",
      desc: lang === "ar" ? "استعرض ملفات المتقدمين وسيرهم الذاتية وخطاباتهم التعريفية" : "Browse applicant profiles, resumes, and cover letters" },
    { icon: MessageSquare, color: "text-primary", bg: "bg-primary/10",
      title: lang === "ar" ? "تواصل مع المرشحين" : "Contact Candidates",
      desc: lang === "ar" ? "راسل المتقدمين المناسبين مباشرة داخل المنصة" : "Message suitable applicants directly within the platform" },
    { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100",
      title: lang === "ar" ? "أكمل التوظيف" : "Complete Hiring",
      desc: lang === "ar" ? "أبلغ المتقدمين بالقرار — قبولاً أو رفضاً — بشفافية واحترافية" : "Notify applicants of your decision — accept or decline — with transparency" },
  ];

  const adminSteps: Step[] = [
    { icon: Shield, color: "text-primary", bg: "bg-primary/10",
      title: lang === "ar" ? "إدارة المستخدمين" : "Manage Users",
      desc: lang === "ar" ? "راقب حسابات الباحثين وأصحاب العمل وعالج أي مخالفات" : "Monitor seeker and employer accounts and handle any violations" },
    { icon: Eye, color: "text-violet-600", bg: "bg-violet-100",
      title: lang === "ar" ? "مراجعة الوظائف" : "Review Jobs",
      desc: lang === "ar" ? "وافق على الوظائف أو ارفضها قبل نشرها للعموم" : "Approve or reject jobs before they go public" },
    { icon: BarChart2, color: "text-emerald-600", bg: "bg-emerald-100",
      title: lang === "ar" ? "تحليل الإحصاءات" : "Analyze Statistics",
      desc: lang === "ar" ? "تتبع نمو المنصة بالرسوم البيانية التفاعلية" : "Track platform growth with interactive charts" },
    { icon: Settings, color: "text-slate-600", bg: "bg-slate-100",
      title: lang === "ar" ? "إدارة المحتوى" : "Manage Content",
      desc: lang === "ar" ? "ضبط إعدادات المنصة والتحكم في المحتوى المنشور" : "Configure platform settings and control published content" },
    { icon: Bell, color: "text-orange-600", bg: "bg-orange-100",
      title: lang === "ar" ? "إرسال الإشعارات" : "Send Notifications",
      desc: lang === "ar" ? "أرسل إشعارات للمستخدمين عند الحاجة" : "Send notifications to users when needed" },
    { icon: Star, color: "text-amber-600", bg: "bg-amber-100",
      title: lang === "ar" ? "ضمان الجودة" : "Ensure Quality",
      desc: lang === "ar" ? "تأكد من مصداقية الوظائف وأصحاب العمل للحفاظ على ثقة المستخدمين" : "Ensure job and employer credibility to maintain user trust" },
  ];

  const tabs = [
    { key: "seeker" as const,   label: lang === "ar" ? "الباحث عن عمل" : "Job Seeker",  steps: seekerSteps },
    { key: "employer" as const, label: lang === "ar" ? "صاحب العمل" : "Employer",       steps: employerSteps },
    { key: "admin" as const,    label: lang === "ar" ? "المشرف" : "Admin",               steps: adminSteps },
  ];

  const currentSteps = tabs.find(t => t.key === tab)?.steps ?? seekerSteps;

  const features = [
    { icon: Shield, title: lang === "ar" ? "آمن وموثوق" : "Secure & Trusted", desc: lang === "ar" ? "مراجعة يدوية لكل وظيفة قبل النشر" : "Manual review of every job before publishing" },
    { icon: Bell, title: lang === "ar" ? "تنبيهات فورية" : "Instant Alerts", desc: lang === "ar" ? "إشعارات فورية بكل تحديث في طلباتك" : "Instant notifications for every update in your applications" },
    { icon: FileText, title: lang === "ar" ? "محرر CV مدمج" : "Built-in CV Builder", desc: lang === "ar" ? "أنشئ سيرة ذاتية احترافية داخل المنصة" : "Create a professional resume directly on the platform" },
    { icon: MessageSquare, title: lang === "ar" ? "رسائل مباشرة" : "Direct Messaging", desc: lang === "ar" ? "تواصل مع أصحاب العمل مباشرة" : "Communicate directly with employers" },
  ];

  const title = lang === "ar" ? "كيف يعمل فُرصة" : "How Fursa Works";
  const desc = lang === "ar" ? "دليل خطوة بخطوة لكل مستخدم — باحث عن عمل أو صاحب عمل أو مشرف" : "Step-by-step guide for every user — job seeker, employer, or admin";

  return (
    <div className="flex flex-col w-full">
      <Helmet>
        <title>{title} — {lang === "ar" ? "فُرصة" : "Fursa"}</title>
        <meta name="description" content={desc} />
      </Helmet>

      {/* Hero */}
      <section className="bg-primary/5 py-16 md:py-24 border-b">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-primary/10 text-primary border-0 text-sm px-4 py-1">
            {lang === "ar" ? "دليل الاستخدام" : "User Guide"}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{desc}</p>
        </div>
      </section>

      {/* Tab selector */}
      <section className="py-12">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-10">
            <div className="inline-flex rounded-xl border bg-muted/40 p-1 gap-1">
              {tabs.map(tb => (
                <button
                  key={tb.key}
                  onClick={() => setTab(tb.key)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                    tab === tb.key
                      ? "bg-background shadow-sm text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tb.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {currentSteps.map((step, i) => (
              <div key={i} className="relative flex flex-col p-5 rounded-2xl border bg-card hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${step.bg}`}>
                    <step.icon className={`h-5 w-5 ${step.color}`} />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                    {lang === "ar" ? `خطوة ${i + 1}` : `Step ${i + 1}`}
                  </span>
                </div>
                <h3 className="font-bold text-sm mb-1.5">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                {i < currentSteps.length - 1 && (
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10 hidden lg:flex">
                    <div className="h-6 w-px bg-border" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/20 border-t">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-10">
            {lang === "ar" ? "ما يميز فُرصة" : "What Makes Fursa Special"}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-card border">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hero image */}
      <section className="py-0 relative overflow-hidden h-64 md:h-80">
        <img
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1400&q=80"
          alt="Team collaboration"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/70 flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {lang === "ar" ? "ابدأ رحلتك معنا اليوم" : "Start Your Journey With Us Today"}
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" variant="secondary" className="font-bold">
              <Link href="/sign-up">{lang === "ar" ? "إنشاء حساب مجاناً" : "Create Free Account"}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
              <Link href="/jobs">{lang === "ar" ? "تصفح الوظائف" : "Browse Jobs"}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
