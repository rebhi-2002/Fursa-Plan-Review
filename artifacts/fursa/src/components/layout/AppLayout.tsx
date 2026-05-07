import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { RoleNav } from "./RoleNav";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="print:hidden"><Header /></div>
      <div className="print:hidden"><RoleNav /></div>
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>
      <div className="print:hidden"><Footer /></div>
    </div>
  );
}
