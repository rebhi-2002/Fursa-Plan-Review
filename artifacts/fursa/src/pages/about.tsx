import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { useT, useLanguageStore } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  Heart,
  Target,
  Users,
  Shield,
  Globe,
  ArrowRight,
} from "lucide-react";

export default function AboutPage() {
  const t = useT();
  const { lang } = useLanguageStore();

  const values = [
    {
      icon: Heart,
      title: t("about.value1Title"),
      desc: t("about.value1Desc"),
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      icon: Shield,
      title: t("about.value2Title"),
      desc: t("about.value2Desc"),
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      icon: Globe,
      title: t("about.value3Title"),
      desc: t("about.value3Desc"),
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      icon: Users,
      title: t("about.value4Title"),
      desc: t("about.value4Desc"),
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="flex flex-col">
      <Helmet>
        <title>{lang === "ar" ? "من نحن | فُرصة" : "About Us | Fursa"}</title>
      </Helmet>
      <div className="relative overflow-hidden h-64 md:h-80">
        <img
          src="/img/about-hero.png"
          alt={t("about.heroTitle")}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/70 to-primary/40 flex flex-col justify-center px-8 md:px-16">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-4 w-fit text-white">
            <Briefcase className="h-4 w-4" />
            {t("app.name")}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white">
            {t("about.heroTitle")}
          </h1>
          <p className="text-lg text-white/80 max-w-xl leading-relaxed">
            {t("about.heroSubtitle")}
          </p>
        </div>
      </div>

      <div className="container max-w-4xl py-16 px-4 space-y-16">
        <section className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wide">
              <Target className="h-4 w-4" />
              {t("about.missionLabel")}
            </div>
            <h2 className="text-3xl font-bold leading-tight">
              {t("about.missionTitle")}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t("about.missionDesc")}
            </p>
          </div>
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-8 space-y-4">
              <div className="text-4xl font-extrabold text-primary">{t("app.name")}</div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t("about.quoteDesc")}
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">{t("about.valuesTitle")}</h2>
            <p className="text-muted-foreground">{t("about.valuesSubtitle")}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <Card key={i} className="border-border/50 hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-3">
                  <div className={`w-12 h-12 rounded-xl ${v.bg} flex items-center justify-center`}>
                    <v.icon className={`h-6 w-6 ${v.color}`} />
                  </div>
                  <h3 className="text-lg font-bold">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="text-center bg-muted/30 rounded-2xl p-10 space-y-6">
          <h2 className="text-2xl font-bold">{t("about.ctaTitle")}</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {t("about.ctaSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link href="/sign-up">
                {t("home.ctaSignUp")}
                <ArrowRight className="h-4 w-4 ms-2 rtl:rotate-180" />
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/jobs">{t("home.ctaBrowse")}</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
