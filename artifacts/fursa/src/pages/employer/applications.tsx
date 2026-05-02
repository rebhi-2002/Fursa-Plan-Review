import { useRef, useEffect, useState } from "react";
import { type ReactNode } from "react";
import { Link, useRoute, useLocation } from "wouter";
import {
  useListJobApplications,
  useGetEmployerJob,
  useUpdateApplicationStatus,
  useMarkApplicationSeen,
  getListJobApplicationsQueryKey,
  getGetEmployerJobQueryKey,
} from "@workspace/api-client-react";
import type { EmployerApplication } from "@workspace/api-client-react";
import { useT, useLanguageStore } from "@/lib/i18n";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ChevronLeft,
  Users,
  FileText,
  Download,
  CheckCircle2,
  XCircle,
  MapPin,
  Phone,
  Mail,
  Clock,
  User,
} from "lucide-react";
import { format } from "date-fns";
import type { Locale } from "date-fns";
import { ar, enUS } from "date-fns/locale";

type StatusFilter = "all" | "pending" | "accepted" | "rejected";

export default function EmployerApplications() {
  const t = useT();
  const { lang } = useLanguageStore();
  const locale = lang === "ar" ? ar : enUS;
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [, params] = useRoute("/employer/jobs/:id/applications");
  const jobId = parseInt(params?.id ?? "");

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const markedSeenRef = useRef(false);
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  const { data: job } = useGetEmployerJob(jobId, {
    query: { enabled: !isNaN(jobId) },
  });
  const { data: applications, isLoading } = useListJobApplications(jobId, {
    query: { enabled: !isNaN(jobId) },
  });
  const updateStatusMutation = useUpdateApplicationStatus();
  const markSeenMutation = useMarkApplicationSeen();

  useEffect(() => {
    if (isNaN(jobId)) setLocation("/employer/jobs");
  }, [jobId]);

  useEffect(() => {
    if (!applications || markedSeenRef.current) return;
    markedSeenRef.current = true;
    applications
      .filter((a) => !a.seenByEmployer)
      .forEach((a) => markSeenMutation.mutate({ id: a.id }));
  }, [applications]);

  const handleUpdateStatus = (appId: number, status: "accepted" | "rejected") => {
    updateStatusMutation.mutate(
      { id: appId, data: { status } },
      {
        onSuccess: () => {
          toast.success(
            status === "accepted"
              ? t("employer.applications.acceptSuccess")
              : t("employer.applications.rejectSuccess"),
          );
          queryClient.invalidateQueries({
            queryKey: getListJobApplicationsQueryKey(jobId),
          });
          queryClient.invalidateQueries({
            queryKey: getGetEmployerJobQueryKey(jobId),
          });
        },
        onError: () => toast.error(t("common.error")),
      },
    );
  };

  const counts = {
    all: applications?.length ?? 0,
    pending: applications?.filter((a) => a.status === "pending").length ?? 0,
    accepted: applications?.filter((a) => a.status === "accepted").length ?? 0,
    rejected: applications?.filter((a) => a.status === "rejected").length ?? 0,
  };

  const filtered =
    applications?.filter(
      (a) => statusFilter === "all" || a.status === statusFilter,
    ) ?? [];

  const statusBadge = (status: string): ReactNode => {
    if (status === "accepted")
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
          {t("employer.applications.statusAccepted")}
        </Badge>
      );
    if (status === "rejected")
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">
          {t("employer.applications.statusRejected")}
        </Badge>
      );
    return (
      <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50">
        {t("employer.applications.statusPending")}
      </Badge>
    );
  };

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-6 flex items-start gap-3">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="rounded-full mt-0.5 shrink-0"
        >
          <Link href="/employer/jobs">
            <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold tracking-tight">
            {t("employer.applications.title")}
          </h1>
          {job && (
            <p className="text-muted-foreground mt-0.5 truncate">{job.title}</p>
          )}
        </div>
        {applications && (
          <Badge variant="secondary" className="mt-1 shrink-0">
            {t("employer.applications.total", {
              count: applications.length,
            })}
          </Badge>
        )}
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {(["all", "pending", "accepted", "rejected"] as StatusFilter[]).map(
          (s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                statusFilter === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {t(`employer.applications.filter.${s}`)}
              {counts[s] > 0 && (
                <span
                  className={`text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 font-bold ${
                    statusFilter === s
                      ? "bg-white/20 text-white"
                      : "bg-background text-foreground"
                  }`}
                >
                  {counts[s]}
                </span>
              )}
            </button>
          ),
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-36 w-full rounded-xl" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((app) => (
            <ApplicationCard
              key={app.id}
              app={app}
              onAccept={() => handleUpdateStatus(app.id, "accepted")}
              onReject={() => handleUpdateStatus(app.id, "rejected")}
              isPending={updateStatusMutation.isPending}
              statusBadge={statusBadge}
              basePath={basePath}
              locale={locale}
              t={t}
            />
          ))}
        </div>
      ) : (
        <Card className="border-dashed bg-muted/20">
          <CardContent className="p-12 text-center flex flex-col items-center gap-3">
            <Users className="h-16 w-16 text-muted-foreground/30" />
            <h3 className="text-xl font-semibold">
              {statusFilter === "all"
                ? t("employer.applications.empty")
                : t("employer.applications.emptyFilter")}
            </h3>
            <p className="text-muted-foreground max-w-sm">
              {statusFilter === "all"
                ? t("employer.applications.emptyDesc")
                : t("employer.applications.emptyFilterDesc")}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

type CardProps = {
  app: EmployerApplication;
  onAccept: () => void;
  onReject: () => void;
  isPending: boolean;
  statusBadge: (s: string) => ReactNode;
  basePath: string;
  locale: Locale;
  t: (key: string, params?: Record<string, string | number>) => string;
};

function ApplicationCard({
  app,
  onAccept,
  onReject,
  isPending,
  statusBadge,
  basePath,
  locale,
  t,
}: CardProps) {
  const cvUrl = app.cvObjectPath
    ? `${basePath}/api/storage/objects/${app.cvObjectPath.replace(/^\/objects\//, "")}`
    : null;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-center justify-between px-5 py-3 bg-muted/30 border-b gap-3 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm">{app.applicantName}</span>
                {!app.seenByEmployer && (
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-[10px] py-0 px-1.5 hover:bg-blue-100">
                    {t("employer.applications.new")}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5 flex-wrap">
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {app.applicantEmail}
                </span>
                {app.applicantPhone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {app.applicantPhone}
                  </span>
                )}
                {app.applicantLocation && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {app.applicantLocation}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {format(new Date(app.createdAt), "MMM d, yyyy", { locale })}
            </span>
            {statusBadge(app.status)}
          </div>
        </div>

        <div className="px-5 py-4 space-y-3">
          {app.applicantBio && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {app.applicantBio}
            </p>
          )}

          {app.coverLetter && (
            <Accordion type="single" collapsible className="border rounded-lg">
              <AccordionItem value="cl" className="border-none">
                <AccordionTrigger className="px-4 py-2.5 text-sm font-medium hover:no-underline">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    {t("employer.applications.coverLetterLabel")}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-3 text-sm text-muted-foreground leading-relaxed">
                  {app.coverLetter}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
            <div>
              {cvUrl ? (
                <Button variant="outline" size="sm" asChild className="gap-2">
                  <a href={cvUrl} target="_blank" rel="noopener noreferrer" download>
                    <Download className="h-4 w-4" />
                    {t("employer.applications.downloadCv")}
                  </a>
                </Button>
              ) : (
                <span className="text-xs text-muted-foreground italic">
                  {t("employer.applications.noCv")}
                </span>
              )}
            </div>
            {app.status === "pending" && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={onReject}
                  disabled={isPending}
                >
                  <XCircle className="h-4 w-4" />
                  {t("employer.applications.reject")}
                </Button>
                <Button
                  size="sm"
                  className="gap-1.5 bg-green-600 text-white hover:bg-green-700"
                  onClick={onAccept}
                  disabled={isPending}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {t("employer.applications.accept")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
