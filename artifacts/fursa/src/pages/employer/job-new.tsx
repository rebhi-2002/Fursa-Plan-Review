import { Link, useLocation } from "wouter";
import { useCreateEmployerJob } from "@workspace/api-client-react";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useQueryClient } from "@tanstack/react-query";
import { JobType } from "@workspace/api-client-react";
import { useLanguageStore } from "@/lib/i18n";

export default function EmployerNewJob() {
  const t = useT();
  const { lang } = useLanguageStore();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const createJobMutation = useCreateEmployerJob();

  const jobSchema = z.object({
    title: z.string().min(5, t("employer.newJob.validation.title")),
    description: z.string().min(20, t("employer.newJob.validation.desc")),
    requirements: z.string().optional(),
    type: z.nativeEnum(JobType, {
      required_error: t("employer.newJob.validation.type"),
    }),
    category: z.string().min(2, t("employer.newJob.validation.cat")),
    contactInfo: z
      .string()
      .min(5, t("employer.newJob.validation.contact")),
    deadline: z.string().optional(),
  });

  type JobFormValues = z.infer<typeof jobSchema>;

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      description: "",
      requirements: "",
      type: "online",
      category: "",
      contactInfo: "",
      deadline: "",
    },
  });

  const onSubmit = async (data: JobFormValues) => {
    try {
      await createJobMutation.mutateAsync({
        data: {
          ...data,
          deadline: data.deadline
            ? new Date(data.deadline).toISOString()
            : undefined,
        },
      });
      toast.success(t("employer.newJob.success"));
      queryClient.invalidateQueries();
      setLocation("/employer/jobs");
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  return (
    <div className="container py-8 max-w-3xl">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/employer/jobs">
            <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("employer.newJob.title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("employer.newJob.subtitle")}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("employer.newJob.detailsCard")}</CardTitle>
          <CardDescription>
            {t("employer.newJob.reviewNotice")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("employer.newJob.jobTitle")}{" "}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("employer.newJob.jobTitlePh")}
                        className="bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("employer.newJob.field")}{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("employer.newJob.fieldPh")}
                          className="bg-background"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("employer.newJob.workType")}{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background">
                            <SelectValue
                              placeholder={t("employer.newJob.workType")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent dir={lang === "ar" ? "rtl" : "ltr"}>
                          <SelectItem value="online">
                            {t("employer.newJob.workType.online")}
                          </SelectItem>
                          <SelectItem value="field">
                            {t("employer.newJob.workType.field")}
                          </SelectItem>
                          <SelectItem value="hybrid">
                            {t("employer.newJob.workType.hybrid")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("employer.newJob.descLabel")}{" "}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("employer.newJob.descPh")}
                        className="min-h-[150px] resize-none bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("employer.newJob.reqLabel")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("employer.newJob.reqPh")}
                        className="min-h-[100px] resize-none bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6 border-t border-border/50 pt-6">
                <FormField
                  control={form.control}
                  name="contactInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("employer.newJob.contactLabel")}{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("employer.newJob.contactPh")}
                          className="bg-background"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("employer.newJob.contactDesc")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("employer.newJob.deadlineLabel")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="bg-background"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("employer.newJob.deadlineDesc")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-border/50">
                <Button type="button" variant="outline" asChild>
                  <Link href="/employer/jobs">{t("common.cancel")}</Link>
                </Button>
                <Button
                  type="submit"
                  disabled={createJobMutation.isPending}
                  className="px-8"
                >
                  {createJobMutation.isPending && (
                    <Loader2 className="mr-2 ms-2 h-4 w-4 animate-spin" />
                  )}
                  {t("employer.newJob.submit")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
