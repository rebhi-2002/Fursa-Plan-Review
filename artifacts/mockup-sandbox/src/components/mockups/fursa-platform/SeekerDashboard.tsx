import React from "react";
import { AppLayout } from "./_shared/AppLayout";
import { 
  Briefcase, 
  Eye, 
  Bookmark, 
  MessageSquare,
  TrendingUp,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle2,
  Circle,
  Activity,
  ArrowRight
} from "lucide-react";

export function SeekerDashboard() {
  return (
    <AppLayout role="seeker">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <span>Welcome back, Omar</span>
              <span className="text-slate-300">|</span>
              <span className="font-cairo text-2xl" dir="rtl">مرحباً بعودتك، عمر</span>
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Here's what's happening with your job search.</p>
          </div>
          <button className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm shadow-blue-700/20 transition-all flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            <span>Find Jobs</span>
            <span className="font-cairo">ابحث عن وظائف</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { en: "Applications Sent", ar: "الطلبات المرسلة", value: "12", icon: Briefcase, trend: "+2 this week", color: "blue" },
            { en: "Profile Views", ar: "مشاهدات الملف", value: "48", icon: Eye, trend: "+15% vs last week", color: "amber" },
            { en: "Saved Jobs", ar: "الوظائف المحفوظة", value: "7", icon: Bookmark, trend: "3 expiring soon", color: "slate" },
            { en: "Interviews", ar: "المقابلات", value: "2", icon: MessageSquare, trend: "1 upcoming", color: "emerald" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>{stat.trend}</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-600">{stat.en}</span>
                <span className="text-xs text-slate-400 font-cairo" dir="rtl">{stat.ar}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Application Pipeline */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Application Pipeline</h2>
                  <p className="text-sm text-slate-500 font-cairo" dir="rtl">مسار الطلبات</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full z-0"></div>
                
                {[
                  { label: "Applied", ar: "تم التقديم", value: 12, color: "bg-slate-500", text: "text-slate-500" },
                  { label: "Reviewed", ar: "تمت المراجعة", value: 5, color: "bg-blue-500", text: "text-blue-600" },
                  { label: "Interview", ar: "مقابلة", value: 2, color: "bg-amber-500", text: "text-amber-600" },
                  { label: "Offer", ar: "عرض", value: 0, color: "bg-emerald-500", text: "text-emerald-600" },
                ].map((step, i) => (
                  <div key={i} className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                    <div className={`w-10 h-10 rounded-full border-4 border-white ${step.color} text-white flex items-center justify-center font-bold text-sm shadow-sm`}>
                      {step.value}
                    </div>
                    <div className="text-center">
                      <div className={`text-sm font-semibold ${step.text}`}>{step.label}</div>
                      <div className="text-xs text-slate-400 font-cairo">{step.ar}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Jobs */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Recommended Jobs</h2>
                  <p className="text-sm text-slate-500 font-cairo" dir="rtl">وظائف مقترحة</p>
                </div>
                <button className="text-blue-700 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                  View all <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: "Frontend Developer",
                    company: "TechHub Gaza",
                    companyAr: "تك هاب غزة",
                    location: "Remote",
                    salary: "$1,200 - $1,800/mo",
                    tags: ["React", "TypeScript", "Full-time"],
                    logo: "from-blue-500 to-cyan-400"
                  },
                  {
                    title: "Digital Marketing Specialist",
                    company: "MenaReach",
                    companyAr: "مينا ريتش",
                    location: "Gaza City (Hybrid)",
                    salary: "$800 - $1,200/mo",
                    tags: ["SEO", "Content", "Contract"],
                    logo: "from-amber-400 to-orange-500"
                  },
                  {
                    title: "UI/UX Designer",
                    company: "Creative Solutions",
                    companyAr: "حلول إبداعية",
                    location: "Remote",
                    salary: "$1,000 - $1,500/mo",
                    tags: ["Figma", "Design Systems", "Freelance"],
                    logo: "from-indigo-500 to-purple-500"
                  }
                ].map((job, i) => (
                  <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${job.logo} flex-shrink-0 shadow-inner flex items-center justify-center text-white font-bold text-xl`}>
                        {job.company.charAt(0)}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-700 transition-colors">{job.title}</h3>
                            <div className="flex items-center text-sm text-slate-500 gap-2 mt-1">
                              <span className="font-medium text-slate-700">{job.company}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <span className="font-cairo" dir="rtl">{job.companyAr}</span>
                            </div>
                          </div>
                          <button className="hidden sm:block border border-slate-200 hover:border-blue-700 hover:text-blue-700 text-slate-600 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
                            Apply
                          </button>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 mt-4 text-xs font-medium">
                          <div className="flex items-center text-slate-600 gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                            <MapPin className="w-3.5 h-3.5" />
                            {job.location}
                          </div>
                          <div className="flex items-center text-slate-600 gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                            <DollarSign className="w-3.5 h-3.5" />
                            {job.salary}
                          </div>
                          <div className="flex gap-2 ml-auto">
                            {job.tags.map(tag => (
                              <span key={tag} className="text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            
            {/* Profile Completion */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-bl-full -z-0"></div>
              
              <h2 className="text-lg font-bold text-slate-900 relative z-10">Profile Completion</h2>
              <p className="text-sm text-slate-500 font-cairo mb-6 relative z-10" dir="rtl">اكتمال الملف الشخصي</p>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="relative w-20 h-20 flex-shrink-0">
                  {/* SVG Circle Progress */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" className="stroke-slate-100" strokeWidth="8" fill="none" />
                    <circle 
                      cx="50" cy="50" r="40" 
                      className="stroke-amber-400" 
                      strokeWidth="8" fill="none" 
                      strokeDasharray="251.2" 
                      strokeDashoffset="62.8" // 251.2 * (1 - 0.75)
                      strokeLinecap="round" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-xl font-bold text-slate-900">75%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-1">Almost there, Omar!</p>
                  <p className="text-xs text-slate-500">Complete your profile to stand out to employers.</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Add Education & Experience", ar: "إضافة التعليم والخبرة", done: true },
                  { label: "Upload Resume (CV)", ar: "رفع السيرة الذاتية", done: true },
                  { label: "Add Profile Photo", ar: "إضافة صورة شخصية", done: true },
                  { label: "Add Skills & Endorsements", ar: "إضافة المهارات والتوصيات", done: false },
                  { label: "Add Portfolio Links", ar: "إضافة روابط معرض الأعمال", done: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    {item.done ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 flex-shrink-0" />
                    )}
                    <div>
                      <div className={`text-sm font-medium ${item.done ? 'text-slate-800' : 'text-slate-500'}`}>
                        {item.label}
                      </div>
                      <div className="text-xs text-slate-400 font-cairo" dir="rtl">{item.ar}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
              <p className="text-sm text-slate-500 font-cairo mb-6" dir="rtl">النشاط الأخير</p>
              
              <div className="relative pl-6 border-l-2 border-slate-100 space-y-6">
                {[
                  {
                    title: "Application viewed",
                    desc: "MenaReach viewed your application for Digital Marketing Specialist",
                    time: "2 hours ago",
                    icon: Eye,
                    color: "text-blue-500",
                    bg: "bg-blue-100"
                  },
                  {
                    title: "Applied for job",
                    desc: "Frontend Developer at TechHub Gaza",
                    time: "1 day ago",
                    icon: Briefcase,
                    color: "text-slate-600",
                    bg: "bg-slate-100"
                  },
                  {
                    title: "Profile updated",
                    desc: "Added React and TypeScript to skills",
                    time: "2 days ago",
                    icon: Activity,
                    color: "text-amber-500",
                    bg: "bg-amber-100"
                  },
                  {
                    title: "Job saved",
                    desc: "UI/UX Designer at Creative Solutions",
                    time: "3 days ago",
                    icon: Bookmark,
                    color: "text-slate-600",
                    bg: "bg-slate-100"
                  }
                ].map((activity, i) => (
                  <div key={i} className="relative">
                    <div className={`absolute -left-[35px] top-0 w-8 h-8 rounded-full ${activity.bg} flex items-center justify-center border-4 border-white shadow-sm`}>
                      <activity.icon className={`w-3.5 h-3.5 ${activity.color}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{activity.title}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{activity.desc}</p>
                      <span className="text-[11px] font-medium text-slate-400 mt-1 block flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activity.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-6 py-2 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                View all activity
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
