import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useGetCurrentUser, useUpdateCurrentUser, getGetCurrentUserQueryKey } from "@workspace/api-client-react";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Loader2, FileText, UploadCloud, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ObjectUploader } from "@workspace/object-storage-web";
import { useQueryClient } from "@tanstack/react-query";

const profileSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب (حرفين على الأقل)"),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function SeekerProfile() {
  const t = useT();
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useGetCurrentUser();
  const updateProfileMutation = useUpdateCurrentUser();
  
  const [cvObjectPath, setCvObjectPath] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      phone: "",
      location: "",
      bio: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        phone: user.phone || "",
        location: user.location || "",
        bio: user.bio || "",
      });
      setCvObjectPath(user.cvObjectPath || null);
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await updateProfileMutation.mutateAsync({ 
        data: { ...data, cvObjectPath } 
      });
      toast.success("تم تحديث الملف الشخصي بنجاح");
      queryClient.invalidateQueries({ queryKey: getGetCurrentUserQueryKey() });
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  const handleUploadParams = async (file: any) => {
    const res = await fetch("/api/storage/uploads/request-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: file.name,
        size: file.size,
        contentType: file.type,
      }),
    });
    if (!res.ok) throw new Error("Failed to get upload URL");
    const { uploadURL, objectPath } = await res.json();
    setCvObjectPath(objectPath); // Save locally for form submission
    return {
      method: "PUT" as const,
      url: uploadURL,
      headers: { "Content-Type": file.type },
    };
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-3xl">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/seeker">
            <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">الملف الشخصي</h1>
          <p className="text-muted-foreground mt-1">تحديث بياناتك وسيرتك الذاتية</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>السيرة الذاتية</CardTitle>
            <CardDescription>
              ارفع سيرتك الذاتية لتسهيل التقديم على الوظائف بضغطة زر.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 border border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center">
              {cvObjectPath ? (
                <>
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">تم حفظ السيرة الذاتية</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    تم إرفاق ملف السيرة الذاتية بنجاح. يمكنك استبداله برفع ملف جديد.
                  </p>
                </>
              ) : (
                <>
                  <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">لا توجد سيرة ذاتية مرفقة</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    ارفع ملف PDF أو Word (الحد الأقصى 10 ميجابايت)
                  </p>
                </>
              )}
              
              <ObjectUploader
                maxFileSize={10485760} // 10MB
                onGetUploadParameters={handleUploadParams}
                onComplete={(result) => {
                  if (result.successful.length > 0) {
                    toast.success("تم رفع السيرة الذاتية بنجاح. لا تنس حفظ الملف الشخصي.");
                  }
                }}
                buttonClassName="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
              >
                <UploadCloud className="mr-2 ms-2 h-5 w-5" />
                {cvObjectPath ? "تحديث السيرة الذاتية" : "رفع السيرة الذاتية"}
              </ObjectUploader>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>البيانات الأساسية</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم الكامل <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رقم الهاتف</FormLabel>
                        <FormControl>
                          <Input dir="ltr" className="text-right bg-background" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>المنطقة / العنوان</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-background" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نبذة مختصرة (تظهر لأصحاب العمل)</FormLabel>
                      <FormControl>
                        <Textarea 
                          className="min-h-[120px] resize-none bg-background" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4 pt-4 border-t border-border/50">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/seeker">{t("common.cancel")}</Link>
                  </Button>
                  <Button type="submit" disabled={updateProfileMutation.isPending} className="px-8">
                    {updateProfileMutation.isPending && <Loader2 className="mr-2 ms-2 h-4 w-4 animate-spin" />}
                    {t("common.save")}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}