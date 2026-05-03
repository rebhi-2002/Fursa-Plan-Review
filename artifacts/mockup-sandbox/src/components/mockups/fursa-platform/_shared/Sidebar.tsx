import { Briefcase, LayoutDashboard, FileText, User, Bell, Settings, LogOut, Building2 } from "lucide-react";

const seekerNav = [
  { icon: LayoutDashboard, label: "Dashboard", label_ar: "لوحة التحكم", active: true },
  { icon: Briefcase,       label: "Jobs",       label_ar: "الوظائف" },
  { icon: FileText,        label: "Applications", label_ar: "طلباتي" },
  { icon: User,            label: "Profile",    label_ar: "ملفي" },
  { icon: Bell,            label: "Alerts",     label_ar: "التنبيهات" },
];

const employerNav = [
  { icon: LayoutDashboard, label: "Dashboard",  label_ar: "لوحة التحكم", active: true },
  { icon: Building2,       label: "My Jobs",    label_ar: "وظائفي" },
  { icon: FileText,        label: "Candidates", label_ar: "المتقدمون" },
  { icon: User,            label: "Company",    label_ar: "شركتي" },
  { icon: Settings,        label: "Settings",   label_ar: "الإعدادات" },
];

export default function Sidebar({ role = "seeker" }: { role?: "seeker" | "employer" }) {
  const nav = role === "employer" ? employerNav : seekerNav;
  return (
    <aside className="w-64 flex flex-col bg-[#0D1526] border-r border-white/5 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-base" style={{ fontFamily: "'Cairo', sans-serif" }}>ف</span>
        </div>
        <div>
          <div className="text-white font-semibold text-base tracking-wide" style={{ fontFamily: "'Cairo', sans-serif" }}>فُرصة</div>
          <div className="text-white/40 text-[10px] uppercase tracking-wider">Fursa Platform</div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(({ icon: Icon, label, label_ar, active }) => (
          <button
            key={label}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
              active
                ? "bg-[#1D4ED8]/20 text-[#60A5FA] border border-[#1D4ED8]/30"
                : "text-white/50 hover:text-white/80 hover:bg-white/5"
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="flex-1 text-left">{label}</span>
            <span className="text-[11px] text-white/30" style={{ fontFamily: "'Cairo', sans-serif" }}>{label_ar}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 border-t border-white/5 pt-4">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-all">
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
