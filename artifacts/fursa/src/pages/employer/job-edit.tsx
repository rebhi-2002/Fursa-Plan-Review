import { useState } from "react";
import { Link, useRoute } from "wouter";
import {
  useGetEmployerJob,
  useDeleteEmployerJob,
  useToggleJobOpen,
  useListJobApplications,
  useUpdateApplicationStatus,
  useMarkApplicationSeen,
  useUpdateEmployerJob,
  getGetEmployerJobQueryKey,
  getListJobApplicationsQueryKey,
  JobType,
  UpdateApplicationBodyStatus,
} from "@workspace/api-client-react";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  ChevronLeft,
  Loader2,
  XCircle,
  Trash2,
  Mail,
  MapPin,
  Download,
  Users,
  Pencil,
} from "lucide-react";
import SuggestedCandidates from "@/components/employer/SuggestedCandidates";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useLanguageStore } from "@/lib/i18n";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export default function EmployerJobDetail() {
  const t = useT();
  const { lang } = useLanguageStore();
  const [, params] = useRoute("/employer/jobs/:id");
  const jobId = parseInt(params?.id || "0", 10);
  const queryClient = useQueryClient();
  const locale = lang === "ar" ? ar : enUS;

  const { data: job, isLoading: isJobLoading } = useGetEmployerJob(jobId, {
    query: {
      enabled: !!jobId,
      queryKey: getGetEmployerJobQueryKey(jobId),
    },
  });
  const { data: applications, isLoading: isAppsLoading } =
    useListJobApplications(jobId, {
      query: {
        enabled: !!jobId,
        queryKey: getListJobApplicationsQueryKey(jobId),
      },
    });

  const toggleOpenMutation = useToggleJobOpen({
    mutation: {
      onSuccess: () => {
        toast.success(t("employer.jobDetail.statusUpdated"));
        queryClient.invalidateQueries({
          queryKey: getGetEmployerJobQueryKey(jobId),
        });
      },
    },
  });

  const deleteMutation = useDeleteEmployerJob({
    mutation: {
      onSuccess: () => {
        toast.success(t("employer.jobDetail.deleted"));
        window.location.href = "/employer/jobs";
      },
    },
  });

  const updateAppStatusMutation = useUpdateApplicationStatus({
    mutation: {
      onSuccess: () => {
        toast.success(t("employer.applications.statusUpdated"));
        queryClient.invalidateQueries({
          queryKey: getListJobApplicationsQueryKey(jobId),
        });
      },
    },
  });

  const markSeenMutation = useMarkApplicationSeen({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getListJobApplicationsQueryKey(jobId),
        });
        queryClient.invalidateQueries({
          queryKey: getGetEmployerJobQueryKey(jobId),
        });
      },
    },
  });

  const updateJobMutation = useUpdateEmployerJob({
    mutation: {
      onSuccess: () => {
        toast.success(t("employer.jobDetail.editSuccess"));
        setIsEditOpen(false);
        queryClient.invalidateQueries({
          queryKey: getGetEmployerJobQueryKey(jobId),
        });
      },
      onError: () => {
        toast.error(t("common.error"));
      },
    },
  });

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const editSchema = z.object({
    title: z.string().min(5, t("employer.newJob.validation.title")),
    description: z.string().min(20, t("employer.newJob.validation.desc")),
    requirements: z.string().optional(),
    type: z.nativeEnum(JobType, {
      required_error: t("employer.newJob.validation.type"),
    }),
    category: z.string().min(2, t("employer.newJob.validation.cat")),
    contactInfo: z.string().min(5, t("employer.newJob.validation.contact")),
    deadline: z.string().optional(),
  });

  type EditFormValues = z.infer<typeof editSchema>;

  const editForm = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: job?.title || "",
      description: job?.description || "",
      requirements: job?.requirements || "",
      type: (job?.type as JobType) || "online",
      category: job?.category || "",
      contactInfo: job?.contactInfo || "",
      deadline: job?.deadline
        ? job.deadline.split("T")[0]
        : "",
    },
  });

  const handleOpenEdit = () => {
    if (job) {
      editForm.reset({
        title: job.title,
        description: job.description,
        requirements: job.requirements || "",
        type: job.type as JobType,
        category: job.category,
        contactInfo: job.contactInfo,
        deadline: job.deadline ? job.deadline.split("T")[0] : "",
      });
    }
    setIsEditOpen(true);
  };

  const onEditSubmit = async (data: EditFormValues) => {
    updateJobMutation.mutate({
      id: jobId,
      data: {
        ...data,
        deadline: data.deadline
          ? new Date(data.deadline).toISOString()
          : undefined,
      },
    });
  };

  const handleToggleOpen = () => {
    toggleOpenMutation.mutate({ id: jobId });
  };

  const handleDelete = () => {
    deleteMutation.mutate({ id: jobId });
  };

  const handleUpdateStatus = (appId: number, status: UpdateApplicationBodyStatus) => {
    updateAppStatusMutation.mutate({ id: appId, data: { status } });
  };

  const handleViewApplication = (appId: number, seen: boolean) => {
    if (!seen) {
      markSeenMutation.mutate({ id: appId });
    }
  };

  if (isJobLoading) {
    return (
      <div className="container py-8 max-w-5xl space-y-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">{t("common.error")}</h2>
        <p className="text-muted-foreground mb-6">
          {t("employer.jobDetail.notFound")}
        </p>
        <Button asChild>
          <Link href="/employer/jobs">
            {t("employer.jobDetail.backToJobs")}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-5xl">
      <div className="mb-6 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="rounded-full"
        >
          <Link href="/employer/jobs">
            <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("employer.jobDetail.title")}
          </h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
                      {job.category}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-muted/50 border-0"
                    >
                      {t(`jobs.type.${job.type}`)}
                    </Badge>
                    {job.status === "pending" && (
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-800 border-amber-200"
                      >
                        {t("employer.jobs.statusPending")}
                      </Badge>
                    )}
                    {job.status === "rejected" && (
                      <Badge
                        variant="destructive"
                        className="bg-red-100 text-red-800 border-red-200"
                      >
                        {t("employer.jobs.statusRejected")}
                      </Badge>
                    )}
                    {job.status === "approved" && !job.isOpen && (
                      <Badge variant="secondary">
                        {t("employer.jobs.statusClosed")}
                      </Badge>
                    )}
                    {job.status === "approved" && job.isOpen && (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
                        {t("employer.jobs.statusActive")}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl">{job.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {job.status === "rejected" && job.rejectionReason && (
                <div className="bg-red-50 text-red-800 p-4 rounded-lg border border-red-100 flex items-start gap-3">
                  <XCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold mb-1">
                      {t("employer.jobDetail.rejectedTitle")}
                    </h4>
                    <p>{job.rejectionReason}</p>
                  </div>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {t("employer.jobDetail.postedDate")}
                  </p>
                  <p>{format(new Date(job.createdAt), "PPP", { locale })}</p>
                </div>
                {job.deadline && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {t("employer.jobDetail.deadline")}
                    </p>
                    <p>
                      {format(new Date(job.deadline), "PPP", { locale })}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  {t("employer.jobDetail.description")}
                </h4>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {job.description}
                </p>
              </div>

              {job.requirements && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    {t("employer.jobDetail.requirements")}
                  </h4>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {job.requirements}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t("employer.jobDetail.manage")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="is-open" className="text-base">
                    {t("employer.jobDetail.acceptingApps")}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {t("employer.jobDetail.acceptingAppsHint")}
                  </p>
                </div>
                <Switch
                  id="is-open"
                  checked={job.isOpen}
                  onCheckedChange={handleToggleOpen}
                  disabled={
                    job.status !== "approved" ||
                    toggleOpenMutation.isPending
                  }
                />
              </div>

              <div className="pt-4 border-t border-border/50 space-y-3">
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleOpenEdit}
                    >
                      <Pencil className="mr-2 ms-2 h-4 w-4" />
                      {t("employer.jobDetail.edit")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
                    dir={lang === "ar" ? "rtl" : "ltr"}
                  >
                    <DialogHeader>
                      <DialogTitle>{t("employer.jobDetail.editTitle")}</DialogTitle>
                      <DialogDescription>
                        {t("employer.jobDetail.editDesc")}
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...editForm}>
                      <form
                        onSubmit={editForm.handleSubmit(onEditSubmit)}
                        className="space-y-5 mt-2"
                      >
                        <FormField
                          control={editForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("employer.newJob.jobTitle")}{" "}
                                <span className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="bg-background"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid sm:grid-cols-2 gap-4">
                          <FormField
                            control={editForm.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {t("employer.newJob.field")}{" "}
                                  <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    className="bg-background"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={editForm.control}
                            name="type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {t("employer.newJob.workType")}{" "}
                                  <span className="text-destructive">*</span>
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="bg-background">
                                      <SelectValue />
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
                          control={editForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("employer.newJob.descLabel")}{" "}
                                <span className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  className="min-h-[120px] resize-none bg-background"
                                  {...field}
                                />
                              </FormControl>
                              <p className="text-xs text-muted-foreground text-end">
                                {field.value?.length ?? 0} {t("common.chars")}
                              </p>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={editForm.control}
                          name="requirements"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("employer.newJob.reqLabel")}</FormLabel>
                              <FormControl>
                                <Textarea
                                  className="min-h-[80px] resize-none bg-background"
                                  {...field}
                                />
                              </FormControl>
                              <p className="text-xs text-muted-foreground text-end">
                                {field.value?.length ?? 0} {t("common.chars")}
                              </p>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid sm:grid-cols-2 gap-4">
                          <FormField
                            control={editForm.control}
                            name="contactInfo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {t("employer.newJob.contactLabel")}{" "}
                                  <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
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
                            control={editForm.control}
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

                        <DialogFooter className="pt-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditOpen(false)}
                          >
                            {t("common.cancel")}
                          </Button>
                          <Button
                            type="submit"
                            disabled={updateJobMutation.isPending}
                          >
                            {updateJobMutation.isPending && (
                              <Loader2 className="mr-2 ms-2 h-4 w-4 animate-spin" />
                            )}
                            {t("common.save")}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={isDeleteDialogOpen}
                  onOpenChange={setIsDeleteDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="mr-2 ms-2 h-4 w-4" />
                      {t("employer.jobDetail.delete")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent dir={lang === "ar" ? "rtl" : "ltr"}>
                    <DialogHeader>
                      <DialogTitle>
                        {t("employer.jobDetail.deleteConfirm")}
                      </DialogTitle>
                      <DialogDescription>
                        {t("employer.jobDetail.deleteConfirmDesc")}
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsDeleteDialogOpen(false)}
                      >
                        {t("common.cancel")}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending && (
                          <Loader2 className="mr-2 ms-2 h-4 w-4 animate-spin" />
                        )}
                        {t("employer.jobDetail.confirmDelete")}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground border-0 shadow-md">
            <CardContent className="p-6 text-center">
              <Users className="h-10 w-10 mx-auto mb-3 opacity-80" />
              <div className="text-4xl font-bold mb-1">
                {job.applicationsCount}
              </div>
              <p className="text-primary-foreground/80 font-medium">
                {t("employer.jobDetail.totalApplicants")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">
        {t("employer.jobDetail.applicantsList")}
      </h2>

      {isAppsLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : applications && applications.length > 0 ? (
        <div className="grid gap-4">
          {applications.map((app) => (
            <Card
              key={app.id}
              className={
                !app.seenByEmployer
                  ? "border-primary/50 bg-primary/[0.02]"
                  : ""
              }
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-lg font-bold">
                            {app.applicantName}
                          </h3>
                          {!app.seenByEmployer && (
                            <Badge className="bg-primary hover:bg-primary px-1.5 py-0 text-[10px]">
                              {t("employer.applications.new")}
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-2">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 ms-2 opacity-70" />
                            {app.applicantEmail}
                          </div>
                          {app.applicantPhone && (
                            <div className="flex items-center">
                              <span dir="ltr">{app.applicantPhone}</span>
                            </div>
                          )}
                          {app.applicantLocation && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 ms-2 opacity-70" />
                              {app.applicantLocation}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {(app.applicantBio || app.coverLetter) && (
                      <div className="bg-background rounded-lg p-4 text-sm border space-y-4">
                        {app.applicantBio && (
                          <div>
                            <span className="font-semibold text-foreground block mb-1">
                              {t("employer.applications.bio")}
                            </span>
                            <p className="text-muted-foreground">
                              {app.applicantBio}
                            </p>
                          </div>
                        )}
                        {app.coverLetter && (
                          <div>
                            <span className="font-semibold text-foreground block mb-1">
                              {t("employer.applications.coverLetterLabel")}
                            </span>
                            <p className="text-muted-foreground italic whitespace-pre-wrap">
                              "{app.coverLetter}"
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 md:w-56 shrink-0 border-t md:border-t-0 md:border-r rtl:md:border-l rtl:md:border-r-0 pt-4 md:pt-0 rtl:md:pl-6 md:pr-6 border-border/50">
                    <div className="space-y-1.5 mb-2">
                      <Label className="text-xs text-muted-foreground">
                        {t("employer.applications.appStatus")}
                      </Label>
                      <Select
                        value={app.status}
                        onValueChange={(val: string) => {
                          handleUpdateStatus(app.id, val as UpdateApplicationBodyStatus);
                          if (!app.seenByEmployer)
                            handleViewApplication(app.id, app.seenByEmployer);
                        }}
                      >
                        <SelectTrigger
                          className={`w-full ${
                            app.status === "accepted"
                              ? "border-green-200 bg-green-50 text-green-800"
                              : app.status === "rejected"
                                ? "border-red-200 bg-red-50 text-red-800"
                                : ""
                          }`}
                        >
                          <SelectValue
                            placeholder={t(
                              "employer.applications.changeStatus",
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent
                          dir={lang === "ar" ? "rtl" : "ltr"}
                        >
                          <SelectItem value="accepted">
                            {t("employer.applications.statusAccepted")}
                          </SelectItem>
                          <SelectItem value="rejected">
                            {t("employer.applications.statusRejected")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {app.cvObjectPath && (
                      <Button
                        variant="outline"
                        asChild
                        className="w-full text-primary hover:text-primary hover:bg-primary/5"
                        onClick={() =>
                          handleViewApplication(app.id, app.seenByEmployer)
                        }
                      >
                        <a
                          href={`/api/storage/objects/${(app.cvObjectPath ?? "").replace(/^\/objects\//, "")}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Download className="mr-2 ms-2 h-4 w-4" />
                          {t("employer.applications.downloadCv")}
                        </a>
                      </Button>
                    )}

                    {!app.seenByEmployer && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() =>
                          handleViewApplication(app.id, app.seenByEmployer)
                        }
                      >
                        {t("employer.applications.markRead")}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed bg-muted/20">
          <CardContent className="p-12 text-center flex flex-col items-center">
            <Users className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {t("employer.applications.empty")}
            </h3>
            <p className="text-muted-foreground">
              {t("employer.applications.emptyDesc")}
            </p>
          </CardContent>
        </Card>
      )}

      <SuggestedCandidates jobId={jobId} />
    </div>
  );
}
