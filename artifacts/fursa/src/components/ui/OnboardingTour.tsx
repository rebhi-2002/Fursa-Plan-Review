import { useState, useEffect } from "react";
import { useLanguageStore } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  BellRing,
  BarChart2,
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from "lucide-react";

const TOUR_KEY_SEEKER = "fursa_tour_done_seeker_v1";
const TOUR_KEY_EMPLOYER = "fursa_tour_done_employer_v1";

type Step = {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
};

const seekerSteps: Step[] = [
  {
    icon: LayoutDashboard,
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-50 dark:bg-indigo-950/30",
    titleAr: "مرحباً في لوحة التحكم",
    titleEn: "Welcome to Your Dashboard",
    descAr: "لوحة التحكم تعطيك نظرة سريعة على طلباتك وتوصياتك والوظائف المحفوظة. ابدأ من هنا دائماً.",
    descEn: "Your dashboard gives you a quick overview of your applications, recommendations, and saved jobs. Always start here.",
  },
  {
    icon: Briefcase,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50 dark:bg-emerald-950/30",
    titleAr: "تصفح الوظائف",
    titleEn: "Browse Jobs",
    descAr: "ابحث عن وظائف حسب التصنيف والنوع. استخدم الفلاتر للعثور على الوظيفة المناسبة لك بسرعة.",
    descEn: "Search jobs by category and type. Use filters to quickly find the right opportunity for you.",
  },
  {
    icon: BellRing,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50 dark:bg-amber-950/30",
    titleAr: "تنبيهات الوظائف",
    titleEn: "Job Alerts",
    descAr: "أعدّ تنبيهات لتصلك وظائف جديدة تطابق اهتماماتك فور نشرها. لا تفوّت أي فرصة.",
    descEn: "Set up alerts to receive new jobs matching your interests the moment they're posted. Never miss an opportunity.",
  },
  {
    icon: FileText,
    iconColor: "text-violet-600",
    iconBg: "bg-violet-50 dark:bg-violet-950/30",
    titleAr: "بنّاء السيرة الذاتية",
    titleEn: "CV Builder",
    descAr: "أنشئ سيرتك الذاتية باحتراف. سيرة ذاتية مكتملة تزيد فرصك في القبول بشكل كبير.",
    descEn: "Build your CV professionally. A complete profile significantly increases your chances of acceptance.",
  },
  {
    icon: MessageSquare,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50 dark:bg-blue-950/30",
    titleAr: "الرسائل المباشرة",
    titleEn: "Direct Messages",
    descAr: "تواصل مباشرة مع أصحاب العمل عبر نظام الرسائل الداخلي. سريع وآمن.",
    descEn: "Communicate directly with employers through the internal messaging system. Fast and secure.",
  },
];

const employerSteps: Step[] = [
  {
    icon: LayoutDashboard,
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-50 dark:bg-indigo-950/30",
    titleAr: "لوحة تحكم صاحب العمل",
    titleEn: "Employer Dashboard",
    descAr: "تتبع وظائفك وطلباتك الواردة وأحدث المرشحين من مكان واحد. كل شيء في لمحة.",
    descEn: "Track your jobs, incoming applications, and latest candidates from one place. Everything at a glance.",
  },
  {
    icon: Briefcase,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50 dark:bg-emerald-950/30",
    titleAr: "نشر وظيفة جديدة",
    titleEn: "Post a New Job",
    descAr: "انشر وظيفتك في دقائق. أضف التفاصيل والمتطلبات ونطاق الراتب لجذب المرشحين المناسبين.",
    descEn: "Post your job in minutes. Add details, requirements, and salary range to attract the right candidates.",
  },
  {
    icon: FileText,
    iconColor: "text-violet-600",
    iconBg: "bg-violet-50 dark:bg-violet-950/30",
    titleAr: "مراجعة الطلبات",
    titleEn: "Review Applications",
    descAr: "راجع طلبات المرشحين، اطلع على سيرهم الذاتية، وقرر القبول أو الرفض مع إشعار فوري للمتقدمين.",
    descEn: "Review candidate applications, view their CVs, and decide to accept or reject with instant notification.",
  },
  {
    icon: BarChart2,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50 dark:bg-amber-950/30",
    titleAr: "لوحة التحليلات",
    titleEn: "Analytics Dashboard",
    descAr: "تحقق من أداء وظائفك، اتجاهات الطلبات أسبوعياً، ومعايير الرواتب مقارنةً بالسوق.",
    descEn: "Check your job performance, weekly application trends, and salary benchmarks vs the market.",
  },
  {
    icon: MessageSquare,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50 dark:bg-blue-950/30",
    titleAr: "التواصل مع المرشحين",
    titleEn: "Connect with Candidates",
    descAr: "أرسل رسائل مباشرة للمرشحين وادعوهم للتقديم على وظائفك. ابنِ فريقك بكل سهولة.",
    descEn: "Send direct messages to candidates and invite them to apply for your jobs. Build your team effortlessly.",
  },
];

interface OnboardingTourProps {
  role: "seeker" | "employer";
}

export function OnboardingTour({ role }: OnboardingTourProps) {
  const { lang } = useLanguageStore();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  const storageKey = role === "seeker" ? TOUR_KEY_SEEKER : TOUR_KEY_EMPLOYER;
  const steps = role === "seeker" ? seekerSteps : employerSteps;

  useEffect(() => {
    const done = localStorage.getItem(storageKey);
    if (!done) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [storageKey]);

  const dismiss = () => {
    localStorage.setItem(storageKey, "1");
    setVisible(false);
  };

  const next = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      dismiss();
    }
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  if (!visible) return null;

  const current = steps[step]!;
  const Icon = current.icon;
  const isFirst = step === 0;
  const isLast = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={dismiss}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Tour card */}
      <div
        className="relative z-10 w-full max-w-md bg-background rounded-2xl shadow-2xl border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        {/* Header gradient bar */}
        <div className="h-1.5 bg-gradient-to-r from-primary via-indigo-500 to-emerald-500" />

        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute top-4 end-4 h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          aria-label="Close tour"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">
              {lang === "ar" ? "جولة تعريفية" : "Platform Tour"} · {step + 1}/{steps.length}
            </span>
          </div>

          {/* Icon */}
          <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center mb-5", current.iconBg)}>
            <Icon className={cn("h-7 w-7", current.iconColor)} />
          </div>

          {/* Content */}
          <h2 className="text-xl font-bold mb-2">
            {lang === "ar" ? current.titleAr : current.titleEn}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            {lang === "ar" ? current.descAr : current.descEn}
          </p>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5 mb-6">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === step ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-primary/30",
                )}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={dismiss}
              className="text-muted-foreground text-xs"
            >
              {lang === "ar" ? "تخطي الجولة" : "Skip Tour"}
            </Button>

            <div className="flex gap-2">
              {!isFirst && (
                <Button variant="outline" size="sm" onClick={prev} className="gap-1">
                  {lang === "ar" ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
                  {lang === "ar" ? "السابق" : "Back"}
                </Button>
              )}
              <Button size="sm" onClick={next} className="gap-1 min-w-[90px]">
                {isLast
                  ? (lang === "ar" ? "ابدأ الآن" : "Get Started")
                  : (lang === "ar" ? "التالي" : "Next")}
                {!isLast && (lang === "ar" ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />)}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
