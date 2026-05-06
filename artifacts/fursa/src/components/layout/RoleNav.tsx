import { Link, useLocation } from "wouter";
import { useGetCurrentUser } from "@workspace/api-client-react";
import { useT, useLanguageStore } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Bookmark,
  BellRing,
  ScrollText,
  User as UserIcon,
  Briefcase,
  Plus,
  Building2,
  ShieldCheck,
  Users,
  MessageSquare,
  Bell,
  Activity,
  BarChart2,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
};

export function RoleNav() {
  const t = useT();
  const { lang } = useLanguageStore();
  const { data: dbUser } = useGetCurrentUser();
  const [location] = useLocation();

  if (!dbUser?.role || !dbUser.onboarded) return null;

  const role = dbUser.role;

  const isActive = (href: string, exact = false) => {
    if (exact) return location === href;
    return location === href || location.startsWith(href + "/");
  };

  const commonItems: NavItem[] = [
    { href: `/${role}`, label: t("nav.dashboard"), icon: LayoutDashboard, exact: true },
  ];

  const roleItems: NavItem[] =
    role === "seeker"
      ? [
          { href: "/seeker/applications", label: t("dashboard.seeker.applications"), icon: FileText },
          { href: "/seeker/saved", label: t("dashboard.seeker.saved"), icon: Bookmark },
          { href: "/seeker/alerts", label: t("dashboard.seeker.alerts"), icon: BellRing },
          { href: "/seeker/cv-builder", label: t("dashboard.seeker.cvBuilder"), icon: ScrollText },
          { href: "/seeker/activity", label: t("dashboard.seeker.activity"), icon: Activity },
          { href: "/seeker/profile", label: t("dashboard.seeker.profile"), icon: UserIcon },
        ]
      : role === "employer"
      ? [
          { href: "/employer/jobs", label: t("dashboard.employer.jobs"), icon: Briefcase },
          { href: "/employer/jobs/new", label: t("dashboard.employer.newJob"), icon: Plus },
          { href: "/employer/profile", label: t("dashboard.employer.profile"), icon: Building2 },
        ]
      : role === "admin"
      ? [
          { href: "/admin/jobs", label: t("dashboard.admin.jobs"), icon: ShieldCheck },
          { href: "/admin/users", label: t("dashboard.admin.users"), icon: Users },
          { href: "/admin/analytics", label: t("dashboard.admin.analytics"), icon: BarChart2 },
          { href: "/admin/profile", label: t("dashboard.admin.profile"), icon: UserIcon },
        ]
      : [];

  const sharedItems: NavItem[] = [
    { href: "/messages", label: lang === "ar" ? "الرسائل" : "Messages", icon: MessageSquare },
    { href: "/notifications", label: t("nav.notifications"), icon: Bell },
  ];

  const allItems = [...commonItems, ...roleItems, ...sharedItems];

  return (
    <div className="hidden md:block w-full border-b border-border/40 bg-muted/30">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1" dir={lang === "ar" ? "rtl" : "ltr"}>
          {allItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors flex-shrink-0",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
