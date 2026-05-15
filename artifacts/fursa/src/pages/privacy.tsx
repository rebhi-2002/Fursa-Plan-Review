import { Helmet } from "react-helmet-async";
import { useT, useLanguageStore } from "@/lib/i18n";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  const t = useT();
  const { lang } = useLanguageStore();

  return (
    <div className="container max-w-3xl py-12 px-4">
      <Helmet>
        <title>{lang === "ar" ? "سياسة الخصوصية | فُرصة" : "Privacy Policy | Fursa"}</title>
      </Helmet>
      <div className="mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm">
          <Shield className="h-4 w-4" />
          {t("privacy.label")}
        </div>
        <h1 className="text-4xl font-bold">{t("privacy.title")}</h1>
        <p className="text-muted-foreground">{t("privacy.lastUpdated")}</p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-base leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold">{t("privacy.s1Title")}</h2>
          <p className="text-muted-foreground">{t("privacy.s1Body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">{t("privacy.s2Title")}</h2>
          <p className="text-muted-foreground">{t("privacy.s2Body")}</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ps-2">
            <li>{t("privacy.s2Li1")}</li>
            <li>{t("privacy.s2Li2")}</li>
            <li>{t("privacy.s2Li3")}</li>
            <li>{t("privacy.s2Li4")}</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">{t("privacy.s3Title")}</h2>
          <p className="text-muted-foreground">{t("privacy.s3Body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">{t("privacy.s4Title")}</h2>
          <p className="text-muted-foreground">{t("privacy.s4Body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">{t("privacy.s5Title")}</h2>
          <p className="text-muted-foreground">{t("privacy.s5Body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">{t("privacy.s6Title")}</h2>
          <p className="text-muted-foreground">{t("privacy.s6Body")}</p>
        </section>
      </div>
    </div>
  );
}
