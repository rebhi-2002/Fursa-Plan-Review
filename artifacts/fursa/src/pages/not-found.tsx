import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useT, useLanguageStore } from "@/lib/i18n";
import { useGetCurrentUser } from "@workspace/api-client-react";
import { useUser } from "@clerk/react";

export default function NotFound() {
  const t = useT();
  const { lang } = useLanguageStore();
  const { user: clerkUser, isLoaded } = useUser();
  const { data: dbUser } = useGetCurrentUser();
  const [, setLocation] = useLocation();

  const homeHref = (() => {
    if (!isLoaded || !clerkUser) return "/";
    if (!dbUser) return "/";
    if (!dbUser.onboarded) return "/onboarding";
    return `/${dbUser.role}`;
  })();

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center bg-background px-4">
      <Helmet>
        <title>{lang === "ar" ? "الصفحة غير موجودة | فُرصة" : "Page Not Found | Fursa"}</title>
      </Helmet>
      <Card className="w-full max-w-md border-border/50 shadow-sm">
        <CardContent className="pt-8 pb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-destructive/10 p-3 rounded-full">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">404</h1>
          <h2 className="text-xl font-semibold mb-3">
            {t("notFound.title")}
          </h2>
          <p className="text-muted-foreground mb-6">{t("notFound.desc")}</p>
          <Button asChild size="lg" className="w-full">
            <Link href={homeHref}>{t("notFound.home")}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
