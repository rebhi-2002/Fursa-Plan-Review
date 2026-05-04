import { SignIn } from "@clerk/react";
import { Briefcase, Search, Building2, ShieldCheck } from "lucide-react";
import { useT, useLanguageStore } from "@/lib/i18n";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function SignInPage() {
  const t = useT();
  const { lang } = useLanguageStore();

  return (
    <div className="flex-1 flex min-h-0">
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 bg-primary text-primary-foreground p-10">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Briefcase className="h-6 w-6" />
          </div>
          <span className="font-bold text-xl">{t("app.name")}</span>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold leading-tight">
              {t("auth.signIn.panelTitle")}
            </h2>
            <p className="text-primary-foreground/80 leading-relaxed">
              {t("auth.signIn.panelSubtitle")}
            </p>
          </div>
          <ul className="space-y-4">
            {[
              { icon: Search, text: t("auth.signIn.f1") },
              { icon: Building2, text: t("auth.signIn.f2") },
              { icon: ShieldCheck, text: t("auth.signIn.f3") },
            ].map(({ icon: Icon, text }, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="bg-white/20 p-1.5 rounded-md shrink-0 mt-0.5">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-sm leading-relaxed text-primary-foreground/90">
                  {text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-primary-foreground/50">
          {t("auth.signIn.panelFooter")}
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-6 sm:px-6 sm:py-10 bg-background overflow-y-auto" dir={lang === "ar" ? "rtl" : "ltr"}>
        <div className="w-full max-w-[440px]">
          <SignIn
            routing="path"
            path={`${basePath}/sign-in`}
            signUpUrl={`${basePath}/sign-up`}
            forceRedirectUrl={`${basePath}/onboarding`}
          />
        </div>
      </div>
    </div>
  );
}
