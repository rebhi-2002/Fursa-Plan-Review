import { Link } from "wouter";
import { useT } from "@/lib/i18n";
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

  return (
    <div className="container py-12 max-w-3xl">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 mb-4">
          <HelpCircle className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          {t("faq.title")}
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          {t("faq.subtitle")}
        </p>
      </div>

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
  );
}
