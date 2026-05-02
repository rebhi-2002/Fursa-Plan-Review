import { Link } from "wouter";
import { useT } from "@/lib/i18n";
import { Briefcase } from "lucide-react";

export function Footer() {
  const t = useT();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/40 mt-auto">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl text-primary">
                {t("app.name")}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              {t("app.description")}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">
              {t("footer.platform")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/jobs"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.findJob")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.faq")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.contact")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">
              {t("footer.legal")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.terms")}
                </Link>
              </li>
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
