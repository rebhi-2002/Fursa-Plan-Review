import { useT } from "@/lib/i18n";
import { FileText } from "lucide-react";

export default function TermsPage() {
  const t = useT();

  return (
    <div className="container max-w-3xl py-12 px-4">
      <div className="mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm">
          <FileText className="h-4 w-4" />
          {t("terms.label")}
        </div>
        <h1 className="text-4xl font-bold">{t("terms.title")}</h1>
        <p className="text-muted-foreground">{t("terms.lastUpdated")}</p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-base leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold">{t("terms.s1Title")}</h2>
          <p className="text-muted-foreground">{t("terms.s1Body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">{t("terms.s2Title")}</h2>
          <p className="text-muted-foreground">{t("terms.s2Body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">{t("terms.s3Title")}</h2>
          <p className="text-muted-foreground">{t("terms.s3Body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">{t("terms.s4Title")}</h2>
          <p className="text-muted-foreground">{t("terms.s4Body")}</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ps-2">
            <li>{t("terms.s4Li1")}</li>
            <li>{t("terms.s4Li2")}</li>
            <li>{t("terms.s4Li3")}</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">{t("terms.s5Title")}</h2>
          <p className="text-muted-foreground">{t("terms.s5Body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">{t("terms.s6Title")}</h2>
          <p className="text-muted-foreground">{t("terms.s6Body")}</p>
        </section>
      </div>
    </div>
  );
}
