import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useClerk, useUser } from "@clerk/react";
import { useLanguageStore, useT } from "@/lib/i18n";
import { useThemeStore } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Briefcase,
  LogOut,
  LayoutDashboard,
  User as UserIcon,
  Globe,
  Menu,
  Home,
  FileText,
  Bookmark,
  Plus,
  Users,
  ShieldCheck,
  Building2,
  Bell,
  Moon,
  Sun,
  MessageSquare,
  BellRing,
  ScrollText,
  BarChart2,
  Activity,
} from "lucide-react";
import { useGetCurrentUser } from "@workspace/api-client-react";
import { NotificationBell } from "./NotificationBell";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useT();
  const { lang, setLang } = useLanguageStore();
  const { theme, toggleTheme } = useThemeStore();
  const { user: clerkUser } = useUser();
  const { signOut } = useClerk();
  const { data: dbUser } = useGetCurrentUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  const toggleLang = () => setLang(lang === "ar" ? "en" : "ar");
  const closeMobile = () => setMobileOpen(false);

  const isActive = (href: string, exact = false) => {
    if (href === "/" || exact) return location === href;
    return location === href || location.startsWith(href + "/");
  };

  const navLinkClass = (href: string, exact = false) =>
    cn(
      "text-sm font-medium transition-colors",
      isActive(href, exact)
        ? "text-foreground font-semibold underline underline-offset-4 decoration-primary"
        : "text-muted-foreground hover:text-foreground",
    );

  const mobileLinkClass = (href: string, exact = false) =>
    cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-colors",
      isActive(href, exact)
        ? "bg-primary/10 text-primary font-semibold border border-primary/20"
        : "hover:bg-accent",
    );

  const handleSignOut = () => {
    signOut({ redirectUrl: "/" });
  };

  const renderRoleLinks = (onClick?: () => void) => {
    if (!dbUser?.role || !dbUser.onboarded) return null;
    const role = dbUser.role;
    const links: { href: string; label: string; icon: any; exact?: boolean }[] = [
      { href: `/${role}`, label: t("nav.dashboard"), icon: LayoutDashboard, exact: true },
    ];
    if (role === "seeker") {
      links.push(
        { href: "/seeker/applications", label: t("dashboard.seeker.applications"), icon: FileText },
        { href: "/seeker/saved", label: t("dashboard.seeker.saved"), icon: Bookmark },
        { href: "/seeker/alerts", label: t("dashboard.seeker.alerts"), icon: BellRing },
        { href: "/seeker/cv-builder", label: t("dashboard.seeker.cvBuilder"), icon: ScrollText },
        { href: "/seeker/profile", label: t("dashboard.seeker.profile"), icon: UserIcon },
      );
    } else if (role === "employer") {
      links.push(
        { href: "/employer/jobs", label: t("dashboard.employer.jobs"), icon: Briefcase },
        { href: "/employer/jobs/new", label: t("dashboard.employer.newJob"), icon: Plus },
        { href: "/employer/profile", label: t("dashboard.employer.profile"), icon: Building2 },
      );
    } else if (role === "admin") {
      links.push(
        { href: "/admin/jobs", label: t("dashboard.admin.jobs"), icon: Briefcase },
        { href: "/admin/users", label: t("dashboard.admin.users"), icon: Users },
        { href: "/admin/analytics", label: t("dashboard.admin.analytics"), icon: BarChart2 },
        { href: "/admin/profile", label: t("dashboard.admin.profile"), icon: UserIcon },
      );
    }
    // Add shared items for all roles
    links.push(
      { href: "/messages", label: lang === "ar" ? "الرسائل" : "Messages", icon: MessageSquare },
    );

    return links.map((l) => (
      <DropdownMenuItem key={l.href} asChild>
        <Link
          href={l.href}
          className={cn(
            "w-full flex items-center cursor-pointer",
            isActive(l.href, l.exact) && "bg-accent font-semibold",
          )}
          onClick={onClick}
        >
          <l.icon className="mr-2 ms-2 h-4 w-4" />
          <span>{l.label}</span>
        </Link>
      </DropdownMenuItem>
    ));
  };

  const mobileNavLinks = (
    <nav className="flex flex-col gap-1 mt-4">
      <Link href="/" onClick={closeMobile} className={mobileLinkClass("/")}>
        <Home className="h-5 w-5" /> {t("nav.home")}
      </Link>
      <Link href="/jobs" onClick={closeMobile} className={mobileLinkClass("/jobs")}>
        <Briefcase className="h-5 w-5" /> {t("nav.jobs")}
      </Link>
      <Link href="/employers" onClick={closeMobile} className={mobileLinkClass("/employers")}>
        <Building2 className="h-5 w-5" /> {t("nav.employers") || (lang === "ar" ? "أصحاب العمل" : "Employers")}
      </Link>

      {dbUser?.role && dbUser.onboarded && (
        <>
          <div className="my-2 h-px bg-border" />
          {dbUser.role === "admin" && (
            <Link
              href="/admin"
              onClick={closeMobile}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-base font-semibold border transition-colors",
                isActive("/admin")
                  ? "text-amber-700 dark:text-amber-300 bg-amber-500/20 border-amber-500/40"
                  : "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20",
              )}
            >
              <ShieldCheck className="h-5 w-5" /> {t("nav.adminPanel")}
            </Link>
          )}
          <Link
            href={`/${dbUser.role}`}
            onClick={closeMobile}
            className={mobileLinkClass(`/${dbUser.role}`, true)}
          >
            <LayoutDashboard className="h-5 w-5" /> {t("nav.dashboard")}
          </Link>
          {dbUser.role === "seeker" && (
            <>
              <Link href="/seeker/applications" onClick={closeMobile} className={mobileLinkClass("/seeker/applications")}>
                <FileText className="h-5 w-5" /> {t("dashboard.seeker.applications")}
              </Link>
              <Link href="/seeker/saved" onClick={closeMobile} className={mobileLinkClass("/seeker/saved")}>
                <Bookmark className="h-5 w-5" /> {t("dashboard.seeker.saved")}
              </Link>
              <Link href="/seeker/alerts" onClick={closeMobile} className={mobileLinkClass("/seeker/alerts")}>
                <BellRing className="h-5 w-5" /> {t("dashboard.seeker.alerts")}
              </Link>
              <Link href="/seeker/cv-builder" onClick={closeMobile} className={mobileLinkClass("/seeker/cv-builder")}>
                <ScrollText className="h-5 w-5" /> {t("dashboard.seeker.cvBuilder")}
              </Link>
              <Link href="/seeker/activity" onClick={closeMobile} className={mobileLinkClass("/seeker/activity")}>
                <Activity className="h-5 w-5" /> {t("dashboard.seeker.activity")}
              </Link>
              <Link href="/seeker/profile" onClick={closeMobile} className={mobileLinkClass("/seeker/profile")}>
                <UserIcon className="h-5 w-5" /> {t("dashboard.seeker.profile")}
              </Link>
            </>
          )}
          {dbUser.role === "employer" && (
            <>
              <Link href="/employer/jobs" onClick={closeMobile} className={mobileLinkClass("/employer/jobs")}>
                <Briefcase className="h-5 w-5" /> {t("dashboard.employer.jobs")}
              </Link>
              <Link href="/employer/jobs/new" onClick={closeMobile} className={mobileLinkClass("/employer/jobs/new")}>
                <Plus className="h-5 w-5" /> {t("dashboard.employer.newJob")}
              </Link>
              <Link href="/employer/profile" onClick={closeMobile} className={mobileLinkClass("/employer/profile")}>
                <Building2 className="h-5 w-5" /> {t("dashboard.employer.profile")}
              </Link>
            </>
          )}
          {dbUser.role === "admin" && (
            <>
              <Link href="/admin/jobs" onClick={closeMobile} className={mobileLinkClass("/admin/jobs")}>
                <ShieldCheck className="h-5 w-5" /> {t("dashboard.admin.jobs")}
              </Link>
              <Link href="/admin/users" onClick={closeMobile} className={mobileLinkClass("/admin/users")}>
                <Users className="h-5 w-5" /> {t("dashboard.admin.users")}
              </Link>
              <Link href="/admin/analytics" onClick={closeMobile} className={mobileLinkClass("/admin/analytics")}>
                <BarChart2 className="h-5 w-5" /> {t("dashboard.admin.analytics")}
              </Link>
              <Link href="/admin/profile" onClick={closeMobile} className={mobileLinkClass("/admin/profile")}>
                <UserIcon className="h-5 w-5" /> {t("dashboard.admin.profile")}
              </Link>
            </>
          )}

          <div className="my-1 h-px bg-border/60" />
          <Link href="/messages" onClick={closeMobile} className={mobileLinkClass("/messages")}>
            <MessageSquare className="h-5 w-5" /> {t("messages.title") || (lang === "ar" ? "الرسائل" : "Messages")}
          </Link>
        </>
      )}

      {clerkUser && (
        <Link href="/notifications" onClick={closeMobile} className={mobileLinkClass("/notifications")}>
          <Bell className="h-5 w-5" /> {t("nav.notifications")}
        </Link>
      )}

      <div className="my-2 h-px bg-border" />

      <button
        onClick={() => { toggleLang(); closeMobile(); }}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium hover:bg-accent text-start"
      >
        <Globe className="h-5 w-5" /> {t("nav.langSwitchTo")}
      </button>

      <button
        onClick={() => { toggleTheme(); closeMobile(); }}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium hover:bg-accent text-start"
      >
        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        {theme === "dark" ? t("theme.light") : t("theme.dark")}
      </button>

      {!clerkUser ? (
        <>
          <Link
            href="/sign-in"
            onClick={closeMobile}
            className="flex items-center justify-center rounded-lg px-3 py-2 text-base font-medium border hover:bg-accent mt-2"
          >
            {t("nav.signIn")}
          </Link>
          <Link
            href="/sign-up"
            onClick={closeMobile}
            className="flex items-center justify-center rounded-lg px-3 py-2 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 mt-1"
          >
            {t("nav.signUp")}
          </Link>
        </>
      ) : (
        <button
          onClick={() => { handleSignOut(); closeMobile(); }}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium text-destructive hover:bg-destructive/10 text-start mt-1"
        >
          <LogOut className="h-5 w-5" /> {t("nav.signOut")}
        </button>
      )}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 lg:gap-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl text-foreground">{t("app.name")}</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className={navLinkClass("/")}>{t("nav.home")}</Link>
            <Link href="/jobs" className={navLinkClass("/jobs")}>{t("nav.jobs")}</Link>
            <Link href="/employers" className={navLinkClass("/employers")}>{t("nav.employers") || (lang === "ar" ? "أصحاب العمل" : "Employers")}</Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLang}
            className="hidden md:inline-flex gap-2 text-muted-foreground hover:text-foreground"
            aria-label={t("nav.toggleLang")}
          >
            <Globe className="h-4 w-4" />
            <span className="text-sm font-medium">{t("nav.langSwitchTo")}</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hidden md:inline-flex text-muted-foreground hover:text-foreground"
            aria-label={t("theme.toggle")}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {clerkUser && (
            <div className="hidden md:inline-flex">
              <NotificationBell />
            </div>
          )}

          {dbUser?.role === "admin" && dbUser.onboarded && (
            <Link
              href="/admin"
              className={cn(
                "hidden md:inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold border transition-colors",
                isActive("/admin")
                  ? "bg-amber-500/25 text-amber-700 dark:text-amber-300 border-amber-500/40"
                  : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/25",
              )}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              {t("nav.adminPanel") || "Admin Panel"}
            </Link>
          )}

          {clerkUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full hidden md:inline-flex">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage src={clerkUser.imageUrl} alt={clerkUser.fullName || ""} />
                    <AvatarFallback>{clerkUser.firstName?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div dir={lang === "ar" ? "rtl" : "ltr"}>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {dbUser?.name || clerkUser.fullName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {clerkUser.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {renderRoleLinks()}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-destructive cursor-pointer focus:text-destructive"
                  >
                    <LogOut className="mr-2 ms-2 h-4 w-4" />
                    <span>{t("nav.signOut")}</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/sign-in">{t("nav.signIn")}</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">{t("nav.signUp")}</Link>
              </Button>
            </div>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label={t("nav.menu")}>
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side={lang === "ar" ? "right" : "left"} className="w-72 overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <span>{t("app.name")}</span>
                </SheetTitle>
                {clerkUser && dbUser?.name && (
                  <p className="text-sm text-muted-foreground text-start mt-1">
                    {lang === "ar" ? `مرحباً، ${dbUser.name.split(" ")[0]}` : `Hi, ${dbUser.name.split(" ")[0]}`}
                  </p>
                )}
              </SheetHeader>
              {mobileNavLinks}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
