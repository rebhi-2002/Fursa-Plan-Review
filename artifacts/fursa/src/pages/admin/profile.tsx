import { useEffect } from "react";
import { Link } from "wouter";
import {
  useGetCurrentUser,
  useUpdateCurrentUser,
  useGetAdminDashboard,
  getGetCurrentUserQueryKey,
} from "@workspace/api-client-react";
import { useUser } from "@clerk/react";
import { useT, useLanguageStore } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Users,
  Briefcase,
  FileText,
  Clock,
  LayoutDashboard,
  Lock,
} from "lucide-react";
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

export default function AdminProfile() {
  const t = useT();
  const { lang } = useLanguageStore();
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useGetCurrentUser();
  const { user: clerkUser } = useUser();
  const { data: dashStats } = useGetAdminDashboard();
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
    defaultValues: { name: "", phone: "", location: "", bio: "" },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        phone: user.phone || "",
        location: user.location || "",
        bio: user.bio || "",
      });
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await updateProfileMutation.mutateAsync({ data });
      toast.success(t("admin.profile.updateSuccess"));
      queryClient.invalidateQueries({ queryKey: getGetCurrentUserQueryKey() });
    } catch {
      toast.error(t("common.error"));
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const avatarUrl = clerkUser?.imageUrl;
  const primaryEmail = clerkUser?.primaryEmailAddress?.emailAddress;
  const memberSince = clerkUser?.createdAt
    ? new Date(clerkUser.createdAt).toLocaleDateString(
        lang === "ar" ? "ar-SA" : "en-US",
        { year: "numeric", month: "long", day: "numeric" }
      )
    : null;

  const statCards = [
    {
      icon: Users,
      value: dashStats?.totalUsers ?? "—",
      label: t("admin.profile.statUsers"),
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: Briefcase,
      value: dashStats?.totalJobs ?? "—",
      label: t("admin.profile.statJobs"),
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      icon: Clock,
      value: dashStats?.pendingJobs ?? "—",
      label: t("admin.profile.statPending"),
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      icon: FileText,
      value: dashStats?.totalApplications ?? "—",
      label: t("admin.profile.statApplications"),
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
  ];

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/admin">
            <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("admin.profile.title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("admin.profile.subtitle")}
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Hero card */}
        <Card className="overflow-hidden border-0 shadow-md">
          <div className="h-32 bg-gradient-to-br from-primary via-primary/90 to-indigo-700 relative">
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, white 0px, white 1px, transparent 0, transparent 50%)",
                backgroundSize: "16px 16px",
              }}
            />
          </div>
          <CardContent className="pt-0 pb-6 px-6">
            <div className="-mt-14 flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <div className="relative shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user?.name || ""}
                    className="h-28 w-28 rounded-2xl border-4 border-background object-cover shadow-lg"
                  />
                ) : (
                  <div className="h-28 w-28 rounded-2xl border-4 border-background bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center shadow-lg">
                    <ShieldCheck className="h-12 w-12 text-primary" />
                  </div>
                )}
                <span className="absolute -bottom-1.5 -end-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary shadow border-2 border-background">
                  <ShieldCheck className="h-3.5 w-3.5 text-white" />
                </span>
              </div>

              <div className="flex-1 pb-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl font-bold leading-tight">
                    {user?.name || "—"}
                  </h2>
                  <Badge className="bg-primary text-primary-foreground text-xs shrink-0">
                    {t("admin.profile.platformAdmin")}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
                  {primaryEmail && (
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 opacity-70" />
                      <span dir="ltr">{primaryEmail}</span>
                    </span>
                  )}
                  {user?.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 opacity-70" />
                      {user.location}
                    </span>
                  )}
                  {user?.phone && (
                    <span className="flex items-center gap-1.5" dir="ltr">
                      <Phone className="h-3.5 w-3.5 opacity-70" />
                      {user.phone}
                    </span>
                  )}
                  {memberSince && (
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
                      <Clock className="h-3.5 w-3.5 opacity-60" />
                      {t("admin.profile.adminSince")} {memberSince}
                    </span>
                  )}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="shrink-0 hidden sm:flex"
                asChild
              >
                <Link href="/admin">
                  <LayoutDashboard className="h-4 w-4 me-2" />
                  {t("admin.profile.gotoDashboard")}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Platform stats */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
            {t("admin.profile.statsTitle")}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {statCards.map((s) => (
              <Card key={s.label} className="border-border/40 shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                    <s.icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-muted-foreground leading-tight">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="border-border/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t("admin.profile.quickLinks")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/users">
                <Users className="h-4 w-4 me-2" />
                {t("admin.profile.gotoUsers")}
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/jobs">
                <Briefcase className="h-4 w-4 me-2" />
                {t("admin.profile.gotoJobs")}
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Account info (read-only) */}
        <Card className="border-border/40">
          <CardHeader className="pb-3">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-base">{t("admin.profile.securitySection")}</CardTitle>
                <CardDescription className="text-sm mt-0.5">
                  {t("admin.profile.securityDesc")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {t("admin.profile.emailLabel")}
                </p>
                <p className="text-sm font-medium" dir="ltr">
                  {primaryEmail || "—"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {t("admin.profile.roleLabel")}
                </p>
                <Badge variant="default" className="bg-primary text-primary-foreground text-xs">
                  {t("admin.profile.platformAdmin")}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit form */}
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>{t("admin.profile.basicInfo")}</CardTitle>
            <CardDescription>{t("admin.profile.basicInfoDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        <FormLabel>{t("onboarding.phone")}</FormLabel>
                        <FormControl>
                          <Input
                            dir="ltr"
                            className="text-right bg-background"
                            placeholder={t("onboarding.phonePlaceholder")}
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
                            {...field}
                            className="bg-background"
                            placeholder={t("onboarding.locationPlaceholder")}
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
                      <FormLabel>{t("admin.profile.bio")}</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[100px] resize-none bg-background"
                          placeholder={t("admin.profile.bioPlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("admin.profile.bioDesc")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/admin">{t("common.cancel")}</Link>
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="px-8"
                  >
                    {updateProfileMutation.isPending && (
                      <Loader2 className="me-2 h-4 w-4 animate-spin" />
                    )}
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
