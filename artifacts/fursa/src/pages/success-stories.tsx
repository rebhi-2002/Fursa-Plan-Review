import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { useT, useLanguageStore } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, Star, Users, Briefcase, TrendingUp } from "lucide-react";

function getInitials(name: string) {
  return name.split(" ").map(w => w[0] ?? "").slice(0, 2).join("").toUpperCase();
}

const AVATAR_COLORS = [
  ["#3730a3", "#eef2ff"],
  ["#0f766e", "#f0fdfa"],
  ["#be123c", "#fff1f2"],
  ["#15803d", "#f0fdf4"],
  ["#1d4ed8", "#eff6ff"],
  ["#92400e", "#fffbeb"],
];

function InitialsAvatar({ name, idx }: { name: string; idx: number }) {
  const [bg, fg] = AVATAR_COLORS[idx % AVATAR_COLORS.length]!;
  return (
    <div
      className="h-11 w-11 rounded-full border-2 border-primary/20 shrink-0 flex items-center justify-center text-sm font-bold"
      style={{ background: bg, color: fg }}
    >
      {getInitials(name)}
    </div>
  );
}

export default function SuccessStoriesPage() {
  const { lang } = useLanguageStore();

  const stories = [
    {
      name: lang === "ar" ? "أحمد محمود" : "Ahmed Mahmoud",
      role: lang === "ar" ? "مطوّر واجهة أمامية" : "Frontend Developer",
      company: lang === "ar" ? "شركة التقنية الرقمية" : "Digital Tech Co.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
      quote: lang === "ar"
        ? "وجدت وظيفتي الحلم بعد أسبوعين فقط من التسجيل في فُرصة. المنصة سهّلت عليّ التقديم والتواصل مع صاحب العمل بشكل احترافي."
        : "I found my dream job just two weeks after registering on Fursa. The platform made it easy to apply and communicate professionally.",
      category: lang === "ar" ? "تقنية المعلومات" : "Information Technology",
      time: lang === "ar" ? "وُظِّف خلال أسبوعين" : "Hired within 2 weeks",
    },
    {
      name: lang === "ar" ? "سارة عبد الله" : "Sara Abdullah",
      role: lang === "ar" ? "مصممة جرافيك" : "Graphic Designer",
      company: lang === "ar" ? "وكالة الإبداع" : "Creative Agency",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
      quote: lang === "ar"
        ? "كنت أبحث عن فرصة عمل عن بُعد تناسب مهاراتي. فُرصة ساعدتني في بناء سيرة ذاتية احترافية والتقديم بثقة."
        : "I was looking for a remote work opportunity matching my skills. Fursa helped me build a professional CV and apply with confidence.",
      category: lang === "ar" ? "التصميم الإبداعي" : "Creative Design",
      time: lang === "ar" ? "عمل عن بُعد" : "Remote work",
    },
    {
      name: lang === "ar" ? "محمد الشريف" : "Mohammed Al-Sharif",
      role: lang === "ar" ? "مشرف مشاريع" : "Project Manager",
      company: lang === "ar" ? "مؤسسة البناء والتطوير" : "Development Foundation",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
      quote: lang === "ar"
        ? "المنصة شفافة ومنظمة. استطعت متابعة حالة طلباتي لحظة بلحظة، وتلقيت رد واضح وسريع من أصحاب العمل."
        : "The platform is transparent and organized. I could track my application status in real time and received clear, quick responses.",
      category: lang === "ar" ? "إدارة المشاريع" : "Project Management",
      time: lang === "ar" ? "وُظِّف خلال شهر" : "Hired within a month",
    },
    {
      name: lang === "ar" ? "رنا حسن" : "Rana Hassan",
      role: lang === "ar" ? "أخصائية موارد بشرية" : "HR Specialist",
      company: lang === "ar" ? "شركة الاتصالات المتقدمة" : "Advanced Telecom",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
      quote: lang === "ar"
        ? "نظام تنبيهات الوظائف في فُرصة كان رائعاً — كنت أصل الوظائف المناسبة لي مباشرة دون حاجة للبحث اليومي."
        : "The job alerts system was excellent — I received matching jobs directly without daily manual searching.",
      category: lang === "ar" ? "الموارد البشرية" : "Human Resources",
      time: lang === "ar" ? "وُظِّفت خلال 3 أسابيع" : "Hired in 3 weeks",
    },
    {
      name: lang === "ar" ? "يوسف قاسم" : "Yousef Qasem",
      role: lang === "ar" ? "مدير تسويق رقمي" : "Digital Marketing Manager",
      company: lang === "ar" ? "متجر الإبداع الإلكتروني" : "Creative E-Store",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
      quote: lang === "ar"
        ? "استخدمت محرر السيرة الذاتية وكان ممتازاً — نتيجة احترافية جاهزة للطباعة بدون أي تصميم خارجي."
        : "I used the CV builder and it was excellent — a professional result ready to print without any external design tool.",
      category: lang === "ar" ? "التسويق الرقمي" : "Digital Marketing",
      time: lang === "ar" ? "عمل هجين" : "Hybrid work",
    },
    {
      name: lang === "ar" ? "نور الدين عمر" : "Noureddine Omar",
      role: lang === "ar" ? "مطوّر تطبيقات جوال" : "Mobile App Developer",
      company: lang === "ar" ? "شركة التطبيقات الذكية" : "Smart Apps Inc.",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80",
      quote: lang === "ar"
        ? "أجريت مقابلات مع 3 شركات خلال أسبوع واحد عبر فُرصة. المنصة توفر وقتاً كبيراً مقارنة بالطرق التقليدية."
        : "I had interviews with 3 companies in one week through Fursa. The platform saves huge time compared to traditional methods.",
      category: lang === "ar" ? "تطوير التطبيقات" : "App Development",
      time: lang === "ar" ? "وُظِّف خلال أسبوع" : "Hired within a week",
    },
  ];

  const stats = [
    { icon: Users, value: "500+", label: lang === "ar" ? "باحث عن عمل" : "Job Seekers", color: "text-blue-600", bg: "bg-blue-50" },
    { icon: Briefcase, value: "150+", label: lang === "ar" ? "وظيفة نشطة" : "Active Jobs", color: "text-emerald-600", bg: "bg-emerald-50" },
    { icon: TrendingUp, value: "80%", label: lang === "ar" ? "نسبة التوظيف الناجح" : "Successful Hiring Rate", color: "text-violet-600", bg: "bg-violet-50" },
    { icon: Star, value: "4.8/5", label: lang === "ar" ? "تقييم المستخدمين" : "User Rating", color: "text-amber-600", bg: "bg-amber-50" },
  ];

  const title = lang === "ar" ? "قصص نجاح" : "Success Stories";
  const desc = lang === "ar"
    ? "تعرّف على من وجدوا فرص عملهم عبر منصة فُرصة"
    : "Meet those who found their job opportunities through the Fursa platform";

  return (
    <div className="flex flex-col w-full">
      <Helmet>
        <title>{title} — {lang === "ar" ? "فُرصة" : "Fursa"}</title>
        <meta name="description" content={desc} />
      </Helmet>

      {/* Hero */}
      <section className="relative h-72 md:h-96 overflow-hidden">
        <img
          src="/img/success-stories-hero.png"
          alt={lang === "ar" ? "قصص نجاح من غزة" : "Success stories from Gaza"}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/50 to-transparent flex flex-col items-center justify-end text-center pb-10 px-4">
          <Badge className="mb-3 bg-white/20 text-white border-white/30 text-sm px-4 py-1">
            {lang === "ar" ? "قصص حقيقية من غزة" : "Real Stories from Gaza"}
          </Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2">{title}</h1>
          <p className="text-lg text-white/80 max-w-xl">{desc}</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-muted/20 border-b">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((s, i) => (
              <div key={i} className="text-center p-5 rounded-2xl bg-card border">
                <div className={`h-10 w-10 rounded-full ${s.bg} flex items-center justify-center mx-auto mb-2`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stories grid */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story, i) => (
              <Card key={i} className="border hover:shadow-lg transition-shadow flex flex-col">
                <CardContent className="p-6 flex flex-col h-full">
                  <Quote className="h-6 w-6 text-primary/30 mb-3 shrink-0" />
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5">
                    &ldquo;{story.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 mt-auto pt-4 border-t">
                    <InitialsAvatar name={story.name} idx={i} />
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate">{story.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{story.role}</p>
                      <p className="text-xs text-primary font-medium truncate">{story.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <Badge variant="secondary" className="text-xs">{story.category}</Badge>
                    <Badge variant="outline" className="text-xs text-emerald-700 border-emerald-200 bg-emerald-50">{story.time}</Badge>
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
          <h2 className="text-3xl font-bold mb-4">
            {lang === "ar" ? "اكتب قصة نجاحك القادمة" : "Write Your Next Success Story"}
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto mb-8">
            {lang === "ar"
              ? "انضم إلى آلاف الباحثين عن عمل الذين وجدوا فرصتهم عبر فُرصة"
              : "Join thousands of job seekers who found their opportunity through Fursa"}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" variant="secondary" className="font-bold text-primary">
              <Link href="/sign-up">
                {lang === "ar" ? "ابدأ الآن مجاناً" : "Start for Free Now"}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link href="/jobs">{lang === "ar" ? "تصفح الوظائف" : "Browse Jobs"}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
