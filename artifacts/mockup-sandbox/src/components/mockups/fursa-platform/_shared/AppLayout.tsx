import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

export function AppLayout({ children, role = "seeker" }: { children: ReactNode; role?: "seeker" | "employer" }) {
  return (
    <div className="flex h-screen bg-[#0F172A] text-white overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav role={role} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
