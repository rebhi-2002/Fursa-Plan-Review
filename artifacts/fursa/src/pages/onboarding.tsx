import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useGetCurrentUser, useSetUserRole, useUpdateCurrentUser } from "@workspace/api-client-react";
import { useT, useLanguageStore } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, User, ArrowRight, Loader2, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const profileSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب (حرفين على الأقل)"),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function Onboarding() {
  const t = useT();
  const { lang } = useLanguageStore();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"role" | "profile">("role");
  
  const { data: user, isLoading: isUserLoading } = useGetCurrentUser();
  const setRoleMutation = useSetUserRole();
  const updateProfileMutation = useUpdateCurrentUser();

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
      if (user.onboarded) {
        setLocation(`/${user.role}`);
      } else if (user.role && user.role !== "admin") {
        setStep("profile");
        form.reset({
          name: user.name || "",
          phone: user.phone || "",
          location: user.location || "",
          bio: user.bio || "",
        });
      } else if (user.role === "admin") {
        setLocation("/admin");
      } else {
        form.reset({ name: user.name || "" });
      }
    }
  }, [user, setLocation, form]);

  const handleSelectRole = async (role: "seeker" | "employer") => {
    try {
      await setRoleMutation.mutateAsync({ data: { role } });
      setStep("profile");
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await updateProfileMutation.mutateAsync({ data });
      toast.success("تم إكمال إعداد الحساب بنجاح");
      const currentRole = user?.role || setRoleMutation.variables?.data.role;
      setLocation(`/${currentRole}`);
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user?.onboarded) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-muted/30">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Briefcase className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">أهلاً بك في فُرصة</h1>
          <p className="text-muted-foreground text-lg">
            {step === "role" ? "دعنا نتعرف عليك أكثر. كيف ترغب في استخدام المنصة؟" : "أكمل بيانات ملفك الشخصي للبدء"}
          </p>
        </div>

        {step === "role" && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card 
              className="cursor-pointer hover:border-primary hover:shadow-md transition-all border-2 group"
              onClick={() => handleSelectRole("seeker")}
            >
              <CardContent className="p-8 text-center space-y-4">
                <div className="bg-primary/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/10 transition-colors">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">باحث عن عمل</h3>
                <p className="text-muted-foreground">أبحث عن وظيفة أو فرصة عمل تناسب مهاراتي</p>
                <Button variant="ghost" className="w-full mt-4 group-hover:bg-primary/5" disabled={setRoleMutation.isPending}>
                  {setRoleMutation.isPending && setRoleMutation.variables?.data.role === "seeker" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>اختيار <ArrowRight className="ml-2 rtl:mr-2 rtl:ml-0 h-4 w-4 rtl:rotate-180" /></>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:border-primary hover:shadow-md transition-all border-2 group"
              onClick={() => handleSelectRole("employer")}
            >
              <CardContent className="p-8 text-center space-y-4">
                <div className="bg-primary/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/10 transition-colors">
                  <Building2 className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">صاحب عمل</h3>
                <p className="text-muted-foreground">أمثل شركة أو مؤسسة وأبحث عن كفاءات للتوظيف</p>
                <Button variant="ghost" className="w-full mt-4 group-hover:bg-primary/5" disabled={setRoleMutation.isPending}>
                  {setRoleMutation.isPending && setRoleMutation.variables?.data.role === "employer" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>اختيار <ArrowRight className="ml-2 rtl:mr-2 rtl:ml-0 h-4 w-4 rtl:rotate-180" /></>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {step === "profile" && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle>بيانات الملف الشخصي</CardTitle>
              <CardDescription>
                هذه البيانات ستظهر في ملفك الشخصي ويمكنك تعديلها لاحقاً.
              </CardDescription>
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
                          <Input placeholder="الاسم كما سيظهر للآخرين" {...field} />
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
                            <Input placeholder="مثال: 059XXXXXXX" dir="ltr" className="text-right" {...field} />
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
                            <Input placeholder="مثال: غزة، الرمال" {...field} />
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
                        <FormLabel>نبذة مختصرة</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={user?.role === "employer" ? "نبذة عن شركتك أو نشاطك..." : "تحدث قليلاً عن مهاراتك وخبراتك..."} 
                            className="min-h-[120px] resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" size="lg" disabled={updateProfileMutation.isPending}>
                    {updateProfileMutation.isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "حفظ والبدء"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}