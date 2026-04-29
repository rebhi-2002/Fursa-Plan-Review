import { create } from "zustand";

type Language = "ar" | "en";

interface TranslationDictionary {
  [key: string]: string;
}

const ar: TranslationDictionary = {
  "app.name": "فُرصة",
  "app.description": "منصة التوظيف الرقمي في غزة",
  
  // Navigation
  "nav.home": "الرئيسية",
  "nav.jobs": "الوظائف",
  "nav.dashboard": "لوحة التحكم",
  "nav.signIn": "تسجيل الدخول",
  "nav.signUp": "إنشاء حساب",
  "nav.signOut": "تسجيل الخروج",

  // Generic
  "common.save": "حفظ",
  "common.cancel": "إلغاء",
  "common.loading": "جاري التحميل...",
  "common.error": "حدث خطأ",
  "common.notFound": "الصفحة غير موجودة",
  "common.backToHome": "العودة للرئيسية",
  
  // Job Board
  "jobs.title": "الوظائف المتاحة",
  "jobs.search": "ابحث عن وظيفة...",
  "jobs.type.all": "كل الأنواع",
  "jobs.type.online": "أونلاين",
  "jobs.type.field": "ميداني",
  "jobs.type.hybrid": "هجين",
  "jobs.category.all": "كل التصنيفات",
  "jobs.apply": "تقديم للوظيفة",
  "jobs.save": "حفظ الوظيفة",
  "jobs.unsave": "إلغاء الحفظ",
  "jobs.details": "تفاصيل",
  
  // Dashboard
  "dashboard.seeker.applications": "طلباتي",
  "dashboard.seeker.saved": "الوظائف المحفوظة",
  "dashboard.seeker.profile": "ملفي الشخصي",
  "dashboard.employer.jobs": "وظائفي",
  "dashboard.employer.newJob": "نشر وظيفة جديدة",
  "dashboard.admin.jobs": "مراجعة الوظائف",
  "dashboard.admin.users": "إدارة المستخدمين",

  // Application Status
  "status.pending": "قيد المراجعة",
  "status.accepted": "مقبول",
  "status.rejected": "مرفوض",
  "status.approved": "معتمد",
};

const en: TranslationDictionary = {
  "app.name": "Fursa",
  "app.description": "Digital Employment Platform in Gaza",
  
  "nav.home": "Home",
  "nav.jobs": "Jobs",
  "nav.dashboard": "Dashboard",
  "nav.signIn": "Sign In",
  "nav.signUp": "Sign Up",
  "nav.signOut": "Sign Out",

  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.loading": "Loading...",
  "common.error": "An error occurred",
  "common.notFound": "Page not found",
  "common.backToHome": "Back to Home",

  "jobs.title": "Available Jobs",
  "jobs.search": "Search jobs...",
  "jobs.type.all": "All Types",
  "jobs.type.online": "Online",
  "jobs.type.field": "Field",
  "jobs.type.hybrid": "Hybrid",
  "jobs.category.all": "All Categories",
  "jobs.apply": "Apply",
  "jobs.save": "Save Job",
  "jobs.unsave": "Unsave",
  "jobs.details": "Details",

  "dashboard.seeker.applications": "My Applications",
  "dashboard.seeker.saved": "Saved Jobs",
  "dashboard.seeker.profile": "My Profile",
  "dashboard.employer.jobs": "My Jobs",
  "dashboard.employer.newJob": "Post a Job",
  "dashboard.admin.jobs": "Review Jobs",
  "dashboard.admin.users": "Manage Users",

  "status.pending": "Pending",
  "status.accepted": "Accepted",
  "status.rejected": "Rejected",
  "status.approved": "Approved",
};

const dictionaries = { ar, en };

interface LanguageState {
  lang: Language;
  setLang: (lang: Language) => void;
}

const getInitialLanguage = (): Language => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("fursa-lang") as Language;
    if (saved === "ar" || saved === "en") return saved;
  }
  return "ar";
};

export const useLanguageStore = create<LanguageState>((set) => ({
  lang: getInitialLanguage(),
  setLang: (lang) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("fursa-lang", lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    }
    set({ lang });
  },
}));

export function useT() {
  const lang = useLanguageStore((state) => state.lang);
  
  return function t(key: string, defaultText?: string): string {
    return dictionaries[lang]?.[key] || defaultText || key;
  };
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const lang = useLanguageStore((state) => state.lang);
  
  if (typeof window !== "undefined") {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }
  
  return <>{children}</>;
}
