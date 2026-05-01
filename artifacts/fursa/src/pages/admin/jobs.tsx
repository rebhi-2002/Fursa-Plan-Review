import { useState } from "react";
import { Link } from "wouter";
import {
  useListAdminJobs,
  useApproveJob,
  useRejectJob,
  useAdminDeleteJob,
  getListAdminJobsQueryKey,
  getGetAdminDashboardQueryKey,
} from "@workspace/api-client-react";
import { ListAdminJobsStatus } from "@workspace/api-client-react";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  Building2,
  Loader2,
  ExternalLink,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useLanguageStore } from "@/lib/i18n";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const ALL = "all";

export default function AdminJobs() {
  const t = useT();
  const { lang } = useLanguageStore();
  const locale = lang === "ar" ? ar : enUS;
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState<ListAdminJobsStatus | typeof ALL>(
    "pending",
  );
  const [rejectReason, setRejectReason] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  const { data: jobs, isLoading } = useListAdminJobs({
    status: statusFilter === ALL ? undefined : statusFilter,
  });

  const approveMutation = useApproveJob({
    mutation: {
      onSuccess: () => {
        toast.success(t("admin.jobs.approveSuccess"));
        queryClient.invalidateQueries({ queryKey: getListAdminJobsQueryKey() });
        queryClient.invalidateQueries({
          queryKey: getGetAdminDashboardQueryKey(),
        });
      },
      onError: () => toast.error(t("common.error")),
    },
  });

  const rejectMutation = useRejectJob({
    mutation: {
      onSuccess: () => {
        toast.success(t("admin.jobs.rejectSuccess"));
        setIsRejectOpen(false);
        setRejectReason("");
        setSelectedJobId(null);
        queryClient.invalidateQueries({ queryKey: getListAdminJobsQueryKey() });
        queryClient.invalidateQueries({
          queryKey: getGetAdminDashboardQueryKey(),
        });
      },
      onError: () => toast.error(t("common.error")),
    },
  });

  const deleteMutation = useAdminDeleteJob({
    mutation: {
      onSuccess: () => {
        toast.success(t("admin.jobs.deleteSuccess"));
        queryClient.invalidateQueries({ queryKey: getListAdminJobsQueryKey() });
        queryClient.invalidateQueries({
          queryKey: getGetAdminDashboardQueryKey(),
        });
      },
      onError: () => toast.error(t("common.error")),
    },
  });

  const handleApprove = (id: number) => {
    approveMutation.mutate({ data: { id } });
  };

  const handleReject = () => {
    if (selectedJobId && rejectReason.trim().length >= 5) {
      rejectMutation.mutate({
        data: { id: selectedJobId, data: { reason: rejectReason } },
      });
    } else {
      toast.error(t("admin.jobs.rejectMinLength"));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
            <CheckCircle2 className="h-3 w-3 ml-1 rtl:mr-1 rtl:ml-0" />{" "}
            {t("admin.jobs.statusApproved")}
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="destructive"
            className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200"
          >
            <XCircle className="h-3 w-3 ml-1 rtl:mr-1 rtl:ml-0" />{" "}
            {t("admin.jobs.statusRejected")}
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-800 border-amber-200"
          >
            <Clock className="h-3 w-3 ml-1 rtl:mr-1 rtl:ml-0" />{" "}
            {t("admin.jobs.statusPending")}
          </Badge>
        );
    }
  };

  return (
    <div className="container py-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="rounded-full hidden sm:flex"
          >
            <Link href="/admin">
              <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("admin.jobs.title")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t("admin.jobs.subtitle")}
            </p>
          </div>
        </div>

        <Select
          value={statusFilter}
          onValueChange={(val) =>
            setStatusFilter(val as ListAdminJobsStatus | typeof ALL)
          }
        >
          <SelectTrigger className="w-full sm:w-[200px] bg-background">
            <SelectValue placeholder={t("admin.jobs.filterStatus")} />
          </SelectTrigger>
          <SelectContent dir={lang === "ar" ? "rtl" : "ltr"}>
            <SelectItem value={ALL}>{t("admin.jobs.filterAll")}</SelectItem>
            <SelectItem value="pending">
              {t("admin.jobs.filterPending")}
            </SelectItem>
            <SelectItem value="approved">
              {t("admin.jobs.filterApproved")}
            </SelectItem>
            <SelectItem value="rejected">
              {t("admin.jobs.filterRejected")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))
        ) : jobs && jobs.length > 0 ? (
          jobs.map((job) => (
            <Card
              key={job.id}
              className={`border-border/50 ${
                job.status === "pending"
                  ? "border-l-4 rtl:border-r-4 rtl:border-l-0 border-l-amber-500 rtl:border-r-amber-500"
                  : ""
              }`}
            >
              <CardContent className="p-5 flex flex-col md:flex-row gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {getStatusBadge(job.status)}
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary border-0"
                        >
                          {job.category}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold">{job.title}</h3>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-3 rounded-lg grid sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Building2 className="h-4 w-4 mr-2 ms-2" />
                      <span className="font-medium text-foreground">
                        {job.employerName}
                      </span>
                    </div>
                    <div className="text-muted-foreground truncate" dir="ltr">
                      {job.employerEmail}
                    </div>
                  </div>

                  <div className="text-sm">
                    <p className="line-clamp-2 text-muted-foreground leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  {job.status === "rejected" && job.rejectionReason && (
                    <div className="bg-red-50 text-red-800 text-sm p-3 rounded-md border border-red-100 flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block mb-1">
                          {t("admin.jobs.rejectionReason")}
                        </span>
                        {job.rejectionReason}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 md:w-48 shrink-0 border-t md:border-t-0 md:border-r rtl:md:border-l rtl:md:border-r-0 border-border/50 pt-4 md:pt-0 rtl:md:pl-6 md:pr-6">
                  <div className="text-xs text-center text-muted-foreground mb-1">
                    {t("admin.jobs.publishedAt", {
                      date: formatDistanceToNow(new Date(job.createdAt), {
                        addSuffix: true,
                        locale,
                      }),
                    })}
                  </div>

                  {job.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(job.id)}
                        disabled={approveMutation.isPending}
                      >
                        <CheckCircle2 className="mr-2 ms-2 h-4 w-4" />
                        {t("admin.jobs.approve")}
                      </Button>

                      <Dialog
                        open={isRejectOpen && selectedJobId === job.id}
                        onOpenChange={(open) => {
                          setIsRejectOpen(open);
                          if (!open) {
                            setRejectReason("");
                            setSelectedJobId(null);
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="w-full"
                            onClick={() => setSelectedJobId(job.id)}
                          >
                            <XCircle className="mr-2 ms-2 h-4 w-4" />
                            {t("admin.jobs.reject")}
                          </Button>
                        </DialogTrigger>
                        <DialogContent dir={lang === "ar" ? "rtl" : "ltr"}>
                          <DialogHeader>
                            <DialogTitle>
                              {t("admin.jobs.rejectDialog.title", {
                                title: job.title,
                              })}
                            </DialogTitle>
                            <DialogDescription>
                              {t("admin.jobs.rejectDialog.desc")}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>
                                {t("admin.jobs.rejectDialog.label")}{" "}
                                <span className="text-destructive">*</span>
                              </Label>
                              <Textarea
                                placeholder={t(
                                  "admin.jobs.rejectDialog.placeholder",
                                )}
                                value={rejectReason}
                                onChange={(e) =>
                                  setRejectReason(e.target.value)
                                }
                                className="min-h-[100px] resize-none"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setIsRejectOpen(false)}
                            >
                              {t("common.cancel")}
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleReject}
                              disabled={
                                rejectMutation.isPending ||
                                rejectReason.trim().length < 5
                              }
                            >
                              {rejectMutation.isPending && (
                                <Loader2 className="mr-2 ms-2 h-4 w-4 animate-spin" />
                              )}
                              {t("admin.jobs.rejectDialog.confirm")}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}

                  {job.status === "approved" && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full"
                    >
                      <Link href={`/jobs/${job.id}`}>
                        <ExternalLink className="mr-2 ms-2 h-4 w-4" />
                        {t("admin.jobs.viewOnSite")}
                      </Link>
                    </Button>
                  )}

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="mr-2 ms-2 h-4 w-4" />
                        {t("admin.jobs.delete")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent dir={lang === "ar" ? "rtl" : "ltr"}>
                      <DialogHeader>
                        <DialogTitle>
                          {t("admin.jobs.deleteConfirmTitle")}
                        </DialogTitle>
                        <DialogDescription>
                          {t("admin.jobs.deleteConfirmDesc")}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="bg-muted/40 rounded-md p-3 text-sm">
                        <div className="font-medium">{job.title}</div>
                        <div className="text-muted-foreground">
                          {job.employerName}
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="destructive"
                          onClick={() =>
                            deleteMutation.mutate({ data: { id: job.id } })
                          }
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending && (
                            <Loader2 className="mr-2 ms-2 h-4 w-4 animate-spin" />
                          )}
                          {t("admin.jobs.deleteConfirm")}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-dashed bg-muted/20">
            <CardContent className="p-12 text-center flex flex-col items-center">
              <CheckCircle2 className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {t("admin.jobs.empty")}
              </h3>
              <p className="text-muted-foreground">
                {t("admin.jobs.emptyDesc")}
              </p>
              {statusFilter !== ALL && (
                <Button
                  variant="link"
                  onClick={() => setStatusFilter(ALL)}
                  className="mt-4"
                >
                  {t("admin.dashboard.viewAllJobs")}
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
