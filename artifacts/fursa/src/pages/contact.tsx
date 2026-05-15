import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { useT, useLanguageStore } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, MapPin, Clock, Send, CheckCircle2, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const t = useT();
  const { lang } = useLanguageStore();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const submitMutation = useMutation({
    mutationFn: async (values: ContactFormValues) => {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to submit");
    },
    onSuccess: () => {
      setSubmitted(true);
      toast.success(t("contact.success"));
    },
    onError: () => {
      toast.error(t("common.error"));
    },
  });

  const onSubmit = (values: ContactFormValues) => {
    submitMutation.mutate(values);
  };

  return (
    <div className="flex flex-col">
      <Helmet>
        <title>{lang === "ar" ? "تواصل معنا | فُرصة" : "Contact Us | Fursa"}</title>
      </Helmet>

      {/* Full-width hero */}
      <div className="relative overflow-hidden h-56 md:h-72">
        <img
          src="/img/contact-hero.png"
          alt={t("contact.title")}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-transparent flex flex-col justify-center px-8 md:px-16">
          <div className="max-w-5xl mx-auto w-full">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{t("contact.title")}</h1>
            <p className="text-white/80 text-sm md:text-base max-w-md">{t("contact.subtitle")}</p>
          </div>
        </div>
      </div>

      {/* Page content */}
      <div className="container py-12 max-w-5xl">
      <div className="grid gap-8 md:grid-cols-5">
        <div className="md:col-span-2 space-y-4">
          <Card className="overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary to-primary/40" />
            <CardContent className="p-6 space-y-5">
              <h2 className="font-semibold text-lg">{t("contact.info.title")}</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">{t("contact.emailLabel")}</p>
                    <p className="text-sm font-medium">{t("contact.info.email")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">{t("contact.info.locationLabel")}</p>
                    <p className="text-sm font-medium">{t("contact.info.location")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">{t("contact.info.hoursLabel")}</p>
                    <p className="text-sm font-medium">{t("contact.info.hours")}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Card>
            <CardContent className="p-6">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold">{t("contact.successTitle")}</h3>
                  <p className="text-muted-foreground max-w-sm">{t("contact.successDesc")}</p>
                  <Button
                    variant="outline"
                    onClick={() => { setSubmitted(false); form.reset(); }}
                    className="mt-2"
                  >
                    {t("contact.sendAnother")}
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("contact.name")}</FormLabel>
                            <FormControl>
                              <Input placeholder={t("contact.namePlaceholder")} dir={lang === "ar" ? "rtl" : "ltr"} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("contact.emailLabel")}</FormLabel>
                            <FormControl>
                              <Input placeholder="you@example.com" type="email" dir="ltr" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("contact.subject")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("contact.subjectPlaceholder")} dir={lang === "ar" ? "rtl" : "ltr"} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("contact.message")}</FormLabel>
                          <FormControl>
                            <Textarea placeholder={t("contact.messagePlaceholder")} rows={5} dir={lang === "ar" ? "rtl" : "ltr"} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full gap-2" disabled={submitMutation.isPending}>
                      {submitMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      {t("contact.send")}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
}
