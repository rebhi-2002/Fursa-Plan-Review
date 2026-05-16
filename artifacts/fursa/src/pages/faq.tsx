import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { useT, useLanguageStore } from "@/lib/i18n";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageCircle } from "lucide-react";

const FAQ_KEYS = [
  { q: "faq.q1", a: "faq.a1" },
  { q: "faq.q2", a: "faq.a2" },
  { q: "faq.q3", a: "faq.a3" },
  { q: "faq.q4", a: "faq.a4" },
  { q: "faq.q5", a: "faq.a5" },
  { q: "faq.q6", a: "faq.a6" },
  { q: "faq.q7", a: "faq.a7" },
  { q: "faq.q8", a: "faq.a8" },
];

export default function FaqPage() {
  const t = useT();
  const { lang } = useLanguageStore();

  return (
    <div className="flex flex-col">
      <Helmet>
        <title>{lang === "ar" ? "الأسئلة الشائعة | فُرصة" : "FAQ | Fursa"}</title>
      </Helmet>

      {/* Full-width hero */}
      <div className="relative overflow-hidden h-56 md:h-72">
        <img
          src="/img/faq-hero.png"
          alt={t("faq.title")}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-transparent flex flex-col justify-center px-8 md:px-16">
          <div className="max-w-3xl mx-auto w-full">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-white/20 mb-3">
              <HelpCircle className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{t("faq.title")}</h1>
            <p className="text-white/80 text-sm md:text-base max-w-md">{t("faq.subtitle")}</p>
          </div>
        </div>
      </div>

      {/* Page content */}
      <div className="container py-12 max-w-3xl">
      <Accordion type="single" collapsible className="space-y-2">
        {FAQ_KEYS.map((item, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="border rounded-xl px-1 overflow-hidden data-[state=open]:shadow-sm"
          >
            <AccordionTrigger className="px-4 py-4 text-start font-medium hover:no-underline hover:text-primary transition-colors">
              {t(item.q)}
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-muted-foreground leading-relaxed">
              {t(item.a)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-10 rounded-2xl bg-muted/40 border p-8 text-center">
        <MessageCircle className="h-10 w-10 text-primary/60 mx-auto mb-3" />
        <p className="text-muted-foreground mb-4">{t("faq.moreQuestions")}</p>
        <Button asChild>
          <Link href="/contact">{t("faq.contactUs")}</Link>
        </Button>
      </div>
      </div>
    </div>
  );
}
