import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLanguageStore } from "@/lib/i18n";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  Briefcase,
  Building2,
  Shield,
  MessageSquare,
  FileText,
  Bell,
  UserPlus,
  ChevronRight,
  Mail,
  LifeBuoy,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

type FaqItem = {
  q: string;
  qAr: string;
  a: string;
  aAr: string;
};

type Category = {
  id: string;
  icon: React.ElementType;
  labelEn: string;
  labelAr: string;
  color: string;
  faqs: FaqItem[];
};

const categories: Category[] = [
  {
    id: "getting-started",
    icon: UserPlus,
    labelEn: "Getting Started",
    labelAr: "البداية",
    color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30",
    faqs: [
      {
        q: "How do I create an account on Fursa?",
        qAr: "كيف أنشئ حساباً على فُرصة؟",
        a: "Click 'Create Account' on the homepage, sign up with your email or Google account, then complete a quick onboarding to choose your role (Job Seeker or Employer).",
        aAr: "اضغط على 'إنشاء حساب' في الصفحة الرئيسية، سجّل بإيميلك أو حساب Google، ثم أكمل خطوات الإعداد السريع لاختيار دورك (باحث عن عمل أو صاحب عمل).",
      },
      {
        q: "Is Fursa free to use?",
        qAr: "هل استخدام فُرصة مجاني؟",
        a: "Yes, Fursa is completely free for job seekers. Employers can also post jobs and manage applications at no cost during the current phase.",
        aAr: "نعم، استخدام فُرصة مجاني تماماً للباحثين عن عمل. يمكن لأصحاب العمل أيضاً نشر الوظائف وإدارة الطلبات بدون أي تكلفة في المرحلة الحالية.",
      },
      {
        q: "Can I use Fursa on mobile?",
        qAr: "هل يمكنني استخدام فُرصة على الموبايل؟",
        a: "Absolutely. Fursa is fully responsive and works smoothly on all devices — phones, tablets, and desktops.",
        aAr: "بالتأكيد. فُرصة متوافقة تماماً مع جميع الأجهزة — هواتف، أجهزة لوحية، وحاسوب.",
      },
      {
        q: "What languages does Fursa support?",
        qAr: "ما اللغات التي تدعمها فُرصة؟",
        a: "Fursa supports both Arabic (RTL) and English. You can switch languages anytime from the header using the language toggle.",
        aAr: "فُرصة تدعم العربية (RTL) والإنجليزية. يمكنك التبديل بينهما في أي وقت من خلال زر اللغة في الرأس.",
      },
    ],
  },
  {
    id: "job-seekers",
    icon: Briefcase,
    labelEn: "For Job Seekers",
    labelAr: "للباحثين عن عمل",
    color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30",
    faqs: [
      {
        q: "How do I apply for a job?",
        qAr: "كيف أتقدم لوظيفة؟",
        a: "Browse jobs, open a job listing, and click 'Apply Now'. You can attach a cover letter and your CV. Your application is instantly sent to the employer.",
        aAr: "تصفح الوظائف، افتح إعلان الوظيفة، واضغط 'تقدم الآن'. يمكنك إرفاق خطاب تغطية وسيرتك الذاتية. طلبك يُرسل فوراً لصاحب العمل.",
      },
      {
        q: "How do I track my applications?",
        qAr: "كيف أتابع طلباتي؟",
        a: "Go to your dashboard to see all submitted applications with their current status: Pending, Accepted, or Rejected. You'll also get notifications on any status changes.",
        aAr: "اذهب للوحة التحكم لترى كل طلباتك المقدمة مع حالتها الحالية: قيد الانتظار، مقبول، أو مرفوض. ستتلقى إشعارات عند أي تغيير.",
      },
      {
        q: "How do job alerts work?",
        qAr: "كيف تعمل تنبيهات الوظائف؟",
        a: "Set up job alerts from your dashboard. Enter keywords and job category, and Fursa will notify you automatically whenever a matching job is posted.",
        aAr: "أعدّ تنبيهات من لوحة التحكم. أدخل الكلمات المفتاحية وتصنيف الوظيفة، وستُخطرك فُرصة تلقائياً عند نشر وظيفة مطابقة.",
      },
      {
        q: "Can I build my CV on Fursa?",
        qAr: "هل يمكنني بناء سيرتي الذاتية على فُرصة؟",
        a: "Yes! Use the CV Builder in your dashboard to create a professional resume. You can upload an existing CV or build one from scratch using our guided templates.",
        aAr: "نعم! استخدم بناء السيرة الذاتية في لوحة التحكم لإنشاء سيرة احترافية. يمكنك رفع سيرة موجودة أو بناء واحدة من الصفر بمساعدة قوالبنا.",
      },
      {
        q: "What if I receive a job invitation?",
        qAr: "ماذا يحدث إذا تلقيت دعوة وظيفية؟",
        a: "When an employer invites you to apply for a specific job, you'll see an invitation card on your dashboard with options to Accept or Decline. Accepting means you'll be shown to the employer as an interested candidate.",
        aAr: "عندما يدعوك صاحب عمل للتقديم على وظيفة محددة، ستجد بطاقة دعوة في لوحة التحكم مع خيار القبول أو الرفض. القبول يعني أنك ستظهر لصاحب العمل كمرشح مهتم.",
      },
    ],
  },
  {
    id: "employers",
    icon: Building2,
    labelEn: "For Employers",
    labelAr: "لأصحاب العمل",
    color: "bg-violet-50 text-violet-600 dark:bg-violet-950/30",
    faqs: [
      {
        q: "How do I post a job?",
        qAr: "كيف أنشر وظيفة؟",
        a: "From your employer dashboard, click 'Post New Job', fill in the job details (title, description, type, category, salary range), and submit. Jobs are reviewed by the admin team before going live.",
        aAr: "من لوحة تحكم صاحب العمل، اضغط 'نشر وظيفة جديدة'، أدخل تفاصيل الوظيفة (العنوان، الوصف، النوع، التصنيف، نطاق الراتب)، ثم أرسل. تُراجع الوظائف من قبل فريق الإدارة قبل النشر.",
      },
      {
        q: "How do I manage incoming applications?",
        qAr: "كيف أدير الطلبات الواردة؟",
        a: "Open any job from your jobs list to view all applications. You can accept, reject (with a note), or keep them pending. Applicants are notified automatically of your decision.",
        aAr: "افتح أي وظيفة من قائمة وظائفك لعرض كل الطلبات. يمكنك القبول، الرفض (مع ملاحظة)، أو الإبقاء على الانتظار. يُخطر المتقدمون تلقائياً بقرارك.",
      },
      {
        q: "What is the Invite Candidate feature?",
        qAr: "ما ميزة دعوة المرشحين؟",
        a: "You can proactively invite specific job seekers to apply for your job. Search by name or email, send a personal message, and the seeker receives a notification. This helps you reach the right talent faster.",
        aAr: "يمكنك دعوة باحثين محددين بشكل استباقي للتقدم على وظيفتك. ابحث بالاسم أو الإيميل، أرسل رسالة شخصية، ويتلقى الباحث إشعاراً. هذا يساعدك في الوصول للمواهب المناسبة بسرعة.",
      },
      {
        q: "What does archiving a job do?",
        qAr: "ماذا تعني أرشفة الوظيفة؟",
        a: "Archiving hides a job from the public listings without deleting it. All application history is fully preserved. You can restore an archived job at any time from the Archive tab.",
        aAr: "الأرشفة تخفي الوظيفة من القوائم العامة دون حذفها. يُحفظ كامل سجل الطلبات. يمكنك استعادة الوظيفة المؤرشفة في أي وقت من تبويب الأرشيف.",
      },
      {
        q: "How do I view analytics for my jobs?",
        qAr: "كيف أعرض تحليلات وظائفي؟",
        a: "Go to Analytics in your employer dashboard. You'll see weekly application trends, job performance metrics, conversion rates, and salary benchmarks compared to the market average.",
        aAr: "اذهب للتحليلات في لوحة تحكم صاحب العمل. ستجد اتجاهات الطلبات الأسبوعية، مقاييس أداء الوظائف، معدلات التحويل، ومعايير الرواتب مقارنةً بمتوسط السوق.",
      },
    ],
  },
  {
    id: "account",
    icon: Shield,
    labelEn: "Account & Privacy",
    labelAr: "الحساب والخصوصية",
    color: "bg-amber-50 text-amber-600 dark:bg-amber-950/30",
    faqs: [
      {
        q: "How do I change my password?",
        qAr: "كيف أغيّر كلمة المرور؟",
        a: "Go to your profile settings and click 'Manage Security'. This opens your Clerk account management where you can update your password and security settings.",
        aAr: "اذهب لإعدادات ملفك الشخصي واضغط 'إدارة الأمان'. يفتح هذا إدارة حساب Clerk حيث يمكنك تحديث كلمة المرور وإعدادات الأمان.",
      },
      {
        q: "How do I delete my account?",
        qAr: "كيف أحذف حسابي؟",
        a: "Account deletion is handled by our support team to ensure data safety. Contact us at support@fursa.ps and we'll process your request within 48 hours.",
        aAr: "يتم حذف الحساب من قبل فريق الدعم لضمان سلامة البيانات. تواصل معنا على support@fursa.ps وسنعالج طلبك خلال 48 ساعة.",
      },
      {
        q: "Is my data secure?",
        qAr: "هل بياناتي آمنة؟",
        a: "Yes. Fursa uses industry-standard encryption, secure authentication via Clerk, and all data is stored in encrypted databases. We never share your personal data with third parties.",
        aAr: "نعم. فُرصة تستخدم تشفيراً بمعايير الصناعة، مصادقة آمنة عبر Clerk، وجميع البيانات مخزنة في قواعد بيانات مشفرة. لا نشارك بياناتك الشخصية مع أطراف ثالثة.",
      },
    ],
  },
  {
    id: "messaging",
    icon: MessageSquare,
    labelEn: "Messaging",
    labelAr: "الرسائل",
    color: "bg-blue-50 text-blue-600 dark:bg-blue-950/30",
    faqs: [
      {
        q: "How does the messaging system work?",
        qAr: "كيف يعمل نظام الرسائل؟",
        a: "Fursa has a built-in direct messaging system. Both seekers and employers can initiate conversations. Messages are delivered in real-time and you get notifications for new messages.",
        aAr: "فُرصة لديها نظام مراسلة مباشر مدمج. يمكن للباحثين وأصحاب العمل بدء المحادثات. تُسلَّم الرسائل في الوقت الفعلي وتتلقى إشعارات عند الرسائل الجديدة.",
      },
      {
        q: "Can employers contact me directly?",
        qAr: "هل يمكن لأصحاب العمل التواصل معي مباشرة؟",
        a: "Yes. After you apply or are invited to a job, employers can send you direct messages through the platform. All communication stays within Fursa for privacy.",
        aAr: "نعم. بعد تقديمك أو دعوتك لوظيفة، يمكن لأصحاب العمل إرسال رسائل مباشرة عبر المنصة. كل التواصل يبقى داخل فُرصة للحفاظ على الخصوصية.",
      },
    ],
  },
];

export default function HelpCenter() {
  const { lang } = useLanguageStore();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const dir = lang === "ar" ? "rtl" : "ltr";

  const filteredCategories = categories.map((cat) => ({
    ...cat,
    faqs: cat.faqs.filter((faq) => {
      if (!search) return true;
      const q = lang === "ar" ? faq.qAr : faq.q;
      const a = lang === "ar" ? faq.aAr : faq.a;
      return q.toLowerCase().includes(search.toLowerCase()) || a.toLowerCase().includes(search.toLowerCase());
    }),
  })).filter((cat) => cat.faqs.length > 0);

  const displayCategories = activeCategory
    ? filteredCategories.filter((c) => c.id === activeCategory)
    : filteredCategories;

  return (
    <>
      <Helmet>
        <title>{lang === "ar" ? "مركز المساعدة | فُرصة" : "Help Center | Fursa"}</title>
        <meta name="description" content={lang === "ar" ? "إجابات على أسئلتك الشائعة حول منصة فُرصة" : "Answers to your common questions about Fursa"} />
      </Helmet>

      <div dir={dir} className="min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-indigo-50/30 dark:to-indigo-950/10 border-b border-border/40 py-16 px-4">
          <div className="container max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-5">
              <LifeBuoy className="h-4 w-4" />
              {lang === "ar" ? "مركز المساعدة" : "Help Center"}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              {lang === "ar" ? "كيف يمكننا مساعدتك؟" : "How can we help you?"}
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              {lang === "ar"
                ? "ابحث في قاعدة المعرفة أو تصفح الأسئلة الشائعة"
                : "Search our knowledge base or browse frequently asked questions"}
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute start-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setActiveCategory(null); }}
                placeholder={lang === "ar" ? "ابحث في الأسئلة الشائعة..." : "Search frequently asked questions..."}
                className="ps-12 h-12 text-base rounded-full shadow-sm bg-background"
              />
            </div>
          </div>
        </section>

        <div className="container max-w-5xl py-12 px-4">
          {/* Category filter pills */}
          {!search && (
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              <Button
                variant={activeCategory === null ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setActiveCategory(null)}
              >
                {lang === "ar" ? "الكل" : "All"}
              </Button>
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Button
                    key={cat.id}
                    variant={activeCategory === cat.id ? "default" : "outline"}
                    size="sm"
                    className="rounded-full gap-1.5"
                    onClick={() => setActiveCategory(cat.id === activeCategory ? null : cat.id)}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {lang === "ar" ? cat.labelAr : cat.labelEn}
                  </Button>
                );
              })}
            </div>
          )}

          {/* Quick links (when no search/filter) */}
          {!search && !activeCategory && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Card
                    key={cat.id}
                    className="border-border/50 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    <CardContent className="p-5 flex items-start gap-3">
                      <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", cat.color)}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">{lang === "ar" ? cat.labelAr : cat.labelEn}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {cat.faqs.length} {lang === "ar" ? "سؤال" : "questions"}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5 rtl:rotate-180" />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* FAQ Accordions */}
          {displayCategories.length > 0 ? (
            <div className="space-y-8">
              {displayCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div key={cat.id}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center", cat.color)}>
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <h2 className="text-lg font-bold">
                        {lang === "ar" ? cat.labelAr : cat.labelEn}
                      </h2>
                      <Badge variant="secondary" className="text-xs">
                        {cat.faqs.length} {lang === "ar" ? "سؤال" : "Q"}
                      </Badge>
                    </div>
                    <Accordion type="single" collapsible className="space-y-2">
                      {cat.faqs.map((faq, i) => (
                        <AccordionItem
                          key={i}
                          value={`${cat.id}-${i}`}
                          className="border border-border/50 rounded-xl px-4 data-[state=open]:border-primary/30 transition-colors"
                        >
                          <AccordionTrigger className="text-sm font-medium hover:no-underline py-4 text-start">
                            {lang === "ar" ? faq.qAr : faq.q}
                          </AccordionTrigger>
                          <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">
                            {lang === "ar" ? faq.aAr : faq.a}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">
                {lang === "ar" ? "لا توجد نتائج" : "No results found"}
              </h3>
              <p className="text-muted-foreground text-sm">
                {lang === "ar"
                  ? "جرّب كلمات مختلفة أو تواصل مع فريق الدعم"
                  : "Try different keywords or contact our support team"}
              </p>
            </div>
          )}

          {/* Contact CTA */}
          <div className="mt-16 rounded-2xl bg-gradient-to-br from-primary/5 to-indigo-50/50 dark:to-indigo-950/20 border border-primary/10 p-8 text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/10 mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">
              {lang === "ar" ? "لم تجد إجابتك؟" : "Didn't find your answer?"}
            </h3>
            <p className="text-muted-foreground mb-6 text-sm">
              {lang === "ar"
                ? "فريق الدعم متاح لمساعدتك في أي وقت"
                : "Our support team is available to help you anytime"}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link href="/contact">
                  <Mail className="h-4 w-4 mr-2 ms-2" />
                  {lang === "ar" ? "تواصل مع الدعم" : "Contact Support"}
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/docs">
                  <BookOpen className="h-4 w-4 mr-2 ms-2" />
                  {lang === "ar" ? "دليل الاستخدام" : "User Guide"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
