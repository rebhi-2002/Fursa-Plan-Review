import { useState } from "react";
import { Link } from "wouter";
import { useClerk, useUser } from "@clerk/react";
import { useLanguageStore, useT } from "@/lib/i18n";
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
} from "lucide-react";
import { useGetCurrentUser } from "@workspace/api-client-react";
import { NotificationBell } from "./NotificationBell";

export function Header() {
  const t = useT();
  const { lang, setLang } = useLanguageStore();
  const { user: clerkUser } = useUser();
  const { signOut } = useClerk();
  const { data: dbUser } = useGetCurrentUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleLang = () => {
    setLang(lang === "ar" ? "en" : "ar");
  };

  const closeMobile = () => setMobileOpen(false);

  const renderRoleLinks = (onClick?: () => void) => {
    if (!dbUser?.role || !dbUser.onboarded) return null;
    const role = dbUser.role;
    const links: { href: string; label: string; icon: any }[] = [
      { href: `/${role}`, label: t("nav.dashboard"), icon: LayoutDashboard },
    ];
    if (role === "seeker") {
      links.push(
        {
          href: "/seeker/applications",
          label: t("dashboard.seeker.applications"),
          icon: FileText,
        },
        {
          href: "/seeker/saved",
          label: t("dashboard.seeker.saved"),
          icon: Bookmark,
        },
        {
          href: "/seeker/profile",
          label: t("dashboard.seeker.profile"),
          icon: UserIcon,
        },
      );
    } else if (role === "employer") {
      links.push(
        {
          href: "/employer/jobs",
          label: t("dashboard.employer.jobs"),
          icon: Briefcase,
        },
        {
          href: "/employer/jobs/new",
          label: t("dashboard.employer.newJob"),
          icon: Plus,
        },
      );
    } else if (role === "admin") {
      links.push(
        {
          href: "/admin/jobs",
          label: t("dashboard.admin.jobs"),
          icon: Briefcase,
        },
        {
          href: "/admin/users",
          label: t("dashboard.admin.users"),
          icon: Users,
        },
      );
    }
    return links.map((l) => (
      <DropdownMenuItem key={l.href} asChild>
        <Link
          href={l.href}
          className="w-full flex items-center cursor-pointer"
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
      <Link
        href="/"
        onClick={closeMobile}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium hover:bg-accent"
      >
        <Home className="h-5 w-5" /> {t("nav.home")}
      </Link>
      <Link
        href="/jobs"
        onClick={closeMobile}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium hover:bg-accent"
      >
        <Briefcase className="h-5 w-5" /> {t("nav.jobs")}
      </Link>

      {dbUser?.role && dbUser.onboarded && (
        <>
          <div className="my-2 h-px bg-border" />
          <Link
            href={`/${dbUser.role}`}
            onClick={closeMobile}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium hover:bg-accent"
          >
            <LayoutDashboard className="h-5 w-5" /> {t("nav.dashboard")}
          </Link>
          {dbUser.role === "seeker" && (
            <>
              <Link
                href="/seeker/applications"
                onClick={closeMobile}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-base hover:bg-accent"
              >
                <FileText className="h-5 w-5" />{" "}
                {t("dashboard.seeker.applications")}
              </Link>
              <Link
                href="/seeker/saved"
                onClick={closeMobile}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-base hover:bg-accent"
              >
                <Bookmark className="h-5 w-5" /> {t("dashboard.seeker.saved")}
              </Link>
              <Link
                href="/seeker/profile"
                onClick={closeMobile}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-base hover:bg-accent"
              >
                <UserIcon className="h-5 w-5" />{" "}
                {t("dashboard.seeker.profile")}
              </Link>
            </>
          )}
          {dbUser.role === "employer" && (
            <>
              <Link
                href="/employer/jobs"
                onClick={closeMobile}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-base hover:bg-accent"
              >
                <Briefcase className="h-5 w-5" />{" "}
                {t("dashboard.employer.jobs")}
              </Link>
              <Link
                href="/employer/jobs/new"
                onClick={closeMobile}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-base hover:bg-accent"
              >
                <Plus className="h-5 w-5" /> {t("dashboard.employer.newJob")}
              </Link>
            </>
          )}
          {dbUser.role === "admin" && (
            <>
              <Link
                href="/admin/jobs"
                onClick={closeMobile}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-base hover:bg-accent"
              >
                <ShieldCheck className="h-5 w-5" />{" "}
                {t("dashboard.admin.jobs")}
              </Link>
              <Link
                href="/admin/users"
                onClick={closeMobile}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-base hover:bg-accent"
              >
                <Users className="h-5 w-5" /> {t("dashboard.admin.users")}
              </Link>
            </>
          )}
        </>
      )}

      <div className="my-2 h-px bg-border" />

      <button
        onClick={() => {
          toggleLang();
          closeMobile();
        }}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium hover:bg-accent text-start"
      >
        <Globe className="h-5 w-5" /> {t("nav.langSwitchTo")}
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
          onClick={() => {
            signOut();
            closeMobile();
          }}
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
            <span className="font-bold text-xl text-foreground">
              {t("app.name")}
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("nav.home")}
            </Link>
            <Link
              href="/jobs"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("nav.jobs")}
            </Link>
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
            <span className="text-sm font-medium">
              {t("nav.langSwitchTo")}
            </span>
          </Button>

          {clerkUser && (
            <div className="hidden md:inline-flex">
              <NotificationBell />
            </div>
          )}

          {clerkUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full hidden md:inline-flex"
                >
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage
                      src={clerkUser.imageUrl}
                      alt={clerkUser.fullName || ""}
                    />
                    <AvatarFallback>
                      {clerkUser.firstName?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56"
                dir={lang === "ar" ? "rtl" : "ltr"}
              >
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
                  onClick={() => signOut()}
                  className="text-destructive cursor-pointer focus:text-destructive"
                >
                  <LogOut className="mr-2 ms-2 h-4 w-4" />
                  <span>{t("nav.signOut")}</span>
                </DropdownMenuItem>
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
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label={t("nav.menu")}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side={lang === "ar" ? "right" : "left"}
              className="w-72"
            >
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <span>{t("app.name")}</span>
                </SheetTitle>
              </SheetHeader>
              {mobileNavLinks}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
