import { Link } from "wouter";
import { useT, useLanguageStore } from "@/lib/i18n";
import { Briefcase, Users, FileText } from "lucide-react";
import { useGetPlatformStats } from "@workspace/api-client-react";

export function Footer() {
  const t = useT();
  const { lang } = useLanguageStore();
  const year = new Date().getFullYear();
  const { data: stats } = useGetPlatformStats();

  return (
    <footer className="border-t bg-muted/40 mt-auto">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl text-primary">{t("app.name")}</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              {t("app.description")}
            </p>

            {/* Live Platform Stats */}
            <div className="mt-4 flex flex-wrap gap-3">
              {stats?.totalJobs !== undefined && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-background border border-border/60 rounded-lg px-2.5 py-1.5">
                  <Briefcase className="h-3 w-3 text-primary" />
                  <span className="font-semibold text-foreground">{stats.totalJobs.toLocaleString()}</span>
                  <span>{lang === "ar" ? "وظيفة" : "Jobs"}</span>
                </div>
              )}
              {stats?.totalSeekers !== undefined && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-background border border-border/60 rounded-lg px-2.5 py-1.5">
                  <Users className="h-3 w-3 text-emerald-500" />
                  <span className="font-semibold text-foreground">{stats.totalSeekers.toLocaleString()}</span>
                  <span>{lang === "ar" ? "باحث" : "Seekers"}</span>
                </div>
              )}
              {stats?.totalApplications !== undefined && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-background border border-border/60 rounded-lg px-2.5 py-1.5">
                  <FileText className="h-3 w-3 text-violet-500" />
                  <span className="font-semibold text-foreground">{stats.totalApplications.toLocaleString()}</span>
                  <span>{lang === "ar" ? "طلب" : "Applications"}</span>
                </div>
              )}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">{t("footer.platform")}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/jobs" className="text-muted-foreground hover:text-foreground transition-colors">{t("footer.findJob")}</Link></li>
              <li><Link href="/for-employers" className="text-muted-foreground hover:text-foreground transition-colors">{lang === "ar" ? "لأصحاب العمل" : "For Employers"}</Link></li>
              <li><Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">{lang === "ar" ? "دليل الاستخدام" : "User Guide"}</Link></li>
              <li><Link href="/changelog" className="text-muted-foreground hover:text-foreground transition-colors">{lang === "ar" ? "ما الجديد؟" : "What's New"}</Link></li>
              <li><Link href="/help" className="text-muted-foreground hover:text-foreground transition-colors">{lang === "ar" ? "مركز المساعدة" : "Help Center"}</Link></li>
              <li><Link href="/success-stories" className="text-muted-foreground hover:text-foreground transition-colors">{lang === "ar" ? "قصص النجاح" : "Success Stories"}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">{lang === "ar" ? "الشركة" : "Company"}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">{t("footer.about")}</Link></li>
              <li><Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">{t("footer.faq")}</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">{t("footer.contact")}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">{t("footer.legal")}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">{t("footer.privacy")}</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">{t("footer.terms")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/50 text-xs text-muted-foreground text-center">
          {t("app.copyright", { year })}
        </div>
      </div>
    </footer>
  );
}
