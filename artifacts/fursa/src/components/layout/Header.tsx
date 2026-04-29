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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Briefcase, LogOut, LayoutDashboard, User as UserIcon, Globe } from "lucide-react";
import { useGetCurrentUser } from "@workspace/api-client-react";

export function Header() {
  const t = useT();
  const { lang, setLang } = useLanguageStore();
  const { user: clerkUser } = useUser();
  const { signOut } = useClerk();
  const { data: dbUser } = useGetCurrentUser();

  const toggleLang = () => {
    setLang(lang === "ar" ? "en" : "ar");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2 space-x-reverse">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl text-foreground">فُرصة</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/jobs" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {t("nav.jobs")}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleLang} className="rounded-full">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <span className="sr-only">Toggle Language</span>
          </Button>

          {clerkUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage src={clerkUser.imageUrl} alt={clerkUser.fullName || ""} />
                    <AvatarFallback>{clerkUser.firstName?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56" dir={lang === "ar" ? "rtl" : "ltr"}>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{dbUser?.name || clerkUser.fullName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {clerkUser.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {dbUser?.role && dbUser.onboarded && (
                  <DropdownMenuItem asChild>
                    <Link href={`/${dbUser.role}`} className="w-full flex items-center cursor-pointer">
                      <LayoutDashboard className="mr-2 ms-2 h-4 w-4" />
                      <span>{t("nav.dashboard")}</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                {dbUser?.role === "seeker" && (
                  <DropdownMenuItem asChild>
                    <Link href="/seeker/profile" className="w-full flex items-center cursor-pointer">
                      <UserIcon className="mr-2 ms-2 h-4 w-4" />
                      <span>{t("dashboard.seeker.profile")}</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="text-destructive cursor-pointer focus:text-destructive">
                  <LogOut className="mr-2 ms-2 h-4 w-4" />
                  <span>{t("nav.signOut")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild className="hidden sm:flex">
                <Link href="/sign-in">{t("nav.signIn")}</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">{t("nav.signUp")}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}