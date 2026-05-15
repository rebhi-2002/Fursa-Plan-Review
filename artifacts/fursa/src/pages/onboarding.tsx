import { Helmet } from "react-helmet-async";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import {
  useGetCurrentUser,
  useSetUserRole,
  useUpdateCurrentUser,
} from "@workspace/api-client-react";
import { useT, useLanguageStore } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Building2, User, ArrowRight, Loader2, Briefcase } from "lucide-react";
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
} from "@/components/ui/form";

export default function Onboarding() {
  const t = useT();
  const { lang } = useLanguageStore();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"role" | "profile">("role");
  const autoRoleApplied = useRef(false);

  const { data: user, isLoading: isUserLoading } = useGetCurrentUser();
  const setRoleMutation = useSetUserRole();
  const updateProfileMutation = useUpdateCurrentUser();

  const profileSchema = z.object({
    name: z.string().min(2, t("onboarding.nameMin")),
    phone: z.string().optional(),
    location: z.string().optional(),
    bio: z.string().optional(),
  });

  type ProfileFormValues = z.infer<typeof profileSchema>;

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
    if (!user) return;

    if (user.onboarded) {
      setLocation(`/${user.role ?? ""}`);
      return;
    }

    if (user.role === "admin") {
      setLocation("/admin");
      return;
    }

    if (!autoRoleApplied.current) {
      const pendingRole = sessionStorage.getItem("fursa_pending_role") as
        | "seeker"
        | "employer"
        | null;

      if (pendingRole === "seeker" || pendingRole === "employer") {
        if (user.role !== pendingRole) {
          autoRoleApplied.current = true;
          setRoleMutation.mutate(
            { data: { role: pendingRole } },
            {
              onSuccess: () => {
                sessionStorage.removeItem("fursa_pending_role");
                setStep("profile");
                form.reset({ name: user.name || "" });
              },
              onError: () => {
                toast.error(t("common.error"));
                autoRoleApplied.current = false;
              },
            },
          );
          return;
        } else {
          sessionStorage.removeItem("fursa_pending_role");
        }
      }
    }

    if (user.role === "seeker" || user.role === "employer") {
      setStep("profile");
      form.reset({
        name: user.name || "",
        phone: user.phone || "",
        location: user.location || "",
        bio: user.bio || "",
      });
      return;
    }
  }, [user]);

  const handleSelectRole = async (role: "seeker" | "employer") => {
    try {
      await setRoleMutation.mutateAsync({ data: { role } });
      sessionStorage.removeItem("fursa_pending_role");
      setStep("profile");
    } catch {
      toast.error(t("common.error"));
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await updateProfileMutation.mutateAsync({ data });
      toast.success(t("onboarding.success"));
      const role = user?.role ?? "seeker";
      setLocation(`/${role}`);
    } catch {
      toast.error(t("common.error"));
    }
  };

  if (isUserLoading || (step === "role" && setRoleMutation.isPending)) {
    return (
      <div className="flex-1 flex items-center justify-center">
      <Helmet>
        <title>{lang === "ar" ? "إعداد الحساب | فُرصة" : "Account Setup | Fursa"}</title>
      </Helmet>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user?.onboarded) {
    return null;
  }

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 bg-muted/20">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Briefcase className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("onboarding.welcome")}
          </h1>
          <p className="text-muted-foreground text-lg">
            {step === "role"
              ? t("onboarding.chooseRole")
              : t("onboarding.completeProfile")}
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
                <h3 className="text-2xl font-bold">
                  {t("onboarding.role.seeker")}
                </h3>
                <p className="text-muted-foreground">
                  {t("onboarding.role.seekerDesc")}
                </p>
                <Button
                  variant="ghost"
                  className="w-full mt-4 group-hover:bg-primary/5"
                  disabled={setRoleMutation.isPending}
                >
                  {setRoleMutation.isPending &&
                  setRoleMutation.variables?.data.role === "seeker" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {t("onboarding.choose")}{" "}
                      <ArrowRight className="ml-2 rtl:mr-2 rtl:ml-0 h-4 w-4 rtl:rotate-180" />
                    </>
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
                <h3 className="text-2xl font-bold">
                  {t("onboarding.role.employer")}
                </h3>
                <p className="text-muted-foreground">
                  {t("onboarding.role.employerDesc")}
                </p>
                <Button
                  variant="ghost"
                  className="w-full mt-4 group-hover:bg-primary/5"
                  disabled={setRoleMutation.isPending}
                >
                  {setRoleMutation.isPending &&
                  setRoleMutation.variables?.data.role === "employer" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {t("onboarding.choose")}{" "}
                      <ArrowRight className="ml-2 rtl:mr-2 rtl:ml-0 h-4 w-4 rtl:rotate-180" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {step === "profile" && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle>{t("onboarding.profileTitle")}</CardTitle>
              <CardDescription>
                {t("onboarding.profileSubtitle")}
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("onboarding.fullName")}{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("onboarding.fullNamePlaceholder")}
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
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("onboarding.phone")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("onboarding.phonePlaceholder")}
                              dir="ltr"
                              className="text-right"
                              {...field}
                            />
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
                          <FormLabel>{t("onboarding.location")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("onboarding.locationPlaceholder")}
                              {...field}
                            />
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
                        <FormLabel>{t("onboarding.bio")}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={
                              user?.role === "employer"
                                ? t("onboarding.bioPlaceholderEmployer")
                                : t("onboarding.bioPlaceholderSeeker")
                            }
                            className="min-h-[120px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      t("onboarding.submit")
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
