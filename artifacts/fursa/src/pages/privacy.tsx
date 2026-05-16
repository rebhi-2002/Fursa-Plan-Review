import { Helmet } from "react-helmet-async";
import { useT, useLanguageStore } from "@/lib/i18n";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  const t = useT();
  const { lang } = useLanguageStore();

  return (
    <div className="flex flex-col">
      <Helmet>
        <title>{lang === "ar" ? "سياسة الخصوصية | فُرصة" : "Privacy Policy | Fursa"}</title>
      </Helmet>

      {/* Full-width hero */}
      <div className="relative overflow-hidden h-56 md:h-72">
        <img
          src="/img/privacy-hero.png"
          alt={t("privacy.title")}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/60 to-transparent flex flex-col justify-center px-8 md:px-16">
          <div className="max-w-3xl mx-auto w-full">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-4 w-fit text-white">
              <Shield className="h-4 w-4" />
              {t("privacy.label")}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{t("privacy.title")}</h1>
            <p className="text-white/80 text-sm">{t("privacy.lastUpdated")}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-3xl py-12 px-4">

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
    </div>
  );
}
