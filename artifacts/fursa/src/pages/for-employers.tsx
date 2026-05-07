import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { useT, useLanguageStore } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2, Users, FileText, Search, Bell, CheckCircle2,
  Star, Shield, Zap, Clock, Globe, MessageSquare,
} from "lucide-react";

export default function ForEmployersPage() {
  const { lang } = useLanguageStore();

  const features = [
    {
      icon: Zap,
      title: lang === "ar" ? "نشر سريع للوظائف" : "Quick Job Posting",
      desc: lang === "ar"
        ? "انشر وظيفتك في دقائق مع إمكانية تحديد المتطلبات والمزايا والموعد النهائي"
        : "Post your job in minutes with ability to set requirements, benefits, and deadline",
    },
    {
      icon: Users,
      title: lang === "ar" ? "وصول لكفاءات محلية" : "Access to Local Talent",
      desc: lang === "ar"
        ? "تواصل مع مئات الباحثين عن عمل المؤهلين في غزة مباشرة"
        : "Connect directly with hundreds of qualified job seekers in Gaza",
    },
    {
      icon: Search,
      title: lang === "ar" ? "تصفية ذكية للطلبات" : "Smart Application Filtering",
      desc: lang === "ar"
        ? "راجع طلبات التوظيف مع إمكانية تصفية وترتيب المتقدمين بسهولة"
        : "Review applications with easy filtering and sorting of candidates",
    },
    {
      icon: MessageSquare,
      title: lang === "ar" ? "تواصل مباشر" : "Direct Communication",
      desc: lang === "ar"
        ? "راسل المتقدمين المناسبين مباشرة داخل المنصة بدون وسيط"
        : "Message suitable candidates directly within the platform without intermediaries",
    },
    {
      icon: Shield,
      title: lang === "ar" ? "إشراف إداري" : "Admin Oversight",
      desc: lang === "ar"
        ? "جميع الوظائف تمر بمراجعة إدارية قبل النشر لضمان بيئة موثوقة"
        : "All jobs go through admin review before publishing to ensure a trusted environment",
    },
    {
      icon: Star,
      title: lang === "ar" ? "سمعة الشركة" : "Company Reputation",
      desc: lang === "ar"
        ? "بنِ ملفاً احترافياً لشركتك واحصل على تقييمات من الموظفين السابقين"
        : "Build a professional company profile and receive reviews from previous employees",
    },
    {
      icon: Bell,
      title: lang === "ar" ? "إشعارات فورية" : "Instant Notifications",
      desc: lang === "ar"
        ? "تلقَّ إشعاراً فورياً بكل طلب توظيف جديد يصلك"
        : "Receive instant notification for every new job application",
    },
    {
      icon: Globe,
      title: lang === "ar" ? "منصة ثنائية اللغة" : "Bilingual Platform",
      desc: lang === "ar"
        ? "المنصة متاحة بالعربية والإنجليزية لضمان وصول أوسع"
        : "Platform available in Arabic and English for broader reach",
    },
  ];

  const steps = [
    {
      num: "01",
      icon: Building2,
      title: lang === "ar" ? "أنشئ حسابك" : "Create Account",
      desc: lang === "ar" ? "سجّل كصاحب عمل وأضف معلومات شركتك" : "Register as employer and add your company details",
    },
    {
      num: "02",
      icon: FileText,
      title: lang === "ar" ? "انشر وظيفتك" : "Post Your Job",
      desc: lang === "ar" ? "أضف تفاصيل الوظيفة وانتظر الموافقة الإدارية" : "Add job details and await admin approval",
    },
    {
      num: "03",
      icon: Users,
      title: lang === "ar" ? "استقبل الطلبات" : "Receive Applications",
      desc: lang === "ar" ? "راجع ملفات المتقدمين وسيرهم الذاتية" : "Review applicant profiles and resumes",
    },
    {
      num: "04",
      icon: CheckCircle2,
      title: lang === "ar" ? "وظّف الأنسب" : "Hire the Best Fit",
      desc: lang === "ar" ? "تواصل مع المرشح المناسب وأتمّ عملية التوظيف" : "Contact the right candidate and complete the hiring process",
    },
  ];

  const testimonials = [
    {
      name: lang === "ar" ? "شركة البرمجيات المتقدمة" : "Advanced Software Co.",
      person: lang === "ar" ? "محمد خليل — مدير الموارد البشرية" : "Mohammed Khalil — HR Manager",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80",
      text: lang === "ar"
        ? "وجدنا 4 مطورين مؤهلين خلال أسبوع واحد. العملية كانت سلسة وسريعة جداً."
        : "We found 4 qualified developers in one week. The process was smooth and very fast.",
    },
    {
      name: lang === "ar" ? "مؤسسة الإبداع الرقمي" : "Digital Creativity Foundation",
      person: lang === "ar" ? "ليلى صالح — المديرة التنفيذية" : "Layla Saleh — CEO",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80",
      text: lang === "ar"
        ? "فُرصة وفّرت علينا الكثير من الوقت. طلبات منظمة وملفات شخصية واضحة لكل متقدم."
        : "Fursa saved us a lot of time. Organized applications and clear profiles for each applicant.",
    },
  ];

  const title = lang === "ar" ? "لأصحاب العمل" : "For Employers";
  const desc = lang === "ar"
    ? "ابحث عن الكفاءات المناسبة في غزة وانشر وظائفك بسهولة احترافية"
    : "Find the right talent in Gaza and post jobs with professional ease";

  return (
    <div className="flex flex-col w-full">
      <Helmet>
        <title>{title} — {lang === "ar" ? "فُرصة" : "Fursa"}</title>
        <meta name="description" content={desc} />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary/90 to-slate-800 py-20 md:py-28">
        <img
          src="/img/for-employers-hero.png"
          alt={lang === "ar" ? "توظيف محترف" : "Professional hiring"}
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-white/15 text-white border-white/20 text-sm px-4 py-1">
              {lang === "ar" ? "مجاناً بالكامل" : "Completely Free"}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
              {lang === "ar"
                ? "وظّف أفضل الكفاءات في غزة"
                : "Hire the Best Talent in Gaza"}
            </h1>
            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              {lang === "ar"
                ? "منصة فُرصة تربطك بمئات الباحثين عن عمل المؤهلين. انشر وظيفتك مجاناً وابدأ باستقبال الطلبات خلال ساعات."
                : "Fursa platform connects you with hundreds of qualified job seekers. Post your job for free and start receiving applications within hours."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="font-bold h-12 px-8" variant="secondary">
                <Link href="/sign-up">
                  {lang === "ar" ? "ابدأ التوظيف مجاناً" : "Start Hiring for Free"}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 text-white bg-transparent hover:bg-white/10 h-12 px-8">
                <Link href="/docs">
                  {lang === "ar" ? "دليل الاستخدام" : "User Guide"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="py-8 bg-muted/30 border-y">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { v: "500+", l: lang === "ar" ? "باحث عن عمل مسجل" : "Registered Job Seekers" },
              { v: "50+", l: lang === "ar" ? "شركة موثوقة" : "Trusted Companies" },
              { v: "150+", l: lang === "ar" ? "وظيفة نُشرت" : "Jobs Posted" },
              { v: "مجاناً", l: lang === "ar" ? "نشر الوظائف" : "Job Posting" },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-2xl font-extrabold text-primary">{s.v}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works (steps) */}
      <section className="py-16 bg-background">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">
              {lang === "ar" ? "أربع خطوات بسيطة" : "Four Simple Steps"}
            </h2>
            <p className="text-muted-foreground">
              {lang === "ar" ? "من التسجيل إلى التوظيف في أسرع وقت" : "From registration to hiring in the shortest time"}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <div key={i} className="relative text-center">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <span className="text-4xl font-black text-primary/15 block leading-none mb-1">{step.num}</span>
                <h3 className="font-bold text-sm mb-2">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 ltr:right-0 rtl:left-0 ltr:translate-x-1/2 rtl:-translate-x-1/2 text-muted-foreground">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">
              {lang === "ar" ? "كل ما تحتاجه لتوظيف ناجح" : "Everything You Need for Successful Hiring"}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {features.map((f, i) => (
              <Card key={i} className="border hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-sm mb-1.5">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-background">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">
            {lang === "ar" ? "ماذا يقول أصحاب العمل" : "What Employers Say"}
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {testimonials.map((t, i) => (
              <Card key={i} className="border">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full border bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">{t.name.split(" ").map((w: string) => w[0] ?? "").slice(0, 2).join("").toUpperCase()}</div>
                    <div>
                      <p className="font-bold text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.person}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground text-center">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {lang === "ar" ? "ابدأ التوظيف اليوم — مجاناً" : "Start Hiring Today — For Free"}
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto mb-8">
            {lang === "ar"
              ? "لا حاجة لبطاقة ائتمان. انشر وظيفتك الأولى الآن وابدأ باستقبال الطلبات."
              : "No credit card needed. Post your first job now and start receiving applications."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" variant="secondary" className="font-bold text-primary h-12 px-8">
              <Link href="/sign-up">
                {lang === "ar" ? "إنشاء حساب مجاني" : "Create Free Account"}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 h-12 px-8">
              <Link href="/employers">
                {lang === "ar" ? "تصفح أصحاب العمل" : "Browse Employers"}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
