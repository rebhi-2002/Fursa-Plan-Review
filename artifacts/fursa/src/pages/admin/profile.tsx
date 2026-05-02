import { useEffect } from "react";
import { Link } from "wouter";
import {
  useGetCurrentUser,
  useUpdateCurrentUser,
  getGetCurrentUserQueryKey,
} from "@workspace/api-client-react";
import { useUser } from "@clerk/react";
import { useT } from "@/lib/i18n";
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
import {
  ChevronLeft,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Globe,
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
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useGetCurrentUser();
  const { user: clerkUser } = useUser();
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
    ? new Date(clerkUser.createdAt).toLocaleDateString()
    : null;

  return (
    <div className="container py-8 max-w-3xl">
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
        <Card className="overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary/80 to-primary" />
          <CardContent className="pt-0">
            <div className="-mt-12 flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className="relative shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user?.name || ""}
                    className="h-24 w-24 rounded-2xl border-4 border-background object-cover shadow-md"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-2xl border-4 border-background bg-primary/20 flex items-center justify-center shadow-md">
                    <ShieldCheck className="h-10 w-10 text-primary" />
                  </div>
                )}
              </div>
              <div className="flex-1 pb-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold">{user?.name || "—"}</h2>
                  <Badge
                    variant="default"
                    className="text-xs bg-primary text-primary-foreground"
                  >
                    {t("role.admin")}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  {primaryEmail && (
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" />
                      {primaryEmail}
                    </span>
                  )}
                  {user?.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {user.location}
                    </span>
                  )}
                  {user?.phone && (
                    <span className="flex items-center gap-1.5 dir-ltr">
                      <Phone className="h-3.5 w-3.5" />
                      {user.phone}
                    </span>
                  )}
                </div>
                {memberSince && (
                  <p className="text-xs text-muted-foreground/70">
                    {t("seeker.profile.memberSince")} {memberSince}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
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

                <div className="flex justify-end gap-4 pt-4 border-t border-border/50">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/admin">{t("common.cancel")}</Link>
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="px-8"
                  >
                    {updateProfileMutation.isPending && (
                      <Loader2 className="mr-2 ms-2 h-4 w-4 animate-spin" />
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
