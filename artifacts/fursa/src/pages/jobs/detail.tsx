import { useState, useEffect } from "react";
import { Link, useRoute, useLocation } from "wouter";
import {
  useGetJob,
  useApplyToJob,
  useSaveJob,
  useUnsaveJob,
  getGetJobQueryKey,
  getListMyApplicationsQueryKey,
  getGetSeekerDashboardQueryKey,
  getListJobsQueryKey,
  getListFeaturedJobsQueryKey,
  ApiError,
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
import {
  MapPin,
  Clock,
  Building2,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  FileText,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useLanguageStore } from "@/lib/i18n";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ObjectUploader } from "@workspace/object-storage-web";
import { useGetCurrentUser } from "@workspace/api-client-react";
import { Label } from "@/components/ui/label";

export default function JobDetail() {
  const t = useT();
  const { lang } = useLanguageStore();
  const [, params] = useRoute("/jobs/:id");
  const jobId = parseInt(params?.id || "0", 10);
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data: job, isLoading, error } = useGetJob(jobId, {
    query: { enabled: !!jobId, queryKey: getGetJobQueryKey(jobId) },
  });
  const { data: user } = useGetCurrentUser();

  const saveMutation = useSaveJob({
    mutation: {
      onSuccess: () => {
        toast.success(t("jobs.saved"));
        queryClient.invalidateQueries({ queryKey: getGetJobQueryKey(jobId) });
      },
    },
  });

  const unsaveMutation = useUnsaveJob({
    mutation: {
      onSuccess: () => {
        toast.success(t("jobs.unsave"));
        queryClient.invalidateQueries({ queryKey: getGetJobQueryKey(jobId) });
      },
    },
  });

  const applyMutation = useApplyToJob({
    mutation: {
      onSuccess: () => {
        toast.success(t("jobs.applySuccess"));
        queryClient.invalidateQueries({ queryKey: getGetJobQueryKey(jobId) });
        queryClient.invalidateQueries({
          queryKey: getListMyApplicationsQueryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: getGetSeekerDashboardQueryKey(),
        });
        queryClient.invalidateQueries({ queryKey: ["/jobs"] });
        queryClient.invalidateQueries({
          queryKey: getListFeaturedJobsQueryKey(),
        });
        setIsApplyOpen(false);
        setLocation("/seeker/applications");
      },
      onError: (error) => {
        const status = error instanceof ApiError ? error.status : 0;
        if (status === 409) {
          toast.error(t("jobs.applyAlreadyApplied"));
        } else if (status === 403) {
          toast.error(t("jobs.applyForbidden"));
        } else if (status === 404) {
          toast.error(t("jobs.applyJobClosed"));
        } else if (status === 401) {
          toast.error(t("jobs.applyNotSignedIn"));
        } else {
          toast.error(t("jobs.applyError"));
        }
      },
    },
  });

  const locale = lang === "ar" ? ar : enUS;
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [cvObjectPath, setCvObjectPath] = useState<string>("");

  useEffect(() => {
    if (user?.cvObjectPath) {
      setCvObjectPath(user.cvObjectPath);
    }
  }, [user?.cvObjectPath]);

  if (isLoading) {
    return (
      <div className="container py-8 max-w-4xl space-y-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-40 w-full" />
        <div className="grid md:grid-cols-3 gap-6">
          <Skeleton className="md:col-span-2 h-60" />
          <Skeleton className="h-60" />
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">{t("common.error")}</h2>
        <p className="text-muted-foreground mb-6">{t("jobs.notAvailable")}</p>
        <Button asChild>
          <Link href="/jobs">{t("jobs.backToJobs")}</Link>
        </Button>
      </div>
    );
  }

  const handleSaveToggle = () => {
    if (!user) {
      toast.error(t("jobs.signInToSave"));
      return;
    }
    if (job.savedByMe) {
      unsaveMutation.mutate({ id: jobId });
    } else {
      saveMutation.mutate({ id: jobId });
    }
  };

  const handleApply = () => {
    if (!user) {
      toast.error(t("jobs.signInToApply"));
      return;
    }
    if (coverLetter.trim().length > 0 && coverLetter.trim().length < 20) {
      toast.error(t("jobs.coverLetterTooShort"));
      return;
    }
    applyMutation.mutate({
      id: jobId,
      data: {
        coverLetter: coverLetter.trim() || null,
        cvObjectPath: cvObjectPath || null,
      },
    });
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
    setCvObjectPath(objectPath);
    return {
      method: "PUT" as const,
      url: uploadURL,
      headers: { "Content-Type": file.type },
    };
  };

  return (
    <div className="container py-8 max-w-5xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          asChild
          className="text-muted-foreground hover:text-foreground"
        >
          <Link href="/jobs">
            <ArrowRight className="h-4 w-4 mr-2 ms-2 rtl:rotate-180" />
            {t("jobs.backToJobs")}
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
                  {job.category}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-primary/20 text-foreground"
                >
                  {t(`jobs.type.${job.type}`)}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground text-sm">
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-2 ms-2 opacity-70" />
                  {job.employerName}
                </div>
                {job.employerLocation && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 ms-2 opacity-70" />
                    {job.employerLocation}
                  </div>
                )}
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 ms-2 opacity-70" />
                  {formatDistanceToNow(new Date(job.createdAt), {
                    addSuffix: true,
                    locale,
                  })}
                </div>
              </div>
            </div>

            {(!user || user.role === "seeker") && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSaveToggle}
                  aria-label={
                    job.savedByMe ? t("jobs.unsave") : t("jobs.save")
                  }
                  className={
                    job.savedByMe
                      ? "text-primary border-primary/50 bg-primary/5"
                      : ""
                  }
                  disabled={saveMutation.isPending || unsaveMutation.isPending}
                >
                  {job.savedByMe ? (
                    <BookmarkCheck className="h-5 w-5" />
                  ) : (
                    <Bookmark className="h-5 w-5" />
                  )}
                </Button>
              </div>
            )}
          </div>

          <div className="prose dark:prose-invert max-w-none prose-p:leading-relaxed">
            <h3>{t("jobs.description")}</h3>
            <div className="whitespace-pre-wrap">{job.description}</div>

            {job.requirements && (
              <>
                <h3 className="mt-8">{t("jobs.requirements")}</h3>
                <div className="whitespace-pre-wrap">{job.requirements}</div>
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-24 border-primary/10 shadow-sm bg-primary/5">
            <CardContent className="p-6">
              {job.appliedByMe ? (
                <div className="bg-primary/10 text-primary p-4 rounded-xl text-center flex flex-col items-center">
                  <BookmarkCheck className="h-8 w-8 mb-2" />
                  <span className="font-bold">{t("jobs.applied")}</span>
                  <Link
                    href="/seeker/applications"
                    className="text-sm underline mt-2"
                  >
                    {t("jobs.viewMyApplications")}
                  </Link>
                </div>
              ) : job.isOpen ? (
                <div className="space-y-4">
                  {job.deadline && (
                    <div className="flex items-center justify-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg mb-4">
                      <Clock className="h-4 w-4" />
                      <span>
                        {t("jobs.deadlineLabel", {
                          date: format(new Date(job.deadline), "PP", {
                            locale,
                          }),
                        })}
                      </span>
                    </div>
                  )}

                  {user?.role !== "employer" && user?.role !== "admin" && (
                    <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
                      <DialogTrigger asChild>
                        <Button
                          className="w-full text-lg h-12 rounded-xl shadow-sm"
                          size="lg"
                        >
                          {t("jobs.applyNow")}
                        </Button>
                      </DialogTrigger>
                      <DialogContent
                        className="sm:max-w-[500px]"
                        dir={lang === "ar" ? "rtl" : "ltr"}
                      >
                        <DialogHeader>
                          <DialogTitle>
                            {t("jobs.applyDialogTitle", { title: job.title })}
                          </DialogTitle>
                          <DialogDescription>
                            {t("jobs.applyDialogDesc")}
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                          <div className="space-y-2">
                            <Label>{t("jobs.coverLetter")}</Label>
                            <Textarea
                              placeholder={t("jobs.coverLetterPlaceholder")}
                              className="min-h-[120px]"
                              value={coverLetter}
                              onChange={(e) => setCoverLetter(e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>{t("jobs.cv")}</Label>
                            {cvObjectPath ? (
                              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-5 w-5 text-primary" />
                                  <span className="text-sm font-medium">
                                    {t("seeker.profile.cvAttached")}
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setCvObjectPath("")}
                                >
                                  {t("jobs.remove")}
                                </Button>
                              </div>
                            ) : (
                              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                                <ObjectUploader
                                  maxFileSize={10485760}
                                  onGetUploadParameters={handleUploadParams}
                                  onComplete={(result) => {
                                    if ((result.successful?.length ?? 0) > 0) {
                                      toast.success(
                                        t("seeker.profile.cvUploadSuccess"),
                                      );
                                    }
                                  }}
                                  buttonClassName="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2"
                                >
                                  {t("jobs.cvPickFile")}
                                </ObjectUploader>
                                <p className="text-xs text-muted-foreground mt-2">
                                  {t("jobs.cvMaxSize")}
                                </p>
                              </div>
                            )}
                          </div>

                          <Button
                            className="w-full"
                            size="lg"
                            onClick={handleApply}
                            disabled={applyMutation.isPending}
                          >
                            {applyMutation.isPending
                              ? t("common.submitting")
                              : t("jobs.confirmSubmit")}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  {!user && (
                    <p className="text-sm text-center text-muted-foreground mt-4">
                      <Link
                        href="/sign-in"
                        className="text-primary hover:underline"
                      >
                        {t("nav.signIn")}
                      </Link>{" "}
                      — {t("jobs.signInToApply")}
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-muted p-4 rounded-xl text-center">
                  <span className="font-bold text-muted-foreground">
                    {t("jobs.closed")}
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("jobs.closedDesc")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t("jobs.contactInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="font-medium">{job.employerName}</div>
                {job.employerLocation && (
                  <div className="text-sm text-muted-foreground">
                    {job.employerLocation}
                  </div>
                )}
              </div>
              {job.employerBio && (
                <div className="text-sm text-muted-foreground">
                  {job.employerBio}
                </div>
              )}
              {job.contactInfo && job.appliedByMe && (
                <div>
                  <div className="text-sm font-medium mb-1">
                    {t("jobs.contactInfo")}:
                  </div>
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {job.contactInfo}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
