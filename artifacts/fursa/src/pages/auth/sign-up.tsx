import { useState } from "react";
import { SignUp } from "@clerk/react";
import { Briefcase, User, Building2, ArrowRight } from "lucide-react";
import { useT, useLanguageStore } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

type PendingRole = "seeker" | "employer";

export default function SignUpPage() {
  const t = useT();
  const { lang } = useLanguageStore();
  const [pendingRole, setPendingRole] = useState<PendingRole | null>(null);

  const handleRolePick = (role: PendingRole) => {
    sessionStorage.setItem("fursa_pending_role", role);
    setPendingRole(role);
  };

  if (pendingRole) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <button
            onClick={() => setPendingRole(null)}
            className="mb-5 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            dir={lang === "ar" ? "rtl" : "ltr"}
          >
            <ArrowRight className="h-4 w-4 rotate-180 rtl:rotate-0" />
            {t("auth.back")}
          </button>
          <SignUp
            routing="path"
            path={`${basePath}/sign-up`}
            signInUrl={`${basePath}/sign-in`}
            forceRedirectUrl={`${basePath}/onboarding`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 bg-muted/20">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium">
            <Briefcase className="h-4 w-4" />
            {t("app.name")}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("auth.signUp.chooseRoleTitle")}
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            {t("auth.signUp.chooseRoleSubtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <Card
            className="cursor-pointer border-2 border-border hover:border-primary hover:shadow-lg transition-all duration-200 group"
            onClick={() => handleRolePick("seeker")}
          >
            <CardContent className="p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <User className="h-8 w-8 text-blue-500 group-hover:text-primary transition-colors" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold">{t("auth.signUp.seeker")}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t("auth.signUp.seekerDesc")}
                </p>
              </div>
              <ul className="text-sm space-y-1.5 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5 shrink-0">✓</span>
                  {t("auth.signUp.seeker.b1")}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5 shrink-0">✓</span>
                  {t("auth.signUp.seeker.b2")}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5 shrink-0">✓</span>
                  {t("auth.signUp.seeker.b3")}
                </li>
              </ul>
              <Button className="w-full" size="sm">
                {t("auth.signUp.continueAsSeeker")}
                <ArrowRight className="h-4 w-4 ms-2 rtl:rotate-180" />
              </Button>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer border-2 border-border hover:border-primary hover:shadow-lg transition-all duration-200 group"
            onClick={() => handleRolePick("employer")}
          >
            <CardContent className="p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Building2 className="h-8 w-8 text-emerald-500 group-hover:text-primary transition-colors" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold">{t("auth.signUp.employer")}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t("auth.signUp.employerDesc")}
                </p>
              </div>
              <ul className="text-sm space-y-1.5 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                  {t("auth.signUp.employer.b1")}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                  {t("auth.signUp.employer.b2")}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                  {t("auth.signUp.employer.b3")}
                </li>
              </ul>
              <Button className="w-full" size="sm" variant="outline">
                {t("auth.signUp.continueAsEmployer")}
                <ArrowRight className="h-4 w-4 ms-2 rtl:rotate-180" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          {t("auth.haveAccount")}{" "}
          <Link href="/sign-in" className="text-primary font-medium hover:underline">
            {t("nav.signIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}
