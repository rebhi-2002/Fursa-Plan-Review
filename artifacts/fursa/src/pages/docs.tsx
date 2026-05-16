import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useT, useLanguageStore } from "@/lib/i18n";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UserPlus,
  Search,
  FileText,
  Bookmark,
  BellRing,
  ScrollText,
  Building2,
  Plus,
  Users,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
  Bell,
  Upload,
  Star,
  Eye,
  Download,
  Settings,
  ArrowRight,
  ChevronRight,
  Zap,
  Globe,
  Lock,
  ClipboardList,
  Send,
  Sparkles,
  Shield,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

type StepItem = {
  icon: React.ElementType;
  title: string;
  desc: string;
  badge?: string;
};

function StepCard({ step, index, color }: { step: StepItem; index: number; color: string }) {
  return (
    <div className="flex gap-4 items-start">
      <div className={cn("flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm", color)}>
        {index + 1}
      </div>
      <div className="flex-1 pb-6 border-b border-border/50 last:border-0">
        <div className="flex items-center gap-2 mb-1">
          <step.icon className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">{step.title}</h3>
          {step.badge && (
            <Badge variant="secondary" className="text-xs">{step.badge}</Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, color }: { icon: React.ElementType; title: string; desc: string; color: string }) {
  return (
    <Card className="border border-border/60 hover:border-primary/30 transition-colors">
      <CardContent className="p-4 flex gap-3 items-start">
        <div className={cn("flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center", color)}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h4 className="font-semibold text-sm text-foreground mb-0.5">{title}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DocsPage() {
  const { lang } = useLanguageStore();
  const isAr = lang === "ar";

  const seekerSteps: StepItem[] = isAr
    ? [
        { icon: UserPlus, title: "إنشاء حساب", desc: "اضغط على 'إنشاء حساب' واختر دور 'باحث عن عمل'. أكمل استمارة Clerk بالبريد الإلكتروني أو Google.", badge: "دقيقتان" },
        { icon: Settings, title: "استكمال ملفك الشخصي", desc: "بعد التسجيل ستُحوَّل إلى صفحة التأهيل. أضف اسمك وموقعك ونبذة عنك لزيادة فرص القبول." },
        { icon: Search, title: "البحث عن وظائف", desc: "انتقل إلى صفحة 'الوظائف' وابحث بالكلمة المفتاحية أو صنّف حسب النوع (عن بعد / ميداني / هجين). يمكنك الترتيب حسب الأحدث أو الموعد النهائي." },
        { icon: FileText, title: "التقديم على وظيفة", desc: "افتح تفاصيل الوظيفة واضغط 'تقدم الآن'. ارفع سيرتك الذاتية (PDF) وأضف رسالة تغطية اختيارية. يمكن تعديلها لاحقاً." },
        { icon: Bookmark, title: "حفظ الوظائف", desc: "اضغط أيقونة الإشارة المرجعية في أي وظيفة لحفظها. راجع وظائفك المحفوظة من لوحة التحكم أو القائمة." },
        { icon: BellRing, title: "تنبيهات الوظائف", desc: "في صفحة 'تنبيهات الوظائف' حدد الأصناف والأنواع التي تريد تنبيهات لها. ستصلك إشعارات فورية وبريد إلكتروني عند نشر وظيفة مطابقة.", badge: "جديد" },
        { icon: ScrollText, title: "منشئ السيرة الذاتية", desc: "استخدم أداة 'CV Builder' لإنشاء سيرة ذاتية احترافية. يمكنك رفعها مباشرة عند التقديم." },
        { icon: MessageSquare, title: "التواصل مع أصحاب العمل", desc: "عند قبول طلبك سيتواصل معك صاحب العمل عبر الرسائل. يمكنك أيضاً بدء المحادثة من لوحة التحكم." },
      ]
    : [
        { icon: UserPlus, title: "Create an account", desc: "Click 'Sign Up' and choose the 'Job Seeker' role. Complete the Clerk form using email or Google.", badge: "2 min" },
        { icon: Settings, title: "Complete your profile", desc: "After registration you'll be redirected to onboarding. Add your name, location, and bio to increase your chances of being noticed." },
        { icon: Search, title: "Search for jobs", desc: "Go to the 'Jobs' page and search by keyword, or filter by type (online / field / hybrid). Sort by newest or deadline." },
        { icon: FileText, title: "Apply for a job", desc: "Open a job listing and click 'Apply Now'. Upload your CV (PDF) and optionally add a cover letter. You can edit it later." },
        { icon: Bookmark, title: "Save jobs", desc: "Click the bookmark icon on any job to save it. Access your saved jobs from the dashboard or the navigation menu." },
        { icon: BellRing, title: "Job alerts", desc: "In the 'Job Alerts' page, pick the categories and types you care about. You'll get instant in-app and email notifications when a matching job is posted.", badge: "New" },
        { icon: ScrollText, title: "CV Builder", desc: "Use the built-in CV Builder tool to create a professional resume. Upload it directly when applying for jobs." },
        { icon: MessageSquare, title: "Message employers", desc: "When your application is accepted, the employer will reach out via messages. You can also start a conversation from your dashboard." },
      ];

  const employerSteps: StepItem[] = isAr
    ? [
        { icon: UserPlus, title: "إنشاء حساب صاحب عمل", desc: "اختر 'صاحب عمل' عند التسجيل. بعد تأكيد بريدك ستُحوَّل إلى صفحة التأهيل لإعداد ملف شركتك." },
        { icon: Building2, title: "إعداد ملف الشركة", desc: "أضف اسم الشركة والموقع والوصف وموقع الويب. سيظهر ملفك العام لجميع الباحثين في صفحة 'أصحاب العمل'." },
        { icon: Plus, title: "نشر وظيفة", desc: "من لوحة التحكم اضغط 'نشر وظيفة جديدة'. أضف العنوان والوصف والمتطلبات والنوع والصنف. الوظيفة ستذهب للمراجعة أولاً." },
        { icon: Eye, title: "متابعة الوظائف", desc: "في صفحة 'وظائفي' تتبع حالة كل وظيفة: معلّقة / مقبولة / مرفوضة. يمكنك تعديل الوظيفة أو إغلاقها في أي وقت." },
        { icon: Users, title: "مراجعة الطلبات", desc: "عند قبول وظيفتك ستبدأ الطلبات بالوصول. راجع السيرة الذاتية والرسالة التعريفية، ثم اقبل أو ارفض مع إمكانية إضافة ملاحظة." },
        { icon: MessageSquare, title: "التواصل مع المتقدمين", desc: "عند قبول متقدم يمكنك التواصل معه مباشرة عبر نظام الرسائل. ستجد معلومات الاتصال في بطاقة الطلب." },
        { icon: Star, title: "التقييمات", desc: "يمكن للباحثين تقييم شركتك. الحافظ على تجربة تقديم إيجابية للحصول على تقييمات أعلى." },
      ]
    : [
        { icon: UserPlus, title: "Create an employer account", desc: "Choose 'Employer' during sign-up. After email verification you'll go through onboarding to set up your company profile." },
        { icon: Building2, title: "Set up your company profile", desc: "Add your company name, location, description, and website. Your public profile will appear to all seekers on the Employers page." },
        { icon: Plus, title: "Post a job", desc: "From your dashboard click 'Post New Job'. Fill in title, description, requirements, type, and category. The job goes to admin review first." },
        { icon: Eye, title: "Track your jobs", desc: "In 'My Jobs', track each listing's status: pending / approved / rejected. You can edit or close any job at any time." },
        { icon: Users, title: "Review applications", desc: "Once approved, applications start arriving. Review each CV and cover letter, then accept or reject with an optional note." },
        { icon: MessageSquare, title: "Message applicants", desc: "When you accept an applicant, you can message them directly via the messaging system. Contact info also appears on their application card." },
        { icon: Star, title: "Reviews", desc: "Seekers can leave reviews on your company profile. Maintain a positive experience to build a strong rating." },
      ];

  const adminSteps: StepItem[] = isAr
    ? [
        { icon: ShieldCheck, title: "الوصول للوحة الإدارة", desc: "يظهر زر 'لوحة الإدارة' في الهيدر بشكل مميز. المسؤول هو الدور الوحيد الذي يرى هذا الزر." },
        { icon: ClipboardList, title: "مراجعة الوظائف", desc: "في صفحة 'مراجعة الوظائف' تظهر الوظائف المعلّقة بالترتيب. اقرأ التفاصيل وافحص صاحب العمل ثم اقبل أو ارفض مع سبب الرفض." },
        { icon: Send, title: "الإشعارات التلقائية", desc: "عند الموافقة على وظيفة يُرسَل بريد إلكتروني تلقائياً لصاحب العمل وللباحثين المشتركين في تنبيهات مطابقة." },
        { icon: Users, title: "إدارة المستخدمين", desc: "في 'إدارة المستخدمين' يمكنك البحث وتغيير دور المستخدم أو تعطيل الحساب. يدعم البحث بالاسم أو البريد." },
        { icon: Download, title: "تصدير البيانات", desc: "من لوحة التحكم يمكنك تصدير بيانات المستخدمين والوظائف كملفات CSV بنقرة واحدة." },
        { icon: Zap, title: "الأحداث المباشرة", desc: "لوحة الإدارة تستقبل الأحداث في الوقت الفعلي عبر SSE: وظائف جديدة، طلبات جديدة، وظائف مقبولة/مرفوضة." },
      ]
    : [
        { icon: ShieldCheck, title: "Access admin panel", desc: "The 'Admin Panel' button appears prominently in the header. Only the admin role sees this button." },
        { icon: ClipboardList, title: "Review jobs", desc: "In 'Review Jobs', pending listings are shown in order. Read the details, check the employer, then approve or reject with a reason." },
        { icon: Send, title: "Automatic notifications", desc: "When a job is approved, emails are automatically sent to the employer and to seekers with matching job alerts." },
        { icon: Users, title: "Manage users", desc: "In 'Manage Users' you can search, change a user's role, or deactivate an account. Supports search by name or email." },
        { icon: Download, title: "Export data", desc: "From the dashboard, export user and job data as CSV files in one click." },
        { icon: Zap, title: "Live events", desc: "The admin dashboard receives real-time events via SSE: new jobs, new applications, approved/rejected jobs." },
      ];

  const platformFeatures = isAr
    ? [
        { icon: Globe, title: "ثنائي اللغة", desc: "كامل المنصة بالعربية والإنجليزية، مع دعم كامل لـ RTL.", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
        { icon: Bell, title: "إشعارات فورية", desc: "إشعارات SSE في الوقت الفعلي داخل التطبيق.", color: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400" },
        { icon: Lock, title: "آمن وموثوق", desc: "مصادقة Clerk، تحديد معدل الطلبات، تعقيم المدخلات.", color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
        { icon: Upload, title: "رفع الملفات", desc: "رفع السيرة الذاتية بصيغ PDF/DOC، بحد أقصى 15MB.", color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" },
        { icon: MessageSquare, title: "رسائل مباشرة", desc: "تواصل مباشر بين الباحثين وأصحاب العمل.", color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400" },
        { icon: Star, title: "نظام تقييمات", desc: "تقييم الشركات من قبل الباحثين.", color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
      ]
    : [
        { icon: Globe, title: "Bilingual", desc: "Full Arabic & English support with complete RTL layout.", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
        { icon: Bell, title: "Real-time notifications", desc: "Live SSE notifications inside the app.", color: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400" },
        { icon: Lock, title: "Secure & trusted", desc: "Clerk auth, rate limiting, and input sanitization.", color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
        { icon: Upload, title: "File uploads", desc: "Upload CV in PDF/DOC formats, up to 15MB.", color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" },
        { icon: MessageSquare, title: "Direct messaging", desc: "Built-in messaging between seekers and employers.", color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400" },
        { icon: Star, title: "Review system", desc: "Seekers can rate and review employer companies.", color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
      ];

  const platformDiff = isAr
    ? [
        { icon: Sparkles, title: "توصيات ذكية", desc: "الخوارزمية تقترح وظائف تناسب مهاراتك وخبرتك" },
        { icon: Shield, title: "خصوصية آمنة", desc: "بياناتك محمية ومشاركتها بيدك وحدك" },
        { icon: Clock, title: "إشعارات فورية", desc: "تنبيهات لحظية على كل تحديث في طلبك" },
        { icon: MessageSquare, title: "رسائل مباشرة", desc: "تواصل مباشر بين الباحث وصاحب العمل بدون وسيط" },
      ]
    : [
        { icon: Sparkles, title: "Smart Recommendations", desc: "Algorithm suggests jobs matching your skills and experience" },
        { icon: Shield, title: "Secure & Private", desc: "Your data is protected and sharing is your choice" },
        { icon: Clock, title: "Real-time Alerts", desc: "Instant notifications on every application update" },
        { icon: MessageSquare, title: "Direct Messaging", desc: "Direct communication between seekers and employers, no middleman" },
      ];

  return (
    <div className="flex flex-col">
      <Helmet>
        <title>{isAr ? "دليل الاستخدام — فُرصة" : "User Guide — Fursa"}</title>
        <meta name="description" content={isAr ? "دليل شامل لاستخدام منصة فُرصة" : "Complete guide to using the Fursa platform"} />
      </Helmet>

      {/* Full-width Hero — consistent with all other pages */}
      <div className="relative overflow-hidden h-56 md:h-72">
        <img
          src="/img/docs-hero.png"
          alt={isAr ? "دليل الاستخدام" : "User Guide"}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-transparent flex flex-col justify-center">
          <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
            <Badge className="mb-3 bg-white/20 text-white border-white/30 text-xs px-3 py-1 w-fit">
              {isAr ? "دليل المستخدم" : "User Guide"}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2">
              {isAr ? "كيف تستخدم منصة فُرصة؟" : "How to use Fursa?"}
            </h1>
            <p className="text-white/80 text-sm md:text-base max-w-md">
              {isAr
                ? "دليل خطوة بخطوة للباحثين عن عمل وأصحاب العمل والمسؤولين"
                : "A step-by-step guide for job seekers, employers, and admins"}
            </p>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="container py-10 max-w-5xl">

        {/* What Makes Fursa Different */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-1">
            {isAr ? "ما يجعل فُرصة مختلفة" : "What Makes Fursa Different"}
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            {isAr ? "مبنية خصيصاً لسوق العمل في غزة" : "Built specifically for the Gaza job market"}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {platformDiff.map((f) => (
              <div key={f.title} className="flex flex-col items-center text-center p-5 bg-muted/30 rounded-2xl border border-border/50 hover:shadow-sm transition-shadow">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Features */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-4">
            {isAr ? "✨ مميزات المنصة" : "✨ Platform features"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {platformFeatures.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>

      {/* Role Tabs */}
      <Tabs defaultValue="seeker" dir={isAr ? "rtl" : "ltr"}>
        <TabsList className="grid grid-cols-3 w-full mb-8">
          <TabsTrigger value="seeker" className="gap-2">
            <Search className="h-4 w-4" />
            {isAr ? "باحث عن عمل" : "Job Seeker"}
          </TabsTrigger>
          <TabsTrigger value="employer" className="gap-2">
            <Building2 className="h-4 w-4" />
            {isAr ? "صاحب عمل" : "Employer"}
          </TabsTrigger>
          <TabsTrigger value="admin" className="gap-2">
            <ShieldCheck className="h-4 w-4" />
            {isAr ? "مسؤول النظام" : "Admin"}
          </TabsTrigger>
        </TabsList>

        {/* Seeker Tab */}
        <TabsContent value="seeker">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Search className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                {isAr ? "دليل الباحث عن عمل" : "Job Seeker Guide"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              {seekerSteps.map((step, i) => (
                <StepCard key={i} step={step} index={i} color="bg-blue-600" />
              ))}
            </CardContent>
          </Card>
          <div className="mt-4 flex gap-3">
            <Button asChild>
              <Link href="/sign-up">{isAr ? "إنشاء حساب الآن" : "Create account now"}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/jobs">
                {isAr ? "تصفح الوظائف" : "Browse jobs"}
                <ChevronRight className="h-4 w-4 ms-1 rtl:rotate-180" />
              </Link>
            </Button>
          </div>
        </TabsContent>

        {/* Employer Tab */}
        <TabsContent value="employer">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                </div>
                {isAr ? "دليل صاحب العمل" : "Employer Guide"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              {employerSteps.map((step, i) => (
                <StepCard key={i} step={step} index={i} color="bg-violet-600" />
              ))}
            </CardContent>
          </Card>
          <div className="mt-4 flex gap-3">
            <Button asChild>
              <Link href="/sign-up">{isAr ? "سجّل كصاحب عمل" : "Register as employer"}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/employers">
                {isAr ? "أصحاب العمل" : "Employers page"}
                <ChevronRight className="h-4 w-4 ms-1 rtl:rotate-180" />
              </Link>
            </Button>
          </div>
        </TabsContent>

        {/* Admin Tab */}
        <TabsContent value="admin">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                {isAr ? "دليل مسؤول النظام" : "Admin Guide"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              {adminSteps.map((step, i) => (
                <StepCard key={i} step={step} index={i} color="bg-amber-600" />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Links */}
      <div className="mt-10 p-6 bg-primary/5 rounded-2xl border border-primary/10">
        <h2 className="text-lg font-bold text-foreground mb-4">
          {isAr ? "روابط سريعة" : "Quick links"}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { href: "/faq", label: isAr ? "الأسئلة الشائعة" : "FAQ" },
            { href: "/contact", label: isAr ? "تواصل معنا" : "Contact us" },
            { href: "/changelog", label: isAr ? "ما الجديد؟" : "What's New" },
            { href: "/privacy", label: isAr ? "سياسة الخصوصية" : "Privacy policy" },
          ].map((l) => (
            <Button key={l.href} variant="outline" size="sm" asChild className="justify-start gap-2">
              <Link href={l.href}>
                <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                {l.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  </div>
  );
}
