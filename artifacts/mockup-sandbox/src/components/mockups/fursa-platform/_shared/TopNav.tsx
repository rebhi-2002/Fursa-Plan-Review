import { Bell, Search } from "lucide-react";

const userNames = {
  seeker: { en: "Omar Al-Shafi", ar: "عمر الشافي" },
  employer: { en: "Layla Hassan", ar: "ليلى حسن" },
};

export default function TopNav({ role = "seeker" }: { role?: "seeker" | "employer" }) {
  const user = userNames[role];
  return (
    <header className="h-16 border-b border-white/5 flex items-center px-6 gap-4 bg-[#0D1526]/50 backdrop-blur-sm shrink-0">
      <div className="flex-1 flex items-center gap-3 bg-white/5 rounded-xl px-4 py-2.5 max-w-md border border-white/5">
        <Search className="w-4 h-4 text-white/30" />
        <input
          className="flex-1 bg-transparent text-sm text-white/60 placeholder:text-white/30 outline-none"
          placeholder={role === "seeker" ? "Search jobs… ابحث عن وظائف" : "Search candidates…"}
          readOnly
        />
      </div>
      <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5">
        <Bell className="w-4 h-4 text-white/60" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FBBF24]" />
      </button>
      <div className="flex items-center gap-3 pl-3 border-l border-white/10">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1D4ED8] to-[#6366F1] flex items-center justify-center text-xs font-bold text-white">
          {user.en[0]}
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-white/90">{user.en}</div>
          <div className="text-[11px] text-white/40" style={{ fontFamily: "'Cairo', sans-serif" }}>{user.ar}</div>
        </div>
      </div>
    </header>
  );
}
