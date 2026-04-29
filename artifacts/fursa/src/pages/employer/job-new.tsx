import { Link, useLocation } from "wouter";
import { useCreateEmployerJob } from "@workspace/api-client-react";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useQueryClient } from "@tanstack/react-query";
import { JobType } from "@workspace/api-client-react";
import { useLanguageStore } from "@/lib/i18n";

const jobSchema = z.object({
  title: z.string().min(5, "عنوان الوظيفة يجب أن يكون 5 أحرف على الأقل"),
  description: z.string().min(20, "يرجى كتابة وصف وافٍ للوظيفة"),
  requirements: z.string().optional(),
  type: z.nativeEnum(JobType, { required_error: "يرجى اختيار نوع الوظيفة" }),
  category: z.string().min(2, "يرجى كتابة تصنيف الوظيفة"),
  contactInfo: z.string().min(5, "معلومات التواصل مطلوبة لاستلام الطلبات أو الاستفسارات"),
  deadline: z.string().optional(),
});

type JobFormValues = z.infer<typeof jobSchema>;

export default function EmployerNewJob() {
  const t = useT();
  const { lang } = useLanguageStore();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const createJobMutation = useCreateEmployerJob();

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
      await createJobMutation.mutateAsync({ data });
      toast.success("تم إرسال الوظيفة للمراجعة بنجاح");
      queryClient.invalidateQueries(); // Simple invalidation of all to refresh lists
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
          <h1 className="text-3xl font-bold tracking-tight">نشر وظيفة جديدة</h1>
          <p className="text-muted-foreground mt-1">قم بتعبئة تفاصيل الوظيفة لجذب أفضل الكفاءات</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>تفاصيل الوظيفة</CardTitle>
          <CardDescription>
            ستخضع الوظيفة لمراجعة الإدارة قبل نشرها للمستخدمين لضمان جودة المحتوى.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المسمى الوظيفي <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="مثال: مطور واجهات أمامية، مصمم جرافيك..." className="bg-background" {...field} />
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
                      <FormLabel>مجال العمل <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: برمجة وتطوير، هندسة، تعليم..." className="bg-background" {...field} />
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
                      <FormLabel>طبيعة الدوام <span className="text-destructive">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="اختر طبيعة الدوام" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent dir={lang === "ar" ? "rtl" : "ltr"}>
                          <SelectItem value="online">عمل عن بُعد (أونلاين)</SelectItem>
                          <SelectItem value="field">عمل ميداني</SelectItem>
                          <SelectItem value="hybrid">نظام هجين (ميداني وعن بُعد)</SelectItem>
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
                    <FormLabel>الوصف الوظيفي والمهام <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="اشرح بوضوح طبيعة العمل والمهام المتوقعة من الموظف..."
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
                    <FormLabel>المتطلبات والشروط</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="ما هي المهارات والخبرات المطلوبة للقبول في هذه الوظيفة؟"
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
                      <FormLabel>معلومات التواصل <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="رقم هاتف أو بريد إلكتروني للاستفسار" className="bg-background" {...field} />
                      </FormControl>
                      <FormDescription>
                        للرد على الاستفسارات الضرورية
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
                      <FormLabel>الموعد النهائي للتقديم</FormLabel>
                      <FormControl>
                        <Input type="date" className="bg-background" {...field} />
                      </FormControl>
                      <FormDescription>
                        اختياري، يحدد متى سيتم إغلاق التقديم
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
                <Button type="submit" disabled={createJobMutation.isPending} className="px-8">
                  {createJobMutation.isPending && <Loader2 className="mr-2 ms-2 h-4 w-4 animate-spin" />}
                  إرسال للمراجعة
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}