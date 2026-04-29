import { Link } from "wouter";
import { useT } from "@/lib/i18n";

export function Footer() {
  const t = useT();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/40 py-12 mt-auto">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="font-bold text-xl text-primary">فُرصة</div>
          <p className="text-sm text-muted-foreground text-center md:text-start max-w-sm">
            {t("app.description")} - نربط الكفاءات بالفرص في غزة.
          </p>
        </div>
        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/jobs" className="hover:text-foreground transition-colors">{t("nav.jobs")}</Link>
            <Link href="/sign-in" className="hover:text-foreground transition-colors">{t("nav.signIn")}</Link>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {year} منصة فُرصة - غزة. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}