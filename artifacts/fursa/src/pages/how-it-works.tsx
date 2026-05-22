import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { useLanguageStore } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  UserPlus, Search, FileText, CheckCircle2,
  Building2, Plus, Users, BarChart2,
  Sparkles, Shield, Clock, MessageSquare,
  ChevronRight, ArrowLeft,
} from "lucide-react";

export default function HowItWorksPage() {
  const { lang } = useLanguageStore();
  const dir = lang === "ar" ? "rtl" : "ltr";

  const seekerSteps = [
    {
      num: 1,
      icon: UserPlus,
      color: "bg-blue-500",
      title: lang === "ar" ? "أنشئ حسابك" : "Create Your Account",
      desc: lang === "ar"
        ? "سجّل مجاناً في دقيقة واحدة، أكمل ملفك الشخصي بمعلوماتك ومهاراتك وسيرتك الذاتية."
        : "Register for free in one minute, complete your profile with your skills and upload your CV.",
    },
    {
      num: 2,
      icon: Search,
      color: "bg-indigo-500",
      title: lang === "ar" ? "ابحث عن الوظائف" : "Browse Jobs",
      desc: lang === "ar"
        ? "تصفّح مئات الوظائف بمرشحات التصنيف والنوع. احفظ المفضّلة وفعّل تنبيهات بريد إلكتروني لوظائف جديدة."
        : "Browse hundreds of jobs filtered by category and type. Save favourites and set job alerts.",
    },
    {
      num: 3,
      icon: FileText,
      color: "bg-violet-500",
      title: lang === "ar" ? "قدّم طلبك" : "Apply with One Click",
      desc: lang === "ar"
        ? "أرسل طلبك مع رسالة تعريفية وسيرتك الذاتية مباشرة لصاحب العمل دون وسيط."
        : "Send your application with a cover letter and CV directly to the employer — no middleman.",
    },
    {
      num: 4,
      icon: CheckCircle2,
      color: "bg-emerald-500",
      title: lang === "ar" ? "تابع حالة طلبك" : "Track Your Application",
      desc: lang === "ar"
        ? "تابع حالة كل طلب في لوحتك الشخصية وتلقَّ إشعاراً فورياً عند قبول أو رفض طلبك."
        : "Track every application in your dashboard and receive an instant notification when reviewed.",
    },
  ];

  const employerSteps = [
    {
      num: 1,
      icon: Building2,
      color: "bg-amber-500",
      title: lang === "ar" ? "أنشئ حساب صاحب عمل" : "Create Employer Account",
      desc: lang === "ar"
        ? "سجّل شركتك أو مؤسستك وأضف معلوماتها ووسائل التواصل لبناء ملف موثوق."
        : "Register your company and build a trusted employer profile with contact info.",
    },
    {
      num: 2,
      icon: Plus,
      color: "bg-orange-500",
      title: lang === "ar" ? "انشر وظيفتك" : "Post a Job",
      desc: lang === "ar"
        ? "انشر وظيفتك في أقل من 5 دقائق: التصنيف، المتطلبات، الراتب، الموعد النهائي — ثم تنتظر الموافقة السريعة."
        : "Post a job in under 5 minutes: category, requirements, salary, deadline — then quick review approval.",
    },
    {
      num: 3,
      icon: Users,
      color: "bg-rose-500",
      title: lang === "ar" ? "راجع الطلبات" : "Review Applications",
      desc: lang === "ar"
        ? "استعرض طلبات المتقدمين مع سيرهم الذاتية، واقبل أو ارفض مع ملاحظة للمتقدم — كل ذلك من لوحة واحدة."
        : "View applicants with their CVs, accept or reject with a note — all from one dashboard.",
    },
    {
      num: 4,
      icon: BarChart2,
      color: "bg-cyan-500",
      title: lang === "ar" ? "تابع الأداء" : "Track Performance",
      desc: lang === "ar"
        ? "راقب إحصائيات وظائفك: عدد المشاهدات، الطلبات، معدلات القبول ومقارنة الرواتب."
        : "Monitor job stats: views, applications, acceptance rates and salary benchmarks.",
    },
  ];

  const features = [
    { icon: Sparkles, title: lang === "ar" ? "توصيات ذكية" : "Smart Recommendations", desc: lang === "ar" ? "الخوارزمية تقترح وظائف تناسب مهاراتك" : "Algorithm suggests jobs matching your skills" },
    { icon: Shield, title: lang === "ar" ? "خصوصية آمنة" : "Secure & Private", desc: lang === "ar" ? "بياناتك محمية ومشاركتها بيدك" : "Your data is protected and sharing is your choice" },
    { icon: Clock, title: lang === "ar" ? "إشعارات فورية" : "Real-time Alerts", desc: lang === "ar" ? "تنبيهات لحظية على كل تحديث في طلبك" : "Instant notifications on every application update" },
    { icon: MessageSquare, title: lang === "ar" ? "رسائل مباشرة" : "Direct Messaging", desc: lang === "ar" ? "تواصل مباشر بين الباحث وصاحب العمل" : "Direct communication between seekers and employers" },
  ];

  return (
    <div dir={dir}>
      <Helmet>
        <title>{lang === "ar" ? "كيف يعمل فُرصة؟ | فُرصة" : "How It Works | Fursa"}</title>
        <meta
          name="description"
          content={lang === "ar"
            ? "تعرّف على كيفية عمل منصة فُرصة للباحثين عن عمل وأصحاب العمل في غزة"
            : "Learn how Fursa works for job seekers and employers in Gaza"}
        />
      </Helmet>

      {/* Hero */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-primary/5 to-background text-center px-4">
        <Badge variant="outline" className="mb-4 px-3 py-1 text-primary border-primary/30">
          {lang === "ar" ? "🚀 بسيط وسريع" : "🚀 Simple & Fast"}
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
          {lang === "ar" ? "كيف يعمل فُرصة؟" : "How Does Fursa Work?"}
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-8">
          {lang === "ar"
            ? "منصة فُرصة تربط الباحثين عن عمل بأصحاب العمل في غزة بطريقة مباشرة وبسيطة وبدون وسيط."
            : "Fursa connects job seekers with employers in Gaza in a direct, simple, and transparent way."}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/sign-up">
              {lang === "ar" ? "ابدأ الآن مجاناً" : "Get Started Free"}
              {lang === "ar" ? <ArrowLeft className="ms-2 h-4 w-4 rtl:rotate-180" /> : <ChevronRight className="ms-2 h-4 w-4" />}
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/jobs">{lang === "ar" ? "تصفّح الوظائف" : "Browse Jobs"}</Link>
          </Button>
        </div>
      </section>

      {/* Tab toggle concept — two sections side by side on desktop */}
      <section className="py-14 px-4 max-w-6xl mx-auto">
        {/* Seeker Steps */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <Badge className="mb-3 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-0">
              {lang === "ar" ? "للباحثين عن عمل" : "For Job Seekers"}
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              {lang === "ar" ? "4 خطوات للحصول على وظيفتك" : "4 Steps to Your Next Job"}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {lang === "ar"
                ? "من التسجيل حتى قبول عرض العمل — كل شيء في مكان واحد"
                : "From registration to receiving a job offer — everything in one place"}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {seekerSteps.map((step) => (
              <Card key={step.num} className="relative border-border/50 hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className={`w-10 h-10 rounded-xl ${step.color} flex items-center justify-center mb-4`}>
                    <step.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                    {lang === "ar" ? `الخطوة ${step.num}` : `Step ${step.num}`}
                  </span>
                  <h3 className="font-bold text-base mt-1 mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link href="/sign-up">
                {lang === "ar" ? "سجّل كباحث عن عمل" : "Sign Up as Job Seeker"}
              </Link>
            </Button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-4 text-sm text-muted-foreground font-medium">
              {lang === "ar" ? "— أو —" : "— or —"}
            </span>
          </div>
        </div>

        {/* Employer Steps */}
        <div>
          <div className="text-center mb-10">
            <Badge className="mb-3 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-0">
              {lang === "ar" ? "لأصحاب العمل" : "For Employers"}
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              {lang === "ar" ? "4 خطوات لنشر وظيفتك وإيجاد أفضل المرشحين" : "4 Steps to Find the Best Candidates"}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {lang === "ar"
                ? "انشر وظيفتك، راجع المتقدمين، واختر من يناسبك — بسهولة تامة"
                : "Post your job, review applicants, and choose the right fit — effortlessly"}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {employerSteps.map((step) => (
              <Card key={step.num} className="relative border-border/50 hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className={`w-10 h-10 rounded-xl ${step.color} flex items-center justify-center mb-4`}>
                    <step.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                    {lang === "ar" ? `الخطوة ${step.num}` : `Step ${step.num}`}
                  </span>
                  <h3 className="font-bold text-base mt-1 mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link href="/for-employers">
                {lang === "ar" ? "اعرف أكثر عن ميزات أصحاب العمل" : "Learn More About Employer Features"}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-14 bg-muted/30 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              {lang === "ar" ? "ميزات تجعل فُرصة مختلفة" : "What Makes Fursa Different"}
            </h2>
            <p className="text-muted-foreground">
              {lang === "ar" ? "مبني خصيصاً لسوق العمل في غزة" : "Built specifically for the Gaza job market"}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <div key={i} className="flex flex-col items-center text-center p-5 bg-background rounded-2xl border border-border/50 hover:shadow-sm transition-shadow">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            {lang === "ar" ? "جاهز للبدء؟" : "Ready to Get Started?"}
          </h2>
          <p className="text-muted-foreground mb-8">
            {lang === "ar"
              ? "انضم لآلاف الباحثين عن عمل وأصحاب العمل على منصة فُرصة اليوم — مجاناً تماماً."
              : "Join thousands of job seekers and employers on Fursa today — completely free."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/sign-up">{lang === "ar" ? "إنشاء حساب مجاني" : "Create Free Account"}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/jobs">{lang === "ar" ? "تصفّح الوظائف" : "Browse Jobs"}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
