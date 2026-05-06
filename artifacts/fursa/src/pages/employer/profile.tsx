import { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  useGetCurrentUser,
  useUpdateCurrentUser,
  getGetCurrentUserQueryKey,
} from "@workspace/api-client-react";
import { useUser, useClerk } from "@clerk/react";
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
  Building2,
  Globe,
  ShieldCheck,
  Trash2,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";

export default function EmployerProfile() {
  const t = useT();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const { data: user, isLoading } = useGetCurrentUser();
  const { user: clerkUser } = useUser();
  const { openUserProfile, signOut } = useClerk();
  const updateProfileMutation = useUpdateCurrentUser();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const profileSchema = z.object({
    name: z.string().min(2, t("onboarding.nameMin")),
    phone: z.string().optional(),
    location: z.string().optional(),
    website: z.string().url({ message: t("employer.profile.websiteInvalid") }).or(z.literal("")).optional(),
    bio: z.string().optional(),
  });

  type ProfileFormValues = z.infer<typeof profileSchema>;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", phone: "", location: "", website: "", bio: "" },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        phone: user.phone || "",
        location: user.location || "",
        website: user.website || "",
        bio: user.bio || "",
      });
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await updateProfileMutation.mutateAsync({ data: { ...data, website: data.website || null } });
      toast.success(t("employer.profile.updateSuccess"));
      queryClient.invalidateQueries({ queryKey: getGetCurrentUserQueryKey() });
    } catch {
      toast.error(t("common.error"));
    }
  };

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/me", { method: "DELETE" });
      if (!res.ok && res.status !== 204) throw new Error("Failed to delete account");
    },
    onSuccess: async () => {
      toast.success(t("profile.deleteAccount.success"));
      await signOut();
      setLocation("/");
    },
    onError: () => {
      toast.error(t("common.error"));
    },
  });

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
          <Link href="/employer">
            <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("employer.profile.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("employer.profile.subtitle")}</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-indigo-500/80 to-indigo-600" />
          <CardContent className="pt-0">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="relative shrink-0 -mt-12">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={user?.name || ""} className="h-24 w-24 rounded-2xl border-4 border-background object-cover shadow-md" />
                ) : (
                  <div className="h-24 w-24 rounded-2xl border-4 border-background bg-indigo-100 flex items-center justify-center shadow-md">
                    <Building2 className="h-10 w-10 text-indigo-500" />
                  </div>
                )}
              </div>
              <div className="flex-1 pb-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold">{user?.name || "—"}</h2>
                  <Badge variant="secondary" className="text-xs bg-indigo-100 text-indigo-800 border-indigo-200">
                    {t("onboarding.role.employer")}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  {primaryEmail && (
                    <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{primaryEmail}</span>
                  )}
                  {user?.location && (
                    <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{user.location}</span>
                  )}
                  {user?.phone && (
                    <span className="flex items-center gap-1.5 dir-ltr"><Phone className="h-3.5 w-3.5" />{user.phone}</span>
                  )}
                  {user?.website && (
                    <a href={user.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-primary hover:underline">
                      <Globe className="h-3.5 w-3.5" />
                      {user.website.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                </div>
                {memberSince && (
                  <p className="text-xs text-muted-foreground/70">{t("seeker.profile.memberSince")} {memberSince}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("employer.profile.companyInfo")}</CardTitle>
            <CardDescription>{t("employer.profile.companyInfoDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("employer.profile.companyName")} <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input {...field} className="bg-background" /></FormControl>
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
                          <Input dir="ltr" className="text-right bg-background" placeholder={t("onboarding.phonePlaceholder")} {...field} />
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
                          <Input {...field} className="bg-background" placeholder={t("onboarding.locationPlaceholder")} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("employer.profile.website")}</FormLabel>
                      <FormControl>
                        <Input dir="ltr" className="bg-background" placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormDescription>{t("employer.profile.websiteDesc")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("employer.profile.companyBio")}</FormLabel>
                      <FormControl>
                        <Textarea className="min-h-[130px] resize-none bg-background" placeholder={t("onboarding.bioPlaceholderEmployer")} {...field} />
                      </FormControl>
                      <FormDescription>{t("employer.profile.bioDesc")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-4 pt-4 border-t border-border/50">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/employer">{t("common.cancel")}</Link>
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

        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <CardTitle>{t("profile.security.title")}</CardTitle>
            </div>
            <CardDescription>{t("profile.security.desc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => openUserProfile()}>
              {t("profile.security.manageBtn")}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-destructive/40">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              <CardTitle className="text-destructive">{t("profile.deleteAccount.title")}</CardTitle>
            </div>
            <CardDescription>{t("profile.deleteAccount.desc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              className="bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => setShowDeleteDialog(true)}
            >
              {t("profile.deleteAccount.btn")}
            </Button>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("profile.deleteAccount.confirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("profile.deleteAccount.confirmDesc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteAccountMutation.mutate()}
              disabled={deleteAccountMutation.isPending}
            >
              {deleteAccountMutation.isPending && <Loader2 className="mr-2 ms-2 h-4 w-4 animate-spin" />}
              {t("profile.deleteAccount.confirmBtn")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
